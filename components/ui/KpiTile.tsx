const colorMap = {
  blue:   { num: '#06b6d4', border: 'rgba(6,182,212,0.3)',   bg: 'rgba(6,182,212,0.06)'  },
  teal:   { num: '#14b8a6', border: 'rgba(20,184,166,0.35)', bg: 'rgba(20,184,166,0.06)' },
  green:  { num: '#14b8a6', border: 'rgba(20,184,166,0.5)',  bg: 'rgba(20,184,166,0.08)' },
  yellow: { num: '#f59e0b', border: 'rgba(245,158,11,0.3)',  bg: 'rgba(245,158,11,0.06)' },
  red:    { num: '#e11d48', border: 'rgba(225,29,72,0.3)',   bg: 'rgba(225,29,72,0.06)'  },
}

export default function KpiTile({
  value, label, sublabel, color = 'blue',
}: {
  value: string; label: string; sublabel?: string; color?: keyof typeof colorMap
}) {
  const c = colorMap[color]
  return (
    <div
      className="bg-[#0f172a] rounded-2xl p-4 text-center"
      style={{ border: `1px solid ${c.border}`, background: `linear-gradient(135deg, ${c.bg}, transparent)` }}
    >
      <div className="font-extrabold leading-none mb-1.5" style={{ fontSize: 26, color: c.num }}>
        {value}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: c.num }}>
        {label}
      </div>
      {sublabel && <div className="text-[9px] text-[#64748b] mt-1">{sublabel}</div>}
    </div>
  )
}
