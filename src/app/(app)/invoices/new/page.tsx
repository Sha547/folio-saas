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
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-8 text-center">
        <h1 className="text-xl font-semibold mb-2">No clients yet</h1>
        <p className="text-sm text-gray-500 mb-4">
          You need at least one client before you can create an invoice.
        </p>
        <Link
          href="/clients/new"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Add a client
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New invoice</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add line items and a due date — we&apos;ll calculate the totals.
        </p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <NewInvoiceForm clients={clients} />
      </div>
    </div>
  );
}
