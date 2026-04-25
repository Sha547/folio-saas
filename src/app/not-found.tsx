import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          404
        </p>
        <h1 className="serif text-6xl mt-4">Nothing here.</h1>
        <p className="mt-4 text-muted">
          The page you&apos;re after doesn&apos;t exist, or it moved without
          leaving a forwarding address.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block bg-foreground text-background px-5 py-3 hover:bg-neutral-800"
        >
          Go home →
        </Link>
      </div>
    </div>
  );
}
