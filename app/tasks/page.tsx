"use client";

import { useState } from "react";
import Link from "next/link";
import { tasks as seed } from "@/lib/mockData";
import type { Task } from "@/lib/types";
import { Fab, MobileTopBar, PageHeading } from "@/components/ui";
import { AddTaskModal } from "@/components/AddTaskModal";
import { useToast } from "@/components/ToastProvider";

type Tab = "Today" | "This Week" | "All";
const TABS: Tab[] = ["Today", "This Week", "All"];

const THIS_WEEK: Task["dueDate"][] = [
  "today",
  "tomorrow",
  "in 3 days",
  "in 5 days",
];

const dueLabel: Record<Task["dueDate"], string> = {
  today: "Due Today",
  tomorrow: "Tomorrow",
  "in 3 days": "In 3 days",
  "in 5 days": "In 5 days",
  "next week": "Next week",
};

function duePill(due: Task["dueDate"]): string {
  if (due === "today") return "bg-error-container text-on-error-container";
  if (due === "tomorrow") return "bg-amber-100 text-amber-800";
  return "bg-surface-variant text-on-surface-variant";
}

export default function TasksPage() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>("Today");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);

  const visible = seed.filter((t) => {
    if (tab === "All") return true;
    if (tab === "Today") return t.dueDate === "today";
    return THIS_WEEK.includes(t.dueDate);
  });

  function toggle(t: Task) {
    setDone((prev) => {
      const next = { ...prev, [t.id]: !prev[t.id] };
      if (next[t.id]) showToast("Task marked as done");
      return next;
    });
  }

  return (
    <div>
      <MobileTopBar />
      <PageHeading title="Tasks" subtitle="Manage your client follow-ups" />

      {/* Tabs */}
      <div className="mb-5 flex gap-2">
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`h-9 rounded-full px-4 text-label-md transition-all ${
                active
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-variant text-on-surface-variant hover:bg-surface-dim"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-card-gap">
        {visible.map((t) => {
          const isDone = !!done[t.id];
          return (
            <div
              key={t.id}
              className="flex items-start gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-ambient"
            >
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => toggle(t)}
                aria-label={`Mark ${t.note} done`}
                className="mt-0.5 h-5 w-5 flex-shrink-0 rounded border-outline text-primary focus:ring-primary"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/clients/${t.clientId}`}
                    className={`text-body-lg font-bold ${
                      isDone
                        ? "text-on-surface-variant line-through"
                        : "text-on-surface hover:text-primary"
                    }`}
                  >
                    {t.clientName}
                  </Link>
                  {!isDone && (
                    <span
                      className={`flex-shrink-0 rounded-full px-2.5 py-1 text-label-sm font-bold ${duePill(t.dueDate)}`}
                    >
                      {dueLabel[t.dueDate]}
                    </span>
                  )}
                </div>
                <p
                  className={`mt-0.5 text-body-md ${
                    isDone
                      ? "text-on-surface-variant line-through"
                      : "text-on-surface-variant"
                  }`}
                >
                  {t.note}
                </p>
              </div>
            </div>
          );
        })}

        {visible.length === 0 && (
          <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-8 text-center">
            <p className="text-body-lg font-semibold text-on-surface">
              No tasks here
            </p>
            <p className="mt-1 text-body-md text-on-surface-variant">
              You&apos;re all caught up for this view.
            </p>
          </div>
        )}
      </div>

      <Fab onClick={() => setModalOpen(true)} label="Add Task" />
      <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
