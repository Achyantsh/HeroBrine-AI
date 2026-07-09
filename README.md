# 🧠 HeroBrine AI

> **Your AI-powered productivity companion that transforms conversations into actionable commitments.**

HeroBrine AI helps users capture commitments from multiple platforms—including the web application and Discord—and automatically converts them into structured tasks using AI. Whether a commitment is hidden inside a chat message, voice note, PDF, or image, HeroBrine extracts it, stores it, and helps users stay accountable.

---

# ✨ Features

### 🌐 Web Dashboard
- Secure authentication with Supabase Auth
- Personalized dashboard
- Commitment management
- AI Planner
- Calendar view
- Analytics dashboard
- User profile
- Dark UI

---
<p align="center">
  <img src="assets/Screenshot 2026-07-10 002910.png" width="900"/>
  <br>
  <em>HeroBrine AI Dashboard</em>
</p>
### 🤖 AI Commitment Extraction

Extract commitments from:

- ✅ Plain Text
- 🎤 Voice Notes
- 🖼 Images
- 📄 PDFs

Powered by Google Gemini.

Examples:

> "I'll finish the report tomorrow."

↓

```
Title: Finish report
Deadline: Tomorrow
Priority: Medium
```

---

### 🤖 Discord Bot Integration

Simply mention HeroBrine inside Discord.

Example

```
@HeroBrine
Remind me to finish my ML assignment by Friday.
```

HeroBrine automatically:

1. Detects the mention
2. Identifies the Discord user
3. Finds the linked HeroBrine account
4. Sends the content to AI
5. Extracts commitments
6. Saves them into PostgreSQL
7. Shows them instantly inside the HeroBrine dashboard

Supports:

- Text
- Images
- PDFs
- Voice attachments

---

### 📊 Commitment Analytics

Visualize productivity through:

- Daily completion rate
- Weekly trends
- Monthly summaries
- Pending commitments
- Completed commitments
- AI-generated productivity insights

---

### 📅 Calendar Integration

View commitments on an interactive calendar.

Supports:

- Upcoming deadlines
- Due today
- Overdue commitments
- Monthly planning

---

### 👤 User Profile

Profile information is managed directly using Supabase.

Stores:

- User Identity
- Timezone
- Discord ID
- Telegram ID
- Notification Preferences

---

### 🔗 Discord Account Linking

Each HeroBrine account can be linked with one Discord account.

After linking:

```
Discord User
        │
        ▼
Discord Bot
        │
        ▼
Supabase Profiles
        │
Discord ID Found
        │
        ▼
PostgreSQL Commitments
```

---

# 🏗 Architecture

```
                        ┌──────────────────┐
                        │    Next.js App   │
                        └────────┬─────────┘
                                 │
                                 │ Supabase Auth
                                 │
                                 ▼
                      ┌─────────────────────┐
                      │      Supabase       │
                      │                     │
                      │ auth.users          │
                      │ profiles            │
                      └─────────┬───────────┘
                                │
             Profile + Discord Mapping
                                │
                                ▼
                      ┌─────────────────────┐
                      │    Discord Bot      │
                      └─────────┬───────────┘
                                │
          Message / Voice / PDF / Image
                                │
                                ▼
                      ┌─────────────────────┐
                      │    FastAPI Backend  │
                      └─────────┬───────────┘
                                │
                                ▼
                       AI Extraction Layer
                        (Google Gemini)
                                │
                                ▼
                      PostgreSQL Database
                                │
                                ▼
                       HeroBrine Dashboard
```

---

# 🧩 Tech Stack

## Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide Icons

---

## Backend

- FastAPI
- Python
- SQLAlchemy
- Alembic
- Pydantic

---

## AI

- Google Gemini API
- Prompt Engineering
- Structured JSON Extraction

---

## Authentication

- Supabase Auth

---

## User Profile

- Supabase PostgreSQL
- Row Level Security (RLS)

---

## Primary Database

- PostgreSQL

Stores:

- Commitments
- Analytics
- AI Planner Data

---

## Bot

- Discord.py
- Discord Slash Commands
- Discord Gateway Events

---

## File Processing

- PDF Parsing
- Image Processing
- Voice Transcription

---

## Deployment

Frontend

- Vercel

Backend

- Railway / Render / VPS

Database

- PostgreSQL

Authentication

- Supabase

Discord

- Discord Developer Portal

---

# 📂 Project Structure

```
HeroBrine-AI/

│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── lib/
│   └── types/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── ai/
│   │   ├── auth/
│   │   ├── database/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── alembic/
│   └── requirements.txt
│
├── discord-bot/
│   ├── bot.py
│   ├── commands/
│   ├── handlers/
│   ├── services/
│   └── utils/
│
├── database/
│   ├── init.sql
│   └── migrations/
│
└── README.md
```

---

# 🚀 AI Endpoints

## Extract from Text

```
POST /ai/extract
```

Extract commitments from plain text.

---

## Save Commitments

```
POST /ai/save
```

Extracts commitments and directly saves them into PostgreSQL.

---

## Extract from PDF

```
POST /ai/pdf
```

Uploads a PDF, extracts commitments, and stores them.

---

## Extract from Image

```
POST /ai/image
```

Uploads an image, detects commitments, and stores them.

---

## Extract from Voice

```
POST /ai/voice
```

Transcribes audio, extracts commitments, and stores them.

---
<p align="center">
  <img src="assets/Screenshot 2026-07-10 002742.png" width="900"/>
  <br>
  <em>FastAPI Endpoints</em>
</p>

# 🔄 Workflow

## Web Application

```
User
   │
   ▼
Enter Text
   │
   ▼
FastAPI
   │
   ▼
Gemini AI
   │
   ▼
Commitments Extracted
   │
   ▼
PostgreSQL
   │
   ▼
Dashboard Updated
```

---

## Discord Workflow

```
User

↓

Mentions HeroBrine

↓

Discord Bot

↓

Find Discord ID

↓

Lookup Supabase Profile

↓

Get HeroBrine User

↓

Forward Message

↓

FastAPI AI Endpoint

↓

Gemini

↓

Extract Commitments

↓

Save into PostgreSQL

↓

Visible in Dashboard
```

---

## Image Workflow

```
Discord Image

↓

Discord Bot

↓

FastAPI /ai/image

↓

Gemini Vision

↓

Commitments

↓

PostgreSQL
```

---

## PDF Workflow

```
Discord PDF

↓

FastAPI /ai/pdf

↓

Gemini

↓

Commitments

↓

PostgreSQL
```

---

## Voice Workflow

```
Discord Voice

↓

Speech-to-Text

↓

Gemini

↓

Commitments

↓

PostgreSQL
```

---

# 🔐 Security

- Supabase Authentication
- JWT-based API authentication
- Row Level Security (RLS)
- Discord account verification
- Secure environment variables
- Protected FastAPI endpoints

---

# 📈 Future Enhancements

- Telegram Bot integration
- WhatsApp integration
- Google Calendar sync
- Outlook Calendar sync
- Gmail reminder extraction
- AI-powered commitment prioritization
- Smart recurring tasks
- Mobile application
- Push notifications
- Team workspaces
- Shared commitments
- Habit tracking
- Productivity scoring
- Natural language reminders

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

# 📜 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Achyant Shrivastava**

B.Tech, IIT (BHU) Varanasi

---

# ⭐ If you found HeroBrine AI useful, consider giving the repository a star!
