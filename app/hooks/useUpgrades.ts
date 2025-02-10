import { useState, useCallback, useEffect } from 'react';

/**
 * Hook for managing upgrade prices and generating upgrade data
 * @param clickMultiplier Current click multiplier value for upgrade descriptions
 */
export function useUpgrades(clickMultiplier: number) {
  const [upgradePrices, setUpgradePrices] = useState<{ [key: number]: number }>({});
  const [lastPurchasedId, setLastPurchasedId] = useState<number | null>(null);
  const [highestPurchasedId, setHighestPurchasedId] = useState<number>(-1);

  // Generate Fibonacci prices starting at 25
  const generateFibPrices = (count: number): number[] => {
    const prices: number[] = [25];
    let prev = 25;
    let curr = 50;
    
    for (let i = 1; i < count; i++) {
      prices.push(curr);
      const next = prev + curr;
      prev = curr;
      curr = next;
    }
    
    return prices;
  };

  // Initialize upgrade prices on first render
  useEffect(() => {
    const fibPrices = generateFibPrices(20);
    const initialPrices = fibPrices.reduce((acc, price, index) => {
      acc[index] = price;
      return acc;
    }, {} as { [key: number]: number });
    setUpgradePrices(initialPrices);
  }, []);

  // Generate upgrades data with current prices
  const upgrades = Array(20).fill(null)
    .map((_, i) => {
      // Only generate upgrades up to the next available one
      if (i > highestPurchasedId + 1) return null;

      const currentPrice = upgradePrices[i] || generateFibPrices(20)[i];
      
      if (i === 0) {
        return {
          id: i,
          name: "Add +1 to click",
          price: currentPrice,
          type: 'clickMultiplier' as const,
          description: `Each click will give you +${clickMultiplier + 1} points`
        };
      }
      if (i === 1) {
        return {
          id: i,
          name: "Autoclicker",
          price: currentPrice,
          type: 'autoClicker' as const,
          description: `Automatically clicks once every second with current multiplier (${clickMultiplier})`
        };
      }
      if (i === 2) {
        return {
          id: i,
          name: "Spinner",
          price: currentPrice,
          type: 'spinner' as const,
          description: `Generates 1% of your current points every second`
        };
      }
      if (i === 3) {
        return {
          id: i,
          name: "Pulser",
          price: currentPrice,
          type: 'pulser' as const,
          description: `Adds +1 to your click multiplier every 5 seconds`
        };
      }
      return {
        id: i,
        name: `Upgrade ABC${i + 1}`,
        price: currentPrice,
        type: 'other' as const,
        description: 'Coming soon...'
      };
    })
    .filter(Boolean); // Remove null entries

  const handleUpgradePurchase = useCallback((upgradeId: number) => {
    setUpgradePrices(prev => ({
      ...prev,
      [upgradeId]: prev[upgradeId] * 2
    }));
    setLastPurchasedId(upgradeId);
    setHighestPurchasedId(prev => Math.max(prev, upgradeId));

    // Reset the flash effect after animation completes
    setTimeout(() => {
      setLastPurchasedId(null);
    }, 100);
  }, []);

  return {
    upgrades,
    lastPurchasedId,
    highestPurchasedId,
    handleUpgradePurchase
  };
} 