import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useAppearance } from '@/contexts/AppearanceContext';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenHeaderProps = {
  title: string;
};

export default function ScreenHeader({ title }: ScreenHeaderProps) {
  const router = useRouter();
  const { colors, textSize } = useAppearance();
  const styles = getStyles(colors, textSize);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <View style={styles.placeholder} />
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: any, textSize: number) => StyleSheet.create({
  safeArea: {
    backgroundColor: colors.surface,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 18 * textSize,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  placeholder: {
    width: 44, // Same size as backButton for balance
  },
});
