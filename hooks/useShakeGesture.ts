import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';

export function useShakeGesture(onShake: () => void, sensitivity = 1.5) {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<any>(null);

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener((accelerometerData) => {
        setData(accelerometerData);
        const { x, y, z } = accelerometerData;
        const totalForce = Math.sqrt(x * x + y * y + z * z);
        
        if (totalForce > sensitivity) {
          onShake();
        }
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    return () => _unsubscribe();
  }, []);

  return {
    isShaking: subscription !== null,
    startShakeDetection: _subscribe,
    stopShakeDetection: _unsubscribe,
  };
}
