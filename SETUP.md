# BuggsAquatics — setup guide

Your site is plain HTML/CSS/JS, plus a free [Supabase](https://supabase.com) backend for real
accounts and a real forum. No build tools, nothing to install locally.

## 1. Preview it right now

Open `index.html` in a browser. The whole site works — shop, gallery, care guides, contact form.
The **forum and accounts won't work yet** until you connect Supabase (step 2), but you'll see a
clear "not connected" message instead of a broken page.

## 2. Connect Supabase (real accounts + forum)

1. Go to [supabase.com](https://supabase.com) → **New project** (free tier is plenty for this).
2. Once it's created, open **SQL Editor** → **New query**, paste in the entire contents of
   `schema.sql` (included in this folder), and click **Run**. This creates:
   - a `profiles` table (auto-filled when someone signs up)
   - `forum_categories`, `forum_threads`, `forum_posts` tables
   - row-level security policies so people can only edit their own stuff
   - six starter forum categories
3. Go to **Project Settings → API**. Copy the **Project URL** and the **anon public** key.
4. Open `config.js` in this folder and paste them in:
   ```js
   const SUPABASE_URL = "https://your-project.supabase.co";
   const SUPABASE_ANON_KEY = "eyJ...";
   ```
5. Save, refresh the site — accounts and the forum are now live.

### Optional: turn off email confirmation (faster testing)
By default Supabase requires users to click a confirmation email before signing in.
To skip that while testing: **Authentication → Providers → Email → toggle off "Confirm email"**.
Turn it back on before you launch publicly, or spam signups become a problem.

### Optional: seed yourself as the first forum poster
Sign up through `account.html` like any normal user — the first real account is just a real account.

## 3. Editing the basics

- **Colors & fonts:** top of `styles.css`, in the `:root` block.
- **Shop items:** edit directly inside `shop.html` — each item is one `.tile` block, copy/paste
  to add more.
- **Gallery tanks:** same pattern in `gallery.html`.
- **Care guide text:** edit the `<article>` sections in `care.html`.
- **Forum categories:** edit via the Supabase Table Editor (`forum_categories` table) — no code
  changes needed, the site pulls them live.
- **Email address:** replace `hello@buggsaquatics.co` in `contact.html` and the footers.

## 4. Putting it online

1. **Netlify Drop** — go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag this
   whole folder in. Live in seconds, free HTTPS included.
2. **GitHub Pages** — push the folder to a repo, enable Pages in repo settings.
3. Point your own domain at whichever host you pick — both support free custom domains.

Supabase doesn't care where the HTML is hosted — it just needs the URL/key in `config.js`, and
any host works.

## 5. A note on the shop

The shop is showcase-only by design (per your spec) — "Ask about this" buttons open a pre-filled
email instead of a checkout. If you ever want real payments later, that's a separate integration
(Stripe Checkout or Shopify Buy Buttons both bolt onto static sites reasonably easily) — happy to
help with that when you're ready.

## Files
```
index.html          Home
shop.html            Shop (showcase, inquire-only)
gallery.html         Gallery (tanks we keep)
care.html            Care guides / info hub
forum.html           Forum home (categories, recent threads, new thread)
forum-thread.html    Single thread (posts + reply)
account.html         Sign in / create account / profile
contact.html         Contact form
styles.css           All design tokens, layout, components
config.js            Your Supabase URL + key (edit this)
auth.js              Account logic + nav account widget
forum.js             Forum data logic
app.js               Mobile menu + scroll reveal
schema.sql           Run once in Supabase SQL editor
```
