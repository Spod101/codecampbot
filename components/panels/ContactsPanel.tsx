import { CONTACTS } from '@/lib/data'
import SectionTitle from '@/components/ui/SectionTitle'

function ContactCard({ emoji, name, role, handle, note }: {
  emoji: string; name: string; role: string; handle: string; note?: string | null
}) {
  const isNumeric = !isNaN(Number(emoji))
  return (
    <div className="flex items-center gap-3 p-[13px] bg-[#131C2E] border border-[rgba(77,162,255,0.15)] rounded-lg hover:border-[rgba(77,162,255,0.4)] transition-colors">
      <div className="w-9 h-9 rounded-[7px] bg-[rgba(77,162,255,0.15)] border border-[rgba(77,162,255,0.3)] flex items-center justify-center flex-shrink-0"
        style={{ fontSize: isNumeric ? 14 : 14, fontFamily: isNumeric ? "'Space Mono', monospace" : undefined, fontWeight: isNumeric ? 800 : undefined }}
      >
        {emoji}
      </div>
      <div>
        <div className="text-[12px] font-bold text-[#E8F0FF]">{name}</div>
        <div className="text-[10px] text-[#7A8BA8] mt-0.5">{role}</div>
        <div className="font-mono text-[10px] text-[#4DA2FF] mt-0.5">{handle}</div>
        {note && <div className="text-[10px] text-[#7A8BA8] mt-0.5">{note}</div>}
      </div>
    </div>
  )
}

export default function ContactsPanel() {
  const sui = CONTACTS.filter(c => c.team === 'sui_foundation')
  const leads = CONTACTS.filter(c => c.team === 'chapter_lead')
  const content = CONTACTS.filter(c => c.team === 'content_team')

  return (
    <div className="animate-fade-in">
      <SectionTitle>Sui Foundation Team</SectionTitle>
      <div className="grid grid-cols-3 gap-[14px] mb-5 max-[900px]:grid-cols-1">
        {sui.map(c => (
          <ContactCard key={c.id} emoji={c.emoji} name={c.name} role={c.role} handle={c.handle} note={c.note} />
        ))}
      </div>

      <SectionTitle>DEVCON Chapter Leads</SectionTitle>
      <div className="grid grid-cols-3 gap-[14px] mb-5 max-[900px]:grid-cols-1">
        {leads.map(c => (
          <ContactCard key={c.id} emoji={c.emoji} name={c.name} role={c.role} handle={c.handle} note={c.note} />
        ))}
      </div>

      <SectionTitle>Content Update Team</SectionTitle>
      <div className="grid grid-cols-2 gap-[14px] max-[640px]:grid-cols-1">
        {content.map(c => (
          <ContactCard key={c.id} emoji={c.emoji} name={c.name} role={c.role} handle={c.handle} note={c.note} />
        ))}
      </div>
    </div>
  )
}
