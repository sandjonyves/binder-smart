import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Text, useTheme, Surface, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SearchScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches] = useState([
    'Cours INF314',
    'TP Programmation Web',
    'Base de données',
  ]);

  const renderSearchResult = (title: string, subtitle: string, date: string) => (
    <Surface
      key={title}
      style={[styles.resultCard, { backgroundColor: colors.surface }]}
      elevation={2}
    >
      <TouchableOpacity
        style={styles.resultContent}
        onPress={() => router.push('/document/1')}
      >
        <View style={styles.resultIcon}>
          <Ionicons name="document" size={24} color={colors.primary} />
        </View>
        <View style={styles.resultText}>
          <Text style={[styles.resultTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.resultSubtitle, { color: colors.text + '80' }]}>
            {subtitle}
          </Text>
        </View>
        <Text style={[styles.resultDate, { color: colors.text + '60' }]}>
          {date}
        </Text>
      </TouchableOpacity>
    </Surface>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Barre de recherche */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name="search" size={20} color={colors.text} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Rechercher un fichier..."
          placeholderTextColor={colors.text + '80'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <IconButton
            icon="close"
            size={20}
            onPress={() => setSearchQuery('')}
            iconColor={colors.text}
          />
        )}
      </View>

      <ScrollView style={styles.scrollView}>
        {searchQuery.length === 0 ? (
          <>
            {/* Recherches récentes */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Recherches récentes
              </Text>
              {recentSearches.map((search) => (
                <TouchableOpacity
                  key={search}
                  style={styles.recentSearchItem}
                  onPress={() => setSearchQuery(search)}
                >
                  <Ionicons name="time" size={20} color={colors.text + '80'} />
                  <Text style={[styles.recentSearchText, { color: colors.text }]}>
                    {search}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Suggestions */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Suggestions
              </Text>
              <View style={styles.suggestionsGrid}>
                {['Cours', 'TP', 'Examens', 'Notes'].map((suggestion) => (
                  <TouchableOpacity
                    key={suggestion}
                    style={[styles.suggestionChip, { backgroundColor: colors.surface }]}
                    onPress={() => setSearchQuery(suggestion)}
                  >
                    <Ionicons name="search" size={16} color={colors.primary} />
                    <Text style={[styles.suggestionText, { color: colors.text }]}>
                      {suggestion}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          // Résultats de recherche
          <View style={styles.section}>
            {renderSearchResult(
              'Cours INF314 - Programmation Web',
              'EC1 - Programmation Web',
              '25/03/2024'
            )}
            {renderSearchResult(
              'TP1 - Base de données',
              'EC2 - Base de données',
              '24/03/2024'
            )}
            {renderSearchResult(
              'Notes de cours INF314',
              'EC1 - Programmation Web',
              '23/03/2024'
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  recentSearchText: {
    fontSize: 16,
    marginLeft: 12,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 1,
  },
  suggestionText: {
    fontSize: 14,
    marginLeft: 8,
  },
  resultCard: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: {
    flex: 1,
    marginLeft: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  resultSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  resultDate: {
    fontSize: 12,
  },
});

export default SearchScreen; 