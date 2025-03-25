import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface SettingItemProps {
  icon: string;
  title: string;
  onPress: () => void;
  right?: React.ReactNode;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  onPress,
  right,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.leftContent}>
        <Ionicons name={icon} size={24} color="#666" />
        <Text style={styles.title}>{title}</Text>
      </View>
      {right || <Ionicons name="chevron-forward" size={24} color="#666" />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 16,
    fontSize: 16,
  },
}); 