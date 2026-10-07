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
| `data/notes.ts` | **Historical only.** Notes now live in Supabase and are written from `/admin` — see "Notes CMS" below. This file is kept as a readable backup of the original content; editing it does nothing. |
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

## 5. Notes CMS — writing without touching code

Notes are no longer stored in `data/notes.ts`. They live in a Supabase database and you write,
edit, publish, and delete them from a private admin screen at **`/admin`** — no code changes, no
commits, no redeploy. This section is the one-time setup; after that, see "Publishing a post" at
the bottom.

### 5.1 Create the Supabase project

1. Go to [supabase.com](https://supabase.com) → New project. Any region/plan is fine (the free tier
   is plenty for a personal blog).
2. Once it's ready, go to **Project Settings → API** and copy two values: the **Project URL** and
   the **anon / public key**. (Not the `service_role` key — that one is never used anywhere in
   this project, by design.)

### 5.2 Run the schema

1. In the Supabase dashboard, open **SQL Editor → New query**.
2. Paste the entire contents of [`supabase/journal.sql`](supabase/journal.sql) and run it.

This creates the `journal_posts` table (with a unique slug index and an `updated_at` trigger), a
`profiles` table used only to mark who the admin is, the Row Level Security policies that enforce
"anyone can read published posts, only the admin can write", and a public `journal-images`
storage bucket with matching upload/delete policies. It's safe to re-run this file any time — it
won't duplicate anything.

### 5.3 Create your admin account

1. Supabase dashboard → **Authentication → Users → Add user**. Create a user with your email and a
   password (this is what you'll type into `/admin` to sign in).
2. Back in **SQL Editor**, run (replace the email):

   ```sql
   update public.profiles set is_admin = true
   where email = 'you@example.com';
   ```

That's it — that account can now sign in at `/admin` and manage posts. Every other account
(including any future accidental signups) defaults to `is_admin = false` and the admin UI will
refuse it; the database enforces this with Row Level Security, not just the UI.

### 5.4 Environment variables

Copy `.env.local.example` to `.env.local` and fill in the two values from step 5.1:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

These are the public/anon keys — safe to expose in the browser and, as explained below, safe to
put in CI too. Permissions come from RLS (step 5.2), not from keeping this key secret.

For deployment, add the same two values as **GitHub repo → Settings → Secrets and variables →
Actions → secrets**, named exactly `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
The deploy workflow (`.github/workflows/deploy-pages.yml`) already reads them from there — this
lets the build pre-render whatever's published at deploy time (see 5.6).

### 5.5 Migrate your existing notes

A one-off script copies everything from `data/notes.ts` into Supabase, preserving each post's
slug (so existing `/notes/<slug>` links keep working), title, date, excerpt, body, and tags
exactly. It signs in as your admin account and inserts through the same RLS-protected API the
admin UI uses — no service-role key involved. It's safe to run more than once; posts that already
exist (matched by slug) are skipped, never duplicated.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co \
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key \
ADMIN_EMAIL=you@example.com \
ADMIN_PASSWORD=your-password \
npm run migrate:notes
```

### 5.6 How this works on a static, server-less host

This site builds as a fully static export (`output: "export"` — see section 4), which GitHub
Pages requires. That's normally in tension with "publish instantly, no rebuild" — so here's
exactly how it's resolved:

- `/notes` (and the homepage's notes section) fetch from Supabase **at build time**, so the page
  you get on first load is fast and has proper SEO tags, **and again in the browser** right after
  the page loads, replacing the list if anything's changed since the last deploy. This is what makes
  publish/edit/unpublish/delete show up live.
- Each note can be reached at one of two addresses:

  | URL | What it is | Used for |
  | --- | --- | --- |
  | `/notes/<slug>` | A real pre-built HTML page (`app/notes/[slug]`), generated for every post published at the last build. | Posts that existed at the last deploy. |
  | `/notes/view?slug=<slug>` | One static "viewer" page (`app/notes/view`) that loads any published post from Supabase in the browser. | Posts published since the last deploy, and everything in `npm run dev`. |

  Links on `/notes` and the homepage pick automatically (`lib/notes/urls.ts`): the clean URL if
  that page was pre-built in the current deployment, otherwise the viewer URL. After the next
  deploy, links to a newer post switch to its clean URL by themselves. Its viewer URL keeps
  working, so links people have already shared don't break.
- Why two URLs: GitHub Pages can only serve files that exist, and `output: "export"` only
  creates `/notes/<slug>` files for slugs known at build time. Next's dev server enforces the
  same rule: opening `/notes/<slug>` for a post published after the dev server started throws
  *"missing param in generateStaticParams()"*. There's no way, without a server or a rebuild, to
  give a brand-new post a clean URL with a proper `200` response, so new posts get the viewer URL
  until the next deploy.
- If someone types or shares a clean `/notes/<slug>` URL for a post that has no pre-built page,
  GitHub Pages serves the site's 404 page (`app/not-found.tsx`), which forwards to
  `/notes/view?slug=<slug>`. (In `npm run dev`, typing that clean URL by hand may still show
  Next's error, depending on when the dev server last ran `generateStaticParams()`, because the
  dev server handles `/notes/<slug>` itself and never reaches the 404 page. The site never links
  there in dev, so normal browsing and publishing aren't affected.)
- Every note page, pre-built or viewer, re-checks Supabase when it loads, so an unpublished or
  deleted post disappears immediately even if its HTML file is still in the last deploy.
- Build-time fetches deliberately bypass Next's data cache (`cache: "no-store"` in
  `lib/supabase/client.ts`, with `dynamic = "force-static"` on the pages that fetch at build time),
  so `npm run dev` and local builds always see what's in Supabase right now.
- To give newer posts clean URLs (and the best SEO), trigger a deploy: any push to `main`, or
  "Run workflow" on the Deploy action.
- The admin's draft preview is a separate static page, `/admin/preview?id=<post id>`. It needs
  an admin session and loads the draft by id, so it never depends on build-time slugs.
- Drafts are never fetched by any of this — the public queries only ever ask Supabase for
  `status = 'published'` rows, and RLS blocks drafts from anonymous reads regardless.

### 5.7 Publishing a post (the actual day-to-day workflow)

1. Go to `/admin` and sign in.
2. **+ New post** → write the title, an excerpt, the body (bold/italic/links/headings/quotes/
   lists/images), tags, and an optional cover image. The slug, publish date, created/updated
   timestamps, and the dashboard's reading-time estimate are all generated for you — the slug
   field under "advanced" is there only if you want to override it.
3. **Save draft** the first time; after that it autosaves a couple of seconds after you stop
   typing (status bar top-right shows Saving… / Saved / Unsaved changes). Autosave only ever
   touches the content — it can't publish anything by itself.
4. **Preview** opens the post rendered exactly as the public site would show it — this only works
   while signed in as admin, so a draft link is never publicly visible.
5. **Publish** when ready. It appears on `/notes` within moments, no deploy needed.
6. From the dashboard you can also **unpublish** (returns it to Drafts without deleting it) or
   **delete** (asks for confirmation first, and can't be undone).

## 6. Project structure

```
app/                 routes (App Router) — homepage, /notes, /notes/[slug], /notes/view, /admin, 404, sitemap
components/          UI components — admin/ and editor/ hold the CMS screens
components/notes/    the sandboxed renderer that turns stored post content into React safely
data/                editable content (profile, projects, etc.) — notes.ts is now historical, see above
lib/notes/           Supabase queries, types, slug/content helpers used by both public + admin
lib/auth/            the admin-session hook used to gate /admin
lib/supabase/        the single shared Supabase client
hooks/                small client-side hooks (reduced motion, touch detection)
public/               static assets — icons, manifest, and where your project screenshots go
scripts/              one-off scripts — migrate-notes.ts seeds Supabase from data/notes.ts
supabase/             journal.sql — paste into the Supabase SQL editor once, see section 5
```
