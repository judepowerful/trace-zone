import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  const [loaded] = useFonts({
    ZCOOLKuaiLe: require('../assets/fonts/ZCOOLKuaiLe-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' }
        }}
      />
      <StatusBar style="auto" />
    </>
  );
}
