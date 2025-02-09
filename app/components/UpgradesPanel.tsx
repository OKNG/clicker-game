// Type for our upgrades
type Upgrade = {
  id: number;
  name: string;
  price: number;
  type: 'clickMultiplier' | 'autoClicker' | 'spinner' | 'other';
  description: string;
};

type UpgradesPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  upgrades: Upgrade[];
  onPurchase: (upgrade: Upgrade) => void;
  canAfford: (price: number) => boolean;
  lastPurchasedId: number | null;
};

/**
 * Displays the upgrades panel with available upgrades and handles purchase interactions
 */
export function UpgradesPanel({ 
  isOpen, 
  onClose, 
  upgrades, 
  onPurchase, 
  canAfford,
  lastPurchasedId 
}: UpgradesPanelProps) {
  return (
    <div 
      className={`fixed top-0 right-0 h-full w-80 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-out overflow-hidden z-50
                  ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                  md:w-96`}
    >
      <div className="p-6 h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Upgrades</h2>
          {/* Hamburger Menu Button - inside panel */}
          <button
            onClick={onClose}
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
              onClick={() => onPurchase(upgrade)}
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
  );
}

export type { Upgrade }; 