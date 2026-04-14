import React from 'react';
import WalletClient, { GroupedProtocol } from './WalletClient'; // Adjust path if needed

interface Position {
  chainId: number;
  protocolName: string;
  asset: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
  balanceUsd: string;
  balanceNative: string;
}

// Helper function to format currency
function formatSplitCurrency(value: number) {
  const formatted = value.toFixed(2);
  const [whole, decimal] = formatted.split('.');
  return { whole, decimal };
}

export default async function WalletProfile() {
  const WALLET_ADDRESS = '0x289E43B86f7395578a611404A1669218ea0F871a';
  const apiKey = process.env.LIFI_API_KEY;

  if (!apiKey) {
    return <div className="text-red-500 p-10">Error: LIFI_API_KEY is missing in .env.local</div>;
  }

  let positions: Position[] = [];
  try {
    const res = await fetch(`https://earn.li.fi/v1/earn/portfolio/${WALLET_ADDRESS}/positions`, {
      headers: {
        'x-lifi-api-key': apiKey,
      },
      // cache: 'no-store' // Uncomment for real-time updates
    });
    const data = await res.json();
    positions = data.positions || [];
  } catch (error) {
    console.error("Failed to fetch LI.FI data:", error);
  }

  // Group data by Protocol
  let totalWalletUsd = 0;
  const groupedData = positions.reduce((acc, pos) => {
    const protocol = pos.protocolName;
    const usdValue = Number(pos.balanceUsd) || 0;
    
    totalWalletUsd += usdValue;

    if (!acc[protocol]) {
      acc[protocol] = {
        protocolName: protocol,
        totalUsd: 0,
        positions: [],
      };
    }
    acc[protocol].positions.push(pos);
    acc[protocol].totalUsd += usdValue;
    
    return acc;
  }, {} as Record<string, GroupedProtocol>);

  const protocols = Object.values(groupedData);
  const walletBalance = formatSplitCurrency(totalWalletUsd);

  // Pass data to the interactive Client Component
  return (
    <WalletClient 
      initialProtocols={protocols} 
      walletBalance={walletBalance} 
      walletAddress={WALLET_ADDRESS} 
    />
  );
}