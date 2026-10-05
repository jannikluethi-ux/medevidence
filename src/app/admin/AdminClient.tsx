"use client";

import { useState } from "react";
import Link from "next/link";

type Claim = {
  id: number;
  claim_text: string;
  status: string;
  evidence_level: string;
  certainty_bucket: string;
  section: string | null;
  generic_name: string | null;
  med_slug: string | null;
  version: number;
};

export function AdminClient() {
  const [password, setPassword] = useState("");
  const [claims, setClaims] = useState<Claim[]>([]);
  const [authed, setAuthed] = useState(false);
  const [note, setNote] = useState("");
  const [versionNote, setVersionNote] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function unlock() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin", {
        headers: { "x-admin-password": password },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || `Error ${res.status}`);
        setAuthed(false);
        setClaims([]);
        return;
      }
      const data = await res.json();
      setClaims((data.claims ?? []) as Claim[]);
      setAuthed(true);
      setMessage("");
    } finally {
      setLoading(false);
    }
  }

  async function decide(claimId: number, decision: "approve" | "reject" | "needs_revision") {
    setBusyId(claimId);
    setMessage("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          claimId,
          decision,
          reviewerNote: note,
          versionNote: versionNote || `Decision: ${decision}`,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || `Error ${res.status}`);
        return;
      }
      const data = await res.json();
      setClaims((prev) =>
        prev.map((c) =>
          c.id === claimId
            ? {
                ...c,
                status: data.status,
                version: c.version + 1,
              }
            : c
        )
      );
      setMessage(`Claim #${claimId} marked ${data.status}.`);
    } finally {
      setBusyId(null);
    }
  }

  if (!authed) {
    return (
      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
          <label className="text-sm">
            <span className="mb-1 block font-medium">Admin password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="rounded-lg border border-slate-300 px-3 py-2"
            />
          </label>
          <button
            type="button"
            disabled={loading || !password}
            onClick={() => void unlock()}
            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {loading ? "Checking…" : "Unlock queue"}
          </button>
        </div>
        {message ? (
          <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-800">{message}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <label className="min-w-[200px] flex-1 text-sm">
          <span className="mb-1 block font-medium">Reviewer note</span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Optional note"
          />
        </label>
        <label className="min-w-[200px] flex-1 text-sm">
          <span className="mb-1 block font-medium">Version note</span>
          <input
            value={versionNote}
            onChange={(e) => setVersionNote(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="What changed"
          />
        </label>
        <button
          type="button"
          disabled={loading}
          onClick={() => void unlock()}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>
      {message ? (
        <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-800">{message}</p>
      ) : null}

      <ul className="space-y-4">
        {claims.length === 0 ? (
          <li className="text-sm text-slate-500">No draft claims in queue.</li>
        ) : (
          claims.map((c) => (
            <li key={c.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded bg-slate-900 px-2 py-0.5 font-bold uppercase text-white">
                  {c.status}
                </span>
                <span className="text-slate-500">
                  #{c.id} · v{c.version}
                </span>
                {c.section ? <span className="text-slate-500">{c.section}</span> : null}
                <span className="text-slate-500">{c.certainty_bucket}</span>
                <span className="text-slate-500">{c.evidence_level}</span>
              </div>
              {c.generic_name ? (
                <p className="mt-1 text-sm">
                  Medication:{" "}
                  {c.med_slug ? (
                    <Link href={`/medications/${c.med_slug}`} className="text-teal-700 underline">
                      {c.generic_name}
                    </Link>
                  ) : (
                    c.generic_name
                  )}
                </p>
              ) : null}
              <p className="mt-2 text-sm text-slate-800">{c.claim_text}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busyId === c.id}
                  onClick={() => decide(c.id, "approve")}
                  className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={busyId === c.id}
                  onClick={() => decide(c.id, "needs_revision")}
                  className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
                >
                  Needs revision
                </button>
                <button
                  type="button"
                  disabled={busyId === c.id}
                  onClick={() => decide(c.id, "reject")}
                  className="rounded-lg bg-red-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
