export function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs leading-relaxed text-slate-500">
        Educational information only — not a substitute for professional medical advice.
        MedEvidence does not diagnose, prescribe, or tell you to start/stop/change
        prescription medicines.
      </p>
    );
  }
  return (
    <aside className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
      <p className="font-semibold">Important medical disclaimer</p>
      <p className="mt-1 leading-relaxed">
        MedEvidence provides educational, evidence-oriented information only. It is{" "}
        <strong>not a doctor</strong>, does <strong>not diagnose</strong>, and does{" "}
        <strong>not prescribe</strong>. Never start, stop, or change a prescription medicine
        based solely on this website. Always seek advice from a qualified clinician or
        pharmacist. If you think you may be having a medical emergency, call local emergency
        services immediately.
      </p>
    </aside>
  );
}
