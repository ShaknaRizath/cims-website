import "server-only";

// Single ADMIN role, no per-user scoping needed — just a fixed allowlist of
// content-image folders, unlike the LMS's role/userId-keyed version.
const ALLOWED_UPLOAD_FOLDERS = [
  "programmes",
  "news",
  "events",
  "testimonials",
  "team",
  "campuses",
  "settings",
  "partners",
];

export function resolveAllowedFolderPrefixes(): string[] {
  return ALLOWED_UPLOAD_FOLDERS;
}
