'use client'
import SectionTitle from '@/components/ui/SectionTitle'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import Card from '@/components/ui/Card'
import type { Chapter, BadgeVariant } from '@/lib/types'

const statusBadge: Record<string, { variant: BadgeVariant; label: string }> = {
  completed:     { variant: 'done', label: '✓ Completed' },
  rescheduling:  { variant: 'warn', label: '⚠ Rescheduling' },
  in_progress:   { variant: 'pending', label: '⚠ In Progress' },
  pencil_booked: { variant: 'warn', label: '📌 Pencil-booked' },
  tbc:           { variant: 'tbc', label: 'TBC / At Risk Cancel' },
  activating:    { variant: 'warn', label: '⚠ Activating' },
}

function getMerchBadge(merch_status: string): { variant: BadgeVariant; label: string } {
  if (merch_status.startsWith('✓')) return { variant: 'done', label: merch_status }
  if (merch_status.includes('TBC') || merch_status.toLowerCase().includes('tbc')) return { variant: 'tbc', label: merch_status }
  if (merch_status.includes('Not Yet')) return { variant: 'risk', label: merch_status }
  return { variant: 'warn', label: merch_status }
}

interface Props {
  chapters: Chapter[]
  onShowChapter: (id: string) => void
}

export default function ChaptersPanel({ chapters, onShowChapter }: Props) {
  return (
    <div className="animate-fade-in">
      <div className="bg-[rgba(77,162,255,0.06)] border border-[rgba(77,162,255,0.2)] rounded-lg p-[11px_14px] text-[12px] text-[#7A8BA8] leading-[1.7] mb-4">
        <strong className="text-[#4DA2FF]">Click any chapter tab</strong> (teal buttons in the nav) for the full individual chapter page. Below is the summary overview. Mike and Lady are actively updating code camp content and installation guide based on Letran pilot learnings.
      </div>

      {/* Summary Table */}
      <div className="overflow-x-auto border border-[rgba(77,162,255,0.15)] rounded-lg mb-6">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="bg-[#131C2E]">
              {['#', 'Chapter', 'Lead', 'Date', 'Venue', 'Target', 'Countdown', 'Merch', 'Status'].map(h => (
                <th key={h} className="p-[10px_13px] text-left text-[9px] font-bold uppercase tracking-[0.1em] text-[#7A8BA8] font-mono border-b border-[rgba(77,162,255,0.15)] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chapters.map(c => {
              const b = statusBadge[c.status]
              const m = getMerchBadge(c.merch_status)
              return (
                <tr key={c.id} className="cursor-pointer hover:[&>td]:bg-[rgba(77,162,255,0.03)]" onClick={() => onShowChapter(c.id)}>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)] font-mono">{c.number}</td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)]"><strong>{c.name}</strong></td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)] text-[#7A8BA8] text-[11px]">{c.lead_name}</td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)] font-mono text-[11px]">{c.date_text}</td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)] text-[#7A8BA8] text-[11px]">{c.venue.split(',')[0]}</td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)] font-mono">{c.pax_target ?? 'TBC'}</td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)] font-mono text-[10px] text-[#7A8BA8]">{c.countdown_text}</td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)]"><Badge variant={m.variant}>{m.label}</Badge></td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)]"><Badge variant={b.variant}>{b.label}</Badge></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Chapter Quick Cards */}
      <SectionTitle>Chapter Detail Cards</SectionTitle>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[12px]">
        {chapters.map(c => {
          const b = statusBadge[c.status]
          const labelColor = c.color === 'blue' ? '#4DA2FF' : c.color === 'teal' ? '#00D4AA' : c.color === 'yellow' ? '#FFB547' : '#A78BFA'
          return (
            <Card key={c.id} className="cursor-pointer" >
              <div onClick={() => onShowChapter(c.id)}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-mono text-[10px] mb-0.5" style={{ color: labelColor }}>CHAPTER {c.number}</div>
                    <div className="text-[15px] font-extrabold text-white">{c.name}</div>
                    <div className="font-mono text-[10px] text-[#7A8BA8] mt-0.5">{c.lead_name}</div>
                  </div>
                  <Badge variant={b.variant}>{b.label}</Badge>
                </div>
                <div className="font-mono text-[11px] mb-1.5" style={{ color: labelColor }}>{c.date_text}</div>
                <div className="font-mono text-[10px] text-[#7A8BA8] mb-2">{c.venue}</div>
                <ProgressBar percent={c.progress_percent} color={c.color === 'yellow' ? 'yellow' : c.color === 'teal' ? 'teal' : c.color === 'purple' ? 'purple' : 'default'} />
                <div className="font-mono text-[10px] text-[#7A8BA8] mt-1">{c.countdown_text}</div>
              </div>
              {c.todos.length > 0 && (
                <div className="border-t border-[rgba(77,162,255,0.1)] mt-3 pt-3 flex flex-col gap-1">
                  {c.todos.slice(0, 2).map(t => (
                    <div key={t.id} className="flex items-start gap-1.5 text-[11px]">
                      <span className={`flex-shrink-0 font-bold ${t.status === 'urgent' ? 'text-[#FF4D6A]' : 'text-[#FFB547]'}`}>→</span>
                      <span className="text-[#7A8BA8]"><strong className="text-[#E8F0FF]">{t.owner}:</strong> {t.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
