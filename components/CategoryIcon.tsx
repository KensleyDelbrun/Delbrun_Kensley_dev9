import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Book, Scale, Globe, FileText, Lightbulb, Newspaper } from 'lucide-react-native';

type CategoryIconProps = {
  name: string;
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

export default function CategoryIcon({ name, icon, color, onPress }: CategoryIconProps) {
  const IconComponent = iconMap[icon] || Book;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconCircle, { backgroundColor: color }]}>
        <IconComponent color="#FFFFFF" size={24} strokeWidth={2} />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
    marginRight: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});
