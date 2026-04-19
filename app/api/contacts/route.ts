import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const VALID_TEAMS = ['sui_foundation', 'chapter_lead', 'content_team']

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, role, handle, team, chapter_number, emoji, note } = body

  if (!name?.trim() || !role?.trim() || !team || !VALID_TEAMS.includes(team)) {
    return NextResponse.json({ ok: false, error: 'name, role, and a valid team are required' }, { status: 400 })
  }

  const supabase = db()
  const { data, error } = await supabase
    .from('contacts')
    .insert({
      name: name.trim(),
      role: role.trim(),
      handle: handle?.trim() ?? '',
      team,
      chapter_number: chapter_number?.trim() ?? null,
      emoji: emoji?.trim() || '👤',
      note: note?.trim() ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, data })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, ...patch } = body

  if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 })

  const allowed: Record<string, unknown> = {}
  if (patch.name)           allowed.name           = patch.name.trim()
  if (patch.role)           allowed.role           = patch.role.trim()
  if (patch.handle !== undefined) allowed.handle   = patch.handle.trim()
  if (patch.team && VALID_TEAMS.includes(patch.team)) allowed.team = patch.team
  if (patch.chapter_number !== undefined) allowed.chapter_number = patch.chapter_number?.trim() ?? null
  if (patch.emoji)          allowed.emoji          = patch.emoji.trim()
  if (patch.note !== undefined)   allowed.note     = patch.note?.trim() ?? null

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ ok: false, error: 'No valid fields to update' }, { status: 400 })
  }

  const supabase = db()
  const { error } = await supabase.from('contacts').update(allowed).eq('id', id)
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const body = await req.json()
  const { id } = body

  if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 })

  const supabase = db()
  const { error } = await supabase.from('contacts').delete().eq('id', id)
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
