import Link from "next/link";
import { requireWorkspace } from "@/lib/session";
import { db } from "@/lib/db";
import NewInvoiceForm from "./new-invoice-form";

export default async function NewInvoicePage() {
  const { organization } = await requireWorkspace();
  const clients = await db.client.findMany({
    where: { organizationId: organization.id },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  if (clients.length === 0) {
    return (
      <div className="max-w-xl mx-auto card p-12 text-center">
        <div className="text-4xl mb-3">👤</div>
        <h1 className="text-2xl font-bold tracking-tight">
          Add a client first
        </h1>
        <p className="text-muted mt-2">
          You need at least one client before creating an invoice.
        </p>
        <Link
          href="/clients/new"
          className="mt-6 inline-block bg-accent hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-full font-medium transition"
        >
          Add a client →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        href="/invoices"
        className="text-sm text-muted hover:text-foreground inline-flex items-center gap-1 mb-4"
      >
        ← Invoices
      </Link>
      <div className="card p-8">
        <h1 className="text-2xl font-bold tracking-tight">New invoice</h1>
        <p className="text-muted mt-1 text-sm">
          Add line items. We&apos;ll handle the totals.
        </p>
        <div className="mt-8">
          <NewInvoiceForm clients={clients} />
        </div>
      </div>
    </div>
  );
}
