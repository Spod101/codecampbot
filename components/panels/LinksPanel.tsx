'use client'
import { LINKS, CHAPTERS } from '@/lib/data'
import SectionTitle from '@/components/ui/SectionTitle'

const iconColorClass: Record<string, string> = {
  blue:   'bg-[rgba(77,162,255,0.12)] border-[rgba(77,162,255,0.25)]',
  teal:   'bg-[rgba(0,212,170,0.12)] border-[rgba(0,212,170,0.25)]',
  yellow: 'bg-[rgba(255,181,71,0.12)] border-[rgba(255,181,71,0.25)]',
  purple: 'bg-[rgba(120,100,255,0.12)] border-[rgba(120,100,255,0.25)]',
}

const chapterIconColors: Record<string, string> = {
  manila: 'teal', tacloban: 'yellow', iloilo: 'blue',
  bukidnon: 'teal', pampanga: 'blue', laguna: 'purple',
}
const chapterNumbers: Record<string, string> = {
  manila: '1️⃣', tacloban: '2️⃣', iloilo: '3️⃣',
  bukidnon: '4️⃣', pampanga: '5️⃣', laguna: '6️⃣',
}

const contactLinks = [
  { name: 'Harrison Kim',       role: 'Sui Partnership Coordinator', handle: '@web3tree', icon: '🌐', color: 'blue' },
  { name: 'Nicole Gomez',       role: 'Sui PH Team / Coordinator',   handle: '@nicgomez', icon: '💜', color: 'blue' },
  { name: 'Jianyi',             role: 'Sui DevRel · DeepSurge · Install Guide', handle: '@zero_x_j', icon: '⚙️', color: 'blue' },
  { name: 'Ted Hyacinth Aspera',role: 'Iloilo Chapter Lead',          handle: 'ted@devcon.ph', icon: '📧', color: 'teal' },
  { name: 'Zhi / Zhor El (VP)', role: 'Bukidnon Chapter Lead',        handle: 'zhi@devcon.ph',  icon: '📧', color: 'teal' },
]

export default function LinksPanel({ onShowChapter }: { onShowChapter: (id: string) => void }) {
  return (
    <div className="animate-fade-in">
      {/* Chapter sub-pages */}
      <SectionTitle>Chapter Subpages — Unique URLs</SectionTitle>
      <div className="bg-[rgba(77,162,255,0.06)] border border-[rgba(77,162,255,0.2)] rounded-lg p-[11px_14px] text-[12px] text-[#7A8BA8] leading-[1.7] mb-4">
        Each chapter has its own dedicated view. Share these links with chapter leads and interns for focused tracking.
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 mb-5">
        {CHAPTERS.map(c => (
          <button
            key={c.id}
            onClick={() => onShowChapter(c.id)}
            className="flex items-center gap-3 p-[14px_16px] bg-[#0D1420] border border-[rgba(77,162,255,0.15)] rounded-[10px] text-left transition-all hover:border-[rgba(77,162,255,0.4)] hover:bg-[#131C2E] hover:-translate-y-[1px] cursor-pointer"
          >
            <div className={`w-9 h-9 rounded-[7px] flex items-center justify-center text-[16px] flex-shrink-0 border ${iconColorClass[chapterIconColors[c.id]]}`}>
              {chapterNumbers[c.id]}
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#E8F0FF]">{c.name}</div>
              <div className="font-mono text-[11px] text-[#7A8BA8] mt-0.5">{c.date_text} · {c.status.replace(/_/g, ' ')}</div>
              <div className="font-mono text-[10px] text-[#4DA2FF] mt-0.5">#chapter/{c.id}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Operations Resources */}
      <SectionTitle>Google Drive & Operations Resources</SectionTitle>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3 mb-5">
        {LINKS.map(link => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-[14px_16px] bg-[#0D1420] border border-[rgba(77,162,255,0.15)] rounded-[10px] transition-all hover:border-[rgba(77,162,255,0.4)] hover:bg-[#131C2E] hover:-translate-y-[1px]"
          >
            <div className={`w-9 h-9 rounded-[7px] flex items-center justify-center text-[16px] flex-shrink-0 border ${iconColorClass[link.icon_color]}`}>
              {link.icon}
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#E8F0FF]">{link.name}</div>
              <div className="font-mono text-[11px] text-[#7A8BA8] mt-0.5">{link.description}</div>
              <div className="font-mono text-[10px] text-[#4DA2FF] mt-0.5 break-all">Google Drive / Docs</div>
            </div>
          </a>
        ))}
      </div>

      {/* Key Contacts */}
      <SectionTitle>Key Contacts & Handles</SectionTitle>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {contactLinks.map(c => (
          <div key={c.name} className="flex items-center gap-3 p-[14px_16px] bg-[#0D1420] border border-[rgba(77,162,255,0.15)] rounded-[10px] hover:border-[rgba(77,162,255,0.4)] transition-colors">
            <div className={`w-9 h-9 rounded-[7px] flex items-center justify-center text-[16px] flex-shrink-0 border ${iconColorClass[c.color]}`}>
              {c.icon}
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#E8F0FF]">{c.name}</div>
              <div className="font-mono text-[11px] text-[#7A8BA8] mt-0.5">{c.role}</div>
              <div className="font-mono text-[10px] text-[#4DA2FF] mt-0.5">{c.handle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
