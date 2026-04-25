import Link from "next/link";
import { requireWorkspace } from "@/lib/session";
import { db } from "@/lib/db";
import { deleteClientAction } from "@/lib/actions/clients";

export default async function ClientsPage() {
  const { organization } = await requireWorkspace();
  const clients = await db.client.findMany({
    where: { organizationId: organization.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { invoices: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">
            People and businesses you invoice.
          </p>
        </div>
        <Link
          href="/clients/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          + New client
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
        {clients.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            No clients yet. Add your first one to start invoicing.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-left">
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Invoices</Th>
                <Th aria-label="Actions" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {clients.map((c) => (
                <tr key={c.id}>
                  <Td className="font-medium">{c.name}</Td>
                  <Td className="text-gray-500">{c.email ?? "—"}</Td>
                  <Td>{c._count.invoices}</Td>
                  <Td className="text-right">
                    <form action={deleteClientAction}>
                      <input type="hidden" name="id" value={c.id} />
                      <button
                        type="submit"
                        className="text-xs text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </form>
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

function Th({ children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className="px-6 py-3 text-xs uppercase tracking-wide text-gray-500" {...props}>
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-6 py-3 ${className}`}>{children}</td>;
}
