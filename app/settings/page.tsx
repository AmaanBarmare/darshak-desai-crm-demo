"use client";

import { useState } from "react";
import {
  MessageCircle,
  Bell,
  Cake,
  Users2,
  Plus,
  LogOut,
  ChevronRight,
  Shield,
} from "lucide-react";
import { MobileTopBar, PageHeading } from "@/components/ui";
import { Switch } from "@/components/Switch";
import { useToast } from "@/components/ToastProvider";

export default function SettingsPage() {
  const { showToast } = useToast();
  const [reminders, setReminders] = useState({
    d60: true,
    d30: true,
    d7: true,
    birthday: true,
  });

  function set(key: keyof typeof reminders, v: boolean) {
    setReminders((prev) => ({ ...prev, [key]: v }));
    showToast(v ? "Reminder enabled" : "Reminder disabled");
  }

  return (
    <div>
      <MobileTopBar />
      <PageHeading title="Settings" />

      {/* Profile */}
      <section className="mb-section-margin rounded-xl bg-surface-container-lowest p-4 shadow-ambient">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary">
            <span className="text-headline-md font-bold">DD</span>
          </div>
          <div>
            <h2 className="text-headline-sm text-on-surface">Darshak Desai</h2>
            <p className="text-body-md text-on-surface-variant">
              Agamic Financial Services
            </p>
            <p className="mt-0.5 text-body-md text-on-surface-variant">
              +91 98765 43210
            </p>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <Group title="Integrations">
        <Row
          icon={MessageCircle}
          title="WhatsApp API"
          subtitle="Messaging & broadcasts"
          trailing={
            <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-label-sm font-bold text-green-800">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              Connected
            </span>
          }
        />
      </Group>

      {/* Automated Reminders */}
      <Group title="Automated Reminders">
        <div className="px-4 pb-1 pt-3">
          <div className="mb-2 flex items-center gap-2 text-on-surface">
            <Bell className="h-4 w-4 text-primary" />
            <span className="text-body-md font-semibold">Policy Renewal</span>
          </div>
        </div>
        <ToggleRow
          label="60 Days Prior"
          checked={reminders.d60}
          onChange={(v) => set("d60", v)}
        />
        <ToggleRow
          label="30 Days Prior"
          checked={reminders.d30}
          onChange={(v) => set("d30", v)}
        />
        <ToggleRow
          label="7 Days Prior"
          checked={reminders.d7}
          onChange={(v) => set("d7", v)}
        />
        <div className="border-t border-surface-variant/60" />
        <ToggleRow
          icon={Cake}
          label="Birthday Greetings"
          checked={reminders.birthday}
          onChange={(v) => set("birthday", v)}
        />
      </Group>

      {/* Team Management */}
      <Group title="Team Management">
        <Row
          icon={Shield}
          title="Darshak Desai"
          subtitle="Admin"
          trailing={
            <span className="rounded-full bg-primary-fixed px-2.5 py-1 text-label-sm font-bold text-on-primary-fixed-variant">
              Admin
            </span>
          }
        />
        <div className="border-t border-surface-variant/60" />
        <Row
          icon={Users2}
          title="Staff Member"
          subtitle="Limited Access"
          trailing={
            <span className="rounded-full bg-surface-variant px-2.5 py-1 text-label-sm font-bold text-on-surface-variant">
              Limited
            </span>
          }
        />
        <div className="border-t border-surface-variant/60" />
        <button
          onClick={() => showToast("Invite link copied")}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-container-low"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-primary">
            <Plus className="h-4 w-4" />
          </span>
          <span className="flex-1 text-body-lg font-semibold text-primary">
            Add User
          </span>
          <ChevronRight className="h-4 w-4 text-outline" />
        </button>
      </Group>

      {/* Logout */}
      <button
        onClick={() => showToast("Logged out (demo)")}
        className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-error/30 bg-error-container/40 py-3.5 text-body-lg font-bold text-error transition-colors hover:bg-error-container active:scale-[0.99]"
      >
        <LogOut className="h-5 w-5" /> Logout
      </button>
      <p className="text-center text-label-sm text-on-surface-variant">
        Darshak Desai CRM · v1.0.0
      </p>
    </div>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-section-margin">
      <h2 className="mb-3 text-label-md uppercase tracking-widest text-primary">
        {title}
      </h2>
      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-ambient">
        {children}
      </div>
    </section>
  );
}

function Row({
  icon: Icon,
  title,
  subtitle,
  trailing,
}: {
  icon: typeof Shield;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body-lg font-semibold text-on-surface">{title}</p>
        {subtitle && (
          <p className="text-body-md text-on-surface-variant">{subtitle}</p>
        )}
      </div>
      {trailing}
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon?: typeof Shield;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {Icon ? (
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
          <Icon className="h-4 w-4" />
        </span>
      ) : (
        <span className="ml-1 w-9" />
      )}
      <span className="flex-1 text-body-lg text-on-surface">{label}</span>
      <Switch checked={checked} onChange={onChange} label={label} />
    </div>
  );
}
