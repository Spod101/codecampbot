import type { BadgeVariant } from '@/lib/types'

const styles: Record<BadgeVariant, string> = {
  done:      'bg-[rgba(20,184,166,0.12)]  text-[#14b8a6] border border-[rgba(20,184,166,0.3)]',
  warn:      'bg-[rgba(245,158,11,0.12)]  text-[#f59e0b] border border-[rgba(245,158,11,0.3)]',
  risk:      'bg-[rgba(225,29,72,0.12)]   text-[#e11d48] border border-[rgba(225,29,72,0.3)]',
  pending:   'bg-[rgba(6,182,212,0.1)]    text-[#06b6d4] border border-[rgba(6,182,212,0.3)]',
  tbc:       'bg-[rgba(120,100,255,0.12)] text-[#a78bfa] border border-[rgba(120,100,255,0.3)]',
  cancelled: 'bg-[rgba(100,116,139,0.1)] text-[#64748b] border border-[rgba(100,116,139,0.3)]',
}

export default function Badge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-[0.06em] whitespace-nowrap ${styles[variant]}`}>
      {children}
    </span>
  )
}
