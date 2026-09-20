# abbybrennan.co.uk

Personal portfolio site for Abby Brennan — Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion.

---

## 1. Run it locally

This project was written in a sandbox with no internet access, so it has **not** been installed
or built yet. Do that first, on your own machine:

```bash
# unzip the project, then inside the folder:
npm install
npm run dev
```

Open http://localhost:3000. Fix anything that comes up — see "if something doesn't compile" below.

Before you trust the production build, run:

```bash
npm run typecheck   # TypeScript errors
npm run lint        # ESLint
npm run build        # full production build
npm run start         # serve the production build locally, on :3000
```

### If something doesn't compile

This code was hand-written without a live compiler in the loop, so treat the first `npm run build`
as a real test, not a formality. The most likely issues, if any:
- A missing/mis-versioned dependency — `package.json` pins versions I believe are current and
  mutually compatible; if npm complains, relax the version pin for the offending package.
- A Next.js 14 App Router API that's shifted slightly (e.g. `generateMetadata` param typing) —
  the fix is almost always small and localized to one file.
- Google Fonts (Space Grotesk / Inter / JetBrains Mono) need network access at build time to
  download font files — this will work fine on your machine and on Vercel, just not in a
  network-isolated sandbox.

---

## 2. Content you can edit without touching components

Everything editorial lives in `/data`:

| File | What it controls |
|---|---|
| `data/profile.ts` | Name, headline, subhead, About paragraphs, SEO description |
| `data/status.ts` | The rotating "currently" line, the "obsessed with" sticky note, counters |
| `data/projects.ts` | Cupd, StudyNI, Brennan Digital, and the "Off the menu" experiments list |
| `data/experience.ts` | The experience timeline — dates, roles, descriptions |
| `data/notes.ts` | Every "notes" post — add a new object to add a new post |
| `data/contact.ts` | Email, CV link, GitHub/LinkedIn/Cupd/StudyNI links |
| `data/site.ts` | Site URL, `<title>` template |

## 3. Assets you still need to provide

The site runs without these (it shows a labelled placeholder), but replace them before launch:

- [ ] **Cupd screenshots/logo** → `public/projects/cupd/` (referenced from `data/projects.ts`
      `screenshots` / `logo` fields — add the files, then update the array)
- [ ] **StudyNI screenshots/logo** → `public/projects/studyni/`
- [ ] **Brennan Digital work samples** → `public/projects/brennan-digital/`
- [ ] **Real email address** in `data/contact.ts` (`hello@abbybrennan.co.uk` is a placeholder)
- [ ] **Real GitHub/LinkedIn URLs** in `data/contact.ts`
- [ ] **CV PDF**, if you want the "Download CV" link — drop it in `/public` and set `cvHref`
      in `data/contact.ts`
- [ ] **Experience dates/descriptions** — several entries in `data/experience.ts` have
      `[placeholder]` values (CME Group dates, Cyclical Apparel role/dates) — fill these in
      yourself; I didn't invent details I wasn't given
- [ ] **App Store link** for Cupd, once it's live — `data/projects.ts` → `links`
- [ ] Real content for the "Off the menu" experiments grid — currently one placeholder entry
- [ ] Swap `public/apple-icon.png` / `app/icon.svg` for real branded icons if you want something
      more considered than a generated monogram

I did **not** invent any statistics, testimonials, employers, or achievements — the counters in
`data/status.ts` are set to `0` on purpose; fill them in with real numbers or delete that section.

---

## 4. Deploy to GitHub Pages + connect GoDaddy DNS

This project is set up as a static export (`output: "export"` in `next.config.mjs`), which is
what GitHub Pages needs — it only serves static files, no Node server. A GitHub Actions workflow
(`.github/workflows/deploy-pages.yml`) is already included: it builds the site and publishes the
`out/` folder to Pages automatically on every push to `main`.

### Push to GitHub

```bash
cd abby-portfolio
git init
git add .
git commit -m "Initial commit"
gh repo create abbybrennan-portfolio --public --source=. --push
# (GitHub Pages on a free personal account needs a *public* repo to serve a custom domain —
# or create the repo manually on github.com and `git remote add origin <url>` + `git push -u origin main`)
```

### Turn on Pages

1. On GitHub → your repo → **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**. That's it — pushing to
   `main` will trigger the workflow already in this repo and deploy automatically. Check the
   **Actions** tab to watch it build; you'll get a `https://<username>.github.io/<repo>/` URL
   once it finishes.
3. Click through that URL first and check everything works before connecting the real domain —
   command palette, the Cupd case study, notes filters, mobile view.

### Configure DNS in GoDaddy

You do **not** need GoDaddy's Website Builder — just its DNS management. GitHub Pages needs
**both** an apex (`abbybrennan.co.uk`) and `www` record pointed at it:

1. Log into GoDaddy → **My Products → DNS** (next to `abbybrennan.co.uk`).
2. Delete any existing `A` record on `@` and any `CNAME` on `www` (e.g. GoDaddy's default
   parking page records).
3. Add **four A records**, all with Name `@`, pointing at GitHub Pages' IPs:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
4. Add **one CNAME record**: Name `www`, Value `<username>.github.io` (your GitHub username,
   not the repo name), TTL default.
5. Save. DNS propagation is usually fast (minutes) but can take up to 24–48 hours.

### Add the custom domain on GitHub

1. Back on GitHub → **Settings → Pages**, under **Custom domain**, type `abbybrennan.co.uk` and
   save. (Do this *after* the A records above have propagated, or verification can fail.)
2. Tick **Enforce HTTPS** once it becomes available (GitHub provisions the certificate
   automatically — this can take a few minutes after the domain verifies).

### Canonical domain + redirect

There's no app-level redirect in this project on purpose — a static export can't run
server-side redirect logic. Instead: because you've set up DNS for **both** `abbybrennan.co.uk`
and `www.abbybrennan.co.uk`, and configured `abbybrennan.co.uk` (no `www`) as the custom domain
in GitHub's Pages settings, GitHub Pages automatically redirects `www.abbybrennan.co.uk` →
`abbybrennan.co.uk` on its own — no extra config needed. Once both are verified, visit both
URLs to confirm the redirect and the padlock both work.

### If you ever want Vercel instead

Nothing about this switch is permanent — the app still runs perfectly well as a normal Next.js
server, not just a static export. Reverting means removing `output: "export"` and
`images.unoptimized` from `next.config.mjs`, adding back a `redirects()` block for the www
redirect, and importing the repo at vercel.com/new instead. Handy if you ever add something
that genuinely needs a server (a real contact-form API route, for instance).

## 5. Project structure

```
app/                 routes (App Router) — homepage, /notes, /notes/[slug], 404, sitemap, robots
components/          UI components, one file per section/interaction
data/                all editable content — see table above
hooks/                small client-side hooks (reduced motion, touch detection)
lib/                  tiny utilities (classnames helper)
public/               static assets — icons, manifest, and where your project screenshots go
```
