"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Command, Wallet } from 'lucide-react'
// import { RainbowButton } from "@/components/ui/rainbow-button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-sidebar">
      <div className="flex h-(--header-height) w-full items-center px-4">
        <a href="#" className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Command className="size-4" />
          </div>
          <div className="grid text-left text-sm leading-tight">
            <span className="truncate font-medium">Acme Inc</span>
            <span className="truncate text-xs text-muted-foreground">Enterprise</span>
          </div>
        </a>
        <div className="ml-auto shrink-0">
          <ConnectButton.Custom>
            {({ account, chain, mounted, openAccountModal, openChainModal, openConnectModal }) => {
              const ready = mounted
              const connected = ready && account && chain

              if (!connected) {
                return (
                  <button
                    type="button"
                    onClick={openConnectModal}
                    className="inline-flex h-9 items-center gap-2 rounded-md border border-[#8B5CF6] bg-[#A78BFA] px-4 text-sm font-medium text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
                  >
                    <Wallet className="size-4" />
                    Connect
                  </button>
                )
              }

              return (
                <button
                  type="button"
                  onClick={openAccountModal}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-[#8B5CF6] bg-[#A78BFA] px-4 text-sm font-medium text-white hover:bg-[#A78BFA]/10"
                >
                  <Wallet className="size-4" />
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
