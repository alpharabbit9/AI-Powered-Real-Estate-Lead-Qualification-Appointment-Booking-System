# PropIQ — AI Real Estate Appointment Booking & Conversion System

A complete production-ready SaaS application that converts property inquiries into booked consultations using AI qualification, automated email sequences, and Google Calendar integration.

---

## Architecture Overview

```
Lead Inquiry (/)
    ↓ POST to n8n webhook
Groq AI Qualification
    ↓
Supabase (lead stored)
    ↓
IF score >= 8 (Hot Lead)
  → Generate meeting brief
  → Send personalized booking email
  → Notify agent
  
IF score < 8 (Nurture)
  → Send acknowledgment email
  → 24h/48h/72h reminder sequence

Booking Page (/book/[leadId])
    ↓ Select time slot (Google Calendar)
Create Calendar Event + Meet Link
    ↓
Send confirmation to lead + agent
    ↓
Dashboard (/dashboard)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 App Router, TypeScript, Tailwind CSS |
| UI Components | Custom shadcn/ui components (dark theme) |
| Animations | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| AI | Groq API (llama-3.3-70b-versatile) |
| Automation | n8n |
| Calendar | Google Calendar API |
| Email | Resend |
| Charts | Recharts |
| Fonts | Geist Sans/Mono |
| Deployment | Vercel |

---

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Groq API key (free tier available)
- Resend account (free tier: 3000 emails/month)
- Google Cloud project with Calendar API enabled
- n8n instance (self-hosted or cloud)

---

## Setup Instructions

### 1. Clone & Install

```bash
cd "AI Real Estate Appointment Booking & Conversion System"
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`:

```env
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Groq AI
GROQ_API_KEY=gsk_xxx...

# Google Calendar
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GOOGLE_REFRESH_TOKEN=1//xxx...
GOOGLE_CALENDAR_ID=primary

# Resend Email
RESEND_API_KEY=re_xxx...
RESEND_FROM_EMAIL=noreply@yourdomain.com
AGENT_EMAIL=agent@yourdomain.com

# n8n
N8N_WEBHOOK_URL=http://localhost:5678/webhook/lead-qualification
```

### 3. Database Setup

1. Create a new Supabase project
2. Open SQL Editor in Supabase Dashboard
3. Run the migration file:

```sql
-- Copy and run contents of:
supabase/migrations/001_initial_schema.sql
```

This creates all tables, indexes, RLS policies, and seed data.

### 4. Create Demo User

In Supabase Dashboard → Authentication → Users → Create User:
- Email: `agent@propiq.com`
- Password: `demo1234`

### 5. Google Calendar Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select a project
3. Enable **Google Calendar API**
4. Create OAuth 2.0 credentials (Web Application)
5. Add redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Get refresh token using OAuth playground:
   - Go to https://developers.google.com/oauthplayground
   - Select `Google Calendar API v3` → `https://www.googleapis.com/auth/calendar`
   - Exchange authorization code for tokens
   - Copy the `refresh_token`

### 6. n8n Workflow Setup

1. Start n8n: `docker run -p 5678:5678 n8nio/n8n`
2. Go to `http://localhost:5678`
3. Import workflows:
   - **Lead Qualification Pipeline**: `n8n/lead-qualification-workflow.json`
   - **Reminder Pipeline**: `n8n/reminder-workflow.json`
4. Set n8n environment variables:
   ```
   GROQ_API_KEY=your_key
   SUPABASE_URL=your_url
   SUPABASE_SERVICE_KEY=your_service_key
   RESEND_API_KEY=your_key
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   AGENT_EMAIL=agent@yourdomain.com
   APP_URL=http://localhost:3000
   ```
5. Activate both workflows
6. Copy the webhook URL and update `NEXT_PUBLIC_N8N_WEBHOOK_URL` in `.env.local`

### 7. Run Development Server

```bash
npm run dev
```

Visit:
- `http://localhost:3000` — Lead inquiry form
- `http://localhost:3000/login` — Agent login
- `http://localhost:3000/dashboard` — Agent dashboard
- `http://localhost:3000/book/[leadId]` — Booking page

---

## Application Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Lead capture form | No |
| `/login` | Agent login | No |
| `/book/[leadId]` | Appointment booking page | No |
| `/dashboard` | Overview dashboard | Yes |
| `/dashboard/leads` | Lead management | Yes |
| `/dashboard/appointments` | Appointment management | Yes |
| `/dashboard/appointments/[id]` | Meeting detail & brief | Yes |
| `/dashboard/analytics` | Pipeline analytics | Yes |

---

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/leads` | Create lead + AI qualification |
| GET | `/api/leads` | Get all leads |
| GET | `/api/leads/[id]` | Get lead by ID |
| PATCH | `/api/leads/[id]` | Update lead |
| POST | `/api/appointments` | Book appointment |
| GET | `/api/appointments` | Get all appointments |
| GET | `/api/appointments/[id]` | Get appointment |
| PATCH | `/api/appointments/[id]` | Update appointment status |
| GET | `/api/slots` | Get available calendar slots |
| GET | `/api/dashboard/stats` | Dashboard statistics |

---

## n8n Workflow Details

### Lead Qualification Pipeline (`lead-qualification-workflow.json`)

**Nodes:**
1. **Webhook Trigger** — Receives POST from lead form
2. **Validate Data** — Checks required fields, email format
3. **Groq AI Qualification** — Calls Groq API with custom prompt
4. **Parse Qualification** — Extracts score, intent, urgency
5. **Store Lead in Supabase** — Persists lead record
6. **Prepare Routing** — Determines hot vs nurture path
7. **Route by Score** — IF lead_score >= 8 → Hot Path
8. **Generate Meeting Brief** — AI-generated consultation brief
9. **Store Meeting Brief** — Saves to Supabase
10. **Send Booking Email** — Personalized email via Resend
11. **Notify Agent** — Agent alert email
12. **Log Activity** — Activity log entry
13. **Send Response** — Returns JSON response

### Reminder Pipeline (`reminder-workflow.json`)

**Schedule:** Every 12 hours

**Logic:**
- 24-48h without booking → Reminder #1
- 48-72h without booking → Reminder #2
- 72h+ without booking → Mark as Cold

---

## Database Schema

```sql
leads              -- Property inquiries with AI scores
appointments       -- Scheduled consultations
meeting_briefs     -- AI-generated meeting preparation
activity_logs      -- Full audit trail
```

---

## Design System

- **Background**: `#0a0a0a`
- **Cards**: `#111111`
- **Accent**: `#00E5FF` (Cyan)
- **Border**: `rgba(255,255,255,0.08)`
- **Radius**: 24px
- **Font**: Geist Sans
- **Shadow**: `0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.4)`

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... (all env vars)
```

Or deploy via Vercel Dashboard → Import Git Repository.

**Important for production:**
1. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
2. Update Google OAuth redirect URIs
3. Update n8n webhook URL
4. Enable Supabase Edge Functions if using Realtime

---

## Groq Qualification Prompt

The AI scores leads 0-10 based on:

| Factor | Points |
|--------|--------|
| Budget specified | 0-2 |
| Property type specified | 0-2 |
| Urgency signals | 0-2 |
| Message detail level | 0-2 |
| Purchase intent | 0-2 |

**Score Routing:**
- `>= 8` → Hot Lead → Immediate booking email + brief
- `5-7` → Warm Lead → Nurture sequence
- `< 5` → Cold Lead → Basic acknowledgment

---

## Seed Data

The migration includes 8 demo leads with varying scores and 1 demo appointment to test all features immediately.

Demo credentials: `agent@propiq.com` / `demo1234`

---

## License

MIT — Built for PropIQ AI Automation Demo
