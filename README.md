# VisionFlow

**No-code computer vision workflows â€” upload video, design pipelines, extract insights.**

VisionFlow is a visual automation platform focused entirely on **computer vision**. Think Gumloop, but built for video: users upload footage, connect CV processing nodes in a drag-and-drop editor, and get structured data and actionable insights out the other side.

From security monitoring to social media content pipelines, the architecture is designed for **limitless expandability** â€” new models, new node types, new output formats without rewriting the core.

---

## What you can build with it

| Use case | Example workflow |
|----------|------------------|
| **Security & surveillance** | Detect intrusions, flag anomalies, alert on specific objects or zones |
| **Social media production** | Analyze clips, extract highlights, tag scenes for automated editing |
| **Operations & QA** | Inspect processes on video, count events, generate structured reports |
| **Custom analytics** | Chain detection â†’ classification â†’ aggregation into business-ready JSON |

The platform treats video as a first-class input and workflows as composable, reusable assets.

---

## How it works

1. **Upload** â€” Drop video files via drag-and-drop (react-dropzone)
2. **Design** â€” Build visual workflows in a node-based editor (@xyflow/react)
3. **Execute** â€” Backend processes jobs asynchronously via BullMQ + Redis
4. **Extract** â€” Receive structured outputs, insights, and metadata from CV pipelines

---

## Tech stack

### Frontend (`frontend/`)
- React 19 + TypeScript + Vite
- TanStack Router + TanStack Query
- @xyflow/react â€” Visual workflow editor
- Clerk â€” Authentication
- Tailwind CSS v4 + custom design system
- Zustand â€” Client state

### Backend (`backend/packages/api/`)
- Express 5 + TypeScript
- BullMQ + Redis â€” Job queue for video processing
- Google GenAI â€” AI/vision model integration
- AWS S3 + Cloudinary â€” Media storage
- Supabase â€” Database & persistence
- Clerk Express â€” Auth middleware

### Shared (`packages/shared/`)
- Shared types and contracts between frontend and API

---

## Monorepo structure

```
visionFlow/
â”œâ”€â”€ frontend/           # React app â€” editor, dashboard, video upload
â”‚   â””â”€â”€ src/
â”‚       â”œâ”€â”€ features/   # editor, execution, videos, workflows
â”‚       â””â”€â”€ routes/     # dashboard, sign-in
â”œâ”€â”€ backend/
â”‚   â””â”€â”€ packages/
â”‚       â””â”€â”€ api/        # Express API, job workers, CV pipeline services
â”œâ”€â”€ packages/
â”‚   â””â”€â”€ shared/         # Shared TypeScript types
â””â”€â”€ supabase/           # Database migrations & schema
```

---

## Getting started

```bash
npm install
npm run dev          # API + frontend concurrently
npm run dev:frontend # Frontend only
npm run dev:api      # API only
npm run build        # Build shared â†’ API â†’ frontend
```

Configure environment variables in `frontend/.env` and the API package per `.env.example` files (Clerk, Supabase, Redis, AWS, Google GenAI).

---

## Architecture highlights

- **Visual workflow engine** â€” Node-graph editor for non-technical users to compose CV pipelines
- **Async job processing** â€” BullMQ workers handle long-running video analysis without blocking the UI
- **Pluggable CV backends** â€” Google GenAI integration with room to add custom models and providers
- **Type-safe monorepo** â€” Shared package keeps frontend and API contracts in sync
- **Production media pipeline** â€” S3/Cloudinary for upload, storage, and delivery at scale

---

## What this demonstrates

- Designing **no-code platforms** with real backend complexity hidden behind visual UX
- Building **computer vision product architecture** â€” not just calling an API, but orchestrating jobs, storage, and structured outputs
- **Monorepo engineering** â€” Shared types, multi-package builds, coordinated dev scripts
- **Scalable async processing** â€” Queue-based workers for video workloads that can't run synchronously

---

Built by [aristi1215](https://github.com/aristi1215)
