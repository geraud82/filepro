<!-- Copied/merged guidance specific to the FilePro codebase. Keep concise and actionable. -->
# GitHub Copilot / AI Agent Instructions for FilePro

Goal: quickly become productive editing and extending FilePro (Next.js frontend + Express backend + worker queue).

- **Big picture**: Frontend (Next.js) submits file jobs to Backend (Express). Backend enqueues jobs to Bull (Redis). Worker (backend/src/workers/processor.js) processes queue jobs using processors (backend/src/processors/*) which call local binaries (LibreOffice, Ghostscript, FFmpeg, tesseract, pdftoppm, sharp). Outputs and working dirs live under `backend/outputs` and uploads under `backend/uploads`.

- **Key files to read first**:
  - Backend entry: `backend/src/server.js` — routes and CORS config.
  - Job API: `backend/src/routes/jobRoutes.js` — POST `/api/jobs/convert` (multipart form field `file`) and GET `/api/jobs/:jobId` status semantics.
  - Queue config: `backend/src/queue/queue.js` — Bull queue and Redis env variables.
  - Worker: `backend/src/workers/processor.js` — maps job types to processors and uses `job.progress()` and return values.
  - Document logic: `backend/src/processors/documentProcessor.js` — shows conversion flows, timeouts, hard-coded Windows binary paths, OCR fallback, and output layout.

- **Important conventions & patterns**:
  - Job lifecycle: API enqueues a Bull job; worker updates progress with `job.progress(pct)`; the processor returns an object (e.g., `{ outputPath, outputFileName, method }`) which is stored as `job.returnvalue` and used to form downloads `/api/download/:outputFileName`.
  - Storage layout: processors create per-job work dirs named `job_<uuid>` inside the `outputs` directory, but final artifacts are placed in `backend/outputs` (see `config.storage.outputDir`). Use `ensureDir()` helpers in processors.
  - Executable configuration: `documentProcessor.js` contains Windows defaults for `SOFFICE_PATH` and `GHOSTSCRIPT_PATH` but allows `TESSERACT_PATH` and `PDFTOPPM_PATH` via env. If working on Linux/macOS, set env vars or adapt these constants.
  - Timeouts: external commands use `spawnWithTimeout` / `execFileAsync` with timeouts (e.g., 180000ms). Be mindful when running long conversions — tests may need higher timeouts.
  - Error handling: processors throw when conversion fails; worker propagates failure to Bull (job fails). Inspect `logs/` and thrown error messages for debugging.

- **Developer workflows & commands**:
  - Use `docker-compose up -d` for full-stack local run (Redis + backend + frontend). See root `README.md`.
  - Dev mode: run backend and frontend separately:
    - Backend: `cd backend && npm run dev` (listens on `process.env.PORT` or 4000)
    - Frontend: `cd frontend && npm run dev` (Next.js on 3000)
  - Ensure Redis is available at `REDIS_HOST`/`REDIS_PORT` (defaults: 127.0.0.1:6379).
  - Populate `.env` from `.env.example` in each folder before running.

- **API examples**:
  - Submit convert job (multipart/form-data): field `file`, body `inputFormat`, `outputFormat` -> POST `/api/jobs/convert`.
  - Poll status: GET `/api/jobs/:jobId`. Response includes `status`, `progress` (0–100), `result` (returned object), and `downloadUrl` when completed.

- **Integration points to watch**:
  - `backend/src/processors/*` call external binaries (LibreOffice, Ghostscript, FFmpeg, tesseract, pdftoppm, sharp); CI/dev environments must have these installed or tests should mock them.
  - Queueing: `backend/src/queue/queue.js` uses Bull (older API). Job IDs are used directly by the API status endpoint (string IDs).
  - Downloads: `backend/src/routes/downloadRoutes.js` serves files from `config.storage.outputDir` — ensure file permission and path safety if changing naming.

- **What to change carefully**:
  - Modifying progress reporting: frontend expects 0–100 numeric progress values set via job.progress. Keep the numeric semantics and do not block worker event loop during progress updates.
  - Changing storage layout: many parts assume `outputs` and `uploads` sibling folders; update `config/storage` and all references consistently.

- **Quick scanning pointers for PRs**:
  - Check Windows vs. container paths in `documentProcessor.js` before modifying conversion logic.
  - If adding a new job type, register it in `workers/processor.js` and ensure the API enqueues the correct `type` field.
  - For unit tests, prefer mocking `spawnWithTimeout` / `execFileAsync` to avoid invoking heavy binaries.

If anything here is unclear or you want more detail in a particular area (e.g., image/video processors, queue tuning, or frontend usage), tell me which part and I will expand or merge into this file.
