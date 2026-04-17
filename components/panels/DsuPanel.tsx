'use client'
import { CHAPTERS, KPIS } from '@/lib/data'
import KpiTile from '@/components/ui/KpiTile'
import SectionTitle from '@/components/ui/SectionTitle'
import ProgressBar from '@/components/ui/ProgressBar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import type { BadgeVariant } from '@/lib/types'

const statusBadge: Record<string, { variant: BadgeVariant; label: string }> = {
  completed:     { variant: 'done', label: '✓ Done' },
  rescheduling:  { variant: 'warn', label: '⚠ Rescheduling' },
  in_progress:   { variant: 'pending', label: '🔄 In Progress' },
  pencil_booked: { variant: 'warn', label: '📌 Pencil-booked' },
  tbc:           { variant: 'tbc', label: 'TBC' },
  activating:    { variant: 'warn', label: '⚠ Activating' },
}

const dotColor: Record<string, string> = {
  completed:     '#00D4AA',
  in_progress:   '#4DA2FF',
  rescheduling:  '#FFB547',
  pencil_booked: '#00D4AA',
  tbc:           '#A78BFA',
  activating:    '#FFB547',
}

const chapterDateColor: Record<string, string> = {
  completed:     '#00D4AA',
  in_progress:   '#4DA2FF',
  rescheduling:  '#FFB547',
  pencil_booked: '#00D4AA',
  tbc:           '#A78BFA',
}

const campBorderColor: Record<string, string> = {
  blue: 'border-l-[#4DA2FF]',
  teal: 'border-l-[#00D4AA]',
  yellow: 'border-l-[#FFB547]',
  purple: 'border-l-[#A78BFA]',
}

export default function DsuPanel({ onShowChapter }: { onShowChapter: (id: string) => void }) {
  const high = CHAPTERS.filter(c => c.todos.some(t => t.status === 'urgent'))

  return (
    <div className="animate-fade-in">
      {/* DSU Header */}
      <div className="bg-[#0D1420] border border-[rgba(77,162,255,0.25)] rounded-[12px] overflow-hidden mb-5">
        <div className="h-0.5 bg-gradient-to-r from-[#4DA2FF] via-[#00D4AA] to-[#4DA2FF]" />
        <div className="flex items-start justify-between flex-wrap gap-3 p-[16px_20px]">
          <div>
            <div className="font-mono text-[9px] text-[#4DA2FF] tracking-[0.15em] uppercase mb-1">📝 DEVCON Ops — Monday Morning DSU</div>
            <div className="text-[20px] font-extrabold text-white">Monday, April 13, 2026</div>
            <div className="font-mono text-[10px] text-[#7A8BA8] mt-0.5">Sui Build Beyond DEVCON PH · Q2 · 78 days remaining</div>
          </div>
          <div className="font-mono text-[10px] text-[#00D4AA] bg-[rgba(0,212,170,0.1)] border border-[rgba(0,212,170,0.3)] px-3 py-1.5 rounded-md inline-flex items-center gap-1.5 self-start">
            <span className="animate-[pulse_2s_infinite]">●</span> Live Tracker
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <SectionTitle>📊 KPI Summary</SectionTitle>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-[10px] mb-5">
        {KPIS.map(k => (
          <KpiTile key={k.id} value={k.value} label={k.label} sublabel={k.sublabel} color={k.color} />
        ))}
      </div>

      {/* Camp Progress Cards */}
      <SectionTitle>🏕 Program Progress</SectionTitle>
      <div className="grid grid-cols-2 gap-[14px] mb-5 max-[640px]:grid-cols-1">
        {/* Code Camps */}
        <div className="bg-[#0D1420] border border-[rgba(77,162,255,0.3)] rounded-[10px] p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-[3px] rounded-l-[3px] bg-[#4DA2FF]" />
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] font-mono text-[#4DA2FF] mb-2">🏕 Sui Code Camps</div>
          <div className="flex items-baseline gap-[5px] mb-2">
            <span className="text-[38px] font-extrabold font-mono text-[#4DA2FF] leading-none">1</span>
            <span className="text-[18px] font-extrabold font-mono text-[#7A8BA8]">/ 5</span>
            <span className="text-[11px] text-[#7A8BA8] ml-1">done</span>
          </div>
          <ProgressBar percent={20} />
          <div className="flex flex-col gap-1 mt-2">
            {CHAPTERS.filter(c => c.number !== '6').map(c => (
              <div key={c.id} className="flex items-center gap-[7px] text-[11px]">
                <span className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: dotColor[c.status] }} />
                <span className="text-[#7A8BA8]">
                  {c.name.replace('– NCR','– Letran').replace('– WV','– CPU Jaro').replace('– EV','– LNU')}{' '}
                  <em className="font-mono text-[10px]" style={{ color: dotColor[c.status] }}>
                    {c.status === 'completed' ? '✓ Done' : c.date_text === 'TBD' ? 'TBD' : c.date_text.split(',')[0]}
                  </em>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dev Events */}
        <div className="bg-[#0D1420] border border-[rgba(255,181,71,0.3)] rounded-[10px] p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-[3px] rounded-l-[3px] bg-[#FFB547]" />
          <div className="text-[10px] font-bold uppercase tracking-[0.1em] font-mono text-[#FFB547] mb-2">⚡ Sui Developer Events</div>
          <div className="flex items-baseline gap-[5px] mb-2">
            <span className="text-[38px] font-extrabold font-mono text-[#FFB547] leading-none">2</span>
            <span className="text-[18px] font-extrabold font-mono text-[#7A8BA8]">/ 5</span>
            <span className="text-[11px] text-[#7A8BA8] ml-1">done</span>
          </div>
          <ProgressBar percent={40} color="yellow" />
          <div className="flex flex-col gap-1 mt-2 text-[11px] text-[#7A8BA8]">
            <div className="flex items-center gap-2"><span className="w-[7px] h-[7px] rounded-full bg-[#00D4AA] flex-shrink-0" />Bayleaf Intramuros National Kickoff <em className="font-mono text-[10px] text-[#00D4AA]">✓ Done</em></div>
            <div className="flex items-center gap-2"><span className="w-[7px] h-[7px] rounded-full bg-[#00D4AA] flex-shrink-0" />SHEisDEVCON Manila <em className="font-mono text-[10px] text-[#00D4AA]">✓ Done</em></div>
            <div className="flex items-center gap-2"><span className="w-[7px] h-[7px] rounded-full bg-[#FFB547] flex-shrink-0" />SHEisDEVCON Iloilo <em className="font-mono text-[10px] text-[#FFB547]">Apr 18</em></div>
            <div className="flex items-center gap-2"><span className="w-[7px] h-[7px] rounded-full bg-[#4DA2FF] flex-shrink-0" />SHEisDEVCON Event 4 <em className="font-mono text-[10px] text-[#4DA2FF]">May</em></div>
            <div className="flex items-center gap-2"><span className="w-[7px] h-[7px] rounded-full bg-[#00D4AA] flex-shrink-0" />SHEisDEVCON Event 5 <em className="font-mono text-[10px] text-[#00D4AA]">Jun</em></div>
          </div>
        </div>
      </div>

      {/* Camp Schedule Cards */}
      <SectionTitle>📅 Camp Schedule & Countdown</SectionTitle>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[12px] mb-5">
        {CHAPTERS.filter(c => c.id !== 'manila').map(chapter => {
          const b = statusBadge[chapter.status]
          const bc = campBorderColor[chapter.color]
          return (
            <div key={chapter.id} className={`bg-[#0D1420] border border-[rgba(77,162,255,0.15)] border-l-[3px] ${bc} rounded-[10px] p-4`}>
              <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                  <div className="text-[13px] font-extrabold text-white">{chapter.city}</div>
                  <div className="font-mono text-[10px] text-[#7A8BA8] mt-0.5">{chapter.venue.split(',')[0]} · Lead: {chapter.lead_name.split('&')[0].trim()}</div>
                </div>
                <Badge variant={b.variant}>{b.label}</Badge>
              </div>
              <div className="font-mono text-[11px] mb-1" style={{ color: chapterDateColor[chapter.status] }}>
                {chapter.date_text}
              </div>
              <ProgressBar percent={chapter.progress_percent} color={chapter.color === 'yellow' ? 'yellow' : chapter.color === 'teal' ? 'teal' : chapter.color === 'purple' ? 'purple' : 'default'} />
              <div className="font-mono text-[10px] text-[#7A8BA8] mt-1 mb-2">{chapter.countdown_text}</div>
              <div className="border-t border-[rgba(77,162,255,0.1)] pt-2 flex flex-col gap-1">
                {chapter.todos.slice(0, 3).map(t => (
                  <div key={t.id} className="flex items-start gap-2 text-[11px]">
                    <span className={`flex-shrink-0 mt-0.5 font-bold ${t.status === 'urgent' ? 'text-[#FF4D6A]' : 'text-[#FFB547]'}`}>→</span>
                    <span className="text-[#7A8BA8]"><strong className="text-[#E8F0FF]">{t.owner}:</strong> {t.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* High Risks */}
      <SectionTitle>⚠️ High Risks & Blockers</SectionTitle>
      <div className="flex flex-col gap-2 mb-5">
        <div className="flex gap-3 items-start p-[13px_14px] rounded-lg bg-[rgba(255,77,106,0.07)] border border-[rgba(255,77,106,0.25)]">
          <span className="text-[16px] leading-[1.4] flex-shrink-0">🔴</span>
          <div>
            <div className="text-[13px] font-bold text-[#FF4D6A] mb-0.5">Tacloban Rescheduling</div>
            <div className="text-[12px] text-[#7A8BA8] leading-[1.6]">Date still TBC. Rolf to confirm by end of week. Must lock before May 1 to stay within Q2 window.</div>
            <div className="mt-1.5 font-mono text-[10px] text-[#FF4D6A]">OWNER: Rolf · DEADLINE: End of this week</div>
          </div>
        </div>
        <div className="flex gap-3 items-start p-[13px_14px] rounded-lg bg-[rgba(167,139,250,0.07)] border border-[rgba(167,139,250,0.25)]">
          <span className="text-[16px] leading-[1.4] flex-shrink-0">🟣</span>
          <div>
            <div className="text-[13px] font-bold text-[#A78BFA] mb-0.5">Laguna — No Confirmed Slot</div>
            <div className="text-[12px] text-[#7A8BA8] leading-[1.6]">Lead assigned: John Danmel. Awaiting June go/no-go from Dom. Risk of cancellation.</div>
            <div className="mt-1.5 font-mono text-[10px] text-[#A78BFA]">OWNER: Dom / John Danmel · ACTION: Confirm slot or cancel</div>
          </div>
        </div>
        <div className="flex gap-3 items-start p-[13px_14px] rounded-lg bg-[rgba(255,181,71,0.07)] border border-[rgba(255,181,71,0.25)]">
          <span className="text-[16px] leading-[1.4] flex-shrink-0">🟡</span>
          <div>
            <div className="text-[13px] font-bold text-[#FFB547] mb-0.5">Ocular Readiness — Bukidnon & Iloilo</div>
            <div className="text-[12px] text-[#7A8BA8] leading-[1.6]">Both chapters in T-30 window. Ocular reports due immediately. Delay in ocular = delay in installation.</div>
            <div className="mt-1.5 font-mono text-[10px] text-[#FFB547]">OWNER: Zhi (BSU) · Ted / Marica (CPU + WVSU) · Schedule this week</div>
          </div>
        </div>
      </div>

      {/* To-Do List Per Camp */}
      <SectionTitle>✅ To-Do List Per Camp</SectionTitle>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[12px] mb-5">
        {CHAPTERS.filter(c => c.todos.length > 0).map(chapter => {
          const labelColor = chapter.color === 'blue' ? '#4DA2FF' : chapter.color === 'teal' ? '#00D4AA' : chapter.color === 'yellow' ? '#FFB547' : '#A78BFA'
          return (
            <Card key={chapter.id}>
              <div className="text-[10px] font-bold font-mono uppercase tracking-[0.1em] mb-2.5" style={{ color: labelColor }}>
                📍 {chapter.name}
              </div>
              {chapter.todos.map(t => (
                <div key={t.id} className="flex items-start gap-2 text-[12px] py-0.5">
                  <span className={`flex-shrink-0 mt-0.5 font-bold ${t.status === 'urgent' ? 'text-[#FF4D6A]' : 'text-[#FFB547]'}`} style={{ color: labelColor }}>→</span>
                  <span className="text-[#7A8BA8]"><strong className="text-[#E8F0FF]">{t.owner}:</strong> {t.description}</span>
                </div>
              ))}
            </Card>
          )
        })}
        <Card>
          <div className="text-[10px] font-bold font-mono uppercase tracking-[0.1em] mb-2.5 text-[#7A8BA8]">📍 General / Backlog</div>
          <div className="flex items-start gap-2 text-[12px]">
            <span className="text-[#4DA2FF] font-bold flex-shrink-0">→</span>
            <span className="text-[#7A8BA8]"><strong className="text-[#E8F0FF]">Dom:</strong> Draft Q2 narrative report outline for Sui Foundation</span>
          </div>
        </Card>
      </div>

      {/* Quick Chapter Nav */}
      <div className="p-[14px_16px] bg-[#0D1420] border border-[rgba(77,162,255,0.15)] rounded-lg">
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A8BA8] font-mono mb-2.5">Jump to Chapter</div>
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'manila', label: 'Ch1 Manila ✓', cls: 'bg-[rgba(0,212,170,0.1)] border-[rgba(0,212,170,0.3)] text-[#00D4AA]' },
            { id: 'tacloban', label: 'Ch2 Tacloban ⚠', cls: 'bg-[rgba(255,181,71,0.1)] border-[rgba(255,181,71,0.3)] text-[#FFB547]' },
            { id: 'iloilo', label: 'Ch3 Iloilo 🔄', cls: 'bg-[rgba(77,162,255,0.1)] border-[rgba(77,162,255,0.3)] text-[#4DA2FF]' },
            { id: 'bukidnon', label: 'Ch4 Bukidnon', cls: 'bg-[rgba(0,212,170,0.1)] border-[rgba(0,212,170,0.3)] text-[#00D4AA]' },
            { id: 'pampanga', label: 'Ch5 Pampanga', cls: 'bg-[rgba(77,162,255,0.1)] border-[rgba(77,162,255,0.3)] text-[#4DA2FF]' },
            { id: 'laguna', label: 'Ch6 Laguna TBC', cls: 'bg-[rgba(167,139,250,0.1)] border-[rgba(167,139,250,0.3)] text-[#A78BFA]' },
          ].map(b => (
            <button key={b.id} onClick={() => onShowChapter(b.id)}
              className={`px-[13px] py-[7px] rounded-md text-[11px] font-bold border transition-all hover:opacity-80 hover:-translate-y-[1px] font-sans ${b.cls}`}>
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
