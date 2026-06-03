"use client";

import { useState } from "react";
import { ChevronDown, Send, Users, CheckCircle2 } from "lucide-react";
import { broadcastAudiences, broadcasts as seed } from "@/lib/mockData";
import type { Broadcast } from "@/lib/types";
import { MobileTopBar, PageHeading } from "@/components/ui";
import { useToast } from "@/components/ToastProvider";

export default function BroadcastsPage() {
  const { showToast } = useToast();
  const [audience, setAudience] = useState(broadcastAudiences[0].key);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Broadcast[]>(seed);

  const selected =
    broadcastAudiences.find((a) => a.key === audience) ?? broadcastAudiences[0];

  function send() {
    if (!message.trim()) {
      showToast("Write a message first");
      return;
    }
    const entry: Broadcast = {
      id: String(Date.now()),
      message: message.trim(),
      recipients: selected.count,
      date: "Just now",
      status: "SENT",
    };
    setHistory((prev) => [entry, ...prev]);
    setMessage("");
    showToast(`Broadcast sent to ${selected.count.toLocaleString("en-IN")} clients`);
  }

  return (
    <div>
      <MobileTopBar />
      <PageHeading
        title="Broadcasts"
        subtitle="Send updates to your client base"
      />

      <div className="mb-section-margin rounded-xl bg-surface-container-lowest p-4 shadow-ambient">
        {/* Audience */}
        <label className="mb-1.5 block text-label-md uppercase tracking-wider text-on-surface-variant">
          Send To
        </label>
        <div className="relative mb-4">
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="h-12 w-full appearance-none rounded-lg border border-outline-variant bg-surface-container-lowest px-3 pr-10 text-body-lg outline-none transition-all focus:border-2 focus:border-primary"
          >
            {broadcastAudiences.map((a) => (
              <option key={a.key} value={a.key}>
                {a.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" />
        </div>

        {/* Recipient count preview */}
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-secondary-container/40 px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary">
            <Users className="h-4 w-4" />
          </span>
          <div>
            <p className="text-display-lg leading-none text-primary">
              {selected.count.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-label-md text-on-surface-variant">
              recipients in “{selected.label}”
            </p>
          </div>
        </div>

        {/* Message */}
        <label className="mb-1.5 block text-label-md uppercase tracking-wider text-on-surface-variant">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Type your broadcast message here..."
          className="mb-1 w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest p-3 text-body-lg outline-none transition-all placeholder:text-outline focus:border-2 focus:border-primary"
        />
        <p className="mb-4 text-right text-label-sm text-on-surface-variant">
          {message.length} characters
        </p>

        <button
          onClick={send}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-body-lg font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-[0.99]"
        >
          <Send className="h-5 w-5" /> Send Broadcast
        </button>
      </div>

      {/* Recent broadcasts */}
      <section>
        <h2 className="mb-3 text-headline-sm text-primary">Recent Broadcasts</h2>
        <div className="flex flex-col gap-card-gap">
          {history.map((b) => (
            <div
              key={b.id}
              className="rounded-xl bg-surface-container-lowest p-4 shadow-ambient"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-label-md text-on-surface-variant">
                  <Users className="h-3.5 w-3.5" />
                  {b.recipients.toLocaleString("en-IN")} · {b.date}
                </span>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-label-sm font-bold ${
                    b.status === "DELIVERED"
                      ? "bg-green-100 text-green-800"
                      : "bg-secondary-container text-on-secondary-container"
                  }`}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  {b.status}
                </span>
              </div>
              <p className="text-body-md text-on-surface">{b.message}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
