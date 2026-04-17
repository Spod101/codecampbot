import { createClient } from '@supabase/supabase-js'
import { buildDsuMessage } from '@/lib/telegram/dsu'

// Service-role client — bypasses RLS for server-side writes
function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!

type InlineKeyboardButton = { text: string; callback_data: string }
type InlineKeyboardMarkup = { inline_keyboard: InlineKeyboardButton[][] }

type PageView = 'status' | 'tasks' | 'risks' | 'kpis'

type TgMessage = {
  message_id: number
  text?: string
  chat: { id: number }
}

type TgCallbackQuery = {
  id: string
  data?: string
  message?: TgMessage
}

type TgUpdate = {
  message?: TgMessage
  edited_message?: TgMessage
  callback_query?: TgCallbackQuery
}

const PAGE_SIZE = 5

async function send(chatId: number, text: string, replyMarkup?: InlineKeyboardMarkup) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    }),
  })
}

async function editMessage(chatId: number, messageId: number, text: string, replyMarkup?: InlineKeyboardMarkup) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/editMessageText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    }),
  })
}

async function answerCallbackQuery(callbackQueryId: string) {
  await fetch(`https://api.telegram.org/bot${TOKEN}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackQueryId }),
  })
}

function encodeFilter(filter?: string) {
  if (!filter) return '-'
  return filter.toLowerCase().slice(0, 20).replace(/[|]/g, '') || '-'
}

function decodeFilter(filter: string) {
  return filter === '-' ? '' : filter
}

function callbackPayload(view: PageView, page: number, filter?: string) {
  return `pg|${view}|${encodeFilter(filter)}|${page}`
}

function parseCallbackPayload(data: string): { view: PageView; page: number; filter: string } | null {
  const parts = data.split('|')
  if (parts.length !== 4 || parts[0] !== 'pg') return null

  const view = parts[1] as PageView
  if (!['status', 'tasks', 'risks', 'kpis'].includes(view)) return null

  const page = Number.parseInt(parts[3], 10)
  if (!Number.isFinite(page) || page < 0) return null

  return {
    view,
    page,
    filter: decodeFilter(parts[2]),
  }
}

function pagerMarkup(view: PageView, page: number, totalPages: number, filter?: string): InlineKeyboardMarkup | undefined {
  if (totalPages <= 1) return undefined

  const prevPage = Math.max(0, page - 1)
  const nextPage = Math.min(totalPages - 1, page + 1)

  return {
    inline_keyboard: [[
      { text: '⬅️ Prev', callback_data: callbackPayload(view, prevPage, filter) },
      { text: `${page + 1}/${totalPages}`, callback_data: callbackPayload(view, page, filter) },
      { text: 'Next ➡️', callback_data: callbackPayload(view, nextPage, filter) },
    ]],
  }
}

function paginateLines(lines: string[], page: number) {
  const totalPages = Math.max(1, Math.ceil(lines.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(page, 0), totalPages - 1)
  const start = safePage * PAGE_SIZE
  const end = start + PAGE_SIZE

  return {
    page: safePage,
    totalPages,
    lines: lines.slice(start, end),
  }
}

async function sendOrEdit(
  chatId: number,
  text: string,
  replyMarkup: InlineKeyboardMarkup | undefined,
  editTarget?: { messageId: number }
) {
  if (editTarget) {
    await editMessage(chatId, editTarget.messageId, text, replyMarkup)
    return
  }

  await send(chatId, text, replyMarkup)
}

// ─── Entry point ────────────────────────────────────────────────────────────

export async function handleUpdate(update: unknown) {
  const tgUpdate = (update ?? {}) as TgUpdate
  const cb = tgUpdate.callback_query
  if (cb?.data && cb?.id && cb?.message?.chat?.id && cb?.message?.message_id) {
    await handleCallbackQuery(cb)
    return
  }

  const msg = tgUpdate.message ?? tgUpdate.edited_message
  if (!msg?.text) return

  const chatId: number = msg.chat.id
  const raw: string = msg.text.trim()

  // Parse /command[@BotUsername] rest
  const m = raw.match(/^\/([a-z_]+)(?:@\S+)?(?:\s+([\s\S]*))?$/i)
  if (!m) return

  const cmd = m[1].toLowerCase()
  const rest = (m[2] ?? '').trim()

  try {
    switch (cmd) {
      case 'start':
      case 'help':      return await cmdHelp(chatId)
      case 'standup':   return await cmdStandup(chatId)
      case 'status':    return await cmdStatus(chatId)
      case 'tasks':     return await cmdTasks(chatId, rest)
      case 'risks':     return await cmdRisks(chatId, rest)
      case 'chapter':   return await cmdChapter(chatId, rest)
      case 'kpis':      return await cmdKpis(chatId)
      case 'addtask':   return await cmdAddTask(chatId, rest)
      case 'done':      return await cmdDoneTask(chatId, rest)
      case 'urgent':    return await cmdUrgentTask(chatId, rest)
      case 'addrisk':   return await cmdAddRisk(chatId, rest)
      case 'resolve':   return await cmdResolveRisk(chatId, rest)
      case 'setkpi':    return await cmdSetKpi(chatId, rest)
      default:          return await send(chatId, 'Unknown command. Use /help.')
    }
  } catch (err) {
    console.error('[TelegramBot]', err)
    await send(chatId, `⚠️ ${err instanceof Error ? err.message : 'Unexpected error'}`)
  }
}

async function handleCallbackQuery(cb: TgCallbackQuery) {
  if (!cb.data || !cb.message) {
    await answerCallbackQuery(cb.id)
    return
  }

  const payload = parseCallbackPayload(cb.data)
  if (!payload) {
    await answerCallbackQuery(cb.id)
    return
  }

  const chatId: number = cb.message.chat.id
  const messageId: number = cb.message.message_id

  switch (payload.view) {
    case 'status':
      await cmdStatus(chatId, payload.page, { messageId })
      break
    case 'tasks':
      await cmdTasks(chatId, payload.filter, payload.page, { messageId })
      break
    case 'risks':
      await cmdRisks(chatId, payload.filter, payload.page, { messageId })
      break
    case 'kpis':
      await cmdKpis(chatId, payload.page, { messageId })
      break
    default:
      break
  }

  await answerCallbackQuery(cb.id)
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Find a row by UUID prefix — fetches all, filters in JS (dataset is small). */
async function findByPrefix<T extends { id: string }>(
  rows: T[],
  prefix: string
): Promise<{ result: T } | { error: string }> {
  const matches = rows.filter(r => r.id.startsWith(prefix.toLowerCase()))
  if (matches.length === 0) return { error: `No match for ID prefix <code>${prefix}</code>` }
  if (matches.length > 1) {
    const list = matches.map(r => `<code>${r.id.slice(0, 8)}</code>`).join(', ')
    return { error: `Multiple matches: ${list} — use more characters` }
  }
  return { result: matches[0] }
}

// ─── /help ──────────────────────────────────────────────────────────────────

async function cmdHelp(chatId: number) {
  await send(chatId, `<b>📋 DEVCON × Sui Tracker Bot</b>

<b>📊 View</b>
/standup — post today's DSU to the chat
/status — overall dashboard
/tasks [chapter?] — open tasks
/risks [high|medium|low?] — risk register
/chapter [id] — chapter details
/kpis — current KPI values

<b>✅ Tasks</b>
/addtask [chapter] [owner] [description]
  <i>e.g.</i> <code>/addtask bukidnon Zhi Confirm lab setup</code>
/done [id] — mark done
/urgent [id] — mark urgent

<b>⚠️ Risks</b>
/addrisk [severity] [chapter] [title] | [description]
  <i>e.g.</i> <code>/addrisk high Bukidnon BSU not confirmed | Lab access TBC</code>
/resolve [id] — mark resolved

<b>📈 KPIs</b>
/setkpi [key] [value]
  <i>e.g.</i> <code>/setkpi code_camps 2/5</code>

<i>Task/risk IDs are shown as 8-char codes. You only need the first 6–8 chars to identify one.</i>`)
}

// ─── /standup ───────────────────────────────────────────────────────────────

async function cmdStandup(chatId: number) {
  const text = await buildDsuMessage()
  await send(chatId, text)
}

// ─── /status ────────────────────────────────────────────────────────────────

async function cmdStatus(chatId: number, page = 0, editTarget?: { messageId: number }) {
  const sb = db()
  const [{ data: chapters }, { data: tasks }, { data: risks }, { data: kpis }] = await Promise.all([
    sb.from('chapters').select('name, number, status, progress_percent').order('number'),
    sb.from('chapter_tasks').select('status'),
    sb.from('risks').select('severity, status'),
    sb.from('kpis').select('key, value').in('key', ['code_camps', 'form_submissions', 'completion_rate']),
  ])

  const openTasks   = tasks?.filter(t => t.status !== 'done').length ?? 0
  const urgentTasks = tasks?.filter(t => t.status === 'urgent').length ?? 0
  const openRisks   = risks?.filter(r => r.status === 'open').length ?? 0
  const highRisks   = risks?.filter(r => r.status === 'open' && r.severity === 'high').length ?? 0
  const kpiMap      = Object.fromEntries((kpis ?? []).map(k => [k.key, k.value]))

  const statusIcon: Record<string, string> = {
    completed: '✅', rescheduling: '⚠️', in_progress: '🔄',
    pencil_booked: '📌', tbc: '🟣', activating: '🟡',
  }

  const chapterLines = (chapters ?? [])
    .map(c => `${statusIcon[c.status] ?? '•'} Ch${c.number} <b>${c.name}</b> — ${c.progress_percent}%`)
  const paged = paginateLines(chapterLines, page)
  const chapterBlock = paged.lines.join('\n')
  const keyboard = pagerMarkup('status', paged.page, paged.totalPages)

  await sendOrEdit(chatId, `<b>🏕 Sui × DEVCON · Live Status</b>

<b>KPIs</b>
• Code Camps: <code>${kpiMap['code_camps'] ?? '–'}</code>
• Form Submissions: <code>${kpiMap['form_submissions'] ?? '–'}</code>
• Completion Rate: <code>${kpiMap['completion_rate'] ?? '–'}</code>

<b>Tasks</b>  Open: <b>${openTasks}</b>${urgentTasks > 0 ? `   🔴 Urgent: <b>${urgentTasks}</b>` : ''}
<b>Risks</b>  Open: <b>${openRisks}</b>${highRisks > 0 ? `   🔴 High: <b>${highRisks}</b>` : ''}

<b>Chapters</b> ${paged.totalPages > 1 ? `(Page ${paged.page + 1}/${paged.totalPages})` : ''}
${chapterBlock || 'No chapters found.'}`,
  keyboard,
  editTarget)
}

// ─── /tasks ─────────────────────────────────────────────────────────────────

async function cmdTasks(chatId: number, filter: string, page = 0, editTarget?: { messageId: number }) {
  const sb = db()
  let query = sb
    .from('chapter_tasks')
    .select('id, chapter_id, owner, description, status')
    .neq('status', 'done')

  if (filter) query = query.eq('chapter_id', filter.toLowerCase())

  const { data: tasks } = await query.order('status', { ascending: false })

  if (!tasks?.length) {
    await send(chatId, filter ? `No open tasks for <b>${filter}</b>.` : '✅ No open tasks!')
    return
  }

  const lines = tasks.map(t => {
    const icon = t.status === 'urgent' ? '🔴' : '🟡'
    return `${icon} <b>${t.owner}</b>: ${t.description}\n   <code>${t.id.slice(0, 8)}</code> · ${t.chapter_id}`
  })

  const paged = paginateLines(lines, page)
  const keyboard = pagerMarkup('tasks', paged.page, paged.totalPages, filter)

  await sendOrEdit(
    chatId,
    `<b>📋 Open Tasks${filter ? ` · ${filter}` : ''}</b> (${tasks.length}) ${paged.totalPages > 1 ? `· Page ${paged.page + 1}/${paged.totalPages}` : ''}\n\n${paged.lines.join('\n\n')}`,
    keyboard,
    editTarget
  )
}

// ─── /risks ─────────────────────────────────────────────────────────────────

async function cmdRisks(chatId: number, filter: string, page = 0, editTarget?: { messageId: number }) {
  const sb = db()
  let query = sb
    .from('risks')
    .select('id, code, title, owner, chapter_tag, severity, status')
    .eq('status', 'open')
    .order('code')

  const sev = filter.toLowerCase()
  if (['high', 'medium', 'low'].includes(sev)) query = query.eq('severity', sev)

  const { data: risks } = await query

  if (!risks?.length) {
    await send(chatId, '✅ No open risks!')
    return
  }

  const sevIcon: Record<string, string> = { high: '🔴', medium: '🟡', low: '🟢' }
  const lines = risks.map(r =>
    `${sevIcon[r.severity]} <b>${r.code}: ${r.title}</b>\n   ${r.chapter_tag} · ${r.owner}\n   <code>${r.id.slice(0, 8)}</code>`
  )

  const paged = paginateLines(lines, page)
  const keyboard = pagerMarkup('risks', paged.page, paged.totalPages, sev)

  await sendOrEdit(
    chatId,
    `<b>⚠️ Open Risks${filter ? ` · ${filter}` : ''}</b> (${risks.length}) ${paged.totalPages > 1 ? `· Page ${paged.page + 1}/${paged.totalPages}` : ''}\n\n${paged.lines.join('\n\n')}`,
    keyboard,
    editTarget
  )
}

// ─── /chapter ───────────────────────────────────────────────────────────────

async function cmdChapter(chatId: number, id: string) {
  if (!id) {
    await send(chatId, 'Usage: /chapter [id]\nIDs: manila · tacloban · iloilo · bukidnon · pampanga · laguna')
    return
  }

  const sb = db()
  const [{ data: chapter }, { data: tasks }] = await Promise.all([
    sb.from('chapters').select('*').eq('id', id.toLowerCase()).single(),
    sb.from('chapter_tasks').select('id, owner, description, status')
      .eq('chapter_id', id.toLowerCase())
      .neq('status', 'done'),
  ])

  if (!chapter) {
    await send(chatId, `Chapter <code>${id}</code> not found.`)
    return
  }

  const taskLines = tasks?.length
    ? tasks.map(t => `  ${t.status === 'urgent' ? '🔴' : '→'} <b>${t.owner}</b>: ${t.description}\n     <code>${t.id.slice(0, 8)}</code>`).join('\n')
    : '  ✅ No open tasks'

  await send(chatId, `<b>Chapter ${chapter.number}: ${chapter.name}</b>
Status: ${chapter.status.replace(/_/g, ' ')}
Date: ${chapter.date_text}
Venue: ${chapter.venue}
Lead: ${chapter.lead_name}
Progress: ${chapter.progress_percent}%
Merch: ${chapter.merch_status}

<b>Open Tasks:</b>
${taskLines}`)
}

// ─── /kpis ──────────────────────────────────────────────────────────────────

async function cmdKpis(chatId: number, page = 0, editTarget?: { messageId: number }) {
  const { data: kpis } = await db().from('kpis').select('key, label, value, sublabel')

  if (!kpis?.length) { await send(chatId, 'No KPIs found.'); return }

  const lines = kpis.map(k => `• <b>${k.label}</b>: <code>${k.value}</code>\n  <i>${k.sublabel}</i>`)
  const paged = paginateLines(lines, page)
  const keyboard = pagerMarkup('kpis', paged.page, paged.totalPages)

  await sendOrEdit(
    chatId,
    `<b>📊 KPIs</b> ${paged.totalPages > 1 ? `· Page ${paged.page + 1}/${paged.totalPages}` : ''}\n\n${paged.lines.join('\n\n')}`,
    keyboard,
    editTarget
  )
}

// ─── /addtask ───────────────────────────────────────────────────────────────

async function cmdAddTask(chatId: number, args: string) {
  const parts = args.split(/\s+/)
  if (parts.length < 3) {
    await send(chatId, `Usage: /addtask [chapter] [owner] [description]\n<i>e.g.</i> <code>/addtask bukidnon Zhi Confirm lab setup date</code>`)
    return
  }

  const [chapter_id, owner, ...rest] = parts
  const description = rest.join(' ')
  const sb = db()

  const { data: chapter } = await sb.from('chapters').select('id, name').eq('id', chapter_id.toLowerCase()).single()
  if (!chapter) {
    await send(chatId, `Chapter <code>${chapter_id}</code> not found.\nValid IDs: manila · tacloban · iloilo · bukidnon · pampanga · laguna`)
    return
  }

  const { data: task, error } = await sb
    .from('chapter_tasks')
    .insert({ chapter_id: chapter_id.toLowerCase(), owner, description, status: 'pending' })
    .select('id')
    .single()

  if (error) { await send(chatId, `❌ ${error.message}`); return }

  await send(chatId, `✅ Task added to <b>${chapter.name}</b>\n<b>${owner}</b>: ${description}\nID: <code>${task.id.slice(0, 8)}</code>`)
}

// ─── /done ──────────────────────────────────────────────────────────────────

async function cmdDoneTask(chatId: number, prefix: string) {
  if (!prefix) { await send(chatId, 'Usage: /done [task-id]  (get IDs from /tasks)'); return }

  const sb = db()
  const { data: all } = await sb.from('chapter_tasks').select('id, owner, description, chapter_id')
  const found = await findByPrefix(all ?? [], prefix)

  if ('error' in found) { await send(chatId, found.error); return }

  await sb.from('chapter_tasks').update({ status: 'done' }).eq('id', found.result.id)
  await send(chatId, `✅ Done: <b>${found.result.owner}</b>: ${found.result.description}`)
}

// ─── /urgent ────────────────────────────────────────────────────────────────

async function cmdUrgentTask(chatId: number, prefix: string) {
  if (!prefix) { await send(chatId, 'Usage: /urgent [task-id]  (get IDs from /tasks)'); return }

  const sb = db()
  const { data: all } = await sb.from('chapter_tasks').select('id, owner, description, chapter_id')
  const found = await findByPrefix(all ?? [], prefix)

  if ('error' in found) { await send(chatId, found.error); return }

  await sb.from('chapter_tasks').update({ status: 'urgent' }).eq('id', found.result.id)
  await send(chatId, `🔴 Urgent: <b>${found.result.owner}</b>: ${found.result.description}`)
}

// ─── /addrisk ───────────────────────────────────────────────────────────────

async function cmdAddRisk(chatId: number, args: string) {
  // Format: [severity] [chapter_tag] [title] | [description]
  const [titlePart, descPart] = args.split('|').map(s => s.trim())
  const parts = titlePart.split(/\s+/)

  if (parts.length < 3) {
    await send(chatId, `Usage: /addrisk [severity] [chapter] [title] | [description]\n<i>e.g.</i>\n<code>/addrisk high Bukidnon BSU lab not confirmed | Formal confirmation from BSU still needed</code>\n\nSeverity: <code>high</code> · <code>medium</code> · <code>low</code>`)
    return
  }

  const [severity, chapter_tag, ...titleParts] = parts

  if (!['high', 'medium', 'low'].includes(severity.toLowerCase())) {
    await send(chatId, `Severity must be <code>high</code>, <code>medium</code>, or <code>low</code>.`)
    return
  }

  const sb = db()
  const { count } = await sb.from('risks').select('id', { count: 'exact', head: true })
  const code = `R${(count ?? 0) + 1}`
  const title = titleParts.join(' ')

  const { data: risk, error } = await sb
    .from('risks')
    .insert({
      code,
      title,
      description: descPart ?? title,
      owner: 'TBD',
      chapter_tag,
      severity: severity.toLowerCase(),
      status: 'open',
    })
    .select('id, code, title')
    .single()

  if (error) { await send(chatId, `❌ ${error.message}`); return }

  const icon = severity.toLowerCase() === 'high' ? '🔴' : severity.toLowerCase() === 'medium' ? '🟡' : '🟢'
  await send(chatId, `${icon} Risk added: <b>${risk.code}: ${risk.title}</b>\nChapter: ${chapter_tag} · Severity: ${severity}\nID: <code>${risk.id.slice(0, 8)}</code>\n\nUpdate owner: /addownerrisk [id] [name]`)
}

// ─── /resolve ───────────────────────────────────────────────────────────────

async function cmdResolveRisk(chatId: number, prefix: string) {
  if (!prefix) { await send(chatId, 'Usage: /resolve [risk-id]  (get IDs from /risks)'); return }

  const sb = db()
  const { data: all } = await sb.from('risks').select('id, code, title')
  const found = await findByPrefix(all ?? [], prefix)

  if ('error' in found) { await send(chatId, found.error); return }

  await sb.from('risks').update({ status: 'resolved' }).eq('id', found.result.id)
  await send(chatId, `✅ Resolved: <b>${found.result.code}: ${found.result.title}</b>`)
}

// ─── /setkpi ────────────────────────────────────────────────────────────────

async function cmdSetKpi(chatId: number, args: string) {
  const spaceIdx = args.indexOf(' ')
  if (spaceIdx === -1) {
    await send(chatId, `Usage: /setkpi [key] [value]\n<i>e.g.</i> <code>/setkpi code_camps 2/5</code>\n\nKeys: <code>code_camps</code> · <code>form_submissions</code> · <code>trained_mentors</code> · <code>confirmed_deployments</code> · <code>completion_rate</code> · <code>computer_labs</code>`)
    return
  }

  const key   = args.slice(0, spaceIdx).trim()
  const value = args.slice(spaceIdx + 1).trim()
  const sb    = db()

  const { data: kpi, error } = await sb
    .from('kpis')
    .update({ value, updated_at: new Date().toISOString() })
    .eq('key', key)
    .select('label, value')
    .single()

  if (error || !kpi) {
    await send(chatId, `❌ Key <code>${key}</code> not found.\nValid keys: code_camps · form_submissions · trained_mentors · confirmed_deployments · completion_rate · computer_labs`)
    return
  }

  await send(chatId, `✅ <b>${kpi.label}</b> updated → <code>${kpi.value}</code>`)
}
