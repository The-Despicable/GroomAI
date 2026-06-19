# GroomAI – AI-Powered Salon Booking

GroomAI is a modern web application that helps users discover and book grooming services with the help of an AI assistant.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Firebase Auth
- Supabase (optional)
- Jest for testing

## Setup
1. Clone the repo.
2. Copy `.env.example` to `.env.local` and fill in your credentials.
3. Run `npm install` and `npm run dev`.
4. Open `http://localhost:3000`.

## API Routes (Mock)
- `/api/salons` – GET list of salons
- `/api/salons/[id]` – GET salon details
- `/api/bookings` – GET/POST bookings
- `/api/ai/chat` – POST chat with AI

## Testing
Run `npm test`.

## Deployment
Deploy to Vercel with environment variables set.
