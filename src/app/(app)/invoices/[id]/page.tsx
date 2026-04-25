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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{invoice.number}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Issued {invoice.issueDate.toLocaleDateString()} • Due{" "}
            {invoice.dueDate.toLocaleDateString()}
          </p>
        </div>
        <StatusBadge status={invoice.status} />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs uppercase text-gray-500">Bill to</p>
            <p className="font-medium mt-1">{invoice.client.name}</p>
            {invoice.client.email && (
              <p className="text-sm text-gray-500">{invoice.client.email}</p>
            )}
            {invoice.client.address && (
              <p className="text-sm text-gray-500 whitespace-pre-line">
                {invoice.client.address}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs uppercase text-gray-500">From</p>
            <p className="font-medium mt-1">{organization.name}</p>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-left">
            <tr>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2 text-right">Qty</th>
              <th className="px-3 py-2 text-right">Unit price</th>
              <th className="px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {invoice.items.map((it) => (
              <tr key={it.id}>
                <td className="px-3 py-2">{it.description}</td>
                <td className="px-3 py-2 text-right">{it.quantity}</td>
                <td className="px-3 py-2 text-right">
                  {currency.format(it.unitPrice)}
                </td>
                <td className="px-3 py-2 text-right">
                  {currency.format(it.amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="text-sm">
            <tr>
              <td colSpan={3} className="px-3 py-2 text-right text-gray-500">
                Subtotal
              </td>
              <td className="px-3 py-2 text-right">
                {currency.format(invoice.subtotal)}
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="px-3 py-2 text-right text-gray-500">
                Tax ({invoice.taxRate}%)
              </td>
              <td className="px-3 py-2 text-right">
                {currency.format(invoice.total - invoice.subtotal)}
              </td>
            </tr>
            <tr className="font-semibold border-t">
              <td colSpan={3} className="px-3 py-2 text-right">
                Total
              </td>
              <td className="px-3 py-2 text-right">
                {currency.format(invoice.total)}
              </td>
            </tr>
          </tfoot>
        </table>

        {invoice.notes && (
          <div className="text-sm">
            <p className="text-xs uppercase text-gray-500">Notes</p>
            <p className="mt-1 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <StatusButton id={invoice.id} status="sent" current={invoice.status}>
          Mark as sent
        </StatusButton>
        <StatusButton id={invoice.id} status="paid" current={invoice.status}>
          Mark as paid
        </StatusButton>
        <StatusButton id={invoice.id} status="draft" current={invoice.status}>
          Back to draft
        </StatusButton>
        <Link
          href="/invoices"
          className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          ← All invoices
        </Link>
        <form action={deleteInvoiceAction} className="ml-auto">
          <input type="hidden" name="id" value={invoice.id} />
          <button
            type="submit"
            className="px-3 py-1.5 border border-red-200 text-red-600 rounded-md text-sm hover:bg-red-50 dark:hover:bg-red-950"
          >
            Delete
          </button>
        </form>
      </div>
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
        className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {children}
      </button>
    </form>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    sent: "bg-blue-100 text-blue-700",
    paid: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`text-sm px-3 py-1 rounded-full font-medium capitalize ${
        colors[status] ?? colors.draft
      }`}
    >
      {status}
    </span>
  );
}
