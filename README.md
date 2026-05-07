# Ask AI For You

A "Let Me Ask AI That For You" service. The home page is a pixel-faithful clone of `chatgpt.com`. Type a prompt, and instead of sending it, the app copies a shareable link of the form:

```
https://your-host.example.com/q/<urlencoded-prompt>
```

When someone opens that link, a fake cursor glides to the textarea, types the prompt, clicks the send button, and redirects them to:

```
https://chatgpt.com/?model=gpt-4&prompt=<urlencoded-prompt>
```

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS 4
- TypeScript 5
- Node 20+

## Develop

```bash
npm install
npm run dev
# http://localhost:3000
```

Useful scripts:

| script             | what it does                |
| ------------------ | --------------------------- |
| `npm run dev`      | Dev server with HMR         |
| `npm run build`    | Production build            |
| `npm run start`    | Run the production build    |
| `npm run lint`     | Run ESLint                  |
| `npm run typecheck`| `tsc --noEmit`              |

## Environment variables

Copy `.env.example` to `.env.local` and adjust as needed. All variables are optional.

| variable               | purpose                                                                                  |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used in `metadataBase` and `robots.txt`. Falls back to `VERCEL_URL` then `http://localhost:3000`. |

## Deploy

### Vercel (one-click)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the project on [vercel.com/new](https://vercel.com/new).
3. (Optional) Set `NEXT_PUBLIC_SITE_URL` to your production domain. Without it, Vercel's auto-injected `VERCEL_URL` is used.
4. Deploy.

No build configuration is required — Vercel auto-detects Next.js.

### Self-hosted (Node)

```bash
npm ci
npm run build
NEXT_PUBLIC_SITE_URL=https://your-domain.example.com npm run start
```

The server listens on port `3000` by default (`PORT` env var to override).

### SEO

`/` is indexable; `/q/*` is `noindex` (we don't want user prompts in search results). See [`app/robots.ts`](app/robots.ts) and the `generateMetadata` in [`app/q/[prompt]/page.tsx`](app/q/[prompt]/page.tsx).
