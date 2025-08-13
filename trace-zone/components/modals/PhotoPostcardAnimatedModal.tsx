import React, { useRef, useEffect, useState } from 'react';
import { Modal, View, Image, Text, StyleSheet, Animated, Pressable, Dimensions, ActivityIndicator } from 'react-native';

const { width } = Dimensions.get('window');

interface PhotoPostcardAnimatedModalProps {
  visible: boolean;
  imageSource: any;
  text: string;
  onClose: () => void;
}

const PhotoPostcardAnimatedModal: React.FC<PhotoPostcardAnimatedModalProps> = ({
  visible,
  imageSource,
  text,
  onClose
}) => {
  const [showModal, setShowModal] = useState(visible);
  const [imgLoaded, setImgLoaded] = useState(false);
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      setImgLoaded(false); // 每次打开都重置
      Animated.parallel([
        Animated.timing(scale, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scale, { toValue: 0.8, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        setShowModal(false); // 动画完成后再真正隐藏 Modal
      });
    }
  }, [visible]);

  if (!showModal) return null;

  return (
    <Modal transparent visible={showModal} animationType="none">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View 
          style={[
            styles.modalCard,
            { 
              transform: [{ scale }],
              opacity
            }
          ]}
        >
          <View style={{ width: '100%', height: 180, justifyContent: 'center', alignItems: 'center' }}>
            {!imgLoaded && (
              <ActivityIndicator size="large" color="#A0643D" style={{ position: 'absolute', zIndex: 1 }} />
            )}
            <Image
              source={imageSource}
              style={[styles.image, { opacity: imgLoaded ? 1 : 0 }]}
              onLoad={() => setImgLoaded(true)}
            />
          </View>
          <Text style={styles.text}>{text}</Text>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    width: width * 0.8,
    backgroundColor: '#FFF8F0',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#A0643D',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default PhotoPostcardAnimatedModal;
