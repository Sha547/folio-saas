import { NextResponse } from "next/server";
import { requireWorkspace } from "@/lib/session";
import { readLocalFile } from "@/lib/storage";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  await requireWorkspace();
  const { key } = await params;
  const file = await readLocalFile(key);
  if (!file) return new NextResponse("Not found", { status: 404 });
  return new NextResponse(new Uint8Array(file.buffer), {
    headers: {
      "Content-Type": file.contentType,
      "Cache-Control": "private, max-age=300",
    },
  });
}
