import { prisma } from "@/lib/db/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  return (
    <div>
      <AdminPageHeader
        title="Site Settings"
        description="Hero copy, contact details, and outbound links used across the public site."
      />
      <SiteSettingsForm key={settings?.updatedAt.toISOString() ?? "new"} defaultValues={settings ?? undefined} />
    </div>
  );
}
