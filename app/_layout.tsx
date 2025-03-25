import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { PaperProvider } from 'react-native-paper'
import { lightTheme, darkTheme } from './theme'
import { useTheme } from '../hooks/useTheme'

export default function _layout() {
  const { isDarkMode } = useTheme();

  return (
    <PaperProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
      </SafeAreaProvider>
    </PaperProvider>
  )
}