import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const { persona, period, steps, metrics } = await req.json();

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 200,
    system: `You are Ai Glow's AI Coach. Give one concise, actionable skincare tip in quotes. Voice: warm, knowledgeable friend. Output JSON: {"quote": string (≤160 chars, in quotes with curly quotes)}`,
    messages: [{
      role: 'user',
      content: `Persona: ${persona}\nRoutine period: ${period}\nSteps: ${steps.map((s: { step: string; product: string }) => `${s.step}: ${s.product}`).join(', ')}\nMetrics: ${JSON.stringify(metrics)}\nGive a tip for this routine.`,
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
