type SidebarItem = {
  label: string;
  active?: boolean;
  badge?: string;
};

type Opportunity = {
  customer: string;
  unit: string;
  status: string;
  amount: string;
  closeDate: string;
  confidence: string;
};

type Task = {
  title: string;
  owner: string;
  due: string;
  priority: string;
};

type InventoryItem = {
  unit: string;
  lot: string;
  currentPrice: string;
  targetPrice: string;
  delta: string;
};

type Activity = {
  title: string;
  detail: string;
  time: string;
};

type MetricCardProps = {
  title: string;
  value: string;
  change: string;
  tone?: "blue" | "emerald" | "amber" | "violet";
};

const navItems: SidebarItem[] = [
  { label: "Dashboard", active: true },
  { label: "Opportunities" },
  { label: "Customers" },
  { label: "Inventory" },
  { label: "Tasks" },
  { label: "Marketing", badge: "12" },
];

const opportunities: Opportunity[] = [
  {
    customer: "Cedar Ridge Campers",
    unit: "2026 Forest River Georgetown 34H",
    status: "Negotiation",
    amount: "$124,800",
    closeDate: "Due in 4 days",
    confidence: "92%",
  },
  {
    customer: "North Valley Travel Co.",
    unit: "2026 Keystone Montana High Country",
    status: "Finance review",
    amount: "$108,150",
    closeDate: "Due in 6 days",
    confidence: "87%",
  },
  {
    customer: "Bayside Outdoors",
    unit: "2025 Grand Design Reflection 315RL",
    status: "Trade-in appraisal",
    amount: "$97,400",
    closeDate: "Due in 2 days",
    confidence: "81%",
  },
];

const tasks: Task[] = [
  { title: "Confirm tow package pricing", owner: "Chris", due: "9:30 AM", priority: "High" },
  { title: "Follow up on financing terms", owner: "Mia", due: "11:00 AM", priority: "Medium" },
  { title: "Schedule photo walkthrough", owner: "Jordan", due: "1:30 PM", priority: "Low" },
];

const inventory: InventoryItem[] = [
  { unit: "2025 Jayco Eagle HT 27.5R", lot: "Lot B-12", currentPrice: "$62,900", targetPrice: "$65,750", delta: "+$2,850" },
  { unit: "2024 Winnebago Minnie Winnie 24B", lot: "Lot C-08", currentPrice: "$78,600", targetPrice: "$81,400", delta: "+$2,800" },
  { unit: "2026 Coachmen Leprechaun 320MP", lot: "Lot D-03", currentPrice: "$101,500", targetPrice: "$104,900", delta: "+$3,400" },
];

const activities: Activity[] = [
  { title: "New lead assigned to sales team", detail: "Cedar Ridge Campers requested a live walkthrough.", time: "12 min ago" },
  { title: "Inventory note updated", detail: "The 2025 Jayco Eagle HT 27.5R was re-priced for weekend promotion.", time: "34 min ago" },
  { title: "Customer contract approved", detail: "North Valley Travel Co. cleared finance review and passed to delivery.", time: "1 hour ago" },
];

function Sidebar() {
  return (
    <aside className="hidden w-80 shrink-0 border-r border-slate-200 bg-slate-950/95 text-slate-100 lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-lg font-semibold text-emerald-300">
            RV
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">RV Sales Mission Control</p>
            <p className="text-xs text-slate-400">Dealership command center</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-5">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
              item.active
                ? "bg-white/10 text-white"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span>{item.label}</span>
            {item.badge ? (
              <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] text-emerald-300">
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4 text-sm text-slate-400">
        <p className="font-medium text-slate-200">Live floor health</p>
        <div className="mt-3 rounded-2xl bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <span>Conversion rate</span>
            <span className="text-emerald-300">21.4%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[72%] rounded-full bg-emerald-300" />
          </div>
        </div>
      </div>
    </aside>
  );
}

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

export function Dashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar />

      <main className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-sm font-medium text-slate-500">{greeting}, Avery</p>
            <h1 className="text-2xl font-semibold text-slate-950">RV Sales Mission Control</h1>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Sales floor online</span>
          </div>
        </header>

        <div className="space-y-6 p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Pipeline value" value="$2.84M" change="+12.6%" tone="blue" />
            <MetricCard title="Deals closing this week" value="18" change="+3" tone="emerald" />
            <MetricCard title="Inventory price review" value="11 units" change="2 urgent" tone="amber" />
            <MetricCard title="Marketing ROI" value="4.8x" change="+0.7x" tone="violet" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Panel title="Hot opportunities" action="Updated 5 min ago">
              <div className="space-y-3">
                {opportunities.map((item) => (
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
                {tasks.map((task) => (
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
                {inventory.map((item) => (
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
                {activities.map((activity) => (
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
      </main>
    </div>
  );
}
