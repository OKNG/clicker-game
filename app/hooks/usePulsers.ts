import { useState, useCallback, useEffect } from 'react';
import { Pulser } from '../components/Pulser';

/**
 * Hook for managing pulsers that increase click multiplier every 5 seconds
 * @param onPulserTrigger Callback function to handle click multiplier increase
 */
export function usePulsers(onPulserTrigger: () => void) {
  const [pulsers, setPulsers] = useState<Pulser[]>([]);

  // Effect to handle pulser triggers every 5 seconds
  useEffect(() => {
    if (pulsers.length === 0) return;

    const interval = setInterval(() => {
      // Trigger all pulsers
      setPulsers(prev => prev.map(pulser => ({ ...pulser, isPulsing: true })));
      onPulserTrigger();

      // Reset pulsing state after animation
      setTimeout(() => {
        setPulsers(prev => prev.map(pulser => ({ ...pulser, isPulsing: false })));
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [pulsers.length, onPulserTrigger]);

  const addPulser = useCallback(() => {
    setPulsers(prev => [
      ...prev,
      {
        id: Date.now(),
        isPulsing: false
      }
    ]);
  }, []);

  return {
    pulsers,
    addPulser
  };
} 