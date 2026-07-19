import { sampleDashboardData } from "@/lib/sample-data";
import { AppShell } from "@/components/app-shell";

type DashboardProps = {
  data?: typeof sampleDashboardData;
  userName?: string;
};

type MetricCardProps = {
  title: string;
  value: string;
  change: string;
  tone?: "blue" | "emerald" | "amber" | "violet";
};

function MetricCard({ title, value, change, tone = "blue" }: MetricCardProps) {
  const toneMap = {
    blue: "bg-sky-50 text-sky-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${toneMap[tone]}`}>{change}</span>
      </div>
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        {action ? <span className="text-xs font-medium text-slate-500">{action}</span> : null}
      </div>
      {children}
    </section>
  );
}

export function Dashboard({ data, userName = "Avery" }: DashboardProps) {
  const dashboardData = data ?? sampleDashboardData;

  return (
    <AppShell title="RV Sales Mission Control" description="Dealership command center" userName={userName}>
      <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Pipeline value" value="$2.84M" change="+12.6%" tone="blue" />
            <MetricCard title="Deals closing this week" value="18" change="+3" tone="emerald" />
            <MetricCard title="Inventory price review" value="11 units" change="2 urgent" tone="amber" />
            <MetricCard title="Marketing ROI" value="4.8x" change="+0.7x" tone="violet" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Panel title="Hot opportunities" action="Updated 5 min ago">
              <div className="space-y-3">
                {dashboardData.opportunities.map((item) => (
                  <div key={item.customer} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.customer}</p>
                        <p className="text-sm text-slate-500">{item.unit}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="rounded-full bg-sky-100 px-2.5 py-1 font-medium text-sky-700">{item.status}</span>
                        <span className="rounded-full bg-slate-200 px-2.5 py-1 font-medium text-slate-700">{item.confidence} confidence</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-slate-500">{item.closeDate}</span>
                      <span className="text-base font-semibold text-slate-950">{item.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Today's tasks" action="3 scheduled">
              <div className="space-y-3">
                {dashboardData.tasks.map((task) => (
                  <div key={task.title} className="rounded-2xl border border-slate-200 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">{task.priority}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
                      <span>{task.owner}</span>
                      <span>{task.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <Panel title="Inventory needing price review" action="11 items flagged">
              <div className="space-y-3">
                {dashboardData.inventory.map((item) => (
                  <div key={item.unit} className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1.3fr_0.8fr_0.8fr] md:items-center">
                    <div>
                      <p className="font-medium text-slate-900">{item.unit}</p>
                      <p className="text-sm text-slate-500">{item.lot}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Current</p>
                      <p className="font-semibold text-slate-900">{item.currentPrice}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Target</p>
                      <p className="font-semibold text-emerald-700">{item.targetPrice}</p>
                      <p className="text-xs text-emerald-600">{item.delta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Recent activity" action="Live feed">
              <div className="space-y-3">
                {dashboardData.activities.map((activity) => (
                  <div key={activity.title} className="rounded-2xl border border-slate-200 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-slate-900">{activity.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{activity.detail}</p>
                      </div>
                      <span className="text-xs text-slate-400">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
      </div>
    </AppShell>
  );
}
