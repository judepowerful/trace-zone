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
import apiClient from '../shared/api/client';
import { useUserStatus } from '../features/user/hooks/useUserStatus';
import CustomModal from '../components/modals/CustomModal';
import { useSafeBack } from '../shared/hooks/useSafeBack';
import InputWithLimit from '../components/InputWithLimit';
import { Colors, ColorSchemes } from '../constants/Colors';
import { useUserStore } from '../features/user/store/useUserStore';

export default function InviteSpace() {
  const router = useRouter();
  const safeBack = useSafeBack();
  const [targetInviteCode, setTargetInviteCode] = useState('');
  const [spaceName, setSpaceName] = useState('');
  const [myNameInSpace, setMyNameInSpace] = useState('');
  const [customMessage, setCustomMessage] = useState('一起打造一个我们的小天地吧！');
  const [sending, setSending] = useState(false);
  const { sentRequest } = useUserStatus();
  const setGlobalSentRequest = useUserStore(state => state.setSentRequest);
  
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

    if (trimmedMsg.length > 100) {
      setModalType('error');
      setModalMsg('留言内容不能超过 100 个字');
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
      const res = await apiClient.post('/api/requests', {
        toInviteCode: trimmedCode,
        message: trimmedMsg,
        spaceName: trimmedSpace,
        fromUserName: trimmedName,
      });
      // 立即更新全局 sentRequest，返回首页即可显示“等待对方接受”
      setGlobalSentRequest(res.data);

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
        <Text style={styles.title}>🚪 送出邀请函</Text>
        <Text style={styles.subtitle}>填写信息，向对方发出邀请</Text>

        <View style={styles.card}>
          <Text style={styles.label}>🧬 门牌号</Text>
          <TextInput
            placeholder="例如：6767F2"
            value={targetInviteCode}
            onChangeText={setTargetInviteCode}
            style={styles.input}
            placeholderTextColor={Colors.text.placeholder}
          />
          <Text style={styles.label}>✏️ 小屋名称</Text>
          <InputWithLimit
            value={spaceName}
            onChangeText={setSpaceName}
            maxLength={12}
            placeholder="例如：我们的秘密基地"
          />
          <Text style={styles.label}>📇 你的名字</Text>
          <InputWithLimit
            value={myNameInSpace}
            onChangeText={setMyNameInSpace}
            maxLength={10}
            placeholder="例如：小禹 / 小琪"
          />
          <Text style={styles.label}>💬 说点什么...</Text>
          <InputWithLimit
            value={customMessage}
            onChangeText={setCustomMessage}
            maxLength={100}
            multiline
            placeholder="写点什么让对方更有感觉吧..."
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.sendBtn, sending && { opacity: 0.6 }]}
              onPress={handleSend}
              disabled={sending}
            >
              <Text style={styles.sendText}>{sending ? '🚀 发送中...' : '寄出'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.backHomeBtn}
          onPress={safeBack}
        >
          <Text style={styles.backHomeText}>🏃舍弃</Text>
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
    backgroundColor: Colors.background, // 使用统一的背景色
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
    marginBottom: 8,
    color: Colors.text.primary, // 使用主要文字颜色
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: ColorSchemes.card.background, // 使用卡片背景色
    borderRadius: 24,
    padding: 24,
    elevation: 2,
    shadowColor: ColorSchemes.card.shadow, // 使用统一的阴影色
    shadowOpacity: 0.15, // 增加阴影强度，与其他页面保持一致
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: ColorSchemes.card.border, // 添加边框，与其他页面保持一致
  }, 
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: Colors.text.primary, // 使用主要文字颜色
    fontWeight: '600', // 增加字重，提升视觉层次
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: ColorSchemes.input.border, // 使用输入框边框色
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: ColorSchemes.input.background, // 使用输入框背景色
    color: ColorSchemes.input.text, // 使用输入框文字色
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  sendBtn: {
    backgroundColor: Colors.brand, // 使用品牌色，与首页保持一致
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: Colors.shadow.dark, // 使用深色阴影
    shadowOpacity: 0.15, // 增加阴影强度
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3, // 增加阴影
    minWidth: 200, // 设置最小宽度
  },
  sendText: {
    color: Colors.text.white, // 使用白色文字
    fontSize: 17,
    fontWeight: '700',
  },
  backHomeBtn: {
    marginTop: 30,
    backgroundColor: ColorSchemes.button.secondary.background, // 使用次要按钮背景色
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: ColorSchemes.button.secondary.shadow, // 使用次要按钮阴影色
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  backHomeText: {
    fontSize: 15,
    color: ColorSchemes.button.secondary.text, // 使用次要按钮文字色
    fontWeight: '600', // 增加字重
  },
});
