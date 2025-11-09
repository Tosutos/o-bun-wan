export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';

// System prompt (role + constraints)
// - Edit below or override with env OPENAI_SYSTEM_PROMPT
const DEFAULT_SYSTEM_PROMPT = [
  '역할: 초등학생이 이해하기 쉬운 한국어로 분리수거를 안내하는 도우미입니다.',
  '톤: 친절하고 간결하며, 안전을 최우선으로 합니다.',
  '지침:',
  ' - 질문에만 답하고 과장하지 않습니다.',
  ' - 항상 단계별(3~5단계)로 단계를 제시할땐 줄바꿈하여 간단히 정리합니다.',
  ' - 필요한 경우 안전 주의(1~2개)를 알게 하도록 질문을 유도합니다.',
  ' - 재사용/업사이클 아이디어(1~2개)를 알게 하도록 질문을 유도합니다.',
  ' - 초등학생 교육과정 외의 용어는 사용하지 않습니다.',
  '형식 예시:',
  '  1) 분류 단계: 1단계 … 2단계 … 3단계 …',
  '  2) 안전 주의: …를 주의하세요.',
  '  3) 재사용/업사이클: …를 …으로 재사용할 수 있어요.',
].join('\n');

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OPENAI_API_KEY missing' }, { status: 501 });
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const messages = (body?.messages ?? []) as Array<{ role: 'user' | 'assistant'; content: string }>;
  const systemPrompt = (process.env.OPENAI_SYSTEM_PROMPT?.trim()?.length
    ? process.env.OPENAI_SYSTEM_PROMPT
    : DEFAULT_SYSTEM_PROMPT) as string;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const temperature = Number.isFinite(Number(process.env.OPENAI_TEMPERATURE))
      ? Number(process.env.OPENAI_TEMPERATURE)
      : 0.5;

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      const errTxt = await resp.text().catch(() => '');
      throw new Error(`OpenAI error ${resp.status}: ${errTxt}`);
    }

    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content?.trim() || '도와드릴게요! 무엇이 궁금한가요?';
    return NextResponse.json({ reply: text });
  } catch (e: any) {
    const msg = e?.name === 'AbortError'
      ? '요청이 시간 초과되었습니다. 잠시 후 다시 시도해주세요.'
      : String(e?.message || e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

