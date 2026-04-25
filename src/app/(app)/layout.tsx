import Link from "next/link";
import { requireWorkspace } from "@/lib/session";
import { signOutAction } from "@/lib/actions/signout";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, organization } = await requireWorkspace();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-hairline bg-background sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-8">
          <Link href="/dashboard" className="flex items-baseline gap-2">
            <span className="serif text-xl">Ledger</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted hidden sm:inline">
              / {organization.slug}
            </span>
          </Link>
          <nav className="flex gap-6 text-sm">
            <NavLink href="/dashboard">Overview</NavLink>
            <NavLink href="/clients">Clients</NavLink>
            <NavLink href="/invoices">Invoices</NavLink>
            <NavLink href="/expenses">Expenses</NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-4 text-sm">
            <span className="font-mono text-xs text-muted hidden sm:inline">
              {user.email}
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-xs hover:underline underline-offset-4"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-12 w-full flex-1">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-foreground/70 hover:text-foreground hover:underline underline-offset-[6px] decoration-1"
    >
      {children}
    </Link>
  );
}
