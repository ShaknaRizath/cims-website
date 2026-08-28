import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Same workaround as the CIMS LMS project's next.config.ts: this environment's
  // local dev/build tooling has trouble spawning the default (CPU-count) number of
  // concurrent workers. A real Postgres instance and CI runner in staging/production
  // shouldn't need this ceiling — revisit there.
  experimental: {
    cpus: 1,
  },

  // Redirects from the old cims.edu.lk site's URL structure (four subject-area
  // pages under /programmes/<slug>) to the closest matching category on the new
  // site, so old Google results and bookmarks don't dead-end in a 404. The new
  // site's programme detail pages live at /programmes/<real-programme-slug>, none
  // of which collide with these old category names.
  async redirects() {
    return [
      { source: "/programmes/technology", destination: "/programmes?category=faculty-of-science-and-technology", permanent: true },
      { source: "/programmes/business", destination: "/programmes?category=faculty-of-business-and-economics", permanent: true },
      { source: "/programmes/law", destination: "/programmes?category=faculty-of-education-and-humanities-sciences", permanent: true },
      { source: "/programmes/education", destination: "/programmes?category=faculty-of-education-and-humanities-sciences", permanent: true },
    ];
  },
};

export default nextConfig;
