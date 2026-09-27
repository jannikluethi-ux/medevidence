"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBox({
  initialQuery = "",
  placeholder = "Describe your symptoms, condition, or medication…",
  action = "/symptoms",
  large = false,
}: {
  initialQuery?: string;
  placeholder?: string;
  action?: string;
  large?: boolean;
}) {
  const [q, setQ] = useState(initialQuery);
  const router = useRouter();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`${action}?q=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={onSubmit} className="w-full" role="search">
      <label htmlFor="universal-search" className="sr-only">
        Search symptoms, conditions, or medications
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="universal-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className={
            large
              ? "w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200"
              : "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200"
          }
        />
        <button
          type="submit"
          className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          Search
        </button>
      </div>
    </form>
  );
}
