import { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  View
} from 'react-native';
import { useRouter } from 'expo-router';

import { fetchRequestById, respondToRequest, getPendingRequestsForUser } from '../features/requests/api/requestApi';
import { markAllAsRead } from '../features/requests/hooks/useUnreadCount';
import IncomingRequestModal from '../features/requests/components/IncomingRequestModal';
import { useUserStore } from '../features/user/store/useUserStore';
import { useRequestStore } from '../features/requests/store/useRequestStore';
import CustomModal from '../components/modals/CustomModal';

export default function MessagesScreen(){
  const requests = useRequestStore(state => state.requests);
  const setRequests = useRequestStore(state => state.setRequests);
  const [refreshing, setRefreshing] = useState(false);
  const [activeRequest, setActiveRequest] = useState<any | null>(null);
  const [isResponding, setIsResponding] = useState(false);
  const [myNameInSpace, setMyNameInSpace] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { updateSpaceStatus } = useUserStore();

  // 通知类统一弹窗
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [noticeType, setNoticeType] = useState<'success' | 'error' | 'info' | null>(null);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeMsg, setNoticeMsg] = useState('');

  // 请求变化时，标记已读
  useEffect(() => {
    markAllAsRead(requests);
  }, [requests]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const latest = await getPendingRequestsForUser();
      setRequests(latest);
      markAllAsRead(latest);
    } catch (err) {
      setNoticeType('error');
      setNoticeTitle('刷新失败');
      setNoticeMsg('请检查网络');
      setNoticeVisible(true);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAccept = async () => {
    setIsResponding(true);
    try {
      const fresh = await fetchRequestById(activeRequest._id);
      if (!fresh || fresh.status !== 'pending') {
        setNoticeType('error');
        setNoticeTitle('邀请已失效');
        setNoticeMsg('该邀请可能已被取消或处理');
        setNoticeVisible(true);
        return;
      }
      await respondToRequest(activeRequest._id, 'accepted', myNameInSpace);
      const newList = requests.filter(r => r._id !== activeRequest._id);
      setRequests(newList);
      
      // 更新空间状态，确保首页能正确显示
      await updateSpaceStatus();
      
      router.replace('/space-home');
    } catch (e) {
      setNoticeType('error');
      setNoticeTitle('接受失败');
      setNoticeMsg('请稍后再试');
      setNoticeVisible(true);
    } finally {
      setIsResponding(false);
      setShowModal(false);
      setActiveRequest(null);
      setMyNameInSpace('');
    }
  };

  const handleReject = async () => {
    setIsResponding(true);
    try {
      const fresh = await fetchRequestById(activeRequest._id);
      if (!fresh || fresh.status !== 'pending') {
        setNoticeType('error');
        setNoticeTitle('邀请已失效');
        setNoticeMsg('该邀请可能已被取消或处理');
        setNoticeVisible(true);
        return;
      }
      await respondToRequest(activeRequest._id, 'rejected');
      const newList = requests.filter(r => r._id !== activeRequest._id);
      setRequests(newList);
    } catch (e) {
      setNoticeType('error');
      setNoticeTitle('拒绝失败');
      setNoticeMsg('请稍后再试');
      setNoticeVisible(true);
    } finally {
      setIsResponding(false);
      setShowModal(false);
      setActiveRequest(null);
      setMyNameInSpace('');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/');
          }
        }}
        style={styles.backIcon}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Text style={{ fontSize: 20, color: '#A0643D' }}>←</Text>
      </TouchableOpacity>

      <Text style={styles.header}>📮 小屋信箱</Text>

      <FlatList
        data={requests}
        keyExtractor={item => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setActiveRequest(item);
              setShowModal(true);
            }}
          >
            <Text style={styles.cardText}>
              来自 <Text style={{ fontWeight: 'bold' }}>{item.fromInviteCode}</Text> 的邀请: {item.message}
            </Text>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>暂无新消息，下拉刷新</Text>
        }
      />

      <IncomingRequestModal
        visible={showModal}
        request={activeRequest}
        onClose={() => setShowModal(false)}
        onDismiss={() => {
          setActiveRequest(null);
          setMyNameInSpace('');
        }}
        onAccept={handleAccept}
        onReject={handleReject}
        isResponding={isResponding}
        myNameInSpace={myNameInSpace}
        setMyNameInSpace={setMyNameInSpace}
      />

      <CustomModal
        visible={noticeVisible}
        type={noticeType}
        title={noticeTitle}
        message={noticeMsg}
        onClose={() => setNoticeVisible(false)}
        onDismiss={() => {
          setNoticeType(null);
          setNoticeTitle('');
          setNoticeMsg('');
        }}
        dismissOnBackdropPress
        autoCloseMs={0}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF0E0' },
  backIcon: {
    marginHorizontal: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFF8EF',
    borderRadius: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A0643D',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#FEF4E8',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F3D1B0',
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardText: {
    fontSize: 14,
    color: '#5D4037',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
    color: '#A0643D',
  },
});
