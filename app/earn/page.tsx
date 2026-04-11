"use client"

import { useState, useEffect, useCallback } from 'react'
import DappCard from '@/components/dapp-card'
import { Badge } from '@/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Loader2 } from 'lucide-react'

const ITEMS_PER_PAGE = 9

const tvlFilters = [
  { label: "All TVL", value: null },
  { label: "> $1M", value: 1000000 },
  { label: "> $10M", value: 10000000 },
  { label: "> $100M", value: 100000000 },
]

// Batch fetch token logos from Moralis via our API proxy
async function fetchTokenLogos(
  vaults: { tokenAddress?: string; chainName?: string }[]
): Promise<Record<string, string>> {
  const logoMap: Record<string, string> = {}
  const toFetch = vaults.filter(v => v.tokenAddress && v.chainName)

  // Fetch in parallel with a concurrency limit of 5
  const batchSize = 5
  for (let i = 0; i < toFetch.length; i += batchSize) {
    const batch = toFetch.slice(i, i + batchSize)
    const results = await Promise.allSettled(
      batch.map(async v => {
        const key = `${v.chainName}-${v.tokenAddress}`
        try {
          const res = await fetch(`/api/token-logo?chain=${v.chainName}&address=${v.tokenAddress}`)
          if (res.ok) {
            const data = await res.json()
            if (data.logo) {
              logoMap[key] = data.logo
            }
          }
        } catch {
          // silently skip failed logos
        }
      })
    )
  }

  return logoMap
}

export default function EarnPage() {
  const [vaults, setVaults] = useState<any[]>([])
  const [tokenLogos, setTokenLogos] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [minTvl, setMinTvl] = useState<number | null>(null)
  const [selectedChain, setSelectedChain] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchVaults = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/vaults?limit=100&sortBy=tvl')
        if (!response.ok) throw new Error('Failed to fetch vaults')

        const data = await response.json()
        if (data.error) throw new Error(data.error)

        const mappedVaults = data.data.map((vault: any) => ({
          id: vault.address + '-' + vault.chainId,
          name: vault.name || vault.protocol?.name + " Vault",
          logo: vault.protocol?.logoUri,
          icon: "🏦",
          categories: vault.tags?.length > 0 ? vault.tags : ["Yield"],
          tags: [vault.protocol?.name, ...(vault.underlyingTokens?.map((t: any) => t.symbol) || [])].filter(Boolean),
          description: "",
          tokens: vault.underlyingTokens?.map((t: any) => t.symbol.toLowerCase()) || [],
          chains: [vault.network.toLowerCase()],
          website: vault.protocol?.url || "#",
          apy: vault.analytics?.apy?.total || 0,
          tvlUsd: Number(vault.analytics?.tvl?.usd || 0),
          score: vault.analytics?.apy?.total ? Math.round(vault.analytics.apy.total * 10000) : 1000,
          tokenAddress: vault.underlyingTokens?.[0]?.address,
          chainName: vault.network
        }))

        setVaults(mappedVaults)
        setLoading(false)

        // Fetch token logos in background after vaults load (non-blocking)
        const logosNeeded = mappedVaults
          .filter((v: any) => !v.logo && v.tokenAddress && v.chainName)
        if (logosNeeded.length > 0) {
          fetchTokenLogos(logosNeeded).then(setTokenLogos)
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching vaults')
        setLoading(false)
      }
    }

    fetchVaults()
  }, [])

  const chains = Array.from(new Set(vaults.flatMap(v => v.chains || [])))

  const filteredVaults = vaults.filter(vault => {
    const matchesTvl = minTvl !== null ? (vault.tvlUsd || 0) >= minTvl : true
    const matchesChain = selectedChain ? vault.chains?.includes(selectedChain) : true
    return matchesTvl && matchesChain
  })

  const totalPages = Math.ceil(filteredVaults.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedVaults = filteredVaults.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleTvlChange = (tvl: number | null) => {
    setMinTvl(tvl)
    setCurrentPage(1)
  }

  const handleChainChange = (chain: string | null) => {
    setSelectedChain(chain)
    setCurrentPage(1)
  }

  return (
    <div className="w-full">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-gray-900">
            Earn &amp; Yield
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Discover and deposit into top DeFi vaults with a single click. Powered by <span className="font-semibold text-purple-600">LI.FI Composer</span> for seamless cross-chain routing directly into yield protocols.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Minimum TVL</span>
            <div className="flex flex-wrap gap-2">
              {tvlFilters.map(filter => (
                <Badge 
                  key={filter.label}
                  variant={minTvl === filter.value ? "default" : "outline"}
                  className="cursor-pointer hover:bg-gray-100/10 text-sm py-1 px-3"
                  onClick={() => handleTvlChange(filter.value)}
                >
                  {filter.label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Chain</span>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={selectedChain === null ? "default" : "outline"}
                className="cursor-pointer hover:bg-gray-100/10 text-sm py-1 px-3"
                onClick={() => handleChainChange(null)}
              >
                All Chains
              </Badge>
              {chains.map(chain => (
                <Badge 
                  key={chain}
                  variant={selectedChain === chain ? "default" : "outline"}
                  className="cursor-pointer hover:bg-gray-100/10 text-sm py-1 px-3 capitalize"
                  onClick={() => handleChainChange(chain)}
                >
                  {chain}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Grid or Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-24 flex-col gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            <p className="text-gray-500 font-medium">Fetching live vaults from LI.FI...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24 flex-col gap-4">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedVaults.map(vault => {
              const logoKey = `${vault.chainName}-${vault.tokenAddress}`
              return (
                <DappCard
                  key={vault.id}
                  dapp={{
                    ...vault,
                    tokenLogo: tokenLogos[logoKey] || undefined
                  }}
                />
              )
            })}
            {paginatedVaults.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                No vaults found matching your current filters.
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="pt-8 pb-8 border-t border-gray-100 mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, i) => {
                  if (i === 0 || i === totalPages - 1 || (i >= currentPage - 2 && i <= currentPage)) {
                    return (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  if (i === currentPage - 3 || i === currentPage + 1) {
                    return (
                      <PaginationItem key={i}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
