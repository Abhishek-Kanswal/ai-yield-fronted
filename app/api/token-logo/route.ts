import { NextResponse } from 'next/server';

const chainMap: Record<string, string> = {
  'ethereum': 'eth',
  'base': 'base',
  'arbitrum': 'arbitrum',
  'optimism': 'optimism',
  'manta': 'manta',
  'linea': 'linea',
  'polygon': 'polygon',
  'bsc': 'bsc',
  'avalanche': 'avalanche',
  'fantom': 'fantom',
  // fallback for any chain name that is exactly the same in Moralis API
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chainName = searchParams.get('chain');
    const address = searchParams.get('address');

    if (!chainName || !address) {
      return NextResponse.json({ error: 'Missing chain or address' }, { status: 400 });
    }

    const moralisChain = chainMap[chainName.toLowerCase()] || chainName.toLowerCase();
    
    const moralisUrl = `https://deep-index.moralis.io/api/v2.2/erc20/metadata?chain=${moralisChain}&addresses=${address}`;
    
    const response = await fetch(moralisUrl, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "X-API-Key": process.env.MORALIS_API_KEY || ''
      }
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Moralis API Error (${response.status}):`, text);
      return NextResponse.json({ error: 'Failed to fetch from Moralis API' }, { status: response.status });
    }

    const data = await response.json();
    
    if (data && data.length > 0 && data[0].logo) {
      return NextResponse.json({ logo: data[0].logo });
    }

    return NextResponse.json({ logo: null });
  } catch (error: any) {
    console.error('Error fetching token logo:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
