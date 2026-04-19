'use client'
import PanelHeader from '@/components/ui/PanelHeader'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import type { Chapter, BadgeVariant } from '@/lib/types'

const statusBadge: Record<string, { variant: BadgeVariant; label: string }> = {
  completed:     { variant: 'done',    label: '✓ Completed'     },
  rescheduling:  { variant: 'warn',    label: '⚠ Rescheduling'  },
  in_progress:   { variant: 'pending', label: '🔄 In Progress'  },
  pencil_booked: { variant: 'warn',    label: '📌 Pencil-booked' },
  tbc:           { variant: 'tbc',     label: 'TBC / At Risk'   },
  activating:    { variant: 'warn',    label: '⚠ Activating'    },
}

function getMerchBadge(s: string): { variant: BadgeVariant; label: string } {
  if (s.startsWith('✓'))                                     return { variant: 'done', label: s }
  if (s.includes('TBC') || s.toLowerCase().includes('tbc')) return { variant: 'tbc',  label: s }
  if (s.includes('Not Yet'))                                 return { variant: 'risk', label: s }
  return                                                            { variant: 'warn', label: s }
}

const accentOf = (c: Chapter) =>
  c.color === 'teal' ? '#14b8a6' : c.color === 'yellow' ? '#f59e0b' : c.color === 'purple' ? '#a78bfa' : '#06b6d4'

const STAT_COLORS = [
  { color: '#14b8a6', bg: 'rgba(20,184,166,0.06)',  border: 'rgba(20,184,166,0.2)'  },
  { color: '#f59e0b', bg: 'rgba(245,158,11,0.06)',  border: 'rgba(245,158,11,0.2)'  },
  { color: '#e11d48', bg: 'rgba(225,29,72,0.06)',   border: 'rgba(225,29,72,0.2)'   },
  { color: '#a78bfa', bg: 'rgba(167,139,250,0.06)', border: 'rgba(167,139,250,0.2)' },
]

export default function ChaptersPanel({ chapters, onShowChapter }: { chapters: Chapter[]; onShowChapter: (id: string) => void }) {
  const done   = chapters.filter(c => c.status === 'completed').length
  const active = chapters.filter(c => ['in_progress','activating','pencil_booked'].includes(c.status)).length
  const resch  = chapters.filter(c => c.status === 'rescheduling').length
  const tbc    = chapters.filter(c => c.status === 'tbc').length

  const stats = [
    { n: done,         lbl: 'Completed',    dot: '🟢' },
    { n: active,       lbl: 'Active',       dot: '🔄' },
    { n: resch,        lbl: 'Rescheduling', dot: '⚠' },
    { n: tbc,          lbl: 'TBC / At Risk',dot: '🟣' },
  ]

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <PanelHeader
        eyebrow="Q2 2026"
        title="All Chapters"
        subtitle={`${chapters.length} chapters across the Philippines.`}
        right={
          <span style={{ fontSize: '12px', color: '#64748b', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '999px', padding: '4px 12px' }}>
            Click any chapter to open detail
          </span>
        }
      />

      {/* Stat tiles */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((s, i) => {
          const c = STAT_COLORS[i]
          return (
            <div key={s.lbl} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '34px', fontWeight: 800, color: c.color, lineHeight: 1 }}>{s.n}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '8px' }}>
                <span style={{ fontSize: '10px' }}>{s.dot}</span>
                <span style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{s.lbl}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chapter card rows */}
      <div>
        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '14px' }}>Chapter Overview</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {chapters.map(c => {
            const b      = statusBadge[c.status]
            const m      = getMerchBadge(c.merch_status)
            const accent = accentOf(c)
            return (
              <div
                key={c.id}
                onClick={() => onShowChapter(c.id)}
                style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto auto', gap: '14px', alignItems: 'center', padding: '16px 18px', background: '#0f172a', border: '1px solid #1e293b', borderLeft: `3px solid ${accent}`, borderRadius: '14px', cursor: 'pointer', transition: 'border-color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.35)')}
                onMouseLeave={e => { e.currentTarget.style.borderLeft = `3px solid ${accent}`; e.currentTarget.style.borderColor = '#1e293b' }}
              >
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', fontFamily: 'monospace' }}>{c.number}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#cfd5dd', marginBottom: '3px' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
                    {c.lead_name.split('&')[0].trim()} · {c.venue.split(',')[0]}
                  </div>
                  <ProgressBar
                    percent={c.progress_percent}
                    color={c.color === 'yellow' ? 'yellow' : c.color === 'teal' ? 'teal' : c.color === 'purple' ? 'purple' : 'default'}
                  />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: accent }}>{c.pax_target ?? 'TBC'}</div>
                  <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>target pax</div>
                  <div style={{ fontSize: '9px', color: '#475569', marginTop: '6px' }}>{c.countdown_text}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                  <Badge variant={b.variant}>{b.label}</Badge>
                  <Badge variant={m.variant}>{m.label}</Badge>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick nav */}
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '12px' }}>Quick Navigation</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {chapters.map(c => {
            const accent = accentOf(c)
            return (
              <button key={c.id} onClick={() => onShowChapter(c.id)}
                style={{ padding: '7px 14px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, background: `${accent}14`, border: `1px solid ${accent}40`, color: accent, cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = `${accent}25`)}
                onMouseLeave={e => (e.currentTarget.style.background = `${accent}14`)}
              >
                Ch{c.number} {c.city}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
