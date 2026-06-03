"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { clients } from "@/lib/mockData";
import { useToast } from "./ToastProvider";

export function AddTaskModal({
  open,
  onClose,
  defaultClientId,
}: {
  open: boolean;
  onClose: () => void;
  defaultClientId?: string;
}) {
  const { showToast } = useToast();
  const [clientId, setClientId] = useState(defaultClientId ?? clients[0].id);
  const [note, setNote] = useState("");
  const [due, setDue] = useState("today");

  function save() {
    if (!note.trim()) {
      showToast("Add a task note first");
      return;
    }
    showToast("Task added");
    setNote("");
    onClose();
  }

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
            className="w-full max-w-[480px] rounded-t-2xl bg-surface-container-lowest p-5 shadow-fab md:rounded-2xl"
            initial={{ y: 40, opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-headline-sm text-primary">Add Task</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-variant/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <Field label="Client">
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-body-lg outline-none focus:border-2 focus:border-primary"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Task Note">
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Call re: policy renewal"
                  className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-body-lg outline-none placeholder:text-outline focus:border-2 focus:border-primary"
                />
              </Field>

              <Field label="Due">
                <select
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                  className="h-12 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-body-lg outline-none focus:border-2 focus:border-primary"
                >
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="in 3 days">In 3 days</option>
                  <option value="next week">Next week</option>
                </select>
              </Field>

              <button
                onClick={save}
                className="mt-1 h-12 w-full rounded-lg bg-primary text-body-lg font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-[0.99]"
              >
                Add Task
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-label-md uppercase tracking-wider text-on-surface-variant">
        {label}
      </span>
      {children}
    </label>
  );
}
