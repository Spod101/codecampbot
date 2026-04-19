import PanelHeader from '@/components/ui/PanelHeader'
import Badge from '@/components/ui/Badge'
import type { Chapter, MerchItem, BadgeVariant } from '@/lib/types'

const vipKit: { item: string; badge: BadgeVariant; label: string }[] = [
  { item: 'Custom engraved pen "BUIDL | DEVCON x Sui"', badge: 'done', label: '✓ Confirmed'    },
  { item: 'Baseus 3-in-1 retractable USB cable',        badge: 'warn', label: '⚠ Confirm rcvd' },
  { item: 'Tote bag (at Lady)',                          badge: 'done', label: '✓ At Lady'      },
  { item: 'Wireless fan (pink)',                         badge: 'warn', label: '⚠ Confirm rcvd' },
]

function itemBadge(s: string): { variant: BadgeVariant; label: string } {
  if (s === 'received' || s === 'confirmed') return { variant: 'done',    label: '✓ Received'    }
  if (s === 'confirm')                       return { variant: 'warn',    label: '⚠ Confirm rcvd' }
  return                                            { variant: 'pending', label: s               }
}

function getMerchBadge(s: string): { variant: BadgeVariant; label: string } {
  if (s.startsWith('✓'))                                     return { variant: 'done', label: s }
  if (s.includes('TBC') || s.toLowerCase().includes('tbc')) return { variant: 'tbc',  label: s }
  if (s.includes('Not Yet'))                                 return { variant: 'risk', label: s }
  return                                                            { variant: 'warn', label: s }
}

const CARD: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: '14px',
  alignItems: 'center', padding: '14px 18px',
  background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px',
  transition: 'border-color .2s',
}

function ItemRows({ items, icon }: { items: MerchItem[]; icon: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {items.map(item => {
        const b = itemBadge(item.status)
        return (
          <div key={item.id} style={CARD}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}>
            <span style={{ fontSize: '14px', textAlign: 'center' }}>{icon}</span>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#cfd5dd', marginBottom: '2px' }}>{item.name}</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>{item.distribution} · <span style={{ color: '#06b6d4', fontWeight: 700 }}>×{item.quantity}</span></div>
            </div>
            <Badge variant={b.variant}>{b.label}</Badge>
          </div>
        )
      })}
    </div>
  )
}

export default function MerchPanel({ merch_items, chapters }: { merch_items: MerchItem[]; chapters: Chapter[] }) {
  const jcr    = merch_items.filter(m => m.category === 'jcr')
  const lazada = merch_items.filter(m => m.category === 'lazada')
  const shopee = merch_items.filter(m => m.category === 'shopee')

  const received = chapters.filter(c => c.merch_status.startsWith('✓')).length
  const pending  = chapters.length - received

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <PanelHeader
        eyebrow="Operations"
        title="Merchandise"
        subtitle="Custodian: Lady Diane Casilang · Manila HQ"
      />

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { n: received,      lbl: 'Chapters Ready',    color: '#14b8a6', bg: 'rgba(20,184,166,0.08)',  border: 'rgba(20,184,166,0.25)'  },
          { n: pending,       lbl: 'Pending / Not Sent',color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)'  },
          { n: 25,            lbl: 'VIP Kits Total',    color: '#06b6d4', bg: 'rgba(6,182,212,0.08)',   border: 'rgba(6,182,212,0.25)'   },
        ].map(s => (
          <div key={s.lbl} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '16px', padding: '22px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginTop: '8px' }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Alert */}
      <div style={{ display: 'flex', gap: '10px', padding: '12px 16px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', fontSize: '12px', color: '#8899aa' }}>
        <span style={{ color: '#f59e0b', flexShrink: 0 }}>📦</span>
        <span>Iloilo merch sent. Bukidnon — <strong style={{ color: '#e11d48' }}>NOT YET SENT</strong>. Must be packed and shipped before <strong style={{ color: '#f59e0b' }}>Apr 29 (T-7)</strong>.</span>
      </div>

      {/* Chapter merch + VIP kits side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Chapter status */}
        <div>
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '12px' }}>Chapter Merch Status</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {chapters.map(c => {
              const m = getMerchBadge(c.merch_status)
              return (
                <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: '12px', alignItems: 'center', padding: '12px 16px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', transition: 'border-color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}>
                  <span style={{ fontSize: '11px', color: '#475569', fontFamily: 'monospace', fontWeight: 700 }}>{c.number}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#cfd5dd' }}>{c.name}</span>
                  <Badge variant={m.variant}>{m.label}</Badge>
                </div>
              )
            })}
          </div>
        </div>

        {/* VIP Kits */}
        <div>
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '12px' }}>VIP Kits — 25 Total</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {vipKit.map(v => (
              <div key={v.item} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'center', padding: '12px 16px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', transition: 'border-color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}>
                <span style={{ fontSize: '11px', color: '#8899aa' }}>{v.item}</span>
                <Badge variant={v.badge}>{v.label}</Badge>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '10px', padding: '10px 14px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', fontSize: '10px', color: '#64748b', lineHeight: 1.8 }}>
            5 → Letran organizers · 3 → Nicole / Harrison / Raphael · 17 → community leads &amp; media
          </div>
        </div>
      </div>

      {/* JCR Orders */}
      <div>
        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '12px' }}>
          JCR Order <span style={{ color: '#14b8a6', marginLeft: '6px' }}>✓ Received — Invoice #0729 · Mar 24</span>
        </p>
        <ItemRows items={jcr} icon="📦" />
      </div>

      {/* Lazada + Shopee */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '12px' }}>Lazada Orders</p>
          <ItemRows items={lazada} icon="🛒" />
          <div style={{ marginTop: '8px', padding: '10px 14px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', fontSize: '10px', color: '#64748b' }}>
            📝 Light pink polo (100 pcs) — CANCELLED. Replaced with SHEisDEVCON shirts.
          </div>
        </div>
        <div>
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '12px' }}>Shopee — Umbrellas</p>
          <ItemRows items={shopee} icon="☂️" />
          <div style={{ marginTop: '8px', padding: '12px 16px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#06b6d4', lineHeight: 1 }}>70</div>
              <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '3px' }}>Total Umbrellas</div>
            </div>
            <span style={{ fontSize: '10px', color: '#e11d48', fontWeight: 600 }}>⚠ Delivery pending</span>
          </div>
        </div>
      </div>
    </div>
  )
}
