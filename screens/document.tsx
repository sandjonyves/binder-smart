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
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

interface Asset {
  id: string;
  filename: string;
  uri: string;
  mediaType: string;
  duration: number;
  width: number;
  height: number;
  creationTime: number;
  modificationTime: number;
}

const DocumentScreen = () => {
  const [mediaPermission, setMediaPermission] = useState<boolean>(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const [currentAlbum, setCurrentAlbum] = useState<string | null>(null);

  // Demander les permissions
  const getPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      setMediaPermission(true);
    }
  };

  // Charger les albums
  const loadAlbums = async () => {
    try {
      const albums = await MediaLibrary.getAlbumsAsync();
      setAlbums(albums);
      
      // Obtenir l'espace de stockage disponible
      const { totalSpace, freeSpace } = await FileSystem.getFreeDiskStorageAsync();
      console.log('Espace total:', formatBytes(totalSpace));
      console.log('Espace libre:', formatBytes(freeSpace));
    } catch (error) {
      console.error('Erreur lors du chargement des albums:', error);
    }
  };

  // Charger les assets d'un album
  const loadAlbumAssets = async (albumId: string) => {
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({
        album: albumId,
        sortBy: ['creationTime'],
        mediaType: ['photo', 'video', 'audio']
      });
      setAssets(assets);
    } catch (error) {
      console.error('Erreur lors du chargement des assets:', error);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  useEffect(() => {
    if (mediaPermission) {
      loadAlbums();
    }
  }, [mediaPermission]);

  useEffect(() => {
    if (currentAlbum) {
      loadAlbumAssets(currentAlbum);
    } else {
      setAssets([]);
    }
  }, [currentAlbum]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const renderAlbum = ({ item }: { item: MediaLibrary.Album }) => (
    <TouchableOpacity
      style={styles.albumItem}
      onPress={() => setCurrentAlbum(item.id)}
    >
      <Ionicons name="folder" size={24} color="#FFD700" />
      <View style={styles.albumInfo}>
        <Text style={styles.albumName}>{item.title}</Text>
        <Text style={styles.albumCount}>{item.assetCount} éléments</Text>
      </View>
    </TouchableOpacity>
  );

  const renderAsset = ({ item }: { item: Asset }) => (
    <TouchableOpacity
      style={styles.assetItem}
      onPress={() => Alert.alert('Info', `Nom: ${item.filename}\nType: ${item.mediaType}`)}
    >
      <Ionicons
        name={item.mediaType === 'video' ? 'videocam' : 'image'}
        size={24}
        color="#808080"
      />
      <Text style={styles.assetName}>{item.filename}</Text>
    </TouchableOpacity>
  );

  if (!mediaPermission) {
    return (
      <View style={styles.container}>
        <Text>Permission d'accès aux médias requise</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={getPermissions}
        >
          <Text style={styles.permissionButtonText}>
            Autoriser l'accès
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentAlbum ? (
        <>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentAlbum(null)}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
            <Text style={styles.backButtonText}>Retour aux albums</Text>
          </TouchableOpacity>
          <FlatList
            data={assets}
            renderItem={renderAsset}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        </>
      ) : (
        <FlatList
          data={albums}
          renderItem={renderAlbum}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButtonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  albumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  albumInfo: {
    marginLeft: 10,
  },
  albumName: {
    fontSize: 16,
    fontWeight: '500',
  },
  albumCount: {
    fontSize: 12,
    color: '#666',
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  assetName: {
    marginLeft: 10,
    fontSize: 16,
  },
  permissionButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    marginHorizontal: 20,
  },
  permissionButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default DocumentScreen; 


