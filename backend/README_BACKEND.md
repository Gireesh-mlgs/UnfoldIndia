# Unfold India - Backend

This backend provides APIs for Chat, Translation, Maps, and Safety reporting.

## Quick start (development)

1. Copy `.env.example` to `.env` and fill provider keys.
2. Start Postgres and API:
   - Using Docker Compose:
     ```
     docker-compose up --build
     ```
   - Or run locally (make sure you have a Postgres instance and DATABASE_URL set)

3. Install deps:
   ```
   npm install
   npm run dev
   ```

## API endpoints
- POST /v1/auth/register
- POST /v1/auth/login
- POST /v1/chat
- POST /v1/translate
- GET  /v1/maps/places/search
- POST /v1/maps/routes
- POST /v1/safety/report
- GET  /v1/safety/alerts
