# Manzil QR Landing Page

## What This Is
Static one-page landing page for QR code scanning at Eid events. Manzil Realty Group (eXp Realty).
Two agents: Hasan Sharif + Omar Sharif. Dark theme, mobile-first.

## Stack
Plain HTML + CSS + vanilla JS. No build step. Deployed on Vercel as static site.

## Key Files
- `index.html` — Single page with all sections
- `style.css` — Dark green/teal/gold palette, Islamic geometric bg pattern
- `script.js` — vCard download, venue tracking via ?v= param, POST events to Google Apps Script
- `images/hasan.jpg` + `images/omar.jpg` — 400x400 compressed headshots

## Contact Details (eXp branding)
- Hasan: 306-850-7687, hasan.sharif@exprealty.com
- Omar: 306-716-3556, omarsha@gmail.com

## Tracking
- Google Sheet: `1bZG2faP7cVTBBANsPF6wFnBChcWKLpPe27kbLI88wp0` ("MANZIL QR CODE TRACKER")
- Google Apps Script receives events (page_scan, save_contact, text_us, social_click, call, email) and appends to Sheet
- Apps Script URL: https://script.google.com/macros/s/AKfycbwtMM5sdg29ugXOwfKOrweZWGJE17WmdjWe2DlkhVqOTLwyp4S5G1HBs_39opC5b0s/exec
- Per-venue QR codes use `?v=venue-slug` URL param

## Venue QR Codes (4 venues, sent to designer 2026-03-13)
- https://manzil-qr-landing.vercel.app?v=venue-1-slug
- https://manzil-qr-landing.vercel.app?v=venue-2-slug
- https://manzil-qr-landing.vercel.app?v=venue-3-slug
- https://manzil-qr-landing.vercel.app?v=venue-4-slug

## Social Links
- Hasan: IG @nasahctus, FB /nasahctus, redleafhomes.ca
- Omar: IG @skrealtor_omar, FB /omar.sharif.yxerealtor

## To Swap Omar's Photo
Replace `images/omar.jpg` with new 400x400 JPEG. Commit and push — Vercel auto-deploys.

## To Add a Venue QR Code
Generate QR for: `https://manzil-qr-landing.vercel.app?v=your-venue-slug`
Each venue gets a unique slug for tracking.

## N8N Webhook (DEPRECATED — replaced by Google Apps Script 2026-03-13)
n8n workflow ID: piyWOGEHb1QTN9N4 ("Manzil QR Tracker") — NO LONGER USED
Reason: n8n API cannot register webhooks in-memory. Apps Script is more reliable (99.9% uptime, no VPS dependency).
