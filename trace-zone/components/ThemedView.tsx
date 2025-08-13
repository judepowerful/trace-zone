import { View, type ViewProps } from 'react-native';
import { Colors } from '@/constants/Colors';

export type ThemedViewProps = ViewProps & {
  backgroundColor?: string;
};

export function ThemedView({ style, backgroundColor = Colors.background, ...otherProps }: ThemedViewProps) {
  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
