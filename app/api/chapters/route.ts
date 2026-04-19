import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const ALLOWED_STATUSES = ['completed', 'rescheduling', 'in_progress', 'activating', 'pencil_booked', 'tbc']

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, ...patch } = body

  if (!id) return NextResponse.json({ ok: false, error: 'id is required' }, { status: 400 })

  const allowed: Record<string, unknown> = {}
  if (patch.status && ALLOWED_STATUSES.includes(patch.status)) allowed.status = patch.status
  if (patch.pax_actual !== undefined)    allowed.pax_actual    = Number(patch.pax_actual)
  if (patch.progress_percent !== undefined) allowed.progress_percent = Math.min(100, Math.max(0, Number(patch.progress_percent)))
  if (patch.merch_status !== undefined)  allowed.merch_status  = patch.merch_status

  if (Object.keys(allowed).length === 0) {
    return NextResponse.json({ ok: false, error: 'No valid fields to update' }, { status: 400 })
  }

  const supabase = db()
  const { error } = await supabase.from('chapters').update(allowed).eq('id', id)
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
