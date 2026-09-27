"use client";

import { useEffect, useState } from "react";
import type { Jurisdiction } from "@/lib/types";
import { JURISDICTION_LABELS } from "@/lib/types";

const KEY = "medevidence-jurisdiction";

export function useJurisdiction(): [Jurisdiction, (j: Jurisdiction) => void] {
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("CH");
  useEffect(() => {
    const stored = localStorage.getItem(KEY) as Jurisdiction | null;
    if (stored && stored in JURISDICTION_LABELS) setJurisdiction(stored);
  }, []);
  const update = (j: Jurisdiction) => {
    setJurisdiction(j);
    localStorage.setItem(KEY, j);
    window.dispatchEvent(new CustomEvent("medevidence-jurisdiction", { detail: j }));
  };
  return [jurisdiction, update];
}

export function JurisdictionSelector({ className }: { className?: string }) {
  const [jurisdiction, setJurisdiction] = useJurisdiction();
  return (
    <label className={className ?? "flex items-center gap-2 text-sm text-slate-700"}>
      <span className="whitespace-nowrap font-medium">Jurisdiction</span>
      <select
        className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200"
        value={jurisdiction}
        onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)}
        aria-label="Select regulatory jurisdiction"
      >
        {(Object.keys(JURISDICTION_LABELS) as Jurisdiction[]).map((j) => (
          <option key={j} value={j}>
            {j} — {JURISDICTION_LABELS[j]}
          </option>
        ))}
      </select>
    </label>
  );
}

export function JurisdictionNote({
  status,
}: {
  status: Record<string, string>;
}) {
  const [jurisdiction] = useJurisdiction();
  const note = status[jurisdiction] ?? status.US ?? Object.values(status)[0];
  if (!note) return null;
  return (
    <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
      <span className="font-semibold">{jurisdiction} regulatory note:</span> {note}
    </p>
  );
}
