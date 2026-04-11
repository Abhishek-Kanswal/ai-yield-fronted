'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, DollarSign } from 'lucide-react'

interface Dapp {
    id: number | string
    name: string
    icon?: string
    logo?: string
    categories: string[]
    tags: string[]
    description: string
    tokens: string[]
    chains?: string[]
    website?: string
    twitter?: string
    score?: number
    apy?: number
    apy1dChange?: number
    tvlUsd?: number
    tvl1dChange?: number
    tokenLogo?: string
}

// Universal logo for chains and sub-tokens
const UNIVERSAL_LOGO = '/usd-coin-usdc-logo.svg'

export function DappCardSkeleton() {
    return (
        <Card className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col h-full overflow-hidden animate-pulse">
            <div className="flex flex-col relative">
                <div className="flex items-center gap-3.5 relative z-10 w-full">
                    <Skeleton className="w-11 h-11 rounded-full shrink-0" />
                    <div className="flex-1 flex items-center justify-between">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-6 w-8 rounded-md" />
                    </div>
                </div>
                <div className="relative mt-1.5 flex items-center">
                    <div className="absolute left-[21px] top-[-24px] w-[24px] h-[36px] border-l-2 border-b-2 border-dashed border-gray-200 rounded-bl-xl z-0"></div>
                    <div className="ml-[50px] flex items-center gap-2 relative z-10 pt-1">
                        <Skeleton className="w-5 h-5 rounded-full" />
                        <Skeleton className="h-4 w-10" />
                    </div>
                </div>
            </div>

            {/* Skeleton for the Yield Separator (Lines touching pill) */}
            <div className="relative flex items-center py-4 -mx-5">
                <div className="flex-grow border-t-2 border-gray-100"></div>
                <Skeleton className="w-16 h-6 rounded-full relative z-10" />
                <div className="flex-grow border-t-2 border-gray-100"></div>
            </div>

            {/* Skeleton for Financial Stats with 1d changes */}
            <div className="grid grid-cols-2 gap-3 mt-auto bg-gray-50/70 p-3 rounded-lg border border-gray-100">
                <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-10" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-3 w-8" />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-3 w-10" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-3 w-8" />
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default function DappCard({ dapp }: { dapp: Dapp }) {
    const formatCurrency = (value: number) => {
        if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
        if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
        if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
        return `$${value.toFixed(2)}`
    }

    const formatApy = (value: number) => {
        return `${(value * 100).toFixed(2)}%`
    }

    const formatChange = (value?: number) => {
        if (value === undefined) return null;
        const isPositive = value >= 0;
        return (
            <span className={`text-[10px] font-bold ml-1.5 tracking-tight ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{value.toFixed(2)}%
            </span>
        );
    }

    // Determine the main protocol logo
    const displayLogo = dapp.tokenLogo || dapp.logo

    // Dynamically display the sub-token if it exists, otherwise fallback to "UNI"
    const subTokenSymbol = dapp.tokens && dapp.tokens.length > 0 ? dapp.tokens[0].toUpperCase() : 'UNI'

    return (
        <Card className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col h-full overflow-hidden relative cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(149,157,165,0.12)] hover:border-gray-300 group">

            {/* Header Structure */}
            <div className="flex flex-col relative">
                {/* 1. Main Protocol Row */}
                <div className="flex items-center gap-3.5 relative z-10">
                    <div className="w-11 h-11 rounded-full bg-gray-50 border border-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
                        {displayLogo ? (
                            <img src={displayLogo} alt={`${dapp.name} main logo`} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xl">{dapp.icon}</span>
                        )}
                    </div>

                    {/* Name & Score Container */}
                    <div className="flex-1 min-w-0 flex items-center justify-between pr-1">
                        <h3 className="text-base font-bold text-gray-900 truncate tracking-tight group-hover:text-purple-700 transition-colors" title={dapp.name}>
                            {dapp.name}
                        </h3>
                        {/* Score Badge - Increased Size */}
                        <div className="bg-[#415a28] text-[#a4e14f] text-[13px] leading-none font-bold px-2 py-1.5 rounded-md shrink-0 ml-2 shadow-sm border border-[#526f34]/30">
                            {dapp.score || 99}
                        </div>
                    </div>
                </div>

                {/* 2. Connection Line & Sub-Token Row */}
                <div className="relative mt-1.5 flex items-center">
                    {/* Curved Dotted Line */}
                    <div className="absolute left-[21px] top-[-24px] w-[24px] h-[36px] border-l-2 border-b-2 border-dashed border-gray-300 rounded-bl-[10px] z-0 pointer-events-none group-hover:border-purple-300/60 transition-colors"></div>

                    {/* Sub Token */}
                    <div className="ml-[50px] flex items-center gap-1.5 relative z-10 pt-1">
                        <img
                            src={UNIVERSAL_LOGO}
                            className="w-5 h-5 object-contain rounded-full"
                            alt={subTokenSymbol}
                        />
                        <span className="text-[13px] font-semibold text-gray-600 tracking-wide uppercase">{subTokenSymbol}</span>
                    </div>
                </div>
            </div>

            {/* Yield Separator Line (Lines touching the pill directly) */}
            <div className="relative flex items-center -mx-5">
                <div className="flex-grow border-t-2 border-gray-100 group-hover:border-gray-200 transition-colors"></div>
                <div className="flex shrink-0 items-center gap-1.5 px-3 py-1 rounded-full border-2 border-gray-100 bg-white text-[11px] font-semibold text-gray-700 shadow-sm relative z-10 group-hover:border-purple-100 group-hover:text-purple-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m15 9-6 6"></path>
                        <path d="M9 9h.01"></path>
                        <path d="M15 15h.01"></path>
                    </svg>
                    Yield
                </div>
                <div className="flex-grow border-t-2 border-gray-100 group-hover:border-gray-200 transition-colors"></div>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-2 gap-3 mt-auto bg-gray-50/70 p-3 rounded-lg border border-gray-100 group-hover:bg-purple-50/30 group-hover:border-purple-100/50 transition-colors">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-purple-500" /> APY
                    </span>
                    <div className="flex items-baseline">
                        <span className="text-sm font-bold text-gray-900">
                            {dapp.apy !== undefined && dapp.apy > 0 ? formatApy(dapp.apy) : '---'}
                        </span>
                        {formatChange(dapp.apy1dChange)}
                    </div>
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-500" /> TVL
                    </span>
                    <div className="flex items-baseline">
                        <span className="text-sm font-bold text-gray-900">
                            {dapp.tvlUsd !== undefined && dapp.tvlUsd > 0 ? formatCurrency(dapp.tvlUsd) : '---'}
                        </span>
                        {formatChange(dapp.tvl1dChange)}
                    </div>
                </div>
            </div>

        </Card>
    )
}