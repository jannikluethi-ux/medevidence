"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { JurisdictionSelector } from "./JurisdictionSelector";
import { cn } from "@/lib/utils";

const links = [
  { href: "/symptoms", label: "Search symptoms" },
  { href: "/medications", label: "Medications" },
  { href: "/conditions", label: "Conditions" },
  { href: "/interactions", label: "Interactions" },
  { href: "/compare", label: "Comparison" },
  { href: "/evidence", label: "Evidence explorer" },
  { href: "/safety", label: "Safety" },
  { href: "/sources", label: "Sources" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-sm font-bold text-white">
            ME
          </span>
          <span>
            <span className="block text-base font-bold text-slate-900">MedEvidence</span>
            <span className="block text-[11px] text-slate-500">Evidence · not a diagnosis</span>
          </span>
        </Link>
        <div className="hidden lg:block">
          <JurisdictionSelector />
        </div>
        <button
          type="button"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm lg:hidden"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>
      <nav
        id="primary-nav"
        className={cn(
          "border-t border-slate-100 bg-slate-50 lg:block",
          open ? "block" : "hidden"
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-2 py-2 lg:flex-row lg:flex-wrap lg:items-center lg:gap-1">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  active
                    ? "bg-teal-700 text-white"
                    : "text-slate-700 hover:bg-white hover:text-teal-800"
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <div className="px-2 py-2 lg:hidden">
            <JurisdictionSelector />
          </div>
        </div>
      </nav>
      <div className="bg-slate-800 px-4 py-1.5 text-center text-[11px] text-slate-200">
        Educational information only · Not a substitute for professional medical advice · Does
        not diagnose or prescribe
      </div>
    </header>
  );
}
