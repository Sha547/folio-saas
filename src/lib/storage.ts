import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const uploadsDir = path.join(process.cwd(), "uploads");

async function ensureDir() {
  await fs.mkdir(uploadsDir, { recursive: true });
}

function sanitizeExt(filename: string) {
  const ext = path.extname(filename).toLowerCase();
  if (/^\.(jpg|jpeg|png|webp|gif|pdf)$/.test(ext)) return ext;
  return "";
}

export async function saveLocalFile(file: File): Promise<{
  key: string;
  contentType: string;
  bytes: number;
}> {
  await ensureDir();
  const ext = sanitizeExt(file.name);
  const key = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadsDir, key), buffer);
  return { key, contentType: file.type, bytes: buffer.length };
}

export async function readLocalFile(key: string): Promise<{
  buffer: Buffer;
  contentType: string;
} | null> {
  if (key.includes("/") || key.includes("..")) return null;
  try {
    const buffer = await fs.readFile(path.join(uploadsDir, key));
    const ext = path.extname(key).toLowerCase();
    const contentType =
      ext === ".png"
        ? "image/png"
        : ext === ".webp"
          ? "image/webp"
          : ext === ".gif"
            ? "image/gif"
            : ext === ".pdf"
              ? "application/pdf"
              : "image/jpeg";
    return { buffer, contentType };
  } catch {
    return null;
  }
}
