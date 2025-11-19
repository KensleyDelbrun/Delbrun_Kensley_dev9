import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, ListRenderItem, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { ArrowLeft, Search } from 'lucide-react-native';
import ArticleCard from '@/components/ArticleCard';

type Category = {
  id: string;
  name_fr: string;
  name_ht: string;
  description_fr: string;
  description_ht: string;
};

type Article = {
  id: string;
  title_fr: string;
  title_ht: string;
  summary_fr: string;
  summary_ht: string;
  image_url: string | null;
};

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();
  const { textSize, colors, isDarkMode } = useAppearance();
  const router = useRouter();
  const styles = getStyles(textSize, colors, isDarkMode);

  useEffect(() => {
    loadCategoryData();
  }, [id]);

  useEffect(() => {
    filterArticles();
  }, [searchQuery, articles, language]);

  const loadCategoryData = async () => {
    setLoading(true);

    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (!categoryError && categoryData) {
      setCategory(categoryData);
    }

    const { data: articlesData, error: articlesError } = await supabase
      .from('articles')
      .select('*')
      .eq('category_id', id)
      .order('published_at', { ascending: false });

    if (!articlesError && articlesData) {
      setArticles(articlesData);
    }

    setLoading(false);
  };

  const filterArticles = () => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = articles.filter((article) => {
      const title = language === 'fr' ? article.title_fr : article.title_ht;
      const summary = language === 'fr' ? article.summary_fr : article.summary_ht;
      return (
        title.toLowerCase().includes(query) ||
        summary.toLowerCase().includes(query)
      );
    });
    setFilteredArticles(filtered);
  };

  const renderArticle: ListRenderItem<Article> = ({ item }) => (
    <ArticleCard
      title={language === 'fr' ? item.title_fr : item.title_ht}
      summary={language === 'fr' ? item.summary_fr : item.summary_ht}
      imageUrl={item.image_url}
      onPress={() => router.push(`/article/${item.id}`)}
    />
  );

  const ListEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>
        {searchQuery.trim() !== ''
          ? t('categoryDetail.noResults')
          : t('categoryDetail.noArticles')}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!category) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {t('categoryDetail.notFound')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {language === 'fr' ? category.name_fr : category.name_ht}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>
          {language === 'fr' ? category?.name_fr : category?.name_ht}
        </Text>
        <Text style={styles.categoryDescription}>
          {language === 'fr' ? category?.description_fr : category?.description_ht}
        </Text>
      </View>

      <View style={styles.listControls}>
        {articles.length > 0 && (
          <View style={styles.searchContainer}>
            <Search color="#9CA3AF" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('categoryDetail.searchPlaceholder')}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        )}
        <View style={styles.articlesListHeader}>
          <Text style={styles.articlesCount}>
            {articles.length} {articles.length === 1 ? t('categoryDetail.article') : t('categoryDetail.articles')}
          </Text>
        </View>
      </View>

      <FlatList
        data={filteredArticles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16 * textSize,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16 * textSize,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  listContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categoryHeader: {
    backgroundColor: colors.surface,
    padding: 20,
  },
  categoryTitle: {
    fontSize: 28 * textSize,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  categoryDescription: {
    fontSize: 16 * textSize,
    color: colors.textSecondary,
    lineHeight: 24 * textSize,
  },
  listControls: {
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginTop: 20,
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
  articlesListHeader: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  articlesCount: {
    fontSize: 14 * textSize,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16 * textSize,
    color: colors.textSecondary,
  },
});
