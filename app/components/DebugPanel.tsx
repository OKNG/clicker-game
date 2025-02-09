type DebugPanelProps = {
  debugAmount: string;
  onDebugAmountChange: (value: string) => void;
  onDebugAdd: () => void;
};

/**
 * Debug panel for adding arbitrary amounts to the counter during development
 */
export function DebugPanel({ debugAmount, onDebugAmountChange, onDebugAdd }: DebugPanelProps) {
  return (
    <div className="fixed top-4 left-4 z-50 bg-gray-800 p-4 rounded-lg shadow-lg flex gap-2">
      <input
        type="number"
        value={debugAmount}
        onChange={(e) => onDebugAmountChange(e.target.value)}
        className="w-32 px-2 py-1 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter amount"
      />
      <button
        onClick={onDebugAdd}
        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition-colors"
      >
        Add
      </button>
    </div>
  );
} 