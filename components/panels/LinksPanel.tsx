'use client'
import PanelHeader from '@/components/ui/PanelHeader'
import type { Chapter, Contact, ResourceLink } from '@/lib/types'

const iconAccent = (color: string) => ({
  blue:   { text: '#06b6d4', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.25)'  },
  teal:   { text: '#14b8a6', bg: 'rgba(20,184,166,0.1)',  border: 'rgba(20,184,166,0.25)' },
  yellow: { text: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)' },
  purple: { text: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)'},
}[color] ?? { text: '#06b6d4', bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.25)' })

const chapterAccent = (c: Chapter) =>
  c.color === 'teal' ? '#14b8a6' : c.color === 'yellow' ? '#f59e0b' : c.color === 'purple' ? '#a78bfa' : '#06b6d4'

const CARD: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '40px 1fr auto auto', gap: '14px',
  alignItems: 'center', padding: '14px 18px',
  background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px',
  transition: 'border-color .2s',
}

export default function LinksPanel({ links, chapters, contacts, onShowChapter }: {
  links: ResourceLink[]; chapters: Chapter[]; contacts: Contact[]; onShowChapter: (id: string) => void
}) {
  const keyContacts = contacts.filter(c => c.team === 'sui_foundation')

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <PanelHeader
        eyebrow="Resources"
        title="Resource Links"
        subtitle={`${links.length} resources · ${chapters.length} chapter pages · ${keyContacts.length} key contacts`}
      />

      {/* Chapter quick nav */}
      <div>
        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '14px' }}>Chapter Pages</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '8px' }}>
          {chapters.map(c => {
            const accent = chapterAccent(c)
            return (
              <button key={c.id} onClick={() => onShowChapter(c.id)}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', cursor: 'pointer', transition: 'all .2s', textAlign: 'left' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.35)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e293b'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${accent}18`, border: `1px solid ${accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: accent, flexShrink: 0 }}>
                  {c.number}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '1px' }}>{c.status.replace(/_/g,' ')}</div>
                </div>
                <span style={{ marginLeft: 'auto', color: '#475569', fontSize: '12px', flexShrink: 0 }}>→</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Drive resources */}
      <div>
        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '14px' }}>Drive &amp; Operations Resources</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {links.map(link => {
            const a = iconAccent(link.icon_color)
            return (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" style={{ ...CARD, textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.35)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: a.bg, border: `1px solid ${a.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                  {link.icon}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '2px' }}>{link.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{link.description}</div>
                </div>
                <span style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 10px', borderRadius: '8px', background: a.bg, color: a.text, whiteSpace: 'nowrap' }}>
                  {link.category}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#06b6d4', whiteSpace: 'nowrap' }}>Open →</span>
              </a>
            )
          })}
        </div>
      </div>

      {/* Key contacts */}
      {keyContacts.length > 0 && (
        <div>
          <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', marginBottom: '14px' }}>Sui Foundation Contacts</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {keyContacts.map(c => (
              <div key={c.id}
                style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: '14px', alignItems: 'center', padding: '14px 18px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', transition: 'border-color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.35)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e293b')}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  {c.emoji}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '2px' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{c.role}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#06b6d4', fontFamily: 'monospace' }}>{c.handle}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
