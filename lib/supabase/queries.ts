import { createClient } from '@/lib/supabase/client'
import type { Chapter, ChapterTask, Kpi, Risk, Contact, MerchItem, ResourceLink } from '@/lib/types'

export async function fetchChapters(): Promise<Chapter[]> {
  const supabase = createClient()
  const [chaptersRes, tasksRes] = await Promise.all([
    supabase.from('chapters').select('*').order('number'),
    supabase.from('chapter_tasks').select('*'),
  ])
  const chapters = chaptersRes.data ?? []
  const tasks: ChapterTask[] = tasksRes.data ?? []
  return chapters.map(c => ({
    ...c,
    todos: tasks.filter(t => t.chapter_id === c.id),
  }))
}

export async function fetchKpis(): Promise<Kpi[]> {
  const supabase = createClient()
  const { data } = await supabase.from('kpis').select('*')
  return data ?? []
}

export async function fetchRisks(): Promise<Risk[]> {
  const supabase = createClient()
  const { data } = await supabase.from('risks').select('*').order('code')
  return data ?? []
}

export async function fetchContacts(): Promise<Contact[]> {
  const supabase = createClient()
  const { data } = await supabase.from('contacts').select('*')
  return data ?? []
}

export async function fetchMerchItems(): Promise<MerchItem[]> {
  const supabase = createClient()
  const { data } = await supabase.from('merch_items').select('*')
  return data ?? []
}

export async function fetchLinks(): Promise<ResourceLink[]> {
  const supabase = createClient()
  const { data } = await supabase.from('resource_links').select('*')
  return data ?? []
}
