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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link href="/dashboard" className="font-semibold">
            {organization.name}
          </Link>
          <nav className="flex gap-4 text-sm">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/clients">Clients</NavLink>
            <NavLink href="/invoices">Invoices</NavLink>
            <NavLink href="/expenses">Expenses</NavLink>
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="text-gray-500 hidden sm:inline">
              {user.name ?? user.email}
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="px-3 py-1.5 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}
