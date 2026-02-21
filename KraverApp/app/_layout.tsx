import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  initialRouteName: '(onboarding)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Onboarding Flow */}
        <Stack.Screen name="(onboarding)" />
        
        {/* Auth Flow */}
        <Stack.Screen name="(auth)" />
        
        {/* Main App */}
        <Stack.Screen name="(tabs)" />
        
        {/* Modal Screens */}
        <Stack.Screen 
          name="cafe/[id]" 
          options={{ presentation: 'card', headerShown: true, title: 'Cafe Details' }} 
        />
        <Stack.Screen 
          name="voucher/[id]" 
          options={{ presentation: 'modal', headerShown: true, title: 'Redeem Voucher' }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
