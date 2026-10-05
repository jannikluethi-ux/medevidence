"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function InteractionForm({
  suggestions,
  initial,
}: {
  suggestions: string[];
  initial: string[];
}) {
  const router = useRouter();
  const [a, setA] = useState(initial[0] ?? "");
  const [b, setB] = useState(initial[1] ?? "");
  const [c, setC] = useState(initial[2] ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (a.trim()) params.set("a", a.trim());
    if (b.trim()) params.set("b", b.trim());
    if (c.trim()) params.set("c", c.trim());
    router.push(`/interactions?${params.toString()}`);
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200";

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-4">
      <datalist id="med-suggestions">
        {suggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      {(
        [
          ["Medication A", a, setA],
          ["Medication B", b, setB],
          ["Medication C (optional)", c, setC],
        ] as const
      ).map(([label, value, setter]) => (
        <label key={label} className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">{label}</span>
          <input
            className={inputClass}
            list="med-suggestions"
            value={value}
            placeholder="Generic or brand name…"
            autoComplete="off"
            onChange={(e) => setter(e.target.value)}
          />
        </label>
      ))}
      <div className="flex items-end">
        <button
          type="submit"
          className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800"
        >
          Check interactions
        </button>
      </div>
    </form>
  );
}
