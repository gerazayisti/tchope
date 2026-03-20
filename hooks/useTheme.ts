import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useSettings } from '@/context/SettingsContext';

const lightColors = {
  background: '#F9F6F5',
  surface: '#F3F0EF',
  card: '#FFFFFF',
  text: '#2F2F2E',
  textSecondary: '#5C5B5B',
  textMuted: '#74544A',
  accent: '#914700',
  accentLight: '#F97F06',
  accentOrange: '#E67400',
  green: '#0A6A1D',
  greenLight: 'rgba(157,248,152,0.3)',
  greenText: '#006016',
  border: '#EAE7E7',
  inputBg: '#DFDCDC',
  chipBg: '#F3F0EF',
  chipActiveBg: '#914700',
  chipActiveText: '#FFFFFF',
  chipPeach: '#EFC6B9',
  chipPeachText: '#51352C',
  tabBarBg: 'rgba(255,255,255,0.9)',
  ingredientBg: '#FED3C7',
  headerBg: 'rgba(249,246,245,0.8)',
} as const;

const darkColors = {
  background: '#1A1A1A',
  surface: '#2A2A2A',
  card: '#2A2A2A',
  text: '#F5F5F5',
  textSecondary: '#999999',
  textMuted: '#8E8E8E',
  accent: '#914700',
  accentLight: '#F97F06',
  accentOrange: '#E67400',
  green: '#0A6A1D',
  greenLight: 'rgba(157,248,152,0.15)',
  greenText: '#4ADE80',
  border: '#3A3A3A',
  inputBg: '#2A2A2A',
  chipBg: '#3A3A3A',
  chipActiveBg: '#914700',
  chipActiveText: '#FFFFFF',
  chipPeach: '#3A2A2A',
  chipPeachText: '#EFC6B9',
  tabBarBg: 'rgba(26,26,26,0.9)',
  ingredientBg: '#3A2520',
  headerBg: 'rgba(26,26,26,0.8)',
} as const;

export function useTheme() {
  const { settings } = useSettings();
  const systemScheme = useColorScheme();

  const isDark = useMemo(() => {
    if (settings.theme === 'system') {
      return systemScheme === 'dark';
    }
    return settings.theme === 'dark';
  }, [settings.theme, systemScheme]);

  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark]);

  return { isDark, colors };
}
