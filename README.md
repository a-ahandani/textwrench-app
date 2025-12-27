# TextWrench Electron App

## Purpose
Desktop app that watches selected text, lets users rewrite or explain it with AI, and pastes results back into the active app.

## Core flow
1. Selection observer detects highlighted text.
2. Toolbar appears near the selection.
3. User chooses Fix It, Explain, or a Prompt.
4. App calls the backend (sync or streaming).
5. Result is pasted into the source app.

## Main functionality
- Global text selection tracking via @a-ahandani/textwrench-observer (macOS).
- Floating toolbar window with expand/collapse panels and auto-hide by cursor distance.
- AI text processing with sync rewrite and streaming explain output.
- Prompt CRUD and template browsing with add-to-prompt actions.
- Categories and search filters for templates.
- Usage stats and quota handling from the backend.
- OAuth login via custom protocol (textwrench://) with token verification.
- Settings window with tray controls, login, shortcuts, and usage.
- Auto-updates with periodic checks and progress events.
- macOS Accessibility permission checks.
- Windows single-instance lock and deep-link handling.

## Architecture notes
- Main process entry: `src/main/index.ts`.
- Windows:
  - Toolbar: `src/main/windows/toolbar.ts`
  - Settings: `src/main/windows/settings.ts`
- IPC surface and preload: `src/preload/index.ts`.
- Renderer UI: `src/renderer` (React + Chakra UI).
- Local storage: `electron-store` for token, auth state, delay, and selection.

## Key integrations
- Backend API base URL: `VITE_API_SERVER` from environment.
- Update system: `electron-updater`.
- Logging: `electron-log`.
