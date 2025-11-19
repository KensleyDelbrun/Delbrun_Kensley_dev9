import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, FlatList, ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { useOrientation } from '@/hooks/useOrientation';
import { Search } from 'lucide-react-native';
import CategoryIcon from '@/components/CategoryIcon';
import ArticleCard from '@/components/ArticleCard';

type Category = {
  id: string;
  name_fr: string;
  name_ht: string;
  icon: string;
  color: string;
};

type Article = {
  id: string;
  title_fr: string;
  title_ht: string;
  summary_fr: string;
  summary_ht: string;
  image_url: string | null;
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { language, t } = useLanguage();
  const { textSize, colors, isDarkMode } = useAppearance();
  const { isLandscape } = useOrientation();
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadCategories(), loadFeaturedArticles()]);
  };

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && data) {
      setCategories(data);
    }
  };

  const loadFeaturedArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title_fr, title_ht, summary_fr, summary_ht, image_url');

    if (error) {
      console.error('Error fetching articles:', error.message);
    } else if (data) {
      const randomArticles = shuffleArray(data).slice(0, 4);
      setFeaturedArticles(randomArticles);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const styles = getStyles(textSize, colors, isDarkMode, isLandscape);

  const renderArticle: ListRenderItem<Article> = ({ item }) => (
    <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
      <ArticleCard
        title={language === 'fr' ? item.title_fr : item.title_ht}
        summary={language === 'fr' ? item.summary_fr : item.summary_ht}
        imageUrl={item.image_url}
        onPress={() => router.push(`/article/${item.id}`)}
      />
    </View>
  );

  const ListHeader = () => (
    <>
      <TouchableOpacity
        style={styles.searchBar}
        activeOpacity={0.7}
        onPress={() => router.push('/search')}
      >
        <Search color="#9CA3AF" size={20} />
        <Text style={styles.searchPlaceholder}>
          {t('home.searchPlaceholder')}
        </Text>
      </TouchableOpacity>

      {categories.length > 0 && (
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {categories.map((category) => (
              <CategoryIcon
                key={category.id}
                name={language === 'fr' ? category.name_fr : category.name_ht}
                icon={category.icon}
                color={category.color}
                onPress={() => router.push(`/category/${category.id}`)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t('home.featuredNews')}
        </Text>
      </View>
    </>
  );

  const ListFooter = () => (
    <>
      {categories.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('home.exploreByTheme')}
          </Text>
          <View style={styles.themesGrid}>
            <TouchableOpacity
              style={[styles.themeCard, { backgroundColor: '#FDF2F8' }]}
              onPress={() => router.push(`/category/${categories[0]?.id}`)}
            >
              <Text style={styles.themeTitle}>
                {t('home.themeConstitution')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeCard, { backgroundColor: '#EFF6FF' }]}
              onPress={() => router.push(`/category/${categories[1]?.id}`)}
            >
              <Text style={styles.themeTitle}>
                {t('home.themeInstitutions')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeCard, { backgroundColor: '#F0FDF4' }]}
              onPress={() => router.push(`/category/${categories[4]?.id}`)}
            >
              <Text style={styles.themeTitle}>
                {t('home.themeCulture')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeCard, { backgroundColor: '#FEF3C7' }]}
              onPress={() => router.push(`/category/${categories[2]?.id}`)}
            >
              <Text style={styles.themeTitle}>
                {t('home.themeEnvironment')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>CITOYEN ÉCLAIRÉ</Text>
          <View style={styles.languageBadge}>
            <View style={styles.flagMini}>
              <View style={[styles.flagHalf, { backgroundColor: '#0038A8' }]} />
              <View style={[styles.flagHalf, { backgroundColor: '#D21034' }]} />
            </View>
            <Text style={styles.languageText}>{language === 'fr' ? 'FR' : 'HT'}</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={featuredArticles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

const getStyles = (textSize: number, colors: any, isDarkMode: boolean, isLandscape: boolean) => StyleSheet.create({
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
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 16,
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
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 15 * textSize,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18 * textSize,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  themeCard: {
    flexGrow: 1,
    flexBasis: isLandscape ? '22%' : '45%',
    aspectRatio: 1.5,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  themeTitle: {
    fontSize: 15 * textSize,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
});
