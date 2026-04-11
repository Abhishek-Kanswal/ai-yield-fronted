import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '100'
    const sortBy = searchParams.get('sortBy') || 'tvl'

    const lifiResponse = await fetch(`https://earn.li.fi/v1/earn/vaults?limit=${limit}&sortBy=${sortBy}`, {
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!lifiResponse.ok) {
      throw new Error(`LI.FI API responded with status: ${lifiResponse.status}`)
    }

    const data = await lifiResponse.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error proxying LI.FI request:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
