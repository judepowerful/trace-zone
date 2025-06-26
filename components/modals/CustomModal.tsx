import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function CustomModal({
  visible,
  title,
  message,
  type,
  onClose,
  onDismiss,
}: {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info' | null;
  onClose: () => void;
  onDismiss?: () => void;
}) {
  useEffect(() => {
    if (!visible && onDismiss) {
      // 等待 Modal 动画关闭后再触发（模拟延迟）
      const timeout = setTimeout(onDismiss, 200); // 200ms 动画时间
      return () => clearTimeout(timeout);
    }
  }, [visible]);

  const isError = type === 'error';
  const isSuccess = type === 'success';

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={[styles.icon, isError && styles.errorIcon, isSuccess && styles.successIcon]}>
            {isSuccess ? '🎉' : isError ? '❌' : 'ℹ️'}
          </Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>知道了</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
  successIcon: {
    color: '#4CAF50',
  },
  errorIcon: {
    color: '#F44336',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#C2185B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
