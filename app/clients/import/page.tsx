"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  UploadCloud,
  Download,
  FileSpreadsheet,
  Check,
  AlertTriangle,
  UserPlus,
  RefreshCw,
  GitMerge,
  ArrowRight,
  PartyPopper,
} from "lucide-react";
import {
  classifyRows,
  crmFieldLabels,
  parseCsv,
  sampleCsvText,
  sourceFormats,
  type ClassifiedRow,
  type CrmField,
  type ParsedCsv,
} from "@/lib/importData";
import { clients } from "@/lib/mockData";
import type { Client } from "@/lib/types";
import { useToast } from "@/components/ToastProvider";

const STEPS = ["Upload", "Map Columns", "Review", "Confirm"];
const FIELD_OPTIONS: CrmField[] = [
  "name",
  "phone",
  "dob",
  "reference",
  "renewal",
  "ignore",
];

export default function ImportPage() {
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [sourceKey, setSourceKey] = useState(sourceFormats[0].key);
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState<ParsedCsv | null>(null);
  const [mapping, setMapping] = useState<Record<string, CrmField>>({});
  const [resolutions, setResolutions] = useState<Record<number, "merge" | "skip">>(
    {},
  );
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const source = sourceFormats.find((s) => s.key === sourceKey)!;

  function ingest(text: string, name: string) {
    const p = parseCsv(text);
    const map: Record<string, CrmField> = {};
    for (const h of p.headers) map[h] = source.autoMap[h] ?? "ignore";
    setParsed(p);
    setMapping(map);
    setFileName(name);
    setStep(1);
  }

  function onFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => ingest(String(reader.result), file.name);
    reader.readAsText(file);
  }

  const classified = useMemo<ClassifiedRow[]>(
    () => (parsed ? classifyRows(parsed, mapping) : []),
    [parsed, mapping],
  );

  const counts = useMemo(() => {
    const c = { new: 0, existing: 0, conflict: 0, error: 0 };
    for (const r of classified) c[r.category]++;
    return c;
  }, [classified]);

  const conflicts = classified.filter((r) => r.category === "conflict");

  // Final tallies for the confirm screen, honouring conflict resolutions.
  const summary = useMemo(() => {
    let add = counts.new;
    let update = counts.existing;
    let skip = counts.error;
    for (const r of conflicts) {
      if ((resolutions[r.index] ?? "skip") === "merge") update++;
      else skip++;
    }
    return { add, update, skip };
  }, [counts, conflicts, resolutions]);

  function runImport() {
    setProgress(0);
    const total = summary.add + summary.update;
    let written = 0;
    const tick = setInterval(() => {
      written++;
      setProgress(Math.min(100, Math.round((written / Math.max(total, 1)) * 100)));
      if (written >= total) {
        clearInterval(tick);
        // Append the genuinely-new rows to the in-memory client list.
        const newcomers = classified.filter((r) => r.category === "new");
        const tones: Client["avatar"][] = ["navy", "blue", "brown", "gray"];
        newcomers.forEach((r, i) => {
          clients.push({
            id: `imp-${r.index}-${written}`,
            name: r.name,
            phone: `+91 ${r.phone.slice(0, 5)} ${r.phone.slice(5)}`,
            dob: r.dob || "—",
            age: 0,
            gender: "Male",
            city: "Imported",
            products: [source.product as Client["products"][number]],
            isChampion: false,
            isPrime: false,
            referralCount: 0,
            referredBy: null,
            lastContacted: "Just imported",
            avatar: tones[i % tones.length],
            policies: {
              [source.product]: {
                ref: r.reference || "—",
                renewal: r.renewal || null,
                renewalDays: r.renewal ? 45 : null,
              },
            } as Client["policies"],
            activity: [{ text: `Imported from ${source.label}`, time: "Just now" }],
          });
        });
        setImportedCount(summary.add + summary.update);
        setDone(true);
      }
    }, 320);
  }

  return (
    <div className="md:mx-auto md:max-w-4xl">
      {/* Header */}
      <header className="-mx-container-padding mb-5 flex items-center gap-3 border-b border-outline-variant/40 px-container-padding pb-4">
        <Link
          href="/clients"
          aria-label="Back to clients"
          className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-variant/60 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-headline-md text-primary">Import Clients</h1>
          <p className="text-body-md text-on-surface-variant">
            Bring data in from WealthMagic, i-Magic and eSoft GIC
          </p>
        </div>
      </header>

      {!done && <Stepper step={step} />}

      <AnimatePresence mode="wait">
        <motion.div
          key={done ? "done" : step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {done ? (
            <SuccessScreen total={importedCount} summary={summary} />
          ) : step === 0 ? (
            <UploadStep
              sourceKey={sourceKey}
              setSourceKey={setSourceKey}
              dragging={dragging}
              setDragging={setDragging}
              inputRef={inputRef}
              onFile={onFile}
              loadSample={() => {
                setSourceKey("wealthmagic");
                // ingest reads `source` from current render; set then ingest next tick
                const p = parseCsv(sampleCsvText);
                const wm = sourceFormats[0];
                const map: Record<string, CrmField> = {};
                for (const h of p.headers) map[h] = wm.autoMap[h] ?? "ignore";
                setParsed(p);
                setMapping(map);
                setFileName("sample-import.csv");
                setStep(1);
              }}
            />
          ) : step === 1 ? (
            <MapStep
              parsed={parsed!}
              mapping={mapping}
              setMapping={setMapping}
              fileName={fileName}
              counts={counts}
              onBack={() => setStep(0)}
              onNext={() => setStep(2)}
            />
          ) : step === 2 ? (
            <DedupStep
              counts={counts}
              conflicts={conflicts}
              resolutions={resolutions}
              setResolutions={setResolutions}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          ) : (
            <ConfirmStep
              summary={summary}
              source={source.label}
              progress={progress}
              onBack={() => setStep(2)}
              onConfirm={() => {
                runImport();
                showToast("Importing records…");
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="mb-6 flex items-center gap-2">
      {STEPS.map((label, i) => {
        const state = i < step ? "done" : i === step ? "current" : "todo";
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-label-md font-bold transition-colors ${
                state === "done"
                  ? "bg-primary text-on-primary"
                  : state === "current"
                    ? "bg-secondary-container text-primary ring-2 ring-primary"
                    : "bg-surface-variant text-on-surface-variant"
              }`}
            >
              {state === "done" ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
            </span>
            <span
              className={`hidden text-label-md sm:block ${
                state === "todo" ? "text-on-surface-variant" : "text-on-surface"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span
                className={`h-0.5 flex-1 rounded-full ${
                  i < step ? "bg-primary" : "bg-surface-variant"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function UploadStep({
  sourceKey,
  setSourceKey,
  dragging,
  setDragging,
  inputRef,
  onFile,
  loadSample,
}: {
  sourceKey: string;
  setSourceKey: (k: string) => void;
  dragging: boolean;
  setDragging: (b: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFile: (f: File) => void;
  loadSample: () => void;
}) {
  return (
    <div className="flex flex-col gap-section-margin">
      <div>
        <h2 className="mb-1 text-label-md uppercase tracking-widest text-primary">
          Source software
        </h2>
        <p className="mb-3 text-body-md text-on-surface-variant">
          Each system exports its own format. We normalise all three.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {sourceFormats.map((s) => {
            const active = s.key === sourceKey;
            return (
              <button
                key={s.key}
                onClick={() => setSourceKey(s.key)}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                  active
                    ? "border-primary bg-secondary-container/40 ring-1 ring-primary"
                    : "border-outline-variant bg-surface-container-lowest hover:border-outline"
                }`}
              >
                <span
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                    active ? "bg-primary text-on-primary" : "bg-surface-container text-primary"
                  }`}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                </span>
                <span className="text-body-md font-semibold text-on-surface">
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        }}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
          dragging
            ? "border-primary bg-secondary-container/30"
            : "border-outline-variant bg-surface-container-low"
        }`}
      >
        <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container text-primary">
          <UploadCloud className="h-7 w-7" />
        </span>
        <p className="text-body-lg font-semibold text-on-surface">
          Drag &amp; drop your CSV here
        </p>
        <p className="mt-1 text-body-md text-on-surface-variant">
          or choose a file from your computer
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="mt-4 rounded-lg bg-primary px-5 py-2.5 text-label-md font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-[0.98]"
        >
          Choose File
        </button>
      </div>

      <div className="flex flex-col items-center gap-2 rounded-xl bg-surface-container px-4 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-body-md font-semibold text-on-surface">
            No file handy? Try the sample.
          </p>
          <p className="text-body-md text-on-surface-variant">
            Download it, or load it straight into the flow.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/sample-import.csv"
            download
            className="flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-label-md font-bold text-primary transition-colors hover:bg-surface-variant/50"
          >
            <Download className="h-4 w-4" /> Download
          </a>
          <button
            onClick={loadSample}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-label-md font-bold text-on-primary transition-colors hover:bg-primary-container"
          >
            Load Sample <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MapStep({
  parsed,
  mapping,
  setMapping,
  fileName,
  counts,
  onBack,
  onNext,
}: {
  parsed: ParsedCsv;
  mapping: Record<string, CrmField>;
  setMapping: (m: Record<string, CrmField>) => void;
  fileName: string;
  counts: { new: number; existing: number; conflict: number; error: number };
  onBack: () => void;
  onNext: () => void;
}) {
  const total = parsed.rows.length;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 text-body-md">
        <span className="flex items-center gap-1.5 rounded-lg bg-surface-container px-3 py-1.5 font-semibold text-on-surface">
          <FileSpreadsheet className="h-4 w-4 text-primary" /> {fileName}
        </span>
        <span className="text-on-surface-variant">
          {total} rows detected
        </span>
        {counts.error > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-error-container px-2.5 py-1 text-label-sm font-bold text-on-error-container">
            <AlertTriangle className="h-3 w-3" /> {counts.error} with errors
          </span>
        )}
      </div>

      <p className="text-body-md text-on-surface-variant">
        We auto-matched known columns. Adjust any mapping below; columns set to
        “Don&apos;t import” are skipped.
      </p>

      <div className="overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-lowest">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant">
              {parsed.headers.map((h) => {
                const unmapped = mapping[h] === "ignore";
                return (
                  <th key={h} className="min-w-[150px] p-3 align-top">
                    <p className="mb-1.5 truncate text-label-md uppercase tracking-wider text-on-surface-variant">
                      {h}
                    </p>
                    <select
                      value={mapping[h]}
                      onChange={(e) =>
                        setMapping({ ...mapping, [h]: e.target.value as CrmField })
                      }
                      className={`w-full rounded-lg border px-2 py-1.5 text-body-md font-semibold outline-none transition-colors focus:border-primary ${
                        unmapped
                          ? "border-amber-300 bg-amber-50 text-amber-800"
                          : "border-outline-variant bg-surface-container-low text-primary"
                      }`}
                    >
                      {FIELD_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {crmFieldLabels[f]}
                        </option>
                      ))}
                    </select>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {parsed.rows.slice(0, 5).map((row, i) => (
              <tr
                key={i}
                className="border-b border-surface-variant/60 last:border-0"
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="p-3 text-body-md text-on-surface"
                  >
                    {cell || (
                      <span className="text-outline">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {total > 5 && (
        <p className="text-label-md text-on-surface-variant">
          Showing 5 of {total} rows
        </p>
      )}

      <StepFooter onBack={onBack} onNext={onNext} nextLabel="Check for Duplicates" />
    </div>
  );
}

function DedupStep({
  counts,
  conflicts,
  resolutions,
  setResolutions,
  onBack,
  onNext,
}: {
  counts: { new: number; existing: number; conflict: number; error: number };
  conflicts: ClassifiedRow[];
  resolutions: Record<number, "merge" | "skip">;
  setResolutions: (r: Record<number, "merge" | "skip">) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col gap-section-margin">
      <div className="grid grid-cols-1 gap-card-gap sm:grid-cols-3">
        <DedupStat
          icon={UserPlus}
          tone="green"
          count={counts.new}
          label="New clients"
          hint="Added fresh"
        />
        <DedupStat
          icon={RefreshCw}
          tone="blue"
          count={counts.existing + conflicts.filter((c) => resolutions[c.index] === "merge").length}
          label="Existing"
          hint="Records merged"
        />
        <DedupStat
          icon={AlertTriangle}
          tone="amber"
          count={conflicts.length}
          label="Conflicts"
          hint="Need review"
        />
      </div>

      {conflicts.length > 0 ? (
        <div>
          <h2 className="mb-1 text-headline-sm text-on-surface">
            Review conflicts
          </h2>
          <p className="mb-3 text-body-md text-on-surface-variant">
            Same phone number, different name. Merge into the existing client or
            skip the row.
          </p>
          <div className="flex flex-col gap-card-gap">
            {conflicts.map((r) => {
              const choice = resolutions[r.index] ?? "skip";
              return (
                <div
                  key={r.index}
                  className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-body-md">
                    <span className="font-bold text-on-surface">{r.name}</span>
                    <span className="text-on-surface-variant">
                      ({r.phone}) matches existing
                    </span>
                    <span className="font-bold text-primary">{r.matchName}</span>
                  </div>
                  <div className="flex gap-2">
                    <ChoiceButton
                      active={choice === "merge"}
                      onClick={() =>
                        setResolutions({ ...resolutions, [r.index]: "merge" })
                      }
                      icon={GitMerge}
                      label="Merge"
                    />
                    <ChoiceButton
                      active={choice === "skip"}
                      onClick={() =>
                        setResolutions({ ...resolutions, [r.index]: "skip" })
                      }
                      label="Skip"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="rounded-xl bg-surface-container px-4 py-3 text-body-md text-on-surface-variant">
          No conflicts found. Everything is ready to import.
        </p>
      )}

      <StepFooter onBack={onBack} onNext={onNext} nextLabel="Review Summary" />
    </div>
  );
}

function ConfirmStep({
  summary,
  source,
  progress,
  onBack,
  onConfirm,
}: {
  summary: { add: number; update: number; skip: number };
  source: string;
  progress: number;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const running = progress > 0 && progress < 100;
  return (
    <div className="flex flex-col gap-section-margin">
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
        <p className="mb-4 text-label-md uppercase tracking-widest text-on-surface-variant">
          Import summary · {source}
        </p>
        <div className="flex flex-col divide-y divide-surface-variant/60">
          <SummaryRow label="New clients to add" value={summary.add} tone="text-green-700" />
          <SummaryRow label="Existing clients to update" value={summary.update} tone="text-blue-700" />
          <SummaryRow label="Rows skipped" value={summary.skip} tone="text-on-surface-variant" />
        </div>
      </div>

      {progress > 0 && (
        <div>
          <div className="mb-1.5 flex justify-between text-label-md text-on-surface-variant">
            <span>{running ? "Writing records…" : "Complete"}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-variant">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {progress === 0 && (
          <button
            onClick={onBack}
            className="rounded-lg border border-outline-variant px-5 py-3 text-body-lg font-semibold text-on-surface transition-colors hover:bg-surface-variant/50"
          >
            Back
          </button>
        )}
        <button
          onClick={onConfirm}
          disabled={progress > 0}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-body-lg font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-[0.99] disabled:opacity-60"
        >
          {progress > 0 ? "Importing…" : `Confirm Import (${summary.add + summary.update})`}
        </button>
      </div>
    </div>
  );
}

function SuccessScreen({
  total,
  summary,
}: {
  total: number;
  summary: { add: number; update: number; skip: number };
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-outline-variant bg-surface-container-lowest px-6 py-12 text-center">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
        <PartyPopper className="h-8 w-8" />
      </span>
      <h2 className="text-headline-md text-on-surface">Import complete</h2>
      <p className="mt-1 text-body-lg text-on-surface-variant">
        {total} client records are now in your CRM.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2 text-label-md">
        <Tally label="Added" value={summary.add} tone="bg-green-100 text-green-800" />
        <Tally label="Updated" value={summary.update} tone="bg-blue-100 text-blue-800" />
        <Tally label="Skipped" value={summary.skip} tone="bg-surface-variant text-on-surface-variant" />
      </div>
      <Link
        href="/clients"
        className="mt-7 rounded-lg bg-primary px-6 py-3 text-body-lg font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-[0.99]"
      >
        View Clients
      </Link>
    </div>
  );
}

// ---- small shared pieces ----

function StepFooter({
  onBack,
  onNext,
  nextLabel,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onBack}
        className="rounded-lg border border-outline-variant px-5 py-3 text-body-lg font-semibold text-on-surface transition-colors hover:bg-surface-variant/50"
      >
        Back
      </button>
      <button
        onClick={onNext}
        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-body-lg font-bold text-on-primary transition-colors hover:bg-primary-container active:scale-[0.99]"
      >
        {nextLabel} <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function DedupStat({
  icon: Icon,
  tone,
  count,
  label,
  hint,
}: {
  icon: typeof UserPlus;
  tone: "green" | "blue" | "amber";
  count: number;
  label: string;
  hint: string;
}) {
  const tones = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
  };
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 text-display-lg text-primary">{count}</p>
      <p className="text-body-md font-semibold text-on-surface">{label}</p>
      <p className="text-label-md text-on-surface-variant">{hint}</p>
    </div>
  );
}

function ChoiceButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon?: typeof GitMerge;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-label-md font-bold transition-colors ${
        active
          ? "bg-primary text-on-primary"
          : "border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-variant/50"
      }`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </button>
  );
}

function SummaryRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-body-lg text-on-surface">{label}</span>
      <span className={`text-headline-sm font-bold ${tone}`}>{value}</span>
    </div>
  );
}

function Tally({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <span className={`rounded-full px-3 py-1 font-bold ${tone}`}>
      {value} {label}
    </span>
  );
}
