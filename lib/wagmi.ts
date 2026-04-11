"use client";

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, base, mainnet, optimism } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Yield Sentinel AI',
  projectId: '1c7a911a3b37ee50dca0eef671d17cf3', // Reown valid demo ID
  chains: [mainnet, base, arbitrum, optimism],
  ssr: true,
});