# Voleergo — Job Board & Application Tracking Platform

Voleergo is a full-stack MERN (MongoDB, Express, React, Node) application designed for employers to post jobs and manage applicants, and for candidates to search, apply, and track their applications.

---

## Project Structure

```
d:\Voleergo\
├── server/                    # Express backend
│   ├── config/                # Database connection configuration
│   ├── controllers/           # Request handlers (auth, jobs, applications)
│   ├── middleware/            # JWT, Role, Multer uploads
│   ├── models/                # Mongoose models (User, Job, Application)
│   ├── routes/                # API routes definition
│   ├── utils/                 # Email (Nodemailer) utilities
│   ├── server.js              # Server entry point
│   └── .env                   # Server environment variables
│
└── client/                    # React frontend (Vite)
    ├── src/
    │   ├── api/               # Axios client configuration
    │   ├── components/        # Shared components (Navbar, Footer, ProtectedRoute)
    │   ├── context/           # React Context (AuthContext)
    │   ├── pages/             # App Pages (Dashboards, Search, Profile, etc.)
    │   ├── App.jsx            # Routing and application entry point
    │   └── index.css          # Premium design system & CSS variables
    └── package.json
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas cluster)

### 2. Backend Setup
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by editing `.env`. If you want to use MongoDB Atlas, replace the `MONGO_URI` with your connection string:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/voleergo
   JWT_SECRET=voleergo_jwt_secret_2024_super_secure
   JWT_EXPIRE=7d
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   CLIENT_URL=http://localhost:5173
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```
   *Note: If your local MongoDB instance is running, you should see `✅ MongoDB Connected` in your terminal.*

### 3. Frontend Setup
1. Navigate to the `client/` directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## Key Features

- **Double Dashboard Architecture**: Custom separate panels for Employers (post jobs, manage applications, update status) and Candidates (browse jobs, upload resumes, track statuses).
- **Interactive Search & Filter**: Real-time filters for location, salary range, job type, and keywords.
- **Application Status Timeline**: Live timeline visualizer showing Candidate applications transitioning from `Applied` to `Reviewing`, `Shortlisted`, `Interview`, `Offered`, or `Rejected`.
- **Automatic Email Alerts**: Updates are emailed immediately to candidates when their application status is changed.
- **Premium Glassmorphic Theme**: Sophisticated dark-mode design with smooth CSS micro-animations, tailored font scaling, and custom interactive controls.
