# 🎓 CollegeIQ AI — AI-Powered College Discovery & Counseling Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2.7-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.9.0-2D3748)](https://www.prisma.io/)
[![NextAuth](https://img.shields.io/badge/NextAuth-4.24.14-purple)](https://next-auth.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/Groq-llama--3.3--70b-orange)](https://groq.com/)
[![Gemini](https://img.shields.io/badge/Gemini-1.5--flash-blue)](https://ai.google.dev/)
![GitHub last commit](https://img.shields.io/github/last-commit/mayurdongare269/college-discovery)

**CollegeIQ AI** is a full-stack, production-ready AI-powered college counseling platform for Indian engineering students. It combines a rule-based recommendation engine, an exam-aware RAG chatbot (Groq + Gemini), and a comprehensive college database to help students make informed admission decisions.

🌐 **[Live Demo](https://college-discovery.vercel.app)** | 📐 **[Architecture Docs](PROJECT_ARCHITECTURE.md)**

---

## ✨ What's New (Latest)

| Feature | Status |
|---|---|
| AI Recommendation Engine — Safe / Target / Dream | ✅ Live |
| Match Score (0–100) with weighted dimensions | ✅ Live |
| "Why Recommended" AI explanation per college | ✅ Live |
| Floating AI Counselor Chatbot (Groq + Gemini) | ✅ Live |
| Exam-Aware RAG — MHT-CET / JEE Main / JEE Advanced | ✅ Live |
| Web-Knowledge Fallback when DB data is insufficient | ✅ Live |
| AI College Comparison (strengths, weaknesses, verdict) | ✅ Live |
| AI Counseling Strategy ("Get AI Strategy" button) | ✅ Live |
| Smart Search — budget, placement, branch, exam detection | ✅ Live |
| JEE Advanced cutoffs for all 8 IITs | ✅ Live |
| MHT-CET cutoffs for all Maharashtra colleges | ✅ Live |
| Save / Unsave colleges | ✅ Live |
| Side-by-side college compare (up to 3) | ✅ Live |

---

## 🚀 Features

### 🤖 AI Recommendation Engine
The core of the platform. Fully rule-based (no LLM required for this step) — fast, deterministic, and explainable.

- **Input**: Exam type, score/percentile, category (OPEN/OBC/EWS/SC/ST), preferred branch, state, budget
- **Output**: Three ranked lists — **Safe**, **Target**, **Dream** colleges
- **Match Score (0–100)** — weighted across 6 dimensions:

| Dimension | Weight |
|---|---|
| Score vs cutoff compatibility | 40 pts |
| Branch preference match | 20 pts |
| Budget / fees fit | 15 pts |
| Placement strength | 10 pts |
| State preference | 10 pts |
| College rating | 5 pts |

- **Categorization thresholds**:
  - ✅ **Safe** — score ≥ cutoff + 5 percentile
  - 🎯 **Target** — score within ±5 percentile of cutoff
  - ⭐ **Dream** — score 5–20 percentile below cutoff
- **"Why Recommended"** — natural language explanation per college (placement rank, score gap, branch availability, NIRF rank)
- Supports **MHT-CET, JEE Main, JEE Advanced** with year-range cutoffs (2023–2025)

---

### 🤖 AI Counseling Chatbot
A floating chatbot (bottom-right of every page) powered by a dual-LLM architecture.

**Architecture:**
```
User Message → Exam Detection → Filtered DB Query (RAG)
            → Groq llama-3.3-70b-versatile (Primary)
            → Google Gemini 1.5-flash (Automatic Fallback)
```

**Key behaviours:**
- **Exam-aware RAG** — detects `mht cet`, `jee main`, `jee advanced` in the message and filters the database query to only retrieve colleges that accept that exam. MHT-CET queries will **never** include IITs.
- **Web-knowledge fallback** — when the database returns fewer than 3 colleges for a query, the LLM is explicitly instructed to draw on its own real-world training knowledge (all Indian colleges, real cutoffs, admission processes)
- **Hard exam constraints** in the system prompt — the LLM is told IITs = JEE Advanced only, NITs = JEE Main, Maharashtra colleges = MHT-CET
- Quick question chips on first open: "Best AI colleges?", "Compare IIT vs NIT", "Colleges under 1 lakh fees", "Branch vs College priority"

---

### 🔍 Smart Search
Natural language search at `/api/ai/search` — no embeddings required.

Understands queries like:
- *"Best computer science colleges in Maharashtra"*
- *"Affordable colleges under 2 lakh fees"*
- *"Top placement colleges for electronics"*
- *"MHT-CET colleges in Pune"*

Detects: exam type, branch, state, budget (e.g. `2 lakh`), intent (placement / top / affordable).

---

### ⚖️ AI College Comparison
Select up to 3 colleges → click **"AI Comparison"** → get a structured AI analysis:
- Strengths of each college (2–3 points)
- Weaknesses (1–2 points)
- Placement comparison
- Fee-to-value analysis
- Final recommendation with reasoning

---

### 📋 AI Counseling Strategy
After getting recommendations, click **"Get AI Strategy"** to receive:
- Realistic admission chances
- Form-filling priority order
- Safe backup plan
- Branch vs college trade-off advice
- One personalised tip

---

### 🎓 College Database
- **85+ colleges** — IITs, NITs, IIITs, State universities, Private institutions
- **510+ courses** — across 6 engineering branches
- **14,400+ cutoff records** — years 2023, 2024, 2025
  - JEE Advanced cutoffs for 8 IITs
  - JEE Main cutoffs for NITs, IIITs, private colleges
  - MHT-CET cutoffs for all Maharashtra colleges
- All 5 reservation categories: OPEN, OBC, EWS, SC, ST

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| ORM | Prisma 6 |
| Database | PostgreSQL (Neon serverless) |
| Auth | NextAuth.js v4 — JWT + CredentialsProvider |
| Password | bcryptjs (10 salt rounds) |
| Primary LLM | Groq — `llama-3.3-70b-versatile` |
| Fallback LLM | Google Gemini — `gemini-1.5-flash` |
| Gemini SDK | `@google/generative-ai` |
| Notifications | react-hot-toast |
| Validation | Zod |

---

## 🏗️ Project Structure

```
college-discovery/
├── app/
│   ├── (dashboard)/               # Protected dashboard routes
│   │   ├── layout.tsx             # Auth guard + Sidebar layout
│   │   ├── dashboard/page.tsx     # Home dashboard
│   │   ├── recommendations/page.tsx  # AI Recommendation Engine UI
│   │   ├── compare/page.tsx       # College compare + AI analysis
│   │   ├── saved/page.tsx         # Saved colleges
│   │   └── profile/page.tsx       # User profile
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   # NextAuth handler
│   │   │   └── signup/route.ts          # User registration
│   │   ├── ai/
│   │   │   ├── chat/route.ts      # Exam-aware RAG chatbot
│   │   │   ├── compare/route.ts   # AI college comparison
│   │   │   ├── counseling/route.ts  # Counseling strategy
│   │   │   └── search/route.ts    # Smart search
│   │   ├── colleges/route.ts      # College CRUD + search
│   │   ├── recommendations/route.ts  # Rule-based engine
│   │   ├── saved/route.ts         # Save/unsave colleges
│   │   └── user/profile/route.ts  # Profile management
│   ├── colleges/
│   │   ├── page.tsx               # College listing
│   │   └── [id]/page.tsx          # College detail
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── layout.tsx                 # Root layout (AIChatbot mounted here)
│   └── providers.tsx              # SessionProvider + CompareProvider
├── components/
│   ├── ai-chatbot.tsx             # Floating AI counselor widget
│   ├── recommendation-card.tsx    # Match score card with "Why Recommended"
│   ├── compare-table.tsx          # Side-by-side comparison table
│   ├── college-card.tsx
│   ├── navbar.tsx
│   ├── sidebar.tsx
│   ├── filter-panel.tsx
│   ├── search-bar.tsx
│   └── stats-card.tsx
├── lib/
│   ├── ai-service.ts              # Groq + Gemini, match score, RAG logic
│   ├── auth.ts                    # NextAuth session helpers
│   ├── compare-context.tsx        # Global compare state (React Context)
│   ├── prisma.ts                  # Singleton Prisma client
│   └── validations.ts             # Zod schemas
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                    # 85 colleges + cutoffs seeder
├── scripts/
│   ├── update-exam-mappings.ts    # Fix acceptedExams in DB
│   ├── fix-iit-cutoffs.ts         # Generate JEE Advanced cutoffs for IITs
│   └── fix-iit-delhi.ts           # Fix IIT Delhi exam type
├── PROJECT_ARCHITECTURE.md        # Full technical architecture (14 sections)
└── middleware.ts                  # Route protection
```

---

## 🗄️ Database Schema

```
User          — id, name, email, password (bcrypt), preferredBranch, preferredState, preferredExam
SavedCollege  — userId ↔ collegeId (unique compound key)
College       — id, name, shortName, location, state, fees, rating, placementScore, nirfRank, acceptedExams
Course        — id, name, duration, seats, collegeId
Cutoff        — id, examType, category, branch, cutoffScore, year, courseId
```

**Enums:** `ExamType: MHT_CET | JEE_MAIN | JEE_ADVANCED` · `Category: OPEN | OBC | EWS | SC | ST`

Full schema: [prisma/schema.prisma](prisma/schema.prisma)

---

## 🌐 API Reference

| Route | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/signup` | POST | No | Register new user |
| `/api/auth/[...nextauth]` | GET/POST | No | NextAuth session handler |
| `/api/colleges` | GET | No | List / search / filter colleges (paginated) |
| `/api/colleges?id=X` | GET | No | Single college with courses + cutoffs |
| `/api/recommendations` | GET | **Yes** | Rule-based Safe/Target/Dream engine |
| `/api/saved` | GET | **Yes** | Fetch saved colleges |
| `/api/saved` | POST | **Yes** | Save a college |
| `/api/saved` | DELETE | **Yes** | Unsave a college |
| `/api/user/profile` | GET | **Yes** | Fetch user profile |
| `/api/user/profile` | PUT | **Yes** | Update preferences |
| `/api/ai/chat` | POST | No | Exam-aware RAG chatbot |
| `/api/ai/compare` | POST | No | AI college comparison |
| `/api/ai/counseling` | POST | **Yes** | Personalised counseling strategy |
| `/api/ai/search` | GET | No | Smart natural language search |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database (or free [Neon](https://neon.tech) account)
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Google Gemini API key (free at [ai.google.dev](https://ai.google.dev))

### 1. Clone & Install

```bash
git clone https://github.com/mayurdongare269/college-discovery.git
cd college-discovery
npm install
```

### 2. Environment Variables

Create `.env` in the root:

```env
# Database (Neon or any PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# AI Keys
GROQ_API_KEY="gsk_..."
GEMINI_API_KEY="AIza..."
```

Generate a secret: `openssl rand -base64 32`

### 3. Database Setup

```bash
npx prisma generate       # Generate Prisma client
npx prisma migrate dev    # Run migrations
npm run seed              # Seed 85 colleges + 14,400+ cutoffs
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔨 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm start            # Production server
npm run lint         # ESLint
npm run seed         # Seed database

# Database utilities
npx prisma studio    # Visual DB editor
npx tsx scripts/update-exam-mappings.ts   # Fix exam type mappings
npx tsx scripts/fix-iit-cutoffs.ts        # Regenerate IIT JEE-Advanced cutoffs
```

---

## 🔒 Security

| Measure | Detail |
|---|---|
| Password hashing | bcryptjs — 10 salt rounds |
| Session | JWT, HTTP-only cookie, 30-day expiry |
| SQL injection | Prisma parameterised queries — no raw SQL |
| Input validation | Zod schemas on all structured endpoints |
| Auth guard | `getServerSession` on every protected API route |
| Error responses | Never expose stack traces or DB details |

---

## 📈 Performance

- **Compound DB index** on `(examType, category, year)` — fast recommendation queries
- **Prisma singleton** — prevents connection pool exhaustion in Next.js dev
- **Selective fetching** — `take` limits on nested course/cutoff includes
- **Parallel Promise.all** — compare page fetches all colleges simultaneously
- **Lazy chatbot** — full panel renders only when opened (`isOpen` flag)
- **Paginated API** — `/api/colleges` default 20 per page, max 100

---

## 🛣️ Roadmap

### ✅ Completed
- [x] College database — 85 colleges, 510+ courses, 14,400+ cutoffs
- [x] Authentication — JWT sessions, signup/login, protected routes
- [x] College search with advanced filters
- [x] Save / Unsave colleges
- [x] Side-by-side college comparison
- [x] **AI Recommendation Engine** — Safe / Target / Dream
- [x] **Match Score (0–100)** with 6-dimension scoring
- [x] **"Why Recommended"** AI explanation
- [x] **Floating AI Chatbot** — Groq primary + Gemini fallback
- [x] **Exam-aware RAG** — correct colleges per MHT-CET / JEE Main / JEE Advanced
- [x] **Web-knowledge fallback** when DB data is insufficient
- [x] **AI College Comparison** — strengths, weaknesses, verdict
- [x] **AI Counseling Strategy** — form-filling guidance
- [x] **Smart Search** — budget, placement, branch, exam intent detection
- [x] JEE Advanced cutoffs for all 8 IITs
- [x] Full documentation — PROJECT_ARCHITECTURE.md (14 sections)

### 🔮 Future Enhancements
- [ ] pgvector semantic search with `sentence-transformers/all-MiniLM-L6-v2` embeddings
- [ ] Redis caching for recommendation results
- [ ] Real cutoff data pipeline (JoSAA / CAP official data)
- [ ] Community Q&A — student forums
- [ ] Email notifications for cutoff changes
- [ ] Rate limiting on AI endpoints (Upstash)
- [ ] Mobile app (React Native)

---

## 📐 Architecture

For a full technical deep-dive (system diagrams, ER diagram, recommendation engine flow, AI system architecture, API table, security model) — see **[PROJECT_ARCHITECTURE.md](PROJECT_ARCHITECTURE.md)**.

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GROQ_API_KEY`, `GEMINI_API_KEY`)
4. Deploy — Vercel auto-builds on every push to `main`

```bash
# Build command (auto-detected)
npm run build

# Output
.next
```

---

## 🐛 Known Issues

- Next.js 16 middleware deprecation warning — cosmetic only, no functional impact

---

## 👨‍💻 Author

**Mayur Dongare**
- GitHub: [@mayurdongare269](https://github.com/mayurdongare269)
- Email: mayurdongare269@gmail.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) — App Router framework
- [Prisma](https://prisma.io/) — Type-safe ORM
- [Neon](https://neon.tech/) — Serverless PostgreSQL
- [NextAuth.js](https://next-auth.js.org/) — Authentication
- [Groq](https://groq.com/) — Ultra-fast LLM inference
- [Google Gemini](https://ai.google.dev/) — AI fallback
- [Tailwind CSS](https://tailwindcss.com/) — Styling

---

<div align="center">
  <p>Made with ❤️ by Mayur Dongare</p>
  <p>© 2026 CollegeIQ AI. All rights reserved.</p>
</div>
