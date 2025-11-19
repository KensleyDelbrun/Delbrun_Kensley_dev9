import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Book, Scale, Globe, FileText, Lightbulb, Newspaper } from 'lucide-react-native';

type CategoryCardProps = {
  name: string;
  description: string;
  icon: string;
  color: string;
  onPress: () => void;
};

const iconMap: Record<string, any> = {
  book: Book,
  scale: Scale,
  globe: Globe,
  'file-text': FileText,
  lightbulb: Lightbulb,
  newspaper: Newspaper,
};

export default function CategoryCard({ name, description, icon, color, onPress }: CategoryCardProps) {
  const IconComponent = iconMap[icon] || Book;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <IconComponent color={color} size={28} strokeWidth={2} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description} numberOfLines={1}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
});
