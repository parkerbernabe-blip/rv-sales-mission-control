"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createOpportunity, type OpportunityRecord } from "@/lib/opportunities";
import { sampleOpportunities } from "@/lib/sample-data";

type OpportunitiesModuleProps = {
  initialOpportunities?: OpportunityRecord[];
};

type FormState = {
  customer_name: string;
  rv_name: string;
  buying_score: string;
  stage: string;
  trade_in_status: string;
  finance_status: string;
  estimated_value: string;
  assigned_salesperson: string;
  last_contact: string;
  next_action: string;
  notes: string;
};

const emptyForm: FormState = {
  customer_name: "",
  rv_name: "",
  buying_score: "82",
  stage: "Discovery",
  trade_in_status: "No trade-in",
  finance_status: "Consultation scheduled",
  estimated_value: "95000",
  assigned_salesperson: "",
  last_contact: "Today",
  next_action: "Schedule follow-up",
  notes: "",
};

const stages = ["Discovery", "Appraisal", "Finance review", "Negotiation", "Closed"];
const tradeInStatuses = ["No trade-in", "Pending appraisal", "Trade-in approved", "Awaiting photos"];
const financeStatuses = ["Consultation scheduled", "Pre-approval ready", "Credit submitted", "Needs lender call"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function badgeTone(stage: string) {
  switch (stage) {
    case "Negotiation":
      return "bg-emerald-50 text-emerald-700";
    case "Finance review":
      return "bg-sky-50 text-sky-700";
    case "Appraisal":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function OpportunitiesModule({ initialOpportunities = sampleOpportunities }: OpportunitiesModuleProps) {
  const [opportunities, setOpportunities] = useState<OpportunityRecord[]>(initialOpportunities);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All stages");
  const [salespersonFilter, setSalespersonFilter] = useState("All salespeople");
  const [scoreFilter, setScoreFilter] = useState("All scores");
  const [financeFilter, setFinanceFilter] = useState("All finance");
  const [tradeInFilter, setTradeInFilter] = useState("All trade-ins");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return opportunities.filter((opportunity) => {
      const matchesQuery = !query || `${opportunity.customer_name} ${opportunity.rv_name} ${opportunity.assigned_salesperson}`.toLowerCase().includes(query);
      const matchesStage = stageFilter === "All stages" || opportunity.stage === stageFilter;
      const matchesSalesperson = salespersonFilter === "All salespeople" || opportunity.assigned_salesperson === salespersonFilter;
      const matchesScore = scoreFilter === "All scores" || (scoreFilter === "80+" && opportunity.buying_score >= 80) || (scoreFilter === "90+" && opportunity.buying_score >= 90);
      const matchesFinance = financeFilter === "All finance" || opportunity.finance_status === financeFilter;
      const matchesTrade = tradeInFilter === "All trade-ins" || opportunity.trade_in_status === tradeInFilter;

      return matchesQuery && matchesStage && matchesSalesperson && matchesScore && matchesFinance && matchesTrade;
    });
  }, [opportunities, search, stageFilter, salespersonFilter, scoreFilter, financeFilter, tradeInFilter]);

  const summary = useMemo(() => {
    const totalValue = opportunities.reduce((sum, item) => sum + item.estimated_value, 0);
    const highIntent = opportunities.filter((item) => item.buying_score >= 85).length;
    const inFinance = opportunities.filter((item) => item.finance_status.includes("Credit") || item.finance_status.includes("Pre-approval") || item.finance_status.includes("Need") || item.finance_status.includes("Consultation")).length;
    const active = opportunities.filter((item) => item.stage !== "Closed").length;

    return {
      totalValue,
      highIntent,
      inFinance,
      active,
    };
  }, [opportunities]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.customer_name.trim() || !form.rv_name.trim()) {
      return;
    }

    setIsSubmitting(true);
    const created = await createOpportunity({
      customer_name: form.customer_name.trim(),
      rv_name: form.rv_name.trim(),
      buying_score: Number(form.buying_score),
      stage: form.stage,
      trade_in_status: form.trade_in_status,
      finance_status: form.finance_status,
      estimated_value: Number(form.estimated_value),
      assigned_salesperson: form.assigned_salesperson.trim() || "Unassigned",
      last_contact: form.last_contact,
      next_action: form.next_action,
      notes: form.notes.trim(),
    });

    setOpportunities((current) => [created, ...current]);
    setForm(emptyForm);
    setIsSubmitting(false);
    setIsModalOpen(false);
  }

  const salespersonOptions = Array.from(new Set(opportunities.map((item) => item.assigned_salesperson)));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <p className="text-sm text-slate-500">Pipeline value</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{formatCurrency(summary.totalValue)}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <p className="text-sm text-slate-500">High-intent deals</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{summary.highIntent}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <p className="text-sm text-slate-500">Finance in progress</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{summary.inFinance}</p>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <p className="text-sm text-slate-500">Active opportunities</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{summary.active}</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Opportunity pipeline</p>
            <h2 className="text-xl font-semibold text-slate-950">{filteredOpportunities.length} deals in motion</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
              <span>🔎</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search opportunities"
                className="w-full bg-transparent outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Add Opportunity
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <option>All stages</option>
            {stages.map((stage) => (<option key={stage}>{stage}</option>))}
          </select>
          <select value={salespersonFilter} onChange={(event) => setSalespersonFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <option>All salespeople</option>
            {salespersonOptions.map((salesperson) => (<option key={salesperson}>{salesperson}</option>))}
          </select>
          <select value={scoreFilter} onChange={(event) => setScoreFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <option>All scores</option>
            <option>80+</option>
            <option>90+</option>
          </select>
          <select value={financeFilter} onChange={(event) => setFinanceFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <option>All finance</option>
            {financeStatuses.map((status) => (<option key={status}>{status}</option>))}
          </select>
          <select value={tradeInFilter} onChange={(event) => setTradeInFilter(event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <option>All trade-ins</option>
            {tradeInStatuses.map((status) => (<option key={status}>{status}</option>))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredOpportunities.map((opportunity) => (
          <article key={opportunity.id} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-500">{opportunity.customer_name}</p>
                <Link href={`/opportunities/${opportunity.id}`} className="mt-1 text-lg font-semibold text-slate-950 hover:text-sky-700">
                  {opportunity.rv_name}
                </Link>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badgeTone(opportunity.stage)}`}>
                {opportunity.stage}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Buying score</p>
                <p className="mt-1 text-xl font-semibold text-slate-950">{opportunity.buying_score}/100</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Estimated value</p>
                <p className="mt-1 text-xl font-semibold text-slate-950">{formatCurrency(opportunity.estimated_value)}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-3">
                <span>Trade-in</span>
                <span className="font-medium text-slate-900">{opportunity.trade_in_status}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Finance status</span>
                <span className="font-medium text-slate-900">{opportunity.finance_status}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Assigned</span>
                <span className="font-medium text-slate-900">{opportunity.assigned_salesperson}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Last contact</span>
                <span className="font-medium text-slate-900">{opportunity.last_contact}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Next action</span>
                <span className="font-medium text-slate-900">{opportunity.next_action}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-10">
          <div className="w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">New opportunity</p>
                <h3 className="text-xl font-semibold text-slate-950">Add opportunity to the pipeline</h3>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block space-y-2 text-sm text-slate-700 md:col-span-2">
                <span>Customer name</span>
                <input required value={form.customer_name} onChange={(event) => setForm((current) => ({ ...current, customer_name: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white" />
              </label>
              <label className="block space-y-2 text-sm text-slate-700 md:col-span-2">
                <span>Interested RV</span>
                <input required value={form.rv_name} onChange={(event) => setForm((current) => ({ ...current, rv_name: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white" />
              </label>
              <label className="block space-y-2 text-sm text-slate-700">
                <span>Buying score</span>
                <input type="number" min="0" max="100" value={form.buying_score} onChange={(event) => setForm((current) => ({ ...current, buying_score: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white" />
              </label>
              <label className="block space-y-2 text-sm text-slate-700">
                <span>Deal stage</span>
                <select value={form.stage} onChange={(event) => setForm((current) => ({ ...current, stage: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white">
                  {stages.map((stage) => (<option key={stage}>{stage}</option>))}
                </select>
              </label>
              <label className="block space-y-2 text-sm text-slate-700">
                <span>Trade-in status</span>
                <select value={form.trade_in_status} onChange={(event) => setForm((current) => ({ ...current, trade_in_status: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white">
                  {tradeInStatuses.map((status) => (<option key={status}>{status}</option>))}
                </select>
              </label>
              <label className="block space-y-2 text-sm text-slate-700">
                <span>Finance status</span>
                <select value={form.finance_status} onChange={(event) => setForm((current) => ({ ...current, finance_status: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white">
                  {financeStatuses.map((status) => (<option key={status}>{status}</option>))}
                </select>
              </label>
              <label className="block space-y-2 text-sm text-slate-700">
                <span>Estimated value</span>
                <input type="number" min="0" value={form.estimated_value} onChange={(event) => setForm((current) => ({ ...current, estimated_value: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white" />
              </label>
              <label className="block space-y-2 text-sm text-slate-700">
                <span>Assigned salesperson</span>
                <input value={form.assigned_salesperson} onChange={(event) => setForm((current) => ({ ...current, assigned_salesperson: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white" />
              </label>
              <label className="block space-y-2 text-sm text-slate-700">
                <span>Last contact</span>
                <input value={form.last_contact} onChange={(event) => setForm((current) => ({ ...current, last_contact: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white" />
              </label>
              <label className="block space-y-2 text-sm text-slate-700">
                <span>Next action</span>
                <input value={form.next_action} onChange={(event) => setForm((current) => ({ ...current, next_action: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white" />
              </label>
              <label className="block space-y-2 text-sm text-slate-700 md:col-span-2">
                <span>Notes</span>
                <textarea rows={4} value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white" />
              </label>

              <div className="flex justify-end gap-3 md:col-span-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
                  {isSubmitting ? "Saving..." : "Save opportunity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
