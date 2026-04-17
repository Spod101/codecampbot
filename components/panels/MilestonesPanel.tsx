import { MILESTONE_ROWS, MONTHS, CURRENT_MONTH } from '@/lib/data'
import Card from '@/components/ui/Card'
import SectionTitle from '@/components/ui/SectionTitle'

const cellStyle = {
  done:     'text-[#00D4AA] font-semibold',
  active:   'text-[#FFB547] font-semibold',
  upcoming: 'text-[#7A8BA8]',
}

export default function MilestonesPanel() {
  return (
    <div className="animate-fade-in">
      <div className="bg-[rgba(77,162,255,0.06)] border border-[rgba(77,162,255,0.2)] rounded-lg p-[11px_14px] text-[12px] text-[#7A8BA8] leading-[1.7] mb-4">
        <strong className="text-[#4DA2FF]">Partnership KPI Recap</strong> — Dec '25 (Q4) → Nov '26 (Q4). Currently in{' '}
        <strong className="text-[#FFB547]">April '26 (Q2)</strong>. ✅ = Completed · 🔄 = Active · — = Not yet started
      </div>

      {/* Milestone Table */}
      <div className="overflow-x-auto border border-[rgba(77,162,255,0.15)] rounded-[10px] mb-5">
        <table className="border-collapse text-[11px]" style={{ minWidth: 900, width: '100%' }}>
          <thead>
            <tr>
              <th className="p-[9px_11px] text-left text-[9px] font-bold uppercase tracking-[0.08em] text-[#7A8BA8] font-mono border-b border-r border-[rgba(77,162,255,0.15)] bg-[#131C2E] whitespace-nowrap min-w-[170px]">
                Milestone
              </th>
              {MONTHS.map(m => (
                <th
                  key={m}
                  className={`p-[9px_11px] text-center text-[9px] font-bold uppercase tracking-[0.08em] font-mono border-b border-r border-[rgba(77,162,255,0.15)] whitespace-nowrap ${
                    m === CURRENT_MONTH
                      ? 'bg-[rgba(255,181,71,0.08)] text-[#FFB547] border-l-2 border-r-2 border-l-[rgba(255,181,71,0.4)] border-r-[rgba(255,181,71,0.4)]'
                      : 'bg-[#131C2E] text-[#7A8BA8]'
                  }`}
                >
                  {m}
                  {m === CURRENT_MONTH && (
                    <div className="text-[8px] opacity-80">◄ NOW</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MILESTONE_ROWS.map((row, ri) => (
              <tr key={ri} className="hover:[&>td]:bg-[rgba(77,162,255,0.03)]">
                <td className="p-[11px_12px] border-b border-r border-[rgba(77,162,255,0.06)] border-r-[rgba(77,162,255,0.15)] font-semibold text-[#E8F0FF] text-[12px] bg-[rgba(77,162,255,0.03)]">
                  {row.label}
                </td>
                {MONTHS.map(m => {
                  const cell = row.months[m]
                  const isNow = m === CURRENT_MONTH
                  return (
                    <td
                      key={m}
                      className={`p-[9px_11px] border-b border-r border-[rgba(77,162,255,0.06)] text-center align-middle text-[11px] ${
                        isNow ? 'bg-[rgba(255,181,71,0.04)] border-l-2 border-r-2 border-l-[rgba(255,181,71,0.2)] border-r-[rgba(255,181,71,0.2)]' : ''
                      } ${cell ? cellStyle[cell.type as keyof typeof cellStyle] : 'text-[#7A8BA8]'}`}
                    >
                      {cell ? cell.text : '—'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Q1 Completed + Q2 Active */}
      <div className="grid grid-cols-2 gap-[14px] max-[640px]:grid-cols-1">
        <Card>
          <SectionTitle>Q1 Completed ✅</SectionTitle>
          <div className="flex flex-col gap-[7px] text-[12px] text-[#7A8BA8]">
            {[
              'Partnership Media Kickoff — Mar 26 · Bayleaf Intramuros (20–30 pax)',
              'DEVCON Kids Micro:bit — 25 pcs donations + Hour of AI support',
              'Code Camp Mentor Training Phase 1 (Feb) + Phase 2 (Mar)',
              'SHEisDEVCON Chapter Event 1 — Mar',
              'Manila Pilot Code Camp — Mar 28, Letran',
              'DEVCON Studios Feature 1 (Jan) + Feature 2 (Mar)',
              'Q1 Report submitted',
            ].map((item, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-[#00D4AA] flex-shrink-0">✅</span>
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Q2 Active 🔄 — Now</SectionTitle>
          <div className="flex flex-col gap-[7px] text-[12px] text-[#7A8BA8]">
            {[
              { text: 'Code Camp Mentor Training Phase 3 — Online (Apr)', color: '#FFB547', icon: '🔄' },
              { text: 'SHEisDEVCON Events 2 & 3 — Apr (Iloilo + TBD)', color: '#FFB547', icon: '🔄' },
              { text: 'Iloilo Sui-Supported Developer Event — Apr 18 (not code camp)', color: '#FFB547', icon: '🔄' },
              { text: 'Tacloban Code Camp — new schedule TBD (LNU rescheduling)', color: '#FFB547', icon: '🔄' },
              { text: 'Bukidnon Code Camp — May 6 (finance resolved ✓)', color: '#FFB547', icon: '🔄' },
              { text: 'DEVCON Studios Feature 3 — Active', color: '#FFB547', icon: '🔄' },
              { text: 'Q2 Narrative Report → Sui Foundation · Due Jun 30', color: '#FF4D6A', icon: '—' },
            ].map((item, i) => (
              <div key={i} className="flex gap-2">
                <span style={{ color: item.color }} className="flex-shrink-0">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
