# Arogya Setu - Rural Healthcare Telemedicine Platform

**Arogya Setu** is a full-stack, rural-first telemedicine platform designed to bring remote consultation, AI-assisted health triage, electronic prescriptions, and village tele-kiosk management to Primary Health Centers (PHCs) and underserved rural communities across India.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**:
  - React 19, TypeScript, Vite
  - Tailwind CSS v4, Lucide React icons, Canvas Confetti
  - Multilingual support (English, Hindi, Bengali, Telugu)
  - 2G/3G Low-Bandwidth Data Mode & Ayushman Bharat (ABHA ID) integration
  - Text-to-Speech (TTS) audio accessibility
- **Backend**:
  - Node.js, Express.js, TypeScript
  - SQLite 3 (`better-sqlite3` with WAL mode enabled for high concurrency)
  - RESTful APIs for Auth, Doctors, Appointments, Prescriptions, AI Chat, OCR, and Kiosks
  - Configurable CORS and Environment Variables

---

## 📁 Repository Structure

```text
arogya-setu/
├── .env.example              # Frontend environment variables template
├── .gitignore                # Production gitignore rules
├── index.html                # HTML entry point with metadata
├── package.json              # Frontend package configuration
├── public/                   # Static assets (favicons, SVG icons)
├── server/                   # Backend Express + SQLite application
│   ├── .env.example          # Server environment variables template
│   ├── arogya_setu.db        # SQLite database file (runtime, ignored in git)
│   ├── package.json          # Server package configuration
│   ├── tsconfig.json         # TypeScript configuration for backend
│   └── src/                  # Server source code (routes, db, index)
├── src/                      # Frontend React application
│   ├── assets/               # Visual assets (illustrations, badges)
│   ├── components/common/    # Reusable UI components (Header, BottomNav, Toasts)
│   ├── context/              # AppContext global state & sync logic
│   ├── data/                 # Seed data & multilingual translations
│   ├── screens/              # 14 complete healthcare screens
│   ├── services/             # Typed API client services
│   └── types/                # TypeScript type definitions
└── vite.config.ts            # Vite configuration
```

---

## ⚙️ Environment Variables

### 1. Frontend (`.env`)
Create a `.env` file in the root directory based on `.env.example`:

```env
# In development (points to local Express backend):
VITE_API_URL=http://localhost:5000/api

# In production (e.g. Vercel, Netlify, or custom domain):
# VITE_API_URL=https://api.yourdomain.com/api
# Or when running behind a reverse proxy (e.g. Nginx):
# VITE_API_URL=/api
```

### 2. Backend (`server/.env`)
Create a `.env` file in the `server/` directory based on `server/.env.example`:

```env
PORT=5000
NODE_ENV=production
CORS_ORIGIN=*
# Optional custom DB location (e.g. for persistent Docker volumes):
# DB_PATH=/var/data/arogya_setu.db
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm or pnpm

### 1. Install Dependencies
```bash
# Install frontend dependencies (in root)
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Development Mode
Run both backend and frontend servers:

```bash
# Terminal 1: Start Backend Server (port 5000)
cd server
npm run dev

# Terminal 2: Start Frontend Dev Server (port 5173)
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📦 Production Build & Deployment

### Build Frontend
```bash
npm run build
```
This generates an optimized static bundle in the `dist/` directory, ready to be deployed on static hosting (Vercel, Netlify, Cloudflare Pages, Nginx, S3/CloudFront).

To preview the production bundle locally:
```bash
npm run preview
```

### Build & Run Backend
```bash
cd server
npm run build
npm start
```
The compiled output is located in `server/dist/` and runs directly with Node.js on `PORT=5000`.

---

## 🔌 API Endpoints Reference

| Module | Route | Method | Description |
|---|---|---|---|
| **Health** | `/api/health` | `GET` | Health check & SQLite status |
| **Auth** | `/api/auth/register` | `POST` | Register patient/doctor/ASHA worker |
| **Auth** | `/api/auth/login` | `POST` | Flexible authentication |
| **Doctors** | `/api/doctors` | `GET` | Filtered list of verified doctors |
| **Appointments** | `/api/appointments` | `GET`, `POST` | Bookings and queue management |
| **Prescriptions** | `/api/prescriptions` | `GET`, `POST` | Digital Rx generation |
| **Reminders** | `/api/prescriptions/:id/reminder` | `PATCH` | Toggle automated dosage alerts |
| **Aarogya Setu AI** | `/api/ai/chat` | `POST` | Rural health triage chatbot |
| **OCR** | `/api/ocr/scan` & `/api/ocr/save` | `POST` | Prescription digitization |
| **Kiosks** | `/api/kiosks` | `GET`, `POST` | Telemedicine booth monitoring |

---

## 🔒 Security & Best Practices
- **No hardcoded secrets or exposed API keys**: All endpoints configure via environment variables.
- **Strict Data Validation**: TypeScript interfaces applied across client and server.
- **Fail-safe Offline Resilience**: Seamless fallback to cached local state if backend network is momentarily interrupted.
- **Production Git Hygiene**: `.gitignore` strictly prevents `.env` secrets, build outputs, and local database binaries from being committed.
