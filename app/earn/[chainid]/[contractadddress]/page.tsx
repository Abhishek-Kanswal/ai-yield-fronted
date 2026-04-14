import { CryptoChart } from "@/components/chart"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronRight, 
  Globe, 
  MoreHorizontal, 
  Settings, 
  Info
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
      <main className="flex flex-col h-[calc(100vh-72px)] w-full items-center justify-center bg-[#F3F3F3] p-6 overflow-hidden">
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
  const protocolName = vaultData.protocol?.name || "Protocol";
  
  // Format Address
  const shortAddress = address ? `${address.slice(0, 5)}...${address.slice(-5)}` : "Unknown";
  const protocolUrl = vaultData.protocol?.url || "#";

  const apy = vaultData.analytics?.apy?.total ? vaultData.analytics.apy.total.toFixed(2) : "0.00";
  const baseApy = vaultData.analytics?.apy?.base ? vaultData.analytics.apy.base.toFixed(2) : "1.84"; 
  const rewardApy = vaultData.analytics?.apy?.reward ? vaultData.analytics.apy.reward.toFixed(2) : "0.00";
  
  const tvl = vaultData.analytics?.tvl?.usd 
    ? Number(vaultData.analytics.tvl.usd).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) 
    : "$0";
  const updatedAt = vaultData.analytics?.updatedAt 
    ? new Date(vaultData.analytics.updatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) 
    : "Recently";

  const underlyingTokenAddress = vaultData.underlyingTokens?.[0]?.address || contractAddress;
  console.log("Token Logo Address:", underlyingTokenAddress);

  const logoUrl = `/api/token-logo?chain=${network.toLowerCase()}&address=${underlyingTokenAddress}`;
  console.log("Token Logo :", logoUrl);

  return (
    <main className="flex flex-col h-[calc(100vh-72px)] w-full font-sans overflow-hidden px-6 pb-6 pt-0 relative bg-[#F3F3F3]">
      {/* Scrollable Inner Container */}
      <div className="flex-1 w-full bg-[#FFFFFF] rounded-[10px] overflow-y-auto custom-scrollbar shadow-sm">
        <div className="w-full min-h-full bg-white text-slate-900 font-sans p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-slate-500 gap-1">
              <span>{protocolName}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="font-semibold text-slate-900">{name}</span>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-50 border border-slate-200 overflow-hidden shadow-sm relative shrink-0">
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

                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Left Column (Chart & Details) */}
              <div className="lg:col-span-2 flex flex-col">
                <div>
                  <h2 className="text-4xl font-bold tracking-tight">{apy}% <span className="text-xl font-medium text-slate-400">APY</span></h2>
                  <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                    <span className="text-slate-700 font-medium">TVL: {tvl}</span> 
                    • Updated: {updatedAt}
                  </p>
                </div>

                {/* Chart Container */}
                <div className="w-full h-[350px] my-6">
                  <CryptoChart analytics={vaultData.analytics} />
                </div>

                {/* Toggles Under Chart */}
                <div className="flex flex-wrap items-center justify-between gap-4 text-sm mb-10">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    {['1D', '7D', '1M'].map((time) => (
                      <button 
                        key={time} 
                        className={`px-3 py-1.5 rounded-md font-medium transition-colors ${time === '1M' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  {/* <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-100 p-1 rounded-lg font-medium text-slate-500">
                      <button className="px-3 py-1.5 bg-white shadow-sm rounded-md text-slate-900">APY</button>
                      <button className="px-3 py-1.5 hover:text-slate-900 transition-colors">TVL</button>
                    </div>
                  </div> */}
                </div>

                {/* Vault Details Section */}
                <div className="pt-6 border-t border-slate-100">
                  <section className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">Vault Details</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {vaultData.description || `${name} is a non-custodial smart contract-based liquid staking platform. Users can deposit their assets to receive ${symbol}, representing their staked assets and accumulated rewards, which can be utilized across the broader DeFi ecosystem.`}
                    </p>
                  </section>
                </div>
              </div>

              {/* Right Column (Deposit Panel) */}
              <div className="lg:col-span-1">
                <div className="sticky top-0">
                  <Card className="p-5 border-slate-200 shadow-sm rounded-2xl flex flex-col gap-5">
                    
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-slate-900">Deposit</h2>
                      <button className="text-slate-400 hover:text-slate-900 transition-colors">
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>

                    {/* 3 APY Boxes */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                        <span className="text-xs text-slate-500 mb-1 font-medium">APY</span>
                        <span className="text-sm font-bold text-green-600">{apy}%</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                        <span className="text-xs text-slate-500 mb-1 font-medium">BASE</span>
                        <span className="text-sm font-bold text-slate-900">{baseApy}%</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                        <span className="text-xs text-slate-500 mb-1 font-medium">REWARD</span>
                        <span className="text-sm font-bold text-slate-900">{rewardApy}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {/* Main Deposit Input Box */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <button className="text-[10px] font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors">
                              20%
                            </button>
                            <button className="text-[10px] font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 px-2 py-1 rounded-md transition-colors">
                              50%
                            </button>
                            <button className="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md transition-colors">
                              MAX
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">Balance: 0 {symbol}</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <input 
                            type="text" 
                            placeholder="0" 
                            className="text-4xl bg-transparent font-medium text-slate-900 outline-none w-[60%] placeholder:text-slate-300"
                          />
                        </div>
                        <div className="mt-2 text-sm text-slate-400">$0.00</div>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-base font-semibold shadow-sm transition-colors">
                      Connect Wallet
                    </Button>

                  </Card>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  )
}