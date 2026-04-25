"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/session";
import { saveLocalFile } from "@/lib/storage";

const expenseSchema = z.object({
  vendor: z.string().min(1, "Vendor is required").max(120),
  amount: z.coerce.number().min(0, "Amount must be 0 or more"),
  date: z.string().min(1, "Date is required"),
  category: z.string().max(60).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export type ExpenseActionState = { error?: string } | undefined;

export async function createExpenseAction(
  _prev: ExpenseActionState,
  formData: FormData,
): Promise<ExpenseActionState> {
  const { organization } = await requireWorkspace();

  const parsed = expenseSchema.safeParse({
    vendor: formData.get("vendor"),
    amount: formData.get("amount"),
    date: formData.get("date"),
    category: formData.get("category"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  let receiptKey: string | null = null;
  const receipt = formData.get("receipt");
  if (receipt instanceof File && receipt.size > 0) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    if (!allowed.includes(receipt.type)) {
      return { error: "Unsupported receipt type. Use JPG, PNG, WebP, GIF, or PDF." };
    }
    if (receipt.size > 10 * 1024 * 1024) {
      return { error: "Receipt must be under 10MB" };
    }
    const saved = await saveLocalFile(receipt);
    receiptKey = saved.key;
  }

  await db.expense.create({
    data: {
      vendor: parsed.data.vendor,
      amount: parsed.data.amount,
      category: parsed.data.category || null,
      date: new Date(parsed.data.date),
      notes: parsed.data.notes || null,
      receiptKey,
      organizationId: organization.id,
    },
  });

  revalidatePath("/expenses");
  redirect("/expenses");
}

export async function deleteExpenseAction(formData: FormData) {
  const { organization } = await requireWorkspace();
  const id = String(formData.get("id"));
  await db.expense.deleteMany({ where: { id, organizationId: organization.id } });
  revalidatePath("/expenses");
}
