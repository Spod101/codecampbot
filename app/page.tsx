'use client'

import { useState } from 'react'
import DsuPanel from '@/components/panels/DsuPanel'
import KpiPanel from '@/components/panels/KpiPanel'
import ChaptersPanel from '@/components/panels/ChaptersPanel'
import ChapterDetailPanel from '@/components/panels/ChapterDetailPanel'
import MilestonesPanel from '@/components/panels/MilestonesPanel'
import RisksPanel from '@/components/panels/RisksPanel'
import MerchPanel from '@/components/panels/MerchPanel'
import LinksPanel from '@/components/panels/LinksPanel'
import ContactsPanel from '@/components/panels/ContactsPanel'
import ContentPanel from '@/components/panels/ContentPanel'

type TabId = 'dsu' | 'kpi' | 'milestones' | 'chapters' | 'risks' | 'merch' | 'links' | 'contacts' | 'content'
type ChapterId = 'manila' | 'tacloban' | 'iloilo' | 'bukidnon' | 'pampanga' | 'laguna'

const MAIN_TABS: { id: TabId; label: string }[] = [
  { id: 'dsu',        label: '📝 DSU Apr 13' },
  { id: 'kpi',        label: '📊 KPI' },
  { id: 'milestones', label: '🗓 Partnership KPIs' },
  { id: 'chapters',   label: '📋 All Chapters' },
  { id: 'risks',      label: '⚠️ Risks' },
  { id: 'merch',      label: '📦 Merch' },
  { id: 'links',      label: '🔗 All Links' },
  { id: 'contacts',   label: '👥 Contacts' },
  { id: 'content',    label: '💻 Content' },
]

const CHAPTER_TABS: { id: ChapterId; label: string }[] = [
  { id: 'manila',    label: 'Ch1 Manila' },
  { id: 'tacloban',  label: 'Ch2 Tacloban' },
  { id: 'iloilo',    label: 'Ch3 Iloilo' },
  { id: 'bukidnon',  label: 'Ch4 Bukidnon' },
  { id: 'pampanga',  label: 'Ch5 Pampanga' },
  { id: 'laguna',    label: 'Ch6 Laguna' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('dsu')
  const [activeChapter, setActiveChapter] = useState<ChapterId | null>(null)

  function showChapter(id: string) {
    setActiveChapter(id as ChapterId)
    setActiveTab('chapters')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    setActiveChapter(null)
  }

  function switchTab(tab: TabId) {
    setActiveTab(tab)
    setActiveChapter(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="relative z-[1] max-w-[1440px] mx-auto px-5 pt-7 pb-20">

      {/* Glow orbs */}
      <div className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-0 top-[-200px] right-[-200px]"
        style={{ background: 'radial-gradient(circle, rgba(77,162,255,0.06) 0%, transparent 70%)' }} />
      <div className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0 bottom-[-100px] left-[-100px]"
        style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.05) 0%, transparent 70%)' }} />

      {/* HEADER */}
      <header className="flex flex-col gap-4 mb-6 pb-5 border-b border-[rgba(77,162,255,0.15)]">
        <div className="flex items-start justify-between gap-3.5 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 bg-[rgba(77,162,255,0.1)] border border-[rgba(77,162,255,0.4)] rounded px-3 py-1 font-mono text-[10px] text-[#4DA2FF] tracking-[0.1em] uppercase mb-1.5 w-fit">
              <span className="animate-[pulse_2s_infinite] text-[#00D4AA]">●</span>
              Sui × DEVCON · Live Tracker · Apr 13, 2026
            </div>
            <h1 className="text-[clamp(22px,4vw,38px)] font-extrabold leading-[1.1] text-white tracking-[-0.02em] my-1.5">
              Build Beyond DEVCON <span className="text-[#4DA2FF]">× Sui</span>
            </h1>
            <div className="font-mono text-[10px] text-[#7A8BA8] leading-[1.9]">
              Partnership Tracker · Owner: Dom De Leon (ExDir) · Jedd Fernando (Ops Manager)<br />
              Q2 Narrative Report: <strong className="text-[#FFB547]">June 30, 2026</strong> → Sui Foundation
            </div>
          </div>
          <div className="font-mono text-[10px] text-[#00D4AA] bg-[rgba(0,212,170,0.1)] border border-[rgba(0,212,170,0.3)] px-3 py-1.5 rounded-md inline-flex items-center gap-1.5 self-start">
            <span className="animate-[pulse_2s_infinite]">●</span> Live · Q2 · 78 Days Remaining
          </div>
        </div>

        {/* KPI pills row */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {[
            { num: '1/5', lbl: 'Code Camps', cls: 'border-[rgba(77,162,255,0.25)]', numCls: 'text-[#4DA2FF]' },
            { num: '95',  lbl: 'Form Submissions', cls: 'border-[rgba(0,212,170,0.25)]', numCls: 'text-[#00D4AA]' },
            { num: '35',  lbl: 'Mentors Trained', cls: 'border-[rgba(0,212,170,0.25)]', numCls: 'text-[#00D4AA]' },
            { num: '86',  lbl: 'Deployments', cls: 'border-[rgba(0,212,170,0.4)]', numCls: 'text-[#00D4AA]' },
            { num: '63.7%', lbl: 'Completion Rate', cls: 'border-[rgba(0,212,170,0.4)]', numCls: 'text-[#00D4AA]' },
            { num: '3',   lbl: 'Labs Activated', cls: 'border-[rgba(77,162,255,0.25)]', numCls: 'text-[#4DA2FF]' },
            { num: '9',   lbl: 'Open Risks', cls: 'border-[rgba(255,77,106,0.25)]', numCls: 'text-[#FF4D6A]' },
            { num: '78d', lbl: 'Days Left Q2', cls: 'border-[rgba(255,181,71,0.3)]', numCls: 'text-[#FFB547]' },
          ].map(p => (
            <div key={p.lbl} className={`flex-shrink-0 bg-[#131C2E] border rounded-[7px] px-[14px] py-[9px] text-center min-w-[80px] ${p.cls}`}>
              <span className={`block text-[18px] font-extrabold font-mono leading-[1.1] ${p.numCls}`}>{p.num}</span>
              <span className="block text-[8px] text-[#7A8BA8] uppercase tracking-[0.07em] mt-[3px] whitespace-nowrap">{p.lbl}</span>
            </div>
          ))}
        </div>
      </header>

      {/* TAB NAV */}
      <div className="flex gap-[3px] mb-7 bg-[#0D1420] border border-[rgba(77,162,255,0.15)] rounded-lg p-1 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none' }}>
        {MAIN_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`flex-shrink-0 px-4 py-[9px] rounded-md text-[11px] font-bold cursor-pointer border-none transition-all tracking-[0.04em] uppercase whitespace-nowrap font-sans ${
              activeTab === tab.id && !activeChapter
                ? 'bg-[#4DA2FF] text-[#080C14]'
                : 'bg-transparent text-[#7A8BA8] hover:text-[#E8F0FF] hover:bg-[rgba(77,162,255,0.08)]'
            }`}
          >
            {tab.label}
          </button>
        ))}

        {/* Chapter tabs */}
        {CHAPTER_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => showChapter(tab.id)}
            className={`flex-shrink-0 px-4 py-[9px] rounded-md text-[11px] font-bold cursor-pointer transition-all tracking-[0.04em] uppercase whitespace-nowrap font-sans border ${
              activeChapter === tab.id
                ? 'bg-[#00D4AA] text-[#080C14] border-[#00D4AA]'
                : 'bg-[rgba(0,212,170,0.08)] text-[#00D4AA] border-[rgba(0,212,170,0.2)] hover:bg-[rgba(0,212,170,0.15)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PANELS */}
      <main>
        {activeChapter ? (
          <ChapterDetailPanel chapterId={activeChapter} onBack={goBack} />
        ) : (
          <>
            {activeTab === 'dsu'        && <DsuPanel onShowChapter={showChapter} />}
            {activeTab === 'kpi'        && <KpiPanel />}
            {activeTab === 'milestones' && <MilestonesPanel />}
            {activeTab === 'chapters'   && <ChaptersPanel onShowChapter={showChapter} />}
            {activeTab === 'risks'      && <RisksPanel />}
            {activeTab === 'merch'      && <MerchPanel />}
            {activeTab === 'links'      && <LinksPanel onShowChapter={showChapter} />}
            {activeTab === 'contacts'   && <ContactsPanel />}
            {activeTab === 'content'    && <ContentPanel />}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="text-center font-mono text-[10px] text-[#7A8BA8] mt-12 pt-5 border-t border-[rgba(77,162,255,0.15)] leading-[2]">
        Sui × DEVCON HQ Tracker · Build Beyond DEVCON PH · Q2 2026<br />
        Last updated: Apr 13, 2026 · Owner: Dom De Leon · Jedd Fernando<br />
        Q2 Report Due: <span className="text-[#FFB547]">June 30, 2026</span> → Sui Foundation
      </footer>
    </div>
  )
}
