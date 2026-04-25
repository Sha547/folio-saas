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

        {/* Big-card row */}
        <section id="features" className="mt-24 grid grid-cols-12 gap-4">
          {/* Invoices showcase */}
          <div
            className="col-span-12 md:col-span-7 card p-8 flex flex-col gap-8"
            style={{ background: "linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)" }}
          >
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-accent mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Invoicing
              </div>
              <h3 className="text-3xl font-semibold tracking-tight leading-tight">
                Send invoices that actually look professional.
              </h3>
              <p className="mt-3 text-muted max-w-md">
                Auto-numbered. Tax-aware. PDF in one click. Status moves from
                draft → sent → paid as you work.
              </p>
            </div>
            <div className="flex items-end justify-between gap-6 mt-auto">
              <div className="space-y-1.5 text-sm">
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

          {/* AI receipts */}
          <div
            className="col-span-12 md:col-span-5 card p-8 text-white flex flex-col gap-8"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}
          >
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-white/80 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                AI Receipts
              </div>
              <h3 className="text-3xl font-semibold tracking-tight">
                Snap. Done.
              </h3>
              <p className="mt-3 text-white/80">
                Upload a receipt photo. Claude reads the vendor, amount, date,
                and category. You confirm. Move on with your day.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm flex-wrap mt-auto">
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur">
                Photo
              </span>
              <span aria-hidden>→</span>
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur font-mono text-xs">
                {`{ vendor, amount }`}
              </span>
            </div>
          </div>
        </section>

        {/* Small-card row */}
        <section className="mt-4 grid grid-cols-12 gap-4">
          <SmallCard
            title="Multiple workspaces"
            description="One business or many. Each gets its own clean set of books."
            iconBg="bg-blue-100"
            iconFg="text-accent"
            iconPath="M16 11a4 4 0 10-8 0 4 4 0 008 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
          <SmallCard
            title="PDF in one click"
            description="Branded, tidy, ready to email. No manual formatting."
            iconBg="bg-amber-100"
            iconFg="text-amber-600"
            iconPath="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
          <SmallCardGradient
            title="Free to start"
            description="No credit card. Sign up in 30 seconds."
            gradient="linear-gradient(135deg, #00875a 0%, #10b981 100%)"
          />
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

function SmallCard({
  title,
  description,
  iconBg,
  iconFg,
  iconPath,
}: {
  title: string;
  description: string;
  iconBg: string;
  iconFg: string;
  iconPath: string;
}) {
  return (
    <div className="col-span-12 sm:col-span-6 md:col-span-4 card p-6">
      <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconFg} flex items-center justify-center mb-4`}>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d={iconPath} />
        </svg>
      </div>
      <h3 className="font-semibold text-lg tracking-tight">{title}</h3>
      <p className="text-sm text-muted mt-1">{description}</p>
    </div>
  );
}

function SmallCardGradient({
  title,
  description,
  gradient,
}: {
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div
      className="col-span-12 sm:col-span-6 md:col-span-4 card p-6 text-white"
      style={{ background: gradient }}
    >
      <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center mb-4">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
        </svg>
      </div>
      <h3 className="font-semibold text-lg tracking-tight">{title}</h3>
      <p className="text-sm text-white/80 mt-1">{description}</p>
    </div>
  );
}
