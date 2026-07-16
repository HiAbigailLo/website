# Portfolio Website

Personal portfolio site built with plain HTML, CSS, and JavaScript. Hosted on Firebase Hosting.

---

## File overview

### `index.html`
The entire site structure. Every section lives here — nav, hero, about, skills, projects, contact, and footer. If you want to change any text, add a project, or remove a section, this is the file to edit.

### `styles.css`
All the visual styling. Organized top to bottom in the same order as the page sections. Key things to know:
- CSS variables at the top of the file (inside `:root {}`) control the color palette, fonts, spacing, and border radius. Changing `--purple` here updates every purple accent on the site at once.
- Each section has its own clearly labeled block of styles (nav, hero, about, skills, projects, contact, footer).
- Media queries for mobile are written inline at the bottom of each section's block, not in a separate file.

### `script.js`
Three small behaviors:
1. **Year** — automatically fills in the current year in the footer so you never have to update it manually.
2. **Nav scroll state** — adds a subtle border to the nav when you scroll down.
3. **Scroll reveal** — watches for elements with the class `reveal` and fades them in as you scroll past them. If you add new sections, give elements the `reveal` class and they'll animate in automatically.
4. **Mobile burger menu** — opens and closes the drawer nav on small screens.

### `firebase.json`
Firebase Hosting configuration. Tells Firebase that your public files are in the current directory (`.`). You generally don't need to touch this unless you're changing how the site is hosted.

### `.firebaserc`
Created automatically by `firebase init`. Links this folder to your Firebase project so `firebase deploy` knows where to push the files. Don't edit this manually.

---

## Local preview

Open `index.html` directly in your browser, or run a simple local server:

```bash
python3 -m http.server 3000
```

Then visit `http://localhost:3000`.

## Deploy to Firebase

```bash
firebase deploy
```

Firebase will print a live URL (`https://your-project.web.app`) when it's done.
