declare module '@kaizer433/react-native-spritesheet' {
  import React from 'react';
  import { ImageSourcePropType } from 'react-native';

  export interface SpriteSheetProps {
    source: ImageSourcePropType;
    columns: number;
    rows: number;
    height: number;
    width: number;
    animations: Record<string, number[]>;
    viewStyle?: object;
    imageStyle?: object;
    onLoad?: () => void;
    onError?: () => void;
  }

  export default class SpriteSheet extends React.Component<SpriteSheetProps> {
    play: (animationName: string, onFinish?: () => void) => void;
    stop: () => void;
  }
}
