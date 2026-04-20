import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { noStore } from 'next/cache'
import { buildDsuInlineKeyboard, buildDsuMessage } from '@/lib/telegram/dsu'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function getManilaDateKey() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const year = parts.find(p => p.type === 'year')?.value ?? '0000'
  const month = parts.find(p => p.type === 'month')?.value ?? '00'
  const day = parts.find(p => p.type === 'day')?.value ?? '00'

  return `${year}-${month}-${day}`
}

async function getSettings() {
  const supabase = db()
  const { data } = await supabase.from('bot_settings').select('key, value')
  const map: Record<string, string> = {}
  for (const row of (data ?? [])) map[row.key] = row.value

  return {
    token: map['telegram_bot_token'] ?? process.env.TELEGRAM_BOT_TOKEN ?? '',
    chatId: map['telegram_chat_id'] ?? process.env.TELEGRAM_CHAT_ID ?? '',
    autoStandup: (map['auto_standup'] ?? 'true') === 'true',
  }
}

async function tryAcquireDailySendLock(dateKey: string) {
  const supabase = db()
  const { error } = await supabase.from('bot_settings').insert({
    key: `dsu_sent_${dateKey}`,
    value: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  if (!error) return { acquired: true as const }
  if (error.code === '23505') return { acquired: false as const }

  return { acquired: false as const, error: error.message }
}

async function releaseDailySendLock(dateKey: string) {
  const supabase = db()
  await supabase.from('bot_settings').delete().eq('key', `dsu_sent_${dateKey}`)
}

function isAuthorizedCronRequest(req: Request) {
  const expected = process.env.CRON_SECRET
  if (!expected) return true

  const auth = req.headers.get('authorization')
  if (auth === `Bearer ${expected}`) return true

  const url = new URL(req.url)
  return url.searchParams.get('secret') === expected
}

export async function GET(req: Request) {
  noStore()

  if (!isAuthorizedCronRequest(req)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { token, chatId, autoStandup } = await getSettings()
  if (!autoStandup) return NextResponse.json({ ok: true, skipped: 'auto_standup_disabled' })
  if (!token) return NextResponse.json({ ok: false, error: 'No bot token configured' }, { status: 400 })
  if (!chatId) return NextResponse.json({ ok: false, error: 'No chat ID configured' }, { status: 400 })

  const dateKey = getManilaDateKey()
  const lock = await tryAcquireDailySendLock(dateKey)
  if (!lock.acquired) {
    if ('error' in lock) {
      return NextResponse.json({ ok: false, error: lock.error }, { status: 500 })
    }
    return NextResponse.json({ ok: true, skipped: 'already_sent_today' })
  }

  const text = await buildDsuMessage()

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      reply_markup: buildDsuInlineKeyboard(),
    }),
  })

  const result = await res.json()

  if (!result.ok) {
    await releaseDailySendLock(dateKey)
    return NextResponse.json({ error: result.description }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
