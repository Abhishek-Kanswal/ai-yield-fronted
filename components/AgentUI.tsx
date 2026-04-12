import React from 'react';

// --- Types ---
export interface PositionProps {
  poolName: string;
  coinName: string;
  coinLogo?: string;
  chainName: string;
  chainLogo?: string;
  value: string;
}

export interface DappPositionsProps {
  dappName: string;
  dappLogo?: string;
  badge?: string;
  totalValue: string;
  positions: PositionProps[];
}

// --- Component 1: Specific Position UI ---
export const PositionItem: React.FC<PositionProps> = ({
  poolName,
  coinName,
  coinLogo,
  chainName,
  chainLogo,
  value,
}) => {
  return (
    <div className="flex flex-col gap-3 py-3 border-b border-gray-200 last:border-0">
      {/* Pool / Yield Title */}
      <h3 className="text-sm font-semibold text-gray-800">{poolName}</h3>
      
      {/* Details Row */}
      <div className="flex justify-between items-center">
        
        {/* Left Side: Logos and Names */}
        <div className="flex items-center gap-3">
          {/* Main Coin Logo Placeholder */}
          <div className="w-10 h-10 rounded-full bg-[#171717] flex-shrink-0 overflow-hidden flex items-center justify-center text-xs text-white">
            {coinLogo ? <img src={coinLogo} alt={coinName} className="w-full h-full object-cover" /> : 'Logo'}
          </div>
          
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-base leading-tight">{coinName}</span>
            <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500 font-medium">
              {/* Chain / Status Logo Placeholder */}
              <div className="w-4 h-4 rounded-[4px] bg-[#171717] flex-shrink-0 overflow-hidden flex items-center justify-center text-[8px] text-white">
                 {chainLogo ? <img src={chainLogo} alt={chainName} className="w-full h-full object-cover" /> : ''}
              </div>
              <span>{chainName}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Value */}
        <div className="flex flex-col items-end">
          <span className="font-bold text-gray-900 text-lg">{value}</span>
        </div>
      </div>
    </div>
  );
};

// --- Component 2: Multiple Positions (Dapp) UI ---
export const DappPositions: React.FC<DappPositionsProps> = ({
  dappName,
  dappLogo,
  badge,
  totalValue,
  positions,
}) => {
  return (
    <div className="flex flex-col p-6 bg-white rounded-2xl border border-gray-200 shadow-sm w-full max-w-md font-sans">
      
      {/* Header: Dapp Info */}
      <div className="flex items-center gap-2 mb-1">
        {/* Dapp Logo Placeholder */}
        <div className="w-6 h-6 rounded-md bg-[#171717] flex-shrink-0 overflow-hidden flex items-center justify-center text-[10px] text-white">
          {dappLogo ? <img src={dappLogo} alt={dappName} className="w-full h-full object-cover" /> : 'Unt'}
        </div>
        <span className="font-bold text-gray-900 text-lg">{dappName}</span>
        
        {/* Optional Badge (e.g., 0%) */}
        {badge && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full font-semibold border border-gray-200">
            {badge}
          </span>
        )}
      </div>

      {/* Header: Total Value */}
      <div className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
        {totalValue}
      </div>

      {/* Positions List */}
      <div className="flex flex-col">
        {positions.map((position, index) => (
          <PositionItem key={index} {...position} />
        ))}
      </div>
    </div>
  );
};

// --- Example Usage ---
export default function App() {
  const sampleData: DappPositionsProps = {
    dappName: "Untitled Bank",
    badge: "0%",
    totalValue: "$0.00",
    positions: [
      {
        poolName: "Untitled Bank Yield: SolvBTC Pool (solvBTC-Bank)",
        coinName: "Solv BTC",
        chainName: "Deposited",
        value: "$0.00"
      },
      {
        poolName: "Untitled Bank Yield: ASTR Pool (UB-ASTR)",
        coinName: "Soneium Bridged ASTR ...",
        chainName: "Deposited",
        value: "$0.00"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <DappPositions {...sampleData} />
    </div>
  );
}