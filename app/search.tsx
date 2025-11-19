import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Search } from 'lucide-react-native';

import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import ArticleCard from '@/components/ArticleCard';

type Article = {
  id: string;
  title_fr: string;
  title_ht: string;
  summary_fr: string;
  summary_ht: string;
  image_url: string | null;
};

export default function SearchScreen() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { textSize, colors, isDarkMode } = useAppearance();
  
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setError(null);

    const { data, error: searchError } = await supabase
      .from('articles')
      .select('id, title_fr, title_ht, summary_fr, summary_ht, image_url')
      .or(`title_fr.ilike.%${searchQuery}%,title_ht.ilike.%${searchQuery}%,summary_fr.ilike.%${searchQuery}%,summary_ht.ilike.%${searchQuery}%`)
      .limit(20);

    if (searchError) {
      setError(t('Une erreur est survenue lors de la recherche.', 'Yon erè te fèt pandan rechèch la.'));
      console.error('Search error:', searchError.message);
    } else {
      setResults(data || []);
    }
    setLoading(false);
  }, [t]);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const styles = getStyles(textSize, colors, isDarkMode);

  const renderArticle: ListRenderItem<Article> = ({ item }) => (
    <View style={{ marginBottom: 16 }}>
        <ArticleCard
          title={language === 'fr' ? item.title_fr : item.title_ht}
          summary={language === 'fr' ? item.summary_fr : item.summary_ht}
          imageUrl={item.image_url}
          onPress={() => router.push(`/article/${item.id}`)}
        />
    </View>
  );

  const renderEmptyState = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />;
    }
    if (error) {
      return <Text style={styles.messageText}>{error}</Text>;
    }
    if (hasSearched && results.length === 0) {
      return <Text style={styles.messageText}>{t('Aucun résultat trouvé pour', 'Pa gen rezilta yo te jwenn pou')} "{debouncedQuery}"</Text>;
    }
    if (!hasSearched && !query) {
        return (
            <View style={styles.emptyContainer}>
                <Search size={48} color={colors.textSecondary} />
                <Text style={styles.emptyTitle}>{t('Rechercher des articles', 'Chèche atik yo')}</Text>
                <Text style={styles.emptySubtitle}>{t('Trouvez des informations sur la constitution, les institutions, et plus encore.', 'Jwenn enfòmasyon sou konstitisyon an, enstitisyon yo, ak plis ankò.')}</Text>
            </View>
        )
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search color={colors.textSecondary} size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('Rechercher un sujet...', 'Chèche yon sijè...')}
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={() => performSearch(query)}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton}>
              <X color={colors.textSecondary} size={18} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>{t('Annuler', 'Anile')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={results}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const getStyles = (textSize: number, colors: any, isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? colors.border : '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 15 * textSize,
    color: colors.text,
  },
  clearButton: {
    padding: 4,
  },
  cancelButton: {
    marginLeft: 12,
    padding: 8,
  },
  cancelButtonText: {
    fontSize: 16 * textSize,
    color: colors.primary,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 18 * textSize,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14 * textSize,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  messageText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16 * textSize,
    color: colors.textSecondary,
    paddingHorizontal: 20,
  },
});
