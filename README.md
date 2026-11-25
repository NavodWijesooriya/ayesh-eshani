# Ayesh & Eshani — Wedding Invitations

Next.js 15 + Firebase (Firestore + Auth). No server/API needed — RSVPs go straight to Firestore, protected by `firestore.rules`. Two invitation pages + an RSVP admin panel.

| Route | What |
|---|---|
| `/day1` | Day 1 – Holy Matrimony, Sat 09 Jan 2027 (ivory & gold) |
| `/day2` | Day 2 – Wedding Celebration, Sun 10 Jan 2027 (maroon & gold) |
| `/` | Landing page linking both days |
| `/admin` | Firebase-login RSVP dashboard (stats, search, CSV export, delete, personal invite link generator) |

**Personal links:** `/day1?to=Mr.%20%26%20Mrs.%20Perera` – the envelope and invitation greet the guest by name and pre-fill the RSVP. Generate & WhatsApp-share them from `/admin`.

## Setup (Firebase project: `eshani-ayesh`)
1. **Firestore Database** → Create database (production mode, region `asia-south1`).
2. **Authentication** → Get started → enable **Email/Password** → **Users → Add user** (your admin email + password).
3. Open `firestore.rules`, replace `admin@example.com` with that admin email, then paste it into **Firestore → Rules** → Publish.
4. `npm install` → `npm run dev` → http://localhost:3000/day1 and /admin
5. After deploying, add your Vercel domain in **Authentication → Settings → Authorized domains**.

The web config lives in `lib/firebase.js` (it is public by design; the rules are what protect the data).
RSVPs are stored in the `rsvps` collection: `event, name, phone, attending, guests, message, created_at`.

## Editing
- All text, times, venues, contacts: `lib/events.js`
- Colours / styles: `app/globals.css` (`.theme-ivory`, `.theme-maroon`)
- Background music (optional): drop a file at `public/music.mp3` – a music button appears automatically and plays when the envelope opens.
