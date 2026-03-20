import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/useToast';
import RecipeImage from './RecipeImage';
import type { Recipe } from '@/types';

type Props = {
  recipe: Recipe;
};

export default function SearchResultCard({ recipe }: Props) {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const router = useRouter();

  const difficultyColor =
    recipe.difficulty === 'Easy'
      ? { bg: 'rgba(10,106,29,0.1)', text: '#0A6A1D' }
      : recipe.difficulty === 'Hard'
        ? { bg: 'rgba(176,37,0,0.1)', text: '#B02500' }
        : { bg: 'rgba(145,71,0,0.1)', text: colors.accent };

  const difficultyLabel =
    recipe.difficulty === 'Easy' ? t('easy') : recipe.difficulty === 'Hard' ? t('hard') : t('medium');

  return (
    <TouchableOpacity
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      activeOpacity={0.8}
      style={{
        backgroundColor: isDark ? colors.card : '#FFFFFF',
        borderRadius: 32,
        padding: 16,
        gap: 24,
      }}>
      {/* Image area */}
      <View style={{ height: 128, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
        <RecipeImage recipeId={recipe.id} category={recipe.category} style={{ width: '100%', height: '100%' }} borderRadius={0} />
        {/* Favorite */}
        <TouchableOpacity
          onPress={() => { const was = isFavorite(recipe.id); toggleFavorite(recipe.id); toast(was ? 'Retiré des favoris' : 'Ajouté aux favoris', was ? 'custom' : 'heart'); }}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.8)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons
            name={isFavorite(recipe.id) ? 'heart' : 'heart-outline'}
            size={16}
            color={isFavorite(recipe.id) ? '#E74C3C' : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      {/* Info */}
      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, flex: 1 }}>
            {recipe.name}
          </Text>
          <View
            style={{
              backgroundColor: difficultyColor.bg,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 16,
            }}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: difficultyColor.text,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}>
              {difficultyLabel}
            </Text>
          </View>
        </View>
        <Text
          style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22 }}
          numberOfLines={2}>
          {recipe.description}
        </Text>
        {/* Meta */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingTop: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="time-outline" size={12} color={colors.textMuted} />
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.textMuted }}>
              {recipe.duration} min
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="flame-outline" size={12} color={colors.textMuted} />
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.textMuted }}>
              {recipe.spiciness === 'Mild' ? t('mild') : recipe.spiciness === 'Extra Hot' ? t('extraHot') : t('mediumSpice')}
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.accent }}>
              {t('viewRecipe')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
