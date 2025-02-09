import { useState, useCallback, useEffect } from 'react';
import { AutoClicker } from '../components/AutoClicker';

/**
 * Hook for managing autoclicker upgrades and their intervals
 * @param clickMultiplier Current click multiplier value for calculating points
 * @param onPointsEarned Callback for when points are earned
 */
export function useAutoClickers(
  clickMultiplier: number,
  onPointsEarned: (amount: number) => void
) {
  const [autoClickers, setAutoClickers] = useState<AutoClicker[]>([]);

  const triggerAutoClick = useCallback((autoClickerId: number) => {
    onPointsEarned(clickMultiplier);
    
    // Trigger poke animation
    setAutoClickers(prev => prev.map(clicker => 
      clicker.id === autoClickerId 
        ? { ...clicker, isPoking: true }
        : clicker
    ));

    // Reset poke animation
    setTimeout(() => {
      setAutoClickers(prev => prev.map(clicker =>
        clicker.id === autoClickerId
          ? { ...clicker, isPoking: false }
          : clicker
      ));
    }, 200); // Match with animation duration
  }, [clickMultiplier, onPointsEarned]);

  // Set up autoClicker intervals
  useEffect(() => {
    if (autoClickers.length === 0) return;

    // Single interval that handles all autoClickers
    const intervalId = setInterval(() => {
      // Trigger all autoClickers at once
      autoClickers.forEach(clicker => {
        triggerAutoClick(clicker.id);
      });
    }, 1000);

    // Clean up interval on unmount or when autoClickers changes
    return () => clearInterval(intervalId);
  }, [autoClickers, triggerAutoClick]);

  const addAutoClicker = useCallback(() => {
    setAutoClickers(prev => [...prev, {
      id: prev.length,
      isPoking: false
    }]);
  }, []);

  return {
    autoClickers,
    triggerAutoClick,
    addAutoClicker
  };
} 