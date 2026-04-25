import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const isAuthed = Boolean(session?.user);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900">
      <header className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="font-semibold text-lg">Invoice SaaS</div>
        <nav className="flex items-center gap-3 text-sm">
          {isAuthed ? (
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Open dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            Invoices and expenses,{" "}
            <span className="text-blue-600">finally simple</span>.
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            Send professional invoices in seconds. Snap a photo of any receipt
            and AI fills in the details. Built for freelancers and small teams.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={isAuthed ? "/dashboard" : "/signup"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium text-lg"
            >
              {isAuthed ? "Open dashboard" : "Start free"}
            </Link>
            <Link
              href="#features"
              className="px-6 py-3 rounded-md font-medium text-lg border hover:bg-white dark:hover:bg-gray-800"
            >
              See features
            </Link>
          </div>
        </section>

        <section id="features" className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature
            title="Beautiful invoices"
            description="Create, customize, and send invoices as PDFs. Track paid vs. unpaid at a glance."
            emoji="📄"
          />
          <Feature
            title="AI receipt scanning"
            description="Upload a receipt photo. Claude extracts the vendor, amount, date, and category for you."
            emoji="📸"
          />
          <Feature
            title="Workspaces"
            description="Invite teammates, manage roles, and keep every client's data isolated."
            emoji="👥"
          />
        </section>

        <section className="mt-24 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-bold">Ready in 60 seconds</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            No credit card required. Sign up and your first workspace is created
            automatically.
          </p>
          <Link
            href={isAuthed ? "/dashboard" : "/signup"}
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
          >
            {isAuthed ? "Open dashboard" : "Create your account"}
          </Link>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        Built with Next.js, Prisma, and Claude.
      </footer>
    </div>
  );
}

function Feature({
  title,
  description,
  emoji,
}: {
  title: string;
  description: string;
  emoji: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
      <div className="text-3xl">{emoji}</div>
      <h3 className="font-semibold mt-3">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
    </div>
  );
}
