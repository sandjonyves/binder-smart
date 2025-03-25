import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  useColorScheme,
} from 'react-native';
import { Text, TouchableRipple, useTheme, Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingItem = ({ icon, title, onPress, right }) => {
  const { colors } = useTheme();
  return (
    <TouchableRipple onPress={onPress}>
      <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
        <View style={styles.settingLeft}>
          <Ionicons name={icon} size={24} color={colors.primary} style={styles.icon} />
          <Text style={[styles.settingText, { color: colors.text }]}>{title}</Text>
        </View>
        {right}
      </View>
    </TouchableRipple>
  );
};

const SettingsScreen = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const systemColorScheme = useColorScheme();
  const { colors } = useTheme();

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

  const saveThemePreference = async (systemTheme: boolean, darkMode: boolean) => {
    try {
      await AsyncStorage.setItem('isSystemTheme', JSON.stringify(systemTheme));
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(darkMode));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const handleThemeChange = (systemTheme: boolean, darkMode: boolean) => {
    setIsSystemTheme(systemTheme);
    setIsDarkMode(darkMode);
    saveThemePreference(systemTheme, darkMode);
  };

  const renderSectionHeader = (title) => (
    <Text style={[styles.sectionHeader, { color: colors.primary }]}>{title}</Text>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Paramètres</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Section Compte */}
        {renderSectionHeader('Compte')}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <SettingItem
            icon="person-outline"
            title="Profil"
            onPress={() => {}}
            right={<Ionicons name="chevron-forward" size={24} color={colors.text} />}
          />
          <SettingItem
            icon="shield-outline"
            title="Sécurité"
            onPress={() => {}}
            right={<Ionicons name="chevron-forward" size={24} color={colors.text} />}
          />
          <SettingItem
            icon="options-outline"
            title="Préférences"
            onPress={() => {}}
            right={<Ionicons name="chevron-forward" size={24} color={colors.text} />}
          />
        </View>

        {/* Section Notifications */}
        {renderSectionHeader('Notifications')}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <SettingItem
            icon="notifications-outline"
            title="Notifications Push"
            onPress={() => setPushNotifications(!pushNotifications)}
            right={
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                color={colors.primary}
              />
            }
          />
          <SettingItem
            icon="mail-outline"
            title="Notifications Email"
            onPress={() => setEmailNotifications(!emailNotifications)}
            right={
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                color={colors.primary}
              />
            }
          />
        </View>

        {/* Section Confidentialité */}
        {renderSectionHeader('Confidentialité')}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <SettingItem
            icon="lock-closed-outline"
            title="Autorisations"
            onPress={() => {}}
            right={<Ionicons name="chevron-forward" size={24} color={colors.text} />}
          />
          <SettingItem
            icon="eye-outline"
            title="Visibilité du profil"
            onPress={() => {}}
            right={<Ionicons name="chevron-forward" size={24} color={colors.text} />}
          />
          <SettingItem
            icon="moon-outline"
            title="Utiliser le thème système"
            onPress={() => handleThemeChange(!isSystemTheme, isDarkMode)}
            right={
              <Switch
                value={isSystemTheme}
                onValueChange={(value) => handleThemeChange(value, isDarkMode)}
                color={colors.primary}
              />
            }
          />
          {!isSystemTheme && (
            <SettingItem
              icon="moon-outline"
              title="Mode sombre"
              onPress={() => handleThemeChange(isSystemTheme, !isDarkMode)}
              right={
                <Switch
                  value={isDarkMode}
                  onValueChange={(value) => handleThemeChange(isSystemTheme, value)}
                  color={colors.primary}
                />
              }
            />
          )}
        </View>

        {/* Section À propos */}
        {renderSectionHeader('À propos')}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <SettingItem
            icon="information-circle-outline"
            title="Informations sur l'application"
            onPress={() => {}}
            right={<Ionicons name="chevron-forward" size={24} color={colors.text} />}
          />
          <SettingItem
            icon="help-circle-outline"
            title="Support"
            onPress={() => {}}
            right={<Ionicons name="chevron-forward" size={24} color={colors.text} />}
          />
          <SettingItem
            icon="document-text-outline"
            title="Conditions d'utilisation"
            onPress={() => {}}
            right={<Ionicons name="chevron-forward" size={24} color={colors.text} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
});

export default SettingsScreen; 