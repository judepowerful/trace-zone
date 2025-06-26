import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import apiClient from '../utils/apiClient'; // ✅ 引入统一 apiClient
import { useUserStatus } from '../hooks/useUserStatus';
import CustomModal from '../components/modals/CustomModal';
import { useSafeBack } from '../hooks/useSafeBack';
import InputWithLimit from '../components/InputWithLimit';

export default function InviteSpace() {
  const router = useRouter();
  const safeBack = useSafeBack();
  const [targetInviteCode, setTargetInviteCode] = useState('');
  const [spaceName, setSpaceName] = useState('');
  const [myNameInSpace, setMyNameInSpace] = useState('');
  const [customMessage, setCustomMessage] = useState('🏡 一起打造一个我们的小天地吧！');
  const [sending, setSending] = useState(false);
  const { sentRequest } = useUserStatus();
  
  // 在组件中添加状态
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error' | null>(null);
  const [modalMsg, setModalMsg] = useState('');


  useEffect(() => {
      if (sentRequest) {
        Alert.alert('操作无效', '你已经发出了一个邀请，请等待对方回应或取消当前邀请。');
        router.replace('/'); // 返回首页
      }
  }, [sentRequest]);

  const handleSend = async () => {
    const trimmedCode = targetInviteCode.trim();
    const trimmedName = myNameInSpace.trim();
    const trimmedSpace = spaceName.trim();
    const trimmedMsg = customMessage.trim();

    if (!trimmedCode || !trimmedSpace || !trimmedName || !trimmedMsg) {
      setModalType('error');
      setModalMsg('请填写完整信息');
      setModalVisible(true);
      return;
    }

    if (trimmedSpace.length > 12) {
      setModalType('error');
      setModalMsg('小屋名称不能超过 12 个字');
      setModalVisible(true);
      return;
    }

    if (trimmedName.length > 10) {
      setModalType('error');
      setModalMsg('你的昵称不能超过 10 个字');
      setModalVisible(true);
      return;
    }

    if (trimmedMsg.length > 50) {
      setModalType('error');
      setModalMsg('留言内容不能超过 50 个字');
      setModalVisible(true);
      return;
    }

    if (!/^[A-Z0-9]{6,10}$/i.test(trimmedCode)) {
      setModalType('error');
      setModalMsg('门牌号格式错误，应为 6~10 位字母或数字');
      setModalVisible(true);
      return;
    }

    setSending(true);
    try {
      await apiClient.post('/api/requests', {
        toInviteCode: trimmedCode,
        message: trimmedMsg,
        spaceName: trimmedSpace,
        fromUserName: trimmedName,
      });

      setModalType('success');
      setModalMsg('等待对方接受后你们将自动建立小屋');
      setModalVisible(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        (err?.response?.status === 409
          ? '你已经发送过邀请，请等待回应'
          : '发送失败，请稍后再试');

      setModalType('error');
      setModalMsg(msg);
      setModalVisible(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>🚪 邀请搭建小屋</Text>

        <View style={styles.card}>
          <Text style={styles.label}>🧬 对方的门牌号</Text>
          <TextInput
            placeholder="例如：6767F2"
            value={targetInviteCode}
            onChangeText={setTargetInviteCode}
            style={styles.input}
            placeholderTextColor="#999"
          />
          <Text style={styles.label}>✏️ 小屋名称</Text>
          <InputWithLimit
            value={spaceName}
            onChangeText={setSpaceName}
            maxLength={12}
            placeholder="例如：我们的秘密基地"
          />

          <Text style={styles.label}>📇 你在小屋中的名字</Text>
          <InputWithLimit
            value={myNameInSpace}
            onChangeText={setMyNameInSpace}
            maxLength={10}
            placeholder="例如：小禹 / 小琪"
          />

          <Text style={styles.label}>💬 留言</Text>
          <InputWithLimit
            value={customMessage}
            onChangeText={setCustomMessage}
            maxLength={50}
            multiline
            placeholder="写点什么让对方更有感觉吧..."
          />

          <TouchableOpacity
            style={[styles.sendBtn, sending && { opacity: 0.6 }]}
            onPress={handleSend}
            disabled={sending}
          >
            <Text style={styles.sendText}>{sending ? '🚀 发送中...' : '📩 发送邀请'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backHomeBtn}
          onPress={safeBack}
        >
          <Text style={styles.backHomeText}>🏃‍♂️ 离开小屋，返回首页</Text>
        </TouchableOpacity>
      </ScrollView>
      <CustomModal
        visible={modalVisible}
        type={modalType}
        title={modalType === 'success' ? '发送成功' : '发送失败'}
        message={modalMsg}
        onClose={() => {
          setModalVisible(false); // 🧼 先隐藏
        }}
        onDismiss={() => {
          // ✅ 等动画结束后再清理状态
          setModalType(null);
          setModalMsg('');
          if (modalType === 'success') {
            safeBack();
          }
        }}
      />


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#444',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#333',
    marginBottom: 20,
  },
  sendBtn: {
    marginTop: 10,
    backgroundColor: '#C2185B',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  sendText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  backHomeBtn: {
    marginTop: 30,
    backgroundColor: '#EEEEEE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  backHomeText: {
    fontSize: 15,
    color: '#555',
  },
});
