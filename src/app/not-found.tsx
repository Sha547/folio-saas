import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="card p-12 text-center max-w-md w-full">
        <p className="text-xs font-semibold text-accent uppercase tracking-wider">
          404
        </p>
        <h1 className="text-3xl font-bold tracking-tight mt-2">
          Page not found
        </h1>
        <p className="mt-3 text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-accent hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-full font-medium transition"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
