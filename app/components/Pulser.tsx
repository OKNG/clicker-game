// Type for pulser
type Pulser = {
  id: number;
  isPulsing: boolean;
};

type PulserProps = {
  pulsers: Pulser[];
};

/**
 * Displays and manages pulser upgrades that add +1 to click multiplier every 5 seconds
 */
export function PulserDisplay({ pulsers }: PulserProps) {
  return (
    <div className="flex gap-2 justify-center flex-wrap w-32">
      {pulsers.map(pulser => (
        <div
          key={pulser.id}
          className={`w-6 h-6 transition-colors duration-500 rounded-sm
                     ${pulser.isPulsing ? 'bg-red-500' : 'bg-white'}`}
          style={{
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          }}
        />
      ))}
    </div>
  );
}

export type { Pulser }; 