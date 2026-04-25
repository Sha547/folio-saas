import { requireWorkspace } from "@/lib/session";
import { signOutAction } from "@/lib/actions/signout";

export default async function DashboardPage() {
  const { user, organization, role } = await requireWorkspace();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">{organization.name}</h1>
            <p className="text-xs text-gray-500">/{organization.slug}</p>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-sm px-3 py-1.5 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">
            Welcome, {user.name ?? user.email}
          </h2>
          <p className="text-sm text-gray-500">
            You&apos;re signed in as <span className="font-medium">{role}</span> of{" "}
            <span className="font-medium">{organization.name}</span>.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Stat label="Invoices" value="0" />
          <Stat label="Outstanding" value="$0.00" />
          <Stat label="Expenses (this month)" value="$0.00" />
        </section>

        <section className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
          <h3 className="font-semibold mb-2">Coming up next</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc pl-5">
            <li>Add clients and create your first invoice</li>
            <li>Send invoices by email and accept payments</li>
            <li>Snap receipts — AI extracts amounts automatically</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
