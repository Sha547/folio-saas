import Link from "next/link";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="serif text-2xl">
            Ledger
          </Link>
          <Link href="/signup" className="text-sm hover:underline underline-offset-4">
            No account? <span className="font-medium">Sign up →</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            Returning
          </p>
          <h1 className="serif text-4xl leading-tight">
            Welcome back.
          </h1>
          <p className="mt-3 text-muted">
            Pick up where you left off.
          </p>
          <div className="mt-10">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
