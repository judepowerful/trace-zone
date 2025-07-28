import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { useSentRequestStatus } from '../hooks/useSentRequestStatus';
import SentRequestModal from '../components/modals/SentRequestModal';
import apiClient from '../utils/apiClient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUserStore } from '../stores/useUserStore';
import { useRequestStore } from '../stores/useRequestStore';
import { useAppInitialization } from '../hooks/useAppInitialization';

export default function HomeScreen() {
  const router = useRouter();
  const [showSentModal, setShowSentModal] = useState(false);
  const [isCancellingInvite, setIsCancellingInvite] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // stores
  const { 
    checking, 
    myCode, 
    hasSpace, 
    sentRequest, 
    setSentRequest,
  } = useUserStore();
  
  const {
    unreadCount
  } = useRequestStore();
  
  // 应用初始化（包含用户初始化）
  useAppInitialization();

  // 轮询查询发出邀请的状态
  useSentRequestStatus(sentRequest, hasSpace, setSentRequest, setAccepted);

  // ✅ loading 逻辑放这里
  if (checking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#C2185B" />
          <Text style={{ marginTop: 12, color: '#666' }}>痕迹小屋...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* 自己的门牌号 */}
      <View style={[styles.codeCard, styles.floatingCard]}>
        <Text style={styles.codeLabel}>🏡 我的小屋门牌号</Text>
        <View style={styles.codeRow}>
          <View style={styles.codeBoxRow}>
            <Text style={styles.codeBoxPrefix}>NO.</Text>
            {myCode.split('').map((char, idx) => (
              <View key={idx} style={styles.codeBox}>
                <Text style={styles.codeBoxText}>{char}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            onPress={async () => {
              await Clipboard.setStringAsync(myCode);
              Alert.alert('已复制', '门牌码已复制到剪贴板');
            }}
            style={styles.copyButton}
          >
            <Text style={styles.copyText}>复制</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* 信封图标 + New Badge */}
      <TouchableOpacity
        onPress={() => router.push('/message')}
        style={styles.envelopeButton}
      >
        <Icon name="mailbox-outline" size={32} color="#C2185B" />
        {unreadCount > 0 && (
          <View style={styles.badgeCircle}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
      {/* 痕迹小屋 */}
      <View style={styles.centerBox}>
        {/*
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />    */}
        <Text style={styles.title}>🌿 痕迹小屋</Text>
        <Text style={styles.subtitle}>与你的搭子分享小痕迹</Text>

        {/* 发出的邀请卡片 */}
        {!hasSpace && sentRequest && (
          <TouchableOpacity
            onPress={() => setShowSentModal(true)}
            style={[styles.inviteCard, { top: 140 }]}
          >
            <Text style={styles.inviteText}>
              📭 小屋「 {sentRequest?.spaceName} 」正在等待确认...
              <Text style={{ fontSize: 18 }}> ⋯</Text> {/* 三个点增强可点击感 */}
            </Text>
          </TouchableOpacity>
        )}

        {hasSpace ? ( // 如果有小屋
          <TouchableOpacity
            style={[styles.card, styles.startButton]}
            onPress={() => router.push('/space-home')}
          >
            <Text style={styles.cardText}>🚪 进入我的小屋</Text>
          </TouchableOpacity>
        ) : ( // 如果没有小屋
          <>
            <TouchableOpacity
              style={[
                styles.card,
                styles.startButton,
                sentRequest ? { opacity: 0.5 } : {},
              ]}
              disabled={!!sentRequest}
              onPress={() => {
                if (!sentRequest) router.push('/invite-space');
              }}
            >
              <Text style={styles.cardText}>📌 邀请共同搭建你的小屋</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
{/*
      <TouchableOpacity
        onPress={async () => {
          try {
            const userId = await AsyncStorage.getItem('userId'); // 先取出 userId
            await AsyncStorage.clear();                           // 清除所有缓存
            if (userId) {
              await AsyncStorage.setItem('userId', userId);       // 重新写入 userId
            }
            Alert.alert('清除成功', '除了身份，其它本地缓存都已清除');
          } catch (e) {
            Alert.alert('❌ 清除失败', '请稍后再试');
          }
        }}
      >
        <Text>🧹 清除所有缓存（保留身份）</Text>
      </TouchableOpacity>
*/}

      {/* 发出邀请的弹窗 */}
      {sentRequest && (
        <SentRequestModal
          visible={showSentModal}
          onClose={() => setShowSentModal(false)}
          onCancelInvite={async () => {
            setIsCancellingInvite(true);
            try {
              await apiClient.delete(`/api/requests/${sentRequest._id}`);
              setSentRequest(null);
              setShowSentModal(false);
              Alert.alert('✅ 已取消邀请');
            } catch (err) {
              Alert.alert('❌ 取消失败', '请稍后再试');
            } finally {
              setIsCancellingInvite(false);
            }
          }}
          isCancelling={isCancellingInvite}
          spaceName={sentRequest.spaceName ?? ''}
          myInviteCode={sentRequest.fromInviteCode ?? ''}
          targetInviteCode={sentRequest.toInviteCode ?? ''}
      />
      )}
      {accepted && (
        <Modal transparent animationType="fade" visible={accepted}>
          <View style={styles.modalBackground}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>🎉 恭喜！</Text>
              <Text style={styles.modalMessage}>对方已接受你的邀请，小屋已创建成功！</Text>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#C8E6C9' }]}
                onPress={() => {
                  setAccepted(false);
                  router.push('/space-home');
                }}
              >
                <Text style={{ fontWeight: 'bold', color: '#2E7D32' }}>🚪 进入我的小屋</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}


    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0E0', // 调整为更温暖的米色
    paddingHorizontal: 24,
  },
  floatingCard: {
    position: 'absolute',
    top: 30,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  codeCard: {
    marginTop: 30,
    marginHorizontal: 12,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FEF9F3', // 调整为更柔和的米色
    borderWidth: 1,
    borderColor: '#F3D1B0',
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.15, // 增加阴影强度
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  codeLabel: {
    fontSize: 14,
    color: '#A0643D', // 调整为更深的棕色
    marginBottom: 20,
  },
  codeBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  codeBoxPrefix: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A0643D',
    marginRight: 4,
  },
  codeBox: {
    width: 32,
    height: 40,
    borderWidth: 2,
    borderColor: '#A0643D',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF4E8',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  codeBoxText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#805B3D',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copyButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#E39880',
    borderRadius: 10,
    shadowColor: '#E0A487',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  copyText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#A0643D',
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#805B3D',
    marginTop: 8,
    marginBottom: 40,
  },
  card: {
    width: screenWidth - 48,
    paddingVertical: 18,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  startButton: {
    backgroundColor: '#FEF9F3', // 调整为更柔和的米色
  },
  joinButton: {
    backgroundColor: '#E0F8E9',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A0643D', // 调整为更深的棕色
  },
  inviteCard: {
    marginTop: 20,
    marginHorizontal: 12,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FEF9F3', // 调整为更柔和的米色
    borderWidth: 1,
    borderColor: '#F3D1B0',
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  inviteText: {
    fontSize: 14,
    color: '#A0643D',
    fontWeight: '600',
    flexShrink: 1,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#FEF9F3', // 调整为更柔和的米色
    padding: 24,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#A0643D',
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 20,
    color: '#805B3D',
  },
  modalBtns: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#E39880',
    shadowColor: '#E0A487',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  closeButton: {
    position: 'absolute',
    top: -12,
    right: -12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E39880',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  inputBox: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    width: '100%',
  },
  cancelInviteBtn: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#FEF9F3', // 调整为更柔和的米色
    borderRadius: 20,
    alignSelf: 'flex-end',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  cancelInviteText: {
    fontSize: 14,
    color: '#A0643D',
    fontWeight: 'bold',
  },
  envelopeButton: {
    position: 'absolute',
    right: 30,
    top: 200,
    padding: 10,
  },
  badgeCircle: {
    position: 'absolute',
    top: 4,
    right: -2,
    backgroundColor: '#E39880',
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
