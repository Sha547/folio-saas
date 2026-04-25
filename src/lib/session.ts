import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user as { id: string; email?: string | null; name?: string | null };
}

export async function requireWorkspace() {
  const user = await requireUser();
  const membership = await db.membership.findFirst({
    where: { userId: user.id },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });
  if (!membership) redirect("/login");
  return { user, organization: membership.organization, role: membership.role };
}
