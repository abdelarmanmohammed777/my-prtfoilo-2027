# Abdelrahman Mohamed — Full Stack Portfolio

React frontend + Node.js backend (zero dependencies on the server).

## Run (takes 5 seconds)
    node backend/server.js
    → open http://localhost:3000

The frontend is already built, so you do NOT need npm install just to run it.
You can also double-click `frontend/public/index.html` (static mode: the site works,
the contact form falls back to your email app).

## Structure
    backend/
      server.js            REST API + serves the frontend  (Node http, no packages)
      data/                profile.json, projects.json, certifications.json  <- EDIT YOUR CONTENT HERE
      data/messages.json   created automatically when someone uses the contact form
    frontend/
      src/                 React source (main.jsx, lib.jsx, sections/*)
      public/              index.html, style.css, app.js (built), docs/ (CV + certificates)
      build.mjs            esbuild bundler

## API
    GET  /api/health
    GET  /api/profile
    GET  /api/projects
    GET  /api/certifications
    POST /api/contact   { name, email, message }   (validation + rate limit + honeypot)

## Edit content
Change the JSON files in `backend/data/` and the React source in `frontend/src/`, then rebuild so the offline copy is updated:
    npm install
    npm run build
(When the backend is running, the site shows the live JSON immediately, even without rebuilding.)

## Deploy
- Full stack (Render / Railway / any VPS): deploy the whole folder, start command `node backend/server.js`.
- GitHub Pages (static only): publish `frontend/public/`. To use a hosted backend, add before app.js in index.html:
      <script>window.PORTFOLIO_API = "https://your-backend.example.com";</script>

## CSS structure (frontend/src/styles/)
The CSS is split into small files and bundled automatically into `frontend/public/app.css` by `npm run build`.
Do not edit `app.css` directly — edit the source files and rebuild.

    tokens.css     colours, radius, fonts, light/dark themes  (change the look here)
    base.css       reset, typography, buttons, cards, reveal animation, background
    nav.css        navigation pill, progress bar, back-to-top
    overlays.css   splash screen, toasts, command palette
    hero.css       intro, terminal card, stats, logo row
    about.css      bio card, frontend focus tiles, roadmap (hover effects)
    stack.css      tech stack cards, logo tiles, marquee
    projects.css   filter tabs + project cards
    certs.css      certification cards
    contact.css    contact form + footer
    index.css      imports everything in the right order

To change the accent colour of the entire site, edit `--accent` in `tokens.css` (both themes).

## Editing content (all in backend/data/)
- `profile.json` → `softSkills` and `interests` (the Skills section). Replace the interests with your real hobbies.
- `certifications.json` → add a certificate: put the PDF in `frontend/public/docs/` and add an entry
  (`"icon"`: database | chip | code | monitor | chart | ai, optional `"logo"`: a devicon name like `python`).
After editing run `npm run build`.

## Custom cursor
Lives in `Cursor` (frontend/src/sections/Chrome.jsx) + `styles/cursor.css`. It only activates on devices with a mouse;
phones/tablets keep the normal touch behaviour. To go back to the normal cursor, delete `<Cursor />` in `main.jsx`.
