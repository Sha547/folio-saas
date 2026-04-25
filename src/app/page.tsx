import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const isAuthed = Boolean(session?.user);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="serif text-2xl">Ledger</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              v0.1
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            {isAuthed ? (
              <Link href="/dashboard" className="bg-foreground text-background px-4 py-2 hover:bg-neutral-800">
                Open dashboard →
              </Link>
            ) : (
              <>
                <Link href="/login" className="hover:underline underline-offset-4">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="bg-foreground text-background px-4 py-2 hover:bg-neutral-800"
                >
                  Start →
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-hairline relative overflow-hidden">
          <div className="absolute inset-0 gridlines opacity-50 pointer-events-none" />
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 relative">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-6">
              For freelancers, by a freelancer
            </p>
            <h1 className="serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-4xl">
              The paperwork you{" "}
              <em className="text-muted">keep avoiding</em>,
              <br />
              done in a Tuesday afternoon.
            </h1>
            <p className="mt-10 max-w-xl text-lg text-muted leading-relaxed">
              Send invoices that look like they were designed by a human. Snap a
              receipt — Claude reads it for you. Stop pretending QuickBooks is
              going to feel any better next month.
            </p>
            <div className="mt-12 flex items-center gap-4">
              <Link
                href={isAuthed ? "/dashboard" : "/signup"}
                className="bg-foreground text-background px-6 py-3 hover:bg-neutral-800 inline-flex items-center gap-2"
              >
                {isAuthed ? "Open dashboard" : "Sign up — it's free"}
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="#features"
                className="text-sm hover:underline underline-offset-4"
              >
                See what's inside
              </Link>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="border-b border-hairline"
        >
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="grid md:grid-cols-12 gap-12 mb-16">
              <p className="md:col-span-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                Three things, done well
              </p>
              <h2 className="md:col-span-9 serif text-4xl md:text-5xl leading-tight">
                Not 200 features.
                <br />
                The ones you&apos;ll actually use.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-hairline border-y border-hairline">
              <Feature
                kicker="01"
                title="Invoices"
                description="Add a client, list what you did, send a PDF. Pay attention to typography because your clients do too."
              />
              <Feature
                kicker="02"
                title="AI receipts"
                description="Photograph a coffee receipt. Vendor, amount, date — extracted by Claude. Your shoebox of receipts can finally retire."
              />
              <Feature
                kicker="03"
                title="Workspaces"
                description="Each business gets its own clean ledger. Invite a partner if you have one. Otherwise, enjoy the quiet."
              />
            </div>
          </div>
        </section>

        <section className="border-b border-hairline">
          <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7">
              <h2 className="serif text-4xl md:text-5xl leading-tight">
                You probably already have an invoicing tool.
                <br />
                <em className="text-muted">It probably annoys you.</em>
              </h2>
              <p className="mt-6 text-muted max-w-xl">
                Ledger is built for one kind of person: someone who&apos;d rather
                spend an evening reading than configuring tax categories. The
                interface stays out of the way. The AI does the boring parts. You
                send the invoice.
              </p>
            </div>
            <div className="md:col-span-5">
              <Link
                href={isAuthed ? "/dashboard" : "/signup"}
                className="block bg-foreground text-background px-6 py-5 hover:bg-neutral-800 group"
              >
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">
                  Free, no card
                </span>
                <div className="serif text-2xl mt-1 flex items-center justify-between">
                  {isAuthed ? "Open your dashboard" : "Create your workspace"}
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <footer className="max-w-6xl mx-auto px-6 py-10 flex items-center justify-between text-xs font-mono text-muted">
          <div>
            © {new Date().getFullYear()} Ledger
          </div>
          <div>
            Built with Next.js · Prisma · Claude
          </div>
        </footer>
      </main>
    </div>
  );
}

function Feature({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-8">
      <p className="font-mono text-xs text-muted">{kicker}</p>
      <h3 className="serif text-3xl mt-4">{title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}
