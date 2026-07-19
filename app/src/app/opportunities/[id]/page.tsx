import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getOpportunityById } from "@/lib/opportunities";
import { getServerSession } from "@/lib/supabase/server";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

type OpportunityDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const { user } = await getServerSession();
  const { id } = await params;
  const opportunity = await getOpportunityById(id);

  if (!opportunity) {
    notFound();
  }

  return (
    <AppShell title="Opportunity detail" description="Review the full context for this deal." userName={user?.email ?? "Avery"}>
      <div className="space-y-6">
        <Link href="/opportunities" className="text-sm font-medium text-sky-700 hover:text-sky-800">
          ← Back to opportunities
        </Link>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">{opportunity.customer_name}</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">{opportunity.rv_name}</h2>
              <p className="mt-2 text-sm text-slate-600">{opportunity.notes}</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {opportunity.stage}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Buying score</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{opportunity.buying_score}/100</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Estimated value</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{formatCurrency(opportunity.estimated_value)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Trade-in</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{opportunity.trade_in_status}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Finance</p>
              <p className="mt-2 text-xl font-semibold text-slate-950">{opportunity.finance_status}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-950">Sales owner</h3>
              <p className="mt-2 text-sm text-slate-600">{opportunity.assigned_salesperson}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-950">Last contact</h3>
              <p className="mt-2 text-sm text-slate-600">{opportunity.last_contact}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 lg:col-span-2">
              <h3 className="font-semibold text-slate-950">Next action</h3>
              <p className="mt-2 text-sm text-slate-600">{opportunity.next_action}</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
