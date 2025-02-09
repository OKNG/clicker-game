'use client';

import { useState, useCallback, useEffect } from 'react';

// Type for our floating number objects
type FloatingNumber = {
  id: number;
  value: number;
  left: number;
  isNegative?: boolean;
};

// Type for autoClicker
type AutoClicker = {
  id: number;
  isPoking: boolean;
};

// Type for our upgrades
type Upgrade = {
  id: number;
  name: string;
  price: number;
  type: 'clickMultiplier' | 'autoClicker' | 'other';
  description: string;
};

export default function Page() {
  const [count, setCount] = useState<number>(0);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const [isUpgradesPanelOpen, setIsUpgradesPanelOpen] = useState(false);
  const [clickMultiplier, setClickMultiplier] = useState<number>(1);
  const [autoClickers, setAutoClickers] = useState<AutoClicker[]>([]);
  const [debugAmount, setDebugAmount] = useState<string>('');
  const [lastPurchasedId, setLastPurchasedId] = useState<number | null>(null);
  const [upgradePrices, setUpgradePrices] = useState<{ [key: number]: number }>({});
  
  // Touch gesture handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && !isUpgradesPanelOpen) {
      setIsUpgradesPanelOpen(true);
    } else if (isRightSwipe && isUpgradesPanelOpen) {
      setIsUpgradesPanelOpen(false);
    }
  };

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

  const handleClick = useCallback(() => {
    // Increment the counter by the multiplier
    setCount(prev => prev + clickMultiplier);
    
    // Create a floating number showing the multiplier value
    createFloatingNumber(clickMultiplier);
  }, [createFloatingNumber, clickMultiplier]);

  // Function to trigger a click from an autoClicker
  const triggerAutoClick = useCallback((autoClickerId: number) => {
    setCount(prev => prev + clickMultiplier);
    createFloatingNumber(clickMultiplier);
    
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
  }, [clickMultiplier, createFloatingNumber]);

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

  // Placeholder upgrades data with current prices
  const upgrades = Array(20).fill(null).map((_, i) => {
    const currentPrice = upgradePrices[i] || generateFibPrices(20)[i]; // Fallback to base price if not set
    
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
        name: "Add autoclicker",
        price: currentPrice,
        type: 'autoClicker' as const,
        description: `Automatically clicks once every second with current multiplier (${clickMultiplier})`
      };
    }
    return {
      id: i,
      name: `Upgrade ABC${i + 1}`,
      price: currentPrice,
      type: 'other' as const,
      description: 'Coming soon...'
    };
  });

  // Helper function to determine if an upgrade is affordable - wrap in useCallback
  const canAfford = useCallback((price: number) => count >= price, [count]);

  // Handle upgrade purchase
  const handlePurchase = useCallback((upgrade: Upgrade) => {
    if (canAfford(upgrade.price)) {
      setCount(prev => prev - upgrade.price);
      createFloatingNumber(upgrade.price, true);
      setLastPurchasedId(upgrade.id);

      // Double the price of the purchased upgrade
      setUpgradePrices(prev => ({
        ...prev,
        [upgrade.id]: prev[upgrade.id] * 2
      }));

      // Reset the flash effect after animation completes
      setTimeout(() => {
        setLastPurchasedId(null);
      }, 100);

      // Handle different upgrade types
      if (upgrade.type === 'clickMultiplier') {
        setClickMultiplier(prev => prev + 1);
      } else if (upgrade.type === 'autoClicker') {
        setAutoClickers(prev => [...prev, {
          id: prev.length,
          isPoking: false
        }]);
      }
    }
  }, [canAfford, createFloatingNumber]);

  // Handle debug amount addition
  const handleDebugAdd = () => {
    const amount = parseInt(debugAmount);
    if (!isNaN(amount)) {
      setCount(prev => prev + amount);
      createFloatingNumber(amount);
      setDebugAmount('');
    }
  };

  return (
    <div 
      className="min-h-screen bg-gray-900 flex flex-col items-center justify-center overflow-hidden relative"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Debug Input Panel */}
      <div className="fixed top-4 left-4 z-50 bg-gray-800 p-4 rounded-lg shadow-lg flex gap-2">
        <input
          type="number"
          value={debugAmount}
          onChange={(e) => setDebugAmount(e.target.value)}
          className="w-32 px-2 py-1 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount"
        />
        <button
          onClick={handleDebugAdd}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition-colors"
        >
          Add
        </button>
      </div>

      {/* Counter display */}
      <div className="text-6xl font-bold text-white mb-16">
        {count.toLocaleString()}
      </div>

      {/* Floating numbers */}
      {floatingNumbers.map(num => (
        <div
          key={num.id}
          className={`absolute bottom-0 font-bold text-2xl animate-float-up pointer-events-none
                     ${num.isNegative ? 'text-red-400' : 'text-green-400'}`}
          style={{ 
            left: `${num.left}%`,
          }}
        >
          {num.isNegative ? '-' : '+'}${num.value.toLocaleString()}
        </div>
      ))}

      {/* Hamburger Menu Button - only show when panel is closed */}
      {!isUpgradesPanelOpen && (
        <button
          onClick={() => setIsUpgradesPanelOpen(true)}
          className="fixed top-4 right-4 z-50 text-white p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <div className="w-6 h-0.5 bg-current mb-1"></div>
          <div className="w-6 h-0.5 bg-current mb-1"></div>
          <div className="w-6 h-0.5 bg-current"></div>
        </button>
      )}

      {/* Upgrades Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-out overflow-hidden z-50
                    ${isUpgradesPanelOpen ? 'translate-x-0' : 'translate-x-full'}
                    md:w-96`}
      >
        <div className="p-6 h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Upgrades</h2>
            {/* Hamburger Menu Button - inside panel */}
            <button
              onClick={() => setIsUpgradesPanelOpen(false)}
              className="text-white p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="w-6 h-0.5 bg-current mb-1"></div>
              <div className="w-6 h-0.5 bg-current mb-1"></div>
              <div className="w-6 h-0.5 bg-current"></div>
            </button>
          </div>
          <div className="space-y-4 h-[calc(100%-4rem)] overflow-y-auto pr-2">
            {upgrades.map(upgrade => (
              <div
                key={upgrade.id}
                onClick={() => handlePurchase(upgrade)}
                className={`bg-gray-700 rounded-lg p-4 flex flex-col hover:bg-gray-600 transition-colors
                           ${canAfford(upgrade.price) ? 'hover:bg-gray-600 cursor-pointer' : 'opacity-90 cursor-not-allowed'}
                           ${lastPurchasedId === upgrade.id ? 'animate-flash' : ''}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{upgrade.name}</span>
                  <span 
                    className={`font-bold transition-colors ${
                      canAfford(upgrade.price) ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    ${upgrade.price.toLocaleString()}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">{upgrade.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clickable circle */}
      <button
        onClick={handleClick}
        className="w-48 h-48 rounded-full bg-blue-500 hover:bg-blue-400 
                   flex items-center justify-center text-white text-2xl
                   transform transition-transform duration-100 active:scale-95
                   focus:outline-none shadow-lg hover:shadow-xl
                   animate-pulse hover:animate-none"
      />

      {/* AutoClickers container */}
      <div className="flex gap-2 mt-8 justify-center flex-wrap max-w-md">
        {autoClickers.map(clicker => (
          <div
            key={clicker.id}
            className={`w-1 h-8 bg-white rounded-full transition-transform ${
              clicker.isPoking ? 'animate-poke' : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
}
