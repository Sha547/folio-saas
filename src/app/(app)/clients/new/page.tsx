import { requireWorkspace } from "@/lib/session";
import NewClientForm from "./new-client-form";

export default async function NewClientPage() {
  await requireWorkspace();
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New client</h1>
        <p className="text-sm text-gray-500 mt-1">
          You&apos;ll be able to send invoices to this client.
        </p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
        <NewClientForm />
      </div>
    </div>
  );
}
