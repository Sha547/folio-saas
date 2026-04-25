import Link from "next/link";
import { requireWorkspace } from "@/lib/session";
import { db } from "@/lib/db";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default async function InvoicesPage() {
  const { organization } = await requireWorkspace();
  const invoices = await db.invoice.findMany({
    where: { organizationId: organization.id },
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">
            All invoices in this workspace.
          </p>
        </div>
        <Link
          href="/invoices/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + New invoice
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
        {invoices.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            No invoices yet.{" "}
            <Link href="/invoices/new" className="text-blue-600 hover:underline">
              Create your first one
            </Link>
            .
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-left">
              <tr>
                <Th>Number</Th>
                <Th>Client</Th>
                <Th>Due date</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Td>
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="font-medium hover:underline"
                    >
                      {inv.number}
                    </Link>
                  </Td>
                  <Td>{inv.client.name}</Td>
                  <Td>{inv.dueDate.toLocaleDateString()}</Td>
                  <Td>{currency.format(inv.total)}</Td>
                  <Td>
                    <StatusBadge status={inv.status} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-xs uppercase tracking-wide text-gray-500">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-3">{children}</td>;
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
      className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
        colors[status] ?? colors.draft
      }`}
    >
      {status}
    </span>
  );
}
