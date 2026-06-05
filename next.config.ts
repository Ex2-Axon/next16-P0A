import type { NextConfig } from "next";

/**
 * next.config.ts
 *
 * Notes:
 * - `output: 'export'` enables static HTML export (next export). Keep this
 *   when you want `pnpm build` to produce a static `out/` folder.
 * - To run in server/SSR mode (use Vercel's Image Optimization API, API routes,
 *   or getServerSideProps), remove or comment out `output: 'export'`.
 * - When exporting static HTML, Next's default Image Optimization is incompatible
 *   with `output: 'export'`. Use `images.unoptimized: true` if you must serve
 *   remote images in a static export (example commented below).
 */

const nextConfig: NextConfig = {
  // Static export mode: `pnpm build` will produce an `out/` directory.
  // Comment out or remove this line to use server/SSR mode on Vercel.
  // output: 'export', // Uncomment จะทำให้ `pnpm build` สร้างโฟลเดอร์ `out/` สำหรับ static export

  images: {
    // Allowlist remote image sources used by `next/image`.
    // For static export you may need to add `unoptimized: true` here,
    // e.g. `images: { unoptimized: true, remotePatterns: [...] }`.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
