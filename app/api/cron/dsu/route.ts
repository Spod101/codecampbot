import { NextResponse } from 'next/server'
import { buildDsuMessage } from '@/lib/telegram/dsu'

const TOKEN   = process.env.TELEGRAM_BOT_TOKEN!
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!

export async function GET() {
  const text = await buildDsuMessage()

  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' }),
  })

  const result = await res.json()

  if (!result.ok) {
    return NextResponse.json({ error: result.description }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
