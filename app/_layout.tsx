import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import AppBootstrap from '../providers/AppBootstrap';

export default function RootLayout() {
  const [loaded] = useFonts({
    ZCOOLKuaiLe: require('../assets/fonts/ZCOOLKuaiLe-Regular.ttf'),
  });

  // Provider 集中初始化与订阅

  if (!loaded) {
    return null;
  }

  return (
    <AppBootstrap>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' }
        }}
      />
      <StatusBar style="auto" />
    </AppBootstrap>
  );
}
