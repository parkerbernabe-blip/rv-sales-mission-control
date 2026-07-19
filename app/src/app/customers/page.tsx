import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CustomersModule } from "@/components/customers-module";
import { getCustomers } from "@/lib/customers";
import { getServerSession } from "@/lib/supabase/server";

export default async function CustomersPage() {
  const { user } = await getServerSession();
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (hasSupabaseConfig && !user) {
    redirect("/login");
  }

  const customers = await getCustomers();

  return (
    <AppShell title="Customers" description="Search, add, and follow up on customer relationships." userName={user?.email ?? "Avery"}>
      <CustomersModule initialCustomers={customers} />
    </AppShell>
  );
}
