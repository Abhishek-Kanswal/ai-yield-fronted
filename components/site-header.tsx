"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Command } from 'lucide-react' // Removed Wallet icon

export function SiteHeader() {
  return (
    // Increased height to h-20 (80px) for a slightly bigger header
    <header className="sticky top-0 z-50 flex h-18 w-full items-center bg-sidebar">
      <div className="flex w-full items-center px-8">
        
        {/* Logo Section */}
        <a href="#" className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Command className="size-4" />
          </div>
          <div className="grid text-left text-sm leading-tight">
            <span className="truncate font-medium">Acme Inc</span>
            <span className="truncate text-xs text-muted-foreground">Enterprise</span>
          </div>
        </a>

        {/* New Navigation Links */}
        <nav className="ml-10 flex items-center gap-6 text-base">
          <a href="#" className="font-bold text-[12px] text-muted-foreground hover:text-foreground transition-colors">Swap</a>
          <a href="#" className="font-bold text-[12px] text-muted-foreground hover:text-foreground transition-colors">Vaults</a>
          <a href="#" className="font-bold text-[12px] text-muted-foreground hover:text-foreground transition-colors">Transactions</a>
        </nav>
https://docs.reown.com/appkit/javascript/core/installation#wagmi
        {/* Connect Button Section */}
        <div className="ml-auto shrink-0">
          <ConnectButton.Custom>
            {({ account, chain, mounted, openAccountModal, openConnectModal }) => {
              const ready = mounted
              const connected = ready && account && chain

              if (!connected) {
                return (
                  <button
                    type="button"
                    onClick={openConnectModal}
                    // Updated to #FF5112, removed border, removed icon
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[#FF5112] px-6 text-[14spx] font-semibold text-white transition-colors hover:bg-[#E64910]"
                  >
                    Connect
                  </button>
                )
              }

              return (
                <button
                  type="button"
                  onClick={openAccountModal}
                  // Updated to #FF5112, removed border, removed icon
                  className="inline-flex h-10 items-center justify-center rounded-md bg-[#FF5112] px-6 text-[14px] font-semibold text-white transition-colors hover:bg-[#E64910]"
                >
                  {account.displayName}
                </button>
              )
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </header>
  )
}