const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    if (!env.GEMINI_API_KEY) {
      return json({ error: 'Missing GEMINI_API_KEY secret' }, 500);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }

    const prompt = String(payload.prompt || '').trim();
    if (!prompt) {
      return json({ error: 'Missing prompt' }, 400);
    }

    const model = payload.model || 'gemini-1.5-flash';
    const systemPrompt = payload.systemPrompt || 'You are the KUNAKA TECH AI assistant. Answer naturally, helpfully, and concisely.';

    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
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
      return json({ error: 'Gemini upstream error', details: data }, upstream.status);
    }

    const reply = data?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('')?.trim();
    if (!reply) {
      return json({ error: 'Empty Gemini response' }, 502);
    }

    return json({ reply });
  },
};