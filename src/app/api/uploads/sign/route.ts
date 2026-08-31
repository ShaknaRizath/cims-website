import { auth } from "@/auth";
import { storage } from "@/lib/storage";
import { resolveAllowedFolderPrefixes } from "@/lib/storage/allowed-folder";
import type { UploadResourceType } from "@/lib/storage/storage.interface";

// Applicant document uploads (Apply Now) come from anonymous site visitors, not
// logged-in admins, so that one folder is exempt from the auth check below — the
// folder allowlist still confines it to nowhere else in Cloudinary.
const PUBLIC_UPLOAD_FOLDER = "cims-website/applications";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    folder?: string;
    resourceType?: UploadResourceType;
    filename?: string;
  };
  const { folder, resourceType, filename } = body;

  const allowedPrefixes = resolveAllowedFolderPrefixes();

  if (!folder || !allowedPrefixes.some((prefix) => folder.startsWith(prefix))) {
    return Response.json({ error: "Invalid upload folder." }, { status: 400 });
  }

  if (!folder.startsWith(PUBLIC_UPLOAD_FOLDER)) {
    const session = await auth();
    if (!session?.user) {
      return new Response(null, { status: 401 });
    }
  }

  try {
    const params = await storage.getSignedUploadParams({ folder, resourceType, filename });
    return Response.json(params);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Upload signing failed." },
      { status: 500 },
    );
  }
}
