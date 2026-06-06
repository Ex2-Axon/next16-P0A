# next16-P0A

[![Next.js](https://img.shields.io/badge/Next.js-16.2.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-blue?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-%5E%20latest-0066CC?style=flat-square&logo=pnpm)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-%5E5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

A modern Next.js 16 master template built with the App Router, Tailwind CSS v4, Framer Motion, and Lucide React.

## Project Overview

This project is configured with:

- `next` 16.2.7
- `react` 19.2.4
- `tailwindcss` v4
- `framer-motion` 12.40.0
- `lucide-react` ^1.17.0
- `pnpm` as the package manager

The app is organized using the root `app/` directory and follows the latest Next.js App Router conventions.

## Features

- Responsive mobile-first landing page
- Custom component structure in `app/components/`
- Fixed bottom cookie banner with privacy actions
- Modern UI using Tailwind CSS and animated interactions
- Social links and donation/payment callouts built into the page flow

## Preview

![next16-P0A screenshot](./screenshot.png)

## Getting Started

Use `pnpm` for all package management and scripts.

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

Build for production:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

Run linting:

```bash
pnpm lint
```

## App Structure

Key files and folders:

- `app/page.tsx` – main landing page UI
- `app/layout.tsx` – root layout for the app
- `app/globals.css` – global Tailwind and CSS styles
- `app/components/` – reusable components like `CookieBanner`, `Footer`, and hero sections

## Notes

- Avoid using npm or yarn commands for this project; use `pnpm` exclusively.
- This repository uses the Next.js App Router pattern and does not use the legacy `pages/` or `src/` routes.

## Related Links

- [Micro Donate & Payment](https://microtronic-thailand.github.io/micro-payment/)
- [Microtronic Thailand](https://microtronic.biz/)
- [Privacy Policy](https://microtronic-thailand.github.io/privacy-policy/?lang=en)
- [Terms of Service](https://microtronic-thailand.github.io/terms-conditions/)

## Screenshot Automation

This repo includes a ready-to-use screenshot script using Playwright. It captures the live page and saves it to `screenshot.png`.

Run locally with:

```bash
pnpm install
node screenshot.js https://next16-p0a.vercel.app screenshot.png
```

Or use the package script:

```bash
pnpm screenshot
```

If you want to target a different URL, pass it as the first argument:

```bash
node screenshot.js https://your-deployment-url.vercel.app output.png
```

This also supports CI automation by setting the `SCREENSHOT_URL` environment variable.

### GitHub Actions Artifact Workflow

A workflow file is included at `.github/workflows/screenshot.yml` that will:

- install dependencies with `pnpm`
- install Playwright Chromium
- capture the screenshot from the configured deployment URL
- upload the screenshot as a workflow artifact

You can configure the deployment URL with a repository secret named `SCREENSHOT_URL`.

## Deployment

Deploy this app on Vercel or any platform that supports Next.js 16 applications.

For Vercel, follow the official guide: https://nextjs.org/docs/app/building-your-application/deploying
