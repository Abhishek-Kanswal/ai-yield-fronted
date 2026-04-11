"use client"

import Link from 'next/link'
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
          <Link href="#" className="font-bold text-[17px] text-muted-foreground hover:text-foreground transition-colors">Swap</Link>
          <Link href="/earn" className="font-bold text-[17px] text-muted-foreground hover:text-foreground transition-colors">Vaults</Link>
          <Link href="#" className="font-bold text-[17px] text-muted-foreground hover:text-foreground transition-colors">Transactions</Link>
        </nav>

        {/* Reown AppKit Connect Button */}
        <div className="ml-auto shrink-0">
          <appkit-button />
        </div>
      </div>
    </header>
  )
}