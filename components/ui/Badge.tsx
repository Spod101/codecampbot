import type { BadgeVariant } from '@/lib/types'

const styles: Record<BadgeVariant, string> = {
  done: 'bg-[rgba(0,212,170,0.12)] text-[#00D4AA] border border-[rgba(0,212,170,0.3)]',
  warn: 'bg-[rgba(255,181,71,0.12)] text-[#FFB547] border border-[rgba(255,181,71,0.3)]',
  risk: 'bg-[rgba(255,77,106,0.12)] text-[#FF4D6A] border border-[rgba(255,77,106,0.3)]',
  pending: 'bg-[rgba(77,162,255,0.1)] text-[#4DA2FF] border border-[rgba(77,162,255,0.3)]',
  tbc: 'bg-[rgba(120,100,255,0.12)] text-[#A78BFA] border border-[rgba(120,100,255,0.3)]',
  cancelled: 'bg-[rgba(120,120,120,0.12)] text-[#888] border border-[rgba(120,120,120,0.3)]',
}

export default function Badge({ variant, children }: { variant: BadgeVariant; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase tracking-[0.05em] whitespace-nowrap ${styles[variant]}`}>
      {children}
    </span>
  )
}
