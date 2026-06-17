-- ============================================
-- PropIQ Real Estate AI System
-- Initial Database Schema
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- LEADS TABLE
-- ============================================
create table if not exists public.leads (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Contact Information
  name text not null,
  email text not null,
  phone text default '' not null,

  -- Property Details
  location text default '' not null,
  property_type text not null,
  budget text default '' not null,
  message text default '' not null,

  -- AI Qualification
  lead_score integer default 0 not null check (lead_score >= 0 and lead_score <= 10),
  status text default 'new' not null check (status in ('new', 'qualified', 'hot', 'warm', 'cold', 'booked', 'completed', 'lost')),
  booking_status text default 'pending' not null check (booking_status in ('pending', 'booked', 'completed', 'missed', 'cancelled')),
  close_probability integer default 0 not null check (close_probability >= 0 and close_probability <= 100),
  last_contacted timestamp with time zone
);

-- Indexes for leads
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_lead_score on public.leads(lead_score);
create index if not exists idx_leads_created_at on public.leads(created_at desc);
create index if not exists idx_leads_email on public.leads(email);

-- ============================================
-- APPOINTMENTS TABLE
-- ============================================
create table if not exists public.appointments (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  lead_id uuid not null references public.leads(id) on delete cascade,
  appointment_date timestamp with time zone not null,
  meeting_link text default '' not null,
  status text default 'scheduled' not null check (status in ('scheduled', 'completed', 'missed', 'cancelled')),
  notes text,

  -- Google Calendar
  calendar_event_id text
);

-- Indexes for appointments
create index if not exists idx_appointments_lead_id on public.appointments(lead_id);
create index if not exists idx_appointments_status on public.appointments(status);
create index if not exists idx_appointments_date on public.appointments(appointment_date);

-- ============================================
-- MEETING BRIEFS TABLE
-- ============================================
create table if not exists public.meeting_briefs (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  lead_id uuid not null references public.leads(id) on delete cascade,
  summary text not null,
  buyer_intent text not null,
  objections text not null,
  suggested_questions text not null
);

-- Indexes for meeting_briefs
create index if not exists idx_meeting_briefs_lead_id on public.meeting_briefs(lead_id);

-- ============================================
-- ACTIVITY LOGS TABLE
-- ============================================
create table if not exists public.activity_logs (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  lead_id uuid not null references public.leads(id) on delete cascade,
  action text not null,
  details text default '' not null
);

-- Indexes for activity_logs
create index if not exists idx_activity_logs_lead_id on public.activity_logs(lead_id);
create index if not exists idx_activity_logs_created_at on public.activity_logs(created_at desc);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
alter table public.leads enable row level security;
alter table public.appointments enable row level security;
alter table public.meeting_briefs enable row level security;
alter table public.activity_logs enable row level security;

-- Service role bypass (for server-side operations)
create policy "Service role full access to leads"
  on public.leads
  using (auth.jwt() ->> 'role' = 'service_role');

create policy "Service role full access to appointments"
  on public.appointments
  using (auth.jwt() ->> 'role' = 'service_role');

create policy "Service role full access to meeting_briefs"
  on public.meeting_briefs
  using (auth.jwt() ->> 'role' = 'service_role');

create policy "Service role full access to activity_logs"
  on public.activity_logs
  using (auth.jwt() ->> 'role' = 'service_role');

-- Authenticated users (agents/admins) can read all
create policy "Authenticated users can read leads"
  on public.leads for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can update leads"
  on public.leads for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can read appointments"
  on public.appointments for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can update appointments"
  on public.appointments for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can read meeting briefs"
  on public.meeting_briefs for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can read activity logs"
  on public.activity_logs for select
  using (auth.role() = 'authenticated');

-- Public can insert leads (via API)
create policy "Anyone can insert leads"
  on public.leads for insert
  with check (true);

-- ============================================
-- SEED DATA (Demo)
-- ============================================

-- Insert demo leads
insert into public.leads (name, email, phone, location, property_type, budget, message, lead_score, status, booking_status, close_probability) values
('Sarah Mitchell', 'sarah.mitchell@gmail.com', '+1 (555) 234-5678', 'Manhattan, NY', 'Luxury Condominium', '$1,200,000 – $2,000,000', 'Looking for a modern 2BR condo in Manhattan. Need parking and gym. Ready to move in 60 days.', 9, 'hot', 'pending', 85),
('James Anderson', 'j.anderson@company.com', '+1 (555) 345-6789', 'Brooklyn, NY', 'Single Family Home', '$800,000 – $1,200,000', 'Growing family needs 4BR house with good school district. Pre-approved for mortgage.', 8, 'hot', 'booked', 78),
('Emily Chen', 'emily.chen@startup.io', '+1 (555) 456-7890', 'Austin, TX', 'Investment Property', '$400,000 – $600,000', 'Interested in rental income properties. Have capital ready. Looking at multiple options.', 7, 'warm', 'pending', 62),
('Michael Torres', 'm.torres@email.com', '+1 (555) 567-8901', 'Miami, FL', 'Luxury Villa', '$2,000,000 – $5,000,000', 'Seeking oceanfront property for primary residence. Cash buyer. Very motivated.', 10, 'hot', 'pending', 92),
('Lisa Park', 'lisa.park@corp.com', '+1 (555) 678-9012', 'San Francisco, CA', 'Condominium', '$600,000 – $800,000', 'First time buyer, tech professional. Looking for something modern near downtown.', 6, 'warm', 'pending', 55),
('David Kim', 'david.kim@gmail.com', '', 'Seattle, WA', 'Townhouse', '$400,000 – $600,000', 'Browsing options, not sure about timeline yet.', 4, 'cold', 'pending', 30),
('Rachel Green', 'rachel.green@firm.com', '+1 (555) 789-0123', 'Boston, MA', 'Multi-Family', '$1,200,000 – $2,000,000', 'Real estate investor looking for 4-6 unit building. Strong rental market preferred.', 8, 'hot', 'pending', 80),
('Tom Bradley', 'tom.b@personal.net', '+1 (555) 890-1234', 'Chicago, IL', 'Single Family Home', '$200,000 – $400,000', 'Relocating for work. Need 3BR with good commute to downtown.', 7, 'warm', 'pending', 65);

-- Insert demo appointments for James Anderson
insert into public.appointments (lead_id, appointment_date, meeting_link, status, notes)
select
  l.id,
  now() + interval '3 days' + interval '10 hours',
  'https://meet.google.com/abc-defg-hij',
  'scheduled',
  'Pre-approved buyer, highly motivated'
from public.leads l where l.email = 'j.anderson@company.com';

-- Insert demo activity logs
insert into public.activity_logs (lead_id, action, details)
select id, 'lead_created', 'Lead created with score 9/10. Intent: buying. High urgency detected.'
from public.leads where email = 'sarah.mitchell@gmail.com';

insert into public.activity_logs (lead_id, action, details)
select id, 'booking_email_sent', 'Personalized booking email sent to hot lead'
from public.leads where email = 'sarah.mitchell@gmail.com';

insert into public.activity_logs (lead_id, action, details)
select id, 'meeting_brief_generated', 'AI meeting brief generated for consultation preparation'
from public.leads where email = 'j.anderson@company.com';

insert into public.activity_logs (lead_id, action, details)
select id, 'appointment_booked', 'Consultation scheduled via booking page'
from public.leads where email = 'j.anderson@company.com';

-- Insert a demo meeting brief
insert into public.meeting_briefs (lead_id, summary, buyer_intent, objections, suggested_questions)
select
  l.id,
  'James Anderson is a highly motivated buyer with pre-approved mortgage financing. Growing family requires 4-bedroom home with quality school access. Ready to proceed immediately with the right property.',
  'Strong purchase intent with immediate timeline. Pre-approved financing eliminates common barriers. Family-driven motivation creates urgency. Likely to close within 30-45 days of finding the right property.',
  'School district quality, Property inspection concerns, Price negotiation, Timeline alignment with current housing situation',
  'Which school districts are most important for your family?
What does your ideal neighborhood look like beyond the schools?
Are there any specific architectural styles or features you must have?
What is your flexibility on move-in date?
Have you seen properties that came close to what you want?'
from public.leads l where l.email = 'j.anderson@company.com';
