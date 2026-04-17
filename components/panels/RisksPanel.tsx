import { RISKS } from '@/lib/data'
import SectionTitle from '@/components/ui/SectionTitle'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

const sevStyles = {
  high:   { cls: 'bg-[rgba(255,77,106,0.15)] text-[#FF4D6A]', label: '🔴 HIGH' },
  medium: { cls: 'bg-[rgba(255,181,71,0.15)] text-[#FFB547]', label: '🟡 MED' },
  low:    { cls: 'bg-[rgba(0,212,170,0.15)] text-[#00D4AA]', label: '🟢 LOW' },
}

const tagVariant: Record<string, 'warn' | 'risk' | 'pending' | 'tbc' | 'done'> = {
  'Tacloban': 'risk', 'Laguna': 'tbc', 'Iloilo': 'warn',
  'Pampanga': 'warn', 'All Chapters': 'warn', 'All': 'warn', 'HQ': 'pending',
}

export default function RisksPanel() {
  const high   = RISKS.filter(r => r.severity === 'high').length
  const medium = RISKS.filter(r => r.severity === 'medium').length
  const low    = RISKS.filter(r => r.severity === 'low').length

  return (
    <div className="animate-fade-in">
      {/* Summary counts */}
      <div className="flex gap-2.5 mb-[18px] flex-wrap">
        {[
          { count: high,   label: '🔴 High',   border: 'rgba(255,77,106,0.3)',  color: '#FF4D6A' },
          { count: medium, label: '🟡 Medium', border: 'rgba(255,181,71,0.3)',  color: '#FFB547' },
          { count: low,    label: '🟢 Low',    border: 'rgba(0,212,170,0.3)',   color: '#00D4AA' },
          { count: RISKS.filter(r => r.status === 'open').length, label: 'Total Open', border: 'rgba(77,162,255,0.15)', color: '#7A8BA8' },
        ].map(s => (
          <div key={s.label} className="flex-1 min-w-[110px] text-center bg-[#0D1420] rounded-[10px] p-[18px] border" style={{ borderColor: s.border }}>
            <div className="text-[28px] font-extrabold font-mono" style={{ color: s.color }}>{s.count}</div>
            <div className="text-[9px] text-[#7A8BA8] uppercase tracking-[0.08em] mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <SectionTitle>Active Risk Register</SectionTitle>

      {RISKS.map(risk => {
        const sev = sevStyles[risk.severity]
        const tv = tagVariant[risk.chapter_tag] ?? 'pending'
        return (
          <div
            key={risk.id}
            className="grid gap-2.5 items-start p-[13px] rounded-lg bg-[#131C2E] mb-[7px] border border-[rgba(77,162,255,0.15)] hover:border-[rgba(77,162,255,0.4)] transition-colors"
            style={{ gridTemplateColumns: '26px 1fr auto auto' }}
          >
            <div className="font-mono text-[10px] text-[#7A8BA8] pt-0.5">{risk.code}</div>
            <div>
              <div className="text-[12px] font-semibold text-[#E8F0FF] leading-[1.4]">{risk.title}</div>
              <div className="text-[11px] text-[#7A8BA8] mt-0.5 leading-[1.6]">{risk.description}</div>
              <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                <Badge variant={tv}>{risk.chapter_tag}</Badge>
                <span className="font-mono text-[10px] text-[#7A8BA8]">Owner: {risk.owner}</span>
              </div>
            </div>
            <div className="font-mono text-[10px] text-[#7A8BA8] whitespace-nowrap">{risk.owner.split(' /')[0]}</div>
            <div>
              <span className={`inline-flex font-mono text-[9px] font-bold px-[7px] py-[2px] rounded-sm uppercase whitespace-nowrap ${sev.cls}`}>
                {sev.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
