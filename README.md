# Vedanta Life School Seminars Platform

Production-ready seminar platform built with Next.js 16, React 19, TypeScript, MongoDB (Mongoose), and Tailwind CSS.

It includes:

- Public landing page with dynamic Hero, Seminars, Experts, Testimonials, and Registration form
- Hero date, time, pricing, and countdown aligned to the nearest upcoming seminar
- End-to-end Razorpay payment flow (registration, order creation, checkout, verification, webhook)
- Admin authentication (JWT + middleware-protected routes)
- Admin CRUD for seminars, experts, testimonials, and site settings
- Registrations management with search, filters, CSV export, payment/group actions, and payment retry tools

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4 + Radix UI primitives
- Mongoose + MongoDB
- React Hook Form + Zod
- Razorpay Node SDK
- Sonner toasts

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB database (Atlas/local)

## Environment Setup

1. Copy .env.example to .env.local
2. Fill all required values

```bash
cp .env.example .env.local
```

Expected variables:

- MONGODB_URI
- JWT_SECRET
- ADMIN_EMAIL
- ADMIN_PASSWORD
- NEXT_PUBLIC_RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- RAZORPAY_WEBHOOK_SECRET

## Install & Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Available Scripts

- npm run dev: Start local development server
- npm run build: Production build
- npm run start: Run built app
- npm run lint: Run ESLint
- npm run seed: Seed MongoDB with initial platform data

## Seed Data

After .env.local is configured:

```bash
npm run seed
```

## Important Routes

Public:

- / : Landing page
- /api/seminars : Active seminars
- /api/experts : Active experts
- /api/testimonials : Active testimonials
- /api/config : Site config for public sections
- /api/register : Public registration endpoint

Payment APIs:

- /api/payment/create-order : Creates Razorpay order for a registration
- /api/payment/verify : Verifies Razorpay callback signature and updates payment status
- /api/payment/webhook : Razorpay webhook endpoint (HMAC verified + idempotent)

Admin UI:

- /admin/login
- /admin/dashboard
- /admin/seminars
- /admin/experts
- /admin/testimonials
- /admin/registrations
- /admin/settings

Admin APIs:

- /api/admin/settings
- /api/admin/registrations
- /api/admin/registrations/[id]/retry-payment
- /api/admin/testimonials

## Razorpay Flow Summary

1. User submits registration form to /api/register (creates pending registration).
2. Frontend calls /api/payment/create-order.
3. Razorpay checkout opens in-browser (script tag-based checkout).
4. On success callback, frontend calls /api/payment/verify.
5. Razorpay webhook /api/payment/webhook is the final source of truth.

## Security Notes

- Secrets are server-only: RAZORPAY_KEY_SECRET and RAZORPAY_WEBHOOK_SECRET are never used in client components.
- Signature validation uses crypto.timingSafeEqual in both verify and webhook routes.
- Webhook route processes raw request body for HMAC verification.
- Webhook idempotency is handled via WebhookEvent model (unique eventId index + TTL cleanup).
- Payment API routes receive security headers via middleware and next.config headers().
- /api/payment/webhook is intentionally excluded from admin JWT checks so Razorpay can call it directly.

## Admin Registrations Highlights

- Search by name, email, phone, and seminar title
- Filter by seminar, payment status, and group status
- Manual payment status updates + failed-payment reconciliation action
- Payment ID column with click-to-copy
- Retry payment link action for pending/failed registrations
- Group-added status tracking action
- Quick clear filters and CSV export

## Notes

- Admin routes are protected via middleware and JWT auth cookie.
- Registration form amount is dynamic and follows selected seminar pricing.
- Hero section date/time/price and countdown are aligned to the nearest upcoming seminar.
- Use test-mode Razorpay keys for local development before switching to live keys.
