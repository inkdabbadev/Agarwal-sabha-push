# Shree Agarwal Sabha - 75th Platinum Jubilee Event Alert System

Production-ready MVP web application for broadcasting browser push notifications to event attendees connected to the venue Wi-Fi.

## Overview

This project is a mobile-first event website built for the Shree Agarwal Sabha inaugural celebration of the 75th Platinum Jubilee year.

Attendees open the website after joining the event Wi-Fi, enable browser notifications, and receive live announcements from the organizers. A simple admin console at `/admin` lets the event team broadcast one message to all subscribed attendees.

## MVP workflow

1. Attendee joins event Wi-Fi.
2. Attendee opens the event website.
3. Attendee taps `Enable Alerts`.
4. Browser requests notification permission.
5. If permission is granted:
   - the service worker is registered
   - Firebase Cloud Messaging creates a web push token
   - the token is saved in Supabase through `/api/subscribe`
6. Organizer opens `/admin`.
7. Organizer enters the admin password, title, message, and optional link.
8. Organizer clicks `Send notification`.
9. `/api/send-notification` fetches all active tokens and broadcasts the push notification through Firebase Admin SDK.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Firebase Cloud Messaging
- Firebase Admin SDK
- Vercel-ready deployment

## Architecture summary

### Public attendee flow

- `/` is the event landing page with the notification opt-in experience.
- `/event-info` is a simple static information page for the event.
- `EnableAlertsButton` handles browser capability checks, service worker registration, FCM token generation, and subscription API calls.

### Admin broadcast flow

- `/admin` is a simple password-protected sender form.
- `/api/send-notification` validates the request, checks `ADMIN_PASSWORD`, fetches active tokens, sends notifications in 500-token batches, and deactivates invalid tokens.

### Data layer

- Supabase stores one table: `push_subscriptions`.
- Each token is unique and updated via upsert.
- Invalid tokens are marked inactive after permanent Firebase send failures.

## Folder structure

```text
.
|-- public
|   `-- firebase-messaging-sw.js
|-- src
|   |-- app
|   |   |-- admin
|   |   |   `-- page.tsx
|   |   |-- api
|   |   |   |-- send-notification
|   |   |   |   `-- route.ts
|   |   |   `-- subscribe
|   |   |       `-- route.ts
|   |   |-- event-info
|   |   |   `-- page.tsx
|   |   |-- apple-icon.svg
|   |   |-- globals.css
|   |   |-- icon.svg
|   |   |-- layout.tsx
|   |   |-- manifest.ts
|   |   `-- page.tsx
|   |-- components
|   |   |-- EnableAlertsButton.tsx
|   |   |-- IphoneInstructions.tsx
|   |   `-- StatusCard.tsx
|   |-- lib
|   |   |-- firebase-admin.ts
|   |   |-- firebase.ts
|   |   |-- supabase.ts
|   |   `-- validators.ts
|   `-- types
|       `-- index.ts
|-- supabase
|   `-- migrations
|       `-- 001_create_push_subscriptions.sql
|-- .env.example
|-- next.config.mjs
|-- package.json
|-- postcss.config.js
|-- README.md
|-- tailwind.config.ts
`-- tsconfig.json
```

## Supabase setup

1. Create a new Supabase project.
2. Open the SQL editor.
3. Run the SQL in [supabase/migrations/001_create_push_subscriptions.sql](./supabase/migrations/001_create_push_subscriptions.sql).
4. Confirm the `push_subscriptions` table exists.
5. Copy:
   - project URL
   - anon key
   - service role key

### Database schema

Table: `push_subscriptions`

- `id uuid primary key default gen_random_uuid()`
- `token text not null unique`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

## Firebase setup

1. Create a Firebase project.
2. Add a web app to the project.
3. Enable Cloud Messaging for the project.
4. Generate a Web Push certificate key pair and copy the public VAPID key.
5. Create or download a Firebase service account.
6. Copy:
   - API key
   - auth domain
   - project ID
   - storage bucket
   - messaging sender ID
   - app ID
   - public VAPID key
   - service account project ID
   - service account client email
   - service account private key

## Environment variables

Create `.env.local` using the variables from `.env.example`.

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

ADMIN_PASSWORD=
```

### Important note for `FIREBASE_PRIVATE_KEY`

If you paste the Firebase private key into Vercel or `.env.local`, preserve line breaks by replacing real newlines with `\n`.

Example:

```bash
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABC123...\n-----END PRIVATE KEY-----\n"
```

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add `.env.local`.
3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

## Deployment on Vercel

1. Push the project to a Git repository.
2. Import the repository into Vercel.
3. Add all environment variables in the Vercel project settings.
4. Deploy.
5. Open the production domain on a real device and test notification permission.

## How notifications work

### Foreground

- When the page is open, the app registers `onMessage()` from Firebase Messaging.
- The latest foreground message is displayed inside the attendee UI.

### Background

- `public/firebase-messaging-sw.js` handles background messages.
- The service worker displays notifications with title, body, icon, and click target.
- Clicking the notification opens the provided link or `/`.

### Token storage

- The browser FCM token is saved through `/api/subscribe`.
- The backend uses Supabase upsert to reactivate returning devices.

### Broadcast sending

- `/api/send-notification` loads active tokens.
- Tokens are deduplicated.
- Notifications are sent in 500-token chunks to respect Firebase multicast limits.
- Permanently invalid tokens are marked inactive in Supabase.

## iPhone caveat

Web push on iPhone does not behave exactly like Android Chrome.

For the best chance of notification support on iPhone:

1. Open the site in Safari.
2. Use `Share` -> `Add to Home Screen`.
3. Open the installed Home Screen app.
4. Then enable notifications.

The attendee UI includes a visible helper card explaining this.

## End-to-end testing

1. Start the app with valid environment variables.
2. Open the site on Android Chrome.
3. Tap `Enable Alerts`.
4. Confirm browser permission.
5. Verify the token is inserted into Supabase.
6. Open `/admin`.
7. Enter the `ADMIN_PASSWORD`.
8. Send a short test title and message.
9. Confirm the subscribed phone receives the push notification.
10. Repeat on iPhone using the Home Screen installation flow.

## Example admin send flow

1. Visit `/admin`.
2. Enter the password configured in `ADMIN_PASSWORD`.
3. Title: `Programme beginning shortly`
4. Message: `Please take your seats. The inaugural ceremony will begin in 10 minutes.`
5. Link: `/event-info`
6. Click `Send notification`.

Expected result:

- API returns `ok: true`
- counts for `sent` and `failed`
- subscribed devices receive the notification

## Manual setup checklist

1. Create a Supabase project.
2. Run the SQL migration.
3. Create a Firebase project.
4. Enable Cloud Messaging.
5. Add a Firebase web app.
6. Generate and copy the VAPID key.
7. Add all environment variables.
8. Deploy to Vercel.
9. Test on Android Chrome.
10. Test on the iPhone Home Screen flow.

## Platform limitations and notes

- Web push support depends on browser and device capabilities.
- iPhone support requires the Home Screen flow and compatible Safari behavior.
- Localhost testing may not fully reflect production notification behavior.
- Service worker changes can be cached by the browser; after updates, hard refresh or unregister old workers when testing.
