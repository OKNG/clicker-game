// Type for floating number objects
type FloatingNumber = {
  id: number;
  value: number;
  left: number;
  isNegative?: boolean;
  speedModifier: number;
};

type FloatingNumbersProps = {
  floatingNumbers: FloatingNumber[];
};

/**
 * Displays animated floating numbers that appear when points are gained or spent
 */
export function FloatingNumbersDisplay({ floatingNumbers }: FloatingNumbersProps) {
  return (
    <div className="relative w-full">
      {floatingNumbers.map(num => (
        <div
          key={num.id}
          className={`absolute bottom-0 font-bold text-2xl animate-float-up
                     ${num.isNegative ? 'text-red-400' : 'text-green-400'}`}
          style={{ 
            left: `${num.left}%`,
            animationDuration: `${1 / num.speedModifier}s`
          }}
        >
          {num.isNegative ? '-' : '+'}${num.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
}

export type { FloatingNumber }; 