"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, ArrowRightLeft, Pencil, Fuel, ChevronDown, ReceiptText, ArrowDownUp, Search, X, Loader2 } from "lucide-react"
import HeroText from "@/components/HomePageText"
import { getChains, getTokens, getRoutes, executeRoute, Chain, Token, Route } from "@lifi/sdk"
import { useAccount, useWalletClient, useBalance } from "wagmi"
import { toast } from "sonner"
import { formatUnits, parseUnits } from "viem"

const BLOCKED_TOKEN_ADDRESSES = new Set([
  "0x1e08ae9bf59dfc14a28d2f9e61ce4be007881617",
])

const PREFERRED_TOKEN_SYMBOLS = ["ETH", "WETH", "USDC", "USDT", "DAI"]

function isBlockedToken(token: Token | null | undefined): boolean {
  if (!token) return false
  return BLOCKED_TOKEN_ADDRESSES.has(token.address.toLowerCase())
}

function selectDefaultToken(chainTokens: Token[] = []): Token | null {
  if (!chainTokens.length) return null

  for (const symbol of PREFERRED_TOKEN_SYMBOLS) {
    const match = chainTokens.find(
      (token) => token.symbol?.toUpperCase() === symbol && !isBlockedToken(token)
    )
    if (match) return match
  }

  return chainTokens.find((token) => !isBlockedToken(token)) || null
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("SWAP")
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  // Data states
  const [chains, setChains] = useState<Chain[]>([])
  const [tokens, setTokens] = useState<Record<number, Token[]>>({})

  // Selection states
  const [fromChain, setFromChain] = useState<Chain | null>(null)
  const [toChain, setToChain] = useState<Chain | null>(null)
  const [fromToken, setFromToken] = useState<Token | null>(null)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState("1")

  // Quote states
  const [quote, setQuote] = useState<Route | null>(null)
  const [isFetchingQuote, setIsFetchingQuote] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)

  // Modal states
  const [modalType, setModalType] = useState<"chainFrom" | "chainTo" | "tokenFrom" | "tokenTo" | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Balance states
  const { data: fromBalance } = useBalance({
    address,
    chainId: fromChain?.id,
    query: {
      enabled: !!address && !!fromChain && !!fromToken
    }
  })

  const { data: toBalance } = useBalance({
    address,
    chainId: toChain?.id,
    query: {
      enabled: !!address && !!toChain && !!toToken
    }
  })

  // Fetch chains on mount
  useEffect(() => {
    async function loadChains() {
      try {
        const supportedChains = await getChains()
        setChains(supportedChains)
        // Set some defaults
        const ethChain = supportedChains.find(c => c.id === 1) || supportedChains[0]
        const arbChain = supportedChains.find(c => c.id === 42161) || supportedChains[0]
        setFromChain(ethChain)
        setToChain(arbChain)
      } catch (err) {
        setChains([])
      }
    }
    loadChains()
  }, [])

  // Enforce SAME chain for SWAP tab
  useEffect(() => {
    if (activeTab === "SWAP" && fromChain) {
      setToChain(fromChain)
    }
  }, [activeTab, fromChain])

  // Fetch tokens when a chain is selected
  useEffect(() => {
    async function loadTokens(chainId: number) {
      if (tokens[chainId]) return; // already loaded
      try {
        const result = await getTokens({ chains: [chainId] })
        const chainTokens = result.tokens[chainId] || []
        setTokens(prev => ({ ...prev, [chainId]: chainTokens }))

        // Set default token if none selected
        if (!fromToken && chainId === fromChain?.id) {
          setFromToken(selectDefaultToken(chainTokens))
        }
        if (!toToken && chainId === toChain?.id) {
          setToToken(selectDefaultToken(chainTokens))
        }
      } catch (err) {
        setTokens(prev => ({ ...prev, [chainId]: [] }))
      }
    }
    if (fromChain) loadTokens(fromChain.id)
    if (toChain) loadTokens(toChain.id)
  }, [fromChain, toChain])

  // Fetch Quote Debounced
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!fromChain || !toChain || !fromToken || !toToken || !fromAmount || parseFloat(fromAmount) === 0) {
        setQuote(null)
        return
      }

      if (isBlockedToken(fromToken) || isBlockedToken(toToken)) {
        setQuote(null)
        return
      }
      
      if (activeTab === "BRIDGE" && fromChain.id === toChain.id) {
        setQuote(null)
        return
      }

      setIsFetchingQuote(true)
      try {
        const parsedAmount = parseUnits(fromAmount, fromToken.decimals).toString()
        const routesResponse = await getRoutes({
          fromChainId: fromChain.id,
          toChainId: toChain.id,
          fromTokenAddress: fromToken.address,
          toTokenAddress: toToken.address,
          fromAmount: parsedAmount,
          ...(address ? { fromAddress: address } : {})
        })
        
        if (routesResponse.routes && routesResponse.routes.length > 0) {
          setQuote(routesResponse.routes[0])
        } else {
          setQuote(null)
        }
      } catch (error) {
        setQuote(null)
      } finally {
        setIsFetchingQuote(false)
      }
    }, 600) // 600ms debounce

    return () => clearTimeout(handler)
  }, [fromChain, toChain, fromToken, toToken, fromAmount, address, activeTab])

  // Execute Swap
  const handleExecute = async () => {
    if (!quote || !walletClient || !address) {
      toast.error("Please connect wallet and get a valid quote first.")
      return
    }

    setIsExecuting(true)
    const toastId = toast.loading("Executing transaction...")

    try {
      // Execute the route. LI.FI SDK EVM provider uses wagmiConfig to handle switching inside web3-provider.tsx
      await executeRoute(quote, {
        updateRouteHook: (updatedRoute) => {
          console.log("Route updated:", updatedRoute)
          // Look for status messages in steps
          const currentStep = updatedRoute.steps.find((s: any) => s.execution?.status === 'PENDING')
          if (currentStep) {
            toast.loading(`Processing: ${currentStep.tool}`, { id: toastId })
          }
        }
      })

      toast.success("Transaction completed successfully!", { id: toastId })
      // Reset after success
      setFromAmount("")
      setQuote(null)
    } catch (error: any) {
      console.error("Execution failed:", error)
      toast.error(error?.message || "Transaction failed.", { id: toastId })
    } finally {
      setIsExecuting(false)
    }
  }

  // Derived values for UI
  const quoteEstimate = (quote as any)?.estimate

  const fromBalanceFormatted = fromBalance
    ? formatUnits(fromBalance.value, fromBalance.decimals)
    : "0"

  const toBalanceFormatted = toBalance
    ? formatUnits(toBalance.value, toBalance.decimals)
    : "0"

  const toAmountFormatted = quoteEstimate && toToken
    ? formatUnits(BigInt(quoteEstimate.toAmount ?? "0"), toToken.decimals)
    : "0"

  const executionDuration = quoteEstimate
    ? Math.ceil((quoteEstimate.executionDuration ?? 0) / 60) + " min"
    : "~"

  const gasFeeUsd = quoteEstimate
    ? parseFloat(quoteEstimate.gasCosts?.[0]?.amountUSD || "0").toFixed(2)
    : "0"

  // Token prices and conversions
  const fromTokenPrice = fromToken ? parseFloat(fromToken.priceUSD || "0") : 0
  const toTokenPrice = toToken ? parseFloat(toToken.priceUSD || "0") : 0

  const fromAmountUsd = (parseFloat(fromAmount || "0") * fromTokenPrice).toFixed(2)
  const toAmountUsd = (parseFloat(toAmountFormatted || "0") * toTokenPrice).toFixed(2)

  const fromConversionRate = fromTokenPrice > 0 ? (1 / fromTokenPrice).toFixed(6) : "0"

  // Balance Validation
  const hasInsufficientBalance = Boolean(
    address &&
    fromBalance &&
    fromAmount &&
    parseFloat(fromAmount) > parseFloat(fromBalanceFormatted)
  )
      
  const isSameChainBridge = activeTab === "BRIDGE" && fromChain?.id === toChain?.id

  const filteredChains = chains.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  const currentModalTokens = modalType === 'tokenFrom' && fromChain
    ? tokens[fromChain.id] || []
    : modalType === 'tokenTo' && toChain
      ? tokens[toChain.id] || []
      : []

  const filteredTokens = currentModalTokens.filter(t =>
    t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openModal = (type: "chainFrom" | "chainTo" | "tokenFrom" | "tokenTo") => {
    setSearchQuery("")
    setModalType(type)
  }

  const selectChain = (c: Chain) => {
    if (modalType === "chainFrom") {
      setFromChain(c)
      setFromToken(null) // Reset token on chain switch
      if (activeTab === "SWAP") setToChain(c)
    } else {
      setToChain(c)
      setToToken(null)
    }
    setModalType(null)
  }

  const selectToken = (t: Token) => {
    if (modalType === "tokenFrom") setFromToken(t)
    else setToToken(t)
    setModalType(null)
  }

  return (
    <main className="flex flex-col h-[calc(100vh-72px)] w-full font-sans overflow-hidden px-6 pb-6 pt-0 relative bg-[#F3F3F3]">
      <div className="flex-1 flex flex-col items-center gap-6 w-full bg-[#E0E7FF]/40 rounded-[40px] rounded-t-none p-5 border border-[#C7D2FE]/50 overflow-y-auto min-h-0">
        <HeroText />

        <div className="w-full max-w-115 rounded-4xl bg-white p-4 shadow-xl border border-[#E0E7FF] relative z-10 shrink-0 mt-4">
          <div className="mb-6 flex items-center justify-between px-2 pt-2">
            <div className="flex rounded-full bg-[#E0E7FF]/50 p-1 shadow-inner">
              <button
                onClick={() => setActiveTab("SWAP")}
                className={`rounded-full px-6 py-2 text-[14px] font-bold transition-all duration-200 ${activeTab === "SWAP" ? "bg-[#312E81] text-white shadow-sm" : "text-[#312E81]/60 hover:text-[#312E81]"
                  }`}
              >
                Swap
              </button>
              <button
                onClick={() => setActiveTab("BRIDGE")}
                className={`rounded-full px-6 py-2 text-[14px] font-bold transition-all duration-200 ${activeTab === "BRIDGE" ? "bg-[#312E81] text-white shadow-sm" : "text-[#312E81]/60 hover:text-[#312E81]"
                  }`}
              >
                Bridge
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E0E7FF]/50 text-[#312E81] hover:bg-[#C7D2FE]">
                <ReceiptText className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E0E7FF]/50 text-[#312E81] hover:bg-[#C7D2FE]">
                <Settings className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "BRIDGE" && (
              <motion.div key="bridge" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <div className="relative mb-3 flex items-center gap-1.5">
                  {/* From Chain */}
                  <div onClick={() => openModal('chainFrom')} className="flex flex-1 cursor-pointer items-center gap-3 rounded-3xl bg-gray-50 hover:bg-[#E0E7FF]/30 p-3.5 border border-transparent hover:border-[#E0E7FF]">
                    {fromChain?.logoURI ? (
                      <img src={fromChain.logoURI} alt={fromChain.name} className="h-10 w-10 rounded-xl bg-white" />
                    ) : (
                      <div className="flex h-10 w-10 rounded-xl bg-gray-200 animate-pulse" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-gray-500">From</span>
                      <span className="text-[15px] font-bold text-[#312E81]">{fromChain?.name || "Select"}</span>
                    </div>
                  </div>

                  <div className="absolute left-1/2 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-gray-100 text-[#312E81] shadow-sm">
                    <ArrowRightLeft className="h-3.5 w-3.5" strokeWidth={3} />
                  </div>

                  {/* To Chain */}
                  <div onClick={() => openModal('chainTo')} className="flex flex-1 cursor-pointer items-center justify-end gap-3 rounded-3xl bg-gray-50 hover:bg-[#E0E7FF]/30 p-3.5 border border-transparent hover:border-[#E0E7FF]">
                    <div className="flex flex-col items-end">
                      <span className="text-[13px] font-semibold text-gray-500">To</span>
                      <span className="text-[15px] font-bold text-[#312E81]">{toChain?.name || "Select"}</span>
                    </div>
                    {toChain?.logoURI ? (
                      <img src={toChain.logoURI} alt={toChain.name} className="h-10 w-10 rounded-xl bg-white" />
                    ) : (
                      <div className="flex h-10 w-10 rounded-xl bg-gray-200 animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-3 rounded-[28px] bg-gray-50 p-5 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <input
                      type="number"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-transparent text-[44px] font-medium tracking-tight text-[#312E81] outline-none placeholder:text-gray-300"
                    />
                    <button onClick={() => openModal('tokenFrom')} className="flex shrink-0 items-center gap-1.5 rounded-full bg-white pl-2 pr-3 py-1.5 shadow-sm border border-gray-100 hover:bg-gray-50">
                      {fromToken ? (
                        <img src={fromToken.logoURI} alt={fromToken.symbol} className="h-7 w-7 rounded-full" />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-gray-200" />
                      )}
                      <span className="font-bold text-[#312E81] text-sm">{fromToken?.symbol || "Select"}</span>
                      <ChevronDown className="h-4 w-4 text-gray-500 ml-0.5" strokeWidth={2.5} />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[14px] font-medium text-gray-500">
                      ${fromAmountUsd}
                    </span>
                    {fromToken && address && fromBalance && parseFloat(fromBalanceFormatted) > 0 && (
                      <span className="text-[13px] font-medium text-gray-500 cursor-pointer hover:text-[#6366F1]" onClick={() => setFromAmount(fromBalanceFormatted)}>
                        {parseFloat(fromBalanceFormatted).toFixed(4)} {fromToken.symbol}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-3 flex items-center justify-between rounded-3xl bg-gray-50 border border-gray-100 p-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-semibold text-gray-500">Destination address</span>
                    <span className="text-[15px] font-bold text-[#312E81]">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}</span>
                  </div>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#312E81] shadow-sm border border-gray-100">
                    <Pencil className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </div>

                {/* Summary */}
                {quote && !isFetchingQuote && (
                  <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          {toToken && <img src={toToken.logoURI} alt={toToken.symbol} className="h-7 w-7 rounded-full" />}
                        </div>
                        <span className="text-[15px] font-bold text-[#312E81]">
                          {parseFloat(toAmountFormatted).toFixed(4)} {toToken?.symbol}
                          <span className="text-gray-400 font-medium ml-1">(${toAmountUsd})</span>
                        </span>
                      </div>
                      <div className="rounded-full bg-gray-50 border border-gray-100 px-3 py-1.5">
                        <span className="text-[13px] font-bold text-gray-500">~{executionDuration}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 border border-gray-100">
                        <span className="text-[13px] font-bold text-gray-600">Gas fee: ${gasFeeUsd}</span>
                      </div>
                    </div>
                  </div>)}

                {isFetchingQuote && (
                  <div className="mb-6 flex justify-center py-4 text-gray-400">
                    <Loader2 className="animate-spin h-6 w-6" />
                  </div>
                )}

                <button 
                  onClick={handleExecute}
                  disabled={!quote || isExecuting || !address || hasInsufficientBalance || isSameChainBridge}
                  className={`h-14 w-full rounded-[20px] shadow-md active:scale-[0.98] transition-all flex justify-center items-center gap-2 text-[17px] font-bold ${
                    hasInsufficientBalance 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-[#6366F1] text-white disabled:bg-[#E0E7FF] disabled:text-[#312E81]/50'
                  }`}>
                  {isExecuting ? "Processing..." : !address ? "Connect Wallet" : isSameChainBridge ? "Select different chains" : hasInsufficientBalance ? "Insufficient Balance" : quote ? "Confirm transaction" : "Enter amount"}
                </button>
              </motion.div>
            )}

            {activeTab === "SWAP" && (
              <motion.div key="swap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                <div className="mb-2 px-2">
                  <button onClick={() => openModal('chainFrom')} className="flex items-center gap-2 rounded-xl py-1 hover:opacity-80">
                    {fromChain?.logoURI ? (
                      <img src={fromChain.logoURI} alt={fromChain.name} className="h-6 w-6 rounded-full" />
                    ) : <div className="h-6 w-6 rounded-full bg-gray-200" />}
                    <span className="text-[16px] font-bold text-[#312E81]">{fromChain?.name || "Select Network"}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" strokeWidth={3} />
                  </button>
                </div>

                <div className="relative mb-6 flex flex-col gap-1">
                  <div className="rounded-3xl bg-gray-50 p-4 pb-5 border border-gray-100">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-gray-500">Pay with</span>
                      {fromToken && address && fromBalance && parseFloat(fromBalanceFormatted) > 0 && (
                        <span className="text-[13px] font-medium text-gray-500 cursor-pointer hover:text-[#6366F1]" onClick={() => setFromAmount(fromBalanceFormatted)}>
                          {parseFloat(fromBalanceFormatted).toFixed(4)} {fromToken.symbol}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <button onClick={() => openModal('tokenFrom')} className="flex shrink-0 items-center gap-2 rounded-full py-1 pr-2 hover:opacity-80 bg-white border border-gray-100 shadow-sm pl-2">
                        {fromToken?.logoURI ? (
                          <img src={fromToken.logoURI} alt={fromToken.symbol} className="h-8 w-8 rounded-full" />
                        ) : <div className="h-8 w-8 rounded-full bg-gray-200" />}
                        <span className="text-[18px] font-bold text-[#312E81]">{fromToken?.symbol || "Select"}</span>
                        <ChevronDown className="h-5 w-5 text-[#6366F1]" strokeWidth={2.5} />
                      </button>
                      <input type="number" value={fromAmount} onChange={(e) => setFromAmount(e.target.value)} placeholder="0" className="w-full bg-transparent text-right text-[32px] font-medium text-[#312E81] outline-none" dir="rtl" />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[13px] font-medium text-gray-500 opacity-0">spacer</span>
                      <span className="text-[14px] font-medium text-gray-500 text-right">
                        ${fromAmountUsd}
                      </span>
                    </div>
                  </div>

                  <div className="absolute left-1/2 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white">
                    <button onClick={() => { setFromToken(toToken); setToToken(fromToken); }} className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-[#312E81] border border-gray-200 hover:bg-[#E0E7FF]">
                      <ArrowDownUp className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="rounded-3xl bg-gray-50 p-4 pt-5 border border-gray-100">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-gray-500">Receive</span>
                      {toToken && address && toBalance && parseFloat(toBalanceFormatted) > 0 && (
                        <span className="text-[13px] font-medium text-gray-500">
                          {parseFloat(toBalanceFormatted).toFixed(4)} {toToken.symbol}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <button onClick={() => openModal('tokenTo')} className="flex shrink-0 items-center gap-2 rounded-full py-1 pr-2 hover:opacity-80 bg-white border border-gray-100 shadow-sm pl-2">
                        {toToken?.logoURI ? (
                          <img src={toToken.logoURI} alt={toToken.symbol} className="h-8 w-8 rounded-full" />
                        ) : <div className="h-8 w-8 rounded-full bg-gray-200" />}
                        <span className="text-[18px] font-bold text-[#312E81]">{toToken?.symbol || "Select"}</span>
                        <ChevronDown className="h-5 w-5 text-[#6366F1]" strokeWidth={2.5} />
                      </button>
                      {isFetchingQuote ? (
                        <div className="flex-1 flex justify-end pr-2"><Loader2 className="h-6 w-6 animate-spin text-[#6366F1]" /></div>
                      ) : (
                        <input type="text" value={parseFloat(toAmountFormatted).toFixed(4)} className="w-full bg-transparent text-right text-[32px] font-medium text-[#312E81] outline-none" dir="rtl" readOnly />
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      {quote ? (
                        <span className="text-[13px] font-medium text-gray-500">Est. Gas: ${gasFeeUsd}</span>
                      ) : <span className="opacity-0">spacer</span>}

                      <span className="text-[14px] font-medium text-gray-500 text-right">
                        ${toAmountUsd}
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleExecute}
                  disabled={!quote || isExecuting || !address || hasInsufficientBalance}
                  className={`h-14 w-full rounded-[20px] shadow-md active:scale-[0.98] transition-all flex justify-center items-center gap-2 text-[17px] font-bold ${
                    hasInsufficientBalance 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-[#6366F1] text-white disabled:bg-[#E0E7FF] disabled:text-[#312E81]/50'
                  }`}>
                  {isExecuting ? "Processing..." : !address ? "Connect Wallet" : hasInsufficientBalance ? "Insufficient Balance" : quote ? "Confirm Swap" : "Enter an amount"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dynamic Modals */}
      <AnimatePresence>
        {modalType && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-100 h-137.5 flex flex-col rounded-4xl bg-white shadow-2xl overflow-hidden border border-gray-100">
              <div className="flex items-center justify-between p-5 pb-3">
                <h3 className="text-[18px] font-bold text-[#312E81]">
                  Select {modalType.includes('chain') ? "Network" : "Token"}
                </h3>
                <button onClick={() => setModalType(null)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-5 pb-3">
                <div className="flex items-center gap-2 rounded-[20px] bg-gray-50 p-3 border border-gray-100 focus-within:border-[#C7D2FE] focus-within:bg-[#E0E7FF]/20 transition-colors">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search name or paste address"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent outline-none text-[15px] font-medium text-[#312E81] placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-3 pb-3 custom-scrollbar">
                {modalType.includes('chain') ? (
                  filteredChains.map((c) => (
                    <button key={c.id} onClick={() => selectChain(c)} className="flex w-full items-center gap-4 rounded-2xl p-3 hover:bg-gray-50 transition-colors text-left group">
                      {c.logoURI && <img src={c.logoURI} alt={c.name} className="h-9 w-9 rounded-full bg-white shadow-sm" />}
                      <span className="text-[16px] font-bold text-[#312E81]">{c.name}</span>
                    </button>
                  ))
                ) : (
                  filteredTokens.map((t) => (
                    <button key={t.address} onClick={() => selectToken(t)} className="flex w-full items-center gap-4 rounded-2xl p-3 hover:bg-gray-50 transition-colors text-left group">
                      {t.logoURI ? <img src={t.logoURI} alt={t.symbol} className="h-9 w-9 rounded-full bg-white shadow-sm" /> : <div className="h-9 w-9 rounded-full bg-gray-200" />}
                      <div className="flex flex-col">
                        <span className="text-[16px] font-bold text-[#312E81]">{t.symbol}</span>
                        <span className="text-[13px] font-medium text-gray-500">{t.name}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}