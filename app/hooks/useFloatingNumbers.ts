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
    
    // Generate a random speed modifier between 0.5 and 2.5
    const speedModifier = 0.5 + Math.random() * 2;
    
    const newFloatingNumber: FloatingNumber = {
      id: uniqueId,
      value: Math.abs(value),
      left: Math.random() * 80 + 10,
      isNegative,
      speedModifier
    };
    
    setFloatingNumbers(prev => [...prev, newFloatingNumber]);

    // Remove the floating number after animation completes
    // Adjust timeout to account for speed modifier
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(num => num.id !== uniqueId));
    }, 1000 / speedModifier);
  }, []);

  return {
    floatingNumbers,
    createFloatingNumber
  };
} 