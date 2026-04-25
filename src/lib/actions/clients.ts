"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/session";

const clientSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
});

export type ClientActionState = { error?: string } | undefined;

export async function createClientAction(
  _prev: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const { organization } = await requireWorkspace();

  const parsed = clientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    address: formData.get("address"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db.client.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email || null,
      address: parsed.data.address || null,
      organizationId: organization.id,
    },
  });

  revalidatePath("/clients");
  redirect("/clients");
}

export async function deleteClientAction(formData: FormData) {
  const { organization } = await requireWorkspace();
  const id = String(formData.get("id"));
  await db.client.deleteMany({ where: { id, organizationId: organization.id } });
  revalidatePath("/clients");
}
