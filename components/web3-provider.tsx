'use client'

import React, { type ReactNode } from 'react'
import { wagmiAdapter, projectId, networks } from '@/config'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, arbitrum, base } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'AI Yield Manager',
  description: 'AI-Agentic Yield Manager — Autonomous DeFi yield optimization',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
}

// Create the AppKit modal instance
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, base],
  defaultNetwork: mainnet,
  metadata,
  features: {
    analytics: true,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#FF5112',
  },
})

export function Web3Provider({
  children,
  cookies,
}: {
  children: ReactNode
  cookies: string | null
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  )

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
