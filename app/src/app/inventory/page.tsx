import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getServerSession } from "@/lib/supabase/server";

export default async function InventoryPage() {
  const { user } = await getServerSession();
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (hasSupabaseConfig && !user) {
    redirect("/login");
  }

  return (
    <AppShell title="Inventory" description="Review your unit catalog and import new listings." userName={user?.email ?? "Avery"}>
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Unit catalog</p>
              <h2 className="text-xl font-semibold text-slate-950">Import public inventory listings into a draft before publishing.</h2>
            </div>
            <Link href="/inventory/import" className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              Import from URL
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <p className="text-sm text-slate-600">Inventory management is ready for a future Supabase-backed catalog. The importer page above is now available for draft creation and marketing copy generation.</p>
        </div>
      </div>
    </AppShell>
  );
}
