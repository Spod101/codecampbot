import type { Chapter, Risk, Contact, MerchItem, ResourceLink, Kpi, PaxRow } from './types'

export const CHAPTERS: Chapter[] = [
  {
    id: 'manila',
    number: '1',
    name: 'Manila – NCR',
    city: 'Manila',
    region: 'NCR',
    venue: 'Colegio de San Juan de Letran, Intramuros',
    lead_name: 'Lady Diane Casilang',
    date_text: '28 Mar 2026',
    date_iso: '2026-03-28',
    status: 'completed',
    color: 'teal',
    pax_target: 150,
    pax_actual: null,
    merch_status: '✓ Distributed',
    progress_percent: 100,
    countdown_text: '+16 days ago',
    todos: [],
  },
  {
    id: 'tacloban',
    number: '2',
    name: 'Tacloban – EV',
    city: 'Tacloban',
    region: 'Eastern Visayas',
    venue: 'Leyte Normal University',
    lead_name: 'Rolf Genree Garces',
    date_text: 'TBD',
    date_iso: null,
    status: 'rescheduling',
    color: 'yellow',
    pax_target: 100,
    pax_actual: null,
    merch_status: '⚠ Confirm post-reschedule',
    progress_percent: 0,
    countdown_text: 'Awaiting new sched',
    todos: [
      { id: 't1', chapter_id: 'tacloban', owner: 'Rolf', description: 'Lock new event date with partners this week', status: 'urgent', created_at: '' },
      { id: 't2', chapter_id: 'tacloban', owner: 'Rolf', description: 'Complete formal ocular at LNU', status: 'urgent', created_at: '' },
    ],
  },
  {
    id: 'iloilo',
    number: '3',
    name: 'Iloilo – WV',
    city: 'Iloilo',
    region: 'Western Visayas',
    venue: 'Central Philippine University, Jaro',
    lead_name: 'Ted Hyacinth Aspera & Jose Arron',
    date_text: 'Apr 18 (Dev Event) + May 16 (Code Camp)',
    date_iso: '2026-05-16',
    status: 'in_progress',
    color: 'blue',
    pax_target: 120,
    pax_actual: null,
    merch_status: '✓ Merch Sent',
    progress_percent: 10,
    countdown_text: '33 days',
    todos: [
      { id: 't3', chapter_id: 'iloilo', owner: 'Ted', description: 'CPU Jaro ocular and install planning', status: 'pending', created_at: '' },
      { id: 't4', chapter_id: 'iloilo', owner: 'Marica', description: 'WVSU lab ocular visit (T-30 from Apr 18)', status: 'pending', created_at: '' },
      { id: 't5', chapter_id: 'iloilo', owner: 'Dom', description: 'Confirm Iloilo lead for Apr 18 SHEisDEVCON Summit', status: 'pending', created_at: '' },
      { id: 't6', chapter_id: 'iloilo', owner: 'Jedd', description: 'Send Sui/ABA/BOI branding assets to Ted', status: 'pending', created_at: '' },
    ],
  },
  {
    id: 'bukidnon',
    number: '4',
    name: 'Bukidnon',
    city: 'Bukidnon',
    region: 'Mindanao',
    venue: 'Bukidnon State University',
    lead_name: 'Zhi / Zhor El (VP)',
    date_text: 'May 6, 2026',
    date_iso: '2026-05-06',
    status: 'in_progress',
    color: 'blue',
    pax_target: 100,
    pax_actual: null,
    merch_status: '⚠ Not Yet Sent',
    progress_percent: 20,
    countdown_text: '23 days',
    todos: [
      { id: 't7', chapter_id: 'bukidnon', owner: 'Zhi', description: 'Ocular at BSU + lab installation planning', status: 'pending', created_at: '' },
      { id: 't8', chapter_id: 'bukidnon', owner: 'Zhi', description: 'Finalize local student outreach for Sui workshop', status: 'pending', created_at: '' },
    ],
  },
  {
    id: 'pampanga',
    number: '5',
    name: 'Pampanga',
    city: 'Angeles',
    region: 'Central Luzon',
    venue: 'City College of Angeles, Arayat Blvd',
    lead_name: 'Joash Requiez',
    date_text: 'Jun 24, 2026',
    date_iso: '2026-06-24',
    status: 'pencil_booked',
    color: 'teal',
    pax_target: null,
    pax_actual: null,
    merch_status: '⚠ Pending — not yet packed',
    progress_percent: 0,
    countdown_text: '72 days · 10 wks',
    todos: [
      { id: 't9', chapter_id: 'pampanga', owner: 'Joash', description: 'Confirm slot with Sui Foundation', status: 'pending', created_at: '' },
      { id: 't10', chapter_id: 'pampanga', owner: 'Joash', description: 'Formal ocular visit to CCA by May 25 (T-30)', status: 'pending', created_at: '' },
    ],
  },
  {
    id: 'laguna',
    number: '6',
    name: 'Laguna',
    city: 'Laguna',
    region: 'CALABARZON',
    venue: 'TBC',
    lead_name: 'John Danmel',
    date_text: 'TBC',
    date_iso: null,
    status: 'tbc',
    color: 'purple',
    pax_target: null,
    pax_actual: null,
    merch_status: '⚠ TBC',
    progress_percent: 0,
    countdown_text: 'Awaiting June confirm',
    todos: [
      { id: 't11', chapter_id: 'laguna', owner: 'John Danmel', description: 'Scout potential venue in Laguna', status: 'pending', created_at: '' },
      { id: 't12', chapter_id: 'laguna', owner: 'John Danmel', description: 'Confirm June go/no-go for Laguna slot', status: 'pending', created_at: '' },
    ],
  },
]

export const KPIS: Kpi[] = [
  { id: 'k1', key: 'code_camps', label: 'Code Camps', sublabel: 'Completed', value: '1/5', color: 'blue' },
  { id: 'k2', key: 'form_submissions', label: 'Form Submissions', sublabel: 'Total project completions', value: '95', color: 'teal' },
  { id: 'k3', key: 'trained_mentors', label: 'Trained Mentors', sublabel: 'Nationwide deployed', value: '35', color: 'teal' },
  { id: 'k4', key: 'confirmed_deployments', label: 'Confirmed Deployments', sublabel: '51 students + 35 mentors', value: '86', color: 'teal' },
  { id: 'k5', key: 'completion_rate', label: 'Completion Rate', sublabel: '86 / 135 (students + mentors)', value: '63.7%', color: 'green' },
  { id: 'k6', key: 'computer_labs', label: 'Computer Labs', sublabel: 'Activated to date', value: '3', color: 'blue' },
]

export const PAX_ROWS: PaxRow[] = [
  { chapter_name: 'Manila – Letran', date_text: '28 Mar 2026 · ✓ Executed', target: 150, actual: null, note: '⚠ Pax count TBC — update post-event', note_color: '#FFB547' },
  { chapter_name: 'Tacloban – LNU', date_text: 'New sched TBD · EV', target: 100, actual: null, note: 'Waiting for new LNU schedule', note_color: '#FFB547' },
  { chapter_name: 'Iloilo – WVSU/CPU', date_text: '18 Apr (dev event) + May 16', target: 120, actual: null, note: 'Apr 18 = Sui Dev Event (not code camp)', note_color: '#7A8BA8' },
  { chapter_name: 'Bukidnon – BSU', date_text: '6 May 2026 · Mindanao', target: 100, actual: null, note: '✓ Financial issue resolved (Cash Advance)', note_color: '#00D4AA' },
  { chapter_name: 'Pampanga – CCA', date_text: '24 Jun 2026', target: 130, actual: null, note: 'Activating — mentor recruitment in progress', note_color: '#7A8BA8' },
  { chapter_name: 'Laguna', date_text: 'TBC — slot unconfirmed', target: null, actual: null, note: 'Waiting June confirmation or slot cancelled', note_color: '#A78BFA' },
]

export const RISKS: Risk[] = [
  {
    id: 'r1', code: 'R1',
    title: 'Tacloban rescheduling — new LNU date not yet confirmed',
    description: 'Original Apr 11 date did not push through. LNU new schedule pending. Every week of delay compresses the T-minus timeline.',
    owner: 'Rolf', chapter_tag: 'Tacloban', severity: 'high', status: 'open',
  },
  {
    id: 'r2', code: 'R2',
    title: 'Laguna — no confirmed slot, risk of cancellation',
    description: 'Lead assigned: John Danmel. Waiting for June go/no-go from Dom. If not confirmed, slot is cancelled. No venue or timeline started yet.',
    owner: 'Dom / John Danmel', chapter_tag: 'Laguna', severity: 'high', status: 'open',
  },
  {
    id: 'r3', code: 'R3',
    title: 'Iloilo WVSU venue (Apr 18 Sui Dev Event) not yet formally confirmed',
    description: 'Contact WVSU to confirm. Note: Apr 18 is a Sui-supported developer event, NOT the code camp.',
    owner: 'Ted & Jose Arron', chapter_tag: 'Iloilo', severity: 'medium', status: 'open',
  },
  {
    id: 'r4', code: 'R4',
    title: 'Iloilo CPU Code Camp (May 16) — pencil-booked only',
    description: 'Formally confirm CPU venue with written confirmation ASAP. T-30 ocular due Apr 16.',
    owner: 'Ted & Jose Arron', chapter_tag: 'Iloilo', severity: 'medium', status: 'open',
  },
  {
    id: 'r5', code: 'R5',
    title: 'Pampanga — pencil-booked, slot not yet formally confirmed',
    description: 'Chapter request for Sui Move Code Camp at CCA submitted. Formal Sui Foundation slot confirmation pending. T-30 ocular due May 25.',
    owner: 'Joash', chapter_tag: 'Pampanga', severity: 'medium', status: 'open',
  },
  {
    id: 'r6', code: 'R6',
    title: '0 pax logged vs. 500 MOU minimum',
    description: 'Log Manila actuals immediately. All chapters must report pax within T+3 days of event.',
    owner: 'Dom / Jedd', chapter_tag: 'All Chapters', severity: 'medium', status: 'open',
  },
  {
    id: 'r7', code: 'R7',
    title: 'DeepSurge listing not yet live',
    description: 'Follow up with @zero_x_j (Jianyi). Needed as secondary proof of student project submission for Q2 report.',
    owner: 'Jianyi', chapter_tag: 'All', severity: 'medium', status: 'open',
  },
  {
    id: 'r8', code: 'R8',
    title: 'Code camp content + installation guide being updated post-Letran pilot',
    description: 'Mike and Lady updating content based on pilot learnings. All chapters must use updated guide — do NOT use pre-Manila version.',
    owner: 'Mike + Lady', chapter_tag: 'All Chapters', severity: 'low', status: 'open',
  },
  {
    id: 'r9', code: 'R9',
    title: 'Q2 narrative report — 4+ camps still to run before Jun 30',
    description: 'Log pax + outcomes per event immediately after each camp. Dom drafts narrative in June. Deadline: June 30, 2026.',
    owner: 'Dom / Jedd', chapter_tag: 'HQ', severity: 'low', status: 'open',
  },
]

export const CONTACTS: Contact[] = [
  { id: 'c1', name: 'Harrison Kim', role: 'Partnership Coordinator (MOU Sec. C.a.ii)', handle: '@web3tree', team: 'sui_foundation', chapter_number: null, emoji: '🌐', note: 'Keynote Mar 28 10:30AM' },
  { id: 'c2', name: 'Nicole Gomez', role: 'Sui PH Team / Coordinator', handle: '@nicgomez', team: 'sui_foundation', chapter_number: null, emoji: '💜', note: 'Attended Mar 28 full day' },
  { id: 'c3', name: 'Jianyi', role: 'Sui DevRel (Technical)', handle: '@zero_x_j', team: 'sui_foundation', chapter_number: null, emoji: '⚙️', note: 'DeepSurge · Installation guide' },
  { id: 'c4', name: 'Lady Diane Casilang', role: 'Manila – NCR · Merch Custodian · Content Update', handle: 'C3 GC', team: 'chapter_lead', chapter_number: '1', emoji: '1', note: null },
  { id: 'c5', name: 'Rolf Genree Garces', role: 'Tacloban – EV', handle: 'Sui Training GC', team: 'chapter_lead', chapter_number: '2', emoji: '2', note: null },
  { id: 'c6', name: 'Ted Hyacinth Aspera', role: 'Iloilo – WV', handle: 'ted@devcon.ph', team: 'chapter_lead', chapter_number: '3', emoji: '3', note: null },
  { id: 'c7', name: 'Zhi / Zhor El (VP)', role: 'Bukidnon', handle: 'zhi@devcon.ph', team: 'chapter_lead', chapter_number: '4', emoji: '4', note: null },
  { id: 'c8', name: 'Joash Requiez', role: 'Pampanga', handle: 'Sui Training GC', team: 'chapter_lead', chapter_number: '5', emoji: '5', note: null },
  { id: 'c9', name: 'Mike + Lady Diane Casilang', role: 'Updating code camp content, installation guide, and procedures based on Letran pilot learnings', handle: 'All chapters must use updated version', team: 'content_team', chapter_number: null, emoji: '📝', note: null },
  { id: 'c10', name: 'Marica', role: 'Iloilo On-ground Lead — Apr 18 Sui Dev Event', handle: 'Working with Ted Aspera', team: 'content_team', chapter_number: null, emoji: '📋', note: null },
]

export const MERCH_ITEMS: MerchItem[] = [
  { id: 'm1', name: 'T-Shirt Batch 1 (S-20 M-40 L-30 XL-10)', quantity: 100, distribution: 'Volunteers + raffle', status: 'received', category: 'jcr' },
  { id: 'm2', name: 'T-Shirt Batch 2 (S-20 M-40 L-30 XL-10)', quantity: 100, distribution: 'Volunteers + raffle', status: 'received', category: 'jcr' },
  { id: 'm3', name: 'Black Mugs', quantity: 30, distribution: 'Raffle / VIP', status: 'received', category: 'jcr' },
  { id: 'm4', name: 'Button Pins (1.75" + 2.25")', quantity: 200, distribution: 'Raffle', status: 'received', category: 'jcr' },
  { id: 'm5', name: 'Mousepad', quantity: 100, distribution: 'Raffle', status: 'received', category: 'jcr' },
  { id: 'm6', name: 'Tote Bag', quantity: 50, distribution: 'VIP / Part 2 dinner', status: 'received', category: 'jcr' },
  { id: 'm7', name: 'Lanyards', quantity: 100, distribution: 'Distribution', status: 'received', category: 'jcr' },
  { id: 'm8', name: 'Pull-up Banner', quantity: 4, distribution: 'Events', status: 'received', category: 'jcr' },
  { id: 'm9', name: 'Wireless Fan Pink (20 pcs)', quantity: 20, distribution: 'SHEisDEVCON / VIP', status: 'confirm', category: 'lazada' },
  { id: 'm10', name: 'Wireless Mouse Rose Gold (20 pcs)', quantity: 20, distribution: 'VIP', status: 'confirm', category: 'lazada' },
  { id: 'm11', name: 'White charging wires kit (50 pcs)', quantity: 50, distribution: 'Distribution', status: 'confirm', category: 'lazada' },
  { id: 'm12', name: 'VIP pen — engraved "BUIDL | DEVCON x Sui" (40 pcs)', quantity: 40, distribution: 'VIP', status: 'confirmed', category: 'lazada' },
  { id: 'm13', name: 'Baseus 3-in-1 retractable USB (10 pcs, VIP)', quantity: 10, distribution: 'VIP Kit', status: 'confirm', category: 'lazada' },
  { id: 'm14', name: 'Umbrella Order A: Pink 8-rib auto (30 pcs)', quantity: 30, distribution: 'SHEisDEVCON', status: 'confirm', category: 'shopee' },
  { id: 'm15', name: 'Umbrella Order B: Navy ×20 + Pink ×20 (40 pcs)', quantity: 40, distribution: 'SHEisDEVCON', status: 'confirm', category: 'shopee' },
]

export const LINKS: ResourceLink[] = [
  { id: 'l1', name: 'Partner Logos', description: 'Sui · ABA · BOI', url: 'https://drive.google.com/drive/u/0/folders/1PgEi7H96KE2Cect9b6CRbmMgtkT-Ca4?role=writer', icon: '📁', icon_color: 'blue', category: 'operations' },
  { id: 'l2', name: 'Looping Event Videos', description: 'For use during events + breaks', url: 'https://drive.google.com/drive/u/0/folders/1x0CJkf_WmPqMcXEpKekBwKwkBoDMlAd3', icon: '🎬', icon_color: 'blue', category: 'operations' },
  { id: 'l3', name: 'Exercise Completion Form', description: 'Student submission · Q2 proof', url: 'https://forms.gle/RBtZW4kJwGhiM3g76', icon: '📝', icon_color: 'teal', category: 'operations' },
  { id: 'l4', name: 'Technical Installation Guide', description: 'Updated post-Letran pilot (Mike + Lady)', url: 'https://docs.google.com/document/d/1FI-gO9vMMcdMJqU8p1YtoAyxyjFQRyMxFKcJH4eocr8', icon: '🔧', icon_color: 'yellow', category: 'operations' },
  { id: 'l5', name: 'SHEisDEVCON 2026 Guidelines', description: 'Event guidelines + materials', url: 'https://docs.google.com/presentation/d/1cTLY77rA-0ljnHm2xKKxYnBPLldJP7bM', icon: '📊', icon_color: 'blue', category: 'operations' },
]

type MilestoneCell = { type: string; text: string }

export const MILESTONE_ROWS: { label: string; months: Record<string, MilestoneCell> }[] = [
  {
    label: 'Partnership Media & Community Launch',
    months: {
      'Mar \'26': { type: 'done', text: '✅ Kickoff (Mar 26 · Bayleaf)' },
    }
  },
  {
    label: 'DEVCON Kids Micro:bit Donation & Hour of AI',
    months: {
      'Dec \'25': { type: 'done', text: '✅ 25 pcs + Hour of AI' },
    }
  },
  {
    label: 'Code Camp Mentor Training',
    months: {
      'Feb \'26': { type: 'done', text: '✅ Phase 1' },
      'Mar \'26': { type: 'done', text: '✅ Phase 2' },
      'Apr \'26': { type: 'active', text: '🔄 Phase 3' },
    }
  },
  {
    label: 'Campus DEVCON & SHEisDEVCON Series',
    months: {
      'Mar \'26': { type: 'done', text: '✅ Event 1' },
      'Apr \'26': { type: 'active', text: '🔄 Events 2 & 3' },
      'May \'26': { type: 'upcoming', text: 'Event 4' },
      'Jun \'26': { type: 'upcoming', text: 'Event 5' },
    }
  },
  {
    label: 'Code Camp Pilot Execution (Q2)',
    months: {
      'Mar \'26': { type: 'done', text: '✅ Manila Pilot' },
      'Apr \'26': { type: 'active', text: '🔄 Iloilo Dev Event' },
      'May \'26': { type: 'upcoming', text: 'Iloilo CC + BSU' },
      'Jun \'26': { type: 'upcoming', text: 'Pampanga' },
    }
  },
  {
    label: 'DEVCON Studios Content Coverage',
    months: {
      'Jan \'26': { type: 'done', text: '✅ Feature 1' },
      'Mar \'26': { type: 'done', text: '✅ Feature 2' },
      'Apr \'26': { type: 'active', text: '🔄 Feature 3' },
      'Jun \'26': { type: 'upcoming', text: 'Feature 4' },
      'Jul \'26': { type: 'upcoming', text: 'Feature 5' },
    }
  },
  {
    label: 'Quarterly Report',
    months: {
      'Mar \'26': { type: 'done', text: '✅ Q1 Report' },
      'Jun \'26': { type: 'upcoming', text: 'Q2 Report' },
      'Sep \'26': { type: 'upcoming', text: 'Q3 Report' },
      'Nov \'26': { type: 'upcoming', text: 'Q4 Final' },
    }
  },
]

export const MONTHS = ["Dec '25","Jan '26","Feb '26","Mar '26","Apr '26","May '26","Jun '26","Jul '26","Aug '26","Sep '26","Oct '26","Nov '26"]
export const CURRENT_MONTH = "Apr '26"
