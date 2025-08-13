import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCancelInvite: () => void;
  isCancelling: boolean;
  spaceName: string;
  myInviteCode: string;
  targetInviteCode: string;
}

export default function SentRequestModal({
  visible,
  onClose,
  onCancelInvite,
  isCancelling,
  spaceName,
  myInviteCode,
  targetInviteCode,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.card}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>📭 等待接受邀请</Text>
          <Text style={styles.subtitle}>你的小屋正在等待对方确认</Text>


            <Text style={styles.houseName}>🏠 小屋名：{spaceName}</Text>
            <Text style={styles.tip}>邀请信已寄出，请耐心等待回应~</Text>
            <View style={styles.letterRow}>
            <View style={styles.userBox}>
                <Text style={styles.boxLabel}>你</Text>
                <Text style={styles.code}>{myInviteCode}</Text>
            </View>

            <Text style={styles.arrow}>--</Text>

            <View style={styles.userBox}>
                <Text style={styles.boxLabel}>对方</Text>
                <Text style={styles.code}>{targetInviteCode || '未知'}</Text>
            </View>
            </View>

          <TouchableOpacity
            onPress={onCancelInvite}
            style={[styles.cancelBtn, isCancelling && { opacity: 0.6 }]}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <ActivityIndicator color="#333" size="small" />
            ) : (
              <Text style={styles.cancelText}>取消</Text>
            )}
          </TouchableOpacity>
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
    alignItems: 'flex-start',
    elevation: 4,
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
    elevation: 2,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C62828',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  infoRow: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#444',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginTop: 2,
  },
  cancelBtn: {
    marginTop: 20,
    backgroundColor: '#FFEBEE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'center',
  },
  cancelText: {
    color: '#B00020',
    fontWeight: 'bold',
    fontSize: 15,
  },
  letterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    },
    userBox: {
    flex: 4,
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    },
    boxLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 2,
    },
    code: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    },
    name: {
    fontSize: 14,
    color: '#555',
    },
    arrow: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    color: '#888',
    },
    houseName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#C2185B',
    },
    tip: {
    fontSize: 13,
    color: '#777',
    marginBottom: 16,
    textAlign: 'center',
    },

});
