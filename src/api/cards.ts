// Edge function for /api/cards
// This will proxy card queries to Supabase securely

import type { VercelRequest, VercelResponse } from '@vercel/node';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { deck_id } = req.query;
    if (!deck_id) {
      return res.status(400).json({ error: 'deck_id is required' });
    }
    const url = `${SUPABASE_URL}/rest/v1/cards?deck_id=eq.${deck_id}`;
    const supabaseRes = await fetch(url, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    if (!supabaseRes.ok) {
      return res.status(supabaseRes.status).json({ error: await supabaseRes.text() });
    }
    const data = await supabaseRes.json();
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
