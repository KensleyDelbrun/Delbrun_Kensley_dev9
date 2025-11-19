import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, RefreshControl, FlatList, ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { Search } from 'lucide-react-native';
import CategoryCard from '@/components/CategoryCard';

type Category = {
  id: string;
  name_fr: string;
  name_ht: string;
  description_fr: string;
  description_ht: string;
  icon: string;
  color: string;
};

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { language, t } = useLanguage();
  const { colors, isDarkMode } = useAppearance();
  const router = useRouter();
  const styles = getStyles(colors, isDarkMode);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [searchQuery, categories, language]);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && data) {
      setCategories(data);
    }
  };

  const filterCategories = () => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = categories.filter((cat) => {
      const name = language === 'fr' ? cat.name_fr : cat.name_ht;
      const description = language === 'fr' ? cat.description_fr : cat.description_ht;
      return (
        name.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query)
      );
    });
    setFilteredCategories(filtered);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCategories();
    setRefreshing(false);
  }, []);

  const renderCategory: ListRenderItem<Category> = ({ item }) => (
    <CategoryCard
      name={language === 'fr' ? item.name_fr : item.name_ht}
      description={language === 'fr' ? item.description_fr : item.description_ht}
      icon={item.icon}
      color={item.color}
      onPress={() => router.push(`/category/${item.id}`)}
    />
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>
        {t('categories.noResults')}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.logo}>{t('login.title')}</Text>
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
            {t('categories.title')}
          </Text>
          <Text style={styles.subtitle}>
            {t('categories.subtitle')}
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Search color="#9CA3AF" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('categories.searchPlaceholder')}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredCategories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={searchQuery.trim() !== '' ? EmptyState : null}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContentContainer}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
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
  contentHeader: {
    paddingHorizontal: 20,
  },
  listContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleSection: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
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
    fontSize: 15,
    color: colors.text,
    paddingVertical: 8,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
