"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, History, Phone, Star } from "lucide-react";
import { clients, championStats, getChampions } from "@/lib/mockData";
import type { Product } from "@/lib/types";
import {
  Avatar,
  ChampionBadge,
  Fab,
  MobileTopBar,
  PrimeBadge,
  ProductPill,
} from "@/components/ui";

type Filter = "All" | Product | "Champion" | "Prime";

const FILTERS: Filter[] = [
  "All",
  "LIC",
  "GIC",
  "MF",
  "Forex",
  "Champion",
  "Prime",
];

export default function ClientsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchesQuery = c.name
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchesFilter =
        filter === "All"
          ? true
          : filter === "Champion"
            ? c.isChampion
            : filter === "Prime"
              ? c.isPrime
              : c.products.includes(filter);
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  const champions = getChampions();

  return (
    <div>
      <MobileTopBar />

      <div className="mb-5">
        <h1 className="mb-4 text-display-lg text-on-background">Clients</h1>
        <div className="group relative md:max-w-xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline transition-colors group-focus-within:text-primary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients..."
            className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest pl-12 pr-4 text-body-lg shadow-ambient outline-none transition-all placeholder:text-outline focus:border-2 focus:border-primary"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="no-scrollbar -mx-container-padding mb-5 flex gap-2 overflow-x-auto px-container-padding pb-1">
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex h-8 flex-shrink-0 items-center justify-center gap-1 rounded-full px-4 text-label-md transition-all ${
                active
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-variant text-on-surface-variant hover:bg-surface-dim"
              }`}
            >
              {f === "Champion" && (
                <Star
                  className="h-3.5 w-3.5"
                  fill={active ? "currentColor" : "none"}
                  strokeWidth={active ? 0 : 2}
                />
              )}
              {f}
            </button>
          );
        })}
      </div>

      {/* Champions leaderboard (shown when Champion filter is active) */}
      {filter === "Champion" && (
        <section className="mb-5">
          <div className="mb-3 grid grid-cols-2 gap-card-gap md:max-w-xl">
            <div className="flex flex-col gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3 shadow-ambient">
              <span className="text-label-md text-on-surface-variant">
                Total Referrals (YTD)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-display-lg text-primary">
                  {championStats.totalReferralsYTD}
                </span>
                <span className="rounded bg-primary-fixed px-1.5 py-0.5 text-label-sm text-on-primary-fixed-variant">
                  {championStats.totalReferralsDelta}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3 shadow-ambient">
              <span className="text-label-md text-on-surface-variant">
                New Champions (MoM)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-display-lg text-primary">
                  {championStats.newChampionsMoM}
                </span>
                <span className="rounded bg-primary-fixed px-1.5 py-0.5 text-label-sm text-on-primary-fixed-variant">
                  {championStats.newChampionsDelta}
                </span>
              </div>
            </div>
          </div>

          <h2 className="mb-3 text-headline-sm text-primary">Top Referrers</h2>
          <div className="flex flex-col gap-card-gap md:grid md:grid-cols-2 xl:grid-cols-3">
            {champions.map((c, i) => (
              <Link
                key={c.id}
                href={`/clients/${c.id}`}
                className="flex items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-3 shadow-ambient transition-shadow hover:shadow-lift"
              >
                <span
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-label-md font-bold ${
                    i === 0
                      ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {i + 1}
                </span>
                <Avatar client={c} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-body-lg font-bold text-on-background">
                      {c.name}
                    </h3>
                    <span
                      className={`flex-shrink-0 rounded px-2 py-0.5 text-label-sm font-bold ${
                        i === 0
                          ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                          : "bg-surface-variant text-on-surface-variant"
                      }`}
                    >
                      {i === 0 ? "Gold" : "Silver"} Champion
                    </span>
                  </div>
                  <p className="mt-0.5 text-label-md text-on-surface-variant">
                    {c.referralCount} referrals · {c.city}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Client cards */}
      <div className="flex flex-col gap-card-gap md:grid md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <Link
            key={c.id}
            href={`/clients/${c.id}`}
            className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-3 shadow-ambient transition-shadow hover:shadow-lift active:shadow-lift"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <Avatar client={c} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-headline-sm text-on-surface">
                      {c.name}
                    </h3>
                    {c.isChampion && <ChampionBadge />}
                    {c.isPrime && <PrimeBadge />}
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-body-md text-on-surface-variant">
                    <History className="h-3.5 w-3.5" /> {c.lastContacted}
                  </p>
                </div>
              </div>
              <button
                aria-label={`Call ${c.name}`}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `tel:${c.phone.replace(/\s/g, "")}`;
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-variant/50 text-primary transition-colors hover:bg-secondary-container/50"
              >
                <Phone className="h-5 w-5" fill="currentColor" strokeWidth={0} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {c.products.map((p) => (
                <ProductPill key={p} product={p} />
              ))}
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-8 text-center md:col-span-full">
            <p className="text-body-lg font-semibold text-on-surface">
              No clients found
            </p>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Try a different name or filter.
            </p>
          </div>
        )}
      </div>

      <Fab href="/clients/new" label="Add Client" />
    </div>
  );
}
