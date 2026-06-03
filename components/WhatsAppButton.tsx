"use client";

import { MessageCircle } from "lucide-react";

/** Opens a wa.me deep link in a new tab with an optional prefilled message. */
export function WhatsAppButton({
  phone,
  message,
  onSent,
  label = "WhatsApp",
  variant = "solid",
}: {
  phone: string;
  message?: string;
  onSent?: () => void;
  label?: string;
  variant?: "solid" | "ghost";
}) {
  function open() {
    const digits = phone.replace(/[^0-9]/g, "");
    const url =
      `https://wa.me/${digits}` +
      (message ? `?text=${encodeURIComponent(message)}` : "");
    window.open(url, "_blank", "noopener,noreferrer");
    onSent?.();
  }

  if (variant === "ghost") {
    return (
      <button
        onClick={open}
        className="flex flex-col items-center gap-2 active:scale-95"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-ambient transition-transform">
          <MessageCircle className="h-5 w-5" fill="currentColor" strokeWidth={0} />
        </span>
        <span className="text-label-sm text-on-surface-variant">{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={open}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-md font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-[0.98]"
    >
      <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
      {label}
    </button>
  );
}
