import PanelHeader from '@/components/ui/PanelHeader'
import type { Contact } from '@/lib/types'

const TEAMS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  sui_foundation: { label: 'Sui Foundation',       color: '#06b6d4', bg: 'rgba(6,182,212,0.08)',   border: 'rgba(6,182,212,0.25)'   },
  chapter_lead:   { label: 'DEVCON Chapter Leads', color: '#14b8a6', bg: 'rgba(20,184,166,0.08)',  border: 'rgba(20,184,166,0.25)'  },
  content_team:   { label: 'Content Team',         color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.25)' },
}

function ContactRow({ c, accent }: { c: Contact; accent: string }) {
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: '14px', alignItems: 'center', padding: '14px 18px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', transition: 'border-color .2s' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.35)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}
    >
      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${accent}18`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
        {c.emoji}
      </div>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#cfd5dd', marginBottom: '2px' }}>{c.name}</div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>
          {c.role}{c.note ? <span style={{ color: '#475569' }}> · {c.note}</span> : null}
        </div>
      </div>
      <span style={{ fontSize: '11px', fontWeight: 600, color: accent, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{c.handle}</span>
    </div>
  )
}

export default function ContactsPanel({ contacts }: { contacts: Contact[] }) {
  const grouped = {
    sui_foundation: contacts.filter(c => c.team === 'sui_foundation'),
    chapter_lead:   contacts.filter(c => c.team === 'chapter_lead'),
    content_team:   contacts.filter(c => c.team === 'content_team'),
  }

  const teamKeys = Object.keys(grouped) as (keyof typeof grouped)[]

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <PanelHeader
        eyebrow="Team"
        title="Contacts"
        subtitle={`${contacts.length} people across ${teamKeys.filter(k => grouped[k].length > 0).length} teams`}
      />

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-3">
        {teamKeys.map(key => {
          const cfg = TEAMS[key]
          const count = grouped[key].length
          return (
            <div key={key} style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '16px', padding: '22px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 800, color: cfg.color, lineHeight: 1 }}>{count}</div>
              <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginTop: '8px' }}>{cfg.label}</div>
            </div>
          )
        })}
      </div>

      {/* Per-team contact rows */}
      {teamKeys.map(key => {
        const list = grouped[key]
        if (!list.length) return null
        const cfg = TEAMS[key]
        return (
          <div key={key}>
            <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '14px' }}>{cfg.label}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {list.map(c => <ContactRow key={c.id} c={c} accent={cfg.color} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
