import { View, Text, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { PaperProvider } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { lightTheme, darkTheme } from './theme'

export default function _layout() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (isSystemTheme) {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, isSystemTheme]);

  const loadThemePreference = async () => {
    try {
      const savedIsSystemTheme = await AsyncStorage.getItem('isSystemTheme');
      const savedIsDarkMode = await AsyncStorage.getItem('isDarkMode');
      
      if (savedIsSystemTheme !== null) {
        setIsSystemTheme(JSON.parse(savedIsSystemTheme));
      }
      if (savedIsDarkMode !== null) {
        setIsDarkMode(JSON.parse(savedIsDarkMode));
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

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