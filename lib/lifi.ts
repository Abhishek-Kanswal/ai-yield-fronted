// Client side direct LI.FI fetching (for dashboard where backend isn't needed)
export async function fetchLiFiPortfolio(address: string) {
    const res = await fetch(`https://earn.li.fi/v1/earn/portfolio/${address}/positions`);
    if (!res.ok) {
        if (res.status === 404) return { positions: [] };
        throw new Error('LiFi portfolio error');
    }
    return res.json();
}
