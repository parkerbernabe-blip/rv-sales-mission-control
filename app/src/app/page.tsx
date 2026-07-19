import { redirect } from "next/navigation";
import { Dashboard } from "@/components/dashboard";
import { sampleDashboardData } from "@/lib/sample-data";
import { getServerSession } from "@/lib/supabase/server";

export default async function Home() {
  const { user, supabase } = await getServerSession();
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (hasSupabaseConfig && !user) {
    redirect("/login");
  }

  const dashboardData = hasSupabaseConfig && supabase
    ? await (async () => {
        try {
          const [opportunitiesResult, tasksResult, inventoryResult, activityResult] = await Promise.all([
            supabase.from("opportunities").select("*").limit(3),
            supabase.from("tasks").select("*").limit(3),
            supabase.from("inventory").select("*").limit(3),
            supabase.from("activity").select("*").limit(3),
          ]);

          return {
            opportunities: opportunitiesResult.data?.length
              ? opportunitiesResult.data.map((item) => ({
                  customer: "Customer",
                  unit: item.unit_interest ?? "RV unit",
                  status: item.stage ?? "Open",
                  amount: `$${Number(item.estimated_value ?? 0).toLocaleString()}`,
                  closeDate: "In review",
                  confidence: `${item.score ?? 0}%`,
                }))
              : sampleDashboardData.opportunities,
            tasks: tasksResult.data?.length
              ? tasksResult.data.map((item) => ({
                  title: item.title ?? "Task",
                  owner: "Sales team",
                  due: item.due_at ? new Date(item.due_at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "Pending",
                  priority: item.priority ?? "Medium",
                }))
              : sampleDashboardData.tasks,
            inventory: inventoryResult.data?.length
              ? inventoryResult.data.map((item) => ({
                  unit: `${item.year ?? ""} ${item.make ?? ""} ${item.model ?? ""}`.trim() || "Inventory unit",
                  lot: item.stock_number ?? "Lot",
                  currentPrice: `$${Number(item.price ?? 0).toLocaleString()}`,
                  targetPrice: `$${Number(item.price ?? 0).toLocaleString()}`,
                  delta: `+${item.days_in_stock ?? 0} days`,
                }))
              : sampleDashboardData.inventory,
            activities: activityResult.data?.length
              ? activityResult.data.map((item) => ({
                  title: item.action ?? "Activity",
                  detail: item.details ?? "No details available.",
                  time: new Date(item.created_at ?? Date.now()).toLocaleDateString(),
                }))
              : sampleDashboardData.activities,
          };
        } catch {
          return sampleDashboardData;
        }
      })()
    : sampleDashboardData;

  return <Dashboard data={dashboardData} userName={user?.email ?? "Avery"} />;
}
