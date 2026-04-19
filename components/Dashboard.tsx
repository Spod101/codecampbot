'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { fetchChapters, fetchKpis, fetchRisks, fetchContacts, fetchMerchItems, fetchLinks } from '@/lib/supabase/queries'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'
import type { Chapter, Kpi, Risk, Contact, MerchItem, ResourceLink } from '@/lib/types'
import KpiPanel from '@/components/panels/KpiPanel'
import ChaptersPanel from '@/components/panels/ChaptersPanel'
import ChapterDetailPanel from '@/components/panels/ChapterDetailPanel'
import MilestonesPanel from '@/components/panels/MilestonesPanel'
import RisksPanel from '@/components/panels/RisksPanel'
import MerchPanel from '@/components/panels/MerchPanel'
import LinksPanel from '@/components/panels/LinksPanel'
import ContactsPanel from '@/components/panels/ContactsPanel'
import ContentPanel from '@/components/panels/ContentPanel'
import SettingsPanel from '@/components/panels/SettingsPanel'

type TabId = 'overview' | 'kpi' | 'milestones' | 'chapters' | 'risks' | 'merch' | 'links' | 'contacts' | 'content' | 'settings'

const TAB_IDS: TabId[] = ['overview', 'kpi', 'milestones', 'chapters', 'risks', 'merch', 'links', 'contacts', 'content', 'settings']

function getTabFromQuery(tab: string | null): TabId {
  return TAB_IDS.includes((tab ?? '') as TabId) ? (tab as TabId) : 'overview'
}

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: '#020617',
  surface: '#0f172a',
  border: '#1e293b',
  cyan: '#06b6d4',
  teal: '#14b8a6',
  rose: '#e11d48',
  muted: '#64748b',
  text: '#cfd5dd',
  dim: '#8899aa',
}

const CHAPTER_GRADIENTS = [
  'linear-gradient(135deg,#0c4a6e 0%,#065f46 100%)',
  'linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)',
  'linear-gradient(135deg,#4c0519 0%,#9f1239 100%)',
  'linear-gradient(135deg,#14532d 0%,#15803d 100%)',
  'linear-gradient(135deg,#1c1917 0%,#44403c 100%)',
  'linear-gradient(135deg,#172554 0%,#164e63 100%)',
]

const AVATAR_COLORS = ['#06b6d4','#14b8a6','#e11d48','#f59e0b','#8b5cf6','#ec4899']

function getCat(num: string | number) {
  const n = parseInt(String(num))
  if (n <= 2) return { label: 'Academic', color: C.cyan,  bg: 'rgba(6,182,212,0.15)' }
  if (n <= 4) return { label: 'Cultural', color: C.rose,  bg: 'rgba(225,29,72,0.15)' }
  return            { label: 'Startup',  color: C.teal,  bg: 'rgba(20,184,166,0.15)' }
}

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { id: 'overview'   as TabId, label: 'Event Discovery', icon: '◈' },
      { id: 'kpi'        as TabId, label: 'KPI Dashboard',   icon: '◉' },
      { id: 'milestones' as TabId, label: 'Partnership KPIs',icon: '◎' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { id: 'chapters' as TabId, label: 'All Chapters',  icon: '⊞' },
      { id: 'risks'    as TabId, label: 'Risk Register', icon: '⚠' },
      { id: 'merch'    as TabId, label: 'Merchandise',   icon: '⊠' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { id: 'links'    as TabId, label: 'Resource Links', icon: '⊗' },
      { id: 'contacts' as TabId, label: 'Contacts',       icon: '⊕' },
      { id: 'content'  as TabId, label: 'Content Hub',    icon: '⊘' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'settings' as TabId, label: 'Settings',       icon: '⚙' },
    ],
  },
]

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_NAMES   = ['Su','Mo','Tu','We','Th','Fr','Sa']
const DAY_FULL    = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

// Q2 report deadline — Sui Foundation
const Q2_DEADLINE = new Date('2026-06-30T23:59:59')


// ── Calendar Modal ────────────────────────────────────────────────────────────
function CalendarModal({ chapters, onClose }: { chapters: Chapter[]; onClose: () => void }) {
  const now = new Date()
  const [ym, setYm]         = useState({ year: now.getFullYear(), month: now.getMonth() })
  const [selected, setSelected] = useState<number | null>(now.getDate())

  const daysInMonth = new Date(ym.year, ym.month + 1, 0).getDate()
  const firstDay    = new Date(ym.year, ym.month, 1).getDay()

  const eventsByDay: Record<number, Chapter[]> = {}
  chapters.forEach(c => {
    if (!c.date_iso) return
    const d = new Date(c.date_iso)
    if (d.getFullYear() === ym.year && d.getMonth() === ym.month) {
      const day = d.getDate()
      ;(eventsByDay[day] ??= []).push(c)
    }
  })

  const selectedEvents = selected ? (eventsByDay[selected] ?? []) : []

  const chevron: React.CSSProperties = {
    background: 'none', border: 'none', color: C.dim,
    cursor: 'pointer', fontSize: '20px', padding: '4px 10px',
    borderRadius: '8px', lineHeight: 1,
  }

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 24px 24px 304px', background:'rgba(2,6,23,0.8)', backdropFilter:'blur(6px)' }}
      onClick={onClose}
    >
      <div
        style={{ width:'min(980px, calc(100vw - 360px))', maxHeight:'calc(100vh - 120px)', background:C.border, borderRadius:'24px', boxShadow:'0 25px 80px rgba(0,0,0,0.9)', display:'grid', gridTemplateColumns:'minmax(300px,340px) 1fr', overflow:'hidden', animation:'slideDown .3s ease-out' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Left — date selector */}
        <div style={{ padding:'24px', borderRight:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
            <button style={chevron} onClick={() => setYm(p => p.month === 0 ? { year:p.year-1, month:11 } : { ...p, month:p.month-1 })}>‹</button>
            <span style={{ color:C.text, fontWeight:700, fontSize:'15px' }}>{MONTH_NAMES[ym.month]} {ym.year}</span>
            <button style={chevron} onClick={() => setYm(p => p.month === 11 ? { year:p.year+1, month:0 } : { ...p, month:p.month+1 })}>›</button>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:'8px' }}>
            {DAY_NAMES.map(d => (
              <div key={d} style={{ textAlign:'center', fontSize:'10px', fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.05em', padding:'4px 0' }}>{d}</div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'4px' }}>
            {Array.from({ length: firstDay }).map((_,i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }, (_,i) => i + 1).map(day => {
              const isSelected = day === selected
              const isToday = day === now.getDate() && ym.year === now.getFullYear() && ym.month === now.getMonth()
              const cats = (eventsByDay[day] ?? []).map(c => getCat(c.number))
              return (
                <div
                  key={day}
                  onClick={() => setSelected(day === selected ? null : day)}
                  style={{ minHeight:'34px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'6px 2px', borderRadius:'8px', cursor:'pointer', textAlign:'center', background:isSelected ? 'linear-gradient(135deg,#06b6d4,#14b8a6)' : 'transparent', boxShadow:isSelected ? '0 4px 12px rgba(6,182,212,0.4)' : undefined, transition:'all .2s', outline: isToday && !isSelected ? '1px solid rgba(6,182,212,0.5)' : undefined }}
                >
                  <div style={{ fontSize:'12px', fontWeight:isSelected || isToday ? 700 : 400, color:isSelected ? '#fff' : isToday ? C.cyan : C.dim }}>{day}</div>
                  {cats.length > 0 && (
                    <div style={{ display:'flex', justifyContent:'center', gap:'2px', marginTop:'2px' }}>
                      {cats.slice(0,3).map((cat,i) => (
                        <div key={i} style={{ width:'4px', height:'4px', borderRadius:'50%', background:cat.color }} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right — schedule view */}
        <div style={{ background:'rgba(15,23,42,0.6)', padding:'24px', overflowY:'auto' }}>
          <div style={{ fontSize:'10px', fontWeight:700, color:C.cyan, textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:'16px' }}>
            Schedule for {selected ? `${MONTH_NAMES[ym.month]} ${selected}` : 'Select a Day'}
          </div>

          {selectedEvents.length === 0 ? (
            <div style={{ textAlign:'center', paddingTop:'60px', opacity:0.4 }}>
              <div style={{ fontSize:'40px', marginBottom:'12px' }}>📅</div>
              <div style={{ color:C.dim, fontSize:'13px' }}>{selected ? 'No events scheduled' : 'Click a date to view events'}</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {selectedEvents.map(c => {
                const cat  = getCat(c.number)
                const grad = CHAPTER_GRADIENTS[(parseInt(c.number) - 1) % CHAPTER_GRADIENTS.length]
                return (
                  <div key={c.id} style={{ display:'flex', gap:'12px', alignItems:'center', background:'rgba(30,41,59,0.8)', borderRadius:'12px', padding:'12px', border:`1px solid ${C.border}` }}>
                    <div style={{ width:'48px', height:'48px', borderRadius:'10px', background:grad, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px' }}>🎓</div>
                    <div>
                      <div style={{ fontSize:'10px', fontWeight:700, color:cat.color, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'3px' }}>{cat.label}</div>
                      <div style={{ fontSize:'13px', fontWeight:600, color:C.text }}>Ch{c.number} — {c.name}</div>
                      <div style={{ fontSize:'11px', color:C.muted, marginTop:'2px' }}>📍 {c.venue || c.city} · {c.date_text}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Event Card (Neon) ─────────────────────────────────────────────────────────
function EventCard({ chapter, onSelect }: { chapter: Chapter; onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)
  const cat     = getCat(chapter.number)
  const grad    = CHAPTER_GRADIENTS[(parseInt(chapter.number) - 1) % CHAPTER_GRADIENTS.length]
  const avatarN = Math.min(3, Math.max(1, Math.floor(chapter.progress_percent / 30)))

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(chapter.id)}
      style={{
        background: C.surface,
        borderRadius: '28px',
        border: `1px solid ${hovered ? 'rgba(6,182,212,0.3)' : C.border}`,
        boxShadow: hovered ? '0 0 20px rgba(6,182,212,0.1)' : 'none',
        cursor: 'pointer',
        transition: 'all .3s ease-out',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '430px',
      }}
    >
      {/* Image / gradient area */}
      <div style={{ height:'212px', position:'relative', overflow:'hidden', background:grad, flexShrink:0 }}>
        <div style={{ position:'absolute', inset:0, background:'rgba(2,6,23,0.5)' }} />
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', transform:hovered ? 'scale(1.05)' : 'scale(1)', transition:'transform .5s ease-out' }}>
          <span style={{ fontSize:'68px', fontWeight:800, color:'rgba(255,255,255,0.12)', letterSpacing:'-0.05em' }}>CH{chapter.number}</span>
        </div>
        {/* Category badge */}
        <div style={{ position:'absolute', top:'12px', left:'12px', background:cat.bg, color:cat.color, padding:'3px 10px', borderRadius:'999px', fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', backdropFilter:'blur(8px)' }}>
          {cat.label}
        </div>
        {/* Status badge */}
        <div style={{ position:'absolute', top:'12px', right:'12px', background:'rgba(15,23,42,0.8)', color:C.dim, padding:'3px 10px', borderRadius:'999px', fontSize:'10px', fontWeight:600, backdropFilter:'blur(8px)' }}>
          {chapter.status.replace('_',' ')}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding:'24px', display:'flex', flexDirection:'column', flex:1 }}>
        <h3 style={{ fontSize:'19px', fontWeight:700, color:hovered ? C.cyan : C.text, marginBottom:'12px', transition:'color .3s ease-out', lineHeight:1.3 }}>
          Ch{chapter.number} — {chapter.name}
        </h3>

        <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'20px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'11px', fontWeight:600, color:C.muted }}>
            <span>🕐</span><span>{chapter.date_text}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'11px', fontWeight:600, color:C.muted }}>
            <span>📍</span><span>{chapter.venue || chapter.city}{chapter.region ? `, ${chapter.region}` : ''}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
            <span style={{ fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:C.muted }}>Progress</span>
            <span style={{ fontSize:'10px', fontWeight:700, color:C.cyan }}>{chapter.progress_percent}%</span>
          </div>
          <div style={{ height:'6px', background:'rgba(255,255,255,0.06)', borderRadius:'999px', overflow:'hidden' }}>
            <div style={{ height:'100%', borderRadius:'4px', background:'linear-gradient(90deg,#06b6d4,#14b8a6)', width:`${chapter.progress_percent}%`, transition:'width .5s ease-out' }} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
          {/* Avatar stack */}
          <div style={{ display:'flex', alignItems:'center' }}>
            {Array.from({ length: avatarN }, (_,i) => (
              <div key={i} style={{ width:'28px', height:'28px', borderRadius:'50%', background:`linear-gradient(135deg,${AVATAR_COLORS[i % AVATAR_COLORS.length]},${AVATAR_COLORS[(i+1) % AVATAR_COLORS.length]})`, border:`2px solid ${C.surface}`, marginLeft:i > 0 ? '-8px' : '0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:700, color:'#fff', zIndex:avatarN - i }}>
                {chapter.lead_name?.charAt(0) ?? '?'}
              </div>
            ))}
          </div>

          {/* Action button */}
          <button style={{ background:chapter.status === 'completed' ? 'rgba(20,184,166,0.12)' : 'linear-gradient(135deg,#06b6d4,#14b8a6)', color:chapter.status === 'completed' ? C.teal : '#fff', border:chapter.status === 'completed' ? `1px solid rgba(20,184,166,0.3)` : 'none', padding:'6px 16px', borderRadius:'999px', fontSize:'11px', fontWeight:700, cursor:'pointer', transition:'all .3s ease-out' }}>
            {chapter.status === 'completed' ? 'Completed ✓' : 'View Details →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Bento Section ─────────────────────────────────────────────────────────────
function BentoSection({ kpis, risks, chapters, onSwitch }: { kpis: Kpi[]; risks: Risk[]; chapters: Chapter[]; onSwitch: (t: TabId) => void }) {
  const kpiMap       = Object.fromEntries(kpis.map(k => [k.key, k]))
  const openRisks    = risks.filter(r => r.status === 'open').length
  const completedCnt = chapters.filter(c => c.status === 'completed').length

  const skillItems = [
    { icon:'📊', label:'Code Camps',       value:kpiMap['code_camps']?.value          ?? '–', color:C.cyan },
    { icon:'📋', label:'Form Submissions', value:kpiMap['form_submissions']?.value     ?? '–', color:C.teal },
    { icon:'🧑‍💻', label:'Mentors Trained', value:kpiMap['trained_mentors']?.value      ?? '–', color:C.cyan },
    { icon:'🚀', label:'Deployments',      value:kpiMap['confirmed_deployments']?.value ?? '–', color:C.teal },
  ]

  const statItems = [
    { label:'Completion Rate', value:kpiMap['completion_rate']?.value ?? '–', color:C.cyan },
    { label:'Chapters Done',   value:`${completedCnt}/${chapters.length}`,   color:C.teal },
    { label:'Open Risks',      value:String(openRisks || '0'),               color:C.rose },
    { label:'Labs Active',     value:kpiMap['computer_labs']?.value ?? '–',  color:C.cyan },
    { label:'Days Left Q2',    value:'78d',                                  color:'#f59e0b' },
  ]

  return (
    <div style={{ display:'grid', gridTemplateColumns:'2.2fr 1fr', gap:'26px', marginTop:'40px', alignItems:'stretch' }}>

      {/* Skill corner — 3/4 */}
      <div style={{ background:C.surface, borderRadius:'28px', padding:'34px', border:`1px solid ${C.border}` }}>
        <div style={{ marginBottom:'26px' }}>
          <div style={{ fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:C.muted, marginBottom:'6px' }}>Program KPIs</div>
          <h3 style={{ fontSize:'24px', fontWeight:800, color:C.text }}>Build Beyond DEVCON <span style={{ color:C.cyan }}>× Sui</span></h3>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'18px' }}>
          {skillItems.map(item => (
            <div key={item.label} style={{ background:C.bg, borderRadius:'18px', padding:'24px', border:`1px solid ${C.border}`, display:'flex', alignItems:'flex-start', gap:'18px', minHeight:'126px' }}>
              <div style={{ width:'56px', height:'56px', borderRadius:'14px', flexShrink:0, background:`linear-gradient(135deg,${item.color}33,${item.color}11)`, border:`1px solid ${item.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px' }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize:'34px', fontWeight:800, color:item.color, lineHeight:1 }}>{item.value}</div>
                <div style={{ fontSize:'10px', fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginTop:'8px' }}>{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div style={{ display:'flex', flexDirection:'column', gap:'18px' }}>

        {/* Status panel */}
        <div style={{ background:C.surface, borderRadius:'28px', padding:'26px', border:`1px solid ${C.border}`, flex:1 }}>
          <div style={{ fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:C.muted, marginBottom:'16px' }}>Quick Stats</div>
          {statItems.map((item, i) => (
            <div key={item.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:i < statItems.length - 1 ? `1px solid ${C.border}` : undefined }}>
              <span style={{ fontSize:'12px', color:C.dim }}>{item.label}</span>
              <span style={{ fontSize:'16px', fontWeight:800, color:item.color }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Anonymous / CTA widget */}
        <div style={{ background:'linear-gradient(135deg,#0f172a 0%,#020617 100%)', borderRadius:'28px', padding:'26px', border:`1px solid ${C.border}`, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:'-8px', bottom:'-8px', fontSize:'80px', opacity:0.08, pointerEvents:'none', lineHeight:1 }}>👻</div>
          <div style={{ fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:C.muted, marginBottom:'6px' }}>Q2 Report</div>
          <div style={{ fontSize:'15px', fontWeight:700, color:C.text, marginBottom:'3px' }}>June 30, 2026</div>
          <div style={{ fontSize:'11px', color:C.muted, marginBottom:'16px' }}>→ Sui Foundation</div>
          <button
            onClick={() => onSwitch('milestones')}
            style={{ width:'100%', padding:'9px', borderRadius:'10px', background:'rgba(6,182,212,0.1)', backdropFilter:'blur(8px)', border:'1px solid rgba(6,182,212,0.2)', color:C.cyan, fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', cursor:'pointer', transition:'all .3s ease-out' }}
          >
            View Timeline →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ activeTab, activeChapterId, chapters, onSwitch, onShowChapter, onLogout }: {
  activeTab: TabId
  activeChapterId: string | null
  chapters: Chapter[]
  onSwitch: (t: TabId) => void
  onShowChapter: (id: string) => void
  onLogout: () => void
}) {
  return (
    <aside style={{ position:'fixed', left:0, top:0, bottom:0, width:'280px', background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', zIndex:100, overflowY:'auto' }}>

      {/* Logo */}
      <div style={{ padding:'24px 20px', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'rgba(6,182,212,0.08)', border:'1px solid rgba(6,182,212,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Image src="/sui-logo.png" alt="Sui logo" width={24} height={24} unoptimized />
          </div>
          <div>
            <div style={{ fontSize:'15px', fontWeight:700, color:C.text, lineHeight:1.2 }}>CodeCamp HQ</div>
            <div style={{ fontSize:'11px', color:C.muted, marginTop:'2px' }}>Sui × DEVCON</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex:1, padding:'16px 12px', overflowY:'auto' }}>
        {NAV_SECTIONS.map(section => (
          <div key={section.label} style={{ marginBottom:'24px' }}>
            <div style={{ fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'#475569', padding:'0 8px', marginBottom:'6px' }}>
              {section.label}
            </div>
            {section.items.map(item => {
              const isActive = activeTab === item.id && !activeChapterId
              return (
                <button
                  key={item.id}
                  onClick={() => onSwitch(item.id)}
                  style={{ display:'flex', alignItems:'center', gap:'10px', width:'100%', padding:'9px 10px', borderRadius:'10px', background:isActive ? 'rgba(6,182,212,0.1)' : 'transparent', border:'none', cursor:'pointer', color:isActive ? C.cyan : C.dim, fontSize:'13px', fontWeight:isActive ? 600 : 400, transition:'all .2s', textAlign:'left', marginBottom:'2px' }}
                >
                  <span style={{ fontSize:'14px', flexShrink:0 }}>{item.icon}</span>
                  {item.label}
                </button>
              )
            })}
          </div>
        ))}

        {/* Chapter items */}
        {chapters.length > 0 && (
          <div>
            <div style={{ fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'#475569', padding:'0 8px', marginBottom:'6px' }}>Chapters</div>
            {chapters.map(c => {
              const cat      = getCat(c.number)
              const isActive = activeChapterId === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => onShowChapter(c.id)}
                  style={{ display:'flex', alignItems:'center', gap:'8px', width:'100%', padding:'8px 10px', borderRadius:'10px', background:isActive ? 'rgba(6,182,212,0.1)' : 'transparent', border:'none', cursor:'pointer', color:isActive ? C.cyan : C.dim, fontSize:'12px', fontWeight:isActive ? 600 : 400, transition:'all .2s', textAlign:'left', marginBottom:'2px' }}
                >
                  <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:cat.color, flexShrink:0 }} />
                  Ch{c.number} {c.city}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div style={{ padding:'16px', borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
        <button
          onClick={onLogout}
          style={{ width:'100%', display:'inline-flex', alignItems:'center', justifyContent:'center', background:'rgba(225,29,72,0.08)', border:'1px solid rgba(225,29,72,0.25)', borderRadius:'10px', padding:'9px 12px', color:'#e11d48', fontSize:'12px', fontWeight:700, cursor:'pointer', transition:'all .2s' }}
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

// ── Top Header ────────────────────────────────────────────────────────────────
function TopHeader({ calendarOpen, onToggleCalendar }: { calendarOpen: boolean; onToggleCalendar: () => void }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const q2DaysLeft = Math.ceil((Q2_DEADLINE.getTime() - now.getTime()) / 86_400_000)
  const q2Label    = q2DaysLeft > 0 ? `${q2DaysLeft}d to Q2 End` : q2DaysLeft === 0 ? 'Q2 Ends Today' : 'Q2 Complete'

  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')

  return (
    <header style={{ position:'sticky', top:0, zIndex:90, height:'80px', background:'rgba(2,6,23,0.95)', backdropFilter:'blur(16px)', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', flexShrink:0 }}>

      {/* Profile trigger */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
        <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'linear-gradient(135deg,#06b6d4,#14b8a6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', fontWeight:800, color:'#fff', flexShrink:0 }}>D</div>
        <div>
          <div style={{ fontSize:'14px', fontWeight:600, color:C.text }}>Dom De Leon</div>
          <div style={{ fontSize:'11px', color:C.muted }}>ExDir · DEVCON</div>
        </div>
      </div>

      {/* Live badge */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', background:'rgba(6,182,212,0.08)', border:'1px solid rgba(6,182,212,0.2)', borderRadius:'999px', padding:'6px 14px' }}>
        <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:C.cyan, animation:'pulse 2s infinite' }} />
        <span style={{ fontSize:'11px', fontWeight:700, color:C.cyan, textTransform:'uppercase', letterSpacing:'0.1em' }}>
          Live · Q2 · {q2Label}
        </span>
      </div>

      {/* Right controls */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
        {/* Calendar trigger */}
        <button
          onClick={onToggleCalendar}
          style={{ display:'flex', alignItems:'center', gap:'10px', background:calendarOpen ? 'rgba(6,182,212,0.12)' : 'rgba(15,23,42,0.8)', border:`1px solid ${calendarOpen ? 'rgba(6,182,212,0.4)' : C.border}`, borderRadius:'12px', padding:'9px 14px', cursor:'pointer', transition:'all .3s ease-out', minWidth:'200px' }}
        >
          <div style={{ lineHeight:1.3 }}>
            <div style={{ fontSize:'14px', fontWeight:700, color:C.teal, textTransform:'uppercase', letterSpacing:'0.06em' }}>
              {DAY_FULL[now.getDay()].slice(0,3).toUpperCase()} {now.getDate()} {MONTH_SHORT[now.getMonth()]}
            </div>
            <div style={{ fontSize:'10px', color:C.muted, fontFamily:'monospace', letterSpacing:'0.05em', marginTop:'1px' }}>
              {hh}:{mm}:{ss} · {now.getFullYear()}
            </div>
          </div>
          <div style={{ marginLeft:'auto', width:'32px', height:'32px', borderRadius:'8px', background:'rgba(6,182,212,0.1)', border:'1px solid rgba(6,182,212,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px' }}>
            📅
          </div>
        </button>
      </div>
    </header>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
interface DashboardProps {
  initialChapterId?: string
}

export default function Dashboard({ initialChapterId }: DashboardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [calendarOpen, setCalendarOpen] = useState(false)
  const activeTab = getTabFromQuery(searchParams.get('tab'))

  const [chapters,   setChapters]   = useState<Chapter[]>([])
  const [kpis,       setKpis]       = useState<Kpi[]>([])
  const [risks,      setRisks]      = useState<Risk[]>([])
  const [contacts,   setContacts]   = useState<Contact[]>([])
  const [merchItems, setMerchItems] = useState<MerchItem[]>([])
  const [links,      setLinks]      = useState<ResourceLink[]>([])

  const refresh = useCallback(() => {
    return Promise.all([
      fetchChapters(), fetchKpis(), fetchRisks(),
      fetchContacts(), fetchMerchItems(), fetchLinks(),
    ]).then(([c, k, r, co, m, l]) => {
      setChapters(c); setKpis(k);    setRisks(r)
      setContacts(co); setMerchItems(m); setLinks(l)
    })
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const updateTabUrl = useCallback((tab: TabId) => {
    const params = new URLSearchParams(searchParams.toString())
    if (tab === 'overview') params.delete('tab')
    else params.set('tab', tab)

    const query = params.toString()
    const basePath = pathname === '/' ? '/' : pathname
    router.replace(query ? `${basePath}?${query}` : basePath, { scroll: false })
  }, [pathname, router, searchParams])

  function showChapter(id: string) {
    router.push('/chapters/' + id)
  }

  async function logout() {
    const supabase = createSupabaseClient()
    await supabase.auth.signOut()
    router.replace('/auth/login')
    router.refresh()
  }

  function switchTab(tab: TabId) {
    if (initialChapterId) {
      router.push(tab === 'overview' ? '/' : `/?tab=${tab}`)
      return
    }
    updateTabUrl(tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeChapterId = initialChapterId ?? null

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:C.bg, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>

      <Sidebar
        activeTab={activeTab}
        activeChapterId={activeChapterId}
        chapters={chapters}
        onSwitch={switchTab}
        onShowChapter={showChapter}
        onLogout={logout}
      />

      {/* Main content */}
      <div style={{ flex:1, marginLeft:'280px', display:'flex', flexDirection:'column', minHeight:'100vh' }}>

        <TopHeader calendarOpen={calendarOpen} onToggleCalendar={() => setCalendarOpen(v => !v)} />

        <main style={{ flex:1, padding:'46px 48px 54px', overflowX:'hidden' }}>
          {initialChapterId ? (
            chapters.length === 0 ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'400px', color:'#475569', fontSize:'13px' }}>
                Loading chapter…
              </div>
            ) : (
              <ChapterDetailPanel
                chapterId={initialChapterId}
                chapters={chapters}
                onBack={() => router.push('/')}
                onRefresh={refresh}
              />
            )

          ) : activeTab === 'overview' ? (
            <>
              {/* Hero section header */}
              <div style={{ marginBottom:'34px', maxWidth:'980px' }}>
                <div style={{ fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:C.muted, marginBottom:'8px' }}>Event Discovery</div>
                <h1 style={{ fontSize:'40px', fontWeight:800, color:C.text, marginBottom:'10px', lineHeight:1.1 }}>
                  Build Beyond DEVCON <span style={{ color:C.cyan }}>× Sui</span>
                </h1>
                <p style={{ fontSize:'16px', color:C.dim, lineHeight:1.7 }}>6 chapters across the Philippines · Q2 2026</p>
              </div>

              {/* Bento widgets — stats first */}
              <BentoSection kpis={kpis} risks={risks} chapters={chapters} onSwitch={switchTab} />

              {/* 3-column event grid */}
              <div style={{ marginTop:'54px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
                  <div>
                    <div style={{ fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:C.muted, marginBottom:'4px' }}>All Chapters</div>
                    <h2 style={{ fontSize:'28px', fontWeight:800, color:C.text }}>Event Directory</h2>
                  </div>
                  <div style={{ fontSize:'12px', color:C.muted }}>{chapters.length} events · Q2 2026</div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'24px' }}>
                  {chapters.length > 0
                    ? chapters.map(c => <EventCard key={c.id} chapter={c} onSelect={showChapter} />)
                    : Array.from({ length: 6 }).map((_,i) => (
                        <div key={i} style={{ height:'430px', background:C.surface, borderRadius:'28px', border:`1px solid ${C.border}`, animation:'pulse 1.5s infinite', opacity:0.5 }} />
                      ))
                  }
                </div>
              </div>
            </>

          ) : (
            <div className="animate-fade-in">
              {activeTab === 'kpi'        && <KpiPanel kpis={kpis} chapters={chapters} setKpis={setKpis} />}
              {activeTab === 'milestones' && <MilestonesPanel />}
              {activeTab === 'chapters'   && <ChaptersPanel chapters={chapters} onShowChapter={showChapter} onRefresh={refresh} />}
              {activeTab === 'risks'      && <RisksPanel risks={risks} setRisks={setRisks} onRefresh={refresh} />}
              {activeTab === 'merch'      && <MerchPanel merch_items={merchItems} chapters={chapters} onRefresh={refresh} />}
              {activeTab === 'links'      && <LinksPanel links={links} chapters={chapters} contacts={contacts} onShowChapter={showChapter} />}
              {activeTab === 'contacts'   && <ContactsPanel contacts={contacts} onRefresh={refresh} />}
              {activeTab === 'content'    && <ContentPanel />}
              {activeTab === 'settings'   && <SettingsPanel />}
            </div>
          )}
        </main>

        <footer style={{ textAlign:'center', fontSize:'11px', color:C.muted, padding:'24px 32px', borderTop:`1px solid ${C.border}` }}>
          CodeCamp HQ · Build Beyond DEVCON PH · Q2 2026 · Report Due{' '}
          <span style={{ color:'#f59e0b' }}>June 30, 2026</span> → Sui Foundation
        </footer>
      </div>

      {calendarOpen && <CalendarModal chapters={chapters} onClose={() => setCalendarOpen(false)} />}
    </div>
  )
}
