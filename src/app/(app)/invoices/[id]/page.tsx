import Link from "next/link";
import { notFound } from "next/navigation";
import { requireWorkspace } from "@/lib/session";
import { db } from "@/lib/db";
import {
  updateInvoiceStatusAction,
  deleteInvoiceAction,
} from "@/lib/actions/invoices";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { organization } = await requireWorkspace();

  const invoice = await db.invoice.findFirst({
    where: { id, organizationId: organization.id },
    include: { client: true, items: true },
  });
  if (!invoice) notFound();

  return (
    <div className="max-w-3xl space-y-12">
      <div>
        <Link
          href="/invoices"
          className="font-mono text-xs uppercase tracking-widest text-muted hover:underline underline-offset-4"
        >
          ← All invoices
        </Link>
        <div className="flex items-end justify-between mt-4">
          <div>
            <p className="font-mono text-sm text-muted">{invoice.number}</p>
            <h1 className="serif text-5xl mt-2">
              {currency.format(invoice.total)}
            </h1>
            <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted">
              Due {invoice.dueDate.toLocaleDateString()}
            </p>
          </div>
          <Status status={invoice.status} large />
        </div>
      </div>

      <section className="border-y border-hairline grid grid-cols-1 sm:grid-cols-2">
        <div className="border-r border-hairline px-6 py-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Bill to
          </p>
          <p className="serif text-2xl mt-3">{invoice.client.name}</p>
          {invoice.client.email && (
            <p className="text-sm text-muted mt-1">{invoice.client.email}</p>
          )}
          {invoice.client.address && (
            <p className="text-sm text-muted mt-1 whitespace-pre-line">
              {invoice.client.address}
            </p>
          )}
        </div>
        <div className="px-6 py-8">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            From
          </p>
          <p className="serif text-2xl mt-3">{organization.name}</p>
          <p className="text-sm text-muted mt-1 font-mono">
            Issued {invoice.issueDate.toLocaleDateString()}
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">
          Line items
        </h2>
        <div className="border-t border-hairline">
          {invoice.items.map((it) => (
            <div
              key={it.id}
              className="grid grid-cols-12 py-4 border-b border-hairline items-baseline gap-2"
            >
              <div className="col-span-7">{it.description}</div>
              <div className="col-span-2 font-mono tabular text-sm text-muted text-right">
                {it.quantity} × {currency.format(it.unitPrice)}
              </div>
              <div className="col-span-3 font-mono tabular text-right">
                {currency.format(it.amount)}
              </div>
            </div>
          ))}
        </div>

        <div className="ml-auto max-w-xs mt-6 space-y-2 font-mono tabular text-sm">
          <Row label="Subtotal" value={currency.format(invoice.subtotal)} />
          <Row
            label={`Tax (${invoice.taxRate}%)`}
            value={currency.format(invoice.total - invoice.subtotal)}
          />
          <div className="border-t border-foreground pt-2 mt-2">
            <Row label="Total" value={currency.format(invoice.total)} bold />
          </div>
        </div>
      </section>

      {invoice.notes && (
        <section className="border-t border-hairline pt-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">
            Notes
          </p>
          <p className="whitespace-pre-line text-muted">{invoice.notes}</p>
        </section>
      )}

      <section className="border-t border-hairline pt-6 flex flex-wrap gap-3 items-center">
        <StatusButton id={invoice.id} status="sent" current={invoice.status}>
          Mark as sent
        </StatusButton>
        <StatusButton id={invoice.id} status="paid" current={invoice.status}>
          Mark as paid
        </StatusButton>
        <StatusButton id={invoice.id} status="draft" current={invoice.status}>
          Back to draft
        </StatusButton>
        <a
          href={`/api/invoices/${invoice.id}/pdf`}
          target="_blank"
          rel="noopener"
          className="border border-foreground px-3 py-1.5 text-sm hover:bg-foreground hover:text-background"
        >
          Download PDF
        </a>
        <form action={deleteInvoiceAction} className="ml-auto">
          <input type="hidden" name="id" value={invoice.id} />
          <button
            type="submit"
            className="font-mono text-[10px] uppercase tracking-widest text-muted hover:text-red-700"
          >
            Delete
          </button>
        </form>
      </section>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base" : "text-muted"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function StatusButton({
  id,
  status,
  current,
  children,
}: {
  id: string;
  status: string;
  current: string;
  children: React.ReactNode;
}) {
  if (status === current) return null;
  return (
    <form action={updateInvoiceStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className="border border-foreground px-3 py-1.5 text-sm hover:bg-foreground hover:text-background"
      >
        {children}
      </button>
    </form>
  );
}

function Status({ status, large }: { status: string; large?: boolean }) {
  const tone: Record<string, string> = {
    draft: "bg-neutral-400",
    sent: "bg-amber-500",
    paid: "bg-green-600",
    overdue: "bg-red-600",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono uppercase tracking-widest text-muted ${
        large ? "text-xs" : "text-[10px]"
      }`}
    >
      <span
        className={`inline-block ${large ? "w-2 h-2" : "w-1.5 h-1.5"} rounded-full ${
          tone[status] ?? "bg-neutral-400"
        }`}
      />
      {status}
    </span>
  );
}
