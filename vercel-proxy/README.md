Vercel Deployment for KUNAKA TECH Gemini Proxy
=============================================

This folder contains a Vercel serverless function that proxies chat requests to Google Gemini (keeps the API key server-side).

Files
- `api/chat.js` — Vercel function. Accepts POST { prompt, model?, systemPrompt? } and returns { reply }.

Deploy steps (recommended)
1. Push this repository to GitHub (already done).
2. Go to https://vercel.com and create a new project — import this GitHub repo.
3. In the project settings, add an Environment Variable named `GEMINI_API_KEY` with your Gemini API key.
4. Deploy the project.
5. After deployment, the function URL will be:

   `https://<your-project>.vercel.app/api/chat`

6. Update `chat-config.js` in the repo with that URL and push the change.

CLI alternative
1. Install the Vercel CLI: `npm i -g vercel`
2. From the repo root run `vercel` and follow the interactive prompts.
3. Set the secret with `vercel env add GEMINI_API_KEY production` and paste the key.
4. Run `vercel --prod` to deploy.

Notes
- Keep `GEMINI_API_KEY` secret; do not commit it to GitHub.
- Once the Vercel URL is available, update `chat-config.js` to point `window.KUNAKA_CHAT_API_URL` to it.
