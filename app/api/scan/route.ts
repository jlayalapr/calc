import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: Request) {
  const { imageBase64, persona, metrics } = await req.json();

  if (!imageBase64 || imageBase64.length < 100) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }

  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: `You are Ai Glow's product scan analyzer. Look at the skincare product image and identify the product and its ingredients. Analyze ingredient suitability for the given skin persona. Output ONLY valid JSON, no markdown:
{"product_name": string, "brand": string, "type": "Serum"|"Moisturizer"|"Cleanser"|"Sunscreen"|"Exfoliant"|"Toner"|"Eye Cream"|"Oil"|"Other", "size": string, "tag": string (≤20 chars), "steps": ["AM"|"PM"], "match_score": 0-100, "verdict": string (≤200 chars), "meta": {"ph": string, "fragrance": "Free"|"Low"|"Moderate"|"High", "alcohol": "None"|"Low"|"Present", "actives": string}, "ingredients": [{"name": string, "reason": string (≤80 chars), "tone": "good"|"neutral"|"warn"}]}
If you cannot identify the product clearly, still provide best-guess values based on what you can see.`,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: 'image/jpeg', data: base64Data },
        },
        {
          type: 'text',
          text: `Skin persona: ${persona}\nSkin metrics: ${JSON.stringify(metrics)}\nAnalyze this skincare product and return the JSON.`,
        },
      ],
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
