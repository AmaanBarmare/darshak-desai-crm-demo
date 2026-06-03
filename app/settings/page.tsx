"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageCircle,
  Bell,
  Cake,
  Users2,
  Plus,
  LogOut,
  ChevronRight,
  Shield,
  Pencil,
  X,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { MobileTopBar, PageHeading } from "@/components/ui";
import { Switch } from "@/components/Switch";
import { useToast } from "@/components/ToastProvider";

interface TeamUser {
  id: string;
  name: string;
  role: "Admin" | "Limited";
}

export default function SettingsPage() {
  const { showToast } = useToast();
  const [reminders, setReminders] = useState({
    d60: true,
    d30: true,
    d7: true,
    birthday: true,
  });
  const [users, setUsers] = useState<TeamUser[]>([
    { id: "u1", name: "Darshak Desai", role: "Admin" },
    { id: "u2", name: "Staff Member", role: "Limited" },
  ]);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newPhone, setNewPhone] = useState("");

  function set(key: keyof typeof reminders, v: boolean) {
    setReminders((prev) => ({ ...prev, [key]: v }));
    showToast(v ? "Reminder enabled" : "Reminder disabled");
  }

  function removeUser(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setMenuFor(null);
    showToast("Team member removed");
  }

  function addUser() {
    if (!newPhone.trim()) {
      showToast("Enter a phone number");
      return;
    }
    setUsers((prev) => [
      ...prev,
      { id: `u${prev.length + 1}-${newPhone.slice(-4)}`, name: "Invited User", role: "Limited" },
    ]);
    setNewPhone("");
    setAddOpen(false);
    showToast("Invite sent");
  }

  return (
    <div className="md:mx-auto md:max-w-4xl">
      <MobileTopBar />
      <PageHeading title="Settings" />

      {/* Profile */}
      <section className="mb-section-margin rounded-xl bg-surface-container-lowest p-4 shadow-ambient">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
            <span className="text-headline-md font-bold">DD</span>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-headline-sm text-on-surface">Darshak Desai</h2>
            <p className="text-body-md text-on-surface-variant">
              Darshak Desai Financial Services
            </p>
            <p className="mt-0.5 text-body-md text-on-surface-variant">
              +91 98765 43210
            </p>
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5 self-start rounded-lg border border-outline-variant px-3 py-2 text-label-md font-bold text-primary transition-colors hover:bg-surface-variant/50 active:scale-[0.98]"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
        </div>
      </section>

      {/* Section groups tile into two masonry columns on desktop */}
      <div className="md:columns-2 md:gap-6 md:[&>section]:break-inside-avoid">
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
        {users.map((u, i) => (
          <div key={u.id}>
            {i > 0 && <div className="border-t border-surface-variant/60" />}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-surface-container text-primary">
                {u.role === "Admin" ? (
                  <Shield className="h-4 w-4" />
                ) : (
                  <Users2 className="h-4 w-4" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-body-lg font-semibold text-on-surface">
                  {u.name}
                </p>
                <p className="text-body-md text-on-surface-variant">
                  {u.role === "Admin" ? "Admin" : "Limited Access"}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-label-sm font-bold ${
                  u.role === "Admin"
                    ? "bg-primary-fixed text-on-primary-fixed-variant"
                    : "bg-surface-variant text-on-surface-variant"
                }`}
              >
                {u.role}
              </span>
              <div className="relative">
                <button
                  aria-label={`Options for ${u.name}`}
                  onClick={() => setMenuFor(menuFor === u.id ? null : u.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant/60"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                {menuFor === u.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setMenuFor(null)}
                    />
                    <div className="absolute right-0 top-9 z-20 w-36 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest py-1 shadow-lift">
                      <button
                        onClick={() => {
                          setMenuFor(null);
                          showToast("Edit user (demo)");
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-body-md text-on-surface hover:bg-surface-container-low"
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={() => removeUser(u.id)}
                        disabled={u.role === "Admin"}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-body-md text-error hover:bg-error-container/40 disabled:opacity-40"
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="border-t border-surface-variant/60" />
        <button
          onClick={() => setAddOpen(true)}
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
      </div>

      {/* Footer: version + logout */}
      <div className="mt-section-margin flex flex-col-reverse items-center gap-4 border-t border-outline-variant/40 pt-5 md:flex-row md:justify-between">
        <p className="text-label-sm text-on-surface-variant">
          Darshak Desai CRM · v1.0.0
        </p>
        <button
          onClick={() => showToast("Logged out (demo)")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-error/40 px-5 py-2.5 text-body-md font-bold text-error transition-colors hover:bg-error-container/60 active:scale-[0.98] md:w-auto"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <SettingsModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Team Member"
      >
        <p className="mb-4 text-body-md text-on-surface-variant">
          Invite a colleague by phone number. They&apos;ll get limited access
          until you promote them.
        </p>
        <label className="mb-1.5 block text-label-md uppercase tracking-wider text-on-surface-variant">
          Phone Number
        </label>
        <input
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          inputMode="tel"
          placeholder="+91 98765 43210"
          className="mb-4 h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-body-lg outline-none focus:border-2 focus:border-primary"
        />
        <button
          onClick={addUser}
          className="h-12 w-full rounded-lg bg-primary text-body-lg font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-[0.99]"
        >
          Send Invite
        </button>
      </SettingsModal>

      <SettingsModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Profile"
      >
        <div className="flex flex-col gap-3">
          <ProfileField label="Full Name" defaultValue="Darshak Desai" />
          <ProfileField label="Firm" defaultValue="Darshak Desai Financial Services" />
          <ProfileField label="Phone" defaultValue="+91 98765 43210" />
        </div>
        <button
          onClick={() => {
            setEditOpen(false);
            showToast("Profile updated");
          }}
          className="mt-4 h-12 w-full rounded-lg bg-primary text-body-lg font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-[0.99]"
        >
          Save Changes
        </button>
      </SettingsModal>
    </div>
  );
}

function SettingsModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 md:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-[440px] rounded-t-2xl bg-surface-container-lowest p-5 shadow-fab md:rounded-2xl"
            initial={{ y: 40, opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-headline-sm text-primary">{title}</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-variant/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProfileField({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-label-md uppercase tracking-wider text-on-surface-variant">
        {label}
      </span>
      <input
        defaultValue={defaultValue}
        className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-body-lg outline-none focus:border-2 focus:border-primary"
      />
    </label>
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
