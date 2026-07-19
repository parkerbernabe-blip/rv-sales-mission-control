export type DashboardRecord = {
  opportunities: Array<{
    customer: string;
    unit: string;
    status: string;
    amount: string;
    closeDate: string;
    confidence: string;
  }>;
  tasks: Array<{
    title: string;
    owner: string;
    due: string;
    priority: string;
  }>;
  inventory: Array<{
    unit: string;
    lot: string;
    currentPrice: string;
    targetPrice: string;
    delta: string;
  }>;
  activities: Array<{
    title: string;
    detail: string;
    time: string;
  }>;
};

export type CustomerSampleRecord = {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  source?: string;
  assigned_to?: string;
  notes?: string;
  created_at?: string;
  timeline: Array<{ title: string; detail: string; time: string }>;
  opportunities: Array<{ title: string; amount: string; status: string }>;
  tasks: Array<{ title: string; due: string; priority: string }>;
};

export type OpportunitySampleRecord = {
  id: string;
  customer_name: string;
  rv_name: string;
  buying_score: number;
  stage: string;
  trade_in_status: string;
  finance_status: string;
  estimated_value: number;
  assigned_salesperson: string;
  last_contact: string;
  next_action: string;
  notes?: string;
  created_at?: string;
};

export const sampleCustomers: CustomerSampleRecord[] = [
  {
    id: "cust-1",
    full_name: "Maya Thompson",
    phone: "(555) 204-1182",
    email: "maya@cedarridge.com",
    source: "Website",
    assigned_to: "Chris Alvarez",
    notes: "Interested in a four-season toy hauler with solar prep.",
    created_at: "2026-07-10T14:20:00.000Z",
    timeline: [
      { title: "Inquiry received", detail: "Requested a weekend walkthrough.", time: "2 hrs ago" },
      { title: "Follow-up completed", detail: "Shared pricing on two comparable units.", time: "Yesterday" },
    ],
    opportunities: [
      { title: "2026 Forest River Georgetown 34H", amount: "$124,800", status: "Negotiation" },
    ],
    tasks: [
      { title: "Mail financing options", due: "Today • 4:00 PM", priority: "High" },
    ],
  },
  {
    id: "cust-2",
    full_name: "Jordan Lee",
    phone: "(555) 482-9330",
    email: "jordan@northvalley.com",
    source: "Referral",
    assigned_to: "Mia Chen",
    notes: "Prefers delivery outside of the city and wants a trade-in appraisal.",
    created_at: "2026-07-08T09:15:00.000Z",
    timeline: [
      { title: "Referral received", detail: "Friend referred them after a purchase last month.", time: "3 days ago" },
      { title: "Trade-in requested", detail: "Needs an appraisal for a 2021 travel trailer.", time: "Yesterday" },
    ],
    opportunities: [
      { title: "2026 Keystone Montana High Country", amount: "$108,150", status: "Finance review" },
    ],
    tasks: [
      { title: "Schedule trade-in evaluation", due: "Tomorrow • 11:00 AM", priority: "Medium" },
    ],
  },
  {
    id: "cust-3",
    full_name: "Riley Gomez",
    phone: "(555) 311-8774",
    email: "riley@baysideoutdoors.com",
    source: "Inbound call",
    assigned_to: "Jordan Patel",
    notes: "Planning a family trip and wants bunkhouse layout options.",
    created_at: "2026-07-06T16:40:00.000Z",
    timeline: [
      { title: "Call placed", detail: "Discussed bunkhouse layouts and price flexibility.", time: "5 days ago" },
    ],
    opportunities: [
      { title: "2025 Grand Design Reflection 315RL", amount: "$97,400", status: "Appraisal" },
    ],
    tasks: [
      { title: "Prepare comparison sheet", due: "Friday • 2:30 PM", priority: "Low" },
    ],
  },
];

export const sampleOpportunities: OpportunitySampleRecord[] = [
  {
    id: "opp-1",
    customer_name: "Maya Thompson",
    rv_name: "2026 Forest River Georgetown 34H",
    buying_score: 92,
    stage: "Negotiation",
    trade_in_status: "Pending appraisal",
    finance_status: "Pre-approval ready",
    estimated_value: 124800,
    assigned_salesperson: "Chris Alvarez",
    last_contact: "Today • 2:30 PM",
    next_action: "Send revised financing terms",
    notes: "Customer is comparing solar and bunkhouse options before signing.",
    created_at: "2026-07-10T14:20:00.000Z",
  },
  {
    id: "opp-2",
    customer_name: "Jordan Lee",
    rv_name: "2026 Keystone Montana High Country",
    buying_score: 87,
    stage: "Finance review",
    trade_in_status: "Trade-in approved",
    finance_status: "Credit submitted",
    estimated_value: 108150,
    assigned_salesperson: "Mia Chen",
    last_contact: "Yesterday • 4:10 PM",
    next_action: "Finalize trade-in paperwork",
    notes: "Needs delivery outside the city and wants a full walkthrough.",
    created_at: "2026-07-08T09:15:00.000Z",
  },
  {
    id: "opp-3",
    customer_name: "Riley Gomez",
    rv_name: "2025 Grand Design Reflection 315RL",
    buying_score: 81,
    stage: "Appraisal",
    trade_in_status: "Awaiting photos",
    finance_status: "Needs lender call",
    estimated_value: 97400,
    assigned_salesperson: "Jordan Patel",
    last_contact: "2 days ago",
    next_action: "Upload trade-in photos and follow up",
    notes: "Family of four; interested in bunkhouse floorplans and a lower monthly payment.",
    created_at: "2026-07-06T16:40:00.000Z",
  },
  {
    id: "opp-4",
    customer_name: "Alicia Brooks",
    rv_name: "2025 Coachmen Leprechaun 320MP",
    buying_score: 78,
    stage: "Discovery",
    trade_in_status: "No trade-in",
    finance_status: "Consultation scheduled",
    estimated_value: 89600,
    assigned_salesperson: "Sage Martin",
    last_contact: "Today • 9:45 AM",
    next_action: "Review floorplan shortlist",
    notes: "Customer is comparing weekend-use models and storage capacity.",
    created_at: "2026-07-11T08:00:00.000Z",
  },
];

export const sampleDashboardData: DashboardRecord = {
  opportunities: [
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
  ],
  tasks: [
    { title: "Confirm tow package pricing", owner: "Chris", due: "9:30 AM", priority: "High" },
    { title: "Follow up on financing terms", owner: "Mia", due: "11:00 AM", priority: "Medium" },
    { title: "Schedule photo walkthrough", owner: "Jordan", due: "1:30 PM", priority: "Low" },
  ],
  inventory: [
    { unit: "2025 Jayco Eagle HT 27.5R", lot: "Lot B-12", currentPrice: "$62,900", targetPrice: "$65,750", delta: "+$2,850" },
    { unit: "2024 Winnebago Minnie Winnie 24B", lot: "Lot C-08", currentPrice: "$78,600", targetPrice: "$81,400", delta: "+$2,800" },
    { unit: "2026 Coachmen Leprechaun 320MP", lot: "Lot D-03", currentPrice: "$101,500", targetPrice: "$104,900", delta: "+$3,400" },
  ],
  activities: [
    { title: "New lead assigned to sales team", detail: "Cedar Ridge Campers requested a live walkthrough.", time: "12 min ago" },
    { title: "Inventory note updated", detail: "The 2025 Jayco Eagle HT 27.5R was re-priced for weekend promotion.", time: "34 min ago" },
    { title: "Customer contract approved", detail: "North Valley Travel Co. cleared finance review and passed to delivery.", time: "1 hour ago" },
  ],
};
