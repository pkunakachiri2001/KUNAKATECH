# Gemini Proxy for KUNAKA TECH

This Cloudflare Worker keeps your Gemini API key off GitHub Pages.

## What it does

- Accepts `POST /chat`
- Forwards the prompt to Gemini using a server-side secret
- Returns a JSON response with `reply`

## Setup

1. Install Wrangler.
2. Set your secret:

```powershell
wrangler secret put GEMINI_API_KEY
```

3. Deploy the Worker:

```powershell
wrangler deploy
```

4. Replace the placeholder URL in [chat-config.js](../chat-config.js) with your deployed Worker URL.

## Frontend contract

The site sends:

```json
{
  "prompt": "User message",
  "systemPrompt": "...",
  "model": "gemini-1.5-flash"
}
```

The Worker returns:

```json
{ "reply": "..." }
```