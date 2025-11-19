import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Bookmark } from 'lucide-react-native';
import { useAppearance } from '@/contexts/AppearanceContext';
import { useOrientation } from '@/hooks/useOrientation';

type ArticleCardProps = {
  title: string;
  summary: string;
  imageUrl?: string | null;
  onPress: () => void;
  onSavePress?: () => void;
  isSaved?: boolean;
};

export default function ArticleCard({
  title,
  summary,
  imageUrl,
  onPress,
  onSavePress,
  isSaved = false,
}: ArticleCardProps) {
  const { textSize, colors, isDarkMode } = useAppearance();
  const { isLandscape } = useOrientation();
  const styles = getStyles(textSize, colors, isDarkMode, isLandscape);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.summary} numberOfLines={isLandscape ? 3 : 2}>
          {summary}
        </Text>
      </View>
      
      {onSavePress ? (
        <TouchableOpacity style={styles.saveButton} onPress={onSavePress} activeOpacity={0.7}>
          <Bookmark
            color={isSaved ? '#3B82F6' : '#9CA3AF'}
            size={20}
            fill={isSaved ? '#3B82F6' : 'transparent'}
          />
        </TouchableOpacity>
      ) : isSaved ? (
        <View style={styles.saveButton}>
          <Bookmark
            color={'#3B82F6'}
            size={20}
            fill={'#3B82F6'}
          />
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const getStyles = (textSize: number, colors: any, isDarkMode: boolean, isLandscape: boolean) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: isDarkMode ? '#000' : '#4B5563',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDarkMode ? 0.3 : 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: isDarkMode ? 1 : 0,
    borderColor: colors.border,
    flexDirection: isLandscape ? 'row' : 'column',
    height: isLandscape ? 140 : 'auto',
    marginBottom: 16,
  },
  image: {
    width: isLandscape ? 140 : '100%',
    height: isLandscape ? '100%' : 180,
    backgroundColor: colors.borderLight,
  },
  content: {
    padding: 16,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16 * textSize,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22 * textSize,
  },
  summary: {
    fontSize: 14 * textSize,
    color: colors.textSecondary,
    lineHeight: 20 * textSize,
  },
  saveButton: {
    position: 'absolute',
    top: isLandscape ? 12 : 148,
    right: 12,
    backgroundColor: colors.surface,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
