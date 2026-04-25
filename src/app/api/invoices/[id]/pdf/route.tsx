import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { requireWorkspace } from "@/lib/session";
import { db } from "@/lib/db";
import { InvoicePdf } from "@/lib/pdf/invoice-pdf";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { organization } = await requireWorkspace();

  const invoice = await db.invoice.findFirst({
    where: { id, organizationId: organization.id },
    include: { client: true, items: true },
  });
  if (!invoice) {
    return new NextResponse("Not found", { status: 404 });
  }

  const buffer = await renderToBuffer(
    <InvoicePdf
      data={{
        number: invoice.number,
        status: invoice.status,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        notes: invoice.notes,
        subtotal: invoice.subtotal,
        taxRate: invoice.taxRate,
        total: invoice.total,
        fromName: organization.name,
        client: {
          name: invoice.client.name,
          email: invoice.client.email,
          address: invoice.client.address,
        },
        items: invoice.items.map((it) => ({
          description: it.description,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          amount: it.amount,
        })),
      }}
    />,
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.number}.pdf"`,
    },
  });
}
