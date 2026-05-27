// Vercel serverless function to proxy requests to Groq (keeps API key server-side)
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

  const key = process.env.GROQ_API_KEY;
  if (!key) {
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing GROQ_API_KEY environment variable' }));
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

  const model = payload.model || 'llama-3.1-70b-versatile';
  const systemPrompt = payload.systemPrompt || 'You are the KUNAKA TECH AI assistant. Answer naturally, helpfully, and concisely.';

  try {
    const upstream = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 512,
          top_p: 0.95,
          stream: false,
          stop: null,
          n: 1,
          presence_penalty: 0,
          frequency_penalty: 0,
          user: 'kunaka-tech-website',
        }),
      }
    );

    const data = await upstream.json();
    if (!upstream.ok) {
      res.writeHead(upstream.status, { ...corsHeaders, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Groq upstream error', details: data }));
      return;
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      res.writeHead(502, { ...corsHeaders, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Empty Groq response' }));
      return;
    }

    res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ reply }));
  } catch (err) {
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Proxy error', details: String(err) }));
  }
}
