# abigaillo.com

Personal portfolio site built with HTML, CSS, and JavaScript. Hosted on Firebase at [abigaillo.com](https://abigaillo.com).

## Features

- **Hero** — full-screen intro with headshot, bio, current role, and social links
- **About** — two-column split between professional background and beyond the keyboard, with a photo carousel placeholder
- **Skills** — three-column grid (Data Science & ML / Research & Methods / Design & Tools)
- **Projects** — card grid with image, tag, description, and link for each project
- **Research** — dedicated section for conference posters and academic work, with collapsible abstract and authors line
- **Contact** — centered icon layout linking to email, LinkedIn, and GitHub
- Scroll reveal animations on all sections
- Fixed nav with blur effect and active link highlight based on scroll position
- Mobile-responsive with hamburger menu drawer

## Design choices

- **Nunito** for body text, **DM Mono** for labels and badges
- Purple accent (`#4C1D95`) with a soft lavender (`#F8F5FB`) for alternating section backgrounds
- Section titles in deep purple (`#2B1060`)
- No frameworks — everything is vanilla HTML/CSS/JS
- BEM-ish class naming to keep styles easy to find

## Editing content

All site content lives in `content.json`. The easiest way to edit it is through the admin panel — no code required.

### Using the admin panel

1. In your terminal, navigate to the website folder and run:
   ```bash
   python3 server.py
   ```
2. Open [localhost:3000/admin.html](http://localhost:3000/admin.html) in your browser
3. Edit any section using the forms — add/remove project cards, update your bio, add research entries, reorder cards with ↑ ↓
4. Click **Save** — changes are written directly to `content.json`
5. Check your changes at [localhost:3000](http://localhost:3000)
6. When ready to publish: `./deploy.sh`

### Adding a project image

1. Drop the image file into the website folder (e.g. `myproject.png`)
2. In the admin panel under Projects, type the filename into the Image field
3. Save and deploy

### Editing the design

Content changes → use the admin panel. Design changes (layout, colors, fonts, spacing) → edit `styles.css` directly.

## Files

| File | Purpose |
|------|---------|
| `content.json` | All site content — edit this via admin.html |
| `admin.html` | Visual editor for content.json |
| `server.py` | Local dev server with /save endpoint (use instead of python3 -m http.server) |
| `index.html` | Page skeleton and section structure |
| `render.js` | Fetches content.json and builds each section |
| `styles.css` | All styling and layout |
| `script.js` | Scroll animations, nav behavior, mobile menu |
| `deploy.sh` | Deploy script — stamps the current month/year into content.json then runs firebase deploy |
| `firebase.json` | Firebase Hosting config |

## Commands

Start local server (with admin panel save support):
```bash
python3 server.py
```

Deploy to Firebase (also stamps the "last updated" date in the footer):
```bash
./deploy.sh
```

<details>
<summary><strong>Dev Log</strong></summary>

### Jul 15, 2026
- Initial site built and pushed to GitHub
- Set up Firebase Hosting and connected custom domain abigaillo.com via Porkbun DNS
- Basic single-page portfolio with Hero, About, Skills, Projects, and Contact sections

### Jul 18, 2026 — Website Redesign
Implemented Figma wireframe redesign — new layout, Nunito font, alternating lavender/white section backgrounds
- Added Research section (PNOMIX 2026)
- Rebuilt projects as a card grid
- Added Personal Portfolio Website as a 4th project card with website.png screenshot
- Redesigned About section with Professional / Beyond the Keyboard split and carousel placeholder
- Redesigned Contact section with centered icon circles
- Added Research nav link (5 links total)
- Cleaned up dead CSS variables and fixed active nav link to use class instead of inline styles

### Jul 18, 2026 — Content Management System + Research Section
Content Management
- All site content (projects, skills, bio, research) moved to content.json
- render.js fetches content.json and builds each section dynamically
- admin.html is a visual editor — add/edit/reorder cards without touching code
- server.py replaces python3 -m http.server and adds a /save endpoint so the admin panel writes content.json directly
Research section
- Poster image now fits inside the frame without cropping
- Added authors line below the conference badge
- Abstract collapses to 3 lines with a See more/See less toggle
Housekeeping
- Added project tag filtering with multi-select chip UI in admin panel
- Added "Last updated" line to footer, auto-stamped on deploy via deploy.sh
- Moved all images into photos folder

</details>
