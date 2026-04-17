-- ============================================================
-- Sui × DEVCON HQ Tracker — Seed Data
-- Run AFTER schema.sql in Supabase SQL Editor
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- CHAPTERS
-- ────────────────────────────────────────────────────────────
insert into chapters (id, number, name, city, region, venue, lead_name, date_text, date_iso, status, color, pax_target, pax_actual, merch_status, progress_percent, countdown_text)
values
  ('manila',   '1',  'Manila – NCR',    'Manila',   'NCR',            'Colegio de San Juan de Letran, Intramuros',  'Lady Diane Casilang',       '28 Mar 2026',                      '2026-03-28', 'completed',     'teal',   150, null, '✓ Distributed',              100, '+16 days ago'),
  ('tacloban', '2',  'Tacloban – EV',   'Tacloban', 'Eastern Visayas','Leyte Normal University',                    'Rolf Genree Garces',        'TBD',                              null,         'rescheduling',  'yellow', 100, null, '⚠ Confirm post-reschedule',  0,   'Awaiting new sched'),
  ('iloilo',   '3',  'Iloilo – WV',     'Iloilo',   'Western Visayas','Central Philippine University, Jaro',        'Ted Hyacinth Aspera & Jose Arron','Apr 18 (Dev Event) + May 16', '2026-05-16', 'in_progress',   'blue',   120, null, '✓ Merch Sent',               10,  '33 days'),
  ('bukidnon', '4',  'Bukidnon',        'Bukidnon', 'Mindanao',       'Bukidnon State University',                  'Zhi / Zhor El (VP)',        'May 6, 2026',                      '2026-05-06', 'in_progress',   'blue',   100, null, '⚠ Not Yet Sent',             20,  '23 days'),
  ('pampanga', '5',  'Pampanga',        'Angeles',  'Central Luzon',  'City College of Angeles, Arayat Blvd',       'Joash Requiez',             'Jun 24, 2026',                     '2026-06-24', 'pencil_booked', 'teal',  null, null, '⚠ Pending — not yet packed', 0,   '72 days · 10 wks'),
  ('laguna',   '6',  'Laguna',          'Laguna',   'CALABARZON',     'TBC',                                        'John Danmel',               'TBC',                              null,         'tbc',           'purple',null, null, '⚠ TBC',                      0,   'Awaiting June confirm')
on conflict (id) do update set
  status = excluded.status,
  pax_actual = excluded.pax_actual,
  progress_percent = excluded.progress_percent,
  updated_at = now();

-- ────────────────────────────────────────────────────────────
-- CHAPTER TASKS
-- ────────────────────────────────────────────────────────────
insert into chapter_tasks (chapter_id, owner, description, status) values
  ('tacloban', 'Rolf',       'Lock new event date with partners this week',               'urgent'),
  ('tacloban', 'Rolf',       'Complete formal ocular at LNU',                             'urgent'),
  ('iloilo',   'Ted',        'CPU Jaro ocular and install planning',                      'pending'),
  ('iloilo',   'Marica',     'WVSU lab ocular visit (T-30 from Apr 18)',                  'pending'),
  ('iloilo',   'Dom',        'Confirm Iloilo lead for Apr 18 SHEisDEVCON Summit',         'pending'),
  ('iloilo',   'Jedd',       'Send Sui/ABA/BOI branding assets to Ted',                  'pending'),
  ('bukidnon', 'Zhi',        'Ocular at BSU + lab installation planning',                 'pending'),
  ('bukidnon', 'Zhi',        'Finalize local student outreach for Sui workshop',          'pending'),
  ('pampanga', 'Joash',      'Confirm slot with Sui Foundation',                          'pending'),
  ('pampanga', 'Joash',      'Formal ocular visit to CCA by May 25 (T-30)',               'pending'),
  ('laguna',   'John Danmel','Scout potential venue in Laguna',                            'pending'),
  ('laguna',   'John Danmel','Confirm June go/no-go for Laguna slot',                     'pending');

-- ────────────────────────────────────────────────────────────
-- KPIs
-- ────────────────────────────────────────────────────────────
insert into kpis (key, label, sublabel, value, color) values
  ('code_camps',            'Code Camps',             'Completed',                    '1/5',   'blue'),
  ('form_submissions',      'Form Submissions',        'Total project completions',    '95',    'teal'),
  ('trained_mentors',       'Trained Mentors',         'Nationwide deployed',          '35',    'teal'),
  ('confirmed_deployments', 'Confirmed Deployments',   '51 students + 35 mentors',     '86',    'teal'),
  ('completion_rate',       'Completion Rate',         '86 / 135 (students + mentors)','63.7%', 'green'),
  ('computer_labs',         'Computer Labs',           'Activated to date',            '3',     'blue')
on conflict (key) do update set value = excluded.value, updated_at = now();

-- ────────────────────────────────────────────────────────────
-- RISKS
-- ────────────────────────────────────────────────────────────
insert into risks (code, title, description, owner, chapter_tag, severity, status) values
  ('R1','Tacloban rescheduling — new LNU date not yet confirmed',
        'Original Apr 11 date did not push through. LNU new schedule pending. Every week of delay compresses the T-minus timeline.',
        'Rolf','Tacloban','high','open'),
  ('R2','Laguna — no confirmed slot, risk of cancellation',
        'Lead assigned: John Danmel. Waiting for June go/no-go from Dom. If not confirmed, slot is cancelled.',
        'Dom / John Danmel','Laguna','high','open'),
  ('R3','Iloilo WVSU venue (Apr 18 Sui Dev Event) not yet formally confirmed',
        'Contact WVSU to confirm. Note: Apr 18 is a Sui-supported developer event, NOT the code camp.',
        'Ted & Jose Arron','Iloilo','medium','open'),
  ('R4','Iloilo CPU Code Camp (May 16) — pencil-booked only',
        'Formally confirm CPU venue with written confirmation ASAP. T-30 ocular due Apr 16.',
        'Ted & Jose Arron','Iloilo','medium','open'),
  ('R5','Pampanga — pencil-booked, slot not yet formally confirmed',
        'Chapter request for Sui Move Code Camp at CCA submitted. Formal Sui Foundation slot confirmation pending. T-30 ocular due May 25.',
        'Joash','Pampanga','medium','open'),
  ('R6','0 pax logged vs. 500 MOU minimum',
        'Log Manila actuals immediately. All chapters must report pax within T+3 days of event.',
        'Dom / Jedd','All Chapters','medium','open'),
  ('R7','DeepSurge listing not yet live',
        'Follow up with @zero_x_j (Jianyi). Needed as secondary proof of student project submission for Q2 report.',
        'Jianyi','All','medium','open'),
  ('R8','Code camp content + installation guide being updated post-Letran pilot',
        'Mike and Lady updating content based on pilot learnings. All chapters must use updated guide — do NOT use pre-Manila version.',
        'Mike + Lady','All Chapters','low','open'),
  ('R9','Q2 narrative report — 4+ camps still to run before Jun 30',
        'Log pax + outcomes per event immediately after each camp. Dom drafts narrative in June. Deadline: June 30, 2026.',
        'Dom / Jedd','HQ','low','open');

-- ────────────────────────────────────────────────────────────
-- CONTACTS
-- ────────────────────────────────────────────────────────────
insert into contacts (name, role, handle, team, chapter_number, emoji, note) values
  ('Harrison Kim',        'Partnership Coordinator (MOU Sec. C.a.ii)',          '@web3tree',   'sui_foundation', null, '🌐', 'Keynote Mar 28 10:30AM'),
  ('Nicole Gomez',        'Sui PH Team / Coordinator',                          '@nicgomez',   'sui_foundation', null, '💜', 'Attended Mar 28 full day'),
  ('Jianyi',              'Sui DevRel (Technical)',                              '@zero_x_j',   'sui_foundation', null, '⚙️', 'DeepSurge · Installation guide'),
  ('Lady Diane Casilang', 'Manila – NCR · Merch Custodian · Content Update',    'C3 GC',       'chapter_lead',   '1',  '1',  null),
  ('Rolf Genree Garces',  'Tacloban – EV',                                      'Sui Training GC','chapter_lead','2',  '2',  null),
  ('Ted Hyacinth Aspera', 'Iloilo – WV',                                        'ted@devcon.ph','chapter_lead',  '3',  '3',  null),
  ('Zhi / Zhor El (VP)',  'Bukidnon',                                           'zhi@devcon.ph','chapter_lead',  '4',  '4',  null),
  ('Joash Requiez',       'Pampanga',                                            'Sui Training GC','chapter_lead','5',  '5',  null),
  ('Mike + Lady Diane Casilang','Updating code camp content and installation guide','All chapters must use updated version','content_team',null,'📝',null),
  ('Marica',              'Iloilo On-ground Lead — Apr 18 Sui Dev Event',        'Working with Ted Aspera','content_team',null,'📋',null);

-- ────────────────────────────────────────────────────────────
-- MERCH ITEMS
-- ────────────────────────────────────────────────────────────
insert into merch_items (name, quantity, distribution, status, category) values
  ('T-Shirt Batch 1 (S-20 M-40 L-30 XL-10)', 100, 'Volunteers + raffle',   'received',  'jcr'),
  ('T-Shirt Batch 2 (S-20 M-40 L-30 XL-10)', 100, 'Volunteers + raffle',   'received',  'jcr'),
  ('Black Mugs',                               30,  'Raffle / VIP',          'received',  'jcr'),
  ('Button Pins (1.75" + 2.25")',             200,  'Raffle',                'received',  'jcr'),
  ('Mousepad',                                100,  'Raffle',                'received',  'jcr'),
  ('Tote Bag',                                 50,  'VIP / Part 2 dinner',   'received',  'jcr'),
  ('Lanyards',                                100,  'Distribution',          'received',  'jcr'),
  ('Pull-up Banner',                            4,  'Events',                'received',  'jcr'),
  ('Wireless Fan Pink (20 pcs)',               20,  'SHEisDEVCON / VIP',     'confirm',   'lazada'),
  ('Wireless Mouse Rose Gold (20 pcs)',        20,  'VIP',                   'confirm',   'lazada'),
  ('White charging wires kit (50 pcs)',        50,  'Distribution',          'confirm',   'lazada'),
  ('VIP pen — engraved "BUIDL | DEVCON x Sui" (40 pcs)', 40, 'VIP', 'confirmed', 'lazada'),
  ('Baseus 3-in-1 retractable USB (10 pcs, VIP)', 10, 'VIP Kit',            'confirm',   'lazada'),
  ('Umbrella Order A: Pink 8-rib auto (30 pcs)', 30, 'SHEisDEVCON',         'confirm',   'shopee'),
  ('Umbrella Order B: Navy ×20 + Pink ×20 (40 pcs)', 40, 'SHEisDEVCON',    'confirm',   'shopee');

-- ────────────────────────────────────────────────────────────
-- RESOURCE LINKS
-- ────────────────────────────────────────────────────────────
insert into resource_links (name, description, url, icon, icon_color, category) values
  ('Partner Logos',              'Sui · ABA · BOI',                        'https://drive.google.com/drive/u/0/folders/1PgEi7H96KE2Cect9b6CRbmMgtkT-Ca4?role=writer', '📁','blue',  'operations'),
  ('Looping Event Videos',       'For use during events + breaks',          'https://drive.google.com/drive/u/0/folders/1x0CJkf_WmPqMcXEpKekBwKwkBoDMlAd3',           '🎬','blue',  'operations'),
  ('Exercise Completion Form',   'Student submission · Q2 proof',           'https://forms.gle/RBtZW4kJwGhiM3g76',                                                       '📝','teal',  'operations'),
  ('Technical Installation Guide','Updated post-Letran pilot (Mike + Lady)','https://docs.google.com/document/d/1FI-gO9vMMcdMJqU8p1YtoAyxyjFQRyMxFKcJH4eocr8',        '🔧','yellow','operations'),
  ('SHEisDEVCON 2026 Guidelines','Event guidelines + materials',            'https://docs.google.com/presentation/d/1cTLY77rA-0ljnHm2xKKxYnBPLldJP7bM',               '📊','blue',  'operations');
