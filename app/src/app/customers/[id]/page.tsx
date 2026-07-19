import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { getCustomerById } from "@/lib/customers";
import { getServerSession } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { user } = await getServerSession();
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (hasSupabaseConfig && !user) {
    redirect("/login");
  }

  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <AppShell title={customer.full_name} description="Customer profile, timeline, and next steps." userName={user?.email ?? "Avery"}>
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Primary contact</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">{customer.full_name}</h2>
              <p className="mt-2 text-sm text-slate-500">{customer.notes}</p>
            </div>
            <Link href="/customers" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              Back to customers
            </Link>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
              <h3 className="text-lg font-semibold text-slate-950">Contact information</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="mt-1 font-medium text-slate-900">{customer.phone ?? "Not provided"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="mt-1 font-medium text-slate-900">{customer.email ?? "Not provided"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Lead source</p>
                  <p className="mt-1 font-medium text-slate-900">{customer.source ?? "Inbound"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Assigned salesperson</p>
                  <p className="mt-1 font-medium text-slate-900">{customer.assigned_to ?? "Unassigned"}</p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
              <h3 className="text-lg font-semibold text-slate-950">Timeline</h3>
              <div className="mt-4 space-y-3">
                {customer.timeline.map((item) => (
                  <div key={`${item.title}-${item.time}`} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <span className="text-sm text-slate-500">{item.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
              <h3 className="text-lg font-semibold text-slate-950">Notes</h3>
              <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">{customer.notes}</p>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
              <h3 className="text-lg font-semibold text-slate-950">Opportunities</h3>
              <div className="mt-4 space-y-3">
                {customer.opportunities.map((opportunity) => (
                  <div key={opportunity.title} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-900">{opportunity.title}</p>
                      <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">{opportunity.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{opportunity.amount}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
              <h3 className="text-lg font-semibold text-slate-950">Tasks</h3>
              <div className="mt-4 space-y-3">
                {customer.tasks.map((task) => (
                  <div key={task.title} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{task.priority}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{task.due}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
