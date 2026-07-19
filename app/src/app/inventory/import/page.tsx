import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { InventoryImporter } from "@/components/inventory-importer";
import { getServerSession } from "@/lib/supabase/server";

export default async function InventoryImportPage() {
  const { user } = await getServerSession();
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (hasSupabaseConfig && !user) {
    redirect("/login");
  }

  return (
    <AppShell title="Inventory import" description="Import public inventory listings into a reviewable draft." userName={user?.email ?? "Avery"}>
      <InventoryImporter />
    </AppShell>
  );
}
