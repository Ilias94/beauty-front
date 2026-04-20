# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

**Angular 17 SSR app** with NGXS state management, talking to a Spring Boot backend at `http://localhost:8080`.

### API Client (`src/api/`)

All HTTP services are **auto-generated** by `ng-openapi-gen` from the backend's OpenAPI spec (`/v3/api-docs`). Do **not** hand-edit files in `src/api/` — regenerate them with `npm run openapi-generate` instead. The config is in `openapi.json`.

Structure:
- `src/api/services/` — injectable Angular services (one per controller)
- `src/api/fn/` — standalone functional wrappers for each endpoint
- `src/api/models/` — TypeScript interfaces for DTOs

### State Management (`src/app/components/state/`)

Uses **NGXS** (not NgRx). Each domain has a `*.state.ts` + `*.actions.ts` pair:

| State | Domain |
|---|---|
| `SecurityState` | Auth token, current user |
| `CourseState` | Course listings and details |
| `CategoryState` | Categories |
| `CommentState` | Comments |
| `RatingState` | Ratings |
| `UserState` | User management |
| `AiState` | AI assistant queries |
| `PaymentState` | Payment status |
| `FileState` / `VideoState` | File/video uploads |
| `QuestionState` | Quiz questions |

Components interact with the backend exclusively through NGXS actions — never call API services directly from components.

### Auth Flow

- `tokenInterceptor` (`src/app/token.interceptor.ts`) attaches `Bearer <token>` from `state.security.token` to every request. It also shows `MatSnackBar` notifications for mutating operations.
- `authGuard` (`src/app/auth.guard.ts`) snapshots `state.security.currentUser` and checks `roles` from route data. Currently uses a 1-second delay as a workaround for a race condition (marked `#todo`).
- On login, token is persisted to `localStorage` and a timestamp is saved. `LoginFromLocalStorageAction` rehydrates the session on app init, expiring tokens older than 1 day. Cookie-based token is preferred over `localStorage` if present.

### WebSocket

`WebSocketService` (`src/app/core/websocket/websocket.service.ts`) uses `@stomp/stompjs` to connect to `ws://localhost:8080/ws`. Connected on login/session restore, disconnected on logout. Subscribes to `/user/queue/notifications`.

### Component Organization

- `src/app/components/public/` — unauthenticated views (login, register, menu, forbidden)
- `src/app/components/private/` — teacher-only views (course-form)
- `src/app/components/common/` — shared UI (time-picker)
- All other components are at `src/app/components/<name>/`

### Forms

**ngx-formly** is used for complex forms (account, registration). Custom validators and types are registered globally in `app.config.ts`. The custom `time-picker` formly type wraps `ngx-material-timepicker`.

### Environment

Config lives in `src/environments/enfironment.ts` (note the typo — `enfironment`, not `environment`). Both `apiUrl` and `wsUrl` are set there.

### Roles

The backend enforces two roles used in route guards: `TEACHER` and (implicitly) authenticated user for guarded routes without explicit roles.
