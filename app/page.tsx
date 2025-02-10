'use client';

import { useState, useCallback } from 'react';
import { SpinnerDisplay } from './components/Spinner';
import { AutoClickerDisplay } from './components/AutoClicker';
import { FloatingNumbersDisplay } from './components/FloatingNumber';
import { UpgradesPanel, type Upgrade } from './components/UpgradesPanel';
import { ClickableCircle } from './components/ClickableCircle';
import { DebugPanel } from './components/DebugPanel';
import { PulserDisplay } from './components/Pulser';

import { useFloatingNumbers } from './hooks/useFloatingNumbers';
import { useUpgrades } from './hooks/useUpgrades';
import { useAutoClickers } from './hooks/useAutoClickers';
import { useSpinners } from './hooks/useSpinners';
import { usePulsers } from './hooks/usePulsers';
import { useTouchGestures } from './hooks/useTouchGestures';
import { useResponsiveMenu } from './hooks/useResponsiveMenu';

export default function Page() {
  const [count, setCount] = useState<number>(0);
  const [clickMultiplier, setClickMultiplier] = useState<number>(1);
  const [debugAmount, setDebugAmount] = useState<string>('');

  // Initialize all custom hooks
  const { floatingNumbers, createFloatingNumber } = useFloatingNumbers();
  const { upgrades, lastPurchasedId, handleUpgradePurchase } = useUpgrades(clickMultiplier);
  const { isMenuOpen, setIsMenuOpen } = useResponsiveMenu();
  
  // Handler for when points are earned (used by both autoClickers and spinners)
  const handlePointsEarned = useCallback((amount: number) => {
    setCount(prev => prev + amount);
    createFloatingNumber(amount);
  }, [createFloatingNumber]);

  // Handler for pulser trigger
  const handlePulserTrigger = useCallback(() => {
    setClickMultiplier(prev => prev + 1);
  }, []);

  const { autoClickers, addAutoClicker } = useAutoClickers(
    clickMultiplier,
    handlePointsEarned
  );

  const { spinners, addSpinner } = useSpinners(
    count,
    handlePointsEarned
  );

  const { pulsers, addPulser } = usePulsers(handlePulserTrigger);

  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchGestures(
    () => !isMenuOpen && setIsMenuOpen(true),
    () => isMenuOpen && setIsMenuOpen(false)
  );

  // Handle manual click
  const handleClick = useCallback(() => {
    handlePointsEarned(clickMultiplier);
  }, [clickMultiplier, handlePointsEarned]);

  // Handle upgrade purchase
  const handlePurchase = useCallback((upgrade: Upgrade) => {
    if (count >= upgrade.price) {
      setCount(prev => prev - upgrade.price);
      createFloatingNumber(upgrade.price, true);
      handleUpgradePurchase(upgrade.id);

      // Handle different upgrade types
      if (upgrade.type === 'clickMultiplier') {
        setClickMultiplier(prev => prev + 1);
      } else if (upgrade.type === 'autoClicker') {
        addAutoClicker();
      } else if (upgrade.type === 'spinner') {
        addSpinner();
      } else if (upgrade.type === 'pulser') {
        addPulser();
      }
    }
  }, [count, createFloatingNumber, handleUpgradePurchase, addAutoClicker, addSpinner, addPulser]);

  // Handle debug amount addition
  const handleDebugAdd = useCallback(() => {
    const amount = parseInt(debugAmount);
    if (!isNaN(amount)) {
      handlePointsEarned(amount);
      setDebugAmount('');
    }
  }, [debugAmount, handlePointsEarned]);

  return (
    <div 
      className="min-h-screen h-screen bg-gray-900 flex flex-col items-center overflow-hidden relative"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <DebugPanel 
        debugAmount={debugAmount}
        onDebugAmountChange={setDebugAmount}
        onDebugAdd={handleDebugAdd}
      />

      <div className="flex-1" /> {/* Spacer */}

      {/* Game content centered vertically */}
      <div className="flex flex-col items-center gap-8 mb-12">
        {/* Counter display */}
        <div className="text-4xl md:text-6xl font-bold text-white">
          {count.toLocaleString()}
        </div>

        {/* Clickable circle with spinners and autoclickers */}
        <div className="flex items-center justify-center gap-4 md:gap-8">
          <SpinnerDisplay 
            spinners={spinners}
          />

          <ClickableCircle onClick={handleClick} />

          <AutoClickerDisplay 
            autoClickers={autoClickers}
          />
        </div>

        {/* Pulsers below the circle */}
        <PulserDisplay pulsers={pulsers} />
      </div>

      <div className="flex-1" /> {/* Spacer */}

      {/* Floating numbers container - positioned at bottom of viewport */}
      <div className="fixed bottom-16 left-0 w-full pointer-events-none z-10">
        <FloatingNumbersDisplay floatingNumbers={floatingNumbers} />
      </div>

      {/* Hamburger Menu Button - only show when panel is closed */}
      {!isMenuOpen && (
        <button
          onClick={() => setIsMenuOpen(true)}
          className="fixed top-4 right-4 z-50 text-white p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <div className="w-6 h-0.5 bg-current mb-1"></div>
          <div className="w-6 h-0.5 bg-current mb-1"></div>
          <div className="w-6 h-0.5 bg-current"></div>
        </button>
      )}

      <UpgradesPanel 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        upgrades={upgrades as Upgrade[]}
        onPurchase={handlePurchase}
        canAfford={(price) => count >= price}
        lastPurchasedId={lastPurchasedId}
      />
    </div>
  );
}
