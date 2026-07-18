# abigaillo.com

Personal portfolio site built with HTML, CSS, and JavaScript. Hosted on Firebase at [abigaillo.com](https://abigaillo.com).

## Features

- **Hero** — full-screen intro with headshot, bio, current role, and social links
- **About** — two-column split between professional background and beyond the keyboard, with a photo carousel placeholder
- **Skills** — three-column grid (Data Science & ML / Research & Methods / Design & Tools)
- **Projects** — card grid with image, tag, description, and link for each project
- **Research** — dedicated section for conference posters and academic work
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

<details>
<summary><strong>Dev Log</strong></summary>

### Jul 15, 2026
- Initial site built and pushed to GitHub
- Set up Firebase Hosting and connected custom domain abigaillo.com via Porkbun DNS
- Basic single-page portfolio with Hero, About, Skills, Projects, and Contact sections

### Jul 18, 2026
Implemented Figma wireframe redesign — new layout (details below), Nunito font, alternating lavender/white section backgrounds
- Added Research section (PNOMIX 2026)
- Rebuilt projects as a card grid
- Added Personal Portfolio Website as a 4th project card with website.png screenshot
- Redesigned About section with Professional / Beyond the Keyboard split and carousel placeholder
- Redesigned Contact section with centered icon circles
- Added Research nav link (5 links total)
- Cleaned up dead CSS variables and fixed active nav link to use class instead of inline styles

</details>

## Files

- `index.html` — all content and structure
- `styles.css` — all styling and layout
- `script.js` — scroll animations, nav behavior, mobile menu
- `firebase.json` — Firebase Hosting config

## Commands

Preview locally:
```bash
python3 -m http.server 3000
```

Deploy:
```bash
firebase deploy
```
