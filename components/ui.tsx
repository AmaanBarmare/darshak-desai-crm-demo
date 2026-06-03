"use client";

import Link from "next/link";
import { Bell, Plus, Star, BadgeCheck } from "lucide-react";
import { avatarTones, getInitials, productMeta } from "@/lib/mockData";
import type { Client, Product } from "@/lib/types";

/** Mobile-only sticky top app bar with brand + notifications (hidden on desktop). */
export function MobileTopBar() {
  return (
    <header className="sticky top-0 z-30 -mx-container-padding mb-2 flex h-touch-target items-center justify-between bg-background/90 px-container-padding backdrop-blur-md md:hidden">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary">
          <span className="text-label-md font-bold">DD</span>
        </div>
        <span className="text-headline-sm font-bold text-primary">
          Darshak Desai CRM
        </span>
      </div>
      <button
        aria-label="Notifications"
        className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant/50 active:scale-95"
      >
        <Bell className="h-5 w-5" />
      </button>
    </header>
  );
}

export function Avatar({
  client,
  size = "md",
}: {
  client: Client;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "lg"
      ? "h-24 w-24 text-display-lg"
      : size === "sm"
        ? "h-10 w-10 text-body-md"
        : "h-12 w-12 text-headline-sm";
  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-full font-bold ${avatarTones[client.avatar]} ${dim}`}
    >
      {getInitials(client.name)}
    </div>
  );
}

export function ProductPill({ product }: { product: Product }) {
  return (
    <span
      className={`rounded px-2 py-1 text-label-sm font-bold ${productMeta[product].pill}`}
    >
      {product}
    </span>
  );
}

export function ChampionBadge() {
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded bg-tertiary-fixed px-1.5 py-0.5 text-label-sm font-bold text-on-tertiary-fixed-variant"
      title="Champion"
    >
      <Star className="h-3 w-3" fill="currentColor" strokeWidth={0} />
    </span>
  );
}

export function PrimeBadge() {
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded bg-secondary-container px-1.5 py-0.5 text-label-sm font-bold text-on-secondary-container"
      title="Prime"
    >
      <BadgeCheck className="h-3 w-3" />
    </span>
  );
}

/** Floating action button, fixed bottom-right above the mobile nav. */
export function Fab({
  href,
  onClick,
  label,
}: {
  href?: string;
  onClick?: () => void;
  label: string;
}) {
  const className =
    "fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-fab transition-transform hover:scale-105 active:scale-95 md:bottom-10 md:right-10";
  if (href) {
    return (
      <Link href={href} aria-label={label} className={className}>
        <Plus className="h-6 w-6" />
      </Link>
    );
  }
  return (
    <button aria-label={label} onClick={onClick} className={className}>
      <Plus className="h-6 w-6" />
    </button>
  );
}

/** Large in-content page title with optional subtitle. */
export function PageHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5">
      <h1 className="text-display-lg text-on-background">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-body-md text-on-surface-variant">{subtitle}</p>
      )}
    </div>
  );
}
