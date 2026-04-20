import { createClient } from '@supabase/supabase-js'

const noStoreFetch: typeof fetch = (input, init) => {
  return fetch(input, {
    ...init,
    cache: 'no-store',
    next: { revalidate: 0 },
  } as RequestInit & { next: { revalidate: 0 } })
}

export function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: { fetch: noStoreFetch },
    }
  )
}

export async function buildDsuMessage(): Promise<string> {
  const sb = db()

  const [
    { data: chapters },
    { data: tasks },
    { data: risks },
    { data: kpis },
  ] = await Promise.all([
    sb.from('chapters').select('name, number, status, progress_percent, date_text').order('number'),
    sb.from('chapter_tasks').select('id, chapter_id, owner, description, status').neq('status', 'done'),
    sb.from('risks').select('code, title, owner, severity, status').eq('status', 'open').order('code'),
    sb.from('kpis').select('key, value'),
  ])

  const kpiMap = Object.fromEntries((kpis ?? []).map(k => [k.key, k.value]))

  const now = new Date().toLocaleDateString('en-PH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'Asia/Manila',
  })

  const kpiBlock = [
    `• Code Camps: <b>${kpiMap['code_camps'] ?? '–'}</b>`,
    `• Form Submissions: <b>${kpiMap['form_submissions'] ?? '–'}</b>`,
    `• Mentors Trained: <b>${kpiMap['trained_mentors'] ?? '–'}</b>`,
    `• Deployments: <b>${kpiMap['confirmed_deployments'] ?? '–'}</b>`,
    `• Completion Rate: <b>${kpiMap['completion_rate'] ?? '–'}</b>`,
    `• Labs Activated: <b>${kpiMap['computer_labs'] ?? '–'}</b>`,
  ].join('\n')

  const statusIcon: Record<string, string> = {
    completed: '✅', rescheduling: '⚠️', in_progress: '🔄',
    pencil_booked: '📌', tbc: '🟣', activating: '🟡',
  }

  const chapterBlock = (chapters ?? [])
    .map(c => {
      const date = c.status === 'completed' ? 'Done' : c.date_text
      return `${statusIcon[c.status] ?? '•'} Ch${c.number} <b>${c.name}</b> — ${date} (${c.progress_percent}%)`
    })
    .join('\n')

  // Defensive dedupe: prevent repeated DSU lines if duplicate rows exist.
  const uniqueOpenTasks = Array.from(new Map(
    (tasks ?? []).map(t => [
      `${t.chapter_id}|${t.owner.trim().toLowerCase()}|${t.description.trim().toLowerCase()}|${t.status}`,
      t,
    ])
  ).values())

  const uniqueOpenRisks = Array.from(new Map(
    (risks ?? []).map(r => [`${r.code.trim().toUpperCase()}|${r.status}`, r])
  ).values())

  const urgentTasks = uniqueOpenTasks.filter(t => t.status === 'urgent')
  const openTasks = uniqueOpenTasks

  const urgentBlock = urgentTasks.length
    ? urgentTasks.map(t => `🔴 <b>${t.owner}</b> [${t.chapter_id}]: ${t.description}`).join('\n')
    : '  None'

  const highRisks = uniqueOpenRisks.filter(r => r.severity === 'high')
  const sevIcon: Record<string, string> = { high: '🔴', medium: '🟡', low: '🟢' }

  const risksBlock = highRisks.length
    ? highRisks.map(r => `${sevIcon[r.severity]} <b>${r.code}</b>: ${r.title} — ${r.owner}`).join('\n')
    : '  No high risks'

  return `<b>📝 DEVCON × Sui — Morning DSU</b>
<i>${now}</i>
━━━━━━━━━━━━━━━━━━━━

<b>📊 KPIs</b>
${kpiBlock}

<b>🏕 Chapter Progress</b>
${chapterBlock}

<b>✅ Urgent Tasks</b> (${urgentTasks.length} urgent · ${openTasks.length} total open)
${urgentBlock}

<b>⚠️ High Risks</b> (${uniqueOpenRisks.length} total open)
${risksBlock}

<i>Use /tasks, /risks, or /chapter [id] for details.</i>`
}
