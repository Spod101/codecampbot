'use client'
import SectionTitle from '@/components/ui/SectionTitle'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import Card from '@/components/ui/Card'
import type { Chapter, BadgeVariant } from '@/lib/types'

const statusBadge: Record<string, { variant: BadgeVariant; label: string }> = {
  completed:     { variant: 'done', label: '✓ COMPLETED' },
  rescheduling:  { variant: 'warn', label: '⚠ RESCHEDULING' },
  in_progress:   { variant: 'pending', label: '🔄 IN PROGRESS' },
  pencil_booked: { variant: 'warn', label: '📌 PENCIL-BOOKED' },
  tbc:           { variant: 'tbc', label: 'TBC / AT RISK' },
  activating:    { variant: 'warn', label: '⚠ ACTIVATING' },
}

const colorMap = {
  blue:   { accent: '#4DA2FF', border: 'rgba(77,162,255,0.3)' },
  teal:   { accent: '#00D4AA', border: 'rgba(0,212,170,0.3)' },
  yellow: { accent: '#FFB547', border: 'rgba(255,181,71,0.3)' },
  purple: { accent: '#A78BFA', border: 'rgba(167,139,250,0.3)' },
}

const chapterNotes: Record<string, string[]> = {
  manila: [
    '✅ Code camp executed successfully on Mar 28, 2026 at Letran Intramuros.',
    '📝 Mike and Lady are updating code camp content + installation guide based on Letran pilot learnings.',
    '⚠ Actual pax count TBC — update post-event. Log within T+3 days.',
    '💰 Liquidation confirmation needed from Dom/Jedd.',
    '📦 Merch fully distributed to participants and organizers.',
  ],
  tacloban: [
    '🔴 Original Apr 11 date did not push through. LNU rescheduling in progress.',
    '⏰ Must lock new date before May 1 to stay within Q2 window.',
    '📋 Formal ocular at LNU still pending — complete ASAP after date is confirmed.',
    '📦 Merch status: confirm after reschedule is finalized.',
  ],
  iloilo: [
    '⚡ Apr 18: Sui-Supported Developer Event at WVSU BINHI TBI (NOT a code camp).',
    '🏕 May 16: Sui Code Camp at Central Philippine University, Jaro.',
    '📦 Merch already sent ahead for both events.',
    '📐 T-30 ocular due Apr 16 — Ted to visit CPU Jaro immediately.',
    '🏢 WVSU venue for Apr 18 needs formal written confirmation.',
  ],
  bukidnon: [
    '✅ Financial issue resolved — Cash Advance approved.',
    '📅 Event date confirmed: May 6, 2026 at Bukidnon State University.',
    '📦 Merch NOT YET SENT — must be packed and shipped before T-7 (Apr 29).',
    '📐 Ocular at BSU + lab installation planning must happen this week.',
    '👥 Local student outreach for Sui workshop to be finalized by Zhi.',
  ],
  pampanga: [
    '📌 Slot pencil-booked — chapter request for Sui Move Code Camp at CCA submitted.',
    '📋 Formal Sui Foundation slot confirmation still pending (Joash to confirm).',
    '📐 T-30 ocular due May 25 — Joash to schedule formal visit to CCA.',
    '👥 Mentor recruitment in progress for Pampanga.',
  ],
  laguna: [
    '🟣 No confirmed slot yet — awaiting June go/no-go from Dom.',
    '⚠ Risk of cancellation if confirmation does not come through.',
    '🏢 No venue or timeline started. John Danmel to scout potential venues.',
    '📅 If not confirmed by mid-May, slot will be cancelled.',
  ],
}

interface Props {
  chapterId: string
  chapters: Chapter[]
  onBack: () => void
}

export default function ChapterDetailPanel({ chapterId, chapters, onBack }: Props) {
  const chapter = chapters.find(c => c.id === chapterId)
  if (!chapter) return null

  const b = statusBadge[chapter.status]
  const c = colorMap[chapter.color]
  const notes = chapterNotes[chapterId] ?? []

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#131C2E] border border-[rgba(77,162,255,0.15)] rounded-md text-[11px] font-bold font-mono text-[#7A8BA8] mb-4 hover:text-[#E8F0FF] hover:border-[rgba(77,162,255,0.4)] transition-all"
      >
        ← Back to All Chapters
      </button>

      {/* Hero */}
      <div className="bg-[#0D1420] border border-[rgba(77,162,255,0.15)] rounded-[12px] p-6 mb-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${c.accent}, transparent)` }} />
        <div className="absolute top-[10px] right-6 font-mono font-bold leading-none text-[rgba(77,162,255,0.08)]" style={{ fontSize: 64 }}>
          {chapter.number.padStart(2, '0')}
        </div>
        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
          <Badge variant={b.variant}>{b.label}</Badge>
          <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-[0.05em] bg-[rgba(77,162,255,0.1)] text-[#4DA2FF] border border-[rgba(77,162,255,0.3)]">
            CHAPTER {chapter.number} · {chapter.region}
          </span>
        </div>
        <div className="text-[clamp(20px,3vw,30px)] font-extrabold text-white mb-1">{chapter.name}</div>
        <div className="font-mono text-[11px] text-[#7A8BA8] leading-[2]">
          {chapter.date_text} · {chapter.venue}<br />
          Lead: {chapter.lead_name}
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2.5 mt-4">
          {[
            { label: 'Event Date', value: chapter.date_text, cls: 'teal' },
            { label: 'Pax Target', value: chapter.pax_target ? String(chapter.pax_target) : 'TBC', cls: 'blue' },
            { label: 'Actual Pax', value: chapter.pax_actual ? String(chapter.pax_actual) : 'TBC ⚠', cls: 'yellow' },
            { label: 'Progress', value: `${chapter.progress_percent}%`, cls: chapter.progress_percent === 100 ? 'teal' : 'blue' },
            { label: 'Merch', value: chapter.merch_status, cls: chapter.merch_status.startsWith('✓') ? 'teal' : 'yellow' },
            { label: 'Countdown', value: chapter.countdown_text, cls: 'blue' },
          ].map(m => (
            <div key={m.label} className="bg-[#131C2E] border border-[rgba(77,162,255,0.15)] rounded-md p-[10px_12px]">
              <div className="text-[9px] uppercase tracking-[0.1em] text-[#7A8BA8] font-mono">{m.label}</div>
              <div className={`text-[13px] font-bold mt-0.5 ${m.cls === 'teal' ? 'text-[#00D4AA]' : m.cls === 'yellow' ? 'text-[#FFB547]' : m.cls === 'red' ? 'text-[#FF4D6A]' : 'text-[#4DA2FF]'}`}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <ProgressBar percent={chapter.progress_percent} color={chapter.color === 'yellow' ? 'yellow' : chapter.color === 'teal' ? 'teal' : chapter.color === 'purple' ? 'purple' : 'default'} />
      </div>

      {/* Notes / Status */}
      {notes.length > 0 && (
        <>
          <SectionTitle>📋 Chapter Status Notes</SectionTitle>
          <Card className="mb-5">
            <div className="flex flex-col gap-2">
              {notes.map((note, i) => (
                <div key={i} className="flex gap-2 text-[12px] text-[#7A8BA8] leading-[1.7]">
                  <span className="flex-shrink-0 w-1 mt-[6px] h-1 rounded-full bg-[#4DA2FF]" />
                  {note}
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* Tasks */}
      {chapter.todos.length > 0 && (
        <>
          <SectionTitle>✅ Open Tasks</SectionTitle>
          <div className="flex flex-col gap-2 mb-5">
            {chapter.todos.map(t => (
              <div
                key={t.id}
                className={`flex items-start gap-3 p-[13px_14px] rounded-lg border transition-colors ${
                  t.status === 'urgent'
                    ? 'bg-[rgba(255,77,106,0.06)] border-[rgba(255,77,106,0.2)]'
                    : 'bg-[#131C2E] border-[rgba(77,162,255,0.15)] hover:border-[rgba(77,162,255,0.4)]'
                }`}
              >
                <span className={`flex-shrink-0 font-bold text-[14px] mt-0.5 ${t.status === 'urgent' ? 'text-[#FF4D6A]' : 'text-[#FFB547]'}`}>→</span>
                <div className="flex-1">
                  <span className="text-[12px] text-[#7A8BA8]">
                    <strong className="text-[#E8F0FF]">{t.owner}:</strong> {t.description}
                  </span>
                  {t.status === 'urgent' && (
                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded font-mono text-[8px] font-bold uppercase bg-[rgba(255,77,106,0.12)] text-[#FF4D6A] border border-[rgba(255,77,106,0.3)]">
                      URGENT
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Templates for completed chapters */}
      {chapter.status === 'completed' && (
        <>
          <SectionTitle>📄 Post-Event SITREP Template</SectionTitle>
          <Card className="mb-5">
            <pre className="font-mono text-[10px] text-[#7A8BA8] leading-[2] whitespace-pre-wrap">{`EVENT SITREP — ${chapter.name}
Date: ${chapter.date_text}
Lead: ${chapter.lead_name}
Actual pax: [number] (target: ${chapter.pax_target})
Session: [Part 1 only / Part 1 + Dinner]
Key outcomes: [projects, DeepSurge, moments]
BIR invoices: [collected / pending]
Liquidation: [submitted / pending by date]
Issues: [list or NONE]`}</pre>
          </Card>
        </>
      )}
    </div>
  )
}
