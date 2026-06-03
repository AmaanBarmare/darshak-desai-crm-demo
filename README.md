# Darshak Desai CRM

A polished, frontend-only demo CRM for **Darshak Desai** (Agamic Financial Services), built to present to the client. All data is hardcoded mock data — no backend, API, or authentication. The goal is to make it look and feel like a real, production-ready product.

## Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — design tokens ported verbatim from the Google Stitch exports
- **Framer Motion** — page transitions, toasts, and the task modal
- **Lucide React** — icons
- **Manrope** (Google Fonts) — typography

Light mode only. Mobile-first (390px) with a bottom tab bar; a left sidebar layout on desktop with content capped at 480px so it reads as a faithful product preview.

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Pages

| Route | Screen |
|-------|--------|
| `/` | Dashboard — KPIs, upcoming renewals, birthdays, today's tasks |
| `/clients` | Clients list — search, filters, embedded Champions leaderboard |
| `/clients/[id]` | Client profile — products, opportunities, activity, network |
| `/clients/new`, `/clients/[id]/edit` | Add / edit client form |
| `/broadcasts` | Broadcast composer with dynamic recipient count |
| `/tasks` | Tasks with Today / This Week / All filters |
| `/settings` | Profile, integrations, reminders, team management |

## Data

All mock data lives in [`lib/mockData.ts`](lib/mockData.ts) and is the single source of truth for every screen. Edit it there to change clients, tasks, broadcasts, or headline numbers.

## Notes for the demo

- All toggles, checkboxes, filters, and search update React state immediately.
- WhatsApp buttons open `wa.me` deep links in a new tab.
- Saving a client, sending a broadcast, marking a task done, and logging out all show toast confirmations (no data is persisted — this is a demo).
- The dashboard date and greeting reflect the real current date; renewal urgency pills use stable stored values (red < 7 days, amber < 30, green otherwise).
