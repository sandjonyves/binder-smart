import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Device from 'expo-device';
import { Ionicons } from '@expo/vector-icons';

interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
}

interface StorageInfo {
  totalSpace: string;
  freeSpace: string;
  usedSpace: string;
}

const DocumentScreen = () => {
  const [currentPath, setCurrentPath] = useState<string>(FileSystem.documentDirectory || '');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);

  // Fonction pour convertir les bytes en format lisible
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Fonction pour obtenir les informations de stockage
  const getStorageInfo = async () => {
    try {
      const totalSpace = await FileSystem.getTotalDiskCapacityAsync();
      const freeSpace = await FileSystem.getFreeDiskStorageAsync();
      const usedSpace = totalSpace - freeSpace;

      setStorageInfo({
        totalSpace: formatBytes(totalSpace),
        freeSpace: formatBytes(freeSpace),
        usedSpace: formatBytes(usedSpace)
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des informations de stockage:', error);
    }
  };

  const loadFiles = async (path: string) => {
    try {
      const result = await FileSystem.readDirectoryAsync(path);
      const formattedFiles: FileItem[] = await Promise.all(
        result.map(async (name) => {
          const fullPath = path + (path.endsWith('/') ? '' : '/') + name;
          const info = await FileSystem.getInfoAsync(fullPath);
          return {
            name,
            path: fullPath,
            isDirectory: info.isDirectory || false,
            size: info.size || 0
          };
        })
      );
      setFiles(formattedFiles);
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'accéder à ce dossier");
    }
  };

  useEffect(() => {
    loadFiles(currentPath);
    getStorageInfo();
  }, [currentPath]);

  const handlePress = async (item: FileItem) => {
    if (item.isDirectory) {
      setPathHistory([...pathHistory, currentPath]);
      setCurrentPath(item.path);
    } else {
      Alert.alert(
        'Information fichier',
        `Nom: ${item.name}\nTaille: ${formatBytes(item.size || 0)}`
      );
    }
  };

  const handleBack = () => {
    if (pathHistory.length > 0) {
      const previousPath = pathHistory[pathHistory.length - 1];
      setPathHistory(pathHistory.slice(0, -1));
      setCurrentPath(previousPath);
    }
  };

  const renderItem = ({ item }: { item: FileItem }) => (
    <TouchableOpacity
      style={styles.fileItem}
      onPress={() => handlePress(item)}
    >
      <Ionicons
        name={item.isDirectory ? 'folder' : 'document'}
        size={24}
        color={item.isDirectory ? '#FFD700' : '#808080'}
      />
      <View style={styles.fileInfo}>
        <Text style={styles.fileName}>{item.name}</Text>
        {!item.isDirectory && (
          <Text style={styles.fileSize}>{formatBytes(item.size || 0)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Informations de stockage */}
      {storageInfo && (
        <View style={styles.storageInfo}>
          <Text style={styles.storageTitle}>Informations de stockage :</Text>
          <Text>Espace total : {storageInfo.totalSpace}</Text>
          <Text>Espace libre : {storageInfo.freeSpace}</Text>
          <Text>Espace utilisé : {storageInfo.usedSpace}</Text>
        </View>
      )}

      {pathHistory.length > 0 && (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      )}
      
      <Text style={styles.currentPath} numberOfLines={1}>
        {currentPath}
      </Text>
      
      <FlatList
        data={files}
        renderItem={renderItem}
        keyExtractor={(item) => item.path}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  storageInfo: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  storageTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  currentPath: {
    padding: 10,
    fontSize: 12,
    color: '#666',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  list: {
    flex: 1,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fileInfo: {
    flex: 1,
    marginLeft: 10,
  },
  fileName: {
    fontSize: 16,
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default DocumentScreen;
