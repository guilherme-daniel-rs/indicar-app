import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from '@/navigation/AppNavigator';
import { ToastContainer } from '@/components/ToastContainer';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AppNavigator />
        <ToastContainer />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
