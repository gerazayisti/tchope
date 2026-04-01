import { useState, useEffect, useCallback } from 'react';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';

type VoiceCommands = {
  onNext?: () => void;
  onPrev?: () => void;
  onRepeat?: () => void;
  onStop?: () => void;
};

export function useVoiceControl(commands: VoiceCommands, lang: 'fr-FR' | 'en-US' = 'fr-FR') {
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');

  const onSpeechResults = useCallback((e: SpeechResultsEvent) => {
    if (e.value && e.value.length > 0) {
      const transcript = e.value[0].toLowerCase();
      setLastTranscript(transcript);

      // Simple keyword matching
      if (lang === 'fr-FR') {
        if (transcript.includes('suivant') || transcript.includes('prochain')) {
          commands.onNext?.();
        } else if (transcript.includes('précédent') || transcript.includes('retour') || transcript.includes('derrière')) {
          commands.onPrev?.();
        } else if (transcript.includes('répète') || transcript.includes('encore')) {
          commands.onRepeat?.();
        } else if (transcript.includes('stop') || transcript.includes('arrête')) {
          commands.onStop?.();
        }
      } else {
        if (transcript.includes('next')) {
          commands.onNext?.();
        } else if (transcript.includes('previous') || transcript.includes('back')) {
          commands.onPrev?.();
        } else if (transcript.includes('repeat') || transcript.includes('again')) {
          commands.onRepeat?.();
        } else if (transcript.includes('stop') || transcript.includes('quit')) {
          commands.onStop?.();
        }
      }
    }
  }, [commands, lang]);

  const onSpeechError = (e: SpeechErrorEvent) => {
    console.warn('Speech Error:', e.error);
    setIsListening(false);
  };

  useEffect(() => {
    if (!Voice) return;

    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners).catch(() => {});
    };
  }, [onSpeechResults]);

  const startListening = async () => {
    if (!Voice || typeof Voice.start !== 'function') return;
    try {
      await Voice.start(lang);
      setIsListening(true);
    } catch (e: any) {
      console.warn('Voice start error:', e.message);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    if (!Voice || typeof Voice.stop !== 'function') return;
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleListening = () => {
    if (!Voice || typeof Voice.start !== 'function') {
      setIsListening(false);
      return;
    }
    if (isListening) stopListening();
    else startListening();
  };

  return { isListening, startListening, stopListening, toggleListening, lastTranscript };
}
