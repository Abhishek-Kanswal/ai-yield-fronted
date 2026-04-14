"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { Loader2, Info, TrendingUp, Search, X, ChevronDown, Check } from 'lucide-react'

// Embedded Data: Chains
const chains = [
  { chainId: 1, name: "Ethereum", networkCaip: "eip155:1", logo: "https://icons.llama.fi/chains/ethereum" },
  { chainId: 10, name: "Optimism", networkCaip: "eip155:10", logo: "https://icons.llama.fi/chains/optimism" },
  { chainId: 56, name: "BSC", networkCaip: "eip155:56", logo: "https://icons.llama.fi/chains/binance" },
  { chainId: 100, name: "Gnosis", networkCaip: "eip155:100", logo: "https://icons.llama.fi/chains/gnosis" },
  { chainId: 130, name: "Unichain", networkCaip: "eip155:130", logo: "https://icons.llama.fi/chains/unichain" },
  { chainId: 137, name: "Polygon", networkCaip: "eip155:137", logo: "https://icons.llama.fi/chains/polygon" },
  { chainId: 143, name: "Monad", networkCaip: "eip155:143", logo: "https://icons.llama.fi/chains/monad" },
  { chainId: 146, name: "Sonic", networkCaip: "eip155:146", logo: "https://icons.llama.fi/chains/sonic" },
  { chainId: 5000, name: "Mantle", networkCaip: "eip155:5000", logo: "https://icons.llama.fi/chains/mantle" },
  { chainId: 8453, name: "Base", networkCaip: "eip155:8453", logo: "https://icons.llama.fi/chains/base" },
  { chainId: 42161, name: "Arbitrum", networkCaip: "eip155:42161", logo: "https://icons.llama.fi/chains/arbitrum" },
  { chainId: 42220, name: "Celo", networkCaip: "eip155:42220", logo: "https://icons.llama.fi/chains/celo" },
  { chainId: 43114, name: "Avalanche", networkCaip: "eip155:43114", logo: "https://icons.llama.fi/chains/avalanche" },
  { chainId: 59144, name: "Linea", networkCaip: "eip155:59144", logo: "https://icons.llama.fi/chains/linea" },
  { chainId: 80094, name: "Berachain", networkCaip: "eip155:80094", logo: "https://icons.llama.fi/chains/berachain" },
  { chainId: 747474, name: "Katana", networkCaip: "eip155:747474", logo: "https://icons.llama.fi/chains/katana" },
];

// Embedded Data: Protocols
const protocols = [
  { name: "aave-v3", url: "https://app.aave.com/reserve-overview/?underlyingAsset=0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2&marketName=proto_mantle_v3", logo: "https://logo.clearbit.com/aave.com" },
  { name: "ethena-usde", url: "https://www.ethena.fi/", logo: "https://logo.clearbit.com/ethena.fi" },
  { name: "ether.fi-liquid", url: "https://app.ether.fi/liquid/usd", logo: "https://logo.clearbit.com/ether.fi" },
  { name: "ether.fi-stake", url: "https://ether.fi/app/weeth", logo: "https://logo.clearbit.com/ether.fi" },
  { name: "euler-v2", url: "https://app.euler.finance/vault/0xaF5372792a29dC6b296d6FFD4AA3386aff8f9BB2?network=ethereum", logo: "https://logo.clearbit.com/euler.finance" },
  { name: "maple", url: "https://app.maple.finance/earn", logo: "https://logo.clearbit.com/maple.finance" },
  { name: "morpho-v1", url: "https://app.morpho.org/base/vault/0x48a90E85be5C56b0A669985A12ee7C449fC79965", logo: "https://logo.clearbit.com/morpho.org" },
  { name: "neverland", url: "https://app.neverland.money/markets?asset=USDC", logo: "https://logo.clearbit.com/neverland.money" },
  { name: "pendle", url: "https://app.pendle.finance/trade/markets/0x8a8a557b90ec79496a18a1f9c9da8bbd7db86fd3/swap?view=pt&chain=arbitrum&py=output", logo: "https://logo.clearbit.com/pendle.finance" },
  { name: "upshift", url: "https://app.upshift.finance/pools/1/0xe1B4d34E8754600962Cd944B535180Bd758E6c2e", logo: "https://logo.clearbit.com/upshift.finance" },
  { name: "yo-protocol", url: "https://app.yo.xyz/vault/base/0x0000000f2eB9f69274678c76222B35eEc7588a65", logo: "https://logo.clearbit.com/yo.xyz" },
];

const ITEMS_PER_PAGE = 10

// Helper generic token logos for the UI filter clusters
const TOKEN_LOGOS = {
  usdc: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
  usdt: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
  dai: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
  eth: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  weth: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
  wbtc: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  pyusd: "https://cryptologos.cc/logos/paypal-usd-pyusd-logo.png",
  rlusd: "https://cryptologos.cc/logos/ripple-usd-rlusd-logo.png",
  usds: "https://cryptologos.cc/logos/sky-usds-logo.png",
  eurc: "https://cryptologos.cc/logos/euro-coin-eurc-logo.png",
};

// Common assets for the dropdown
const commonAssets = [
  { symbol: "USDC", logo: TOKEN_LOGOS.usdc },
  { symbol: "USDT", logo: TOKEN_LOGOS.usdt },
  { symbol: "DAI", logo: TOKEN_LOGOS.dai },
  { symbol: "ETH", logo: TOKEN_LOGOS.eth },
  { symbol: "WETH", logo: TOKEN_LOGOS.weth },
  { symbol: "WBTC", logo: TOKEN_LOGOS.wbtc },
  { symbol: "PYUSD", logo: TOKEN_LOGOS.pyusd },
  { symbol: "RLUSD", logo: TOKEN_LOGOS.rlusd },
  { symbol: "USDS", logo: TOKEN_LOGOS.usds },
  { symbol: "EURC", logo: TOKEN_LOGOS.eurc },
];

export default function EarnPage() {
  const router = useRouter()
  const [vaults, setVaults] = useState<any[]>([])
  const [tokenLogos, setTokenLogos] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter States
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<'tvl' | 'apy'>('tvl')
  const [selectedChain, setSelectedChain] = useState<number | null>(null)
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [showStablecoins, setShowStablecoins] = useState(false)

  // Dropdown UI State
  const [openDropdown, setOpenDropdown] = useState<'chain' | 'protocol' | 'asset' | null>(null)

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
        const response = await fetch('/api/vaults?limit=50')
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

  // Filtering and Sorting Logic
  const filteredVaults = vaults.filter(vault => {
    // 1. Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const matchesName = vault.name.toLowerCase().includes(q)
      const matchesToken = vault.tokens.some((t: string) => t.toLowerCase().includes(q))
      if (!matchesName && !matchesToken) return false
    }
    
    // 2. Stablecoin filter
    if (showStablecoins) {
      const isStable = vault.tokens.some((t: string) => ['USDC', 'USDT', 'DAI', 'FRAX'].includes(t.toUpperCase()))
      if (!isStable) return false
    }

    // 3. Chain filter
    if (selectedChain && vault.chainId !== selectedChain) {
      return false
    }

    // 4. Protocol filter (Fuzzy Matching to handle API variations like "Aave V3" vs "aave-v3")
    if (selectedProtocol) {
      // Grab the primary keyword (e.g., "aave", "morpho", "ether.fi")
      const protocolKeyword = selectedProtocol.toLowerCase().split('-')[0]; 
      if (!vault.name.toLowerCase().includes(protocolKeyword)) {
        return false;
      }
    }

    // 5. Asset filter (Handle Wrapped versions like WETH vs ETH automatically)
    if (selectedAsset) {
      const targetAsset = selectedAsset.toUpperCase();
      const hasAsset = vault.tokens.some((t: string) => {
        const token = t.toUpperCase();
        return token === targetAsset || token === `W${targetAsset}` || `W${token}` === targetAsset;
      });
      if (!hasAsset) return false;
    }

    return true
  }).sort((a, b) => {
    if (sortBy === 'tvl') return b.tvlUsd - a.tvlUsd
    if (sortBy === 'apy') return b.apy - a.apy
    return 0
  })

  const totalPages = Math.ceil(filteredVaults.length / ITEMS_PER_PAGE)
  const paginatedVaults = filteredVaults.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleClearFilters = () => {
    setSearchQuery("")
    setSortBy('tvl')
    setSelectedChain(null)
    setSelectedProtocol(null)
    setSelectedAsset(null)
    setShowStablecoins(false)
    setCurrentPage(1)
  }

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

  // Get active items for button display
  const activeChain = chains.find(c => c.chainId === selectedChain);
  const activeProtocol = protocols.find(p => p.name.toLowerCase() === selectedProtocol?.toLowerCase());
  const activeAssetObj = commonAssets.find(a => a.symbol === selectedAsset);

  return (
    <main className="flex flex-col h-[calc(100vh-72px)] w-full font-sans overflow-hidden px-6 pb-6 pt-0 relative bg-[#F3F3F3]">
      
      {/* FIXED: The invisible overlay must be behind the filter bar, but in the root to catch all clicks */}
      {openDropdown && (
        <div className="fixed inset-0 z-[40]" onClick={() => setOpenDropdown(null)} />
      )}

      {/* Removed the 'relative z-10' trap from this flex container */}
      <div className="flex-1 flex flex-col items-center gap-4 w-full bg-[#E0E7FF]/40 rounded-[10px] p-5 border border-[#C7D2FE]/50 overflow-y-auto min-h-0 custom-scrollbar">
        
        <div className="w-full max-w-6xl">
          <div className="mb-4 mt-2">
            <h1 className="text-4xl font-black text-[#312E81] tracking-tight mb-2">Earn & Yield</h1>
            <p className="text-[#312E81]/60 font-medium max-w-2xl">
              Discover high-performance DeFi vaults. Powered by <span className="text-[#6366F1] font-bold underline decoration-dotted">LI.FI</span>.
            </p>
          </div>

          {/* FIXED: Filter Bar z-index set to 50 to sit above the invisible overlay */}
          <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-3 rounded-2xl border border-[#E0E7FF] shadow-sm relative z-[50]">
            
            {/* Chains Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'chain' ? null : 'chain')}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors ${selectedChain ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-[#F8FAFC] hover:bg-slate-100'}`}
              >
                {activeChain ? (
                  <img src={activeChain.logo} className="w-5 h-5 rounded-full object-cover" alt={activeChain.name} />
                ) : (
                  <div className="flex -space-x-1.5 shrink-0">
                    <img src={chains[0]?.logo} className="w-5 h-5 rounded-full border border-white relative z-30 bg-white object-cover" alt="1" />
                    <img src={chains[1]?.logo} className="w-5 h-5 rounded-full border border-white relative z-20 bg-white object-cover" alt="2" />
                    <img src={chains[5]?.logo} className="w-5 h-5 rounded-full border border-white relative z-10 bg-white object-cover" alt="3" />
                  </div>
                )}
                <span className={`text-[13px] font-bold whitespace-nowrap ${selectedChain ? 'text-indigo-700' : 'text-slate-500'}`}>
                  {activeChain ? activeChain.name : 'All Chains'}
                </span>
                <ChevronDown className={`w-4 h-4 ${selectedChain ? 'text-indigo-400' : 'text-slate-400'}`} />
              </button>

              {openDropdown === 'chain' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 max-h-[320px] overflow-y-auto custom-scrollbar">
                  <button 
                    onClick={() => { setSelectedChain(null); setOpenDropdown(null); setCurrentPage(1); }}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <span>All Chains</span>
                    {selectedChain === null && <Check className="w-4 h-4 text-indigo-500" />}
                  </button>
                  {chains.map(chain => (
                    <button 
                      key={chain.chainId}
                      onClick={() => { setSelectedChain(chain.chainId); setOpenDropdown(null); setCurrentPage(1); }}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img src={chain.logo} alt={chain.name} className="w-5 h-5 rounded-full object-cover" />
                        <span>{chain.name}</span>
                      </div>
                      {selectedChain === chain.chainId && <Check className="w-4 h-4 text-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Protocols Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'protocol' ? null : 'protocol')}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors ${selectedProtocol ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-[#F8FAFC] hover:bg-slate-100'}`}
              >
                {activeProtocol ? (
                  <img src={activeProtocol.logo} className="w-5 h-5 rounded-full object-cover" alt={activeProtocol.name} />
                ) : (
                  <div className="flex -space-x-1.5 shrink-0">
                    <img src={protocols[0]?.logo} className="w-5 h-5 rounded-full border border-white relative z-30 bg-white object-cover" alt="1" />
                    <img src={protocols[1]?.logo} className="w-5 h-5 rounded-full border border-white relative z-20 bg-white object-cover" alt="2" />
                    <img src={protocols[2]?.logo} className="w-5 h-5 rounded-full border border-white relative z-10 bg-white object-cover" alt="3" />
                  </div>
                )}
                <span className={`text-[13px] font-bold whitespace-nowrap capitalize ${selectedProtocol ? 'text-indigo-700' : 'text-slate-500'}`}>
                  {activeProtocol ? activeProtocol.name.replace('-', ' ') : 'All Protocols'}
                </span>
                <ChevronDown className={`w-4 h-4 ${selectedProtocol ? 'text-indigo-400' : 'text-slate-400'}`} />
              </button>

              {/* FIXED: Removed scrollbar constraint for Protocol to show all items openly */}
              {openDropdown === 'protocol' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl p-2">
                  <button 
                    onClick={() => { setSelectedProtocol(null); setOpenDropdown(null); setCurrentPage(1); }}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <span>All Protocols</span>
                    {selectedProtocol === null && <Check className="w-4 h-4 text-indigo-500" />}
                  </button>
                  {protocols.map(protocol => (
                    <button 
                      key={protocol.name}
                      onClick={() => { setSelectedProtocol(protocol.name); setOpenDropdown(null); setCurrentPage(1); }}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img src={protocol.logo} alt={protocol.name} className="w-5 h-5 rounded-full object-cover" />
                        <span className="capitalize">{protocol.name.replace('-', ' ')}</span>
                      </div>
                      {selectedProtocol === protocol.name && <Check className="w-4 h-4 text-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Assets Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'asset' ? null : 'asset')}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors ${selectedAsset ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-[#F8FAFC] hover:bg-slate-100'}`}
              >
                {activeAssetObj ? (
                  <img src={activeAssetObj.logo} className="w-5 h-5 rounded-full object-cover" alt={activeAssetObj.symbol} />
                ) : (
                  <div className="flex -space-x-1.5 shrink-0">
                    <img src={TOKEN_LOGOS.usdc} className="w-5 h-5 rounded-full border border-white relative z-30 bg-white object-cover" alt="usdc" />
                    <img src={TOKEN_LOGOS.eth} className="w-5 h-5 rounded-full border border-white relative z-20 bg-white object-cover" alt="eth" />
                    <img src={TOKEN_LOGOS.wbtc} className="w-5 h-5 rounded-full border border-white relative z-10 bg-white object-cover" alt="wbtc" />
                  </div>
                )}
                <span className={`text-[13px] font-bold whitespace-nowrap ${selectedAsset ? 'text-indigo-700' : 'text-slate-500'}`}>
                  {activeAssetObj ? activeAssetObj.symbol : 'All Assets'}
                </span>
                <ChevronDown className={`w-4 h-4 ${selectedAsset ? 'text-indigo-400' : 'text-slate-400'}`} />
              </button>

              {openDropdown === 'asset' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 max-h-[320px] overflow-y-auto custom-scrollbar">
                  <button 
                    onClick={() => { setSelectedAsset(null); setOpenDropdown(null); setCurrentPage(1); }}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <span>All Assets</span>
                    {selectedAsset === null && <Check className="w-4 h-4 text-indigo-500" />}
                  </button>
                  {commonAssets.map(asset => (
                    <button 
                      key={asset.symbol}
                      onClick={() => { setSelectedAsset(asset.symbol); setOpenDropdown(null); setCurrentPage(1); }}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img src={asset.logo} alt={asset.symbol} className="w-5 h-5 rounded-full object-cover" />
                        <span>{asset.symbol}</span>
                      </div>
                      {selectedAsset === asset.symbol && <Check className="w-4 h-4 text-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stablecoins Toggle */}
            <button 
              onClick={() => { setShowStablecoins(!showStablecoins); setCurrentPage(1); }}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors ${showStablecoins ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
            >
              <div className="flex -space-x-1.5 shrink-0">
                <img src={TOKEN_LOGOS.usdc} className="w-5 h-5 rounded-full border border-white relative z-20 bg-white object-cover" alt="usdc" />
                <img src={TOKEN_LOGOS.usdt} className="w-5 h-5 rounded-full border border-white relative z-10 bg-white object-cover" alt="usdt" />
                <img src={TOKEN_LOGOS.dai} className="w-5 h-5 rounded-full border border-white relative z-0 bg-white object-cover" alt="dai" />
              </div>
              <span className="text-[13px] font-bold text-slate-500 whitespace-nowrap">Stablecoins</span>
            </button>

            {/* Sort Toggle (Top TVL / Top APY) */}
            <button 
              onClick={() => { setSortBy(sortBy === 'tvl' ? 'apy' : 'tvl'); setCurrentPage(1); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <span className="text-[13px] font-bold text-slate-500 whitespace-nowrap">
                {sortBy === 'tvl' ? 'Top TVL' : 'Top APY'}
              </span>
            </button>

            {/* Clear Filters */}
            {(searchQuery || showStablecoins || sortBy !== 'tvl' || selectedChain || selectedProtocol || selectedAsset) && (
              <button 
                onClick={handleClearFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-full border border-dashed border-slate-300 text-slate-400 hover:text-slate-600 hover:border-slate-400 bg-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span className="text-[13px] font-medium whitespace-nowrap">Clear</span>
              </button>
            )}

            {/* Spacer for right alignment */}
            <div className="flex-grow"></div>

            {/* Search Input */}
            <div className="relative flex items-center w-full md:w-auto min-w-[200px]">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search vaults..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200 bg-[#F8FAFC] text-sm text-slate-700 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
              />
            </div>

            {/* Info Icon */}
            <button className="text-slate-400 hover:text-slate-600 transition-colors ml-1 hidden md:block">
              <Info className="w-5 h-5" />
            </button>
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
                
                {/* Grid Header */}
                <div className="grid grid-cols-[2.5fr_1.5fr_1fr_1.2fr_80px] gap-6 px-8 py-3 bg-white border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-[0.15em] items-center">
                  <div>Vault Asset</div>
                  <div>Protocol</div>
                  <div 
                    className="flex items-center gap-1 cursor-pointer hover:text-indigo-500 transition-colors"
                    onClick={() => setSortBy('apy')}
                  >
                    APY {sortBy === 'apy' && <TrendingUp className="w-3 h-3 text-indigo-500" />}
                  </div>
                  <div 
                    className="flex items-center gap-1 cursor-pointer hover:text-indigo-500 transition-colors"
                    onClick={() => setSortBy('tvl')}
                  >
                    TVL {sortBy === 'tvl' && <TrendingUp className="w-3 h-3 text-indigo-500" />}
                  </div>
                  <div></div>
                </div>

                <div className="divide-y divide-gray-100">
                  {paginatedVaults.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 font-medium">
                      No vaults found matching your filters.
                    </div>
                  ) : (
                    paginatedVaults.map((vault) => {
                      const matchedChain = chains.find(c => c.chainId === vault.chainId) || chains.find(c => c.name.toLowerCase() === vault.chainName.toLowerCase());
                      const chainLogoDisplay = matchedChain?.logo || "https://icons.llama.fi/chains/ethereum";

                      const matchedProtocol = protocols.find(p => p.name.toLowerCase() === vault.name.toLowerCase());
                      const protocolLogoDisplay = matchedProtocol?.logo || vault.protocolLogo;
                      
                      const logoKey = `${vault.chainName}-${vault.tokenAddress}`;
                      const displayLogo = tokenLogos[logoKey] || protocolLogoDisplay || TOKEN_LOGOS.eth;

                      return (
                        <div 
                          key={vault.id} 
                          onClick={() => router.push(`/earn/${vault.chainId}/${vault.vaultAddress}`)}
                          className="grid grid-cols-[2.5fr_1.5fr_1fr_1.2fr_80px] gap-6 px-8 py-4 items-center hover:bg-[#E0E7FF]/20 transition-all group cursor-pointer"
                        >
                          {/* Column 1: Asset / Chain */}
                          <div className="flex items-center gap-4">
                            <div className="relative shrink-0">
                              <div className="w-11 h-11 rounded-full bg-white overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center p-0.5">
                                <img src={displayLogo} className="w-full h-full object-cover rounded-full" alt="token" />
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md border-2 border-white bg-white overflow-hidden shadow-sm flex items-center justify-center">
                                <img src={chainLogoDisplay} className="w-3.5 h-3.5 object-contain rounded-full" alt="chain" />
                              </div>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-black text-[#312E81] text-[15px] uppercase tracking-tight">{vault.tokens[0]}</span>
                              <span className="text-xs text-gray-400 font-bold capitalize">{vault.chainName}</span>
                            </div>
                          </div>

                          {/* Column 2: Protocol Name */}
                          <div className="flex items-center gap-2">
                            {protocolLogoDisplay && (
                              <img src={protocolLogoDisplay} className="w-5 h-5 rounded-full object-cover" alt="protocol" />
                            )}
                            <span className="text-[13px] text-gray-600 font-medium truncate capitalize">
                              {vault.name.replace('-', ' ')}
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
                    })
                  )}
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