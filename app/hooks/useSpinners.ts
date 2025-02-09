import { useState, useCallback, useEffect, useRef } from 'react';
import { Spinner } from '../components/Spinner';

/**
 * Hook for managing spinner upgrades and their intervals
 * @param currentPoints Current points value for calculating percentage gains
 * @param onPointsEarned Callback for when points are earned
 */
export function useSpinners(
  currentPoints: number,
  onPointsEarned: (amount: number) => void
) {
  const [spinners, setSpinners] = useState<Spinner[]>([]);
  const pointsRef = useRef(currentPoints);
  const onPointsEarnedRef = useRef(onPointsEarned);

  // Keep refs updated with latest values
  useEffect(() => {
    pointsRef.current = currentPoints;
    onPointsEarnedRef.current = onPointsEarned;
  }, [currentPoints, onPointsEarned]);

  // Only handles the animation aspect of spinning
  const triggerSpinner = useCallback((spinnerId: number) => {
    // Trigger spin animation
    setSpinners(prev => prev.map(spinner => 
      spinner.id === spinnerId 
        ? { ...spinner, isSpinning: true }
        : spinner
    ));

    // Reset spin animation
    setTimeout(() => {
      setSpinners(prev => prev.map(spinner =>
        spinner.id === spinnerId
          ? { ...spinner, isSpinning: false }
          : spinner
      ));
    }, 1000); // Match with animation duration
  }, []); // No dependencies needed since it only handles animation

  // Set up spinner intervals
  useEffect(() => {
    if (spinners.length === 0) return;

    // Single interval that handles all spinners
    const intervalId = setInterval(() => {
      // Calculate points using the ref value
      const spinValue = Math.floor(pointsRef.current * 0.01);
      
      // Trigger all spinners at once
      spinners.forEach(spinner => {
        triggerSpinner(spinner.id);
        onPointsEarnedRef.current(spinValue);
      });
    }, 1000);

    // Clean up interval on unmount or when spinners changes
    return () => clearInterval(intervalId);
  }, [spinners, triggerSpinner]); // Only depends on spinners array and animation trigger

  const addSpinner = useCallback(() => {
    setSpinners(prev => [...prev, {
      id: prev.length,
      isSpinning: false
    }]);
  }, []);

  return {
    spinners,
    triggerSpinner,
    addSpinner
  };
} 