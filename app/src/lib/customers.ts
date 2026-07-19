import { createClient } from "@/lib/supabase/client";
import { sampleCustomers } from "@/lib/sample-data";

export type CustomerRecord = {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  source?: string;
  assigned_to?: string;
  notes?: string;
  created_at?: string;
};

export type CustomerProfile = CustomerRecord & {
  timeline: Array<{ title: string; detail: string; time: string }>;
  opportunities: Array<{ title: string; amount: string; status: string }>;
  tasks: Array<{ title: string; due: string; priority: string }>;
};

async function getSupabaseClient() {
  if (typeof window === "undefined") {
    return null;
  }

  return createClient();
}

export async function getCustomers(): Promise<CustomerRecord[]> {
  const supabase = await getSupabaseClient();

  if (supabase) {
    try {
      const { data } = await supabase.from("customers").select("*").order("created_at", { ascending: false });

      if (data?.length) {
        return data.map((customer) => ({
          ...customer,
          full_name: customer.full_name ?? "Unnamed customer",
          source: customer.source ?? "Inbound",
        }));
      }
    } catch {
      // fall back to sample data if Supabase is unavailable
    }
  }

  return sampleCustomers;
}

export async function createCustomer(input: Omit<CustomerRecord, "id" | "created_at">): Promise<CustomerRecord> {
  const supabase = await getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("customers")
        .insert({
          id: crypto.randomUUID(),
          full_name: input.full_name,
          phone: input.phone ?? null,
          email: input.email ?? null,
          source: input.source ?? null,
          assigned_to: input.assigned_to ?? null,
        })
        .select()
        .single();

      if (!error && data) {
        return data as CustomerRecord;
      }
    } catch {
      // fall back to sample data if Supabase is unavailable
    }
  }

  return {
    id: crypto.randomUUID(),
    full_name: input.full_name,
    phone: input.phone,
    email: input.email,
    source: input.source,
    assigned_to: input.assigned_to,
    notes: input.notes,
    created_at: new Date().toISOString(),
  };
}

export async function getCustomerById(id: string): Promise<CustomerProfile | null> {
  const customers = await getCustomers();
  const customer = customers.find((item) => item.id === id);

  if (!customer) {
    return null;
  }

  const profile = sampleCustomers.find((item) => item.id === id);

  return {
    ...customer,
    notes: customer.notes ?? profile?.notes ?? "Customer prefers follow-up by phone in the afternoon.",
    timeline: profile?.timeline ?? [
      { title: "Lead created", detail: "Customer added to the pipeline.", time: "Today" },
      { title: "Follow-up requested", detail: "Requested a walkthrough for this weekend.", time: "Yesterday" },
    ],
    opportunities: profile?.opportunities ?? [
      { title: "2026 Keystone Montana", amount: "$108,150", status: "In review" },
    ],
    tasks: profile?.tasks ?? [
      { title: "Confirm financing details", due: "Today • 3:00 PM", priority: "High" },
    ],
  };
}
