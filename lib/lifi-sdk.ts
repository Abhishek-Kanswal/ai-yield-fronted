'use client'

import { createConfig, EVM } from '@lifi/sdk'
import { getWalletClient, switchChain } from '@wagmi/core'

import { config as wagmiConfig } from '@/config'

let isConfigured = false

export function initializeLiFiSdk() {
  if (isConfigured) return

  createConfig({
    integrator: 'ai-yield-manager',
    providers: [
      EVM({
        getWalletClient: () => getWalletClient(wagmiConfig),
        switchChain: async (chainId: number) => {
          const chain = await switchChain(wagmiConfig, { chainId })
          return getWalletClient(wagmiConfig, { chainId: chain.id })
        },
      }),
    ],
  })

  isConfigured = true
}