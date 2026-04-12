"use client"

import Link from 'next/link'
import { Command } from 'lucide-react'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'

export function SiteHeader() {
  const { open } = useAppKit()
  const { isConnected } = useAppKitAccount()

  return (
    <header className="sticky top-0 z-50 flex h-18 w-full items-center bg-[#F3F3F3]">
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

        {/* Navigation Links */}
        <nav className="ml-10 flex items-center gap-6 text-base">
          <Link href="#" className="font-bold text-[17px] text-muted-foreground hover:text-foreground transition-colors">Swap</Link>
          <Link href="/earn" className="font-bold text-[17px] text-muted-foreground hover:text-foreground transition-colors">Vaults</Link>
          <Link href="#" className="font-bold text-[17px] text-muted-foreground hover:text-foreground transition-colors">Transactions</Link>
        </nav>

        {/* Hybrid Connect/Account Button */}
        <div className="ml-auto shrink-0">
          {isConnected ? (
            /* Hides the balance, which removes the continuous loading spinner */
            <appkit-button balance="hide" />
          ) : (
            /* Custom disconnected button */
            <button
              onClick={() => open()}
              className="rounded-md bg-[#312E81] px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-[#4338CA]"
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </header>
  )
}