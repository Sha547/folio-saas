import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { requireWorkspace } from "@/lib/session";

const ReceiptSchema = z.object({
  vendor: z.string().nullable(),
  amount: z.number().nullable(),
  date: z.string().nullable().describe("ISO 8601 date (YYYY-MM-DD)"),
  category: z
    .enum(["Food", "Travel", "Office", "Software", "Marketing", "Other"])
    .nullable(),
});

const SYSTEM_PROMPT = `You are a receipt data extractor. Given an image of a receipt, extract:
- vendor: the business name (e.g. "Starbucks", "Uber")
- amount: the final total in dollars as a number (no currency symbol)
- date: the transaction date as YYYY-MM-DD
- category: one of Food, Travel, Office, Software, Marketing, Other

If a field is not visible or ambiguous, return null for it. Do not guess.`;

export async function POST(req: Request) {
  await requireWorkspace();

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "AI parsing not configured. Set ANTHROPIC_API_KEY in .env." },
      { status: 503 },
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported image type. Use JPEG, PNG, WebP, or GIF." },
      { status: 400 },
    );
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be under 10MB" }, { status: 400 });
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

  const client = new Anthropic();

  try {
    const response = await client.messages.parse({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      output_config: { format: zodOutputFormat(ReceiptSchema) },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
                data: base64,
              },
            },
            {
              type: "text",
              text: "Extract the receipt data from this image.",
            },
          ],
        },
      ],
    });

    if (!response.parsed_output) {
      return NextResponse.json(
        { error: "Could not extract data. Please enter manually." },
        { status: 422 },
      );
    }

    return NextResponse.json({ data: response.parsed_output });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Rate limited. Try again in a moment." }, { status: 429 });
    }
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `AI service error: ${err.message}` },
        { status: 502 },
      );
    }
    throw err;
  }
}
