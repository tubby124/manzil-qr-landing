# Manzil QR Landing Page

QR code landing page for Hasan Sharif & Omar Sharif (eXp Realty / Manzil Realty Group).
Designed for Eid events — scan QR, save contact, connect on socials.

## Deploy

This is a static site. Push to GitHub and connect to Vercel:

```bash
gh repo create tubby124/manzil-qr-landing --public --source . --push
vercel --prod
```

## Venue QR Codes

Each venue gets its own QR code with a tracking parameter:

| Venue | URL |
|-------|-----|
| Venue 1 | `https://manzil-qr-landing.vercel.app?v=venue-1` |
| Venue 2 | `https://manzil-qr-landing.vercel.app?v=venue-2` |

Generate QR codes at: https://www.qr-code-generator.com/

## Tracking

Events are sent to an n8n webhook and logged to Google Sheets.
Sheet: "MANZIL QR CODE TRACKER"

Tracked events: page_scan, save_contact, text_us, call, email, social_click, learn_more

## Swap Omar's Photo

1. Replace `images/omar.jpg` with new photo (keep 400x400 JPEG)
2. `git add images/omar.jpg && git commit -m "Update Omar headshot" && git push`
3. Vercel auto-deploys in ~30 seconds

## Update Webhook URL

Edit `script.js` line 4 — set `N8N_WEBHOOK_URL` to the n8n webhook URL.
