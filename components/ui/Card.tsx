export default function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#0D1420] border border-[rgba(77,162,255,0.15)] rounded-[10px] p-[18px] transition-colors hover:border-[rgba(77,162,255,0.4)] ${className}`}>
      {children}
    </div>
  )
}
