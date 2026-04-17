import SectionTitle from '@/components/ui/SectionTitle'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import type { Chapter, MerchItem, BadgeVariant } from '@/lib/types'

const vipKit: { item: string; badge: BadgeVariant; label: string }[] = [
  { item: 'Custom engraved pen "BUIDL | DEVCON x Sui"', badge: 'done', label: '✓ Confirmed' },
  { item: 'Baseus 3-in-1 retractable USB cable',        badge: 'warn', label: '⚠ Confirm rcvd' },
  { item: 'Tote bag (at Lady)',                          badge: 'done', label: '✓ At Lady' },
  { item: 'Wireless fan (pink)',                         badge: 'warn', label: '⚠ Confirm rcvd' },
]

function statusBadge(status: string): { variant: BadgeVariant; label: string } {
  if (status === 'received' || status === 'confirmed') return { variant: 'done', label: '✓ Received' }
  if (status === 'confirm') return { variant: 'warn', label: '⚠ Confirm rcvd' }
  return { variant: 'pending', label: status }
}

function getMerchBadge(merch_status: string): { variant: BadgeVariant; label: string } {
  if (merch_status.startsWith('✓')) return { variant: 'done', label: merch_status }
  if (merch_status.includes('TBC') || merch_status.toLowerCase().includes('tbc')) return { variant: 'tbc', label: merch_status }
  if (merch_status.includes('Not Yet')) return { variant: 'risk', label: merch_status }
  return { variant: 'warn', label: merch_status }
}

interface Props {
  merch_items: MerchItem[]
  chapters: Chapter[]
}

export default function MerchPanel({ merch_items, chapters }: Props) {
  const jcr    = merch_items.filter(m => m.category === 'jcr')
  const lazada = merch_items.filter(m => m.category === 'lazada')
  const shopee = merch_items.filter(m => m.category === 'shopee')

  return (
    <div className="animate-fade-in">
      <div className="bg-[rgba(77,162,255,0.06)] border border-[rgba(77,162,255,0.2)] rounded-lg p-[11px_14px] text-[12px] text-[#7A8BA8] leading-[1.7] mb-3">
        <strong className="text-[#4DA2FF]">Master Custodian:</strong> Lady Diane Casilang · Manila HQ. All inventory updates require Lady's confirmation.
      </div>
      <div className="bg-[rgba(255,181,71,0.06)] border border-[rgba(255,181,71,0.25)] rounded-lg p-[11px_14px] text-[12px] text-[#7A8BA8] leading-[1.7] mb-4">
        <strong className="text-[#FFB547]">📦 Update:</strong> Iloilo code camp merch already sent. Bukidnon merch{' '}
        <strong className="text-[#FF4D6A]">NOT YET SENT</strong> — needs to be packed and shipped before T-7 (Apr 29).
      </div>

      <div className="grid grid-cols-2 gap-[14px] mb-5 max-[640px]:grid-cols-1">
        {/* Chapter Merch Status */}
        <Card>
          <SectionTitle>Chapter Merch Status</SectionTitle>
          {chapters.map(c => {
            const m = getMerchBadge(c.merch_status)
            return (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-[rgba(77,162,255,0.06)] last:border-b-0 text-[12px] gap-2">
                <span><strong>{c.name}</strong></span>
                <Badge variant={m.variant}>{m.label}</Badge>
              </div>
            )
          })}
        </Card>

        {/* VIP Kits */}
        <Card>
          <SectionTitle>VIP Kits — 25 Total</SectionTitle>
          {vipKit.map(v => (
            <div key={v.item} className="flex items-center justify-between py-2 border-b border-[rgba(77,162,255,0.06)] last:border-b-0 text-[12px] gap-2">
              <span>{v.item}</span>
              <Badge variant={v.badge}>{v.label}</Badge>
            </div>
          ))}
          <div className="h-px bg-[rgba(77,162,255,0.15)] my-3" />
          <div className="text-[11px] text-[#7A8BA8] leading-[2.2]">
            5 kits → Letran core organizers<br />
            3 kits → Nicole Gomez · Harrison Kim · Raphael Bacolod<br />
            17 kits → Tech community leads + media guests
          </div>
        </Card>
      </div>

      {/* JCR Order Table */}
      <SectionTitle>JCR Order — Invoice #0729 (Mar 24, 2026) ✓ Received</SectionTitle>
      <div className="overflow-x-auto border border-[rgba(77,162,255,0.15)] rounded-lg mb-5">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="bg-[#131C2E]">
              {['Item', 'Qty', 'Distribution', 'Status'].map(h => (
                <th key={h} className="p-[10px_13px] text-left text-[9px] font-bold uppercase tracking-[0.1em] text-[#7A8BA8] font-mono border-b border-[rgba(77,162,255,0.15)] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jcr.map(item => {
              const b = statusBadge(item.status)
              return (
                <tr key={item.id} className="hover:[&>td]:bg-[rgba(77,162,255,0.03)]">
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)]">{item.name}</td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)] font-mono">{item.quantity}</td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)] text-[#7A8BA8] text-[11px]">{item.distribution}</td>
                  <td className="p-[10px_13px] border-b border-[rgba(77,162,255,0.06)]"><Badge variant={b.variant}>{b.label}</Badge></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Lazada + Shopee */}
      <div className="grid grid-cols-2 gap-[14px] max-[640px]:grid-cols-1">
        <Card>
          <SectionTitle>Lazada Orders</SectionTitle>
          {lazada.map(item => {
            const b = statusBadge(item.status)
            return (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-[rgba(77,162,255,0.06)] last:border-b-0 text-[12px] gap-2">
                <span>{item.name}</span>
                <Badge variant={b.variant}>{b.label}</Badge>
              </div>
            )
          })}
          <div className="mt-2.5 text-[11px] text-[#7A8BA8] p-2.5 bg-[#131C2E] rounded-md">
            📝 Light pink polo (100 pcs) — CANCELLED. Replaced with SHEisDEVCON shirts.
          </div>
        </Card>

        <Card>
          <SectionTitle>Shopee — Umbrella Orders</SectionTitle>
          {shopee.map(item => {
            const b = statusBadge(item.status)
            return (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-[rgba(77,162,255,0.06)] last:border-b-0 text-[12px] gap-2">
                <span>{item.name}</span>
                <Badge variant={b.variant}>{b.label}</Badge>
              </div>
            )
          })}
          <div className="h-px bg-[rgba(77,162,255,0.15)] my-3" />
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[22px] font-extrabold font-mono text-[#4DA2FF]">70</div>
              <div className="text-[9px] text-[#7A8BA8] uppercase tracking-[0.06em]">Total Umbrellas</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[#7A8BA8]">Delivery confirmation</div>
              <div className="text-[11px] text-[#FF4D6A]">⚠ Pending</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
