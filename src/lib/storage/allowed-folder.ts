import "server-only";

// Single ADMIN role, no per-user scoping needed — just a fixed allowlist of
// content-image folders, unlike the LMS's role/userId-keyed version.
// Prefixed with "cims-website/" so uploads stay namespaced within a shared
// Cloudinary account that also hosts other, unrelated apps.
const ALLOWED_UPLOAD_FOLDERS = [
  "cims-website/programmes",
  "cims-website/news",
  "cims-website/events",
  "cims-website/testimonials",
  "cims-website/team",
  "cims-website/campuses",
  "cims-website/settings",
  "cims-website/partners",
  "cims-website/hero",
  "cims-website/applications",
];

export function resolveAllowedFolderPrefixes(): string[] {
  return ALLOWED_UPLOAD_FOLDERS;
}
