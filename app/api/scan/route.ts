import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const { ocrText, persona, metrics } = await req.json();

  if (!ocrText || ocrText.trim().length < 10) {
    return NextResponse.json({ error: 'Insufficient OCR text' }, { status: 400 });
  }

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    system: `You are Ai Glow's scan analyzer. Parse ingredient lists from OCR text and analyze for the given skin persona. Never invent ingredients — only use what's in the OCR text. Output JSON:
{"product_name": string|null, "match_score": 0-100, "verdict": string (≤200 chars), "meta": {"ph": string, "fragrance": string, "alcohol": string, "actives": string}, "ingredients": [{"name": string, "reason": string (≤80 chars), "tone": "good"|"neutral"|"warn"}]}`,
    messages: [{
      role: 'user',
      content: `OCR text: "${ocrText}"\nPersona: ${persona}\nMetrics: ${JSON.stringify(metrics)}\nAnalyze this product.`,
    }],
  });

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '';
  try {
    const data = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Parse failed', raw: text }, { status: 500 });
  }
}
