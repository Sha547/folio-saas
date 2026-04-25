import Link from "next/link";
import SignupForm from "./signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="serif text-2xl">
            Ledger
          </Link>
          <Link href="/login" className="text-sm hover:underline underline-offset-4">
            Have an account? <span className="font-medium">Log in →</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            New here
          </p>
          <h1 className="serif text-4xl leading-tight">
            Set up your ledger.
          </h1>
          <p className="mt-3 text-muted">
            One workspace, ready in about thirty seconds.
          </p>
          <div className="mt-10">
            <SignupForm />
          </div>
          <p className="mt-8 text-xs text-muted">
            By continuing you agree to behave reasonably. No fine print yet.
          </p>
        </div>
      </main>
    </div>
  );
}
