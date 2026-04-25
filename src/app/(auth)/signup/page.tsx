import Link from "next/link";
import SignupForm from "./signup-form";

export default function SignupPage() {
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
          <h1 className="text-2xl font-bold tracking-tight">
            Create your workspace
          </h1>
          <p className="mt-1 text-sm text-muted">
            Free to start, no credit card required.
          </p>
          <div className="mt-8">
            <SignupForm />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-accent font-medium hover:underline underline-offset-4"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
