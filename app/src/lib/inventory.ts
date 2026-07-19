export type InventoryDraftRecord = {
  id: string;
  year?: string;
  make?: string;
  model?: string;
  floorplan?: string;
  condition?: string;
  price?: string;
  stockNumber?: string;
  vin?: string;
  unitType?: string;
  location?: string;
  description?: string;
  specifications?: string;
  features?: string;
  imageUrls?: string[];
  originalUrl?: string;
  sourceNotes?: string;
  createdAt: string;
};

export const sampleInventoryDrafts: InventoryDraftRecord[] = [
  {
    id: "draft-1",
    year: "2025",
    make: "Jayco",
    model: "Eagle HT",
    floorplan: "27.5R",
    condition: "Used",
    price: "$62,900",
    stockNumber: "B-12",
    unitType: "Travel trailer",
    location: "Boise, ID",
    description: "Lightly used family trailer with rear bunkhouse and solar-ready package.",
    specifications: "30' length • 2 slide-outs • 12V fridge",
    features: "Rear bunkhouse, solar prep, outdoor kitchen",
    imageUrls: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"],
    sourceNotes: "Sample draft for demo purposes.",
    createdAt: "2026-07-18T10:00:00.000Z",
  },
];

export const sampleImportPayload = {
  year: "2025",
  make: "Jayco",
  model: "Eagle HT",
  floorplan: "27.5R",
  condition: "Used",
  price: "$62,900",
  stockNumber: "B-12",
  vin: "1UFAXA3Y4H1A12345",
  unitType: "Travel trailer",
  location: "Boise, ID",
  description: "Lightly used travel trailer with rear bunkhouse and a full solar-ready package.",
  specifications: "Length 30 ft • 2 slide-outs • 12V refrigerator",
  features: "Rear bunkhouse, outside kitchen, solar prep",
  imageUrls: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"],
  originalUrl: "https://example.com/rv/2025-jayco-eagle-ht",
  missingFields: ["VIN"],
  sourceNotes: "Sample fallback import generated because the source site blocked automated extraction.",
};
