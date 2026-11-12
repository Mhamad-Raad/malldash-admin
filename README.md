# MallDash Admin

The admin dashboard of **MallDash**, a system for running a residential mall complex: buildings, floors and apartments with their tenants, the shops (vendors) and their products, orders delivered to apartments, support tickets, reports and a full activity history. English, Arabic and Kurdish, light and dark, with several colour themes.

> **Live demo:** https://malldash-admin-demo.vercel.app (sign in with `admin@malldash.demo` / `demo1234`)
> The demo answers from made-up data inside your browser (`src/demo/server.ts`), so nothing real is shown and your changes stay on your device. The shop owners' app: [malldash-vendor](https://github.com/Mhamad-Raad/malldash-vendor).

**Stack:** React, TypeScript, Vite, Redux Toolkit, Tailwind CSS with Radix UI (shadcn/ui), i18next, Recharts, axios, SignalR for live notifications.

```bash
npm install
npm run dev                         # needs the MallDash API in VITE_API_URL
npx vite --mode demo                # or: run on the built-in demo data
```
