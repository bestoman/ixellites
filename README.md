# The Ixellites — coming soon page

A single-page "coming soon" site for The Ixellites. Plain HTML/CSS/JS, no build step, no dependencies.

## Structure

```
index.html        page markup
styles.css         all styling (fluid/responsive, no framework)
script.js          scatters the background icons (UFOs, rockets, aliens, atoms, stars)
assets/favicon.svg the atom mark, used as the browser tab icon
assets/og-image.png social-share preview image (1200x630)
netlify.toml        Netlify config (publish dir + security headers)
```

Fonts (Righteous, Audiowide, Space Mono, Work Sans) load from Google Fonts via `<link>` tags in `index.html`.

The background icon field is generated client-side with a seeded random number generator, so the layout is stable across reloads but automatically hidden on narrow (< 700px) screens to keep mobile clean.

## Run it locally

No build step needed — any static file server works:

```
npx serve .
# or
python3 -m http.server 8000
```

Then open the printed local URL in your browser.

## Deploy: GitHub → Netlify

1. **Push this folder to a new GitHub repo.** From inside this folder:

   ```
   git init
   git add .
   git commit -m "Initial commit: coming soon page"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

   (Create the empty repo first at github.com/new — don't initialize it with a README, or the push above will need `git pull --rebase` first.)

2. **Connect it in Netlify:**
   - Log into Netlify → **Add new site** → **Import an existing project** → **Deploy with GitHub**.
   - Authorize Netlify to access your GitHub account if prompted, then pick this repo.
   - Build settings: leave the build command **empty** and set the publish directory to `.` (the repo root) — there's no build step, `netlify.toml` already specifies this, so the defaults Netlify shows should already be correct.
   - Click **Deploy site**. It'll be live at a `*.netlify.app` URL within a minute or two.

3. **Custom domain (optional):** in the Netlify site's **Domain settings**, add your domain and follow the DNS instructions there.

From then on, every push to `main` on GitHub automatically redeploys the site — no further steps needed.

## Editing content

- Copy (tagline, "coming soon" line, location tag) lives directly in `index.html`.
- Colors and type sizes are CSS custom properties / `clamp()` values at the top of `styles.css`.
- To swap the background icon mix, edit the `icons` array or the `target` density formula in `script.js`.
