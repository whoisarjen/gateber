/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    images: {
      minimumCacheTTL: 60 * 60 * 24,
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**",
        },
      ],
    },
};

export default config;
