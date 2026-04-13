"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Loader2, Info, TrendingUp } from 'lucide-react'

const ITEMS_PER_PAGE = 10

const tvlFilters = [
  { label: "All TVL", value: null },
  { label: "> $1M", value: 1000000 },
  { label: "> $10M", value: 10000000 },
  { label: "> $100M", value: 100000000 },
]

const getChainLogo = (chain: string) => {
  const c = chain.toLowerCase()

  if (c.includes("eth"))
    return "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"

  if (c.includes("arb"))
    return "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png"

  if (c.includes("poly"))
    return "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png"

  if (c.includes("base"))
    return "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png"

  return "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png"
}

export default function EarnPage() {
  const router = useRouter()
  const [vaults, setVaults] = useState<any[]>([])
  const [tokenLogos, setTokenLogos] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [minTvl, setMinTvl] = useState<number | null>(null)
  const [selectedChain, setSelectedChain] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchTokenLogo = async (chain: string, address: string) => {
    try {
      const res = await fetch(`/api/token-logo?chain=${chain}&address=${address}`)
      if (res.ok) {
        const data = await res.json()
        return data.logo
      }
    } catch (err) {
      console.error("Failed to fetch logo for", address, err)
    }
    return null
  }

  useEffect(() => {
    const fetchVaults = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/vaults?limit=50&sortBy=tvl')
        if (!response.ok) throw new Error('Failed to fetch vaults')
        const data = await response.json()
        
        const mappedVaults = data.data.map((vault: any) => ({
          id: vault.address + '-' + vault.chainId,
          vaultAddress: vault.address,
          chainId: vault.chainId,
          name: vault.protocol?.name || "Vault",
          protocolLogo: vault.protocol?.logoUri,
          tokens: vault.underlyingTokens?.map((t: any) => t.symbol) || ['ETH'],
          chains: [vault.network.toLowerCase()],
          apy: vault.analytics?.apy?.total || 0,
          tvlUsd: Number(vault.analytics?.tvl?.usd || 0),
          tokenAddress: vault.underlyingTokens?.[0]?.address,
          chainName: vault.network,
          tokenAmount: (Number(vault.analytics?.tvl?.usd || 0) / 3200).toFixed(2)
        }))

        setVaults(mappedVaults)
        setLoading(false)

        mappedVaults.forEach(async (v: any) => {
          if (v.tokenAddress && v.chainName) {
            const logo = await fetchTokenLogo(v.chainName, v.tokenAddress)
            if (logo) {
              setTokenLogos(prev => ({ ...prev, [`${v.chainName}-${v.tokenAddress}`]: logo }))
            }
          }
        })

      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    }
    fetchVaults()
  }, [])

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
    return `$${value.toFixed(2)}`
  }

  const formatApy = (value: number) => `${(value * 100).toFixed(2)}%`

  const chains = Array.from(new Set(vaults.flatMap(v => v.chains || [])))
  const filteredVaults = vaults.filter(vault => {
    const matchesTvl = minTvl !== null ? (vault.tvlUsd || 0) >= minTvl : true
    const matchesChain = selectedChain ? vault.chains?.includes(selectedChain) : true
    return matchesTvl && matchesChain
  })

  const totalPages = Math.ceil(filteredVaults.length / ITEMS_PER_PAGE)
  const paginatedVaults = filteredVaults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const renderPageNumbers = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => { e.preventDefault(); setCurrentPage(i); }}
              className={currentPage === i ? "bg-[#312E81] text-white hover:bg-[#312E81]" : "text-[#312E81] hover:bg-[#E0E7FF]/40 border-[#E0E7FF]"}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationEllipsis className="text-[#312E81]/30" />
          </PaginationItem>
        )
      }
    }
    return pages
  }

  return (
    <main className="flex flex-col h-[calc(100vh-72px)] w-full font-sans overflow-hidden px-6 pb-6 pt-0 relative bg-[#F3F3F3]">
      <div className="flex-1 flex flex-col items-center gap-4 w-full bg-[#E0E7FF]/40 rounded-[10px] p-5 border border-[#C7D2FE]/50 overflow-y-auto min-h-0 custom-scrollbar">
        
        <div className="w-full max-w-5xl">
          <div className="mb-4 mt-2">
            <h1 className="text-4xl font-black text-[#312E81] tracking-tight mb-2">Earn & Yield</h1>
            <p className="text-[#312E81]/60 font-medium max-w-2xl">
              Discover high-performance DeFi vaults. Powered by <span className="text-[#6366F1] font-bold underline decoration-dotted">LI.FI</span>.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-5 p-3 bg-white rounded-2xl border border-[#E0E7FF] shadow-sm items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {tvlFilters.map(f => (
                <Badge
                  key={f.label}
                  variant={minTvl === f.value ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-1.5 text-xs font-bold transition-all ${minTvl === f.value ? 'bg-[#312E81]' : 'text-[#312E81]/60 hover:bg-gray-50'}`}
                  onClick={() => { setMinTvl(f.value); setCurrentPage(1); }}
                >
                  {f.label}
                </Badge>
              ))}
            </div>
            <div className="hidden md:block h-8 w-[1px] bg-gray-100"></div>
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              <Badge
                variant={selectedChain === null ? "default" : "outline"}
                className={`cursor-pointer px-4 py-1.5 text-xs font-bold ${selectedChain === null ? 'bg-[#312E81]' : 'text-[#312E81]/60'}`}
                onClick={() => { setSelectedChain(null); setCurrentPage(1); }}
              >
                All Chains
              </Badge>
              {chains.map(c => (
                <Badge
                  key={c}
                  variant={selectedChain === c ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-1.5 text-xs font-bold capitalize ${selectedChain === c ? 'bg-[#312E81]' : 'text-[#312E81]/60'}`}
                  onClick={() => { setSelectedChain(c); setCurrentPage(1); }}
                >
                  {c}
                </Badge>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#6366F1]" />
              <p className="text-[#312E81]/40 font-bold uppercase tracking-widest text-[10px]">Fetching Live Yields</p>
            </div>
          ) : error ? (
            <Card className="p-20 text-center border-red-100 bg-red-50/30">
              <p className="text-red-500 font-bold">{error}</p>
            </Card>
          ) : (
            <>
              <Card className="bg-white border border-[#E0E7FF] shadow-xl rounded-3xl overflow-hidden mb-6">
                
                {/* Updated Grid - APY & TVL pushed right by increasing first two fractions */}
                <div className="grid grid-cols-[2fr_1.5fr_1fr_1.2fr_80px] px-8 py-3 bg-white border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] items-center">
                  <div>Vault Asset</div>
                  <div>Protocol</div>
                  <div className="flex items-center gap-1">APY <Info className="w-3 h-3" /></div>
                  <div className="flex items-center gap-1">TVL <Info className="w-3 h-3" /></div>
                  <div></div>
                </div>

                <div className="divide-y divide-gray-100">
                  {paginatedVaults.map((vault) => {
                    const logoKey = `${vault.chainName}-${vault.tokenAddress}`;
                    const displayLogo = tokenLogos[logoKey] || vault.protocolLogo || getChainLogo('eth');

                    return (
                      <div 
                        key={vault.id} 
                        onClick={() => router.push(`/earn/${vault.chainId}/${vault.vaultAddress}`)}
                        className="grid grid-cols-[2fr_1.5fr_1fr_1.2fr_80px] px-8 py-4 items-center hover:bg-[#E0E7FF]/20 transition-all group cursor-pointer"
                      >
                        
                        {/* Column 1: Asset / Chain */}
                        <div className="flex items-center gap-4">
                          <div className="relative shrink-0">
                            <div className="w-11 h-11 rounded-full bg-white overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center">
                              <img src={displayLogo} className="w-full h-full object-cover" alt="token" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md border-2 border-white bg-white overflow-hidden shadow-sm flex items-center justify-center">
                              <img src={getChainLogo(vault.chainName)} className="w-3.5 h-3.5 object-contain" alt="chain" />
                            </div>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-black text-[#312E81] text-[15px] uppercase tracking-tight">{vault.tokens[0]}</span>
                            <span className="text-xs text-gray-400 font-bold capitalize">{vault.chainName}</span>
                          </div>
                        </div>

                        {/* Column 2: Protocol Name */}
                        <div className="flex items-center">
                          <span className="text-[13px] text-gray-600 font-medium truncate">
                            {vault.name}
                          </span>
                        </div>

                        {/* Column 3: APY */}
                        <div className="flex items-center gap-1 font-black text-[#111827] text-lg">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          {formatApy(vault.apy)}
                        </div>

                        {/* Column 4: TVL */}
                        <div className="flex flex-col">
                          <span className="font-bold text-[#312E81] text-[16px]">{formatCurrency(vault.tvlUsd)}</span>
                          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">
                            {vault.tokenAmount} {vault.tokens[0]}
                          </span>
                        </div>

                        {/* Column 5: Action Button */}
                        <div className="flex justify-end">
                          <button className="text-[13px] font-bold text-gray-400 group-hover:text-[#6366F1] bg-gray-50 group-hover:bg-[#E0E7FF]/50 px-4 py-2 rounded-lg transition-all border border-transparent group-hover:border-[#C7D2FE]/50">
                            View
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pb-10">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }}
                          className={`text-[#312E81] hover:bg-[#E0E7FF]/40 ${currentPage === 1 ? 'opacity-30 pointer-events-none' : ''}`}
                        />
                      </PaginationItem>
                      {renderPageNumbers()}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1); }}
                          className={`text-[#312E81] hover:bg-[#E0E7FF]/40 ${currentPage === totalPages ? 'opacity-30 pointer-events-none' : ''}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}