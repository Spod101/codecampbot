import { PAX_ROWS } from '@/lib/data'
import KpiTile from '@/components/ui/KpiTile'
import SectionTitle from '@/components/ui/SectionTitle'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import type { Chapter, Kpi, BadgeVariant } from '@/lib/types'

const statusBadge: Record<string, { variant: BadgeVariant; label: string }> = {
  completed:     { variant: 'done', label: '✓ Completed' },
  rescheduling:  { variant: 'warn', label: '⚠ Rescheduling' },
  in_progress:   { variant: 'pending', label: '⚠ In Progress' },
  pencil_booked: { variant: 'warn', label: '📌 Pencil-booked' },
  tbc:           { variant: 'tbc', label: '⚠ TBC / At Risk' },
  activating:    { variant: 'warn', label: '⚠ Activating' },
}

interface Props {
  kpis: Kpi[]
  chapters: Chapter[]
}

export default function KpiPanel({ kpis, chapters }: Props) {
  return (
    <div className="animate-fade-in">
      {/* KPI Tiles */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-[10px] mb-6">
        {kpis.map(k => (
          <KpiTile key={k.id} value={k.value} label={k.label} sublabel={k.sublabel} color={k.color} />
        ))}
      </div>

      {/* National Pax KPI */}
      <SectionTitle>National Pax KPI — MOU Progress</SectionTitle>
      <Card className="mb-5">
        <div className="flex items-center justify-between mb-[18px] flex-wrap gap-3">
          <div>
            <div className="font-mono font-extrabold leading-none text-[#4DA2FF]" style={{ fontSize: 44 }}>
              0<span className="text-[24px] text-[#7A8BA8]"> / 600</span>
            </div>
            <div className="text-[10px] text-[#7A8BA8] uppercase tracking-[0.08em] mt-1">Total Participants Logged · MOU Minimum: 500</div>
          </div>
          <div className="flex gap-4 flex-wrap">
            {[{ val: '1', lbl: 'Done', color: '#00D4AA' }, { val: '3', lbl: 'Q2 Active', color: '#FFB547' }, { val: '1', lbl: 'Q3 Pending', color: '#4DA2FF' }, { val: '1', lbl: 'TBC', color: '#A78BFA' }].map(s => (
              <div key={s.lbl} className="text-center">
                <div className="text-[22px] font-extrabold font-mono" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[9px] text-[#7A8BA8] uppercase tracking-[0.06em]">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-[7px]">
          <div className="flex justify-between text-[10px] text-[#7A8BA8] mb-1 font-mono"><span>MOU Minimum (500 pax)</span><span>0 / 500</span></div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: '0%' }} /></div>
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-[#7A8BA8] mb-1 font-mono"><span>Projected Target (600 pax)</span><span>0 / 600</span></div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: '0%', background: 'linear-gradient(90deg,#00D4AA,#00ffcc)' }} /></div>
        </div>
        <div className="mt-3 p-[10px_13px] bg-[rgba(255,77,106,0.07)] border border-[rgba(255,77,106,0.2)] rounded-md text-[11px] text-[#7A8BA8]">
          ⚠ <strong className="text-[#FF4D6A]">ACTION REQUIRED:</strong> Log Manila actual pax count. All chapters report within T+3 days of event.
        </div>
      </Card>

      {/* Per-Event Pax Breakdown */}
      <SectionTitle>Per-Event Pax Breakdown</SectionTitle>
      <Card className="mb-5">
        {PAX_ROWS.map((row, i) => (
          <div key={i} className="grid grid-cols-[160px_1fr_70px] gap-3 items-center py-3 border-b border-[rgba(77,162,255,0.06)] last:border-b-0 max-[600px]:grid-cols-1">
            <div>
              <div className="text-[12px] font-semibold">{row.chapter_name}</div>
              <div className="font-mono text-[10px] text-[#7A8BA8] mt-0.5">{row.date_text}</div>
            </div>
            <div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: '0%' }} /></div>
              <div className="font-mono text-[10px] mt-0.5" style={{ color: row.note_color }}>{row.note}</div>
            </div>
            <div className="font-mono text-[12px] text-right text-[#4DA2FF]">
              {row.actual ?? '–'}<br /><span className="text-[9px] text-[#7A8BA8]">/ {row.target ?? 'TBC'}</span>
            </div>
          </div>
        ))}
      </Card>

      {/* Master Schedule Table */}
      <SectionTitle>Master Schedule</SectionTitle>
      <div className="overflow-x-auto border border-[rgba(77,162,255,0.15)] rounded-lg mb-5">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="bg-[#131C2E]">
              {['#', 'Date', 'Chapter', 'Lead', 'Venue', 'Pax Target', 'Countdown', 'Status'].map(h => (
                <th key={h} className="p-[10px_13px] text-left text-[9px] font-bold uppercase tracking-[0.1em] text-[#7A8BA8] font-mono border-b border-[rgba(77,162,255,0.15)] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chapters.map(c => {
              const b = statusBadge[c.status]
              return (
                <tr key={c.id} className="hover:[&>td]:bg-[rgba(77,162,255,0.03)] transition-colors">
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)] font-mono">{c.number}</td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)] font-mono text-[11px]" style={{ color: c.status === 'rescheduling' || c.status === 'tbc' ? '#FFB547' : undefined }}>{c.date_text}</td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)]"><strong>{c.name}</strong></td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)] text-[#7A8BA8] text-[11px]">{c.lead_name}</td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)] text-[#7A8BA8] text-[11px]">{c.venue}</td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)] font-mono">{c.pax_target ?? 'TBC'}</td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)] font-mono text-[10px] text-[#7A8BA8]">{c.countdown_text}</td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)]"><Badge variant={b.variant}>{b.label}</Badge></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
