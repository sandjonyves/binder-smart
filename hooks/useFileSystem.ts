import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

interface FileSystemItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  modificationTime?: Date;
}

export const useFileSystem = () => {
  const [currentPath, setCurrentPath] = useState(FileSystem.documentDirectory || '');
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadDirectory = async (path: string) => {
    try {
      setLoading(true);
      const directoryInfo = await FileSystem.getInfoAsync(path);
      
      if (directoryInfo.exists && directoryInfo.isDirectory) {
        const files = await FileSystem.readDirectoryAsync(path);
        const itemsWithInfo = await Promise.all(
          files.map(async (name) => {
            const fullPath = `${path}${name}`;
            const info = await FileSystem.getInfoAsync(fullPath);
            return {
              name,
              path: fullPath,
              isDirectory: info.isDirectory,
              size: info.size,
              modificationTime: info.modificationTime ? new Date(info.modificationTime) : undefined,
            };
          })
        );
        setItems(itemsWithInfo);
        setCurrentPath(path);
      }
    } catch (error) {
      console.error('Error loading directory:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToDirectory = async (path: string) => {
    await loadDirectory(path);
  };

  const navigateUp = async () => {
    const parentPath = currentPath.split('/').slice(0, -1).join('/');
    if (parentPath) {
      await loadDirectory(parentPath + '/');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: false,
      });

      if (result.type === 'success') {
        // Copier le fichier dans le répertoire de l'application
        const destination = `${currentPath}${result.name}`;
        await FileSystem.copyAsync({
          from: result.uri,
          to: destination,
        });
        await loadDirectory(currentPath);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const deleteItem = async (path: string) => {
    try {
      await FileSystem.deleteAsync(path, { idempotent: true });
      await loadDirectory(currentPath);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  useEffect(() => {
    loadDirectory(currentPath);
  }, []);

  return {
    currentPath,
    items,
    loading,
    navigateToDirectory,
    navigateUp,
    pickDocument,
    deleteItem,
  };
}; 