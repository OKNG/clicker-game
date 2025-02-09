'use client';

import { useState, useCallback } from 'react';

// Type for our floating number objects
type FloatingNumber = {
  id: number;
  value: number;
  left: number;
  isNegative?: boolean;
};

export default function Page() {
  const [count, setCount] = useState<number>(0);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const [nextId, setNextId] = useState(0);
  const [isUpgradesPanelOpen, setIsUpgradesPanelOpen] = useState(false);

  const createFloatingNumber = useCallback((value: number, isNegative = false) => {
    const newFloatingNumber: FloatingNumber = {
      id: nextId,
      value: Math.abs(value),
      left: Math.random() * 80 + 10,
      isNegative
    };
    
    setFloatingNumbers(prev => [...prev, newFloatingNumber]);
    setNextId(prev => prev + 1);

    // Remove the floating number after animation completes
    setTimeout(() => {
      setFloatingNumbers(prev => prev.filter(num => num.id !== newFloatingNumber.id));
    }, 1000);
  }, [nextId]);

  const handleClick = useCallback(() => {
    // Increment the counter
    setCount(prev => prev + 1);
    
    // Create a floating number
    createFloatingNumber(1);
  }, [createFloatingNumber]);

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

  // Placeholder upgrades data with Fibonacci prices
  const fibPrices = generateFibPrices(20);
  const upgrades = Array(20).fill(null).map((_, i) => ({
    id: i,
    name: `Upgrade ABC${i + 1}`,
    price: fibPrices[i]
  }));

  // Helper function to determine if an upgrade is affordable
  const canAfford = (price: number) => count >= price;

  // Handle upgrade purchase
  const handlePurchase = useCallback((upgrade: { price: number }) => {
    if (canAfford(upgrade.price)) {
      setCount(prev => prev - upgrade.price);
      createFloatingNumber(upgrade.price, true);
    }
  }, [canAfford, createFloatingNumber]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center overflow-hidden relative">
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

      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsUpgradesPanelOpen(!isUpgradesPanelOpen)}
        className="fixed top-4 right-4 z-50 text-white p-2 hover:bg-gray-700 rounded-lg transition-colors"
      >
        <div className="w-6 h-0.5 bg-current mb-1"></div>
        <div className="w-6 h-0.5 bg-current mb-1"></div>
        <div className="w-6 h-0.5 bg-current"></div>
      </button>

      {/* Upgrades Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-out overflow-hidden
                    ${isUpgradesPanelOpen ? 'translate-x-0' : 'translate-x-full'}
                    md:w-96`}
      >
        <div className="p-6 h-full">
          <h2 className="text-2xl font-bold text-white mb-6">Upgrades</h2>
          <div className="space-y-4 h-[calc(100%-4rem)] overflow-y-auto pr-2">
            {upgrades.map(upgrade => (
              <div
                key={upgrade.id}
                onClick={() => handlePurchase(upgrade)}
                className={`bg-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-600 transition-colors
                           ${canAfford(upgrade.price) ? 'hover:bg-gray-600 cursor-pointer' : 'opacity-90 cursor-not-allowed'}`}
              >
                <span className="text-white font-medium">{upgrade.name}</span>
                <span 
                  className={`font-bold transition-colors ${
                    canAfford(upgrade.price) ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  ${upgrade.price.toLocaleString()}
                </span>
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
      >
        Click!
      </button>
    </div>
  );
}
