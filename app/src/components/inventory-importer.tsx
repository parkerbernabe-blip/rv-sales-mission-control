"use client";

import { useMemo, useState } from "react";
import { sampleImportPayload, type InventoryDraftRecord } from "@/lib/inventory";

type ImporterProps = {
  initialDraft?: InventoryDraftRecord;
};

const emptyDraft = {
  year: "",
  make: "",
  model: "",
  floorplan: "",
  condition: "Used",
  price: "",
  stockNumber: "",
  vin: "",
  unitType: "",
  location: "",
  description: "",
  specifications: "",
  features: "",
  imageUrls: [] as string[],
  originalUrl: "",
  sourceNotes: "",
  missingFields: [] as string[],
};

type DraftShape = typeof emptyDraft;

function buildPreviewFromPayload(payload: typeof sampleImportPayload) {
  return {
    year: payload.year ?? "",
    make: payload.make ?? "",
    model: payload.model ?? "",
    floorplan: payload.floorplan ?? "",
    condition: payload.condition ?? "Used",
    price: payload.price ?? "",
    stockNumber: payload.stockNumber ?? "",
    vin: payload.vin ?? "",
    unitType: payload.unitType ?? "",
    location: payload.location ?? "",
    description: payload.description ?? "",
    specifications: payload.specifications ?? "",
    features: payload.features ?? "",
    imageUrls: payload.imageUrls ?? [],
    originalUrl: payload.originalUrl ?? "",
    sourceNotes: payload.sourceNotes ?? "",
    missingFields: payload.missingFields ?? [],
  };
}

export function InventoryImporter({ initialDraft }: ImporterProps) {
  const [url, setUrl] = useState("");
  const [draft, setDraft] = useState<DraftShape>(initialDraft ? {
    year: initialDraft.year ?? "",
    make: initialDraft.make ?? "",
    model: initialDraft.model ?? "",
    floorplan: initialDraft.floorplan ?? "",
    condition: initialDraft.condition ?? "Used",
    price: initialDraft.price ?? "",
    stockNumber: initialDraft.stockNumber ?? "",
    vin: initialDraft.vin ?? "",
    unitType: initialDraft.unitType ?? "",
    location: initialDraft.location ?? "",
    description: initialDraft.description ?? "",
    specifications: initialDraft.specifications ?? "",
    features: initialDraft.features ?? "",
    imageUrls: initialDraft.imageUrls ?? [],
    originalUrl: initialDraft.originalUrl ?? "",
    sourceNotes: initialDraft.sourceNotes ?? "",
    missingFields: [] as string[],
  } : emptyDraft);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const generatedCopy = useMemo(() => ({
    facebook: `Check out this ${draft.year || ""} ${draft.make || ""} ${draft.model || ""} ${draft.floorplan || ""}`.trim() + ` for ${draft.price || "inquire for pricing"}. ${draft.description || "A great RV option for your next adventure."}`,
    instagram: `New RV in the shop: ${draft.year || ""} ${draft.make || ""} ${draft.model || ""} ${draft.floorplan || ""}. ${draft.price || "Inquire for pricing"}.`,
    marketplace: `Available now: ${draft.year || ""} ${draft.make || ""} ${draft.model || ""} ${draft.floorplan || ""}. ${draft.condition || "Used"} condition. ${draft.price || "Call for pricing"}.`,
  }), [draft]);

  async function handleAnalyze() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/inventory/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const payload = await response.json();
      if (payload?.error) {
        setError(payload.error);
      }

      setDraft((current) => ({
        ...current,
        ...buildPreviewFromPayload(payload),
      }));
    } catch {
      setError("The import request could not be completed.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      setError("Copy to clipboard failed.");
    }
  }

  function handleSaveDraft() {
    setError(null);
    setDraft((current) => ({ ...current, sourceNotes: current.sourceNotes || "Saved as a draft for review." }));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Inventory importer</p>
            <h2 className="text-xl font-semibold text-slate-950">Paste a public listing URL and turn it into a draft</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/listing"
              className="w-full min-w-[280px] rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
            />
            <button type="button" onClick={handleAnalyze} disabled={isLoading || !url.trim()} className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
              {isLoading ? "Analyzing..." : "Analyze Unit"}
            </button>
          </div>
        </div>

        {error ? <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">{error}</div> : null}

        {draft.sourceNotes ? <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">{draft.sourceNotes}</div> : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-950">Editable preview</h3>
            <button type="button" onClick={handleSaveDraft} className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">Save draft</button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ["Year", "year"],
              ["Make", "make"],
              ["Model", "model"],
              ["Floorplan", "floorplan"],
              ["Condition", "condition"],
              ["Price", "price"],
              ["Stock number", "stockNumber"],
              ["VIN", "vin"],
              ["Unit type", "unitType"],
              ["Location", "location"],
            ].map(([label, field]) => {
              const typedField = field as keyof DraftShape;
              return (
                <label key={field} className="block space-y-2 text-sm text-slate-700">
                  <span>{label}</span>
                  <input
                    value={String(draft[typedField] ?? "")}
                    onChange={(event) => setDraft((current) => ({ ...current, [typedField]: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
                  />
                </label>
              );
            })}

            <label className="block space-y-2 text-sm text-slate-700 md:col-span-2">
              <span>Description</span>
              <textarea rows={3} value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white" />
            </label>
            <label className="block space-y-2 text-sm text-slate-700 md:col-span-2">
              <span>Specifications</span>
              <textarea rows={3} value={draft.specifications} onChange={(event) => setDraft((current) => ({ ...current, specifications: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white" />
            </label>
            <label className="block space-y-2 text-sm text-slate-700 md:col-span-2">
              <span>Features</span>
              <textarea rows={3} value={draft.features} onChange={(event) => setDraft((current) => ({ ...current, features: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white" />
            </label>
            <label className="block space-y-2 text-sm text-slate-700 md:col-span-2">
              <span>Image URLs</span>
              <textarea rows={2} value={draft.imageUrls.join("\n")} onChange={(event) => setDraft((current) => ({ ...current, imageUrls: event.target.value.split(/\n+/).map((item) => item.trim()).filter(Boolean) }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white" />
            </label>
            <label className="block space-y-2 text-sm text-slate-700 md:col-span-2">
              <span>Original inventory URL</span>
              <input value={draft.originalUrl} onChange={(event) => setDraft((current) => ({ ...current, originalUrl: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white" />
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
            <h3 className="text-lg font-semibold text-slate-950">What could not be found</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {draft.missingFields.length ? draft.missingFields.map((field) => <span key={field} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{field}</span>) : <span className="text-sm text-slate-500">The importer found most of the fields automatically.</span>}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
            <h3 className="text-lg font-semibold text-slate-950">Marketing copy</h3>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">Facebook</p>
                  <button type="button" onClick={() => handleCopy(generatedCopy.facebook)} className="text-sm font-medium text-sky-700">{copied === generatedCopy.facebook ? "Copied" : "Copy"}</button>
                </div>
                <p className="mt-2 text-sm text-slate-600">{generatedCopy.facebook}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">Instagram</p>
                  <button type="button" onClick={() => handleCopy(generatedCopy.instagram)} className="text-sm font-medium text-sky-700">{copied === generatedCopy.instagram ? "Copied" : "Copy"}</button>
                </div>
                <p className="mt-2 text-sm text-slate-600">{generatedCopy.instagram}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">Marketplace</p>
                  <button type="button" onClick={() => handleCopy(generatedCopy.marketplace)} className="text-sm font-medium text-sky-700">{copied === generatedCopy.marketplace ? "Copied" : "Copy"}</button>
                </div>
                <p className="mt-2 text-sm text-slate-600">{generatedCopy.marketplace}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
