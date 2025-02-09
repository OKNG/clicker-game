// Type for floating number objects
type FloatingNumber = {
  id: number;
  value: number;
  left: number;
  isNegative?: boolean;
};

type FloatingNumbersProps = {
  floatingNumbers: FloatingNumber[];
};

/**
 * Displays animated floating numbers that appear when points are gained or spent
 */
export function FloatingNumbersDisplay({ floatingNumbers }: FloatingNumbersProps) {
  return (
    <>
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
    </>
  );
}

export type { FloatingNumber }; 