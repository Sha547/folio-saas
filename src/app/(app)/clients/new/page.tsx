import Link from "next/link";
import { requireWorkspace } from "@/lib/session";
import NewClientForm from "./new-client-form";

export default async function NewClientPage() {
  await requireWorkspace();
  return (
    <div className="max-w-xl mx-auto">
      <Link
        href="/clients"
        className="text-sm text-muted hover:text-foreground inline-flex items-center gap-1 mb-4"
      >
        ← Clients
      </Link>
      <div className="card p-8">
        <h1 className="text-2xl font-bold tracking-tight">New client</h1>
        <p className="text-muted mt-1 text-sm">
          A name is enough. You can add the rest later.
        </p>
        <div className="mt-8">
          <NewClientForm />
        </div>
      </div>
    </div>
  );
}
