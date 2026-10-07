/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export — required for GitHub Pages (no Node server available).
  // `next build` now writes a fully static site straight to /out.
  output: "export",
  images: {
    // GitHub Pages can't run Next's image optimization server, so images
    // are served as-is. Fine for this site since nothing uses next/image yet.
    unoptimized: true,
  },
  // No redirects() here on purpose — static export can't run server-side
  // redirect logic. The www ⇄ apex redirect is instead handled by GitHub
  // Pages itself once both DNS records are set up (see README).
};

export default nextConfig;
