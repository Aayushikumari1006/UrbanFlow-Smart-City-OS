# UrbanFlow

Multi-Agent Urban Intelligence Platform — a predictive sandbox for Indian urban governance (Delhi & Chandigarh).

## Run & Operate

### UrbanFlow Services (primary)
- `UrbanFlow Backend` workflow — FastAPI on port 8000
- `UrbanFlow Frontend` workflow — Next.js on port 3000

### Legacy pnpm Workspace
- `pnpm --filter @workspace/api-server run dev` — unused Express server (port 5000)
- `pnpm run typecheck` — typecheck all workspace packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks
- `pnpm --filter @workspace/db run push` — push DB schema changes

### Environment
- `DATABASE_URL` — available as Replit secret (PostgreSQL, used by backend)
- `NEXT_PUBLIC_API_URL` — set to `http://localhost:8000` for dev; set in Next.js env for Docker

## Stack

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS + ShadCN
- **Backend:** FastAPI + SQLAlchemy + Pydantic + Python 3.11
- **Database:** PostgreSQL (Replit-hosted in dev; Docker in production)
- **Deployment:** Docker (docker-compose.yml in `/urbanflow/`)
- **State:** Zustand (frontend scenario state)

## Where things live

```
urbanflow/
├── docker-compose.yml          # Full Docker deployment
├── .env.example                # Environment variable template
├── backend/
│   ├── main.py                 # FastAPI entry point, startup seeding
│   ├── core/
│   │   ├── config.py           # App settings (reads DATABASE_URL from env)
│   │   ├── engine.py           # Simulation transfer functions (deterministic math)
│   │   ├── agents.py           # 8 agent classes + AgentRegistry + Blackboard (incl. CitizenFeedbackAgent)
│   │   └── feedback_engine.py  # Module 06: kiosk/grievance/dept/priority/stream simulation
│   ├── db/
│   │   ├── models.py           # SQLAlchemy models (cities, scenarios, params, recs, feedback snapshots)
│   │   ├── session.py          # DB engine + SessionLocal + get_db()
│   │   └── seed.py             # Delhi & Chandigarh baseline data
│   ├── api/routes/
│   │   ├── health.py           # GET /health
│   │   ├── cities.py           # GET /cities, GET /cities/{id}/baselines
│   │   ├── auth.py             # POST /auth/login, POST /auth/logout
│   │   ├── scenarios.py        # CRUD + run /scenarios
│   │   └── feedback.py         # GET /feedback/dashboard|kiosks|grievances|departments|stream
│   └── schemas/health.py       # Pydantic response schemas
└── frontend/
    ├── next.config.mjs         # Next.js config (use .mjs — .ts not supported in 14.x)
    ├── tailwind.config.ts      # Dark mode + urbanflow color tokens
    ├── src/
    │   ├── app/
    │   │   ├── citizen-feedback/   # Module 06 — full feedback dashboard
    │   │   ├── scenario-lab/       # Module 03 — with Module 06 preview panel
    │   │   ├── dashboard/
    │   │   │   ├── twin/           # Module 04 — with Module 06 citizen overlay
    │   │   │   └── safety/         # Module 05 — with Module 06 safety complaint feed
    │   │   └── ...
    │   ├── components/         # TopNav, Sidebar, MetricCard, StatusBadge
    │   ├── hooks/              # useHealth, useCities, useFeedback (Module 06)
    │   ├── lib/utils.ts        # cn(), API_BASE, fetchAPI()
    │   └── store/              # Zustand: useSimulationStore (cityId, lastScenarioId, results)
```

## Architecture decisions

- **No external APIs** — all simulation is deterministic math (transfer functions in engine.py)
- **Scenario Lab is the core** — all modules feed into/from the scenario state
- **Blackboard pattern** — agents share state via a Pydantic Blackboard object
- **next.config.mjs not .ts** — Next.js 14.2 does not support TypeScript config files
- **Docker for production, Replit PostgreSQL for dev** — config.py reads DATABASE_URL env var; falls back to Docker host `db:5432`

## Product

UrbanFlow allows city administrators (Delhi & Chandigarh) to manipulate urban "levers" (traffic, AQI, safety, budget, citizen sentiment) in a risk-free simulation environment. 7 AI agents analyze the state and generate recommendations that are reconciled by a Budget Agent and synthesized by a Planning Agent.

## Module Status

| Module | Status |
|--------|--------|
| 01 — Foundation | ✅ Complete |
| 02 — Auth & Roles | ✅ Complete |
| 03 — Scenario Lab (CORE) | ✅ Complete |
| 04 — Digital Twin Command Center | ✅ Complete |
| 05 — Women's Safety Intelligence | ✅ Complete |
| 06 — Citizen Feedback Intelligence | ✅ Complete |
| 07–13 | ⬜ Pending |

## Auth (Module 2)

### Demo accounts (seeded on every cold start)
| Email | Password | Role |
|-------|----------|------|
| admin@urbanflow.in | Admin@123 | super_admin |
| planner@delhi.gov.in | Planner@123 | urban_planner |
| analyst@urbanflow.in | Analyst@123 | analyst |

### Auth flow
- `POST /auth/login` (FastAPI) → returns JWT → Next.js sets `urbanflow_token` httpOnly cookie
- Next.js `src/middleware.ts` decodes cookie on every request, redirects unauthenticated users to `/login`
- Token expires after 24h; middleware redirects expired sessions with `?reason=expired`

### Role permissions
| Role | Permissions |
|------|-------------|
| super_admin | `*` (all) |
| city_administrator | scenarios, analytics, cities, users:read |
| operations_officer | scenarios:read, scenarios:patch, analytics:read |
| urban_planner | scenarios, analytics:read |
| analyst | scenarios:read, analytics:read |

### Route protection (middleware)
- `/admin` → super_admin only
- `/scenario-lab` → super_admin, city_administrator, urban_planner, operations_officer
- `/dashboard/budget` → super_admin, city_administrator

## Gotchas

- Use `next.config.mjs` — Next.js 14.2 throws if you use `next.config.ts`
- Run backend with `PYTHONPATH=.` or from `urbanflow/backend/` directory
- The `DATABASE_URL` secret in Replit is auto-injected; no `.env` file needed in dev
- Docker compose uses internal hostname `db` for PostgreSQL; set `DATABASE_URL` accordingly for non-Docker runs
- `jwt-decode` must be in `urbanflow/frontend/package.json` — middleware.ts uses `jwtDecode` (named export, not default) from this package
- Backend auth uses `python-jose[cryptography]` + `passlib[bcrypt]` + `bcrypt==4.0.1` — all in requirements.txt

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._
