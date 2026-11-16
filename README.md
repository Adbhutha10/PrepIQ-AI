# 🤖 PrepIQ AI — Intelligent Mock Interview & ATS Readiness Platform

<div align="center">

![PrepIQ AI Banner](https://img.shields.io/badge/PrepIQ--AI-6C63FF?style=for-the-badge&logo=robot&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Groq Cloud](https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=fastapi&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

**Next-Generation AI Interview Practice, Real-Time Voice & Multimodal Evaluation, Executive PDF Assessment Reports, and ATS Keyword Gap Matcher.**

[Live Backend API](https://prepiq-ai-3xyi.onrender.com) · [GitHub Repository](https://github.com/Adbhutha10/PrepIQ-AI) · [Report Bug](https://github.com/Adbhutha10/PrepIQ-AI/issues)

</div>

---

## 📖 Overview

**PrepIQ AI** is an enterprise-grade AI technical and behavioral interview preparation platform. It bridges the gap between candidate resumes and job postings by combining **Retrieval-Augmented Generation (RAG)**, ultra-fast LLM inference via **Groq**, real-time interactive audio/text sessions via **Socket.io**, and comprehensive **Applicant Tracking System (ATS)** analytics.

---

## ✨ Key Highlights & Features

### 🎯 1. AI-Powered Mock Interviews
- **RAG-Grounded Questions**: Extracts candidate background from PDF resumes and aligns them with target Job Descriptions (JD).
- **Adaptive Follow-Up System**: Real-time contextual follow-ups over WebSocket streams based on the candidate's actual answer depth.
- **Multimodal Evaluation**: Generates objective scores across **Technical Depth**, **Relevance**, **Communication**, and **Confidence** (0–100%).

### 📄 2. ATS Resume Reviewer & Keyword Gap Matcher (`/resumes/ats`)
- **Compatibility Scoring**: Calculates candidate match percentage (0–100%) against target Job Descriptions.
- **Side-by-Side Keyword Analysis**: Identifies recognized skills vs missing critical technologies and qualifications.
- **High-Impact Bullet Rewrites**: Generates ATS-optimized bullet points with action verbs, quantifiable metrics, and JD keywords with one-click copy.
- **Optimization Checklist**: Provides strategic recommendations before submitting an application.

### 📊 3. Executive Printable PDF Reports
- One-click **"Download PDF Report"** button on the assessment page.
- Tailored `@media print` styling that automatically formats radar diagrams, expands all question evaluations, and prints clean executive letterhead with session ID and candidate metadata.

### ⚡ 4. High-Speed Architecture & Lazy Loading
- **88% Bundle Size Reduction**: Code-split routing using `React.lazy()` and Rollup manual chunking (`vendor-react`, `vendor-ui`, `vendor-charts`).
- Initial download payload reduced from **1,103 kB down to 131 kB**.
- Render cold-start protection with resilient 60-second timeouts.

### 🛡️ 5. Hardened Security & Anti-Abuse
- **JWT Socket Handshake**: All WebSocket connections require authenticated token verification.
- **Rate-Limit Smoothing**: Evaluation requests are batched to prevent Groq `429 Too Many Requests` spikes.
- **Multi-Model Fallback Hierarchy**: Automatically switches between `openai/gpt-oss-120b`, `openai/gpt-oss-20b`, and `qwen/qwen3-32b` for maximum uptime.
- **Storage Resilience**: Dual-mode storage supports Cloudinary with automatic local disk fallback.

### 🛠️ 6. Super Admin & Analytics Console (`/admin`)
- Complete management portal for users, interviews, resumes, active sessions, system logs, prompt templates, and platform analytics.
- Automatic database seeding for Super Admin and Demo candidate accounts.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Recharts, Zustand, React Hook Form, Axios |
| **Backend** | Node.js, Express.js, Socket.io, Winston, Morgan, Multer |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **AI & LLM** | Groq SDK, LangChain, OpenAI Embeddings |
| **File Storage** | Cloudinary (with fallback to local storage) |
| **Caching** | Redis (ioredis — optional via `REDIS_ENABLED=false`) |
| **External APIs** | Adzuna Job Search API |

---

## 📁 Repository Structure

```
AI-Interviewer/
├── backend/
│   ├── src/
│   │   ├── config/             # MongoDB, Cloudinary, Groq, Winston Logger
│   │   ├── controllers/        # Auth, Resume, Interview, Session, Admin, User
│   │   ├── middleware/         # JWT Auth, Upload (Multer), ErrorHandler
│   │   ├── models/             # Mongoose schemas (User, Resume, Interview, Session, Job)
│   │   ├── routes/             # REST API routes
│   │   ├── services/           # AI LLM orchestration, RAG, Chunking, ATS Matcher
│   │   ├── utils/              # AppError, normalizer, token helpers
│   │   ├── socket.js           # Real-time WebSocket interview engine
│   │   ├── app.js              # Express app configuration
│   │   └── server.js           # Server bootstrap & port listener
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Common UI, Navigation, Admin components
│   │   ├── context/            # Admin Auth & App context
│   │   ├── hooks/              # Custom React hooks (useAuth)
│   │   ├── layouts/            # AuthLayout, DashboardLayout, AdminLayout
│   │   ├── lib/                # Axios instance with cold-start timeout
│   │   ├── pages/              # Lazy-loaded views (Dashboard, Interview, ATS, Profile)
│   │   ├── services/           # API integration services
│   │   ├── store/              # Zustand stores (authStore)
│   │   ├── App.jsx             # Route definitions & Suspense boundaries
│   │   └── index.css           # Tailwind + Custom @media print styles
│   ├── vite.config.js          # Rollup manualChunks configuration
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **MongoDB Atlas** URI (or local MongoDB server)
  > 💡 *Note: If you use MongoDB Atlas, you do **not** need MongoDB installed or running locally on your computer!*
- **Groq API Key**: Free at [console.groq.com](https://console.groq.com)
- **Cloudinary Account** (optional for cloud uploads, disk storage fallback included): [cloudinary.com](https://cloudinary.com)

---

### Step 1: Clone Repository

```bash
git clone https://github.com/Adbhutha10/PrepIQ-AI.git
cd PrepIQ-AI
```

---

### Step 2: Configure Environment Variables

#### Backend Configuration (`backend/.env`):
Create `backend/.env` (or copy from `backend/.env.example`):

```env
# Application
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database (Replace with your Atlas connection string)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ai_interview_db?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=super_secret_jwt_access_key_min_32_characters
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=super_secret_jwt_refresh_key_min_32_characters
JWT_REFRESH_EXPIRE=30d

# Groq Cloud AI (Required)
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b

# OpenAI (Optional - for vector embeddings in RAG pipeline)
OPENAI_API_KEY=sk-your_openai_api_key_here

# Cloudinary (Optional - files fall back to local disk if omitted)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (Set to false if running locally without Redis installed)
REDIS_ENABLED=false
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Job Search Integration (Optional)
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
ADZUNA_COUNTRY=in

# Super Admin Auto-Seed (Optional)
ADMIN_EMAIL=admin@prepiq.ai
ADMIN_PASSWORD=AdminPassword123!
```

#### Frontend Configuration (`frontend/.env`):
Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

---

### Step 3: Install & Start

#### Run Backend:
```bash
cd backend
npm install
npm run dev
```
> Backend runs at `http://localhost:5000`.

#### Run Frontend (in a separate terminal):
```bash
cd frontend
npm install
npm run dev
```
> Frontend runs at `http://localhost:5173`.

---

## 🔑 Default Accounts (Auto-Seeded)

When connected to MongoDB, the backend automatically provisions test accounts if they do not already exist:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Super Admin** | `admin@prepiq.ai` | `Admin123!` | Full admin access (`/admin`) |
| **Demo User** | `demo@prepiq.ai` | `Demo123!` | Standard candidate practice account |

---

## 🌐 Production Deployment

### Backend (Render / Railway)
1. **Root Directory**: `backend`
2. **Build Command**: `npm install`
3. **Start Command**: `node src/server.js`
4. **Environment Variables**: Add all variables from `backend/.env`. Ensure `REDIS_ENABLED=false` if no Redis add-on is attached.
5. **Health Check Endpoint**: `/api/health`

### Frontend (Vercel / Netlify)
1. **Root Directory**: `frontend`
2. **Framework Preset**: `Vite`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Environment Variable**: `VITE_API_URL=https://your-backend-service.onrender.com`

---

## 🔌 API Endpoints Reference

### Candidate & Interview APIs
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new candidate account |
| `POST` | `/api/auth/login` | Login and obtain JWT tokens |
| `GET` | `/api/auth/me` | Get current user session & practice credits |
| `PUT` | `/api/auth/profile` | Update candidate skills, experience, and bio |
| `POST` | `/api/resumes/upload` | Upload PDF resume to Cloudinary or disk |
| `GET` | `/api/resumes` | Retrieve all candidate resumes |
| `POST` | `/api/resumes/ats-score` | **New**: Audit resume vs JD for ATS keyword gaps & rewrites |
| `POST` | `/api/resumes/:id/parse` | Parse resume with optional JD |
| `PATCH`| `/api/resumes/:id/default`| Set default resume for interviews |
| `POST` | `/api/interviews` | Create new interview practice session |
| `POST` | `/api/interviews/:id/generate` | Generate context-grounded questions |
| `POST` | `/api/sessions` | Begin active interview session |
| `POST` | `/api/sessions/:id/answer` | Submit answer for immediate AI evaluation |
| `GET` | `/api/sessions/:id/report` | Retrieve final comprehensive feedback report |

### Admin APIs (`/api/admin`)
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/admin/auth/login` | Super Admin authentication |
| `GET` | `/api/admin/dashboard` | Platform metrics & health statistics |
| `GET` | `/api/admin/users` | Manage registered candidate accounts |
| `GET` | `/api/admin/interviews` | Review all generated interview sessions |
| `GET` | `/api/admin/analytics` | Track LLM token usage and scoring trends |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by **Adbhutha**

⭐ Star this repository if it helped your interview preparation journey!

</div>
