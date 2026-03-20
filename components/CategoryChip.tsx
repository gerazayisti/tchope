import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  variant?: 'default' | 'peach' | 'green';
};

export default function CategoryChip({ label, active = false, onPress, variant = 'default' }: Props) {
  const { colors, isDark } = useTheme();

  const getBgColor = () => {
    if (active) {
      if (variant === 'green') return 'rgba(157,248,152,0.3)';
      return variant === 'peach' ? colors.accent : colors.chipActiveBg;
    }
    if (variant === 'peach') return colors.chipPeach;
    return colors.chipBg;
  };

  const getTextColor = () => {
    if (active) {
      if (variant === 'green') return colors.greenText;
      return colors.chipActiveText;
    }
    if (variant === 'peach') return colors.chipPeachText;
    return colors.textMuted;
  };

  const getBorderStyle = () => {
    if (active && variant === 'green') {
      return { borderWidth: 1, borderColor: 'rgba(10,106,29,0.1)' };
    }
    return {};
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        {
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 9999,
          backgroundColor: getBgColor(),
        },
        getBorderStyle(),
      ]}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: active ? '600' : '500',
          color: getTextColor(),
          textAlign: 'center',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
