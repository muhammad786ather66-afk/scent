# VELORA — Luxury Fragrance House Website

> **"Wear Your Presence."**

VELORA is a production-ready, ultra-premium static perfume brand website crafted for elegance, confidence, individuality, and unforgettable presence. 

Designed mobile-first and optimized for smartphones, desktops, high-resolution screens, and zero-runtime static hosting platforms such as **GitHub Pages** and **Cloudflare Pages**.

---

## 🌟 Fragrance Collection (50 ML Eau de Parfum)

1. **MIDNIGHT** — *"Deep, mysterious, and sophisticated — a fragrance created for the moments when the night takes over."*
2. **SILVER STORM** — *"Fresh, energetic, and striking — a modern expression of confidence and adventure."*
3. **ROYAL DUSK** — *"Refined and mysterious, inspired by the quiet sophistication of twilight."*
4. **NOIR VANILLA** — *"Warm, sensual, and captivating, blending the richness of vanilla with a darker character."*

---

## 📁 Project Architecture & File Structure

```
.
├── assets/
│   ├── images/              # Official fragrance assets (WebP + SVG)
│   │   ├── midnight.webp
│   │   ├── silver-storm.webp
│   │   ├── royal-dusk.webp
│   │   └── noir-vanilla.webp
│   └── logo/                # Vector brand logo & monogram
│       ├── velora-logo.svg
│       └── velora-monogram.svg
├── css/
│   └── style.css            # Production luxury stylesheet (Mobile-first, WCAG AA)
├── js/
│   ├── products.js          # Centralized product catalog (IDs, prices, copy)
│   ├── product-detail.js    # Dynamic product view controller (?product=slug)
│   └── main.js              # Header, mobile drawer, accordions, and notices
├── index.html               # Home page
├── collection.html          # Full collection showcase & filters
├── product.html             # Dynamic & dedicated product detail page
├── about.html               # Brand philosophy, vision & 4 pillars
├── contact.html             # Concierge contact information & message form
├── faq.html                 # Accessible vanilla JS accordion FAQ
├── privacy.html             # Client privacy policy
├── terms.html               # Terms and conditions
├── robots.txt               # SEO search bot instructions
├── sitemap.xml              # XML search engine sitemap
├── favicon.svg              # Luxury metallic monogram favicon
├── DEPLOYMENT.md            # Detailed Cloudflare Pages & GitHub guide
└── README.md                # Project documentation
```

---

## 🛠️ How to Edit & Customize

### 1. Updating Product Information & Prices
All product details are centrally managed in `js/products.js`:
```javascript
// Open /js/products.js and modify properties:
{
  id: "midnight",
  name: "MIDNIGHT",
  price: "PKR 14,500", // Update placeholder to your actual price
  // ...
}
```
Any change saved in `js/products.js` will automatically reflect across the **Home**, **Collection**, and **Product Detail** pages.

### 2. Replacing Fragrance Bottle Photography
When you receive your official high-resolution product photography:
1. Save your photos in `.webp` or `.png` format with the exact filenames:
   - `midnight.webp`
   - `silver-storm.webp`
   - `royal-dusk.webp`
   - `noir-vanilla.webp`
2. Place them in `assets/images/` and `public/assets/images/`.
3. The website will automatically display your real photographs.

### 3. Connecting the Contact Form
The contact form in `contact.html` is ready for static form handlers:
- **Formspree**: Set `action="https://formspree.io/f/your-form-id"` and `method="POST"`.
- **Web3Forms**: Add your access key `<input type="hidden" name="access_key" value="YOUR-KEY">`.
- **Direct Mailto**: Or configure the form to open `mailto:hello@velorafragrances.com`.

---

## 🚀 Local Development

To run locally in your development environment:
```bash
# Start local development server
npm run dev

# Or build for production
npm run build
```

---

## ☁️ Deployment to Cloudflare Pages + GitHub

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for full step-by-step instructions on deploying via GitHub to Cloudflare Pages.
