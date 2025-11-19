import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { useOrientation } from '@/hooks/useOrientation';
import { saveArticleOffline, removeArticleOffline, isArticleSavedOffline, getOfflineArticleById } from '@/lib/offlineStorage';
import { ArrowLeft, Bookmark } from 'lucide-react-native';

type Article = {
  id: string;
  category_id: string;
  title_fr: string;
  title_ht: string;
  content_fr: string;
  content_ht: string;
  summary_fr: string;
  summary_ht: string;
  image_url: string | null;
  published_at: string;
  category_name_fr?: string;
  category_name_ht?: string;
};

type Category = {
  name_fr: string;
  name_ht: string;
};

export default function ArticleDetailScreen() {
  const { id, offline } = useLocalSearchParams<{ id: string; offline?: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { textSize, colors, isDarkMode } = useAppearance();
  const { isLandscape, height } = useOrientation();
  const router = useRouter();
  const styles = getStyles(textSize, colors, isDarkMode, isLandscape, height);

  useEffect(() => {
    if (id) {
      loadArticle();
    }
  }, [id, offline]);

  useEffect(() => {
    if (article) {
      checkIfSaved();
    }
  }, [article]);

  const loadArticle = async () => {
    setLoading(true);

    if (offline === 'true') {
      const offlineArticle = await getOfflineArticleById(id!);
      if (offlineArticle) {
        setArticle(offlineArticle as Article);
        setCategory({
          name_fr: offlineArticle.category_name_fr || '',
          name_ht: offlineArticle.category_name_ht || '',
        });
      }
    } else {
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (!articleError && articleData) {
        setArticle(articleData);

        const { data: categoryData } = await supabase
          .from('categories')
          .select('name_fr, name_ht')
          .eq('id', articleData.category_id)
          .single();

        if (categoryData) {
          setCategory(categoryData);
        }
      }
    }
    setLoading(false);
  };

  const checkIfSaved = async () => {
    if (article) {
      const saved = await isArticleSavedOffline(article.id);
      setIsSaved(saved);
    }
  };

  const handleSaveToggle = async () => {
    if (!article) return;
    
    if (!user) {
      Alert.alert(
        t('common.error'),
        t('errors.loginToSave')
      );
      return;
    }

    setSaving(true);

    if (isSaved) {
      const result = await removeArticleOffline(article.id);
      if (result.success) {
        setIsSaved(false);
        // Attempt to sync with Supabase, but don't block UI if offline
        supabase
          .from('saved_articles')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', article.id)
          .then();
      }
    } else {
      const result = await saveArticleOffline(article, {
        fr: category?.name_fr || '',
        ht: category?.name_ht || '',
      });
      if (result.success) {
        setIsSaved(true);
        // Attempt to sync with Supabase, but don't block UI if offline
        supabase
          .from('saved_articles')
          .insert({
            user_id: user.id,
            article_id: article.id,
          })
          .then();

        Alert.alert(
          t('common.success'),
          t('article.savedOffline')
        );
      }
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </SafeAreaView>
    );
  }

  if (!article) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {t('errors.articleNotFound')}
          </Text>
          <Text style={styles.errorSubText}>
            {t('errors.checkConnection')}
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
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveToggle}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <Bookmark
              color={isSaved ? '#3B82F6' : '#9CA3AF'}
              size={24}
              fill={isSaved ? '#3B82F6' : 'transparent'}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {article.image_url && (
          <Image source={{ uri: article.image_url }} style={styles.image} resizeMode="cover" />
        )}

        <View style={styles.articleContent}>
          {category && (category.name_fr || category.name_ht) && (
            <Text style={styles.category}>
              {language === 'fr' ? category.name_fr : category.name_ht}
            </Text>
          )}

          <Text style={styles.title}>
            {language === 'fr' ? article.title_fr : article.title_ht}
          </Text>

          <Text style={styles.date}>
            {new Date(article.published_at).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'fr-HT', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.contentText}>
            {language === 'fr' ? article.content_fr : article.content_ht}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (textSize: number, colors: any, isDarkMode: boolean, isLandscape: boolean, screenHeight: number) => StyleSheet.create({
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
  saveButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18 * textSize,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 14 * textSize,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: isLandscape ? screenHeight * 0.6 : 250,
    backgroundColor: colors.border,
  },
  articleContent: {
    padding: 20,
    backgroundColor: colors.surface,
  },
  category: {
    fontSize: 12 * textSize,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  title: {
    fontSize: 26 * textSize,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 34 * textSize,
    marginBottom: 12,
  },
  date: {
    fontSize: 14 * textSize,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 20,
  },
  contentText: {
    fontSize: 16 * textSize,
    color: colors.text,
    lineHeight: 26 * textSize,
  },
});
