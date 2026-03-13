# Manzil QR Landing Page

## What This Is
Static one-page landing page for QR code scanning at Eid events. Manzil Realty Group (eXp Realty).
Two agents: Hasan Sharif + Omar Sharif. Dark theme, mobile-first.

## Stack
Plain HTML + CSS + vanilla JS. No build step. Deployed on Vercel as static site.

## Key Files
- `index.html` — Single page with all sections
- `style.css` — Dark green/teal/gold palette, Islamic geometric bg pattern
- `script.js` — vCard download, venue tracking via ?v= param, POST events to n8n webhook
- `images/hasan.jpg` + `images/omar.jpg` — 400x400 compressed headshots

## Contact Details (eXp branding)
- Hasan: 306-850-7687, hasan.sharif@exprealty.com
- Omar: 306-716-3556, omarsha@gmail.com

## Tracking
- Google Sheet: `1bZG2faP7cVTBBANsPF6wFnBChcWKLpPe27kbLI88wp0` ("MANZIL QR CODE TRACKER")
- n8n webhook receives events (page_scan, save_contact, text_us, social_click, call, email) and appends to Sheet
- Per-venue QR codes use `?v=venue-slug` URL param

## Social Links
- Hasan: IG @nasahctus, FB /nasahctus, redleafhomes.ca
- Omar: IG @skrealtor_omar, FB /omar.sharif.yxerealtor

## To Swap Omar's Photo
Replace `images/omar.jpg` with new 400x400 JPEG. Commit and push — Vercel auto-deploys.

## To Add a Venue QR Code
Generate QR for: `https://manzil-qr-landing.vercel.app?v=your-venue-slug`
Each venue gets a unique slug for tracking.

## N8N Webhook
n8n workflow ID: piyWOGEHb1QTN9N4 ("Manzil QR Tracker")
Webhook URL: https://n8n.srv728397.hstgr.cloud/webhook/manzil-qr
IMPORTANT: Must be activated from n8n UI (API activation doesn't register webhooks).
