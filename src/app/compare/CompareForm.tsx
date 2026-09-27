"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CompareForm({
  meds,
  initial,
}: {
  meds: { slug: string; generic_name: string }[];
  initial: string[];
}) {
  const router = useRouter();
  const [a, setA] = useState(initial[0] ?? "");
  const [b, setB] = useState(initial[1] ?? "");
  const [c, setC] = useState(initial[2] ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (a) params.set("a", a);
    if (b) params.set("b", b);
    if (c) params.set("c", c);
    router.push(`/compare?${params.toString()}`);
  }

  const selectClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-4">
      {[
        ["Medicine 1", a, setA],
        ["Medicine 2", b, setB],
        ["Medicine 3 (optional)", c, setC],
      ].map(([label, value, setter]) => (
        <label key={label as string} className="text-sm">
          <span className="mb-1 block font-medium">{label as string}</span>
          <select
            className={selectClass}
            value={value as string}
            onChange={(e) => (setter as (v: string) => void)(e.target.value)}
          >
            <option value="">Select…</option>
            {meds.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.generic_name}
              </option>
            ))}
          </select>
        </label>
      ))}
      <div className="flex items-end">
        <button type="submit" className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white">
          Compare
        </button>
      </div>
    </form>
  );
}
