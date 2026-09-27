import { EVIDENCE_LABELS, type EvidenceLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

const styles: Record<EvidenceLevel, string> = {
  high: "bg-emerald-100 text-emerald-900 border-emerald-300",
  moderate: "bg-sky-100 text-sky-900 border-sky-300",
  low: "bg-amber-100 text-amber-950 border-amber-300",
  very_low: "bg-orange-100 text-orange-950 border-orange-300",
  no_established: "bg-slate-100 text-slate-700 border-slate-300",
};

export function EvidenceBadge({
  level,
  className,
}: {
  level: string;
  className?: string;
}) {
  const key = (level as EvidenceLevel) in styles ? (level as EvidenceLevel) : "moderate";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        styles[key],
        className
      )}
    >
      Evidence: {EVIDENCE_LABELS[key]}
    </span>
  );
}
