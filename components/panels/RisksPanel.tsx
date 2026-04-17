import PanelHeader from '@/components/ui/PanelHeader'
import Badge from '@/components/ui/Badge'
import type { Risk } from '@/lib/types'

const SEV: Record<string, { color: string; bg: string; border: string; label: string }> = {
  high:   { color: '#e11d48', bg: 'rgba(225,29,72,0.1)',  border: 'rgba(225,29,72,0.3)',  label: 'HIGH'   },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', label: 'MED'    },
  low:    { color: '#14b8a6', bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.3)', label: 'LOW'    },
}

const tagVariant: Record<string, 'warn' | 'risk' | 'pending' | 'tbc' | 'done'> = {
  'Tacloban': 'risk', 'Laguna': 'tbc', 'Iloilo': 'warn',
  'Pampanga': 'warn', 'All Chapters': 'warn', 'All': 'warn', 'HQ': 'pending',
}

export default function RisksPanel({ risks }: { risks: Risk[] }) {
  const high   = risks.filter(r => r.severity === 'high').length
  const medium = risks.filter(r => r.severity === 'medium').length
  const low    = risks.filter(r => r.severity === 'low').length
  const open   = risks.filter(r => r.status === 'open').length

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <PanelHeader
        eyebrow="Operations"
        title="Risk Register"
        subtitle="Active risks and blockers across all chapters."
        right={
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#e11d48', background: 'rgba(225,29,72,0.08)', border: '1px solid rgba(225,29,72,0.25)', borderRadius: '999px', padding: '5px 14px' }}>
            {open} open
          </span>
        }
      />

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { n: high,   lbl: 'High Severity',   ...SEV.high   },
          { n: medium, lbl: 'Medium Severity',  ...SEV.medium },
          { n: low,    lbl: 'Low Severity',     ...SEV.low    },
        ].map(s => (
          <div key={s.lbl} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.n}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.color }} />
              <span style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{s.lbl}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Risk card rows */}
      <div>
        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '14px' }}>Active Risk Register</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {risks.map(risk => {
            const sev = SEV[risk.severity]
            const tv  = tagVariant[risk.chapter_tag] ?? 'pending'
            return (
              <div
                key={risk.id}
                style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto auto', gap: '14px', alignItems: 'flex-start', padding: '16px 18px', background: '#0f172a', border: '1px solid #1e293b', borderLeft: `3px solid ${sev.color}`, borderRadius: '14px', transition: 'border-color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.35)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}
              >
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', fontFamily: 'monospace', paddingTop: '1px' }}>{risk.code}</span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>{risk.title}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.6, marginBottom: '8px' }}>{risk.description}</div>
                  <Badge variant={tv}>{risk.chapter_tag}</Badge>
                </div>
                <span style={{ fontSize: '11px', color: '#475569', whiteSpace: 'nowrap', paddingTop: '1px' }}>{risk.owner.split(' /')[0]}</span>
                <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '8px', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', background: sev.bg, color: sev.color, border: `1px solid ${sev.border}` }}>
                  {sev.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
