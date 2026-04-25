import Link from "next/link";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="block text-center font-semibold text-lg tracking-tight mb-10 hover:opacity-70 transition"
        >
          Folio
        </Link>
        <div className="card p-8">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">
            Pick up where you left off.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-accent font-medium hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
