import { createClient } from '@supabase/supabase-js'
import { buildDsuMessage } from '@/lib/telegram/dsu'

const noStoreFetch: typeof fetch = (input, init) => {
  return fetch(input, {
    ...init,
    cache: 'no-store',
    next: { revalidate: 0 },
  } as RequestInit & { next: { revalidate: 0 } })
}

// Service-role client — bypasses RLS for server-side writes
function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: { fetch: noStoreFetch },
    }
  )
}

const TOKEN = process.env.TELEGRAM_BOT_TOKEN!

type InlineKeyboardButton = { text: string; callback_data: string }
type InlineKeyboardMarkup = { inline_keyboard: InlineKeyboardButton[][] }

type PageView = 'status' | 'tasks' | 'risks' | 'kpis' | 'contacts' | 'merch'

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
  if (!['status', 'tasks', 'risks', 'kpis', 'contacts', 'merch'].includes(view)) return null

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
      case 'status':    return await cmdStatus(chatId)
      case 'tasks':     return await cmdTasks(chatId, rest)
      case 'risks':     return await cmdRisks(chatId, rest)
      case 'chapter':   return await cmdChapter(chatId, rest)
      case 'kpis':      return await cmdKpis(chatId)
      case 'addtask':      return await cmdAddTask(chatId, rest)
      case 'done':         return await cmdDoneTask(chatId, rest)
      case 'urgent':       return await cmdUrgentTask(chatId, rest)
      case 'pendingtask':  return await cmdPendingTask(chatId, rest)
      case 'deletetask':   return await cmdDeleteTask(chatId, rest)
      case 'addrisk':      return await cmdAddRisk(chatId, rest)
      case 'resolve':      return await cmdResolveRisk(chatId, rest)
      case 'deleterisk':   return await cmdDeleteRisk(chatId, rest)
      case 'severity':     return await cmdSetSeverity(chatId, rest)
      case 'setriskowner':
      case 'addownerrisk': return await cmdSetRiskOwner(chatId, rest)
      case 'setkpi':       return await cmdSetKpi(chatId, rest)
      case 'setchapter':   return await cmdSetChapter(chatId, rest)
      case 'contacts':     return await cmdContacts(chatId, rest)
      case 'addcontact':   return await cmdAddContact(chatId, rest)
      case 'deletecontact':return await cmdDeleteContact(chatId, rest)
      case 'merch':        return await cmdMerch(chatId, rest)
      case 'setmerch':     return await cmdSetMerch(chatId, rest)
      default:             return await send(chatId, 'Unknown command. Use /help.')
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
      await cmdStatusDashboard(chatId, payload.page, { messageId })
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
    case 'contacts':
      await cmdContacts(chatId, payload.filter, payload.page, { messageId })
      break
    case 'merch':
      await cmdMerch(chatId, payload.filter, payload.page, { messageId })
      break
    default:
      break
  }

  await answerCallbackQuery(cb.id)
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Find a task by short_id (case-insensitive), e.g. "MNL-t1" or "mnl-t1". */
async function findTaskByShortId(
  rows: { id: string; short_id: string | null; owner: string; description: string }[],
  input: string
): Promise<{ result: typeof rows[number] } | { error: string }> {
  const needle = input.toUpperCase()
  const matches = rows.filter(r => r.short_id?.toUpperCase() === needle)
  if (matches.length === 1) return { result: matches[0] }

  // Fall back to UUID prefix for backwards compatibility
  const uuidMatches = rows.filter(r => r.id.startsWith(input.toLowerCase()))
  if (uuidMatches.length === 1) return { result: uuidMatches[0] }
  if (uuidMatches.length > 1) {
    const list = uuidMatches.map(r => `<code>${r.short_id ?? r.id.slice(0, 8)}</code>`).join(', ')
    return { error: `Multiple matches: ${list} — be more specific` }
  }

  return { error: `No task found for <code>${input}</code>.\nUse /tasks to see IDs (e.g. <code>MNL-t1</code>)` }
}

/** Find a risk by code (case-insensitive), e.g. "R1" or "r1". */
async function findRiskByCode(
  rows: { id: string; code: string; title: string }[],
  input: string
): Promise<{ result: typeof rows[number] } | { error: string }> {
  const needle = input.toUpperCase()
  const match = rows.find(r => r.code.toUpperCase() === needle)
  if (match) return { result: match }

  // Fall back to UUID prefix
  const uuidMatches = rows.filter(r => r.id.startsWith(input.toLowerCase()))
  if (uuidMatches.length === 1) return { result: uuidMatches[0] }
  if (uuidMatches.length > 1) {
    const list = uuidMatches.map(r => `<code>${r.code}</code>`).join(', ')
    return { error: `Multiple matches: ${list} — be more specific` }
  }

  return { error: `No risk found for <code>${input}</code>.\nUse /risks to see codes (e.g. <code>R1</code>)` }
}

/** Find a contact or merch item by UUID prefix (case-insensitive). */
async function findByPrefix<T extends { id: string }>(
  rows: T[],
  prefix: string
): Promise<{ result: T } | { error: string }> {
  const matches = rows.filter(r => r.id.startsWith(prefix.toLowerCase()))
  if (matches.length === 0) return { error: `No match for ID <code>${prefix}</code>` }
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
/status — today's DSU
/tasks [chapter?] — open tasks
/risks [high|med|low?] — risk register
/chapter [id] — chapter detail
/kpis — KPI values
/contacts [team?] — team contacts
/merch [jcr|lazada|shopee?] — merch items

<b>✅ Tasks</b>  <i>(IDs like MNL-t1, TCL-t2)</i>
/addtask [chapter] [owner] [desc]
/done [id] · /urgent [id] · /pendingtask [id]
/deletetask [id] — remove task

<b>⚠️ Risks</b>  <i>(IDs like R1, R2)</i>
/addrisk [sev] [chapter] [title] | [desc]
/resolve [code] — mark resolved
/severity [code] [high|medium|low]
/setriskowner [code] [owner]
/deleterisk [code] — remove risk

<b>📈 KPIs</b>
/setkpi [key] [value]
  <i>e.g.</i> <code>/setkpi code_camps 2</code>

<b>🏕 Chapters</b>
/setchapter [id] status [value]
/setchapter [id] pax [number]
/setchapter [id] progress [0-100]
  <i>e.g.</i> <code>/setchapter manila status completed</code>

<b>👥 Contacts</b>
/addcontact [team] [name] | [role] | [handle]
  teams: <code>sui_foundation</code> · <code>chapter_lead</code> · <code>content_team</code>
/deletecontact [id]

<b>📦 Merch</b>
/setmerch [id] [received|confirmed|confirm|pending]

<i>Task IDs: MNL-t1, TCL-t2 etc. Risk codes: R1, R2 etc. Contact/merch: first 6 chars of UUID.</i>`)
}

// ─── /status ────────────────────────────────────────────────────────────────

async function cmdStatus(chatId: number) {
  const text = await buildDsuMessage()
  await send(chatId, text)
}

// Legacy compact dashboard renderer retained for callback paging compatibility.
// ─── internal status dashboard ───────────────────────────────────────────────

async function cmdStatusDashboard(chatId: number, page = 0, editTarget?: { messageId: number }) {
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
    .select('id, short_id, chapter_id, owner, description, status')
    .neq('status', 'done')

  if (filter) query = query.eq('chapter_id', filter.toLowerCase())

  const { data: tasks } = await query.order('status', { ascending: false })

  if (!tasks?.length) {
    await send(chatId, filter ? `No open tasks for <b>${filter}</b>.` : '✅ No open tasks!')
    return
  }

  const lines = tasks.map(t => {
    const icon  = t.status === 'urgent' ? '🔴' : '🟡'
    const label = t.short_id ?? t.id.slice(0, 8)
    return `${icon} <b>${t.owner}</b>: ${t.description}\n   <code>${label}</code> · ${t.chapter_id}`
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
    `${sevIcon[r.severity]} <b>${r.code}: ${r.title}</b>\n   ${r.chapter_tag} · ${r.owner}`
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
    sb.from('chapter_tasks').select('id, short_id, owner, description, status')
      .eq('chapter_id', id.toLowerCase())
      .neq('status', 'done'),
  ])

  if (!chapter) {
    await send(chatId, `Chapter <code>${id}</code> not found.`)
    return
  }

  const taskLines = tasks?.length
    ? tasks.map(t => {
        const label = t.short_id ?? t.id.slice(0, 8)
        return `  ${t.status === 'urgent' ? '🔴' : '→'} <b>${t.owner}</b>: ${t.description}\n     <code>${label}</code>`
      }).join('\n')
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

const CHAPTER_CODES: Record<string, string> = {
  manila: 'MNL', tacloban: 'TCL', iloilo: 'ILO',
  bukidnon: 'BKD', pampanga: 'PMP', laguna: 'LGN',
}

async function generateShortId(sb: ReturnType<typeof db>, chapter_id: string): Promise<string> {
  const code = CHAPTER_CODES[chapter_id.toLowerCase()] ?? chapter_id.slice(0, 3).toUpperCase()
  const { count } = await sb
    .from('chapter_tasks')
    .select('*', { count: 'exact', head: true })
    .eq('chapter_id', chapter_id.toLowerCase())
  return `${code}-t${(count ?? 0) + 1}`
}

async function cmdAddTask(chatId: number, args: string) {
  const parts = args.split(/\s+/)
  if (parts.length < 3) {
    await send(chatId, `Usage: /addtask [chapter] [owner] [description]\n<i>e.g.</i> <code>/addtask bukidnon Zhi Confirm lab setup date</code>`)
    return
  }

  const [chapter_id_raw, owner, ...rest] = parts
  const chapter_id  = chapter_id_raw.toLowerCase()
  const description = rest.join(' ')
  const sb = db()

  const { data: chapter } = await sb.from('chapters').select('id, name').eq('id', chapter_id).single()
  if (!chapter) {
    await send(chatId, `Chapter <code>${chapter_id}</code> not found.\nValid IDs: manila · tacloban · iloilo · bukidnon · pampanga · laguna`)
    return
  }

  const short_id = await generateShortId(sb, chapter_id)
  const { data: task, error } = await sb
    .from('chapter_tasks')
    .insert({ chapter_id, owner, description, status: 'pending', short_id })
    .select('id, short_id')
    .single()

  if (error) { await send(chatId, `❌ ${error.message}`); return }

  await send(chatId, `✅ Task added to <b>${chapter.name}</b>\n<b>${owner}</b>: ${description}\nID: <code>${task.short_id ?? task.id.slice(0, 8)}</code>`)
}

// ─── /done ──────────────────────────────────────────────────────────────────

async function cmdDoneTask(chatId: number, prefix: string) {
  if (!prefix) { await send(chatId, 'Usage: /done [task-id]  e.g. <code>MNL-t1</code>'); return }

  const sb = db()
  const { data: all } = await sb.from('chapter_tasks').select('id, short_id, owner, description, chapter_id')
  const found = await findTaskByShortId(all ?? [], prefix)

  if ('error' in found) { await send(chatId, found.error); return }

  await sb.from('chapter_tasks').update({ status: 'done' }).eq('id', found.result.id)
  await send(chatId, `✅ Done: <b>${found.result.owner}</b>: ${found.result.description}`)
}

// ─── /urgent ────────────────────────────────────────────────────────────────

async function cmdUrgentTask(chatId: number, prefix: string) {
  if (!prefix) { await send(chatId, 'Usage: /urgent [task-id]  e.g. <code>MNL-t1</code>'); return }

  const sb = db()
  const { data: all } = await sb.from('chapter_tasks').select('id, short_id, owner, description, chapter_id')
  const found = await findTaskByShortId(all ?? [], prefix)

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
  await send(chatId, `${icon} Risk added: <b>${risk.code}: ${risk.title}</b>\nChapter: ${chapter_tag} · Severity: ${severity}\n\nTip: set owner with /setriskowner ${risk.code} [name]`)
}

// ─── /resolve ───────────────────────────────────────────────────────────────

async function cmdResolveRisk(chatId: number, prefix: string) {
  if (!prefix) { await send(chatId, 'Usage: /resolve [risk-code]  e.g. <code>R1</code>'); return }

  const sb = db()
  const { data: all } = await sb.from('risks').select('id, code, title')
  const found = await findRiskByCode(all ?? [], prefix)

  if ('error' in found) { await send(chatId, found.error); return }

  await sb.from('risks').update({ status: 'resolved' }).eq('id', found.result.id)
  await send(chatId, `✅ Resolved: <b>${found.result.code}: ${found.result.title}</b>`)
}

// ─── /pendingtask ───────────────────────────────────────────────────────────

async function cmdPendingTask(chatId: number, prefix: string) {
  if (!prefix) { await send(chatId, 'Usage: /pendingtask [task-id]  e.g. <code>MNL-t1</code>'); return }

  const sb = db()
  const { data: all } = await sb.from('chapter_tasks').select('id, short_id, owner, description')
  const found = await findTaskByShortId(all ?? [], prefix)

  if ('error' in found) { await send(chatId, found.error); return }

  await sb.from('chapter_tasks').update({ status: 'pending' }).eq('id', found.result.id)
  await send(chatId, `🔄 Reset to pending: <b>${found.result.owner}</b>: ${found.result.description}`)
}

// ─── /deletetask ─────────────────────────────────────────────────────────────

async function cmdDeleteTask(chatId: number, prefix: string) {
  if (!prefix) { await send(chatId, 'Usage: /deletetask [task-id]  e.g. <code>MNL-t1</code>'); return }

  const sb = db()
  const { data: all } = await sb.from('chapter_tasks').select('id, short_id, owner, description')
  const found = await findTaskByShortId(all ?? [], prefix)

  if ('error' in found) { await send(chatId, found.error); return }

  await sb.from('chapter_tasks').delete().eq('id', found.result.id)
  await send(chatId, `🗑 Deleted task: <b>${found.result.owner}</b>: ${found.result.description}`)
}

// ─── /deleterisk ─────────────────────────────────────────────────────────────

async function cmdDeleteRisk(chatId: number, prefix: string) {
  if (!prefix) { await send(chatId, 'Usage: /deleterisk [risk-code]  e.g. <code>R1</code>'); return }

  const sb = db()
  const { data: all } = await sb.from('risks').select('id, code, title')
  const found = await findRiskByCode(all ?? [], prefix)

  if ('error' in found) { await send(chatId, found.error); return }

  await sb.from('risks').delete().eq('id', found.result.id)
  await send(chatId, `🗑 Deleted risk: <b>${found.result.code}: ${found.result.title}</b>`)
}

// ─── /severity ───────────────────────────────────────────────────────────────

async function cmdSetSeverity(chatId: number, args: string) {
  const parts = args.split(/\s+/)
  if (parts.length < 2) {
    await send(chatId, 'Usage: /severity [risk-code] [high|medium|low]  e.g. <code>/severity R1 high</code>')
    return
  }

  const [prefix, sev] = parts
  if (!['high', 'medium', 'low'].includes(sev.toLowerCase())) {
    await send(chatId, 'Severity must be <code>high</code>, <code>medium</code>, or <code>low</code>.')
    return
  }

  const sb = db()
  const { data: all } = await sb.from('risks').select('id, code, title')
  const found = await findRiskByCode(all ?? [], prefix)

  if ('error' in found) { await send(chatId, found.error); return }

  await sb.from('risks').update({ severity: sev.toLowerCase() }).eq('id', found.result.id)
  const icon = sev === 'high' ? '🔴' : sev === 'medium' ? '🟡' : '🟢'
  await send(chatId, `${icon} Severity updated: <b>${found.result.code}: ${found.result.title}</b> → ${sev.toUpperCase()}`)
}

// ─── /setriskowner ──────────────────────────────────────────────────────────

async function cmdSetRiskOwner(chatId: number, args: string) {
  const spaceIdx = args.indexOf(' ')
  if (spaceIdx === -1) {
    await send(chatId, 'Usage: /setriskowner [risk-code] [owner name]  e.g. <code>/setriskowner R1 Dale</code>')
    return
  }

  const prefix = args.slice(0, spaceIdx).trim()
  const owner  = args.slice(spaceIdx + 1).trim()

  const sb = db()
  const { data: all } = await sb.from('risks').select('id, code, title')
  const found = await findRiskByCode(all ?? [], prefix)

  if ('error' in found) { await send(chatId, found.error); return }

  await sb.from('risks').update({ owner }).eq('id', found.result.id)
  await send(chatId, `✅ Owner updated: <b>${found.result.code}: ${found.result.title}</b>\nOwner → <b>${owner}</b>`)
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

// ─── /setchapter ────────────────────────────────────────────────────────────

const VALID_CHAPTER_STATUSES = ['completed', 'rescheduling', 'in_progress', 'activating', 'pencil_booked', 'tbc']

async function cmdSetChapter(chatId: number, args: string) {
  const parts = args.split(/\s+/)
  if (parts.length < 3) {
    await send(chatId, `Usage: /setchapter [id] [field] [value]

Fields:
  <code>status</code> — completed · rescheduling · in_progress · activating · pencil_booked · tbc
  <code>pax</code>    — actual attendance number
  <code>progress</code> — 0–100

<i>e.g.</i> <code>/setchapter manila status completed</code>
<i>e.g.</i> <code>/setchapter bukidnon pax 87</code>
<i>e.g.</i> <code>/setchapter iloilo progress 60</code>`)
    return
  }

  const [chapterId, field, ...rest] = parts
  const value = rest.join(' ')
  const sb = db()

  const { data: chapter } = await sb.from('chapters').select('id, name, number').eq('id', chapterId.toLowerCase()).single()
  if (!chapter) {
    await send(chatId, `Chapter <code>${chapterId}</code> not found.\nValid IDs: manila · tacloban · iloilo · bukidnon · pampanga · laguna`)
    return
  }

  const update: Record<string, unknown> = {}
  switch (field.toLowerCase()) {
    case 'status':
      if (!VALID_CHAPTER_STATUSES.includes(value)) {
        await send(chatId, `Invalid status. Valid: ${VALID_CHAPTER_STATUSES.map(s => `<code>${s}</code>`).join(' · ')}`)
        return
      }
      update.status = value
      break
    case 'pax':
    case 'pax_actual': {
      const n = parseInt(value)
      if (isNaN(n) || n < 0) { await send(chatId, 'Pax must be a non-negative number.'); return }
      update.pax_actual = n
      break
    }
    case 'progress': {
      const n = parseInt(value)
      if (isNaN(n) || n < 0 || n > 100) { await send(chatId, 'Progress must be 0–100.'); return }
      update.progress_percent = n
      break
    }
    default:
      await send(chatId, `Unknown field <code>${field}</code>. Use: status · pax · progress`)
      return
  }

  const { error } = await sb.from('chapters').update(update).eq('id', chapter.id)
  if (error) { await send(chatId, `❌ ${error.message}`); return }

  const fieldLabel = field === 'pax' || field === 'pax_actual' ? 'pax_actual' : field.toLowerCase()
  await send(chatId, `✅ <b>Ch${chapter.number} ${chapter.name}</b>\n${fieldLabel} → <code>${value}</code>`)
}

// ─── /contacts ──────────────────────────────────────────────────────────────

const TEAM_LABELS: Record<string, string> = {
  sui_foundation: 'Sui Foundation',
  chapter_lead:   'Chapter Leads',
  content_team:   'Content Team',
}

async function cmdContacts(chatId: number, filter = '', page = 0, editTarget?: { messageId: number }) {
  const sb = db()
  let query = sb.from('contacts').select('id, name, role, handle, team').order('name')

  const teamFilter = filter.toLowerCase().replace(/[-\s]/g, '_')
  if (['sui_foundation', 'chapter_lead', 'content_team'].includes(teamFilter)) {
    query = query.eq('team', teamFilter)
  }

  const { data: contacts } = await query

  if (!contacts?.length) {
    await send(chatId, filter ? `No contacts for team <b>${filter}</b>.` : 'No contacts found.')
    return
  }

  const lines = contacts.map(c =>
    `👤 <b>${c.name}</b> — ${c.role}\n   ${c.handle || '—'} · <i>${TEAM_LABELS[c.team] ?? c.team}</i>\n   <code>${c.id.slice(0, 8)}</code>`
  )

  const paged    = paginateLines(lines, page)
  const keyboard = pagerMarkup('contacts', paged.page, paged.totalPages, filter)

  await sendOrEdit(
    chatId,
    `<b>👥 Contacts${filter ? ` · ${TEAM_LABELS[teamFilter] ?? filter}` : ''}</b> (${contacts.length}) ${paged.totalPages > 1 ? `· Page ${paged.page + 1}/${paged.totalPages}` : ''}\n\n${paged.lines.join('\n\n')}`,
    keyboard,
    editTarget
  )
}

// ─── /addcontact ────────────────────────────────────────────────────────────

async function cmdAddContact(chatId: number, args: string) {
  // Format: [team] [name] | [role] | [handle?]
  const pipeIdx = args.indexOf('|')
  if (pipeIdx === -1) {
    await send(chatId, `Usage: /addcontact [team] [name] | [role] | [handle]

Teams: <code>sui_foundation</code> · <code>chapter_lead</code> · <code>content_team</code>

<i>e.g.</i> <code>/addcontact chapter_lead Maria Santos | Chapter Lead Iloilo | @mariasantos</code>`)
    return
  }

  const beforePipe = args.slice(0, pipeIdx).trim()
  const afterPipe  = args.slice(pipeIdx + 1).trim()
  const [team, ...nameParts] = beforePipe.split(/\s+/)
  const name = nameParts.join(' ').trim()
  const pipeParts = afterPipe.split('|').map(s => s.trim())
  const role   = pipeParts[0] ?? ''
  const handle = pipeParts[1] ?? ''

  if (!name || !role) {
    await send(chatId, '❌ Name and role are required.\nFormat: /addcontact [team] [name] | [role] | [handle?]')
    return
  }

  const validTeams = ['sui_foundation', 'chapter_lead', 'content_team']
  if (!validTeams.includes(team.toLowerCase())) {
    await send(chatId, `Invalid team. Use: ${validTeams.map(t => `<code>${t}</code>`).join(' · ')}`)
    return
  }

  const sb = db()
  const { data: contact, error } = await sb
    .from('contacts')
    .insert({ name, role, handle, team: team.toLowerCase(), emoji: '👤' })
    .select('id, name, role')
    .single()

  if (error) { await send(chatId, `❌ ${error.message}`); return }

  await send(chatId, `✅ Contact added: <b>${contact.name}</b> — ${contact.role}\nID: <code>${contact.id.slice(0, 8)}</code>`)
}

// ─── /deletecontact ─────────────────────────────────────────────────────────

async function cmdDeleteContact(chatId: number, prefix: string) {
  if (!prefix) { await send(chatId, 'Usage: /deletecontact [contact-id]  (get IDs from /contacts)'); return }

  const sb = db()
  const { data: all } = await sb.from('contacts').select('id, name, role')
  const found = await findByPrefix(all ?? [], prefix)

  if ('error' in found) { await send(chatId, found.error); return }

  await sb.from('contacts').delete().eq('id', found.result.id)
  await send(chatId, `🗑 Removed contact: <b>${found.result.name}</b> — ${found.result.role}`)
}

// ─── /merch ─────────────────────────────────────────────────────────────────

const MERCH_ICONS: Record<string, string> = { jcr: '📦', lazada: '🛒', shopee: '☂️' }

async function cmdMerch(chatId: number, filter = '', page = 0, editTarget?: { messageId: number }) {
  const sb = db()
  let query = sb.from('merch_items').select('id, name, quantity, distribution, status, category').order('category')

  const cat = filter.toLowerCase()
  if (['jcr', 'lazada', 'shopee'].includes(cat)) {
    query = query.eq('category', cat)
  }

  const { data: items } = await query

  if (!items?.length) {
    await send(chatId, filter ? `No merch items for category <b>${filter}</b>.` : 'No merch items found.')
    return
  }

  const lines = items.map(item => {
    const icon = MERCH_ICONS[item.category] ?? '📦'
    return `${icon} <b>${item.name}</b> ×${item.quantity}\n   ${item.distribution || '—'} · <code>${item.status}</code>\n   <code>${item.id.slice(0, 8)}</code>`
  })

  const paged    = paginateLines(lines, page)
  const keyboard = pagerMarkup('merch', paged.page, paged.totalPages, filter)

  await sendOrEdit(
    chatId,
    `<b>📦 Merch Items${filter ? ` · ${filter.toUpperCase()}` : ''}</b> (${items.length}) ${paged.totalPages > 1 ? `· Page ${paged.page + 1}/${paged.totalPages}` : ''}\n\n${paged.lines.join('\n\n')}`,
    keyboard,
    editTarget
  )
}

// ─── /setmerch ──────────────────────────────────────────────────────────────

async function cmdSetMerch(chatId: number, args: string) {
  const parts = args.split(/\s+/)
  if (parts.length < 2) {
    await send(chatId, `Usage: /setmerch [id] [status]

Statuses: <code>received</code> · <code>confirmed</code> · <code>confirm</code> · <code>pending</code>

<i>e.g.</i> <code>/setmerch abc12345 received</code>`)
    return
  }

  const [prefix, status] = parts
  const validStatuses = ['received', 'confirmed', 'confirm', 'pending']

  if (!validStatuses.includes(status.toLowerCase())) {
    await send(chatId, `Invalid status. Use: ${validStatuses.map(s => `<code>${s}</code>`).join(' · ')}`)
    return
  }

  const sb = db()
  const { data: all } = await sb.from('merch_items').select('id, name, category')
  const found = await findByPrefix(all ?? [], prefix)

  if ('error' in found) { await send(chatId, found.error); return }

  await sb.from('merch_items').update({ status: status.toLowerCase() }).eq('id', found.result.id)
  const icon = MERCH_ICONS[found.result.category] ?? '📦'
  await send(chatId, `${icon} <b>${found.result.name}</b> → <code>${status}</code>`)
}
