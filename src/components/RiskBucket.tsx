import { CERTAINTY_LABELS, type CertaintyBucket } from "@/lib/types";
import { cn } from "@/lib/utils";

const styles: Record<CertaintyBucket, string> = {
  established: "border-l-emerald-600 bg-emerald-50",
  probable: "border-l-sky-600 bg-sky-50",
  possible_emerging: "border-l-amber-500 bg-amber-50",
  not_established: "border-l-slate-400 bg-slate-50",
};

const titles: Record<CertaintyBucket, string> = {
  established: "Established",
  probable: "Probable",
  possible_emerging: "Possible / emerging",
  not_established: "Not established",
};

export function RiskBucket({
  bucket,
  children,
  className,
}: {
  bucket: string;
  children: React.ReactNode;
  className?: string;
}) {
  const key =
    (bucket as CertaintyBucket) in styles
      ? (bucket as CertaintyBucket)
      : "not_established";
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 border-l-4 p-4 shadow-sm",
        styles[key],
        className
      )}
    >
      <div className="mb-2 text-sm font-semibold text-slate-800">
        {titles[key]}
        <span className="ml-2 text-xs font-normal text-slate-500">
          ({CERTAINTY_LABELS[key]})
        </span>
      </div>
      {children}
    </div>
  );
}
