// Vercel serverless function to proxy requests to Gemini (keeps API key server-side)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    return res.end();
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing GEMINI_API_KEY environment variable' }));
    return;
  }

  let payload;
  try {
    payload = req.body && Object.keys(req.body).length ? req.body : await new Promise((r, rej) => {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => r(JSON.parse(body)));
      req.on('error', rej);
    });
  } catch (err) {
    res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    return;
  }

  const prompt = String(payload.prompt || '').trim();
  if (!prompt) {
    res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing prompt' }));
    return;
  }

  const model = payload.model || 'gemini-1.5-flash';
  const systemPrompt = payload.systemPrompt || 'You are the KUNAKA TECH AI assistant. Answer naturally, helpfully, and concisely.';

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser: ${prompt}` }] }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 512,
            topP: 0.95,
            topK: 40,
          },
        }),
      }
    );

    const data = await upstream.json();
    if (!upstream.ok) {
      res.writeHead(upstream.status, { ...corsHeaders, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Gemini upstream error', details: data }));
      return;
    }

    const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('')?.trim();
    if (!reply) {
      res.writeHead(502, { ...corsHeaders, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Empty Gemini response' }));
      return;
    }

    res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ reply }));
  } catch (err) {
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Proxy error', details: String(err) }));
  }
}
