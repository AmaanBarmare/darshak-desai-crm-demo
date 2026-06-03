"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Shield,
  TrendingUp,
  ShieldPlus,
  RefreshCw,
  LineChart,
  Search,
  Check,
} from "lucide-react";
import { clients, productMeta } from "@/lib/mockData";
import type { Client, Product } from "@/lib/types";
import { Switch } from "./Switch";
import { useToast } from "./ToastProvider";

const PORTFOLIO: { product: Product; icon: typeof Shield }[] = [
  { product: "LIC", icon: Shield },
  { product: "MF", icon: TrendingUp },
  { product: "GIC", icon: ShieldPlus },
  { product: "Forex", icon: RefreshCw },
  { product: "Stock Broking", icon: LineChart },
];

interface ProductState {
  enabled: boolean;
  renewal: string;
  ref: string;
}

export function ClientForm({ existing }: { existing?: Client }) {
  const router = useRouter();
  const { showToast } = useToast();
  const isEdit = !!existing;

  const [name, setName] = useState(existing?.name ?? "");
  const [phone, setPhone] = useState(existing?.phone ?? "");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<string>(existing?.gender ?? "");
  const [city, setCity] = useState(existing?.city ?? "");
  const [notes, setNotes] = useState("");

  const [referredBy, setReferredBy] = useState(existing?.referredBy ?? "");
  const [referOpen, setReferOpen] = useState(false);

  const [portfolio, setPortfolio] = useState<Record<Product, ProductState>>(
    () => {
      const base = {} as Record<Product, ProductState>;
      for (const { product } of PORTFOLIO) {
        const policy = existing?.policies[product];
        base[product] = {
          enabled: existing?.products.includes(product) ?? false,
          renewal: "",
          ref: policy?.ref ?? "",
        };
      }
      return base;
    },
  );

  const referMatches = useMemo(
    () =>
      clients.filter(
        (c) =>
          c.id !== existing?.id &&
          c.name.toLowerCase().includes(referredBy.trim().toLowerCase()),
      ),
    [referredBy, existing?.id],
  );

  function setProduct(product: Product, patch: Partial<ProductState>) {
    setPortfolio((prev) => ({
      ...prev,
      [product]: { ...prev[product], ...patch },
    }));
  }

  function save() {
    if (!name.trim()) {
      showToast("Full name is required");
      return;
    }
    if (!phone.trim()) {
      showToast("Phone number is required");
      return;
    }
    showToast(isEdit ? "Client profile updated" : "Client profile saved");
    setTimeout(() => {
      router.push(existing ? `/clients/${existing.id}` : "/clients");
    }, 600);
  }

  return (
    <div className="-mt-4 pb-28 md:mx-auto md:max-w-3xl">
      {/* Header */}
      <header className="sticky top-0 z-30 -mx-container-padding mb-4 flex h-touch-target items-center gap-3 border-b border-outline-variant/40 bg-background/90 px-container-padding backdrop-blur-md">
        <button
          onClick={() => router.back()}
          aria-label="Close"
          className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface hover:bg-surface-variant/50 active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>
        <h1 className="text-headline-sm font-bold text-primary">
          {isEdit ? "Edit Client" : "Add New Client"}
        </h1>
      </header>

      {/* Basic Information */}
      <Section title="Basic Information">
        <div className="rounded-xl bg-surface-container-lowest p-4 shadow-ambient">
          <div className="flex flex-col gap-4">
            <Field label="Full Name" required>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className={inputClass}
              />
            </Field>
            <Field label="Phone Number" required>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                inputMode="tel"
                className={inputClass}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date of Birth">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Gender">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
            </div>
            <Field label="City">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai"
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* Product Portfolio */}
      <Section title="Product Portfolio" hint="Toggle active holdings">
        <div className="flex flex-col gap-card-gap md:grid md:grid-cols-2 md:items-start">
          {PORTFOLIO.map(({ product, icon: Icon }) => {
            const state = portfolio[product];
            return (
              <div
                key={product}
                className="rounded-xl bg-surface-container-lowest p-3 shadow-ambient"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1 text-body-lg font-medium text-on-surface">
                    {productMeta[product].label}
                  </span>
                  <Switch
                    checked={state.enabled}
                    onChange={(v) => setProduct(product, { enabled: v })}
                    label={`Toggle ${product}`}
                  />
                </div>
                {state.enabled &&
                  (() => {
                    // Forex and Stock Broking have no fixed renewal date.
                    const hasRenewal =
                      product !== "Forex" && product !== "Stock Broking";
                    return (
                      <div
                        className={`mt-3 grid gap-3 border-t border-surface-variant pt-3 ${
                          hasRenewal ? "grid-cols-2" : "grid-cols-1"
                        }`}
                      >
                        {hasRenewal && (
                          <Field label="Renewal Date">
                            <input
                              type="date"
                              value={state.renewal}
                              onChange={(e) =>
                                setProduct(product, { renewal: e.target.value })
                              }
                              className={inputClass}
                            />
                          </Field>
                        )}
                        <Field label={`${productMeta[product].refLabel} Ref`}>
                          <input
                            value={state.ref}
                            onChange={(e) =>
                              setProduct(product, { ref: e.target.value })
                            }
                            placeholder="e.g. LIC12345"
                            className={inputClass}
                          />
                        </Field>
                      </div>
                    );
                  })()}
              </div>
            );
          })}
        </div>
      </Section>

      {/* Additional Details */}
      <Section title="Additional Details">
        <div className="rounded-xl bg-surface-container-lowest p-4 shadow-ambient">
          <div className="flex flex-col gap-4">
            <Field label="Referred By">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
                <input
                  value={referredBy}
                  onChange={(e) => {
                    setReferredBy(e.target.value);
                    setReferOpen(true);
                  }}
                  onFocus={() => setReferOpen(true)}
                  placeholder="Search existing clients..."
                  className={`${inputClass} pl-9`}
                />
                {referOpen && referredBy && referMatches.length > 0 && (
                  <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-outline-variant bg-surface-container-lowest shadow-lift">
                    {referMatches.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setReferredBy(c.name);
                          setReferOpen(false);
                        }}
                        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-body-md text-on-surface hover:bg-surface-container-low"
                      >
                        {c.name}
                        {referredBy === c.name && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Field>
            <Field label="Client Notes">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add specific client notes, preferences, or requirements here..."
                className={`${inputClass} h-auto resize-none py-3`}
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* Save bar */}
      <div className="pb-safe fixed bottom-0 left-0 z-40 w-full border-t border-outline-variant/40 bg-surface/95 px-container-padding py-3 backdrop-blur-md md:pl-64">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={save}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-body-lg font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-[0.99]"
          >
            Save Client Profile
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-body-lg outline-none transition-all placeholder:text-outline focus:border-2 focus:border-primary";

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-section-margin">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-label-md uppercase tracking-widest text-primary">
          {title}
        </h2>
        {hint && (
          <span className="text-label-sm text-on-surface-variant">{hint}</span>
        )}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-label-md uppercase tracking-wider text-on-surface-variant">
        {label}
        {required && <span className="text-error"> *</span>}
      </span>
      {children}
    </label>
  );
}
