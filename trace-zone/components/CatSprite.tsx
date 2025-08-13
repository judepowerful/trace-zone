import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';

type CatAction = 'sad' | 'happy' | 'sleep';

interface CatSpriteProps {
  action: CatAction;
  size?: number;
}

const SPRITE_CONFIG = {
  source: require('../assets/cats/FreeCats.png'),
  frameWidth: 64,
  frameHeight: 64,
  columns: 4,
  rows: 3,
  animations: {
    sad: [0, 1, 2, 3],
    happy: [4, 5],
    sleep: [8, 9, 10, 11],
  } as Record<CatAction, number[]>,
  fps: 6,
};

export default function CatSprite({ action, size = 64 }: CatSpriteProps) {
  const { source, frameWidth, frameHeight, columns, rows, animations, fps } = SPRITE_CONFIG;
  const frames = animations[action];
  const [frameIdx, setFrameIdx] = useState(0);

  useEffect(() => {
    setFrameIdx(0);
    const timer = setInterval(() => {
      setFrameIdx(prev => (prev + 1) % frames.length);
    }, 1000 / fps);
    return () => clearInterval(timer);
  }, [action, frames.length, fps]);

  const frame = frames[frameIdx];
  const row = Math.floor(frame / columns);
  const col = frame % columns;

  const scale = size / frameWidth;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={source}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: frameWidth * columns,
          height: frameHeight * rows,
          transform: [
            { translateX: -col * frameWidth * scale },
            { translateY: -row * frameHeight * scale },
            { scale },
          ],
        }}
        resizeMode="cover"
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
