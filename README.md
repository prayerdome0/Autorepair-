# SWDL Auto Repair — Website

The official multi-page website for **SWDL Auto Repair**, a company of **Seedwel Investment Limited**.

> 🏷 **FOR SALE** — the complete business and this website are available for purchase. See [`for-sale.html`](for-sale.html).

## Pages

| Page | File | Description |
| --- | --- | --- |
| Home | `index.html` | Auto-playing hero slideshow, stats, services, testimonials (auto-rotating), gallery preview, for-sale CTA |
| Services | `services.html` | All 10 service lines with photos, inclusions and pricing, plus the 4-step process |
| Gallery | `gallery.html` | Filterable photo gallery with full-screen lightbox |
| About | `about.html` | Story, mission/vision/values, milestone timeline, stats |
| For Sale | `for-sale.html` | Sale details: what's included, highlights, price-on-application, enquiry form |
| Contact | `contact.html` | Contact cards (email / phone / address), hours, booking & sale-enquiry form, map block |

## Details

- **Brand:** SWDL Auto Repair (Seedwel Investment Limited)
- **Copyright:** © Seedwel Investment Limited (rendered dynamically in every footer)
- **Email:** `xxxxx` · **Contact:** `xxxxx` · **Address:** `abc`
- **Images:** 10 custom photographs in `images/`, used across the hero slideshow, services, gallery and about pages
- **Auto-play:** hero slideshow (with progress bar, dots, arrows, pause-on-hover) and the testimonials slider both play automatically
- **Stack:** pure static HTML + CSS + vanilla JS — no build step, no dependencies
- **Forms:** client-side hand-off to the visitor's email app (mailto), pointed at `xxxxx`

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

The site is static and deploys to Vercel with zero configuration (see `vercel.json` for clean URLs).

```bash
npx vercel --prod
```

or import the repository in the [Vercel dashboard](https://vercel.com/new).
