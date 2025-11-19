import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useAppearance } from '@/contexts/AppearanceContext';
import { ChevronDown } from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionItemProps {
  title: string;
  content: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { textSize, colors } = useAppearance();
  const rotationAnim = useRef(new Animated.Value(0)).current;

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
    Animated.timing(rotationAnim, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const styles = getStyles(textSize, colors);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleAccordion} activeOpacity={0.8}>
        <Text style={styles.title}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <ChevronDown color={colors.textSecondary} size={20} />
        </Animated.View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.content}>
          <Text style={styles.contentText}>{content}</Text>
        </View>
      )}
    </View>
  );
};

const getStyles = (textSize: number, colors: any) => StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16 * textSize,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  contentText: {
    fontSize: 15 * textSize,
    color: colors.textSecondary,
    lineHeight: 22 * textSize,
  },
});

export default AccordionItem;
