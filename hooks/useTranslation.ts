import { useCallback } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { translations, type TranslationKey } from '@/constants/translations';

export function useTranslation() {
  const { settings } = useSettings();
  const lang = settings.language;

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[lang][key];
    },
    [lang],
  );

  return { t };
}
