import { useState, useEffect } from 'react';

/**
 * Hook for managing responsive menu behavior based on screen size
 * @returns Current state of the menu and function to toggle it
 */
export function useResponsiveMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Initialize menu state based on screen width
  useEffect(() => {
    const checkScreenWidth = () => {
      const isDesktop = window.innerWidth >= 768; // md breakpoint in Tailwind
      setIsMenuOpen(isDesktop);
    };

    // Set initial state
    checkScreenWidth();

    // Listen for window resize
    window.addEventListener('resize', checkScreenWidth);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenWidth);
  }, []);

  return {
    isMenuOpen,
    setIsMenuOpen
  };
} 