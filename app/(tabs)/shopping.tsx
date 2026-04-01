import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useShopping } from '@/context/ShoppingContext';
import EmptyState from '@/components/EmptyState';

export default function ShoppingScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const { items, toggleItem, removeItem, clearAll } = useShopping();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {/* Header */}
      <View style={{ paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.accent, letterSpacing: -1.2 }}>
          Tchopé
        </Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearAll} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="trash-outline" size={16} color={colors.textSecondary} />
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>{t('clearShopping')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 + bottom, paddingHorizontal: 24, gap: 24 }}
        showsVerticalScrollIndicator={false}>
        <View style={{ gap: 4 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
            }}>
            {t('tabShopping')}
          </Text>
          <Text style={{ fontSize: 36, fontWeight: '800', color: colors.text, letterSpacing: -0.9 }}>
            {t('shoppingListTitle')}
          </Text>
        </View>

        {items.length > 0 ? (
          <View style={{ gap: 12 }}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleItem(item.id)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: isDark ? colors.card : '#FFFFFF',
                  borderRadius: 24,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                }}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: item.checked ? colors.accent : (isDark ? '#444' : '#DDD'),
                    backgroundColor: item.checked ? colors.accent : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                  }}>
                  {item.checked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: item.checked ? colors.textMuted : colors.text,
                      textDecorationLine: item.checked ? 'line-through' : 'none',
                    }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary }}>{item.quantity}</Text>
                  {item.recipeName && (
                    <Text style={{ fontSize: 11, color: colors.accent, fontWeight: '600' }}>
                      {item.recipeName}
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Ionicons name="close-circle-outline" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={{ marginTop: 40 }}>
            <EmptyState
              icon="cart-outline"
              title={t('noShoppingItems')}
              subtitle={t('noShoppingSubtitle')}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
