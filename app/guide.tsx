import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { ArrowLeft, Home, Bookmark, User, Search, Settings } from 'lucide-react-native';

export default function GuideScreen() {
  const { t } = useLanguage();
  const { textSize, colors, isDarkMode } = useAppearance();
  const router = useRouter();
  const styles = getStyles(textSize, colors, isDarkMode);

  const guideSections = [
    {
      icon: <Home color="#3B82F6" size={24} />,
      title: t('Navigation Principale', 'Navigasyon Prensipal'),
      content: t(
        "Utilisez la barre d'onglets en bas pour naviguer entre l'Accueil, les Catégories, vos articles Sauvegardés et votre Profil.",
        'Sèvi ak ba onglè ki anba a pou navige ant Akèy, Kategori, atik ou Sove yo ak Pwofil ou.'
      ),
    },
    {
      icon: <Bookmark color="#10B981" size={24} />,
      title: t('Lire et Sauvegarder', 'Li ak Sove'),
      content: t(
        "Appuyez sur un article pour le lire. Utilisez l'icône de marque-page en haut à droite pour le sauvegarder et y accéder plus tard, même hors ligne.",
        'Peze sou yon atik pou li li. Sèvi ak ikòn mak-paj ki anlè a dwat la pou sove li epi jwenn aksè a li pita, menm san koneksyon.'
      ),
    },
    {
      icon: <Search color="#F59E0B" size={24} />,
      title: t('Rechercher un Article', 'Chèche yon Atik'),
      content: t(
        "Sur l'écran d'accueil, utilisez la barre de recherche pour trouver rapidement des articles par mots-clés ou par titre.",
        'Sou ekran akèy la, sèvi ak ba rechèch la pou jwenn atik rapidman pa mo-kle oswa pa tit.'
      ),
    },
    {
      icon: <Settings color="#6366F1" size={24} />,
      title: t('Personnaliser l\'Apparence', 'Pèsonalize Aparans'),
      content: t(
        'Allez dans Profil > Paramètres pour ajuster la taille du texte. Le mode sombre sera bientôt disponible.',
        'Ale nan Pwofil > Paramèt pou ajiste gwosè tèks la. Mòd fènwa ap disponib byento.'
      ),
    },
    {
      icon: <User color="#EF4444" size={24} />,
      title: t('Gérer votre Profil', 'Jere Pwofil ou'),
      content: t(
        'Dans l\'onglet Profil, vous pouvez changer la langue, gérer les notifications, consulter l\'aide et vous déconnecter.',
        'Nan onglè Pwofil la, ou ka chanje lang, jere notifikasyon, konsilte èd epi dekonekte.'
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Guide de démarrage', 'Gid pou kòmanse')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.introText}>
          {t(
            'Bienvenue sur Citoyen Éclairé ! Voici un guide rapide pour vous aider à tirer le meilleur parti de l\'application.',
            'Byenveni sou Citoyen Éclairé ! Men yon gid rapid pou ede ou pwofite aplikasyon an.'
          )}
        </Text>

        {guideSections.map((section, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardIcon}>{section.icon}</View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{section.title}</Text>
              <Text style={styles.cardText}>{section.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18 * textSize,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    padding: 16,
  },
  introText: {
    fontSize: 15 * textSize,
    color: colors.textSecondary,
    lineHeight: 22 * textSize,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDarkMode ? 0.3 : 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17 * textSize,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14 * textSize,
    color: colors.textSecondary,
    lineHeight: 20 * textSize,
  },
});
