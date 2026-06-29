# SwiftRide Cloud — Smart Bus Ticketing & Digital Payment Platform

A complete front-end build for a cloud-based bus ticketing system, designed as a Cloud Computing internship / portfolio project. Built with plain HTML5, CSS3, and vanilla JavaScript (ES6) — no build step required.

## Running it

Just open `index.html` in a browser, or serve the folder with any static server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## What's included

**26 pages**, covering every flow in the brief:

- **Public**: Home, About, Search Bus, Bus Details & Seat Selection, FAQ, Contact, 404
- **Auth**: Login (role-based), Register (with OTP step UI), Forgot Password (email → OTP → reset), Operator Partner application
- **Booking flow**: Search results (filters, sorting, pagination) → Seat map (interactive, gender-aware, sleeper/seater layouts) → Payment (Card / UPI / Net Banking / Wallet / QR) → Confirmation (digital ticket + QR) / Failure page
- **Passenger dashboard**: Overview, Booking History, Profile, Wallet & Rewards, Notifications, Support Tickets, Settings (incl. dark mode)
- **Operator dashboard**: Overview with charts, Manage Buses, Manage Routes, View Bookings, Reports & Revenue
- **Admin dashboard**: Overview with charts, Analytics, User/Bus/Operator/Route/Booking Management, Payment Monitoring

## Design system

- **Palette**: Navy `#0B1F3A`, Electric Orange `#FF8A00`, Sky Blue `#4FC3F7`, glassmorphism cards on a soft white/gradient background — as specified in the brief.
- **Type**: Outfit (display), Inter (body), JetBrains Mono (fares, seat codes, booking IDs — gives the ticket/checkout screens a precise, ledger-like feel).
- **Signature motif**: a dotted "route line" with an animated bus icon, used consistently in the hero, route cards, seat-selection header, and tickets — ties the cloud/tracking story to the physical journey.
- All shared chrome (navbar, footer, dashboard sidebar) is generated once in `js/layout.js` and injected per page, so visual changes only need to happen in one place.

## How the demo data works

There's no real backend here — this is a static front-end. To make it feel alive without one:

- `js/data.js` deterministically **generates** buses, seat maps, and seat availability from the search query (same city pair + date always returns the same buses), simulating what a `GET /api/buses/search` response would look like.
- "Login" and "Register" write a mock session object to `localStorage` (`sr_session`) instead of calling a real `/auth` endpoint or issuing a real JWT. Role selection (Passenger / Operator / Admin) just changes which dashboard you're redirected to.
- Bookings, support tickets, and operator fleet/route edits persist to `localStorage`/`sessionStorage` so the flow feels continuous across pages in one browser.
- Payment is simulated with a ~92% success rate and a fake processing delay — no gateway is contacted, no card data leaves the browser.

## Wiring up a real backend

This front-end is structured to drop onto a Node.js/Express + MongoDB Atlas backend with minimal rework:

1. Replace the functions in `js/data.js` (`generateBuses`, `generateSeatMap`) with `fetch()` calls to your REST endpoints (e.g. `GET /api/buses?source=...&destination=...&date=...`).
2. Replace `srSetSession`/`srGetSession` in `js/app.js` with real JWT issuance/verification — store the token instead of a plain object, and send it as an `Authorization: Bearer` header on subsequent requests.
3. Swap the `setTimeout` "payment processing" in `payment.html` for a real call to your payment gateway integration (Razorpay/PayU/Stripe), and have your backend write the confirmed booking to MongoDB before redirecting.
4. The operator/admin CRUD pages (`operator-buses.html`, `admin-users.html`, etc.) currently read/write `localStorage` as a stand-in for your `/api/admin/*` and `/api/operator/*` routes — point the existing form submit handlers at those endpoints instead.

## Notes

- Dark mode, toasts, ripple buttons, scroll reveals, and the OTP input flow are all implemented in vanilla JS (`js/app.js`) with no dependencies.
- Charts (`operator-dashboard.html`, `admin-dashboard.html`, `admin-analytics.html`, `operator-reports.html`, `admin-payments.html`) use Chart.js via CDN.
- Icons via Font Awesome 6 (CDN). Fonts via Google Fonts (CDN).
