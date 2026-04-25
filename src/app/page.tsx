import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const isAuthed = Boolean(session?.user);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg tracking-tight">
            Folio
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            {isAuthed ? (
              <Link
                href="/dashboard"
                className="bg-accent hover:bg-[var(--accent-hover)] text-white px-5 py-2 rounded-full font-medium transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-foreground/80 hover:text-foreground px-4 py-2 rounded-full hover:bg-foreground/5 transition"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="bg-foreground hover:bg-foreground/90 text-background px-5 py-2 rounded-full font-medium transition"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero */}
        <section className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Now with AI receipt scanning
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-[-0.04em] leading-[1.05]">
            Invoices and expenses,
            <br />
            <span className="text-muted">made beautifully simple.</span>
          </h1>
          <p className="mt-8 text-lg text-muted max-w-xl mx-auto leading-relaxed">
            Send professional invoices in seconds. Snap a photo of any receipt
            and AI fills in the details automatically.
          </p>
          <div className="mt-10 flex items-center gap-3 justify-center">
            <Link
              href={isAuthed ? "/dashboard" : "/signup"}
              className="bg-accent hover:bg-[var(--accent-hover)] text-white px-8 py-3.5 rounded-full font-medium transition shadow-lg shadow-accent/20"
            >
              {isAuthed ? "Open dashboard" : "Start free →"}
            </Link>
            <Link
              href="#features"
              className="text-foreground/80 hover:text-foreground px-6 py-3.5 rounded-full hover:bg-foreground/5 font-medium transition"
            >
              See features
            </Link>
          </div>
        </section>

        {/* Bento grid */}
        <section id="features" className="mt-24 bento auto-rows-[180px]">
          {/* Big card — invoices */}
          <div className="col-span-12 md:col-span-7 row-span-2 card p-8 gradient-surface flex flex-col justify-between overflow-hidden relative">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-accent mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Invoicing
              </div>
              <h3 className="text-3xl font-semibold tracking-tight">
                Send invoices that
                <br />
                actually look professional.
              </h3>
              <p className="mt-3 text-muted max-w-md">
                Auto-numbered. Tax-aware. PDF in one click. Status moves from
                draft → sent → paid as you work.
              </p>
            </div>
            <div className="flex items-end justify-between gap-6">
              <div className="space-y-2 text-sm">
                <Row label="Subtotal" value="$1,000.00" />
                <Row label="Tax (10%)" value="$100.00" />
                <Row label="Total" value="$1,100.00" bold />
              </div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Paid
              </span>
            </div>
          </div>

          {/* AI receipts — gradient card */}
          <div className="col-span-12 md:col-span-5 row-span-2 card p-8 gradient-violet text-white flex flex-col justify-between overflow-hidden">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-white/80 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                AI Receipts
              </div>
              <h3 className="text-3xl font-semibold tracking-tight">
                Snap. Done.
              </h3>
              <p className="mt-3 text-white/80 max-w-sm">
                Upload a receipt photo. Claude reads the vendor, amount, date,
                and category. You confirm. Move on with your day.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur">
                📸 Photo
              </span>
              <span>→</span>
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur font-mono text-xs">
                {`{ vendor, amount }`}
              </span>
            </div>
          </div>

          {/* Workspaces */}
          <div className="col-span-12 md:col-span-4 card p-6">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-semibold text-lg tracking-tight">
              Multiple workspaces
            </h3>
            <p className="text-sm text-muted mt-1">
              One business or many. Each gets its own clean set of books.
            </p>
          </div>

          {/* PDF */}
          <div className="col-span-12 md:col-span-4 card p-6">
            <div className="text-3xl mb-2">📄</div>
            <h3 className="font-semibold text-lg tracking-tight">
              PDF in one click
            </h3>
            <p className="text-sm text-muted mt-1">
              Branded, tidy, ready to email. No manual formatting.
            </p>
          </div>

          {/* Free */}
          <div className="col-span-12 md:col-span-4 card p-6 gradient-emerald text-white">
            <div className="text-3xl mb-2">✦</div>
            <h3 className="font-semibold text-lg tracking-tight">
              Free to start
            </h3>
            <p className="text-sm text-white/80 mt-1">
              No credit card. Sign up in 30 seconds.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 card p-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em]">
            Ready when you are.
          </h2>
          <p className="mt-4 text-muted max-w-md mx-auto">
            Stop hand-formatting Word docs. Send your first invoice in minutes.
          </p>
          <Link
            href={isAuthed ? "/dashboard" : "/signup"}
            className="mt-8 inline-block bg-accent hover:bg-[var(--accent-hover)] text-white px-8 py-3.5 rounded-full font-medium transition shadow-lg shadow-accent/20"
          >
            {isAuthed ? "Open dashboard" : "Create your workspace →"}
          </Link>
        </section>

        <footer className="mt-20 py-8 flex items-center justify-between text-sm text-muted">
          <div>© {new Date().getFullYear()} Folio</div>
          <div className="font-mono text-xs">
            Next.js · Prisma · Claude
          </div>
        </footer>
      </main>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between gap-8 ${bold ? "font-semibold border-t border-border/60 pt-2" : "text-muted"}`}>
      <span>{label}</span>
      <span className="font-mono tabular">{value}</span>
    </div>
  );
}
