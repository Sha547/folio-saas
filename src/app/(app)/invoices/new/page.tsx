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
      <div className="max-w-xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
          Hold on
        </p>
        <h1 className="serif text-5xl">You need a client first.</h1>
        <p className="mt-3 text-muted">
          Add someone you bill, then come back here.
        </p>
        <Link
          href="/clients/new"
          className="mt-8 inline-flex items-center gap-2 bg-foreground text-background px-5 py-3 hover:bg-neutral-800"
        >
          Add a client <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
        New
      </p>
      <h1 className="serif text-5xl">Compose an invoice.</h1>
      <p className="mt-3 text-muted">
        Add line items. We&apos;ll handle the totals.
      </p>
      <div className="mt-12">
        <NewInvoiceForm clients={clients} />
      </div>
    </div>
  );
}
