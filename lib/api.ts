const API_BASE = 'http://localhost:8000';

export async function sendChatMessage(message: string, sessionId: string, userAddress?: string) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      session_id: sessionId,
      user_address: userAddress,
    }),
  });
  if (!res.ok) throw new Error('Chat API error');
  return res.json();
}

export async function getVaults(chain = 'base', limit = 10) {
  const res = await fetch(`${API_BASE}/vaults?chain=${chain}&limit=${limit}`);
  if (!res.ok) throw new Error('Vaults API error');
  return res.json();
}

export async function getHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}
