import Link from "next/link";
import { Disclaimer } from "./Disclaimer";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-bold text-slate-900">MedEvidence</p>
          <p className="mt-2 text-sm text-slate-600">
            A starter evidence explorer for medications and conditions. Catalog is incomplete
            by design — expandable, not exhaustive.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-slate-800">Explore</p>
          <ul className="mt-2 space-y-1 text-teal-800">
            <li><Link href="/safety">Safety & emergencies</Link></li>
            <li><Link href="/evidence">Evidence hierarchy</Link></li>
            <li><Link href="/sources">How sourcing works</Link></li>
          </ul>
        </div>
        <Disclaimer />
      </div>
      <div className="border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        Jurisdictions: US (FDA) · EU (EMA) · UK (MHRA/NICE) · CH (Swissmedic). Always verify
        against current local labeling.
      </div>
    </footer>
  );
}
