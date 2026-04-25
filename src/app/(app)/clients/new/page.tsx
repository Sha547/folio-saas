import { requireWorkspace } from "@/lib/session";
import NewClientForm from "./new-client-form";

export default async function NewClientPage() {
  await requireWorkspace();
  return (
    <div className="max-w-xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
        New
      </p>
      <h1 className="serif text-5xl">Add a client.</h1>
      <p className="mt-3 text-muted">
        Just a name is enough. You can add the rest later.
      </p>
      <div className="mt-12">
        <NewClientForm />
      </div>
    </div>
  );
}
