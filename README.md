# 🧠 HeroBrine AI

<div align="center">

**An AI-powered commitment intelligence platform that transforms conversations, documents, images, and voice into structured, actionable commitments.**

Capture tasks from the web or Discord, extract deadlines and priorities with AI, and manage everything from one secure dashboard.

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Profiles-3FCF8E?logo=supabase)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-8E75B2?logo=google)](https://ai.google.dev/)
[![Discord](https://img.shields.io/badge/Discord-Bot%20Integration-5865F2?logo=discord)](https://discord.com/developers/docs/intro)
[![Railway](https://img.shields.io/badge/Railway-Backend%20%26%20Bot-0B0D0E?logo=railway)](https://railway.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend-black?logo=vercel)](https://vercel.com/)

</div>

---

## Overview

HeroBrine AI is a full-stack productivity platform built to reduce the friction between **remembering a commitment** and **organizing it properly**.

A user can enter plain text, upload an image, PDF, or voice recording, or mention the HeroBrine bot inside Discord. The platform extracts actionable commitments, detects dates, assigns categories and priorities, saves them to PostgreSQL, and makes them immediately available inside the user’s dashboard.

```text
Unstructured input
        ↓
AI extraction
        ↓
Structured commitment
        ↓
Secure persistence
        ↓
Dashboard, calendar, analytics, and reminders
```

---

## Live Application

| Service | URL |
|---|---|
| Web Application | `https://your-frontend.vercel.app` |
| FastAPI Documentation | `https://your-backend.up.railway.app/docs` |
| Backend Health Check | `https://your-backend.up.railway.app/health` |

---

## Demo



### Product Demo

[▶ Watch the HeroBrine AI demo](assets/demo.mp4)

---

## Screenshots

<div align="center">

### Dashboard

![HeroBrine Dashboard](assets/dashboard.png)

### Discord Ingestion

![Discord Bot Demo](assets/discord-demo.png)

</div>

<table>
  <tr>
    <td width="50%">
      <strong>Calendar</strong><br />
      <img src="assets/calendar.png" alt="HeroBrine Calendar" />
    </td>
    <td width="50%">
      <strong>Analytics</strong><br />
      <img src="assets/analytics.png" alt="HeroBrine Analytics" />
    </td>
  </tr>
</table>

---

## Core Features

### AI Commitment Extraction

HeroBrine extracts structured commitments from:

- Plain text
- Images and screenshots
- PDF documents
- Voice recordings
- Discord messages and attachments

Example:

```text
Submit the operating systems assignment tomorrow at 5 PM.
```

Becomes:

```json
{
  "title": "Submit operating systems assignment",
  "category": "assignment",
  "priority": "high",
  "deadline": "2026-07-14T17:00:00+05:30",
  "estimated_duration": null,
  "dependencies": [],
  "ai_confidence": 0.94
}
```

### Secure Authentication

- Email/password authentication with Supabase
- Google OAuth support
- Supabase session handling in Next.js
- JWT-protected FastAPI routes
- Per-user commitment isolation
- Row Level Security for user profiles

### Commitment Management

Users can:

- Create commitments manually
- Edit title, description, deadline, category, and priority
- Mark commitments complete
- Delete commitments
- View due, upcoming, overdue, and completed items
- Access commitments through a calendar view

### Discord Bot Integration

A linked Discord user can directly mention HeroBrine:

```text
@HeroBrine Submit the final report tomorrow at 7 PM
```

The bot can process:

- Text
- Images
- PDFs
- Voice messages and supported audio files

The extracted commitments are saved to the correct HeroBrine account and appear immediately on the dashboard.

### Discord OAuth Account Linking

Users do not need to copy Discord IDs manually.

```text
HeroBrine Profile
        ↓
Connect Discord
        ↓
Discord OAuth identify scope
        ↓
Verified Discord user ID
        ↓
Supabase profiles.discord_id
```

The database prevents one Discord account from being linked to multiple HeroBrine users.

### Calendar

- Monthly commitment view
- Due-date visualization
- Upcoming commitment discovery
- Quick navigation to commitment details

### Analytics

- Total, pending, completed, and overdue commitments
- Completion trends
- Weekly activity
- Category distribution
- Productivity recommendations

### Notifications

The dashboard notification menu dynamically surfaces:

- Overdue commitments
- Commitments due today
- Commitments due tomorrow
- Recently completed commitments

### User Profile and Settings

- Auth identity
- User avatar
- Timezone preference
- Discord connection state
- Telegram-ready profile field
- Notification preference
- Light, dark, and system themes

---

## Architecture

HeroBrine follows a **modular, service-oriented full-stack architecture** with clear separation between identity, ingestion, AI processing, persistence, and presentation.

```mermaid
flowchart TB
    U[User] --> FE[Next.js Web Application]
    U --> DC[Discord]

    FE --> SA[Supabase Auth]
    FE --> SP[Supabase Profiles]
    FE --> API[FastAPI Backend]

    DC --> BOT[Discord Bot]
    BOT --> SP
    BOT --> IAPI[Protected Internal Discord API]

    IAPI --> AIS[AI Ingestion Service]
    API --> AIS

    AIS --> TXT[Text Extraction]
    AIS --> IMG[Gemini Vision]
    AIS --> PDF[PDF Parser]
    AIS --> VOI[Faster Whisper]

    TXT --> GEM[Google Gemini]
    IMG --> GEM
    PDF --> GEM
    VOI --> GEM

    GEM --> MAP[Schema Validation and Mapping]
    MAP --> PG[(PostgreSQL Commitments)]

    PG --> API
    API --> FE
```

---

## Discord Ingestion Architecture

```mermaid
sequenceDiagram
    participant User as Discord User
    participant Bot as HeroBrine Bot
    participant Supabase as Supabase Profiles
    participant API as FastAPI Internal API
    participant AI as Gemini / Parsers
    participant DB as PostgreSQL

    User->>Bot: Mention bot with text or attachment
    Bot->>Supabase: Lookup profiles.discord_id
    Supabase-->>Bot: HeroBrine user UUID
    Bot->>API: POST /internal/discord/{type}
    API->>AI: Extract structured commitments
    AI-->>API: Validated commitments
    API->>DB: Save with resolved user_id
    DB-->>API: Created records
    API-->>Bot: Saved commitments
    Bot-->>User: Confirmation message
```

The bot never:

- Connects directly to the commitments database
- Calls Gemini directly
- Mints Supabase user JWTs
- Stores user access tokens

It acts as a thin, trusted ingestion client.

---

## AI Processing Pipelines

### Text

```text
Text
→ Gemini
→ Structured JSON
→ Pydantic validation
→ Commitment mapper
→ PostgreSQL
```

### Image

```text
Image upload
→ Format and size validation
→ Gemini Vision
→ Structured commitment schema
→ PostgreSQL
```

### PDF

```text
PDF upload
→ PDF text extraction
→ Gemini
→ Structured commitments
→ PostgreSQL
```

### Voice

```text
Audio upload
→ Faster Whisper transcription
→ Gemini
→ Structured commitments
→ PostgreSQL
```

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| UI and Motion | Radix UI, Base UI, Framer Motion, Lucide Icons |
| Data Fetching | Axios, TanStack React Query |
| Calendar | FullCalendar, React Day Picker, date-fns |
| Charts | Recharts |
| Backend | FastAPI, Python |
| Validation | Pydantic |
| ORM | SQLAlchemy |
| Migrations | Alembic |
| Primary Database | PostgreSQL |
| Authentication | Supabase Auth |
| Profile Storage | Supabase PostgreSQL with RLS |
| AI | Google Gemini 2.5 Flash |
| Image Understanding | Gemini Vision |
| Voice Transcription | Faster Whisper |
| PDF Processing | Python PDF parser |
| Discord Integration | discord.py |
| Frontend Deployment | Vercel |
| Backend Deployment | Railway |
| Bot Deployment | Railway |
| Production Database | Railway PostgreSQL |

---

## Repository Structure

```text
HeroBrine-AI/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   └── types/
│
├── backend/
│   ├── alembic/
│   ├── app/
│   │   ├── ai/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── parsers/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── tests/
│   ├── requirements.txt
│   └── .python-version
│
├── discord_bot/
│   ├── handlers/
│   ├── services/
│   ├── tests/
│   ├── bot.py
│   └── config.py
│
├── database/
│   └── init.sql
│
├── assets/
└── README.md
```

---

## API Overview

### Public AI Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/ai/extract` | Extract commitments from text without saving |
| `POST` | `/ai/save` | Extract text commitments and save them |
| `POST` | `/ai/image` | Extract and save commitments from an image |
| `POST` | `/ai/pdf` | Extract and save commitments from a PDF |
| `POST` | `/ai/voice` | Extract and save commitments from audio |

### Commitment Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/commitments` | Get all commitments for the authenticated user |
| `POST` | `/commitments` | Create a commitment |
| `GET` | `/commitments/{id}` | Get a single commitment |
| `PATCH` | `/commitments/{id}` | Partially update a commitment |
| `DELETE` | `/commitments/{id}` | Delete a commitment |

### Internal Discord Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/internal/discord/text` | Process Discord text |
| `POST` | `/internal/discord/image` | Process a Discord image |
| `POST` | `/internal/discord/pdf` | Process a Discord PDF |
| `POST` | `/internal/discord/voice` | Process Discord voice/audio |

Internal routes require:

```http
X-HeroBrine-Internal-Key: <shared-secret>
```

---

## Local Development

### Prerequisites

- Node.js 20+
- Python 3.12
- PostgreSQL
- Git
- A Supabase project
- A Google Gemini API key
- A Discord application and bot

### Clone the Repository

```bash
git clone https://github.com/your-username/HeroBrine-AI.git
cd HeroBrine-AI
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_REDIRECT_URI=http://localhost:3000/api/discord/callback
```

Run:

```bash
npm run dev
```

### Backend Setup

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Linux/macOS:

```bash
source .venv/bin/activate
```

Install and run:

```bash
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/herobrine
APP_ENV=development
DEBUG=true
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
HEROBRINE_INTERNAL_API_KEY=
ALLOWED_ORIGINS=http://localhost:3000
SUPABASE_URL=
```

### Discord Bot Setup

Create `discord_bot/.env`:

```env
DISCORD_BOT_TOKEN=
HEROBRINE_API_BASE_URL=http://127.0.0.1:8000
HEROBRINE_INTERNAL_API_KEY=
SUPABASE_URL=
SUPABASE_SECRET_KEY=
```

Run:

```bash
cd discord_bot
pip install -r requirements.txt
python bot.py
```

---

## Supabase Profile Table

HeroBrine uses Supabase Auth for identity and a separate profile row for application-specific settings.

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  discord_id TEXT,
  telegram_id TEXT,
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Recommended unique Discord mapping:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS profiles_discord_id_unique
ON public.profiles (discord_id)
WHERE discord_id IS NOT NULL;
```

RLS should allow authenticated users to read, insert, and update only their own row.

---

## Environment Variables

### Frontend — Vercel

| Variable | Visibility | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase browser key |
| `NEXT_PUBLIC_API_BASE_URL` | Public | Railway backend URL |
| `DISCORD_CLIENT_ID` | Server only | Discord OAuth application ID |
| `DISCORD_CLIENT_SECRET` | Server only | Discord OAuth secret |
| `DISCORD_REDIRECT_URI` | Server only | Production OAuth callback |

### Backend — Railway

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Railway PostgreSQL connection |
| `GEMINI_API_KEY` | Gemini authentication |
| `GEMINI_MODEL` | Gemini model name |
| `HEROBRINE_INTERNAL_API_KEY` | Internal bot-to-backend authentication |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |
| `SUPABASE_URL` | Supabase/JWKS project URL |
| `APP_ENV` | Environment name |
| `DEBUG` | Debug mode |

### Discord Bot — Railway

| Variable | Purpose |
|---|---|
| `DISCORD_BOT_TOKEN` | Discord bot login |
| `HEROBRINE_API_BASE_URL` | Deployed FastAPI URL |
| `HEROBRINE_INTERNAL_API_KEY` | Shared internal key |
| `SUPABASE_URL` | Profile lookup project URL |
| `SUPABASE_SECRET_KEY` | Server-side Supabase key |

Never expose these in browser code:

```text
DATABASE_URL
GEMINI_API_KEY
DISCORD_BOT_TOKEN
DISCORD_CLIENT_SECRET
HEROBRINE_INTERNAL_API_KEY
SUPABASE_SECRET_KEY
SUPABASE_SERVICE_ROLE_KEY
```

---

## Deployment

### Frontend

Deploy `frontend/` to Vercel.

```text
Root Directory: frontend
Framework: Next.js
Build Command: npm run build
```

### Backend

Deploy `backend/` to Railway.

```text
Root Directory: /backend
Pre-deploy Command: alembic upgrade head
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Discord Bot

Deploy `discord_bot/` as a separate Railway worker service.

```text
Root Directory: /discord_bot
Start Command: python bot.py
```

The bot does not need a public domain.

### Production Connections

```text
Vercel Frontend
    ↓
Railway FastAPI
    ↓
Railway PostgreSQL

Discord Bot
    ↓
Supabase profile lookup
    ↓
Railway internal API
    ↓
Railway PostgreSQL
```

---

## Production Checklist

- [ ] Frontend builds successfully
- [ ] Backend migrations complete
- [ ] `/health` returns `{"status":"ok"}`
- [ ] CORS includes the Vercel domain
- [ ] Supabase Site URL points to production
- [ ] Discord production callback is registered
- [ ] Bot and backend share the same internal API key
- [ ] Discord bot is online
- [ ] Text extraction works
- [ ] Image extraction works
- [ ] PDF extraction works
- [ ] Voice extraction works
- [ ] Discord linking works
- [ ] Disconnect works
- [ ] Two users cannot access each other’s commitments
- [ ] Secrets are not committed to Git

---

## Testing

Backend:

```bash
cd backend
python -m pytest
python -m compileall app
```

Discord bot:

```bash
cd discord_bot
python -m pytest
python -m compileall .
```

Frontend:

```bash
cd frontend
npm run build
```

Recommended Discord tests:

```text
1. Mention + text
2. Mention + PNG/JPEG/WebP
3. Mention + PDF
4. Mention + voice message
5. Unsupported ZIP/video
6. Multiple attachments
7. Unlinked Discord user
8. Two linked HeroBrine users
```

---

## Security

HeroBrine applies multiple security boundaries:

- Supabase Auth for user identity
- JWT validation on protected FastAPI routes
- Per-user query scoping for commitments
- Supabase RLS for profiles
- OAuth state validation for Discord linking
- Unique Discord account mapping
- Shared internal key for bot-only endpoints
- Server-only Supabase secret usage
- Environment-based CORS allowlist
- No secrets in frontend bundles
- No direct database access from the Discord bot

---

## Current Limitations

- One attachment is processed per Discord message
- Caption text is ignored when an attachment is present
- PDF extraction is optimized for text-based PDFs
- Voice processing may require more memory than text/image extraction
- AI Planner is reserved for a later release
- Notification state is session-based in the current version
- Telegram integration is not yet implemented

---

## Roadmap

### Completed

- [x] Secure authentication
- [x] Commitment CRUD
- [x] Text extraction
- [x] Image extraction with Gemini Vision
- [x] PDF extraction
- [x] Voice extraction
- [x] Discord bot integration
- [x] Discord OAuth linking
- [x] Calendar
- [x] Analytics
- [x] Profile and settings
- [x] Vercel and Railway deployment

### Planned

- [ ] AI Planner
- [ ] Telegram bot
- [ ] WhatsApp integration
- [ ] Google Calendar synchronization
- [ ] Gmail commitment extraction
- [ ] Microsoft Outlook integration
- [ ] Mixed caption and attachment processing
- [ ] Multiple attachments per message
- [ ] Persistent reminder delivery
- [ ] Team workspaces
- [ ] Shared commitments
- [ ] Mobile application
- [ ] Natural-language recurring commitments

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "Add your feature"
```

4. Push your branch.

```bash
git push origin feature/your-feature
```

5. Open a pull request.

Keep changes focused and include tests for new backend or bot behavior.

---

## License

This project is licensed under the MIT License.

Add a `LICENSE` file at the repository root before publishing under MIT.

---

## Author

**Achyant Shrivastava**  
B.Tech, IIT (BHU) Varanasi

<div align="center">

Built with ❤️ to make everyday commitments easier to capture, organize, and complete.

### ⭐ Star the repository if you found HeroBrine AI useful.

</div>
