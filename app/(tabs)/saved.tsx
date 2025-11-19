import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, RefreshControl, TextInput, FlatList, ListRenderItem } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { getAllOfflineArticles, OfflineArticle } from '@/lib/offlineStorage';
import { Search } from 'lucide-react-native';
import ArticleCard from '@/components/ArticleCard';

export default function SavedScreen() {
  const [savedArticles, setSavedArticles] = useState<OfflineArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<OfflineArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { textSize, colors, isDarkMode } = useAppearance();
  const router = useRouter();
  const styles = getStyles(textSize, colors, isDarkMode);

  useFocusEffect(
    useCallback(() => {
      loadSavedArticles();
    }, [])
  );

  useEffect(() => {
    filterArticles();
  }, [searchQuery, savedArticles, language]);

  const loadSavedArticles = async () => {
    const articles = await getAllOfflineArticles();
    setSavedArticles(articles);
  };

  const filterArticles = () => {
    if (!searchQuery.trim()) {
      setFilteredArticles(savedArticles);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = savedArticles.filter((article) => {
      const title = language === 'fr' ? article.title_fr : article.title_ht;
      const summary = language === 'fr' ? article.summary_fr : article.summary_ht;
      return (
        title.toLowerCase().includes(query) ||
        summary.toLowerCase().includes(query)
      );
    });
    setFilteredArticles(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSavedArticles();
    setRefreshing(false);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.logo}>CITOYEN ÉCLAIRÉ</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>
            {t('saved.loginRequiredTitle')}
          </Text>
          <Text style={styles.emptyText}>
            {t('saved.loginRequiredMessage')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderArticle: ListRenderItem<OfflineArticle> = ({ item }) => (
    <ArticleCard
      title={language === 'fr' ? item.title_fr : item.title_ht}
      summary={language === 'fr' ? item.summary_fr : item.summary_ht}
      imageUrl={item.image_url}
      onPress={() => router.push({ pathname: `/article/${item.id}`, params: { offline: 'true' } })}
      isSaved={true}
    />
  );

  const ListEmpty = () => (
    <View style={styles.emptyState}>
      {savedArticles.length === 0 ? (
        <>
          <Text style={styles.emptyTitle}>
            {t('saved.emptyTitle')}
          </Text>
          <Text style={styles.emptyText}>
            {t('saved.emptyMessage')}
          </Text>
        </>
      ) : (
        <Text style={styles.emptyText}>
          {t('saved.noResults')}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.logo}>CITOYEN ÉCLAIRÉ</Text>
        <View style={styles.languageBadge}>
          <View style={styles.flagMini}>
            <View style={[styles.flagHalf, { backgroundColor: '#0038A8' }]} />
            <View style={[styles.flagHalf, { backgroundColor: '#D21034' }]} />
          </View>
          <Text style={styles.languageText}>{language === 'fr' ? 'FR' : 'HT'}</Text>
        </View>
      </View>

      <View style={styles.contentHeader}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            {t('saved.title')}
          </Text>
        </View>
        {savedArticles.length > 0 && (
          <View style={styles.searchContainer}>
            <Search color="#9CA3AF" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('saved.searchPlaceholder')}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        )}
      </View>

      <FlatList
        data={filteredArticles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContentContainer}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
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
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 16 * textSize,
    fontWeight: '700',
    color: colors.text,
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  flagMini: {
    flexDirection: 'row',
    width: 20,
    height: 12,
    marginRight: 6,
    overflow: 'hidden',
    borderRadius: 2,
  },
  flagHalf: {
    flex: 1,
  },
  languageText: {
    fontSize: 12 * textSize,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  contentHeader: {
    paddingHorizontal: 20,
  },
  listContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  titleSection: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24 * textSize,
    fontWeight: '700',
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15 * textSize,
    color: colors.text,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  emptyTitle: {
    fontSize: 18 * textSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15 * textSize,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
