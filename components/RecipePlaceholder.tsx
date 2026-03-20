import React from 'react';
import { View, Text } from 'react-native';
import type { Category } from '@/types';

const categoryEmoji: Record<Category, string> = {
  Plat: '🍲',
  Entrée: '🥗',
  Sauce: '🫕',
  Accompagnement: '🍚',
  Boisson: '🥤',
  Grillade: '🔥',
  Dessert: '🍰',
};

const categoryColors: Record<Category, { bg: string; darkBg: string }> = {
  Plat: { bg: '#FED3C7', darkBg: '#3A2520' },
  Entrée: { bg: '#D1FFC8', darkBg: '#1A3A1A' },
  Sauce: { bg: '#FFE4C8', darkBg: '#3A2A1A' },
  Accompagnement: { bg: '#FFF3C8', darkBg: '#3A3520' },
  Boisson: { bg: '#C8E4FF', darkBg: '#1A2A3A' },
  Grillade: { bg: '#FFD1C8', darkBg: '#3A201A' },
  Dessert: { bg: '#F3C8FF', darkBg: '#2A1A3A' },
};

type Props = {
  category: Category;
  size?: number;
  isDark?: boolean;
};

export default function RecipePlaceholder({ category, size = 96, isDark = false }: Props) {
  const emoji = categoryEmoji[category] || '🍲';
  const colors = categoryColors[category] || categoryColors.Plat;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 3,
        backgroundColor: isDark ? colors.darkBg : colors.bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ fontSize: size * 0.4 }}>{emoji}</Text>
    </View>
  );
}
