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
              style={[styles.button, { backgroundColor: '#D6F0FF', opacity: isResponding ? 0.6 : 1 }]}
              disabled={isResponding}
              onPress={onReject}
            >
              {isResponding ? (
                <ActivityIndicator color="#333" size="small" />
              ) : (
                <Text style={styles.buttonText}>拒绝</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#FFDEDE', opacity: isResponding || !myNameInSpace.trim() ? 0.6 : 1 }]}
              disabled={isResponding || !myNameInSpace.trim()}
              onPress={() => onAccept(myNameInSpace.trim())}
            >
              {isResponding ? (
                <ActivityIndicator color="#333" size="small" />
              ) : (
                <Text style={styles.buttonText}>接受</Text>
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
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    elevation: 5,
    alignItems: 'flex-start',
  },
  closeButton: {
    position: 'absolute',
    top: -12,
    right: -12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFCDD2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C62828',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#444',
    fontWeight: '600',
    marginBottom: 6,
  },
  inputFancy: {
    borderWidth: 1.5,
    borderColor: '#aaa',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    width: '100%',
  },
  inputHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
});
