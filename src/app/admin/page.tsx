import { AdminClient } from "./AdminClient";
import { listPendingClaims } from "@/lib/data";
import { Disclaimer } from "@/components/Disclaimer";

export const metadata = { title: "Admin review" };

export default function AdminPage() {
  const claims = listPendingClaims() as {
    id: number;
    claim_text: string;
    status: string;
    evidence_level: string;
    certainty_bucket: string;
    section: string | null;
    generic_name: string | null;
    med_slug: string | null;
    version: number;
  }[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Content review</h1>
      <p className="mt-2 text-slate-600">
        Local admin queue for draft claims. Password from <code>ADMIN_PASSWORD</code> env
        (default <code>review</code>).
      </p>
      <div className="mt-4">
        <Disclaimer compact />
      </div>
      <AdminClient initialClaims={claims} />
    </div>
  );
}
