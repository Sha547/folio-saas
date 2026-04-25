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
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            People you bill
          </p>
          <h1 className="serif text-5xl">Clients</h1>
        </div>
        <Link
          href="/clients/new"
          className="bg-foreground text-background px-4 py-2 hover:bg-neutral-800 inline-flex items-center gap-2"
        >
          New client <span aria-hidden>→</span>
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="border border-dashed border-hairline px-6 py-20 text-center">
          <p className="serif text-2xl">No one yet.</p>
          <p className="text-muted mt-2">
            Add your first client and you can invoice them.
          </p>
          <Link
            href="/clients/new"
            className="mt-6 inline-block hover:underline underline-offset-4"
          >
            Add a client →
          </Link>
        </div>
      ) : (
        <div className="border-t border-hairline">
          <div className="grid grid-cols-12 py-3 border-b border-hairline font-mono text-[10px] uppercase tracking-widest text-muted">
            <div className="col-span-5 px-2">Name</div>
            <div className="col-span-4 px-2">Email</div>
            <div className="col-span-2 px-2 text-right">Invoices</div>
            <div className="col-span-1 px-2" />
          </div>
          {clients.map((c) => (
            <div
              key={c.id}
              className="grid grid-cols-12 items-baseline py-4 border-b border-hairline gap-2"
            >
              <div className="col-span-5 px-2">{c.name}</div>
              <div className="col-span-4 px-2 text-muted text-sm">
                {c.email ?? "—"}
              </div>
              <div className="col-span-2 px-2 text-right font-mono tabular">
                {c._count.invoices}
              </div>
              <div className="col-span-1 px-2 text-right">
                <form action={deleteClientAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <button
                    type="submit"
                    className="font-mono text-[10px] uppercase tracking-widest text-muted hover:text-red-700"
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
