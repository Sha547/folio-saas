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
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-blue flex items-center justify-center text-white text-sm font-bold">
              F
            </div>
            <span className="font-semibold tracking-tight hidden sm:inline">
              Folio
            </span>
          </Link>

          <nav className="flex items-center gap-1 text-sm">
            <NavLink href="/dashboard">Overview</NavLink>
            <NavLink href="/clients">Clients</NavLink>
            <NavLink href="/invoices">Invoices</NavLink>
            <NavLink href="/expenses">Expenses</NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="font-medium">{organization.name}</span>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 transition flex items-center justify-center text-xs font-semibold"
                title={`Sign out (${user.email})`}
              >
                {(user.name?.[0] ?? user.email?.[0] ?? "?").toUpperCase()}
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-10 w-full flex-1">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition"
    >
      {children}
    </Link>
  );
}
