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
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted mt-1">
            People and businesses you invoice.
          </p>
        </div>
        <Link
          href="/clients/new"
          className="bg-accent hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-full font-medium transition shadow-md shadow-accent/20"
        >
          + New client
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-4xl mb-3">👋</div>
          <h2 className="text-xl font-semibold tracking-tight">
            No clients yet
          </h2>
          <p className="text-muted mt-1">
            Add your first one to start invoicing.
          </p>
          <Link
            href="/clients/new"
            className="mt-6 inline-block bg-accent hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-full font-medium transition"
          >
            Add a client
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((c) => (
            <div key={c.id} className="card p-5 flex flex-col justify-between">
              <div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ background: "linear-gradient(135deg, #0066ff 0%, #0099ff 100%)" }}
                >
                  {c.name[0]?.toUpperCase()}
                </div>
                <h3 className="font-semibold tracking-tight mt-3">{c.name}</h3>
                {c.email && (
                  <p className="text-sm text-muted mt-0.5 truncate">{c.email}</p>
                )}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
                <span className="text-xs text-muted">
                  {c._count.invoices} invoice{c._count.invoices === 1 ? "" : "s"}
                </span>
                <form action={deleteClientAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    className="text-xs text-red-600 hover:underline underline-offset-4"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
