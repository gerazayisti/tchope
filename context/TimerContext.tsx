import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, AppState, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

type TimerState = {
  isRunning: boolean;
  recipeName: string;
  totalSeconds: number;
  remainingSeconds: number;
};

type TimerContextType = {
  timer: TimerState;
  startTimer: (recipeName: string, durationMinutes: number) => void;
  stopTimer: () => void;
  isTimerRunning: boolean;
};

const TimerContext = createContext<TimerContextType>({
  timer: { isRunning: false, recipeName: '', totalSeconds: 0, remainingSeconds: 0 },
  startTimer: () => {},
  stopTimer: () => {},
  isTimerRunning: false,
});

export function useTimer() {
  return useContext(TimerContext);
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    recipeName: '',
    totalSeconds: 0,
    remainingSeconds: 0,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number>(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [minimized, setMinimized] = useState(false);

  // Countdown based on real clock
  useEffect(() => {
    if (timer.isRunning && timer.remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
        setTimer((prev) => {
          if (remaining <= 0) {
            return { ...prev, remainingSeconds: 0, isRunning: false };
          }
          return { ...prev, remainingSeconds: remaining };
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timer.isRunning]);

  // Sync timer when app comes back from background
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && timer.isRunning && endTimeRef.current > 0) {
        const remaining = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
        if (remaining <= 0) {
          setTimer((prev) => ({ ...prev, remainingSeconds: 0, isRunning: false }));
        } else {
          setTimer((prev) => ({ ...prev, remainingSeconds: remaining }));
        }
      }
    });
    return () => sub.remove();
  }, [timer.isRunning]);

  // Timer done
  useEffect(() => {
    if (timer.totalSeconds > 0 && timer.remainingSeconds === 0 && !timer.isRunning) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Tchopé', `${timer.recipeName} est prêt ! Bon appétit !`);
    }
  }, [timer.remainingSeconds, timer.isRunning, timer.recipeName, timer.totalSeconds]);

  // Pulse animation
  useEffect(() => {
    if (timer.isRunning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [timer.isRunning, pulseAnim]);

  const startTimer = useCallback((recipeName: string, durationMinutes: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const totalSeconds = durationMinutes * 60;
    endTimeRef.current = Date.now() + totalSeconds * 1000;
    setTimer({ isRunning: true, recipeName, totalSeconds, remainingSeconds: totalSeconds });
    setMinimized(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    endTimeRef.current = 0;
    setTimer({ isRunning: false, recipeName: '', totalSeconds: 0, remainingSeconds: 0 });
  }, []);

  const progress = timer.totalSeconds > 0 ? (timer.totalSeconds - timer.remainingSeconds) / timer.totalSeconds : 0;
  const isTimerRunning = timer.isRunning || (timer.totalSeconds > 0 && timer.remainingSeconds === 0);
  const isDone = timer.totalSeconds > 0 && timer.remainingSeconds === 0 && !timer.isRunning;

  return (
    <TimerContext.Provider value={{ timer, startTimer, stopTimer, isTimerRunning }}>
      {children}

      {isTimerRunning && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 110,
            right: 20,
            transform: [{ scale: pulseAnim }],
            zIndex: 9999,
          }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setMinimized(!minimized)}
            style={{
              backgroundColor: isDone ? '#0A6A1D' : '#914700',
              borderRadius: minimized ? 32 : 24,
              padding: minimized ? 14 : 16,
              minWidth: minimized ? 64 : 180,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
              elevation: 12,
            }}>
            {minimized ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name={isDone ? 'checkmark-circle' : 'timer-outline'} size={18} color="#FFFFFF" />
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', fontVariant: ['tabular-nums'] }}>
                  {isDone ? '!' : formatTime(timer.remainingSeconds)}
                </Text>
              </View>
            ) : (
              <View style={{ gap: 8, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name={isDone ? 'checkmark-circle' : 'timer-outline'} size={16} color="#FFFFFF" />
                  <Text style={{ fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.8)' }} numberOfLines={1}>
                    {timer.recipeName}
                  </Text>
                </View>
                <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFFFFF', fontVariant: ['tabular-nums'] }}>
                  {isDone ? 'Prêt !' : formatTime(timer.remainingSeconds)}
                </Text>
                {!isDone && (
                  <View style={{ width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                    <View style={{ width: `${progress * 100}%`, height: 4, backgroundColor: '#FFFFFF', borderRadius: 2 }} />
                  </View>
                )}
                <TouchableOpacity
                  onPress={stopTimer}
                  style={{
                    marginTop: 4,
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: 16,
                  }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#FFFFFF' }}>
                    {isDone ? 'Fermer' : 'Arrêter'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      )}
    </TimerContext.Provider>
  );
}
