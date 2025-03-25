import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Text, useTheme, Surface, IconButton, Menu } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Types
interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image';
  size: string;
  date: string;
  course: string;
}

const DocumentsScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');

  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Cours_1.pdf',
      type: 'pdf',
      size: '2.5 MB',
      date: '25/03/2024',
      course: 'INF314',
    },
    {
      id: '2',
      name: 'TP_1.pdf',
      type: 'pdf',
      size: '1.2 MB',
      date: '24/03/2024',
      course: 'INF314',
    },
    {
      id: '3',
      name: 'Notes.pdf',
      type: 'pdf',
      size: '3.1 MB',
      date: '23/03/2024',
      course: 'INF145',
    },
  ];

  const getFileIcon = (type: Document['type']) => {
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

  const renderDocumentItem = (document: Document) => (
    <Surface
      key={document.id}
      style={[
        styles.documentCard,
        { backgroundColor: colors.surface },
        viewMode === 'grid' && styles.documentCardGrid,
      ]}
      elevation={2}
    >
      <TouchableOpacity
        style={styles.documentContent}
        onPress={() => router.push(`/document/${document.id}`)}
      >
        <View style={[styles.documentIcon, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name={getFileIcon(document.type)} size={24} color={colors.primary} />
        </View>
        <View style={styles.documentInfo}>
          <Text style={[styles.documentName, { color: colors.text }]} numberOfLines={1}>
            {document.name}
          </Text>
          <Text style={[styles.documentMeta, { color: colors.text + '80' }]}>
            {document.course} • {document.size} • {document.date}
          </Text>
        </View>
      </TouchableOpacity>
    </Surface>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* En-tête */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Documents</Text>
        <View style={styles.headerActions}>
          <IconButton
            icon={viewMode === 'list' ? 'grid' : 'format-list-bulleted'}
            size={24}
            onPress={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            iconColor={colors.primary}
          />
          <Menu
            visible={sortMenuVisible}
            onDismiss={() => setSortMenuVisible(false)}
            anchor={
              <IconButton
                icon="sort"
                size={24}
                onPress={() => setSortMenuVisible(true)}
                iconColor={colors.primary}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setSortBy('date');
                setSortMenuVisible(false);
              }}
              title="Date"
              leadingIcon="calendar"
              disabled={sortBy === 'date'}
            />
            <Menu.Item
              onPress={() => {
                setSortBy('name');
                setSortMenuVisible(false);
              }}
              title="Nom"
              leadingIcon="sort-alphabetical"
              disabled={sortBy === 'name'}
            />
            <Menu.Item
              onPress={() => {
                setSortBy('size');
                setSortMenuVisible(false);
              }}
              title="Taille"
              leadingIcon="sort-numeric"
              disabled={sortBy === 'size'}
            />
          </Menu>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={[
          styles.documentsContainer,
          viewMode === 'grid' && styles.documentsGrid,
        ]}>
          {mockDocuments.map(renderDocumentItem)}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  documentsContainer: {
    padding: 16,
  },
  documentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  documentCard: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  documentCardGrid: {
    flex: 1,
    minWidth: '45%',
    marginBottom: 0,
  },
  documentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
  },
  documentMeta: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default DocumentsScreen; 