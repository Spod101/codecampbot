'use client'
import { useState, useRef, useEffect } from 'react'

const colorMap = {
  blue:   { num: '#06b6d4', border: 'rgba(6,182,212,0.3)',   bg: 'rgba(6,182,212,0.06)'  },
  teal:   { num: '#14b8a6', border: 'rgba(20,184,166,0.35)', bg: 'rgba(20,184,166,0.06)' },
  green:  { num: '#14b8a6', border: 'rgba(20,184,166,0.5)',  bg: 'rgba(20,184,166,0.08)' },
  yellow: { num: '#f59e0b', border: 'rgba(245,158,11,0.3)',  bg: 'rgba(245,158,11,0.06)' },
  red:    { num: '#e11d48', border: 'rgba(225,29,72,0.3)',   bg: 'rgba(225,29,72,0.06)'  },
}

export default function KpiTile({
  id, value, label, sublabel, color = 'blue', onSave,
}: {
  id?: string
  value: string
  label: string
  sublabel?: string
  color?: keyof typeof colorMap
  onSave?: (id: string, value: string) => Promise<void>
}) {
  const c = colorMap[color]
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState(value)
  const [saving, setSaving]   = useState(false)
  const [hovered, setHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])
  useEffect(() => { setDraft(value) }, [value])

  async function save() {
    if (!id || !onSave) { setEditing(false); return }
    setSaving(true)
    await onSave(id, draft)
    setSaving(false)
    setEditing(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') { setDraft(value); setEditing(false) }
  }

  return (
    <div
      className="bg-[#0f172a] rounded-2xl p-4 text-center"
      style={{ border: `1px solid ${c.border}`, background: `linear-gradient(135deg, ${c.bg}, transparent)`, position: 'relative', cursor: onSave ? 'pointer' : 'default' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { if (onSave && !editing) setEditing(true) }}
    >
      {/* edit pencil hint */}
      {onSave && hovered && !editing && (
        <span style={{ position: 'absolute', top: '6px', right: '8px', fontSize: '10px', color: c.num, opacity: 0.6 }}>✎</span>
      )}

      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={save}
          style={{
            width: '100%', textAlign: 'center', background: 'transparent',
            border: 'none', borderBottom: `2px solid ${c.num}`,
            color: c.num, fontSize: 26, fontWeight: 800, lineHeight: 1,
            marginBottom: '6px', outline: 'none', fontFamily: 'inherit',
          }}
          disabled={saving}
        />
      ) : (
        <div className="font-extrabold leading-none mb-1.5" style={{ fontSize: 26, color: c.num }}>
          {value}
        </div>
      )}

      <div className="text-[10px] font-bold uppercase tracking-[0.08em]" style={{ color: c.num }}>
        {label}
      </div>
      {sublabel && <div className="text-[9px] text-[#64748b] mt-1">{sublabel}</div>}
    </div>
  )
}
