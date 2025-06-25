import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { ToastProvider } from 'react-native-toast-notifications';

export default function App() {
  const Container = Platform.OS === 'web' ? View : SafeAreaView;

  return (
    <Container
      style={styles.container}
      {...(Platform.OS !== 'web' ? { edges: ['top'] } : {})}
    >
      <ToastProvider>
        <RootNavigator />
      </ToastProvider>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});