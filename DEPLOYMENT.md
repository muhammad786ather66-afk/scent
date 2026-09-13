# VELORA — Deployment Guide for GitHub & Cloudflare Pages

This guide walks you through deploying the VELORA luxury perfume website to **GitHub** and **Cloudflare Pages** in under 5 minutes with zero hosting cost, global CDN distribution, and automatic SSL encryption.

---

## Prerequisites
- A free [GitHub](https://github.com/) account.
- A free [Cloudflare](https://dash.cloudflare.com/) account.

---

## Method 1: Automated Deployment via GitHub + Cloudflare Pages (Recommended)

### Step 1: Push the Code to GitHub
1. Create a new repository on GitHub (e.g., `velora-perfumes`).
2. In your local terminal, initialize git and push the project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of VELORA luxury brand website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/velora-perfumes.git
   git push -u origin main
   ```

### Step 2: Connect to Cloudflare Pages
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your `velora-perfumes` repository.
4. Configure the build settings:
   - **Framework preset**: `Vite` (or `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: 18 or 20+
5. Click **Save and Deploy**.

Cloudflare will automatically compile and deploy your website across its edge CDN network worldwide. Every future git push to `main` will automatically trigger a new deployment.

---

## Method 2: Direct Upload to Cloudflare Pages (Without Git)

If you prefer deploying without Git:
1. Run the build locally:
   ```bash
   npm run build
   ```
2. In the Cloudflare Dashboard, select **Workers & Pages** > **Create application** > **Pages** > **Upload assets**.
3. Drag and drop the `dist/` folder into Cloudflare.
4. Your site is live immediately at `https://[your-project].pages.dev`.

---

## Custom Domain Setup (e.g., velora.com)

1. Inside your Cloudflare Pages project, click **Custom domains**.
2. Click **Set up a custom domain**.
3. Enter your domain name (e.g., `veloraparfums.com` or `velora.pk`).
4. Follow the automatic DNS verification instructions. Cloudflare provisions free SSL/TLS certificates automatically.

---

## Contact Form Integration for Static Sites

Because this is a pure static site (zero server vulnerabilities, zero database dependencies), you can handle customer inquiries using one of the following free tools:

### Option A: Formspree (Easiest)
1. Register at [formspree.io](https://formspree.io).
2. Create a form and copy your endpoint URL (e.g., `https://formspree.io/f/xyzabced`).
3. In `contact.html`, set the `<form action="https://formspree.io/f/xyzabced" method="POST">`.

### Option B: Cloudflare Turnstile + Cloudflare Workers
You can optionally deploy a lightweight Cloudflare Worker or Pages Function in `/functions/contact.ts` to receive and email inquiries directly.

---

## Verification Checklist Before Launch
- [x] Check all 4 product images render crisply on mobile and desktop.
- [x] Test the hamburger navigation on smartphone viewports (portrait & landscape).
- [x] Verify prices in `js/products.js`.
- [x] Verify contact email in `contact.html` and `README.md`.
- [x] Confirm SEO meta descriptions and Open Graph titles in `<head>`.
- [x] Submit `sitemap.xml` to Google Search Console.
