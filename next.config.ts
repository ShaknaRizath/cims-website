import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Same workaround as the CIMS LMS project's next.config.ts: this environment's
  // local dev/build tooling has trouble spawning the default (CPU-count) number of
  // concurrent workers. A real Postgres instance and CI runner in staging/production
  // shouldn't need this ceiling — revisit there.
  experimental: {
    cpus: 1,
  },
};

export default nextConfig;
