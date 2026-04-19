'use client'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import type { Chapter, BadgeVariant } from '@/lib/types'

/* ── accent colours ─────────────────────────────────────────────────────── */
const accentOf = (c: Chapter) =>
  c.color === 'teal' ? '#14b8a6' : c.color === 'yellow' ? '#f59e0b' : c.color === 'purple' ? '#a78bfa' : '#06b6d4'

const statusBadge: Record<string, { variant: BadgeVariant; label: string }> = {
  completed:     { variant: 'done',    label: '✓ COMPLETED'     },
  rescheduling:  { variant: 'warn',    label: '⚠ RESCHEDULING'  },
  in_progress:   { variant: 'pending', label: '🔄 IN PROGRESS'  },
  pencil_booked: { variant: 'warn',    label: '📌 PENCIL-BOOKED' },
  tbc:           { variant: 'tbc',     label: 'TBC / AT RISK'   },
  activating:    { variant: 'warn',    label: '⚠ ACTIVATING'    },
}

/* ── countdown checklist data ───────────────────────────────────────────── */
type CheckStatus = 'done' | 'executed' | 'overdue' | 'confirm' | 'in_progress' | 'pending' | 'upcoming'

interface CheckItem {
  tCode: string
  task: string
  date: string
  status: CheckStatus
  isEvent?: boolean
}

const CHECKLIST: Record<string, CheckItem[]> = {
  manila: [
    { tCode: 'T-35', task: 'Ocular visit — Letran Intramuros',                                         date: 'Feb 09, 2026', status: 'done'        },
    { tCode: 'T-28', task: 'Software installation begins (3–5 hrs per lab)',                            date: 'Mar 7, 2026',  status: 'done'        },
    { tCode: 'T-14', task: 'Installation verified · roadblocks resolved',                               date: 'Mar 14, 2026', status: 'done'        },
    { tCode: 'T-7',  task: 'Dry run — full 4-hour rehearsal · all mentors present',                    date: 'Mar 21, 2026', status: 'done'        },
    { tCode: 'T-3',  task: 'Final logistics: passes, pax confirmation, merch packed',                  date: 'Mar 25, 2026', status: 'done'        },
    { tCode: 'T-0 ☻', task: 'EVENT DAY — Manila Pilot · Letran Intramuros',                           date: 'Mar 28, 2026', status: 'executed',  isEvent: true },
    { tCode: 'T+3',  task: 'Log pax count · BIR receipts to Jedd · SITREP submitted',                 date: 'Mar 31, 2026', status: 'overdue'     },
    { tCode: 'T+7',  task: 'Jedd confirms Liquidation · HQ Finance updated',                           date: 'Apr 4, 2026',  status: 'confirm'     },
    { tCode: 'OPEN', task: 'Post-pilot content update — Mike + Lady documenting learnings for all chapters', date: 'In progress', status: 'in_progress' },
  ],
  tacloban: [
    { tCode: 'OPEN', task: 'Lock new event date with LNU — must be before May 1',                       date: 'Urgent',       status: 'overdue'     },
    { tCode: 'OPEN', task: 'Formal ocular at LNU once date is confirmed',                                date: 'TBD',          status: 'pending'     },
    { tCode: 'T-35', task: 'Ocular visit & lab check',                                                  date: 'TBD',          status: 'upcoming'   },
    { tCode: 'T-28', task: 'Software installation begins',                                               date: 'TBD',          status: 'upcoming'   },
    { tCode: 'T-14', task: 'Installation verified · roadblocks resolved',                                date: 'TBD',          status: 'upcoming'   },
    { tCode: 'T-7',  task: 'Dry run — full 4-hour rehearsal',                                           date: 'TBD',          status: 'upcoming'   },
    { tCode: 'T-0 ☻', task: 'EVENT DAY — Tacloban Code Camp',                                          date: 'TBD',          status: 'upcoming',  isEvent: true },
  ],
  iloilo: [
    { tCode: 'T-30', task: 'Ocular at CPU Jaro — Ted to visit',                                         date: 'Apr 16, 2026', status: 'confirm'    },
    { tCode: 'PRE',  task: 'Sui-Supported Developer Event at WVSU BINHI TBI (not a code camp)',          date: 'Apr 18, 2026', status: 'executed',  isEvent: true },
    { tCode: 'T-28', task: 'Software installation at CPU Jaro',                                          date: 'Apr 18, 2026', status: 'upcoming'   },
    { tCode: 'T-14', task: 'Installation verified · roadblocks resolved',                                date: 'May 2, 2026',  status: 'upcoming'   },
    { tCode: 'T-7',  task: 'Dry run — full 4-hour rehearsal',                                           date: 'May 9, 2026',  status: 'upcoming'   },
    { tCode: 'T-3',  task: 'Final logistics: passes, pax confirmation, merch packed',                   date: 'May 13, 2026', status: 'upcoming'   },
    { tCode: 'T-0 ☻', task: 'EVENT DAY — Iloilo Code Camp · CPU Jaro',                                 date: 'May 16, 2026', status: 'upcoming',  isEvent: true },
  ],
  bukidnon: [
    { tCode: 'PRE',  task: 'Cash Advance approved · merch must ship before Apr 29',                      date: 'Apr 18, 2026', status: 'confirm'    },
    { tCode: 'T-7',  task: 'Merch packed and shipped to Bukidnon',                                       date: 'Apr 29, 2026', status: 'upcoming'   },
    { tCode: 'T-3',  task: 'Final logistics: passes, pax confirmation, lab check',                       date: 'May 3, 2026',  status: 'upcoming'   },
    { tCode: 'T-0 ☻', task: 'EVENT DAY — Bukidnon Code Camp · BSU',                                    date: 'May 6, 2026',  status: 'upcoming',  isEvent: true },
    { tCode: 'T+3',  task: 'Log pax count · BIR receipts · SITREP submitted',                           date: 'May 9, 2026',  status: 'upcoming'   },
    { tCode: 'T+7',  task: 'Liquidation · HQ Finance updated',                                          date: 'May 13, 2026', status: 'upcoming'   },
  ],
  pampanga: [
    { tCode: 'PRE',  task: 'Formal Sui Foundation slot confirmation from Joash',                          date: 'Pending',      status: 'confirm'    },
    { tCode: 'T-35', task: 'Ocular at CCA · formal venue visit from Joash',                              date: 'May 25, 2026', status: 'upcoming'   },
    { tCode: 'T-28', task: 'Software installation at CCA labs',                                           date: 'Jun 2, 2026',  status: 'upcoming'   },
    { tCode: 'T-0 ☻', task: 'EVENT DAY — Pampanga Code Camp · CCA',                                    date: 'Jun 28, 2026', status: 'upcoming',  isEvent: true },
  ],
  laguna: [
    { tCode: 'PRE',  task: 'June go/no-go decision from Dom — confirm by mid-May',                        date: 'May 15, 2026', status: 'pending'    },
    { tCode: 'PRE',  task: 'Venue scouting by John Danmel',                                               date: 'TBD',          status: 'pending'    },
    { tCode: 'T-35', task: 'Ocular at confirmed venue',                                                    date: 'TBD',          status: 'upcoming'   },
    { tCode: 'T-0 ☻', task: 'EVENT DAY — Laguna Code Camp',                                              date: 'TBD',          status: 'upcoming',  isEvent: true },
  ],
}

const PILOT_NOTES = [
  { ok: true,  text: 'Manila = benchmark. Do ocular **1 month before**, resolve roadblocks **3 weeks before**.' },
  { ok: true,  text: 'Offline USB install strategy for restricted school WiFi — works.' },
  { ok: true,  text: '4-hour dry run format validated.' },
  { ok: false, text: 'Updated installation guide being prepared by Mike + Lady — wait for final version before proceeding.' },
  { ok: false, text: 'Per-chapter qty allocation must be confirmed in tracker before packing begins.' },
]

/* ── status pills for checklist ─────────────────────────────────────────── */
const CHECK_BADGE: Record<CheckStatus, { color: string; bg: string; border: string; label: string }> = {
  done:        { color: '#14b8a6', bg: 'rgba(20,184,166,0.12)',  border: 'rgba(20,184,166,0.3)',  label: '✓ DONE'        },
  executed:    { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',   border: 'rgba(6,182,212,0.3)',   label: '✓ EXECUTED'    },
  overdue:     { color: '#e11d48', bg: 'rgba(225,29,72,0.12)',   border: 'rgba(225,29,72,0.3)',   label: '⚠ OVERDUE'    },
  confirm:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)',  label: '⚠ CONFIRM'    },
  in_progress: { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)', label: '⚠ IN PROGRESS' },
  pending:     { color: '#475569', bg: 'rgba(71,85,105,0.12)',   border: 'rgba(71,85,105,0.3)',   label: '— PENDING'    },
  upcoming:    { color: '#334155', bg: 'rgba(51,65,85,0.12)',    border: 'rgba(51,65,85,0.25)',   label: '· UPCOMING'   },
}

/* ── relative time helper ────────────────────────────────────────────────── */
function relativeDay(isoDate: string | null): string {
  if (!isoDate) return 'TBD'
  const diff = Math.round((new Date(isoDate).getTime() - Date.now()) / 86_400_000)
  if (diff === 0) return 'Today'
  if (diff > 0)  return `In ${diff} day${diff !== 1 ? 's' : ''}`
  return `${Math.abs(diff)} day${Math.abs(diff) !== 1 ? 's' : ''} ago`
}

/* ── Checklist row ───────────────────────────────────────────────────────── */
function CheckRow({ item }: { item: CheckItem }) {
  const s = CHECK_BADGE[item.status]
  return (
    <div
      style={{
        display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: '14px',
        alignItems: 'center', padding: '13px 18px',
        background: item.isEvent ? 'rgba(6,182,212,0.04)' : '#0f172a',
        border: `1px solid ${item.isEvent ? 'rgba(6,182,212,0.2)' : '#1e293b'}`,
        borderRadius: '12px', transition: 'border-color .2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.35)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = item.isEvent ? 'rgba(6,182,212,0.2)' : '#1e293b')}
    >
      {/* T-code */}
      <span style={{ fontSize: '9px', fontWeight: 800, fontFamily: 'monospace', color: item.isEvent ? '#06b6d4' : '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {item.tCode}
      </span>
      {/* Task + date */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: item.isEvent ? '#cfd5dd' : '#cbd5e1', marginBottom: '2px' }}>{item.task}</div>
        <div style={{ fontSize: '10px', color: '#475569' }}>{item.date}</div>
      </div>
      {/* Status pill */}
      <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '8px', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
        {s.label}
      </span>
    </div>
  )
}

/* ── Main component ──────────────────────────────────────────────────────── */
interface Props { chapterId: string; chapters: Chapter[]; onBack: () => void }

export default function ChapterDetailPanel({ chapterId, chapters, onBack }: Props) {
  const chapter = chapters.find(c => c.id === chapterId)
  if (!chapter) return null

  const accent  = accentOf(chapter)
  const sb      = statusBadge[chapter.status]
  const checklist = CHECKLIST[chapterId] ?? []
  const relDay  = relativeDay(chapter.date_iso)

  /* Liquidation status — infer from checklist or todos */
  const liqItem = checklist.find(i => i.tCode === 'T+7')
  const liqStatus = liqItem?.status ?? (chapter.status === 'completed' ? 'confirm' : 'upcoming')
  const liqLabel  = liqStatus === 'done' ? '✓ Settled' : liqStatus === 'confirm' ? '⚠ Confirm' : liqStatus === 'overdue' ? '⚠ Overdue' : '— TBD'
  const liqColor  = liqStatus === 'done' ? '#14b8a6' : liqStatus === 'overdue' ? '#e11d48' : liqStatus === 'confirm' ? '#f59e0b' : '#475569'

  /* Stat tiles */
  const statTiles = [
    { label: 'Event Date',  value: chapter.date_text || 'TBD',                                      color: accent           },
    { label: 'Countdown',   value: relDay,                                                            color: '#8899aa'        },
    { label: 'Pax Target',  value: chapter.pax_target ? String(chapter.pax_target) : 'TBD',         color: accent           },
    { label: 'Actual Pax',  value: chapter.pax_actual ? String(chapter.pax_actual) : 'TBC ⚠',       color: chapter.pax_actual ? '#14b8a6' : '#f59e0b' },
    { label: 'Merch',       value: chapter.merch_status,                                              color: chapter.merch_status.startsWith('✓') ? '#14b8a6' : '#f59e0b' },
    { label: 'Liquidation', value: liqLabel,                                                          color: liqColor         },
  ]

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', fontSize: '11px', fontWeight: 700, color: '#64748b', cursor: 'pointer', transition: 'all .2s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)'; e.currentTarget.style.color = '#cfd5dd' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.color = '#64748b' }}
      >
        ← All Chapters
      </button>

      {/* ── Hero card ────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '18px', padding: '28px', overflow: 'hidden' }}>
        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${accent}, transparent)` }} />
        {/* Faded chapter number */}
        <div style={{ position: 'absolute', top: '10px', right: '24px', fontFamily: 'monospace', fontWeight: 900, fontSize: '80px', lineHeight: 1, color: `${accent}12`, userSelect: 'none', pointerEvents: 'none' }}>
          {chapter.number.padStart(2, '0')}
        </div>

        {/* Badge row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <Badge variant={sb.variant}>{sb.label}</Badge>
          <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px', borderRadius: '8px', background: `${accent}14`, border: `1px solid ${accent}35`, color: accent }}>
            CHAPTER {chapter.number} · {chapter.region}
          </span>
        </div>

        {/* Chapter name */}
        <h2 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 900, color: '#cfd5dd', lineHeight: 1.1, margin: '0 0 8px' }}>
          {chapter.name}
        </h2>

        {/* Date / venue / lead */}
        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 2 }}>
          {chapter.date_text} · {chapter.venue}<br />
          <span style={{ color: '#475569' }}>Lead: {chapter.lead_name}</span>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
            <span>Progress</span>
            <span style={{ color: accent, fontWeight: 700 }}>{chapter.progress_percent}%</span>
          </div>
          <ProgressBar
            percent={chapter.progress_percent}
            color={chapter.color === 'yellow' ? 'yellow' : chapter.color === 'teal' ? 'teal' : chapter.color === 'purple' ? 'purple' : 'default'}
          />
        </div>
      </div>

      {/* ── Stat tiles ───────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '8px' }}>
        {statTiles.map(t => (
          <div key={t.label} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '16px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginBottom: '8px' }}>{t.label}</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: t.color, lineHeight: 1.2 }}>{t.value}</div>
          </div>
        ))}
      </div>

      {/* ── Content update alert ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '10px', padding: '12px 16px', background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '12px', fontSize: '12px', color: '#8899aa' }}>
        <span style={{ fontSize: '13px', flexShrink: 0 }}>📋</span>
        <span>
          <strong style={{ color: '#06b6d4' }}>Content Update:</strong> Mike and Lady are updating the code camp content, installation guide, and installation procedures based on learnings from the Letran pilot. All subsequent chapters will use the updated version.
        </span>
      </div>

      {/* ── Countdown Checklist ──────────────────────────────────────────── */}
      {checklist.length > 0 && (
        <div>
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', margin: 0 }}>
              Event Countdown Checklist
              {chapter.date_iso && (
                <span style={{ color: '#334155', marginLeft: '10px' }}>
                  · {chapter.date_text}{chapter.venue ? ' · ' + chapter.venue.split(',')[0] : ''}
                </span>
              )}
            </p>
          </div>

          {/* How to read strip */}
          <div style={{ marginBottom: '14px', padding: '10px 14px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px' }}>
            <div style={{ fontSize: '10px', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>🗓 How to read this checklist — counting down to event day:</div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
              {[
                { code: 'PRE', hint: 'Done before countdown started', color: '#475569' },
                { code: 'T-35', hint: '35 days before', color: '#64748b' },
                { code: 'T-30', hint: 'Ocular visit', color: '#64748b' },
                { code: 'T-21', hint: '21 days before', color: '#64748b' },
                { code: 'T-14', hint: 'Verified & ready', color: '#64748b' },
                { code: 'T-7',  hint: 'Dry run', color: '#64748b' },
                { code: 'T-3',  hint: 'Final prep', color: '#64748b' },
                { code: 'T-0 ☻', hint: 'Event day', color: '#06b6d4' },
                { code: 'T+3 / T+7', hint: 'Wrap-ups: pax, receipts, report', color: '#8899aa' },
              ].map(p => (
                <span key={p.code} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '8px', fontWeight: 800, fontFamily: 'monospace', padding: '2px 6px', borderRadius: '4px', background: 'rgba(71,85,105,0.15)', border: '1px solid #1e293b', color: p.color, whiteSpace: 'nowrap' }}>{p.code}</span>
                  <span style={{ fontSize: '9px', color: '#334155', whiteSpace: 'nowrap' }}>{p.hint}</span>
                  <span style={{ color: '#1e293b', margin: '0 2px' }}>·</span>
                </span>
              ))}
            </div>
          </div>

          {/* Checklist rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {checklist.map((item, i) => <CheckRow key={i} item={item} />)}
          </div>
        </div>
      )}

      {/* ── Open Tasks (from DB todos) ───────────────────────────────────── */}
      {chapter.todos.length > 0 && (
        <div>
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '14px' }}>Open Tasks</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {chapter.todos.map(t => (
              <div
                key={t.id}
                style={{
                  display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: '14px',
                  alignItems: 'flex-start', padding: '13px 18px',
                  background: t.status === 'urgent' ? 'rgba(225,29,72,0.05)' : '#0f172a',
                  border: `1px solid ${t.status === 'urgent' ? 'rgba(225,29,72,0.25)' : '#1e293b'}`,
                  borderRadius: '12px', transition: 'border-color .2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.35)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = t.status === 'urgent' ? 'rgba(225,29,72,0.25)' : '#1e293b')}
              >
                <span style={{ fontSize: '12px', paddingTop: '1px' }}>{t.status === 'urgent' ? '🔴' : '→'}</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#cfd5dd', marginBottom: '2px' }}>
                    <span style={{ color: accent }}>{t.owner}:</span> {t.description}
                  </div>
                </div>
                {t.status === 'urgent' && (
                  <span style={{ fontSize: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '3px 8px', borderRadius: '6px', background: 'rgba(225,29,72,0.12)', color: '#e11d48', border: '1px solid rgba(225,29,72,0.3)', whiteSpace: 'nowrap' }}>URGENT</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Pilot Notes ──────────────────────────────────────────────────── */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px 22px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#06b6d4', marginBottom: '14px' }}>
          Pilot Notes — for all chapters
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {PILOT_NOTES.map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '12px', color: '#8899aa', lineHeight: 1.6 }}>
              <span style={{ flexShrink: 0, marginTop: '2px', width: '6px', height: '6px', borderRadius: '50%', background: n.ok ? '#14b8a6' : '#f59e0b', display: 'inline-block' }} />
              <span dangerouslySetInnerHTML={{ __html: n.text.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#cfd5dd">$1</strong>') }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Post-event template (completed chapters only) ─────────────────── */}
      {chapter.status === 'completed' && (
        <div>
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '14px' }}>Post-Event SITREP Template</p>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' }}>
            <pre style={{ fontSize: '10px', color: '#64748b', lineHeight: 1.9, whiteSpace: 'pre-wrap', margin: 0 }}>{`EVENT SITREP — ${chapter.name}
Date:         ${chapter.date_text}
Lead:         ${chapter.lead_name}
Actual pax:   [number] (target: ${chapter.pax_target ?? 'TBC'})
Session:      [Part 1 only / Part 1 + Dinner]
Key outcomes: [projects, moments]
BIR invoices: [collected / pending]
Liquidation:  [submitted / pending by date]
Issues:       [list or NONE]`}</pre>
          </div>
        </div>
      )}

    </div>
  )
}
