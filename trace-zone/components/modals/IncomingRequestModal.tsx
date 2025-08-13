import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface Props {
  visible: boolean;
  request: any;
  onClose: () => void;
  onDismiss: () => void; // ✅ 新增
  onAccept: (nickname: string) => void;
  onReject: () => void;
  isResponding: boolean;
  myNameInSpace: string;
  setMyNameInSpace: (name: string) => void;
}

export default function IncomingRequestModal({
  visible,
  request,
  onClose,
  onAccept,
  onReject,
  isResponding,
  myNameInSpace,
  setMyNameInSpace,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.card}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>📨 {request?.fromInviteCode} 号邀请你共建「{request?.spaceName}」</Text>
          <Text style={styles.subtitle}>{request?.message}</Text>

          <Text style={styles.inputLabel}>👤 你在小屋中的昵称</Text>
          <TextInput
            placeholder="请输入你的昵称"
            value={myNameInSpace}
            onChangeText={setMyNameInSpace}
            style={styles.inputFancy}
            placeholderTextColor="#999"
          />
          <Text style={styles.inputHint}>这个名字将展示在你们共同的小屋中</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#F3D1B0', opacity: isResponding ? 0.6 : 1 }]}
              disabled={isResponding}
              onPress={onReject}
            >
              {isResponding ? (
                <ActivityIndicator color="#A0643D" size="small" />
              ) : (
                <Text style={[styles.buttonText, { color: '#A0643D' }]}>拒绝</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#E39880', opacity: isResponding || !myNameInSpace.trim() ? 0.6 : 1 }]}
              disabled={isResponding || !myNameInSpace.trim()}
              onPress={() => onAccept(myNameInSpace.trim())}
            >
              {isResponding ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={[styles.buttonText, { color: '#fff' }]}>接受</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FEF9F3', // 调整为更柔和的米色
    padding: 24,
    borderRadius: 20,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#A0643D',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#805B3D',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    color: '#A0643D',
    fontWeight: '600',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  inputFancy: {
    borderWidth: 2,
    borderColor: '#F3D1B0',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FEF4E8',
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    width: '100%',
    height: 48, // 固定高度
    color: '#805B3D',
  },
  inputHint: {
    fontSize: 12,
    color: '#A0643D',
    marginTop: 6,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center', // 确保内容居中
    minHeight: 48, // 固定最小高度
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#A0643D',
  },
});
