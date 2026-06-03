"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Phone,
  CalendarPlus,
  Wallet,
  Lightbulb,
  History,
  Users2,
  CalendarClock,
  AlertTriangle,
  ShieldPlus,
  RefreshCw,
  LineChart,
  HeartPulse,
  ChevronDown,
} from "lucide-react";
import {
  getClient,
  getReferredClients,
  productMeta,
  products as allProducts,
  renewalUrgency,
  urgencyPill,
} from "@/lib/mockData";
import type { ActivityItem, Product } from "@/lib/types";
import { Avatar } from "@/components/ui";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { AddTaskModal } from "@/components/AddTaskModal";
import { useToast } from "@/components/ToastProvider";

const opportunityIcon: Partial<Record<Product, typeof ShieldPlus>> = {
  GIC: HeartPulse,
  Forex: RefreshCw,
  LIC: ShieldPlus,
  MF: LineChart,
  "Stock Broking": LineChart,
};

export default function ClientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const client = getClient(id);

  const [taskOpen, setTaskOpen] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);
  const [activity, setActivity] = useState<ActivityItem[]>(
    client?.activity ?? [],
  );
  const referred = getReferredClients(client?.name ?? "");

  if (!client) {
    return (
      <div className="py-16 text-center">
        <p className="text-headline-sm text-on-surface">Client not found</p>
        <Link
          href="/clients"
          className="mt-3 inline-block text-body-lg font-semibold text-primary hover:underline"
        >
          Back to Clients
        </Link>
      </div>
    );
  }

  const notSold = allProducts.filter((p) => !client.products.includes(p));

  function logCall() {
    setActivity((prev) => [
      { text: "Logged a call", time: "Just now" },
      ...prev,
    ]);
    showToast("Call logged");
  }

  return (
    <div className="-mt-4 md:mx-auto md:max-w-4xl">
      {/* Header */}
      <header className="sticky top-0 z-30 -mx-container-padding flex h-touch-target items-center justify-between bg-background/90 px-container-padding backdrop-blur-md">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-variant/50 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Link
          href={`/clients/${client.id}/edit`}
          aria-label="Edit client"
          className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-variant/50 active:scale-95"
        >
          <Pencil className="h-5 w-5" fill="currentColor" strokeWidth={0} />
        </Link>
      </header>

      {/* Identity */}
      <section className="mt-1 flex flex-col items-center">
        <div className="relative">
          <Avatar client={client} size="lg" />
          {(client.isChampion || client.isPrime) && (
            <div
              className={`absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full border-2 border-surface px-3 py-1 text-label-sm font-bold ${
                client.isChampion
                  ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                  : "bg-secondary-container text-on-secondary-container"
              }`}
            >
              {client.isChampion ? "★ Champion" : "✓ Prime"}
            </div>
          )}
        </div>
        <h1 className="mt-5 text-headline-md text-on-surface">{client.name}</h1>
        <p className="mt-1 tracking-wide text-body-md text-on-surface-variant">
          {client.city} • {client.age} Years • {client.gender}
        </p>
      </section>

      {/* Actions */}
      <section className="mt-section-margin flex items-end justify-center gap-8">
        <WhatsAppButton
          phone={client.phone}
          message={`Hello ${client.name.split(" ")[0]}, this is Darshak from Darshak Desai Financial Services.`}
          onSent={() => showToast("WhatsApp opened")}
          variant="ghost"
          label="WhatsApp"
        />
        <button
          onClick={() => setTaskOpen(true)}
          className="flex flex-col items-center gap-2 active:scale-95"
        >
          <span className="-mt-1 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lift">
            <CalendarPlus className="h-6 w-6" />
          </span>
          <span className="text-label-sm font-bold text-primary">Add Task</span>
        </button>
        <button
          onClick={logCall}
          className="flex flex-col items-center gap-2 active:scale-95"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-ambient">
            <Phone className="h-5 w-5" fill="currentColor" strokeWidth={0} />
          </span>
          <span className="text-label-sm text-on-surface-variant">Log Call</span>
        </button>
      </section>

      <div className="mt-section-margin flex flex-col gap-base md:block md:columns-2 md:gap-base md:[&>div]:mb-3 md:[&>div]:break-inside-avoid">
        {/* Phone + DOB */}
        <div className="rounded-xl bg-surface-container-lowest p-4 shadow-ambient">
          <div className="grid grid-cols-2 gap-4">
            <Detail label="Phone" value={client.phone} />
            <Detail label="Date of Birth" value={client.dob} />
          </div>
        </div>

        {/* Active Products */}
        <div className="rounded-xl bg-surface-container-lowest p-4 shadow-ambient">
          <SectionTitle icon={Wallet}>Active Products</SectionTitle>
          <div className="flex flex-col gap-3">
            {client.products.map((p) => {
              const policy = client.policies[p];
              const meta = productMeta[p];
              const urgency =
                policy?.renewalDays != null
                  ? renewalUrgency(policy.renewalDays)
                  : null;
              return (
                <div
                  key={p}
                  className="rounded-lg border border-surface-variant bg-surface-container-low p-3"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <span
                      className={`rounded px-2 py-1 text-label-sm font-bold ${meta.pill}`}
                    >
                      {meta.label}
                    </span>
                    {policy?.renewal ? (
                      <span
                        className={`flex items-center gap-1 rounded-full px-2 py-1 text-label-sm font-bold ${
                          urgency === "red"
                            ? "bg-error-container text-on-error-container"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {urgency === "red" ? (
                          <AlertTriangle className="h-3 w-3" />
                        ) : (
                          <CalendarClock className="h-3.5 w-3.5" />
                        )}
                        {policy.renewal}
                      </span>
                    ) : (
                      <span className="text-label-sm text-outline">
                        No renewal
                      </span>
                    )}
                  </div>
                  <p className="text-body-md text-on-surface">
                    {meta.refLabel}{" "}
                    <span className="font-semibold">#{policy?.ref}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Opportunities */}
        {notSold.length > 0 && (
          <div className="rounded-xl bg-surface-container-lowest p-4 shadow-ambient">
            <SectionTitle icon={Lightbulb} muted>
              Opportunities
            </SectionTitle>
            <p className="mb-3 text-label-sm uppercase tracking-widest text-outline">
              Not Yet Sold
            </p>
            <div className="flex flex-wrap gap-2">
              {notSold.map((p) => {
                const Icon = opportunityIcon[p] ?? ShieldPlus;
                return (
                  <div
                    key={p}
                    className="flex items-center gap-2 rounded-full border border-outline-variant bg-surface px-4 py-2 text-label-md text-outline opacity-70"
                  >
                    <Icon className="h-4 w-4" /> {p}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="rounded-xl bg-surface-container-lowest p-4 shadow-ambient">
          <SectionTitle icon={History}>Recent Activity</SectionTitle>
          <div className="ml-[10px] flex flex-col gap-5 border-l-2 border-surface-variant pl-[18px]">
            {activity.map((a, i) => (
              <div key={i} className="relative">
                <span
                  className={`absolute -left-[25px] top-1 h-3 w-3 rounded-full ring-4 ring-surface-container-lowest ${
                    i === 0 ? "bg-primary" : "bg-outline-variant"
                  }`}
                />
                <p className="text-body-md text-on-surface">{a.text}</p>
                <p className="mt-0.5 text-label-sm text-on-surface-variant">
                  {a.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Network */}
        <div className="rounded-xl bg-surface-container-lowest p-4 shadow-ambient">
          <SectionTitle icon={Users2}>Network</SectionTitle>
          <div className="flex items-stretch gap-2">
            <div className="flex-1 rounded-lg border border-surface-variant bg-surface-container-low p-3">
              <p className="mb-1 text-label-sm uppercase tracking-widest text-on-surface-variant">
                Referred By
              </p>
              <p className="text-body-md font-semibold text-primary">
                {client.referredBy ?? "Direct"}
              </p>
            </div>
            <button
              onClick={() => referred.length && setNetworkOpen((v) => !v)}
              className={`flex-1 rounded-lg border border-surface-variant bg-surface-container-low p-3 text-left transition-colors ${
                referred.length ? "hover:bg-surface-variant/60" : "cursor-default"
              }`}
            >
              <p className="mb-1 flex items-center justify-between text-label-sm uppercase tracking-widest text-on-surface-variant">
                Has Referred
                {referred.length > 0 && (
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${networkOpen ? "rotate-180" : ""}`}
                  />
                )}
              </p>
              <p className="text-body-md text-on-surface">
                <span className="text-[18px] font-bold text-primary">
                  {client.referralCount}
                </span>{" "}
                Clients
              </p>
            </button>
          </div>

          {networkOpen && referred.length > 0 && (
            <div className="mt-2 flex flex-col gap-1 border-t border-surface-variant pt-2">
              {referred.map((r) => (
                <Link
                  key={r.id}
                  href={`/clients/${r.id}`}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-surface-container-low"
                >
                  <Avatar client={r} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-md font-semibold text-on-surface">
                      {r.name}
                    </p>
                    <p className="text-label-sm text-on-surface-variant">
                      {r.city} · {r.products.join(", ")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddTaskModal
        open={taskOpen}
        onClose={() => setTaskOpen(false)}
        defaultClientId={client.id}
      />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-label-sm uppercase tracking-widest text-on-surface-variant">
        {label}
      </p>
      <p className="text-body-md font-medium text-on-surface">{value}</p>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  children,
  muted,
}: {
  icon: typeof Wallet;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <Icon className={`h-5 w-5 ${muted ? "text-outline" : "text-primary"}`} />
      <h2 className="text-headline-sm text-on-surface">{children}</h2>
    </div>
  );
}
