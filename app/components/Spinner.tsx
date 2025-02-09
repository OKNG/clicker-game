// Type for spinner
type Spinner = {
  id: number;
  isSpinning: boolean;
};

type SpinnerProps = {
  spinners: Spinner[];
};

/**
 * Displays and manages spinner upgrades that generate 1% of current points every second
 */
export function SpinnerDisplay({ spinners }: SpinnerProps) {
  return (
    <div className="flex gap-2 justify-center flex-wrap w-32">
      {spinners.map(spinner => (
        <div
          key={spinner.id}
          className={`w-6 h-6 bg-white rounded-sm transition-transform ${
            spinner.isSpinning ? 'animate-spin-once' : ''
          }`}
        />
      ))}
    </div>
  );
}

export type { Spinner }; 