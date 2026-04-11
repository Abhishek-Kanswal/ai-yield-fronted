"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, ArrowRightLeft, Pencil, Fuel, ChevronDown, ReceiptText, ArrowDownUp } from "lucide-react"
import HeroText from "@/components/HomePageText"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("SWAP")

  return (
    <main className="flex flex-col h-[calc(100vh-72px)] w-full font-sans overflow-hidden px-6 pb-6 pt-0 relative">

      {/* Main Container - Using our #E0E7FF wash for the background */}
      <div className="flex-1 flex flex-col items-center gap-6 w-full bg-[#E0E7FF]/40 rounded-[40px] rounded-t-none p-5 border border-[#C7D2FE]/50 overflow-y-auto min-h-0">

        <HeroText />

        {/* Main Card */}
        <div className="w-full max-w-[460px] rounded-[32px] bg-white p-4 shadow-xl border border-[#E0E7FF] relative z-10 shrink-0 mt-4">

          {/* Header Area: Integrated Toggle & Actions */}
          <div className="mb-6 flex items-center justify-between px-2 pt-2">

            {/* Integrated Toggle */}
            <div className="flex rounded-full bg-[#E0E7FF]/50 p-1 shadow-inner">
              <button
                onClick={() => setActiveTab("SWAP")}
                className={`rounded-full px-6 py-2 text-[14px] font-bold transition-all duration-200 ${activeTab === "SWAP"
                    ? "bg-[#312E81] text-white shadow-sm"
                    : "text-[#312E81]/60 hover:text-[#312E81]"
                  }`}
              >
                Swap
              </button>
              <button
                onClick={() => setActiveTab("BRIDGE")}
                className={`rounded-full px-6 py-2 text-[14px] font-bold transition-all duration-200 ${activeTab === "BRIDGE"
                    ? "bg-[#312E81] text-white shadow-sm"
                    : "text-[#312E81]/60 hover:text-[#312E81]"
                  }`}
              >
                Bridge
              </button>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E0E7FF]/50 text-[#312E81] transition-colors hover:bg-[#C7D2FE]">
                <ReceiptText className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E0E7FF]/50 text-[#312E81] transition-colors hover:bg-[#C7D2FE]">
                <Settings className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Framer Motion Wrapper */}
          <AnimatePresence mode="wait">

            {/* BRIDGE UI */}
            {activeTab === "BRIDGE" && (
              <motion.div
                key="bridge"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {/* Network Selectors */}
                <div className="relative mb-3 flex items-center gap-1.5">
                  <div className="flex flex-1 cursor-pointer items-center gap-3 rounded-[24px] bg-gray-50 hover:bg-[#E0E7FF]/30 p-3.5 transition-colors border border-transparent hover:border-[#E0E7FF]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0052FF]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="white" />
                        <path d="M7 12H17" stroke="#0052FF" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-semibold text-gray-500">From</span>
                      <span className="text-[15px] font-bold text-[#312E81]">Base</span>
                    </div>
                  </div>

                  <div className="absolute left-1/2 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[4px] border-white bg-gray-100 text-[#312E81] transition-transform hover:scale-105 hover:bg-[#E0E7FF] cursor-pointer shadow-sm">
                    <ArrowRightLeft className="h-3.5 w-3.5" strokeWidth={3} />
                  </div>

                  <div className="flex flex-1 cursor-pointer items-center justify-end gap-3 rounded-[24px] bg-gray-50 hover:bg-[#E0E7FF]/30 p-3.5 transition-colors border border-transparent hover:border-[#E0E7FF]">
                    <div className="flex flex-col items-end">
                      <span className="text-[13px] font-semibold text-gray-500">To</span>
                      <span className="text-[15px] font-bold text-[#312E81]">Arbitrum One</span>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#121A2F]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M6 18L12 6L18 18" stroke="#28A0F0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 14H15" stroke="#28A0F0" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M12 6L18 18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }} />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Input Section */}
                <div className="mb-3 rounded-[28px] bg-gray-50 p-5 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      defaultValue="1"
                      className="w-full bg-transparent text-[44px] font-medium tracking-tight text-[#312E81] outline-none placeholder:text-gray-300"
                    />
                    <button className="flex shrink-0 items-center gap-1.5 rounded-full bg-white pl-2 pr-3 py-1.5 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#627EEA]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                          <path d="M11.999 19.2201L11.999 23.9961L0.00390625 11.9961L11.999 19.2201Z" fill="white" fillOpacity="0.6" />
                          <path d="M12.0001 19.2201L23.9951 11.9961L12.0001 23.9961L12.0001 19.2201Z" fill="white" />
                          <path d="M11.999 0L0.00390625 11.9961L11.999 15.3681L11.999 0Z" fill="white" fillOpacity="0.6" />
                          <path d="M12.0001 0L12.0001 15.3681L23.9951 11.9961L12.0001 0Z" fill="white" />
                          <path d="M0.00390625 11.9961L11.999 15.3681L11.999 11.9961L0.00390625 11.9961Z" fill="white" fillOpacity="0.6" />
                          <path d="M23.9951 11.9961L12.0001 11.9961L12.0001 15.3681L23.9951 11.9961Z" fill="white" fillOpacity="0.6" />
                        </svg>
                      </div>
                      <span className="font-bold text-[#312E81] text-sm">ETH</span>
                      <ChevronDown className="h-4 w-4 text-gray-500 ml-0.5" strokeWidth={2.5} />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[15px] font-medium text-gray-500">$2,992.15</span>
                    <span className="text-[14px] font-semibold text-gray-500">1.24 ETH available</span>
                  </div>
                </div>

                {/* Destination Address */}
                <div className="mb-3 flex items-center justify-between rounded-[24px] bg-gray-50 border border-gray-100 p-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-semibold text-gray-500">Destination address</span>
                    <span className="text-[15px] font-bold text-[#312E81]">0x4c1288...2874D7c3</span>
                  </div>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#312E81] shadow-sm border border-gray-100 hover:bg-[#E0E7FF]/50 transition-colors">
                    <Pencil className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </div>

                {/* Summary Card */}
                <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#627EEA]">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                            <path d="M12.0001 0L12.0001 15.3681L23.9951 11.9961L12.0001 0Z" fill="white" />
                            <path d="M11.999 0L0.00390625 11.9961L11.999 15.3681L11.999 0Z" fill="white" fillOpacity="0.7" />
                          </svg>
                        </div>
                        <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#121A2F]">
                          <span className="text-[6px] text-[#28A0F0] font-bold">A</span>
                        </div>
                      </div>
                      <span className="text-[15px] font-bold text-[#312E81]">
                        1 ETH <span className="text-gray-400 font-medium">($2,988.9)</span>
                      </span>
                    </div>
                    <div className="rounded-full bg-gray-50 border border-gray-100 px-3 py-1.5">
                      <span className="text-[13px] font-bold text-gray-500">~2 secs</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 border border-gray-100">
                      <div className="flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M12 0L20 12L12 24L4 12L12 0Z" fill="url(#paint0_linear)" />
                          <defs>
                            <linearGradient id="paint0_linear" x1="4" y1="0" x2="20" y2="24" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FF66A3" />
                              <stop offset="1" stopColor="#627EEA" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                      <span className="text-[13px] font-bold text-gray-600">$3.25 fee</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-gray-50 px-3 py-1.5 border border-gray-100">
                      <Fuel className="h-3.5 w-3.5 text-gray-400" strokeWidth={2.5} />
                      <span className="text-[13px] font-bold text-gray-600">$0.0022</span>
                    </div>
                  </div>
                </div>

                {/* Confirm Button - Using our vivid primary action color */}
                <button className="h-[56px] w-full rounded-[20px] bg-[#6366F1] text-[17px] font-bold text-white shadow-md hover:bg-[#4F46E5] active:scale-[0.98] transition-all flex justify-center items-center gap-2">
                  Confirm transaction
                </button>
              </motion.div>
            )}

            {/* SWAP UI */}
            {activeTab === "SWAP" && (
              <motion.div
                key="swap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {/* Base Network Selector */}
                <div className="mb-2 px-2">
                  <button className="flex items-center gap-2 rounded-xl py-1 transition-opacity hover:opacity-80">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0052FF]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="white" />
                        <path d="M7 12H17" stroke="#0052FF" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className="text-[16px] font-bold text-[#312E81]">Base</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" strokeWidth={3} />
                  </button>
                </div>

                {/* Swap Cards Container */}
                <div className="relative mb-6 flex flex-col gap-1">

                  {/* Pay With Card */}
                  <div className="rounded-[24px] bg-gray-50 p-4 pb-5 border border-gray-100 transition-colors focus-within:border-[#C7D2FE] focus-within:bg-[#E0E7FF]/20">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-gray-500">Pay with</span>
                      <div className="flex items-center gap-3 text-[13px] font-bold text-[#6366F1]">
                        <button className="hover:text-[#4F46E5] transition-colors">30%</button>
                        <button className="hover:text-[#4F46E5] transition-colors">50%</button>
                        <button className="hover:text-[#4F46E5] transition-colors">MAX</button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button className="flex shrink-0 items-center gap-2 rounded-full py-1 pr-2 transition-opacity hover:opacity-80 bg-white border border-gray-100 shadow-sm pl-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#627EEA]">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                            <path d="M12.0001 0L12.0001 15.3681L23.9951 11.9961L12.0001 0Z" fill="white" />
                            <path d="M11.999 0L0.00390625 11.9961L11.999 15.3681L11.999 0Z" fill="white" fillOpacity="0.7" />
                            <path d="M12.0001 19.2201L23.9951 11.9961L12.0001 23.9961L12.0001 19.2201Z" fill="white" />
                            <path d="M11.999 19.2201L11.999 23.9961L0.00390625 11.9961L11.999 19.2201Z" fill="white" fillOpacity="0.7" />
                          </svg>
                        </div>
                        <span className="text-[18px] font-bold text-[#312E81]">ETH</span>
                        <ChevronDown className="h-5 w-5 text-[#6366F1]" strokeWidth={2.5} />
                      </button>

                      <input
                        type="text"
                        defaultValue="0"
                        className="w-full bg-transparent text-right text-[32px] font-medium text-[#312E81] outline-none placeholder:text-gray-300 transition-colors"
                        dir="rtl"
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[13px] font-medium text-gray-500">Balance: 0.000097</span>
                    </div>
                  </div>

                  {/* Swap Middle Button */}
                  <div className="absolute left-1/2 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white">
                    <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-[#312E81] transition-colors hover:bg-[#E0E7FF] border border-gray-200 hover:border-[#C7D2FE]">
                      <ArrowDownUp className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Receive Card */}
                  <div className="rounded-[24px] bg-gray-50 p-4 pt-5 border border-gray-100 transition-colors focus-within:border-[#C7D2FE] focus-within:bg-[#E0E7FF]/20">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-gray-500">Receive</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button className="flex shrink-0 items-center gap-2 rounded-full py-1 pr-2 transition-opacity hover:opacity-80 bg-white border border-gray-100 shadow-sm pl-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#26A17B]">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#26A17B" />
                            <path d="M13.25 9.5V17.5H10.75V9.5H7.5V7H16.5V9.5H13.25Z" fill="white" />
                          </svg>
                        </div>
                        <span className="text-[18px] font-bold text-[#312E81]">USDT</span>
                        <ChevronDown className="h-5 w-5 text-[#6366F1]" strokeWidth={2.5} />
                      </button>

                      <input
                        type="text"
                        defaultValue="0"
                        className="w-full bg-transparent text-right text-[32px] font-medium text-[#312E81] outline-none placeholder:text-gray-300 transition-colors"
                        dir="rtl"
                        readOnly
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[13px] font-medium text-gray-500">Balance: 0</span>
                    </div>
                  </div>
                </div>

                {/* Action Button - Inactive State */}
                <button className="h-[56px] w-full rounded-[20px] bg-[#E0E7FF]/60 text-[17px] font-bold text-[#312E81]/50 cursor-not-allowed transition-all">
                  Enter an amount
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </main>
  )
}