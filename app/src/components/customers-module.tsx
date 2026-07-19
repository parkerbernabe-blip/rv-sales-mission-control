"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createCustomer, getCustomers, type CustomerRecord } from "@/lib/customers";
import { sampleCustomers } from "@/lib/sample-data";

type CustomersModuleProps = {
  initialCustomers?: CustomerRecord[];
};

type FormState = {
  full_name: string;
  phone: string;
  email: string;
  source: string;
  assigned_to: string;
  notes: string;
};

const emptyForm: FormState = {
  full_name: "",
  phone: "",
  email: "",
  source: "",
  assigned_to: "",
  notes: "",
};

export function CustomersModule({ initialCustomers = sampleCustomers }: CustomersModuleProps) {
  const [customers, setCustomers] = useState<CustomerRecord[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    (async () => {
      const remoteCustomers = await getCustomers();
      if (isActive) {
        setCustomers(remoteCustomers);
      }
    })();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter((customer) => {
      const haystack = `${customer.full_name} ${customer.email ?? ""} ${customer.phone ?? ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [customers, search]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.full_name.trim()) {
      return;
    }

    setIsSubmitting(true);
    const created = await createCustomer({
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      source: form.source.trim(),
      assigned_to: form.assigned_to.trim(),
      notes: form.notes.trim(),
    });
    setCustomers((current) => [created, ...current]);
    setForm(emptyForm);
    setIsSubmitting(false);
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Customer pipeline</p>
          <h2 className="text-xl font-semibold text-slate-950">{filteredCustomers.length} active customers</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            <span>🔎</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers"
              className="w-full bg-transparent outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add Customer
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Contact</th>
                <th className="px-5 py-4">Lead source</th>
                <th className="px-5 py-4">Assigned to</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <Link href={`/customers/${customer.id}`} className="flex flex-col">
                      <span className="font-semibold text-slate-900">{customer.full_name}</span>
                      <span className="mt-1 text-sm text-slate-500">Created {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : "recently"}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    <div>{customer.email ?? "No email on file"}</div>
                    <div>{customer.phone ?? "No phone on file"}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{customer.source ?? "Inbound"}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{customer.assigned_to ?? "Unassigned"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-10">
          <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">New customer</p>
                <h3 className="text-xl font-semibold text-slate-950">Add customer profile</h3>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block space-y-2 text-sm text-slate-700 md:col-span-2">
                <span>Name</span>
                <input
                  required
                  value={form.full_name}
                  onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
                />
              </label>
              <label className="block space-y-2 text-sm text-slate-700">
                <span>Phone</span>
                <input
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
                />
              </label>
              <label className="block space-y-2 text-sm text-slate-700">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
                />
              </label>
              <label className="block space-y-2 text-sm text-slate-700">
                <span>Lead Source</span>
                <input
                  value={form.source}
                  onChange={(event) => setForm((current) => ({ ...current, source: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
                />
              </label>
              <label className="block space-y-2 text-sm text-slate-700">
                <span>Assigned Salesperson</span>
                <input
                  value={form.assigned_to}
                  onChange={(event) => setForm((current) => ({ ...current, assigned_to: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
                />
              </label>
              <label className="block space-y-2 text-sm text-slate-700 md:col-span-2">
                <span>Notes</span>
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
                />
              </label>

              <div className="flex justify-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Saving..." : "Save customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
