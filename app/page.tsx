"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  RefreshCw,
  Cake,
  ClipboardCheck,
  Calendar,
  Clock,
  ChevronRight,
  Star,
} from "lucide-react";
import {
  getBirthdaysThisWeek,
  getClient,
  getInitials,
  getUpcomingRenewals,
  renewalUrgency,
  urgencyPill,
  avatarTones,
  tasks as seedTasks,
} from "@/lib/mockData";
import { Avatar, Fab, MobileTopBar, ProductPill } from "@/components/ui";
import { useToast } from "@/components/ToastProvider";
import { WhatsAppButton } from "@/components/WhatsAppButton";

function greeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const KPIS = [
  { label: "Total Clients", value: "1,200", icon: Users },
  { label: "Renewals This Month", value: "45", icon: RefreshCw },
  { label: "Birthdays This Week", value: "12", icon: Cake },
  { label: "Pending Tasks", value: "8", icon: ClipboardCheck },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<Date | null>(null);
  const [doneTasks, setDoneTasks] = useState<Record<string, boolean>>({});
  const { showToast } = useToast();

  useEffect(() => {
    setNow(new Date());
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const renewals = getUpcomingRenewals(30).slice(0, 4);
  const birthdays = getBirthdaysThisWeek();
  const todaysTasks = seedTasks.filter(
    (t) => t.dueDate === "today" || t.dueDate === "tomorrow",
  );

  const dateLabel = now
    ? now.toLocaleDateString("en-IN", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  function toggleTask(id: string, name: string) {
    setDoneTasks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id]) showToast("Task marked as done");
      return next;
    });
  }

  return (
    <div>
      <MobileTopBar />

      <section className="mb-6">
        <h1 className="text-headline-md text-primary">
          {now ? `${greeting(now.getHours())}, Darshak` : "Hello, Darshak"}
        </h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          {dateLabel || " "}
        </p>
      </section>

      {/* KPI grid */}
      <section className="mb-section-margin grid grid-cols-2 gap-card-gap md:grid-cols-4">
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="flex aspect-[4/3] min-w-0 flex-col justify-between rounded-xl border border-surface-variant/50 bg-surface-container-lowest p-3 shadow-ambient md:aspect-auto md:min-h-[124px] md:p-4"
            >
              <div className="flex items-start gap-2 text-on-surface-variant">
                <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                <span className="text-label-md leading-tight">{kpi.label}</span>
              </div>
              {loading ? (
                <div className="skeleton mt-2 h-9 w-16 rounded-lg" />
              ) : (
                <div className="mt-2 text-display-lg text-primary">
                  {kpi.value}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Desktop: two-pane region. Renewals + Tasks fill the left two columns,
          Birthdays occupies the right column. DOM order is preserved so mobile
          stacks Renewals → Birthdays → Tasks exactly as before. */}
      <div className="md:grid md:grid-cols-3 md:items-start md:gap-6">
      {/* Upcoming Renewals */}
      <section className="mb-section-margin md:col-span-2 md:col-start-1 md:row-start-1 md:mb-0">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-headline-sm text-primary">Upcoming Renewals</h2>
          <Link
            href="/clients"
            className="text-label-md text-surface-tint hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="flex flex-col gap-card-gap md:grid md:grid-cols-2">
          {renewals.map((r) => {
            const urgency = renewalUrgency(r.renewalDays);
            return (
              <Link
                key={`${r.client.id}-${r.product}`}
                href={`/clients/${r.client.id}`}
                className="relative overflow-hidden rounded-xl border border-surface-variant/50 bg-surface-container-lowest p-3 shadow-ambient transition-shadow hover:shadow-lift"
              >
                {r.client.isChampion && (
                  <div className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-lg bg-secondary-container px-2 py-1 text-label-sm font-bold text-on-secondary-container">
                    <Star className="h-3 w-3" fill="currentColor" strokeWidth={0} /> Champion
                  </div>
                )}
                <div className="mt-1 flex items-start gap-3">
                  <Avatar client={r.client} />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div>
                      <h3 className="text-headline-sm text-on-surface">
                        {r.client.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-body-md text-on-surface-variant">
                        <Calendar className="h-4 w-4" /> {r.renewal}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <ProductPill product={r.product} />
                      <span
                        className={`ml-auto rounded-full px-2 py-1 text-label-sm font-bold ${urgencyPill[urgency]}`}
                      >
                        {r.renewalDays} days remaining
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Birthdays This Week */}
      <section className="mb-section-margin md:col-start-3 md:row-span-2 md:row-start-1 md:mb-0">
        <h2 className="mb-3 text-headline-sm text-primary">
          Birthdays This Week
        </h2>
        <div className="no-scrollbar -mx-container-padding flex snap-x snap-mandatory gap-card-gap overflow-x-auto px-container-padding pb-2 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0">
          {birthdays.map((c) => (
            <div
              key={c.id}
              className="flex min-w-[230px] snap-start flex-col justify-between gap-3 rounded-xl border border-surface-variant/50 bg-surface-container-lowest p-3 shadow-ambient md:w-full md:min-w-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-body-md font-bold ${avatarTones[c.avatar]}`}
                >
                  {getInitials(c.name)}
                </div>
                <div className="flex-1">
                  <h3 className="text-body-lg font-bold leading-tight text-on-surface">
                    {c.name}
                  </h3>
                  <p className="flex items-center gap-1 text-body-md text-on-surface-variant">
                    <Cake className="h-3.5 w-3.5" /> {c.birthday}
                  </p>
                </div>
              </div>
              <WhatsAppButton
                phone={c.phone}
                message={`Happy Birthday, ${c.name.split(" ")[0]}! Wishing you a wonderful year ahead from all of us at Agamic Financial Services.`}
                onSent={() => showToast("WhatsApp birthday wish opened")}
                variant="solid"
                label="Send WhatsApp Wish"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Today's Tasks */}
      <section className="mb-4 md:col-span-2 md:col-start-1 md:row-start-2 md:mb-0">
        <h2 className="mb-3 text-headline-sm text-primary">Today&apos;s Tasks</h2>
        <div className="divide-y divide-surface-variant/50 overflow-hidden rounded-xl border border-surface-variant/50 bg-surface-container-lowest shadow-ambient">
          {todaysTasks.map((task) => {
            const done = !!doneTasks[task.id];
            const client = getClient(task.clientId);
            return (
              <label
                key={task.id}
                className="flex cursor-pointer items-start gap-3 p-3 transition-colors hover:bg-surface-container-low"
              >
                <input
                  type="checkbox"
                  checked={done}
                  onChange={() => toggleTask(task.id, task.clientName)}
                  className="mt-0.5 h-5 w-5 rounded border-outline text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <p
                    className={`text-body-lg transition-colors ${
                      done
                        ? "text-on-surface-variant line-through"
                        : "text-on-surface"
                    }`}
                  >
                    {task.note}
                    {client && (
                      <span className="text-on-surface-variant">
                        {" "}
                        · {client.name}
                      </span>
                    )}
                  </p>
                  {!done && (
                    <p
                      className={`mt-1 flex items-center gap-1 text-body-md ${
                        task.dueDate === "today"
                          ? "text-error"
                          : "text-on-surface-variant"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      {task.dueDate === "today" ? "Due today" : "Due tomorrow"}
                    </p>
                  )}
                </div>
                <ChevronRight className="mt-1 h-4 w-4 text-outline" />
              </label>
            );
          })}
        </div>
      </section>
      </div>

      <Fab href="/clients/new" label="Add Client" />
    </div>
  );
}
