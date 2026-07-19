import { sampleOpportunities, type OpportunitySampleRecord } from "@/lib/sample-data";

export type OpportunityRecord = OpportunitySampleRecord;

export async function getOpportunities(): Promise<OpportunityRecord[]> {
  return sampleOpportunities;
}

export async function getOpportunityById(id: string): Promise<OpportunityRecord | null> {
  return sampleOpportunities.find((opportunity) => opportunity.id === id) ?? null;
}

export async function createOpportunity(input: Omit<OpportunityRecord, "id" | "created_at">): Promise<OpportunityRecord> {
  return {
    id: `opp-${crypto.randomUUID().slice(0, 8)}`,
    created_at: new Date().toISOString(),
    ...input,
  };
}
