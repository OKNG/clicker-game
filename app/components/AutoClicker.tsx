// Type for autoClicker
type AutoClicker = {
  id: number;
  isPoking: boolean;
};

type AutoClickerProps = {
  autoClickers: AutoClicker[];
  onAutoClickerTrigger: (autoClickerId: number) => void;
};

/**
 * Displays and manages autoclicker upgrades that click once per second with current multiplier
 */
export function AutoClickerDisplay({ autoClickers, onAutoClickerTrigger }: AutoClickerProps) {
  return (
    <div className="flex gap-2 justify-center flex-wrap w-32">
      {autoClickers.map(clicker => (
        <div
          key={clicker.id}
          className={`w-1 h-8 bg-white rounded-full transition-transform ${
            clicker.isPoking ? 'animate-poke' : ''
          }`}
        />
      ))}
    </div>
  );
}

export type { AutoClicker }; 