import type { Broadcast, Client, Product, Task } from "./types";

/**
 * All data for the demo lives here. No backend, no API — this is the single
 * source of truth that every screen reads from.
 */

export const clients: Client[] = [
  {
    id: "1",
    name: "Rajesh Sharma",
    phone: "+91 98765 43210",
    dob: "15/05/1985",
    age: 39,
    gender: "Male",
    city: "Mumbai",
    products: ["LIC", "MF"],
    isChampion: true,
    isPrime: false,
    referralCount: 5,
    referredBy: "Sunil Patel",
    lastContacted: "2 days ago",
    avatar: "navy",
    policies: {
      LIC: { ref: "LIC12345", renewal: "Jun 10", renewalDays: 6 },
      MF: { ref: "MF9876", renewal: "Jul 20", renewalDays: 47 },
    },
    activity: [
      { text: "Last contacted via WhatsApp", time: "2 days ago" },
      { text: "Task: Review portfolio", time: "Created last week" },
    ],
  },
  {
    id: "2",
    name: "Priya Mehta",
    phone: "+91 87654 32109",
    dob: "04/06/1990",
    age: 34,
    gender: "Female",
    city: "Pune",
    products: ["GIC", "MF"],
    isChampion: false,
    isPrime: false,
    referralCount: 0,
    referredBy: null,
    lastContacted: "Yesterday",
    avatar: "blue",
    birthday: "June 4",
    policies: {
      GIC: { ref: "GIC4521", renewal: "Aug 5", renewalDays: 63 },
      MF: { ref: "MF3344", renewal: "Sep 12", renewalDays: 101 },
    },
    activity: [
      { text: "Birthday today — WhatsApp wish sent", time: "Today" },
      { text: "Renewal reminder sent", time: "3 days ago" },
    ],
  },
  {
    id: "3",
    name: "Sunil Patel",
    phone: "+91 76543 21098",
    dob: "22/11/1978",
    age: 45,
    gender: "Male",
    city: "Ahmedabad",
    products: ["LIC"],
    isChampion: false,
    isPrime: true,
    referralCount: 1,
    referredBy: null,
    lastContacted: "1 week ago",
    avatar: "brown",
    policies: {
      LIC: { ref: "LIC8899", renewal: "Oct 3", renewalDays: 122 },
    },
    activity: [{ text: "Called re: LIC renewal", time: "1 week ago" }],
  },
  {
    id: "4",
    name: "Anita Joshi",
    phone: "+91 65432 10987",
    dob: "18/03/1992",
    age: 32,
    gender: "Female",
    city: "Surat",
    products: ["MF", "Forex"],
    isChampion: false,
    isPrime: true,
    referralCount: 2,
    referredBy: "Vikram Desai",
    lastContacted: "2 weeks ago",
    avatar: "gray",
    policies: {
      MF: { ref: "MF7766", renewal: "Nov 15", renewalDays: 165 },
      Forex: { ref: "FX1122", renewal: null, renewalDays: null },
    },
    activity: [
      { text: "Task: Send birthday gift", time: "In 3 days" },
      { text: "MF portfolio review", time: "2 weeks ago" },
    ],
  },
  {
    id: "5",
    name: "Vikram Desai",
    phone: "+91 54321 09876",
    dob: "07/09/1980",
    age: 43,
    gender: "Male",
    city: "Mumbai",
    products: ["LIC", "GIC", "MF", "Forex"],
    isChampion: true,
    isPrime: false,
    referralCount: 3,
    referredBy: null,
    lastContacted: "1 month ago",
    avatar: "navy",
    policies: {
      LIC: { ref: "LIC5544", renewal: "Jun 18", renewalDays: 14 },
      GIC: { ref: "GIC3322", renewal: "Jul 7", renewalDays: 34 },
      MF: { ref: "MF9911", renewal: "Aug 30", renewalDays: 88 },
      Forex: { ref: "FX3344", renewal: null, renewalDays: null },
    },
    activity: [
      { text: "Task: Call re: MF renewal", time: "Due today" },
      { text: "Last contacted", time: "1 month ago" },
    ],
  },
  {
    id: "6",
    name: "Amit Kumar",
    phone: "+91 99876 54321",
    dob: "06/06/1983",
    age: 41,
    gender: "Male",
    city: "Vadodara",
    products: ["LIC", "GIC"],
    isChampion: false,
    isPrime: false,
    referralCount: 0,
    referredBy: "Rajesh Sharma",
    lastContacted: "5 days ago",
    avatar: "blue",
    birthday: "June 6",
    policies: {
      LIC: { ref: "LIC2207", renewal: "Jun 25", renewalDays: 22 },
      GIC: { ref: "GIC6610", renewal: "Sep 1", renewalDays: 90 },
    },
    activity: [
      { text: "Discussed term plan top-up", time: "5 days ago" },
      { text: "Referred by Rajesh Sharma", time: "Last month" },
    ],
  },
  {
    id: "7",
    name: "Neha Gupta",
    phone: "+91 91234 56780",
    dob: "29/01/1995",
    age: 29,
    gender: "Female",
    city: "Mumbai",
    products: ["MF", "Stock Broking"],
    isChampion: false,
    isPrime: true,
    referralCount: 1,
    referredBy: "Anita Joshi",
    lastContacted: "3 days ago",
    avatar: "gray",
    policies: {
      MF: { ref: "MF5521", renewal: "Jul 2", renewalDays: 29 },
      "Stock Broking": { ref: "DM4407", renewal: null, renewalDays: null },
    },
    activity: [
      { text: "Opened demat account", time: "3 days ago" },
      { text: "SIP setup completed", time: "2 weeks ago" },
    ],
  },
  {
    id: "8",
    name: "Rohan Iyer",
    phone: "+91 90011 22334",
    dob: "11/12/1975",
    age: 48,
    gender: "Male",
    city: "Nashik",
    products: ["LIC", "GIC", "MF"],
    isChampion: true,
    isPrime: false,
    referralCount: 4,
    referredBy: null,
    lastContacted: "4 days ago",
    avatar: "brown",
    policies: {
      LIC: { ref: "LIC7012", renewal: "Jun 14", renewalDays: 11 },
      GIC: { ref: "GIC8801", renewal: "Aug 19", renewalDays: 77 },
      MF: { ref: "MF1290", renewal: "Oct 10", renewalDays: 129 },
    },
    activity: [
      { text: "Annual review meeting", time: "4 days ago" },
      { text: "Added GIC health cover", time: "1 month ago" },
    ],
  },
];

export const tasks: Task[] = [
  {
    id: "1",
    clientId: "5",
    clientName: "Vikram Desai",
    note: "Call re: MF renewal",
    dueDate: "today",
    status: "pending",
  },
  {
    id: "2",
    clientId: "2",
    clientName: "Priya Mehta",
    note: "Prepare portfolio review presentation",
    dueDate: "tomorrow",
    status: "pending",
  },
  {
    id: "3",
    clientId: "4",
    clientName: "Anita Joshi",
    note: "Send birthday wishes and gift",
    dueDate: "in 3 days",
    status: "pending",
  },
  {
    id: "4",
    clientId: "8",
    clientName: "Rohan Iyer",
    note: "Share LIC renewal quote before due date",
    dueDate: "in 5 days",
    status: "pending",
  },
  {
    id: "5",
    clientId: "7",
    clientName: "Neha Gupta",
    note: "Follow up on demat KYC documents",
    dueDate: "next week",
    status: "pending",
  },
];

export const broadcasts: Broadcast[] = [
  {
    id: "1",
    message:
      "Monthly Market Update — November edition is here. Key highlights inside.",
    recipients: 1200,
    date: "Oct 25",
    status: "DELIVERED",
  },
  {
    id: "2",
    message:
      "LIC Renewal Reminder — Your policy is due for renewal. Please get in touch.",
    recipients: 45,
    date: "Oct 20",
    status: "DELIVERED",
  },
  {
    id: "3",
    message:
      "Wishing you a prosperous Diwali from Agamic Financial Services. Stay invested, stay secure.",
    recipients: 1200,
    date: "Oct 12",
    status: "DELIVERED",
  },
];

/** Headline numbers shown on the dashboard. */
export const dashboardStats = {
  totalClients: 1200,
  renewalsThisMonth: 45,
  birthdaysThisWeek: 12,
  pendingTasks: 8,
};

/** Recipient counts for the broadcast audience selector. */
export const broadcastAudiences: { key: string; label: string; count: number }[] =
  [
    { key: "all", label: "All Clients", count: 1200 },
    { key: "lic", label: "LIC Only", count: 430 },
    { key: "gic", label: "GIC Only", count: 280 },
    { key: "mf", label: "MF Only", count: 510 },
    { key: "forex", label: "Forex Only", count: 120 },
    { key: "champions", label: "Champions Only", count: 34 },
    { key: "prime", label: "Prime Only", count: 67 },
  ];

/** Champions leaderboard summary stats (firm-wide, year to date). */
export const championStats = {
  totalReferralsYTD: 142,
  totalReferralsDelta: "+12%",
  newChampionsMoM: 8,
  newChampionsDelta: "+2",
};

export const products: Product[] = ["LIC", "GIC", "MF", "Forex", "Stock Broking"];

export const productMeta: Record<
  Product,
  { label: string; pill: string; refLabel: string }
> = {
  LIC: { label: "Life Insurance (LIC)", pill: "bg-blue-100 text-blue-800", refLabel: "Policy" },
  GIC: { label: "General Insurance (GIC)", pill: "bg-green-100 text-green-800", refLabel: "Policy" },
  MF: { label: "Mutual Funds (MF)", pill: "bg-amber-100 text-amber-800", refLabel: "Folio" },
  Forex: { label: "Forex", pill: "bg-purple-100 text-purple-800", refLabel: "Account" },
  "Stock Broking": { label: "Stock Broking", pill: "bg-rose-100 text-rose-800", refLabel: "Demat" },
};

export const avatarTones: Record<Client["avatar"], string> = {
  navy: "bg-primary-container text-on-primary",
  blue: "bg-secondary-container text-on-secondary-container",
  brown: "bg-tertiary-container text-on-tertiary",
  gray: "bg-surface-variant text-on-surface-variant",
};

// ---- Derived helpers ---------------------------------------------------------

export function getClient(id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export interface RenewalEntry {
  client: Client;
  product: Product;
  renewal: string;
  renewalDays: number;
}

/** Flattened, soonest-first list of upcoming policy renewals. */
export function getUpcomingRenewals(maxDays = 9999): RenewalEntry[] {
  const entries: RenewalEntry[] = [];
  for (const client of clients) {
    for (const product of client.products) {
      const policy = client.policies[product];
      if (policy && policy.renewal && policy.renewalDays != null) {
        entries.push({
          client,
          product,
          renewal: policy.renewal,
          renewalDays: policy.renewalDays,
        });
      }
    }
  }
  return entries
    .filter((e) => e.renewalDays <= maxDays)
    .sort((a, b) => a.renewalDays - b.renewalDays);
}

/** Clients with a birthday this week, for the dashboard scroller. */
export function getBirthdaysThisWeek(): Client[] {
  return clients.filter((c) => c.birthday);
}

/** Champions ranked by referrals, for the leaderboard. */
export function getChampions(): Client[] {
  return clients
    .filter((c) => c.isChampion)
    .sort((a, b) => b.referralCount - a.referralCount);
}

export type Urgency = "red" | "amber" | "green";

/** Renewal urgency: red < 7 days, amber < 30 days, green otherwise. */
export function renewalUrgency(days: number): Urgency {
  if (days < 7) return "red";
  if (days < 30) return "amber";
  return "green";
}

export const urgencyPill: Record<Urgency, string> = {
  red: "bg-error-container text-on-error-container",
  amber: "bg-amber-100 text-amber-800",
  green: "bg-green-100 text-green-800",
};
