import { AdminClient } from "./AdminClient";
import { Disclaimer } from "@/components/Disclaimer";

export const metadata = { title: "Admin" };

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Admin</h1>
      <p className="mt-2 text-slate-600">
        Sign in with the admin password to load the content queue. Password is set via the{" "}
        <code>ADMIN_PASSWORD</code> environment variable.
      </p>
      <div className="mt-4">
        <Disclaimer compact />
      </div>
      <AdminClient />
    </div>
  );
}
