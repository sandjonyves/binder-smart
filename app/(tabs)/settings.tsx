import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  useColorScheme,
} from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingItem = ({ icon, title, onPress, right }) => {
  const { colors } = useTheme();
  return (
    <TouchableRipple onPress={onPress}>
      <View style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <Ionicons name={icon} size={24} color={colors.primary} style={styles.icon} />
          <Text style={styles.settingText}>{title}</Text>
        </View>
        {right}
      </View>
    </TouchableRipple>
  );
};

const SettingsScreen = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(useColorScheme() === 'dark');
  const { colors } = useTheme();

  const renderSectionHeader = (title) => (
    <Text style={[styles.sectionHeader, { color: colors.primary }]}>{title}</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Paramètres</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Section Compte */}
        {renderSectionHeader('Compte')}
        <View style={styles.section}>
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
        <View style={styles.section}>
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
        <View style={styles.section}>
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
            title="Mode sombre"
            onPress={() => setDarkMode(!darkMode)}
            right={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                color={colors.primary}
              />
            }
          />
        </View>

        {/* Section À propos */}
        {renderSectionHeader('À propos')}
        <View style={styles.section}>
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
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
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
    borderBottomColor: '#f0f0f0',
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