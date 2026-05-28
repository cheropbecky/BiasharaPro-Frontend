# BiasharaPro — Frontend

BiasharaPro is an offline-first POS/dashboard web app for small retail shops. This repository contains the frontend built with React and Vite. The app uses an in-browser SQL.js database for local persistence of products, sales, and expenses, and includes inventory management, bookkeeping views, i18n (English/Swahili), and settings/export utilities.

## Features

- Client-side SQL.js persistence (`src/db/sqlite.js`) for products, sales, and expenses
- Inventory CRUD: add / edit / delete products, search, category & status filters (`src/pages/InventoryPage.jsx`)
- Bookkeeping & dashboard views showing transactions, totals, and charts (`src/pages/BookkeepingPage.jsx`, `src/pages/DashboardPage.jsx`)
- Navigation provider with offline/online detection, toast notifications, and quick actions (`src/components/navigation/NavigationProvider.jsx`)
- i18n support (English + Swahili) via `useLang` (`src/hooks/useLang.js`) and translation files
- Settings page for exporting CSV/PDF, clearing local cache, manual sync, backup reminders (`src/pages/SettingsPage.jsx`)

## Quick start

Requirements:

- Node.js 18+ and npm

Install dependencies and run the dev server:

```bash
cd BiasharaPro_frontend
npm install
npm run dev
```

Open http://localhost:5173 (or the port shown by Vite).

Notes:

- The app stores its local database in `localStorage` (base64 export of SQL.js database). To reset local app data, use the Settings → Clear local cache action.
- If port 5173 is in use, Vite will try the next available port.

## Project structure (important files)

- `src/db/sqlite.js` — SQL.js initialization, schema, and helper functions (getProducts, addProduct, addSale, getExpenses, etc.)
- `src/pages/InventoryPage.jsx` — Inventory UI and product CRUD modal
- `src/pages/BookkeepingPage.jsx` — Bookkeeping summary and transactions list
- `src/pages/DashboardPage.jsx` — Main overview + recent activity
- `src/pages/SettingsPage.jsx` — Export, sync, clear cache, profile
- `src/components/navigation/NavigationProvider.jsx` — App navigation state, toasts, online/offline
- `src/hooks/useLang.js` — Language hook + translations

## Exporting & backup

- Use Settings → Export CSV to download a snapshot of localStorage as CSV.
- Use Settings → Export PDF to open a print-friendly view of stored local data.

## How to contribute

1. Fork the repo and create a feature branch.
2. Implement changes and ensure the app runs locally with `npm run dev`.
3. Commit with a clear message (conventional-style messages are used in this repo).
4. Open a pull request describing the change.

## Commit message suggestion for recent changes

`feat(frontend): client-side SQL.js DB, inventory CRUD, bookkeeping & settings UI`

## License

This repository currently does not include a license file. Add one if you plan to open-source it.

---
If you need me to push the current changes to the remote, create releases, or open a PR, tell me which remote branch and I will push and report back.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
