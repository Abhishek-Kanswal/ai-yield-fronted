"use client";

import React, { useState } from 'react';
import { Copy, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Type Definitions ---
interface Asset {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

interface Position {
  chainId: number;
  protocolName: string;
  asset: Asset;
  balanceUsd: string;
  balanceNative: string;
}

export interface GroupedProtocol {
  protocolName: string;
  totalUsd: number;
  positions: Position[];
}

interface WalletClientProps {
  initialProtocols: GroupedProtocol[];
  walletBalance: { whole: string; decimal: string };
  walletAddress: string;
}

// Helper to truncate wallet address
function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function WalletClient({ initialProtocols, walletBalance, walletAddress }: WalletClientProps) {
  // --- State ---
  const [protocols, setProtocols] = useState<GroupedProtocol[]>(initialProtocols);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Update state to include chainId to make sure we delete the EXACT right position
  const [itemToDelete, setItemToDelete] = useState<{ protocolName: string; assetAddress: string; chainId: number } | null>(null);

  // --- Pagination Logic ---
  const PROTOCOLS_PER_PAGE = 3;
  const totalPages = Math.ceil(protocols.length / PROTOCOLS_PER_PAGE);
  const paginatedProtocols = protocols.slice(
    (currentPage - 1) * PROTOCOLS_PER_PAGE,
    currentPage * PROTOCOLS_PER_PAGE
  );

  // --- Handlers ---
  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;

    const updatedProtocols = protocols.map(protocol => {
      // Only modify the protocol the deleted item belongs to
      if (protocol.protocolName === itemToDelete.protocolName) {
        
        // Filter out ONLY the specific position that matches both address AND chainId
        const newPositions = protocol.positions.filter(
          pos => !(pos.asset.address === itemToDelete.assetAddress && pos.chainId === itemToDelete.chainId)
        );
        
        // Recalculate protocol total USD with remaining positions
        const newTotalUsd = newPositions.reduce((sum, pos) => sum + (Number(pos.balanceUsd) || 0), 0);
        
        return { ...protocol, positions: newPositions, totalUsd: newTotalUsd };
      }
      return protocol;
    })
    // CRITICAL: This filters out the entire protocol ONLY if it has 0 positions left
    .filter(protocol => protocol.positions.length > 0); 

    setProtocols(updatedProtocols);
    setItemToDelete(null);

    // Adjust pagination if we deleted the last item on the current page
    if (updatedProtocols.length <= (currentPage - 1) * PROTOCOLS_PER_PAGE && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-10 font-sans text-slate-900 px-4 pb-20">
      
      {/* --- Delete Confirmation Modal --- */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900">Delete Position?</h3>
            <p className="text-slate-500 text-sm">
              Are you sure you want to hide this asset from your view? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 mt-4">
              <button 
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md flex flex-col gap-8">
        
        {/* --- SECTION 1: Wallet Info --- */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <span className="text-xl font-medium tracking-tight text-slate-800">
              {truncateAddress(walletAddress)}
            </span>
            <button className="p-1 hover:bg-slate-100 rounded-md transition-colors group">
              <Copy size={18} strokeWidth={2} className="text-slate-400 group-hover:text-slate-900" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden grid grid-cols-5 grid-rows-5 shadow-sm border border-slate-100 flex-shrink-0">
              <div className="bg-fuchsia-600"></div><div className="bg-purple-800"></div><div className="bg-purple-800"></div><div className="bg-purple-800"></div><div className="bg-fuchsia-600"></div>
              <div className="bg-purple-800"></div><div className="bg-green-500"></div><div className="bg-green-500"></div><div className="bg-green-500"></div><div className="bg-purple-800"></div>
              <div className="bg-green-500"></div><div className="bg-green-500"></div><div className="bg-purple-800"></div><div className="bg-green-500"></div><div className="bg-green-500"></div>
              <div className="bg-purple-800"></div><div className="bg-purple-800"></div><div className="bg-purple-800"></div><div className="bg-purple-800"></div><div className="bg-purple-800"></div>
              <div className="bg-fuchsia-600"></div><div className="bg-green-500"></div><div className="bg-green-500"></div><div className="bg-green-500"></div><div className="bg-fuchsia-600"></div>
            </div>

            <div className="text-6xl font-bold tracking-tighter flex items-baseline">
              ${walletBalance.whole}<span className="text-slate-400 font-semibold">.{walletBalance.decimal}</span>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: Dynamic Protocols --- */}
        <div className="flex flex-col gap-8">
          {paginatedProtocols.length === 0 ? (
            <div className="text-slate-500 mt-4 px-1">No positions found for this wallet.</div>
          ) : (
            paginatedProtocols.map((protocol) => {
              const formattedProtocolTotal = protocol.totalUsd.toFixed(2).split('.');

              return (
                <div key={protocol.protocolName} className="flex flex-col gap-6">
                  <hr className="w-full max-w-md border-slate-200" />
                  
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-[10px] text-white font-bold uppercase overflow-hidden">
                      {protocol.protocolName.substring(0, 3)}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{protocol.protocolName}</h2>
                  </div>

                  <div className="text-4xl font-bold tracking-tighter">
                    ${formattedProtocolTotal[0]}<span className="text-slate-300">.{formattedProtocolTotal[1] || '00'}</span>
                  </div>

                  <div className="space-y-5">
                    {protocol.positions.map((pos, index) => {
                      const posUsd = Number(pos.balanceUsd);
                      const posNative = Number(pos.balanceNative);

                      return (
                        <div key={`${pos.asset.address}-${pos.chainId}-${index}`} className="space-y-3 group relative">
                          <h3 className="text-sm font-semibold text-slate-500">
                            {protocol.protocolName} Yield: {pos.asset.symbol} Pool
                          </h3>
                          <div className="flex items-center justify-between">
                            
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                                <div className="w-6 h-6 bg-slate-400 rounded-full opacity-80" />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{pos.asset.name}</div>
                                <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                                  <div className="w-3 h-3 rounded-full border border-slate-300 flex items-center justify-center text-[8px]">●</div>
                                  Chain ID: {pos.chainId}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right flex items-center gap-4">
                              <div>
                                <div className="font-bold text-slate-900">${posUsd.toFixed(2)}</div>
                                <div className="text-slate-500 text-xs font-medium">
                                  {posNative > 0 ? posNative.toPrecision(4) : "0"} {pos.asset.symbol}
                                </div>
                              </div>
                              
                              {/* Trigger Delete Modal */}
                              <button 
                                onClick={() => setItemToDelete({ 
                                  protocolName: protocol.protocolName, 
                                  assetAddress: pos.asset.address,
                                  chainId: pos.chainId
                                })}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                aria-label="Delete position"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* --- SECTION 3: Shadcn-style Pagination --- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-6">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-md transition-colors ${
                  currentPage === page 
                    ? "border border-slate-200 bg-white shadow-sm" 
                    : "hover:bg-slate-100 text-slate-600"
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>
      <hr className="w-full max-w-md border-slate-200 mt-8 mb-10" />
    </div>
  );
}