"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireWorkspace } from "@/lib/session";

const itemSchema = z.object({
  description: z.string().min(1),
  quantity: z.coerce.number().min(0),
  unitPrice: z.coerce.number().min(0),
});

const invoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  dueDate: z.string().min(1, "Due date is required"),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1, "At least one line item required"),
});

export type InvoiceActionState = { error?: string } | undefined;

async function nextInvoiceNumber(organizationId: string) {
  const count = await db.invoice.count({ where: { organizationId } });
  return `INV-${String(count + 1).padStart(4, "0")}`;
}

function parseItemsFromFormData(formData: FormData) {
  const descriptions = formData.getAll("itemDescription").map(String);
  const quantities = formData.getAll("itemQuantity").map(String);
  const prices = formData.getAll("itemPrice").map(String);
  return descriptions.map((description, i) => ({
    description,
    quantity: quantities[i] ?? "0",
    unitPrice: prices[i] ?? "0",
  }));
}

export async function createInvoiceAction(
  _prev: InvoiceActionState,
  formData: FormData,
): Promise<InvoiceActionState> {
  const { organization } = await requireWorkspace();

  const parsed = invoiceSchema.safeParse({
    clientId: formData.get("clientId"),
    dueDate: formData.get("dueDate"),
    taxRate: formData.get("taxRate") || 0,
    notes: formData.get("notes") || "",
    items: parseItemsFromFormData(formData),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const client = await db.client.findFirst({
    where: { id: parsed.data.clientId, organizationId: organization.id },
  });
  if (!client) return { error: "Client not found in this workspace" };

  const itemsData = parsed.data.items.map((it) => ({
    description: it.description,
    quantity: it.quantity,
    unitPrice: it.unitPrice,
    amount: it.quantity * it.unitPrice,
  }));
  const subtotal = itemsData.reduce((s, it) => s + it.amount, 0);
  const total = subtotal * (1 + parsed.data.taxRate / 100);

  const number = await nextInvoiceNumber(organization.id);

  const invoice = await db.invoice.create({
    data: {
      number,
      status: "draft",
      dueDate: new Date(parsed.data.dueDate),
      notes: parsed.data.notes,
      taxRate: parsed.data.taxRate,
      subtotal,
      total,
      clientId: parsed.data.clientId,
      organizationId: organization.id,
      items: { create: itemsData },
    },
  });

  revalidatePath("/invoices");
  redirect(`/invoices/${invoice.id}`);
}

export async function updateInvoiceStatusAction(formData: FormData) {
  const { organization } = await requireWorkspace();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!["draft", "sent", "paid", "overdue"].includes(status)) return;

  await db.invoice.updateMany({
    where: { id, organizationId: organization.id },
    data: { status },
  });

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${id}`);
}

export async function deleteInvoiceAction(formData: FormData) {
  const { organization } = await requireWorkspace();
  const id = String(formData.get("id"));
  await db.invoice.deleteMany({ where: { id, organizationId: organization.id } });
  revalidatePath("/invoices");
  redirect("/invoices");
}
