# GroomAI — Full Feature Requirements & Gap Analysis

## Overview

GroomAI is an AI-powered salon booking platform for Hyderabad, India. The app connects users with barbers, stylists, and salons in the Banjara Hills / Jubilee Hills area. Currently deployed at **https://frontend-one-amber-82.vercel.app** with a self-contained Next.js frontend (API routes + Supabase backend).

---

## Current Architecture

```
Frontend (Next.js 16.2.9 + Tailwind CSS v4)
├── Pages: /, /explore, /salon/[id], /bookings, /assistant, /dashboard, /checkout, /profile
├── API Routes: /api/salons, /api/bookings, /api/ai/chat, /api/payments, /api/rebook, /api/reviews, /api/places, /api/stylists, /api/users
├── State: AuthContext (Firebase), mock Supabase fallback
└── Data: Supabase (8 salons, 32 services, 2 users, 2 bookings, 0 reviews)
```

---

## Implemented Features (Working)

### Core Pages
| Page | Status | Notes |
|------|--------|-------|
| **Home** (`/`) | ✅ Working | Search bar, category filters, trending salon cards, map view, how-it-works grid |
| **Explore** (`/explore`) | ✅ Working | Search, service filter, category filter, salon list |
| **Salon Detail** (`/salon/[id]`) | ✅ Working | Image, info, services list with prices, book button per service |
| **Checkout** (`/checkout`) | ✅ Working | Date picker, time slots, payment method selection, mock payment |
| **Bookings** (`/bookings`) | ✅ Working | Auth-gated, lists user bookings with status |
| **AI Assistant** (`/assistant`) | ✅ Working | Chat UI, intent detection (find/rebook), Ollama Cloud fallback |
| **Dashboard** (`/dashboard`) | ✅ Working | 3 tabs: Appointments (today/past), CRM (customer list), Revenue (stats/charts) |
| **Profile** (`/profile`) | ✅ Working | User info, appointment history with rebook, sign out |

### API Endpoints
| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /api/salons?service=&location=` | ✅ Real | Queries Supabase salons + services, transforms to frontend format |
| `GET /api/salons/[id]` | ✅ Real | Single salon with services from Supabase |
| `POST /api/ai/chat` | ✅ Real | Intent detection (find/rebook) + Ollama Cloud fallback (`minimax-m3`) |
| `POST /api/bookings` | ✅ Real | Creates booking in Supabase |
| `GET /api/bookings?user_id=` | ✅ Real | Lists user bookings from Supabase |
| `GET /api/bookings/[id]` | ✅ Real | Single booking detail |
| `POST /api/payments` | ✅ Mock | Creates mock Razorpay payment record |
| `POST /api/rebook` | ✅ Mock | Duplicates last completed appointment with new date |
| `GET /api/rebook?userId=` | ✅ Mock | Returns user appointment history |
| `GET /api/reviews?salonId=` | ✅ Mock | Returns mock reviews for a salon |
| `POST /api/reviews` | ✅ Mock | Creates mock review |
| `GET /api/places?query=` | ✅ Mock | Returns mock Google Places results |
| `GET /api/stylists?salonId=` | ✅ Mock | Returns mock stylists per salon |
| `POST /api/users` | ✅ Mock | Creates mock user record |
| `GET /api/users?firebaseUid=` | ✅ Mock | Returns mock user |

### Auth & Data
| Feature | Status | Notes |
|---------|--------|-------|
| Firebase Auth | ✅ Ready | Google sign-in, AuthContext provider, graceful fallback when no Firebase config |
| Supabase | ✅ Connected | 8 salons, 32 services, 2 users, 2 bookings seeded |
| Mock fallback | ✅ Built-in | Every API route falls back to mock data when Supabase/Firebase env vars are missing |
| AI Chat | ✅ Working | Intent detection (keyword search in salon names/locations/services) + Ollama Cloud |

**Env vars configured on Vercel:** `OLLAMA_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL` (empty)

---

## What's Mock vs Real

| Feature | Real | Mock | Notes |
|---------|------|------|-------|
| Salon data (8 salons) | ✅ Supabase | | Has name, location, rating, lat/lon, images, description, hours |
| Service data (32 services) | ✅ Supabase | | Has name, price (paise), duration, category, popularity flag |
| Booking creation/storage | ✅ Supabase | | Stored with user_id, salon_id, service, date, time, status, price |
| AI chat responses | ✅ Ollama Cloud | | Uses `minimax-m3` via ollama.com/v1 |
| Firebase auth | ✅ Ready | | Google sign-in configured, just needs API keys set in Vercel |
| Payments (Razorpay) | | ✅ Mock | Creates mock payment records, no real payment gateway |
| Rebooking | | ✅ Mock | Duplicates last completed booking in-memory |
| Reviews | | ✅ Mock | In-memory review storage |
| Google Places | | ✅ Mock | Returns static list of places |
| Stylists | | ✅ Mock | Returns hardcoded stylists per salon |
| Users API | | ✅ Mock | In-memory user storage |
| Dashboard CRM data | | ✅ Mock | Hardcoded customers, appointments, revenue data |

---

## Design Differences (GroomAI-App vs Previous Version)

The current groomai-app design is **more compact and feature-focused** compared to the previous frontend-updates version which was **more polished and visually rich**.

### Previous Design Had:
- **Gradient hero section** on home page with blur effects (`bg-[#C9A84C]/15 rounded-full blur-[120px]`)
- **Full hero headline**: "Your Grooming, / Perfected." with `<h2>` tag (current uses two `<h1>` tags)
- **"Search salons, styles, or locations..."** placeholder text (current is shorter)
- **Glowing search bar** with shadow and focus ring
- **Sparkle icon** on search button (current uses basic Search icon)
- **"AI-Powered Salon Booking"** badge above hero
- **"Browse by Category"** section with gradient divider lines
- **Larger category cards** with rounded corners and hover effects
- **Trending section** with "Curated for you" header and "View All" link
- **Horizontal scroll with snap** for trending salon cards
- **"How It Works" section** with step numbers (01, 02, 03, 04) and gradient dividers
- **CTA section** at bottom with "Ready to look your best?" heading
- **Taller navbar** (80px vs current 14px / h-14)
- **`error.tsx`** — proper error boundary with "Try Again" button
- **`loading.tsx`** — animated bouncing dots
- **`not-found.tsx`** — styled 404 page with "Go Home" link
- **`BookingCard.tsx`** — separate component for booking display
- **`ChatMessage.tsx`** — separate component for chat bubbles
- **SalonCard with flat props** (`id`, `name`, `location`, etc.) vs current object prop
- **Background image divs** with `bg-cover bg-center` vs current `<img>` tags

---

## What's Missing or Needs Improvement

### 🔴 Critical Gaps

| Gap | Details |
|-----|---------|
| **No error boundaries** | Missing `error.tsx`, `loading.tsx`, `not-found.tsx` — any crash shows raw Next.js error |
| **No real payment gateway** | Razorpay integration is mocked — no actual payment processing |
| **No real Google Maps / Places** | Places API and map data are mocked — locations are static |
| **No Firebase auth in production** | Firebase API keys exist locally but not in Vercel env — all auth-gated pages show sign-in prompt |
| **Design polish** | Current design is more utilitarian than the previous polished version |

### 🟡 Medium Priority

| Gap | Details |
|-----|---------|
| **Duplicated services** | Some salon IDs have leftover services from old seed (e.g., Urban Barber has 6 instead of 4) |
| **Dashboard is fully mocked** | CRM customers, appointment data, revenue stats are all hardcoded — no connection to Supabase data |
| **No real-time booking updates** | Bookings page requires manual refresh to see new bookings |
| **No email/SMS notifications** | No booking confirmation, reminder, or cancellation notifications |
| **No stylist selection at checkout** | Checkout page doesn't let users pick a specific stylist, only service |
| **No loyalty/rewards system** | User profile shows no loyalty points or visit history from Supabase |
| **Review system is mocked** | Reviews are in-memory only — no connection to Supabase |
| **No search/filter on bookings** | Bookings page has no search, filter by date, or sort |
| **No admin panel** | Dashboard is salon-owner view, but no super-admin for managing salons/users |
| **Mobile responsiveness** | Some pages need better mobile optimization |

### 🟢 Low Priority / Nice-to-Have

| Gap | Details |
|-----|---------|
| **No multi-language support** | All UI is in English only |
| **No dark/light mode toggle** | Fixed dark theme only |
| **No push notifications** | No web push or in-app notifications |
| **No booking reminders** | No pre-appointment reminder system |
| **No salon waitlist** | No ability to join waitlist for fully booked slots |
| **No favorites/bookmarks** | Users can't save favorite salons |
| **No social sharing** | No share salon/profile on social media |
| **No analytics/tracking** | No page view or conversion tracking |
| **No SEO metadata** | Most pages lack dynamic `<head>` metadata |
| **Map embed fallback** | Leaflet map uses OSM tiles, no Google Maps API key |

---

## Design Reversion Required

To restore the previous polished design while keeping groomai-app's features:

### Pages to redesign:
1. **Home page** (`src/app/page.tsx`): Replace with the old design — gradient hero, search form with sparkle button, "Browse by Category" with gradient dividers, "How It Works" with step numbers, CTA section at bottom
2. **Navbar** (`src/components/Navbar.tsx`): Restore taller navbar (80px) and styling
3. **SalonCard** (`src/components/SalonCard.tsx`): Restore flat props interface, background image divs, hover effects

### Files to add:
4. **`src/app/error.tsx`**: `'use client'` error boundary with "Try Again" button
5. **`src/app/loading.tsx`**: Animated loading indicator
6. **`src/app/not-found.tsx`**: Styled 404 page
7. **`src/components/BookingCard.tsx`**: Dedicated booking display component (extract from inline code)
8. **`src/components/ChatMessage.tsx`**: Dedicated chat bubble component (extract from inline code)

### Files to update:
9. **`src/app/globals.css`**: Add old styles (hide-scrollbar, float animation)
10. **`src/app/layout.tsx`**: Adjust padding to match taller navbar

---

## Database Improvements Needed

### Schema Gaps
1. **Stylists table** — exists but not connected to frontend (no stylist selection in checkout)
2. **Reviews table** — exists but frontend uses mock data instead
3. **Loyalty points** — `users.loyalty_points` exists in schema but not shown in UI
4. **Payment tracking** — `razorpay_order_id`, `razorpay_payment_id` in bookings but never populated

### Seed Data
1. More realistic salon images (current uses picsum.photos and placehold.co placeholders)
2. More diverse services and pricing
3. Real contact info for salons (phone numbers, hours)

---

## Tech Debt

1. **Type safety**: Several components use `any` types instead of proper interfaces
2. **Code duplication**: SalonCard has different prop shapes in old vs new code
3. **Error handling**: try/catch in API routes logs to console but doesn't return structured errors
4. **In-memory mock data**: Payments, reviews, rebook data all reset on every deployment
5. **Supabase service key exposed**: Service key with full database access should be replaced with anon key + RLS for production

---

## AI Prompt for Next Iteration

```
Build a complete GroomAI salon booking platform with Next.js 16 + Tailwind CSS v4 + Supabase.

The app is for Hyderabad, India (Banjara Hills / Jubilee Hills area).

REQUIREMENTS:

1. DESIGN (use gold #C9A84C on dark #0A0A0A theme):
   - Gradient hero section with blur effects on home page
   - "Your Grooming, / Perfected." headline with gold accent
   - Prominent search bar with glow effect
   - Category grid (Hair, Nails, Beard, Spa) with hover effects  
   - "How It Works" step cards (Search → Pick → Book → Relax)
   - CTA banner at page bottom
   - Taller navbar (80px)
   - error.tsx with "Try Again" button
   - loading.tsx with animated dots
   - not-found.tsx with "Go Home" link
   - Dedicated BookingCard and ChatMessage components

2. PAGES:
   - Home: hero, categories, trending salons, how it works, CTA
   - Explore: search, service/category filters, salon grid
   - Salon Detail: image, info, services list with Book buttons
   - Checkout: date picker, time slots, payment method, pay button
   - Bookings: auth-gated list with status badges
   - AI Assistant: chat UI with salon-search intent detection
   - Dashboard: salon-owner view with Appointments/CRM/Revenue tabs
   - Profile: user info, appointment history with rebook

3. API (Next.js route handlers):
   - /api/salons — GET with service/location/category filters, real Supabase data
   - /api/bookings — GET (by user_id), POST (create booking)
   - /api/ai/chat — POST with intent detection + Ollama Cloud fallback
   - /api/payments — POST (mock Razorpay)
   - /api/reviews — GET/POST (mock)
   - /api/rebook — GET/POST (mock)
   - Fall back to mock data when Supabase env var is not set

4. DATA (Supabase):
   - 8+ real Hyderabad salons with location, rating, images, hours
   - 4+ services per salon with price, duration, category
   - Users, bookings, reviews tables
   - Row Level Security for demo (permissive)

5. AI CHAT:
   - Intent detection: "find salon" searches by keyword (name, location, service)
   - "rebook" intent duplicates last appointment
   - Ollama Cloud fallback for freeform chat (minimax-m3 via ollama.com/v1)
   - System prompt references real salon data
   - API key: OLLAMA_API_KEY

6. AUTH:
   - Firebase Google sign-in via AuthContext
   - Graceful fallback when Firebase config missing (show sign-in prompt)
   - Auth-gated routes: bookings, dashboard, profile

7. ERROR HANDLING:
   - error.tsx boundary at app level
   - loading.tsx with animated skeleton
   - not-found.tsx for 404s
   - All API routes have try/catch with mock fallback
```
