import type { EmergencyMatch } from "@/lib/safety/emergency";
import type { Jurisdiction } from "@/lib/types";

export function EmergencyBanner({
  match,
  jurisdiction = "CH",
}: {
  match: EmergencyMatch;
  jurisdiction?: Jurisdiction;
}) {
  const number = match.numbers[jurisdiction] ?? match.numbers.EU;
  if (match.urgency === "urgent") {
    return (
      <div role="alert" aria-live="assertive" className="w-full border-b-4 border-amber-600 bg-amber-100 text-amber-950" data-urgency="urgent">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-800">Safety notice — {match.ruleName}</p>
          <p className="mt-1 text-lg font-semibold leading-snug">{match.message}</p>
          <p className="mt-2 text-sm">
            Emergency numbers: <strong>CH 144</strong> · <strong>EU 112</strong> · <strong>US 911</strong> · <strong>UK 999</strong>.
          </p>
          <p className="mt-1 text-xs text-amber-800">Shown by a rules engine, not an AI diagnosis.</p>
        </div>
      </div>
    );
  }
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="w-full border-b-4 border-red-800 bg-red-700 text-white"
      data-urgency="emergency"
    >
      <div className="mx-auto max-w-6xl px-4 py-4">
        <p className="text-xs font-bold uppercase tracking-widest text-red-100">
          Urgent safety alert — {match.ruleName}
        </p>
        <p className="mt-1 text-lg font-semibold leading-snug">{match.message}</p>
        <p className="mt-2 text-sm text-red-50">
          Call emergency services now: <strong>CH 144</strong> · <strong>EU 112</strong> ·{" "}
          <strong>US 911</strong> · <strong>UK 999</strong>. Your selected region primary
          number: <strong>{number}</strong>.
        </p>
        <p className="mt-1 text-xs text-red-100">
          Do not wait for website results. This banner is shown by a rules engine, not an AI
          diagnosis.
        </p>
      </div>
    </div>
  );
}
