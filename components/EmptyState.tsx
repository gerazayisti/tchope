import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  icon?: string;
  title: string;
  subtitle?: string;
};

export default function EmptyState({ icon = 'book-outline', title, subtitle }: Props) {
  const { colors } = useTheme();

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 48, gap: 16 }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name={icon as any} size={36} color={colors.textMuted} />
      </View>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '700',
          color: colors.text,
          textAlign: 'center',
        }}>
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
          }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}
