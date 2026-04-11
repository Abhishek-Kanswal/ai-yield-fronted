'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Globe, TrendingUp, DollarSign } from 'lucide-react'

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
    tvlUsd?: number
    tokenLogo?: string
}

const chainLogos: Record<string, string> = {
    eth: '/etherum.jpg',
    ethereum: '/etherum.jpg',
    arbitrum: '/arbitrum.jpg',
    base: '/base.jpg',
    bnb: '/bnb.jpg',
    bitcoin: '/bitcoin.jpg',
    solana: '/solana.jpg',
}

export function DappCardSkeleton() {
    return (
        <Card className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col h-full animate-pulse">
            <div className="flex items-center gap-4 mb-4">
                <Skeleton className="w-11 h-11 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
                <Skeleton className="h-14 rounded-lg" />
                <Skeleton className="h-14 rounded-lg" />
            </div>
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                <div className="flex gap-2">
                    <Skeleton className="w-5 h-5 rounded-full" />
                    <Skeleton className="w-5 h-5 rounded-full" />
                </div>
                <Skeleton className="w-5 h-5 rounded-full" />
            </div>
        </Card>
    )
}

export default function DappCard({ dapp }: { dapp: Dapp }) {
    // Extract Twitter username from URL
    const getTwitterUsername = (url?: string): string | null => {
        if (!url) return null
        const match = url.match(/(?:x\.com|twitter\.com)\/([^\/\?]+)/)
        return match ? match[1] : null
    }

    const formatCurrency = (value: number) => {
        if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
        if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
        if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
        return `$${value.toFixed(2)}`
    }

    const formatApy = (value: number) => {
        return `${(value * 100).toFixed(2)}%`
    }

    // Use tokenLogo (already fetched at page level), fallback to protocol logo, then icon
    const displayLogo = dapp.tokenLogo || dapp.logo

    return (
        <Card className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-purple-200 hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full group">
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-4">
                <div className="w-11 h-11 rounded-full bg-gray-50 border border-gray-100 shrink-0 overflow-hidden shadow-sm group-hover:border-purple-100 transition-colors">
                    {displayLogo ? (
                        <img src={displayLogo} alt={`${dapp.name} logo`} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xl">{dapp.icon}</span>
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 truncate tracking-tight" title={dapp.name}>{dapp.name}</h3>
                    {dapp.tags.length > 0 && (
                        <Badge variant="secondary" className="bg-gray-100/80 text-gray-500 text-[10px] px-1.5 py-0 mt-1 font-medium">
                            {dapp.tags[0]}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4 bg-gray-50/70 p-3 rounded-lg border border-gray-100">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-purple-500" /> APY
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                        {dapp.apy !== undefined && dapp.apy > 0 ? formatApy(dapp.apy) : '---'}
                    </span>
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-500" /> TVL
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                        {dapp.tvlUsd !== undefined && dapp.tvlUsd > 0 ? formatCurrency(dapp.tvlUsd) : '---'}
                    </span>
                </div>
            </div>

            {/* Footer - Social Links & Chain Logos */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                {/* Social Links - Left */}
                <div className="flex gap-2.5">
                    {dapp.twitter && (
                        <a
                            href={`https://www.ethos.network/profile/x/${getTwitterUsername(dapp.twitter)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 transition-colors w-4 h-4 flex items-center justify-center"
                            title="Ethos Profile"
                        >
                            <img src="/ethos2.svg" alt="Ethos" className="w-4 h-4" />
                        </a>
                    )}
                    {dapp.website && (
                        <a
                            href={dapp.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="Website"
                        >
                            <Globe className="w-4 h-4" />
                        </a>
                    )}
                    {dapp.twitter && (
                        <a
                            href={dapp.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title="X (Twitter)"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                    )}
                </div>

                {/* Chain Logos - Right */}
                {dapp.chains && dapp.chains.length > 0 && (
                    <div className="flex items-center gap-1">
                        {dapp.chains.slice(0, 3).map((chain) => (
                            chainLogos[chain] && (
                                <img
                                    key={chain}
                                    src={chainLogos[chain]}
                                    alt={`${chain} logo`}
                                    className="w-4.5 h-4.5 rounded-full"
                                    title={chain.charAt(0).toUpperCase() + chain.slice(1)}
                                />
                            )
                        ))}
                        {dapp.chains.length > 3 && (
                            <span className="w-4.5 h-4.5 rounded-full bg-purple-100 text-purple-700 text-[9px] font-medium flex items-center justify-center">
                                +{dapp.chains.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Card>
    )
}