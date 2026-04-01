import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share } from 'react-native';
import * as ClipboardModule from 'expo-clipboard';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/useToast';
import { useTimer } from '@/context/TimerContext';
import { useLocalizedRecipes } from '@/hooks/useLocalizedRecipes';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { useShopping } from '@/context/ShoppingContext';
import { useVoiceControl } from '@/hooks/useVoiceControl';
import { useShakeGesture } from '@/hooks/useShakeGesture';
import { getRecipeVideos } from '@/constants/videos';
import * as Speech from 'expo-speech';
import RecipeImage from '@/components/RecipeImage';

type Tab = 'ingredients' | 'steps';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const { startTimer, isTimerRunning } = useTimer();
  const { userRecipes } = useUserRecipes();
  const { addItems } = useShopping();
  const recipes = useLocalizedRecipes();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('ingredients');
  const [servings, setServings] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isHandsFreeActive, setIsHandsFreeActive] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const recipe = useMemo(() => {
    return recipes.find((r) => r.id === id) ?? userRecipes.find((r) => r.id === id);
  }, [id, userRecipes, recipes]);

  useEffect(() => {
    if (recipe && servings === 0) {
      setServings(recipe.servings);
    }
  }, [recipe, servings]);

  if (!recipe) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.text }}>Recipe not found</Text>
      </SafeAreaView>
    );
  }

  const handleFavorite = () => {
    const wasFav = isFavorite(recipe.id);
    toggleFavorite(recipe.id);
    toast(wasFav ? 'Retiré des favoris' : 'Ajouté aux favoris', wasFav ? 'custom' : 'heart');
  };

  const buildRecipeText = (): string => {
    let text = `🍽️ ${recipe.name}\n`;
    text += `📍 ${recipe.region} | ⏱️ ${recipe.duration} min | 👥 ${recipe.servings} pers.\n\n`;
    text += `📝 ${recipe.description}\n\n`;
    text += `🛒 INGRÉDIENTS\n`;
    recipe.ingredients.forEach((ing) => {
      text += `  • ${ing.name} — ${ing.quantity}\n`;
    });
    text += `\n👨‍🍳 PRÉPARATION\n`;
    recipe.steps.forEach((step, i) => {
      text += `  ${i + 1}. ${step}\n`;
    });
    if (recipe.tips) {
      text += `\n💡 ASTUCE DU CHEF\n${recipe.tips}\n`;
    }
    const videos = getRecipeVideos(recipe.id);
    if (videos && videos.length > 0) {
      text += `\n🎥 VIDÉOS\n`;
      videos.forEach((v) => {
        text += `  ▶ ${v.title}\n    https://youtube.com/watch?v=${v.id}\n`;
      });
    }
    text += `\n— Partagé via Tchopé 🇨🇲 by https://tchope.lndev.me`;
    return text;
  };

  const handleShare = async () => {
    const text = buildRecipeText();
    try {
      const result = await Share.share({ message: text });
      if (result.action === Share.sharedAction) {
        toast('Recette partagée', 'done');
      }
    } catch {
      // Copy to clipboard as fallback
      ClipboardModule.setStringAsync(text);
      toast('Recette copiée', 'done');
    }
  };

  const handleStartCooking = () => {
    startTimer(recipe.name, recipe.duration);
    toast(`Timer lancé : ${recipe.duration} min`, 'done');
  };

  const handleAddToShopping = () => {
    const itemsToAdd = scaledIngredients.map((ing: { name: string; quantity: string }) => ({
      name: ing.name,
      quantity: ing.quantity,
      recipeName: recipe.name,
    }));
    addItems(itemsToAdd);
    toast('Articles ajoutés au panier', 'done');
  };

  const handleNextStep = useCallback(() => {
    if (currentStepIndex < recipe.steps.length - 1) {
      const next = currentStepIndex + 1;
      setCurrentStepIndex(next);
      speakStep(recipe.steps[next], next);
    }
  }, [currentStepIndex, recipe.steps, completedSteps]);

  const handlePrevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      const prev = currentStepIndex - 1;
      setCurrentStepIndex(prev);
      speakStep(recipe.steps[prev], prev);
    }
  }, [currentStepIndex, recipe.steps, completedSteps]);

  const handleRepeatStep = useCallback(() => {
    speakStep(recipe.steps[currentStepIndex], currentStepIndex);
  }, [currentStepIndex, recipe.steps, completedSteps]);

  const { isListening, toggleListening, lastTranscript } = useVoiceControl(
    {
      onNext: handleNextStep,
      onPrev: handlePrevStep,
      onRepeat: handleRepeatStep,
      onStop: () => setIsVoiceActive(false),
    },
    t('madeWith').includes('❤️') ? 'fr-FR' : 'en-US'
  );

  const handleToggleVoice = async () => {
    // @ts-ignore
    const VoiceModule = require('@react-native-voice/voice').default;
    if (!VoiceModule || typeof VoiceModule.start !== 'function') {
      toast('Micro indisponible sur cet appareil', 'custom');
      return;
    }

    if (isVoiceActive) {
      setIsVoiceActive(false);
    } else {
      setIsVoiceActive(true);
      setIsHandsFreeActive(false); // Only one "smart" mode at a time
    }
  };

  const { startShakeDetection, stopShakeDetection } = useShakeGesture(() => {
    handleNextStep();
    toast(t('shakeToNext'), 'done');
  });

  useEffect(() => {
    if (isHandsFreeActive) {
      startShakeDetection();
    } else {
      stopShakeDetection();
    }
    return () => stopShakeDetection();
  }, [isHandsFreeActive]);

  useEffect(() => {
    if (isVoiceActive && !isListening) {
      toggleListening();
    } else if (!isVoiceActive && isListening) {
      toggleListening();
    }
  }, [isVoiceActive, isListening, toggleListening]);

  const scaleIngredients = (ingredients: { name: string; quantity: string }[]) => {
    if (servings === recipe.servings) return ingredients;
    const ratio = servings / recipe.servings;

    return ingredients.map((ing) => {
      // Simple scaling for numeric quantities
      const match = ing.quantity.match(/^(\d+(\.\d+)?)(\s.*)?$/);
      if (match) {
        const value = parseFloat(match[1]);
        const scaledValue = Math.round(value * ratio * 10) / 10;
        const unit = match[3] || '';
        return { ...ing, quantity: `${scaledValue}${unit}` };
      }
      return ing;
    });
  };

  const speakStep = (text: string, index?: number) => {
    Speech.stop();
    Speech.speak(text, { language: t('madeWith').includes('❤️') ? 'fr' : 'en' });
    if (index !== undefined && !completedSteps.includes(index)) {
      setCompletedSteps([...completedSteps, index]);
    }
  };

  const scaledIngredients = useMemo(() => scaleIngredients(recipe.ingredients), [recipe.ingredients, servings]);

  const isUserCreated = userRecipes.some((r) => r.id === recipe.id);

  const difficultyLabel =
    recipe.difficulty === 'Easy' ? t('easy') : recipe.difficulty === 'Hard' ? t('hard') : t('medium');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 + bottom }} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={{ height: 350, overflow: 'hidden' }}>
          <RecipeImage recipeId={recipe.id} category={recipe.category} imageUri={(recipe as any).imageUri} isDark={isDark} style={{ width: '100%', height: '100%' }} borderRadius={0} />
          {/* Back + Share buttons */}
          <SafeAreaView
            edges={['top']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 24,
              paddingVertical: 16,
            }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: isDark ? 'rgba(26,26,26,0.8)' : 'rgba(255,255,255,0.9)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="arrow-back" size={20} color={isDark ? '#F5F5F5' : '#2F2F2E'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: isDark ? 'rgba(26,26,26,0.8)' : 'rgba(255,255,255,0.9)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Ionicons name="share-outline" size={20} color={isDark ? '#F5F5F5' : '#2F2F2E'} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Content Card */}
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            marginTop: -48,
            paddingTop: 32,
            paddingHorizontal: 24,
          }}>
          {/* Title + Actions */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 36, fontWeight: '800', color: colors.text, letterSpacing: -1.8, flex: 1 }}>
              {recipe.name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {isUserCreated && (
                <TouchableOpacity
                  onPress={() => router.push(`/add-recipe?edit=${recipe.id}` as any)}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: isDark ? 'rgba(175,173,172,0.15)' : 'rgba(175,173,172,0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Ionicons name="pencil-outline" size={20} color={colors.accent} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleFavorite}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: colors.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                }}>
                <Ionicons
                  name={isFavorite(recipe.id) ? 'heart' : 'heart-outline'}
                  size={25}
                  color={isFavorite(recipe.id) ? '#E74C3C' : colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Meta Bento Grid */}
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
            <View style={{ flex: 1, minWidth: '45%', backgroundColor: colors.surface, borderRadius: 32, padding: 16, alignItems: 'center', gap: 4 }}>
              <Ionicons name="time-outline" size={20} color={colors.accentOrange} />
              <Text style={{ fontSize: 12, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, textAlign: 'center' }}>
                {t('prepTime')}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
                {recipe.duration} min
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: '45%', backgroundColor: colors.surface, borderRadius: 32, padding: 16, alignItems: 'center', gap: 4 }}>
              <Ionicons name="speedometer-outline" size={20} color={colors.accentOrange} />
              <Text style={{ fontSize: 12, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, textAlign: 'center' }}>
                {t('difficulty')}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
                {difficultyLabel}
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: '45%', backgroundColor: colors.surface, borderRadius: 32, padding: 16, alignItems: 'center', gap: 4 }}>
              <Ionicons name="people-outline" size={20} color={colors.accentOrange} />
              <Text style={{ fontSize: 12, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.6, textAlign: 'center' }}>
                {t('portions')}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <TouchableOpacity onPress={() => setServings(Math.max(1, servings - 1))}>
                  <Ionicons name="remove-circle-outline" size={20} color={colors.accent} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
                  {servings}
                </Text>
                <TouchableOpacity onPress={() => setServings(servings + 1)}>
                  <Ionicons name="add-circle-outline" size={20} color={colors.accent} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={{ gap: 12, marginTop: 24 }}>
            {getRecipeVideos(recipe.id) && (
              <TouchableOpacity
                onPress={() => router.push(`/recipe-videos?id=${recipe.id}&name=${encodeURIComponent(recipe.name)}` as any)}
                activeOpacity={0.85}
                style={{
                  backgroundColor: isDark ? 'rgba(255,0,0,0.08)' : 'rgba(255,0,0,0.05)',
                  borderRadius: 20,
                  paddingVertical: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  borderWidth: 1.5,
                  borderColor: isDark ? 'rgba(255,0,0,0.2)' : 'rgba(255,0,0,0.15)',
                }}>
                <Ionicons name="logo-youtube" size={18} color="#FF0000" />
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>
                  {t('videoRecipe')}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleStartCooking}
              disabled={isTimerRunning}
              activeOpacity={0.85}
              style={{
                backgroundColor: isTimerRunning ? colors.surface : colors.accent,
                borderRadius: 20,
                paddingVertical: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}>
              <Ionicons
                name={isTimerRunning ? 'timer-outline' : 'play-circle-outline'}
                size={18}
                color={isTimerRunning ? colors.textMuted : '#FFFFFF'}
              />
              <Text style={{ fontSize: 14, fontWeight: '700', color: isTimerRunning ? colors.textMuted : '#FFFFFF' }}>
                {isTimerRunning ? 'Timer...' : t('startCooking')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Switcher */}
          <View
            style={{
              backgroundColor: isDark ? '#3A3A3A' : '#E4E2E1',
              borderRadius: 9999,
              padding: 6,
              flexDirection: 'row',
              marginTop: 20,
            }}>
            <TouchableOpacity
              onPress={() => setActiveTab('ingredients')}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 9999,
                backgroundColor: activeTab === 'ingredients' ? (isDark ? colors.card : '#FFFFFF') : 'transparent',
                alignItems: 'center',
                ...(activeTab === 'ingredients'
                  ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }
                  : {}),
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: activeTab === 'ingredients' ? '700' : '500',
                  color: activeTab === 'ingredients' ? colors.accent : colors.textSecondary,
                }}>
                {t('ingredients')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('steps')}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 9999,
                backgroundColor: activeTab === 'steps' ? (isDark ? colors.card : '#FFFFFF') : 'transparent',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: activeTab === 'steps' ? '700' : '500',
                  color: activeTab === 'steps' ? colors.accent : colors.textSecondary,
                }}>
                {t('steps')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={{ marginTop: 24, gap: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>
                {activeTab === 'ingredients' ? t('shoppingList') : t('steps')}
              </Text>
              {activeTab === 'steps' && (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsHandsFreeActive(!isHandsFreeActive);
                      if (!isHandsFreeActive) setIsVoiceActive(false);
                    }}
                    style={{
                      backgroundColor: isHandsFreeActive ? colors.accent : colors.surface,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                    <Ionicons name="hand-right-outline" size={16} color={isHandsFreeActive ? '#FFFFFF' : colors.accent} />
                    <Text style={{ fontSize: 12, color: isHandsFreeActive ? '#FFFFFF' : colors.accent, fontWeight: '700' }}>
                      {t('handsFreeMode')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleToggleVoice}
                    style={{
                      backgroundColor: isVoiceActive ? colors.accent : colors.surface,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                    <Ionicons name="mic-outline" size={16} color={isVoiceActive ? '#FFFFFF' : colors.accent} />
                    <Text style={{ fontSize: 12, color: isVoiceActive ? '#FFFFFF' : colors.accent, fontWeight: '700' }}>
                      {isVoiceActive ? t('voiceListen') : t('voiceControl')}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              {activeTab === 'ingredients' && (
                <TouchableOpacity
                  onPress={handleAddToShopping}
                  style={{
                    backgroundColor: colors.accent,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                  }}>
                  <Text style={{ fontSize: 12, color: '#FFFFFF', fontWeight: '700' }}>
                    {t('addToShopping')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {activeTab === 'ingredients' ? (
              <View style={{ gap: 12 }}>
                {scaledIngredients.map((ing, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: isDark ? colors.card : '#FFFFFF',
                      borderRadius: 32,
                      padding: 16,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: colors.ingredientBg,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16,
                      }}>
                      <Ionicons name="nutrition-outline" size={16} color={colors.accent} />
                    </View>
                    <Text style={{ flex: 1, fontSize: 16, fontWeight: '500', color: colors.text }}>
                      {ing.name}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: colors.accent }}>
                      {ing.quantity}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ gap: 24 }}>
                {recipe.steps.map((step, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      gap: 24,
                      opacity: isVoiceActive && index !== currentStepIndex ? 0.3 : 1,
                      backgroundColor: isVoiceActive && index === currentStepIndex ? colors.surface : 'transparent',
                      padding: isVoiceActive && index === currentStepIndex ? 16 : 0,
                      borderRadius: 24,
                    }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: completedSteps.includes(index) ? colors.green : (index === currentStepIndex && isVoiceActive ? colors.accent : colors.accent),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {completedSteps.includes(index) ? (
                        <Ionicons name="checkmark" size={24} color="#FFFFFF" />
                      ) : (
                        <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>
                          {index + 1}
                        </Text>
                      )}
                    </View>
                    <View style={{ flex: 1, paddingTop: 8, gap: 8 }}>
                      <Text style={{ 
                        fontSize: 16, 
                        color: completedSteps.includes(index) ? colors.textMuted : colors.textSecondary, 
                        lineHeight: 26, 
                        fontWeight: index === currentStepIndex && isVoiceActive ? '600' : '400',
                        textDecorationLine: completedSteps.includes(index) ? 'line-through' : 'none',
                        opacity: completedSteps.includes(index) ? 0.6 : 1,
                      }}>
                        {step}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setCurrentStepIndex(index);
                          speakStep(step, index);
                        }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                          alignSelf: 'flex-start',
                          backgroundColor: colors.surface,
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 12,
                        }}>
                        <Ionicons name="volume-medium-outline" size={16} color={colors.accent} />
                        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.accent }}>Écouter</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                {isVoiceActive && (
                  <View style={{ backgroundColor: colors.accent, borderRadius: 20, padding: 12, marginTop: 16, alignItems: 'center' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700', fontStyle: 'italic' }}>
                      "{lastTranscript || 'Dites \"Suivant\", \"Retour\" ou \"Stop\"'}"
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Chef's Tips */}
          {recipe.tips && (
            <View
              style={{
                marginTop: 32,
                backgroundColor: isDark ? 'rgba(157,248,152,0.1)' : 'rgba(157,248,152,0.3)',
                borderLeftWidth: 8,
                borderLeftColor: colors.green,
                borderRadius: 48,
                paddingLeft: 40,
                paddingRight: 32,
                paddingVertical: 32,
                gap: 16,
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Ionicons name="bulb-outline" size={22} color={colors.greenText} />
                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.greenText }}>
                  {t('chefTips')}
                </Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: '500', color: colors.greenText, lineHeight: 26 }}>
                {recipe.tips}
              </Text>
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}
