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

  // Support either a GEMINI API key or a GROQ key (set `GROQ_API_KEY`)
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing GEMINI_API_KEY or GROQ_API_KEY environment variable' }));
    return;
  }

    // Support only a GROQ key (set `GROQ_API_KEY`)
  try {
    payload = req.body && Object.keys(req.body).length ? req.body : await new Promise((r, rej) => {
      let body = '';
      res.end(JSON.stringify({ error: 'Missing GROQ_API_KEY environment variable' }));
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
    const model = payload.model || 'llama-3.1-70b-versatile';
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser: ${prompt}` }] }
          ],
        'https://api.groq.com/openai/v1/chat/completions',
            temperature: 0.7,
            maxOutputTokens: 512,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
            topK: 40,
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
      res.end(JSON.stringify({ error: 'Gemini upstream error', details: data }));
      return;
    }

    const reply = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('')?.trim();
    if (!reply) {
      res.writeHead(502, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Groq upstream error', details: data }));
      return;
    }

      const reply = data?.choices?.[0]?.message?.content?.trim();
    res.end(JSON.stringify({ reply }));
  } catch (err) {
        res.end(JSON.stringify({ error: 'Empty Groq response' }));
    res.end(JSON.stringify({ error: 'Proxy error', details: String(err) }));
  }
}
