import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { Text, useTheme, IconButton, Surface, Badge } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFileSystem } from '@/hooks/useFileSystem';
import * as FileSystem from 'expo-file-system';

// Types
interface Course {
  id: string;
  name: string;
  units: Unit[];
}

interface Unit {
  id: string;
  name: string;
  files: File[];
}

interface File {
  id: string;
  name: string;
  date: string;
  size: string;
}

// Données de démonstration
const mockCourses: Course[] = [
  {
    id: '1',
    name: 'INF314',
    units: [
      {
        id: '1-1',
        name: 'EC1 - Programmation Web',
        files: [
          { id: '1-1-1', name: 'Cours_1.pdf', date: '2024-03-25', size: '2.5 MB' },
          { id: '1-1-2', name: 'TP_1.pdf', date: '2024-03-24', size: '1.2 MB' },
        ],
      },
      {
        id: '1-2',
        name: 'EC2 - Base de données',
        files: [
          { id: '1-2-1', name: 'Cours_2.pdf', date: '2024-03-23', size: '3.1 MB' },
        ],
      },
    ],
  },
  // Autres cours similaires...
];

const HomeScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [newFilesCount, setNewFilesCount] = useState(3);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const renderCourseCard = (course: Course) => {
    const isSelected = selectedCourse === course.id;
    return (
      <Surface
        key={course.id}
        style={[
          styles.courseCard,
          {
            backgroundColor: colors.surface,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
        elevation={isSelected ? 4 : 1}
      >
        <TouchableOpacity
          onPress={() => setSelectedCourse(isSelected ? null : course.id)}
          style={styles.courseHeader}
        >
          <View style={styles.courseTitleContainer}>
            <Ionicons name="folder" size={24} color={colors.primary} />
            <Text style={[styles.courseTitle, { color: colors.text }]}>
              {course.name}
            </Text>
          </View>
          <Ionicons
            name={isSelected ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>

        {isSelected && (
          <Animated.View
            entering={Animated.FadeIn}
            exiting={Animated.FadeOut}
            style={styles.unitsContainer}
          >
            {course.units.map((unit) => (
              <View key={unit.id} style={styles.unitItem}>
                <View style={styles.unitHeader}>
                  <Ionicons name="document-text" size={20} color={colors.primary} />
                  <Text style={[styles.unitTitle, { color: colors.text }]}>
                    {unit.name}
                  </Text>
                </View>
                <View style={styles.filesList}>
                  {unit.files.map((file) => (
                    <TouchableOpacity
                      key={file.id}
                      style={styles.fileItem}
                      onPress={() => router.push(`/document/${file.id}`)}
                    >
                      <Ionicons name="document" size={16} color={colors.text} />
                      <Text style={[styles.fileName, { color: colors.text }]}>
                        {file.name}
                      </Text>
                      <Text style={[styles.fileDate, { color: colors.text }]}>
                        {file.date}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </Animated.View>
        )}
      </Surface>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* En-tête */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Ionicons name="book" size={32} color={colors.primary} />
            <Text style={[styles.appTitle, { color: colors.text }]}>BinderSmart</Text>
          </View>
          <IconButton
            icon="bell"
            size={24}
            iconColor={colors.primary}
            onPress={() => router.push('/notifications')}
          />
          <Badge
            visible={newFilesCount > 0}
            size={20}
            style={[styles.badge, { backgroundColor: colors.primary }]}
          >
            {newFilesCount}
          </Badge>
        </View>
        <Text style={[styles.welcomeText, { color: colors.text }]}>
          Bonjour, bienvenue sur BinderSmart !
        </Text>
      </View>

      {/* Barre de recherche */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name="search" size={20} color={colors.text} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Rechercher un fichier..."
          placeholderTextColor={colors.text + '80'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Derniers fichiers */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Derniers fichiers ajoutés
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockCourses[0].units[0].files.map((file) => (
              <TouchableOpacity
                key={file.id}
                style={[styles.recentFileCard, { backgroundColor: colors.surface }]}
                onPress={() => router.push(`/document/${file.id}`)}
              >
                <Ionicons name="document" size={24} color={colors.primary} />
                <Text style={[styles.recentFileName, { color: colors.text }]}>
                  {file.name}
                </Text>
                <Text style={[styles.recentFileDate, { color: colors.text }]}>
                  {file.date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Liste des cours */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Mes cours
          </Text>
          {mockCourses.map(renderCourseCard)}
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
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  welcomeText: {
    fontSize: 16,
    opacity: 0.8,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  recentFileCard: {
    width: 160,
    padding: 16,
    marginRight: 16,
    borderRadius: 8,
    elevation: 2,
  },
  recentFileName: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  recentFileDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  courseCard: {
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  courseTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  unitsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  unitItem: {
    marginBottom: 16,
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  unitTitle: {
    fontSize: 16,
    marginLeft: 8,
  },
  filesList: {
    marginLeft: 28,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  fileName: {
    flex: 1,
    marginLeft: 8,
  },
  fileDate: {
    fontSize: 12,
    opacity: 0.7,
    marginLeft: 8,
  },
});

export default HomeScreen; 