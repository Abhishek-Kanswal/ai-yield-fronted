import { CryptoChart } from "@/components/chart"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronRight, 
  Globe, 
  Share, 
  MoreHorizontal, 
  Settings, 
  ArrowDown, 
  Info,
  Activity
} from "lucide-react"
import Link from "next/link"

// Helper function to fetch vault data
async function getVaultData(chainId: string, contractAddress: string) {
  if (!chainId || !contractAddress) return null;

  try {
    const apiKey = process.env.LIFI_API_KEY;

    const res = await fetch(`https://earn.li.fi/v1/earn/vaults/${chainId}/${contractAddress}`, {
      headers: {
        "accept": "application/json",
        "x-lifi-api-key": apiKey || "" 
      },
      next: { revalidate: 60 } 
    })
    
    if (!res.ok) {
      console.error(`LI.FI API Error: ${res.status} for ${chainId}/${contractAddress}`);
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error("Failed to fetch vault data:", error);
    return null;
  }
}

export default async function EarnPage({ params }: { params: any }) {
  
  // Safely await params
  const resolvedParams = await Promise.resolve(params) || {};

  // Extract parameters
  let chainId = "";
  let contractAddress = "";

  if (resolvedParams.slug && Array.isArray(resolvedParams.slug)) {
    chainId = String(resolvedParams.slug[0] || "");
    contractAddress = String(resolvedParams.slug[1] || "");
  } else {
    const values = Object.values(resolvedParams);
    chainId = String(resolvedParams.chainid || resolvedParams.chainId || resolvedParams.chain || values[0] || "");
    contractAddress = String(resolvedParams.contractaddress || resolvedParams.contractAddress || resolvedParams.address || values[1] || "");
  }

  // Fetch dynamic data
  const vaultData = await getVaultData(chainId, contractAddress);

  // Error State
  if (!vaultData) {
    return (
      <main className="flex flex-col h-[calc(100vh-72px)] w-full items-center justify-center bg-[#F3F3F3] p-6">
        <Card className="max-w-md p-8 text-center space-y-4 shadow-sm border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Vault Not Found</h2>
          <p className="text-sm text-slate-500">
            LI.FI does not have data for this specific vault combination, or the URL parameters are invalid.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl text-xs text-left text-slate-600 border border-slate-100 overflow-hidden">
            <p><strong>Detected Chain ID:</strong> {chainId || "UNDEFINED"}</p>
            <p className="truncate"><strong>Detected Address:</strong> {contractAddress || "UNDEFINED"}</p>
          </div>
        </Card>
      </main>
    )
  }

  // --- Normal UI Rendering ---
  const name = vaultData.name || "Unknown Vault";
  const symbol = vaultData.underlyingTokens?.[0]?.symbol || "TOKEN";
  const address = vaultData.address || contractAddress;
  const network = vaultData.network || "Ethereum";
  
  // Format Address (e.g., 0xcd5...9b7ee)
  const shortAddress = address ? `${address.slice(0, 5)}...${address.slice(-5)}` : "Unknown";
  
  const protocolUrl = vaultData.protocol?.url || "#";

  const apy = vaultData.analytics?.apy?.total ? vaultData.analytics.apy.total.toFixed(2) : "0.00";
  const tvl = vaultData.analytics?.tvl?.usd 
    ? Number(vaultData.analytics.tvl.usd).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) 
    : "$0";
  const updatedAt = vaultData.analytics?.updatedAt 
    ? new Date(vaultData.analytics.updatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) 
    : "Recently";

  // ==========================================
  // FIXED: EXACT LOGO EXTRACTION
  // ==========================================
  // This looks specifically into the underlyingTokens array and grabs the address (e.g., 0x0000000000000000000000000000000000000000)
  const underlyingTokenAddress = vaultData.underlyingTokens?.[0]?.address || contractAddress;
  
  // Pass the extracted address and the normalized network name to your API
  const logoUrl = `/api/token-logo?chain=${network.toLowerCase()}&address=${underlyingTokenAddress}`;

  return (
    <main className="flex flex-col h-[calc(100vh-72px)] w-full font-sans overflow-hidden px-6 pb-6 pt-0 relative bg-[#F3F3F3]">
      <div className="flex-1 flex flex-col items-center gap-4 w-full bg-[#FFFFFF] rounded-[10px] p-5 overflow-y-auto min-h-0 custom-scrollbar">
        <div className="min-h-screen w-full bg-white text-slate-900 font-sans p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-slate-500 gap-1">
              <span>Vault</span>
              <ChevronRight className="w-4 h-4" />
              <span className="font-semibold text-slate-900">{name}</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-50 border border-slate-200 overflow-hidden shadow-sm relative">
                  <span className="absolute text-xs font-bold text-slate-400 -z-10">{symbol.substring(0,4)}</span>
                  <img 
                    src={logoUrl} 
                    alt={`${symbol} Logo`}
                    className="w-full h-full object-cover z-10"
                  />
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    {name} <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{symbol}</span>
                  </h1>
                  <p className="text-sm text-slate-500 mt-1" title={address}>
                    {shortAddress}
                  </p>
                </div>
              </div>
              
              {/* Action Icons */}
              <div className="flex items-center gap-3 text-slate-500">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                  <img 
                    src="https://etherscan.io/images/brandassets/etherscan-logo-circle.svg" 
                    alt="Etherscan" 
                    className="w-5 h-5 grayscale contrast-200 opacity-60 hover:opacity-100 transition-opacity"
                  />
                </Button>
                
                <Link href={protocolUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                    <Globe className="w-5 h-5" />
                  </Button>
                </Link>

                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100"><Activity className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100"><Share className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100"><MoreHorizontal className="w-5 h-5" /></Button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              <div className="lg:col-span-2">
                <div>
                  <h2 className="text-4xl font-bold tracking-tight">{apy}% <span className="text-xl font-medium text-slate-400">APY</span></h2>
                  <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                    <span className="text-slate-700 font-medium">TVL: {tvl}</span> 
                    • Updated: {updatedAt}
                  </p>
                </div>

                <CryptoChart analytics={vaultData.analytics} />

                <div className="flex items-center justify-between mt-6 text-sm">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    {['1D', '7D', '1M', '1Y', 'ALL'].map((time) => (
                      <button 
                        key={time} 
                        className={`px-3 py-1.5 rounded-md font-medium transition-colors ${time === '1M' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-100 p-1 rounded-lg font-medium text-slate-500">
                      <button className="px-3 py-1.5 bg-white shadow-sm rounded-md text-slate-900">APY</button>
                      <button className="px-3 py-1.5 hover:text-slate-900">TVL</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-4">
                <Card className="p-4 border-slate-200 shadow-sm rounded-2xl">
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                      <button className="text-slate-900 bg-slate-100 px-3 py-1.5 rounded-full">Swap</button>
                      <button className="hover:text-slate-900">Limit</button>
                      <button className="hover:text-slate-900">Buy</button>
                      <button className="hover:text-slate-900">Sell</button>
                    </div>
                    <button className="text-slate-400 hover:text-slate-900">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="relative flex flex-col gap-1">
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                      <p className="text-xs text-slate-500 mb-2 font-medium">Sell</p>
                      <div className="flex items-center justify-between">
                        <input 
                          type="text" 
                          placeholder="0" 
                          className="text-4xl bg-transparent font-medium text-slate-900 outline-none w-1/2 placeholder:text-slate-300"
                        />
                        <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-full font-semibold shadow-sm transition-colors">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[8px] text-white">ETH</div>
                          ETH
                          <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-slate-400">$0</p>
                        <p className="text-xs text-slate-500">0.00 ETH</p>
                      </div>
                    </div>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-slate-200 p-2 rounded-xl shadow-sm z-10 cursor-pointer hover:bg-slate-50 transition-colors">
                      <ArrowDown className="w-4 h-4 text-slate-600" />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                      <p className="text-xs text-slate-500 mb-2 font-medium">Buy</p>
                      <div className="flex items-center justify-between">
                        <input 
                          type="text" 
                          placeholder="0" 
                          className="text-4xl bg-transparent font-medium text-slate-900 outline-none w-1/2 placeholder:text-slate-300"
                        />
                        <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-full font-semibold shadow-sm transition-colors">
                          <div className="w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center text-[8px] text-white">{symbol.charAt(0)}</div>
                          {symbol}
                          <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-slate-400">$0</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6 text-base font-semibold">
                    Connect to {network}
                  </Button>
                </Card>

                <div className="bg-slate-50 border border-slate-200 text-slate-600 p-4 rounded-xl flex items-start gap-3 text-sm">
                  <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <p>{symbol} is part of the {name} vault on {network}.</p>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}