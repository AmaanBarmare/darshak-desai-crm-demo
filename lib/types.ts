export type Product = "LIC" | "GIC" | "MF" | "Forex" | "Stock Broking";

export interface Policy {
  ref: string;
  /** Friendly renewal label, e.g. "Jun 10". null = no fixed renewal (e.g. Forex). */
  renewal: string | null;
  /** Stable days-until-renewal used to drive the urgency pill colour. */
  renewalDays: number | null;
}

export interface ActivityItem {
  text: string;
  time: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  dob: string;
  age: number;
  gender: "Male" | "Female";
  city: string;
  products: Product[];
  isChampion: boolean;
  isPrime: boolean;
  referralCount: number;
  referredBy: string | null;
  lastContacted: string;
  policies: Partial<Record<Product, Policy>>;
  activity: ActivityItem[];
  /** Avatar background tone — keeps cards visually varied. */
  avatar: "navy" | "blue" | "brown" | "gray";
  /** Birthday label, present only for clients with a birthday this week. */
  birthday?: string;
}

export interface Task {
  id: string;
  clientId: string;
  clientName: string;
  note: string;
  dueDate: "today" | "tomorrow" | "in 3 days" | "in 5 days" | "next week";
  status: "pending" | "done";
}

export interface Broadcast {
  id: string;
  message: string;
  recipients: number;
  date: string;
  status: "DELIVERED" | "SENT";
}
