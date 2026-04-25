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
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/invoices"
        className="text-sm text-muted hover:text-foreground inline-flex items-center gap-1"
      >
        ← Invoices
      </Link>

      {/* Hero card */}
      <div className="card p-8 gradient-surface">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-sm text-muted">{invoice.number}</p>
            <p className="text-5xl font-bold tracking-tight mt-2 tabular">
              {currency.format(invoice.total)}
            </p>
            <p className="mt-3 text-sm text-muted">
              Due {invoice.dueDate.toLocaleDateString()}
            </p>
          </div>
          <StatusPill status={invoice.status} large />
        </div>
      </div>

      {/* Bill to + From */}
      <div className="bento auto-rows-min">
        <div className="col-span-12 sm:col-span-6 card p-6">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">
            Bill to
          </p>
          <p className="font-semibold tracking-tight mt-3">
            {invoice.client.name}
          </p>
          {invoice.client.email && (
            <p className="text-sm text-muted mt-1">{invoice.client.email}</p>
          )}
          {invoice.client.address && (
            <p className="text-sm text-muted mt-1 whitespace-pre-line break-words">
              {invoice.client.address}
            </p>
          )}
        </div>
        <div className="col-span-12 sm:col-span-6 card p-6">
          <p className="text-xs font-medium text-muted uppercase tracking-wider">
            From
          </p>
          <p className="font-semibold tracking-tight mt-3">
            {organization.name}
          </p>
          <p className="text-sm text-muted mt-1">
            Issued {invoice.issueDate.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Line items */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-border/40">
          <h2 className="font-semibold tracking-tight">Line items</h2>
        </div>
        <ul className="divide-y divide-border/40">
          {invoice.items.map((it) => (
            <li
              key={it.id}
              className="px-6 py-3 grid grid-cols-12 items-center gap-4"
            >
              <span className="col-span-7 text-sm">{it.description}</span>
              <span className="col-span-2 text-xs text-muted font-mono tabular text-right">
                {it.quantity} × {currency.format(it.unitPrice)}
              </span>
              <span className="col-span-3 text-sm font-mono tabular text-right">
                {currency.format(it.amount)}
              </span>
            </li>
          ))}
        </ul>
        <div className="px-6 py-4 bg-foreground/[0.02] border-t border-border/40 space-y-1.5">
          <Row label="Subtotal" value={currency.format(invoice.subtotal)} />
          <Row
            label={`Tax (${invoice.taxRate}%)`}
            value={currency.format(invoice.total - invoice.subtotal)}
          />
          <Row label="Total" value={currency.format(invoice.total)} bold />
        </div>
      </div>

      {invoice.notes && (
        <div className="card p-6">
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
            Notes
          </p>
          <p className="text-sm whitespace-pre-line">{invoice.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="card p-4 flex flex-wrap items-center gap-2">
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
          className="bg-accent hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded-full text-sm font-medium transition"
        >
          Download PDF
        </a>
        <form action={deleteInvoiceAction} className="ml-auto">
          <input type="hidden" name="id" value={invoice.id} />
          <button
            type="submit"
            className="text-xs text-red-600 hover:underline underline-offset-4 px-3"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div
      className={`flex justify-between text-sm ${
        bold ? "font-semibold text-base pt-2 border-t border-border/40" : "text-muted"
      }`}
    >
      <span>{label}</span>
      <span className="font-mono tabular">{value}</span>
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
        className="bg-foreground/5 hover:bg-foreground/10 px-4 py-2 rounded-full text-sm font-medium transition"
      >
        {children}
      </button>
    </form>
  );
}

function StatusPill({ status, large }: { status: string; large?: boolean }) {
  const styles: Record<string, string> = {
    draft: "bg-neutral-100 text-neutral-700",
    sent: "bg-amber-100 text-amber-700",
    paid: "bg-emerald-100 text-emerald-700",
    overdue: "bg-red-100 text-red-700",
  };
  const dots: Record<string, string> = {
    draft: "bg-neutral-500",
    sent: "bg-amber-500",
    paid: "bg-emerald-600",
    overdue: "bg-red-600",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium capitalize ${
        styles[status] ?? styles.draft
      } ${large ? "px-4 py-1.5 text-sm" : "px-2.5 py-1 text-xs"}`}
    >
      <span
        className={`rounded-full ${dots[status] ?? dots.draft} ${
          large ? "w-2 h-2" : "w-1.5 h-1.5"
        }`}
      />
      {status}
    </span>
  );
}
