# Ethara Team Task Manager

> A premium collaborative task management platform built for **Ethara.ai** teams — with role-based access control, real-time data sync.

---

## Overview

Ethara Team Task Manager is a full-stack web application that enables Ethara.ai teams to manage projects and tasks with a clean, professional interface. It features two distinct role-based dashboards (Admin and Member), real-time Firestore synchronization, Google OAuth authentication, and deep project analytics — all restricted to verified `@ethara.ai` users.

---

## Features

- **Role-Based Access Control** — Admins manage everything; Members can view and update only their assigned tasks.
- **Real-Time Sync** — All data updates instantly across all connected clients via Firebase Firestore's `onSnapshot` listeners.
- **Google OAuth Authentication** — One-click sign-in with Google. Only verified `@ethara.ai` email addresses are permitted.
- **Admin Dashboard** — Full project and task management, team member overview, and live analytics charts (task completion trends via Recharts).
- **Member Dashboard** — A focused view of personal task assignments, project membership, and task status updates.
- **Project & Task Management** — Create projects, assign members, create tasks with priorities (`low`, `medium`, `high`, `urgent`) and statuses (`todo`, `in-progress`, `done`).
- **Task Commenting** — Team members can leave comments on tasks; admins can delete any comment.
- **Onboarding Flow** — First-time users select their role (Admin or Member) on initial sign-in before accessing their dashboard.
- **Animated UI** — Smooth, accessible animations throughout using `motion/react`.
- **AI-Powered Backend** — Integrates Gemini AI via the `@google/genai` SDK for server-side capabilities.
- **Public Landing Page** — Marketing page with Hero, Features, Workflow, CTA, and Footer sections.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Animation | Motion (motion/react) |
| Authentication | Firebase Auth (Google OAuth) |
| Database | Firebase Firestore |
| Charts | Recharts |
| Icons | Lucide React |
| AI | Google Gemini API (`@google/genai`) |
| Server | Express.js |

---

## Project Structure

```
Ethara-Task-Manager-main/
├── src/
│   ├── App.tsx                         # Root component — routing logic (landing / onboarding / dashboard)
│   ├── main.tsx                        # React entry point
│   ├── index.css                       # Global styles
│   ├── contexts/
│   │   └── AuthContext.tsx             # Auth state, user profile, role management
│   ├── lib/
│   │   ├── firebase.ts                 # Firebase app, Firestore, Auth, Google provider
│   │   └── utils.ts                    # Utility helpers
│   └── components/
│       ├── Onboarding.tsx              # Role selection for first-time users
│       ├── landing/                    # Public marketing page sections
│       │   ├── Navbar.tsx
│       │   ├── Hero.tsx
│       │   ├── Features.tsx
│       │   ├── Workflow.tsx
│       │   ├── DashboardPreview.tsx
│       │   ├── Security.tsx
│       │   ├── CTA.tsx
│       │   └── Footer.tsx
│       └── dashboard/                  # Authenticated app
│           ├── DashboardLayout.tsx     # Shared shell (sidebar, header)
│           ├── AdminDashboard.tsx      # Full management + analytics
│           ├── MemberDashboard.tsx     # Personal task view
│           ├── ProjectCard.tsx         # Project summary card
│           ├── CreateProjectModal.tsx  # Admin: create/edit projects
│           └── CreateTaskModal.tsx     # Admin: create/edit tasks
├── firebase-applet-config.json         # Firebase project configuration
├── firebase-blueprint.json             # Firestore data schema
├── firestore.rules                     # Firestore security rules
├── .env.example                        # Environment variable template
├── index.html                          # HTML entry point
├── vite.config.ts                      # Vite configuration
├── tsconfig.json                       # TypeScript configuration
└── package.json
```

---

## Data Model

### User
| Field | Type | Description |
|---|---|---|
| `uid` | string | Firebase Auth UID |
| `email` | string | Must be `@ethara.ai` domain |
| `role` | `admin` \| `member` | Set during onboarding |
| `roleSelected` | boolean | Whether onboarding is complete |
| `displayName` | string | Google display name |
| `photoURL` | string | Google profile photo |
| `createdAt` | timestamp | Account creation time |

### Project
| Field | Type | Description |
|---|---|---|
| `id` | string | Firestore document ID |
| `name` | string | Project name |
| `description` | string | Project description |
| `ownerId` | string | UID of admin who created it |
| `memberIds` | string[] | UIDs of assigned members |

### Task
| Field | Type | Description |
|---|---|---|
| `id` | string | Firestore document ID |
| `projectId` | string | Parent project reference |
| `title` | string | Task title |
| `description` | string | Task details |
| `priority` | `low` \| `medium` \| `high` \| `urgent` | Priority level |
| `status` | `todo` \| `in-progress` \| `done` | Current status |
| `assigneeId` | string | UID of assigned member |
| `dueDate` | timestamp | Task deadline |

### Comment
| Field | Type | Description |
|---|---|---|
| `id` | string | Firestore document ID |
| `taskId` | string | Parent task reference |
| `authorId` | string | UID of commenter |
| `text` | string | Comment body |
| `createdAt` | timestamp | Comment time |

---

## Security

Access is enforced both in the application layer and at the Firestore rules level:

- **Domain restriction** — Only verified `@ethara.ai` email addresses can sign in. All other domains are rejected by Firestore security rules.
- **Email verification required** — Users must have a verified email (`email_verified == true`) to access any Firestore resource.
- **Role-based Firestore rules:**
  - **Admins** — Full read/write access to projects, tasks, and all user profiles.
  - **Members** — Can only read projects they belong to, read/update tasks assigned to them (status field only), and create/read comments.
  - **Users** — Can only update their own profile, and only during the one-time onboarding flow.
- **Comments are immutable** — Once posted, comments cannot be edited; only admins or the original author can delete them.

---

## Getting Started

### Prerequisites

- **Node.js** v18 or later
- A **Firebase project** with Firestore and Authentication (Google provider) enabled
- A **Gemini API key** from [Google AI Studio](https://ai.google.dev/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/Ethara-Task-Manager.git
   cd Ethara-Task-Manager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

   ```env
   GEMINI_API_KEY="your_gemini_api_key"
   APP_URL="http://localhost:3000"
   ```

4. **Configure Firebase:**

   Update `firebase-applet-config.json` with your Firebase project credentials (found in the Firebase Console under Project Settings → Your Apps).

5. **Deploy Firestore security rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

6. **Run the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Type-check with TypeScript (`tsc --noEmit`) |
| `npm run clean` | Remove build artifacts (`dist/` and `server.js`) |

---

## Deployment

This app is designed to be deployed on **Google Cloud Run** via AI Studio. The `APP_URL` environment variable is automatically injected at runtime with the Cloud Run service URL.

For manual deployment:

```bash
npm run build
```

Then serve the `dist/` folder with any static hosting provider (Firebase Hosting, Vercel, Netlify, etc.), and deploy the Express server separately if using server-side Gemini features.

---

## Role Permissions Summary

| Action | Admin | Member |
|---|---|---|
| View all projects | ✅ | ❌ (own only) |
| Create/edit/delete projects | ✅ | ❌ |
| View all tasks | ✅ | ❌ (assigned only) |
| Create/edit/delete tasks | ✅ | ❌ |
| Update task status | ✅ | ✅ (own tasks) |
| View analytics dashboard | ✅ | ❌ |
| Manage team members | ✅ | ❌ |
| Post comments | ✅ | ✅ |
| Delete any comment | ✅ | ❌ |

---

## License

This project is proprietary and intended for internal use by Ethara.ai. Unauthorized access or distribution is prohibited.