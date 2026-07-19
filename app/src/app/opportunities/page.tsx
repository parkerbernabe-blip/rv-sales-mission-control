import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { OpportunitiesModule } from "@/components/opportunities-module";
import { getOpportunities } from "@/lib/opportunities";
import { getServerSession } from "@/lib/supabase/server";

export default async function OpportunitiesPage() {
  const { user } = await getServerSession();
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (hasSupabaseConfig && !user) {
    redirect("/login");
  }

  const opportunities = await getOpportunities();

  return (
    <AppShell title="Opportunities" description="Track active deals from first contact through delivery." userName={user?.email ?? "Avery"}>
      <OpportunitiesModule initialOpportunities={opportunities} />
    </AppShell>
  );
}
