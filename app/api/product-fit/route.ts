import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const { product, persona, metrics } = await req.json();

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    system: `You are Ai Glow's ingredient analyst. Be specific and never invent ingredients. Voice: warm, direct. Output JSON only:
{"match_score": 0-100, "verdict": string (≤200 chars), "ingredients": [{"name": string, "reason": string (≤80 chars), "tone": "good"|"neutral"|"warn"}]}`,
    messages: [{
      role: 'user',
      content: `Product: ${product.name} by ${product.brand}\nIngredients: ${JSON.stringify(product.ingredients ?? [])}\nPersona: ${persona}\nMetrics: ${JSON.stringify(metrics)}\nAnalyze fit.`,
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
