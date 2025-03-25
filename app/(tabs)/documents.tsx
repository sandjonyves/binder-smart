import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import RNFS from 'react-native-fs';
import { Ionicons } from '@expo/vector-icons';

interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
}

const DocumentScreen = () => {
  const [currentPath, setCurrentPath] = useState<string>(RNFS.ExternalStorageDirectoryPath);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [pathHistory, setPathHistory] = useState<string[]>([]);

  // Fonction pour demander la permission sur Android
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Permission d\'accès au stockage',
            message: 'Cette application a besoin d\'accéder aux fichiers de votre téléphone.',
            buttonNeutral: 'Demander plus tard',
            buttonNegative: 'Refuser',
            buttonPositive: 'Accepter',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Fonction pour charger les fichiers du dossier actuel
  const loadFiles = async (path: string) => {
    try {
      const results = await RNFS.readDir(path);
      const formattedFiles: FileItem[] = results.map((file) => ({
        name: file.name,
        path: file.path,
        isDirectory: file.isDirectory(),
        size: file.size || 0,
      }));
      setFiles(formattedFiles);
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'accéder à ce dossier");
    }
  };

  useEffect(() => {
    (async () => {
      const hasPermission = await requestPermission();
      if (hasPermission) {
        loadFiles(currentPath);
      } else {
        Alert.alert("Permission refusée", "L'accès aux fichiers est requis.");
      }
    })();
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

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const renderItem = ({ item }: { item: FileItem }) => (
    <TouchableOpacity style={styles.fileItem} onPress={() => handlePress(item)}>
      <Ionicons
        name={item.isDirectory ? 'folder' : 'document'}
        size={24}
        color={item.isDirectory ? '#FFD700' : '#808080'}
      />
      <View style={styles.fileInfo}>
        <Text style={styles.fileName}>{item.name}</Text>
        {!item.isDirectory && <Text style={styles.fileSize}>{formatBytes(item.size || 0)}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
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
