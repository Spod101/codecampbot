export default function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#4DA2FF] mb-[14px] font-mono">
      {children}
      <span className="flex-1 h-px bg-[rgba(77,162,255,0.15)]" />
    </div>
  )
}
