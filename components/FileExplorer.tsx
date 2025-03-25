import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, IconButton, Surface, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

interface FileExplorerProps {
  items: Array<{
    name: string;
    path: string;
    isDirectory: boolean;
    size?: number;
    modificationTime?: Date;
  }>;
  currentPath: string;
  loading: boolean;
  onNavigateToDirectory: (path: string) => void;
  onNavigateUp: () => void;
  onDeleteItem: (path: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  items,
  currentPath,
  loading,
  onNavigateToDirectory,
  onNavigateUp,
  onDeleteItem,
}) => {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleDateString();
  };

  const renderItem = ({ item }: { item: FileExplorerProps['items'][0] }) => (
    <Surface style={styles.itemContainer} elevation={2}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => item.isDirectory && onNavigateToDirectory(item.path)}
      >
        <View style={styles.itemIcon}>
          <Ionicons
            name={item.isDirectory ? 'folder' : 'document'}
            size={24}
            color="#0A7EA4"
          />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemMeta}>
            {!item.isDirectory && formatFileSize(item.size)} • {formatDate(item.modificationTime)}
          </Text>
        </View>
        <IconButton
          icon="trash-outline"
          size={20}
          onPress={() => onDeleteItem(item.path)}
          iconColor="#FF4444"
        />
      </TouchableOpacity>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          size={24}
          onPress={onNavigateUp}
          disabled={currentPath === FileSystem.documentDirectory
            
          }
        />
        <Text style={styles.pathText} numberOfLines={1}>
          {currentPath}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0A7EA4" />
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.path}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pathText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  itemContainer: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0A7EA420',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 12,
    color: '#666',
  },
}); 