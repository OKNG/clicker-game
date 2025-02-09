import { useState, useCallback } from 'react';
import { FloatingNumber } from '../components/FloatingNumber';

/**
 * Hook for managing floating number animations that appear when points are gained or spent
 */
export function useFloatingNumbers() {
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);

  const createFloatingNumber = useCallback((value: number, isNegative = false) => {
    // Generate a unique ID using timestamp and random number
    const uniqueId = Date.now() + Math.random();
    
    const newFloatingNumber: FloatingNumber = {
      id: uniqueId,
      value: Math.abs(value),
      left: Math.random() * 80 + 10,
      isNegative
    };
    
    setFloatingNumbers(prev => [...prev, newFloatingNumber]);

    // Remove the floating number after animation completes
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(num => num.id !== uniqueId));
    }, 1000);
  }, []);

  return {
    floatingNumbers,
    createFloatingNumber
  };
} 