import { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { RefreshControl } from 'react-native';

import { fetchRequestById, respondToRequest, getPendingRequestsForUser } from '../utils/requestApi';
import { markAllAsRead } from '../hooks/useUnreadCount';
import IncomingRequestModal from '../components/modals/IncomingRequestModal';

export default function MessagesScreen(){
  const [requests, setRequests] = useState<any[]>([]); // ✅ 自己维护
  const [refreshing, setRefreshing] = useState(false);
  const [activeRequest, setActiveRequest] = useState<any | null>(null);
  const [isResponding, setIsResponding] = useState(false);
  const [myNameInSpace, setMyNameInSpace] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // 刷新
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const latest = await getPendingRequestsForUser();
      setRequests(latest);
      markAllAsRead(latest);
    } catch (err) {
      Alert.alert('刷新失败', '请检查网络');
    } finally {
      setRefreshing(false);
    }
  };

  // 全部已读
  useEffect(() => {
    const load = async () => {
      try {
        const latest = await getPendingRequestsForUser();
        setRequests(latest);
        markAllAsRead(latest);
      } catch (e) {
        Alert.alert('加载失败', '请检查网络');
      }
    };
    load();
  }, []);


  //接受邀请
  const handleAccept = async () => {
    setIsResponding(true);
    try {
      const fresh = await fetchRequestById(activeRequest._id);
      if (!fresh || fresh.status !== 'pending') {
        Alert.alert('邀请已失效', '该邀请可能已被取消或处理');
        return;
      }
      await respondToRequest(activeRequest._id, 'accepted', myNameInSpace);
      const newList = requests.filter(r => r._id !== activeRequest._id);
      setRequests(newList);
      router.push('/space-home');
    } catch (e) {
      Alert.alert('❌ 接受失败', '请稍后再试');
    } finally {
      setIsResponding(false);
      setShowModal(false);
      setActiveRequest(null);
      setMyNameInSpace('');
    }
  };

  //拒绝邀请
  const handleReject = async () => {
    setIsResponding(true);
    try {
      const fresh = await fetchRequestById(activeRequest._id);
      if (!fresh || fresh.status !== 'pending') {
        Alert.alert('邀请已失效', '该邀请可能已被取消或处理');
        return;
      }
      await respondToRequest(activeRequest._id, 'rejected');
      const newList = requests.filter(r => r._id !== activeRequest._id);
      setRequests(newList);
    } catch (e) {
      Alert.alert('❌ 拒绝失败', '请稍后再试');
    } finally {
      setIsResponding(false);
      setShowModal(false);
      setActiveRequest(null);
      setMyNameInSpace('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← 返回</Text>
      </TouchableOpacity>
      <Text style={styles.header}>📮 小屋信箱</Text>
      <FlatList
        data={requests}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setActiveRequest(item);
              setShowModal(true);
            }}
          >
            <Text style={styles.cardText}>来自 {item.fromInviteCode} 的邀请: {item.message}</Text>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={<Text style={styles.empty}>暂无新消息，下拉刷新</Text>}
      />

      <IncomingRequestModal
        visible={showModal}
        request={activeRequest}
        onClose={() => {
          setShowModal(false);
        }}
        onDismiss={() => {
          setActiveRequest(null);     // ❗动画完成后再清空内容
          setMyNameInSpace('');
        }}
        onAccept={handleAccept}
        onReject={handleReject}
        isResponding={isResponding}
        myNameInSpace={myNameInSpace}
        setMyNameInSpace={setMyNameInSpace}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginHorizontal: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  backText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#FAFAFA',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#444',
    textAlign: 'center',
  },
  card: {
    marginHorizontal: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFF8F0',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FFE0B2',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  cardText: {
    fontSize: 14,
    color: '#5D4037',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
    color: '#888',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptBtn: {
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  rejectBtn: {
    backgroundColor: '#FFCDD2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  acceptText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  rejectText: {
    color: '#C62828',
    fontWeight: 'bold',
  },
});
