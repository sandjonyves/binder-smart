import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { File } from '../types';

interface FileCardProps {
  file: File;
  onPress: (id: string) => void;
  viewMode?: 'list' | 'grid';
}

export const FileCard: React.FC<FileCardProps> = ({ file, onPress, viewMode = 'list' }) => {
  const getFileIcon = (type: File['type']) => {
    switch (type) {
      case 'pdf':
        return 'document-text';
      case 'doc':
        return 'document';
      case 'image':
        return 'image';
      default:
        return 'document';
    }
  };

  return (
    <Surface
      style={[
        styles.documentCard,
        viewMode === 'grid' && styles.documentCardGrid,
      ]}
      elevation={2}
    >
      <TouchableOpacity
        style={styles.documentContent}
        onPress={() => onPress(file.id)}
      >
        <View style={styles.documentIcon}>
          <Ionicons name={getFileIcon(file.type)} size={24} color="#0A7EA4" />
        </View>
        <View style={styles.documentInfo}>
          <Text style={styles.documentName} numberOfLines={1}>
            {file.name}
          </Text>
          <Text style={styles.documentMeta}>
            {file.course} • {file.size} • {file.date}
          </Text>
        </View>
      </TouchableOpacity>
    </Surface>
  );
};

const styles = StyleSheet.create({
  documentCard: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  documentCardGrid: {
    flex: 1,
    margin: 8,
  },
  documentContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0A7EA420',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  documentMeta: {
    fontSize: 12,
    opacity: 0.7,
  },
}); 