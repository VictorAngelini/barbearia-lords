# Barbearia Lords - Sistema de Agendamento

## Overview

Full-stack barbershop scheduling system built with React (Vite), Express, TypeScript, Drizzle ORM, and PostgreSQL.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite (port 5000, host 0.0.0.0)
- **Backend**: Express + TypeScript (port 3001, host localhost)
- **Database**: PostgreSQL via Replit's built-in DB + Drizzle ORM
- **Styling**: Tailwind CSS + Framer Motion animations

## Project Structure

```
/
├── src/                  # Frontend React app
│   ├── pages/
│   │   ├── Home.tsx      # Landing page with services & team
│   │   ├── Booking.tsx   # Appointment booking form
│   │   └── Admin.tsx     # Admin panel for managing appointments
│   ├── components/
│   │   └── Navbar.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/               # Backend Express API
│   ├── index.ts          # Express server + routes
│   ├── db.ts             # Drizzle DB connection
│   └── schema.ts         # Database schema
├── vite.config.ts        # Vite config (proxy /api -> :3001, allowedHosts: true)
├── drizzle.config.ts     # Drizzle ORM config
├── tailwind.config.js
└── package.json
```

## Key Features

- Smart appointment booking with time slot availability
- Business hours enforcement (09:00–19:00)
- Barber-specific conflict detection
- Admin panel with status management (pending/confirmed/completed/cancelled)
- Responsive design with dark gold theme

## Development

```bash
npm run dev        # Runs both frontend and backend concurrently
npm run db:push    # Push schema changes to database (use push:pg)
```

## API Endpoints

- `GET  /api/appointments` - List all appointments
- `POST /api/appointments` - Create appointment
- `GET  /api/appointments/available-times?date=&barber=` - Get available time slots
- `PATCH /api/appointments/:id/status` - Update appointment status
- `DELETE /api/appointments/:id` - Delete appointment

## Database

Uses Replit's built-in PostgreSQL. Tables:
- `appointments` - All booking records

## Deployment

Configured as autoscale deployment. Build: `npm run build`.
