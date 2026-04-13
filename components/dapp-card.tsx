'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, Info } from 'lucide-react'

interface Dapp {
    id: number | string
    name: string
    icon?: string
    logo?: string
    tokens: string[]
    chains?: string[]
    score?: number
    apy?: number
    tvlUsd?: number
    tokenLogo?: string
    chainLogo?: string 
    tokenAmount?: string
}

interface VaultListProps {
    dapps: Dapp[]
}

export default function VaultList({ dapps }: VaultListProps) {
    const formatCurrency = (value: number) => {
        if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(0)}B`
        if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`
        if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
        return `$${value.toFixed(2)}`
    }

    const formatApy = (value: number) => `${(value * 100).toFixed(2)}%`

    return (
        // Slightly increased max-width to comfortably fit the 5th column
        <div className="w-full max-w-5xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Top Vaults</h2>
            
            <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                {/* Table Header - Updated to 5 columns */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_0.5fr] px-6 py-3 bg-gray-50/50 border-b border-gray-100 text-[12px] font-semibold text-gray-500 uppercase tracking-wider">
                    <div>Vault</div>
                    <div>Protocol</div>
                    <div className="flex items-center gap-1">APY <Info className="w-3 h-3" /></div>
                    <div className="flex items-center gap-1">TVL <Info className="w-3 h-3" /></div>
                    <div className="text-right pr-2">Trust</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-gray-100">
                    {dapps.map((dapp) => (
                        <div 
                            key={dapp.id} 
                            // Updated grid to match the 5-column header
                            className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_0.5fr] px-6 py-5 items-center hover:bg-gray-50/80 transition-colors group cursor-pointer"
                        >
                            {/* Vault Column: Token + Chain */}
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    {/* Main Coin Logo - Now fully fitting the circle */}
                                    <div className="w-10 h-10 rounded-full bg-white overflow-hidden border border-gray-200 flex items-center justify-center">
                                        <img 
                                            src={dapp.tokenLogo || '/eth-logo.png'} 
                                            alt={dapp.tokens[0]} 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    {/* Chain Logo Overlay */}
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md border-2 border-white bg-white overflow-hidden shadow-sm">
                                        <img 
                                            src={dapp.chainLogo || '/arb-logo.png'} 
                                            alt={dapp.chains?.[0]} 
                                            className="w-full h-full object-contain" 
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-900 tracking-tight">
                                        {dapp.tokens[0]?.toUpperCase() || 'ETH'}
                                    </span>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {dapp.chains?.[0] || 'Ethereum'}
                                    </span>
                                </div>
                            </div>

                            {/* Protocol Column (Dapp Name) - Moved to its own column */}
                            <div className="flex items-center">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-semibold uppercase tracking-wider">
                                    {dapp.name}
                                </span>
                            </div>

                            {/* APY Column */}
                            <div className="font-bold text-gray-900 text-[15px]">
                                {dapp.apy ? formatApy(dapp.apy) : '---'}
                            </div>

                            {/* TVL Column */}
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-900">
                                    {dapp.tvlUsd ? formatCurrency(dapp.tvlUsd) : '---'}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {dapp.tokenAmount || '0.00'} {dapp.tokens[0]?.toUpperCase()}
                                </span>
                            </div>

                            {/* Trust Score Column - Now fixed width and centered */}
                            <div className="flex justify-end pr-2">
                                <div className="bg-[#eef8e6] text-[#415a28] text-[11px] font-bold w-10 h-6 flex items-center justify-center rounded-md border border-[#a4e14f]/30">
                                    {dapp.score || 99}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}