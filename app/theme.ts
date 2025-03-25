import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0A7EA4',
    secondary: '#03DAC6',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#000000',
    border: '#E1E1E1',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#0A7EA4',
    secondary: '#03DAC6',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    border: '#2C2C2C',
  },
}; 