import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../types';

export const useTheme = () => {
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

  const handleThemeChange = async (systemTheme: boolean, darkMode: boolean) => {
    try {
      setIsSystemTheme(systemTheme);
      setIsDarkMode(darkMode);
      await AsyncStorage.setItem('isSystemTheme', JSON.stringify(systemTheme));
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(darkMode));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  return {
    isDarkMode,
    isSystemTheme,
    handleThemeChange,
  };
}; 