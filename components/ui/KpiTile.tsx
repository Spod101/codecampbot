const colorMap = {
  blue: { num: '#4DA2FF', border: 'rgba(77,162,255,0.3)' },
  teal: { num: '#00D4AA', border: 'rgba(0,212,170,0.35)' },
  green: { num: '#00D4AA', border: 'rgba(0,212,170,0.5)' },
  yellow: { num: '#FFB547', border: 'rgba(255,181,71,0.3)' },
  red: { num: '#FF4D6A', border: 'rgba(255,77,106,0.3)' },
}

export default function KpiTile({
  value, label, sublabel, color = 'blue',
}: {
  value: string; label: string; sublabel?: string; color?: keyof typeof colorMap
}) {
  const c = colorMap[color]
  return (
    <div
      className="bg-[#0D1420] rounded-[10px] p-[14px_12px] text-center"
      style={{ border: `1px solid ${c.border}` }}
    >
      <div className="font-mono font-extrabold leading-none mb-[5px]" style={{ fontSize: 28, color: c.num }}>
        {value}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.06em]" style={{ color: c.num }}>
        {label}
      </div>
      {sublabel && <div className="text-[9px] text-[#7A8BA8] mt-0.5">{sublabel}</div>}
    </div>
  )
}
