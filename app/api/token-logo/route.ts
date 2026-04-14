import { NextResponse } from "next/server";

/**
 * Moralis chain mapping
 */
const MORALIS_CHAIN_MAP: Record<number, string> = {
  1: "eth",
  10: "optimism",
  56: "bsc",
  100: "gnosis",
  137: "polygon",
  5000: "mantle",
  8453: "base",
  42161: "arbitrum",
  42220: "celo",
  43114: "avalanche",
  59144: "linea",
};

/**
 * Alchemy supported networks
 */
const ALCHEMY_NETWORK_MAP: Record<number, string> = {
  1: "eth-mainnet",
  10: "opt-mainnet",
  137: "polygon-mainnet",
  8453: "base-mainnet",
  42161: "arb-mainnet",
  43114: "avax-mainnet",
};

/**
 * Helper: fetch Moralis logo
 */
async function fetchMoralisLogo(chainId: number, address: string) {
  const moralisChain = MORALIS_CHAIN_MAP[chainId];

  if (!moralisChain) return null;

  const url = `https://deep-index.moralis.io/api/v2.2/erc20/metadata?chain=${moralisChain}&addresses=${address}`;

  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      "X-API-Key": process.env.MORALIS_API_KEY!,
    },
  });

  if (!res.ok) return null;

  const data = await res.json();

  return data?.[0]?.logo ?? null;
}

/**
 * Helper: fetch Alchemy logo fallback
 */
async function fetchAlchemyLogo(chainId: number, address: string) {
  const network = ALCHEMY_NETWORK_MAP[chainId];

  if (!network) return null;

  const url = `https://${network}.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_getTokenMetadata",
      params: [address],
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();

  return data?.result?.logo ?? null;
}

/**
 * Route handler
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const address = searchParams.get("address");
    const chainId = Number(searchParams.get("chainId"));

    if (!address || !chainId) {
      return NextResponse.json(
        { error: "Missing address or chainId" },
        { status: 400 }
      );
    }

    /**
     * Step 1: Try Moralis
     */
    const moralisLogo = await fetchMoralisLogo(chainId, address);

    if (moralisLogo) {
      return NextResponse.json({
        logo: moralisLogo,
        source: "moralis",
      });
    }

    /**
     * Step 2: Try Alchemy fallback
     */
    const alchemyLogo = await fetchAlchemyLogo(chainId, address);

    if (alchemyLogo) {
      return NextResponse.json({
        logo: alchemyLogo,
        source: "alchemy",
      });
    }

    /**
     * Step 3: nothing found
     */
    return NextResponse.json({
      logo: null,
      source: "none",
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { error: "Logo fetch failed" },
      { status: 500 }
    );
  }
}