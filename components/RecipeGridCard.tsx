import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '@/hooks/useTheme';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/useToast';
import RecipeImage from './RecipeImage';
import type { Recipe } from '@/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 48 - 24) / 2;

type Props = {
  recipe: Recipe;
};

export default function RecipeGridCard({ recipe }: Props) {
  const { colors, isDark } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      activeOpacity={0.8}
      style={{ width: CARD_WIDTH, marginBottom: 24 }}>
      {/* Image */}
      <View
        style={{
          width: CARD_WIDTH,
          height: CARD_WIDTH * 1.25,
          borderRadius: 32,
          overflow: 'hidden',
          backgroundColor: isDark ? '#2A2A2A' : '#EAE7E7',
        }}>
        <RecipeImage recipeId={recipe.id} category={recipe.category} imageUri={(recipe as any).imageUri} isDark={isDark} style={{ width: '100%', height: '100%' }} borderRadius={0} />
        {/* Favorite button */}
        <TouchableOpacity
          onPress={() => { const was = isFavorite(recipe.id); toggleFavorite(recipe.id); toast(was ? 'Retiré des favoris' : 'Ajouté aux favoris', was ? 'custom' : 'heart'); }}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.8)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons
            name={isFavorite(recipe.id) ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite(recipe.id) ? '#E74C3C' : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      {/* Title */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: colors.text,
          marginTop: 8,
        }}
        numberOfLines={1}>
        {recipe.name}
      </Text>
      {/* Region */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
        <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
        <Text style={{ fontSize: 14, color: colors.textSecondary }}>
          {recipe.region}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
