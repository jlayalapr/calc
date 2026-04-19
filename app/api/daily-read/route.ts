import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const { persona, metrics } = await req.json();

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    system: `You are Ai Glow's skincare reader. Voice: warm, editorial, like a thoughtful friend who knows dermatology. No corporate wellness clichés. Output JSON only:
{"hero": string (≤80 chars, no emojis), "tip": string (≤180 chars), "hydration": 0-100, "barrier": 0-100, "tone": 0-100}`,
    messages: [{
      role: 'user',
      content: `Persona: ${persona}\nMetrics: ${JSON.stringify(metrics)}\nGenerate today's morning skin read.`,
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
