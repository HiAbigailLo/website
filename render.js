// render.js
// Fetches content.json and populates every section of the portfolio.
// Requires a local server — run: python3 -m http.server 3000
// After rendering, fires a "content:ready" event so script.js can
// observe the newly added .reveal elements.

(async function () {
  let data;

  try {
    const res = await fetch('content.json');
    if (!res.ok) throw new Error(res.statusText);
    data = await res.json();
  } catch (err) {
    console.error('[render.js] Could not load content.json:', err);
    return;
  }

  renderHero(data.hero);
  renderAbout(data.about);
  renderSkills(data.skills);
  renderProjects(data.projects);
  renderResearch(data.research);
  renderContact(data.hero); // contact links reuse the same urls as hero
  renderFooter(data);

  // tell script.js to pick up newly added .reveal elements
  document.dispatchEvent(new CustomEvent('content:ready'));
})();


// ── Hero ──────────────────────────────────────────────────────────────────────
// fills the greeting, bio, current role, and social buttons

function renderHero(h) {
  document.getElementById('hero-content').innerHTML = `
    <h1 class="hero__name">${h.greeting}</h1>
    <p class="hero__bio">${h.bio}</p>
    <div class="hero__currently">
      <div><span class="hero__label">Currently</span> ${h.currently}</div>
      <div><span class="hero__label">Looking for</span> ${h.lookingFor}</div>
    </div>
    <div class="hero__actions">
      <a class="btn btn--primary" href="#projects">See my work</a>
      <div class="hero__socials">
        <a href="mailto:${h.email}" class="hero__social-btn" aria-label="Email">${ICON.email(18)}</a>
        <a href="${h.linkedin}" target="_blank" rel="noopener" class="hero__social-btn" aria-label="LinkedIn">${ICON.linkedin(18)}</a>
        <a href="${h.github}" target="_blank" rel="noopener" class="hero__social-btn" aria-label="GitHub">${ICON.github(18)}</a>
      </div>
    </div>
  `;
}


// ── About ─────────────────────────────────────────────────────────────────────
// professional: array of paragraph strings
// beyond: single string

function renderAbout(a) {
  document.getElementById('about-professional').innerHTML = `
    ${a.professional.map(p => `<p>${p}</p>`).join('')}
    <button class="about__more-btn" onclick="toggleFunFacts(this)">Fun facts about me ↓</button>
    <div class="about__fun-facts">
      <ul class="about__facts-list">
        ${(a.funFacts || []).map(f => `<li>${f}</li>`).join('')}
      </ul>
      <div class="about__carousel" id="about-carousel">
        <div class="about__carousel-track">
          ${(a.carouselPhotos && a.carouselPhotos.length)
            ? a.carouselPhotos.map((p, i) => `
                <div class="about__carousel-slide${i === 0 ? ' active' : ''}">
                  <img src="${p.src}" alt="${p.caption || `Photo ${i + 1}`}" />
                  ${p.caption ? `<p class="about__carousel-caption">${p.caption}</p>` : ''}
                </div>`
              ).join('')
            : `<div class="about__carousel-placeholder" role="img" aria-label="Photo placeholder"></div>`
          }
        </div>
        ${(a.carouselPhotos && a.carouselPhotos.length > 1) ? `
        <div class="about__carousel-controls">
          <button class="about__carousel-btn" aria-label="Previous photo" onclick="carouselPrev()">&#8249;</button>
          <div class="about__carousel-dots" id="carousel-dots">
            ${a.carouselPhotos.map((_, i) =>
              `<span class="about__dot${i === 0 ? ' about__dot--active' : ''}"></span>`
            ).join('')}
          </div>
          <button class="about__carousel-btn" aria-label="Next photo" onclick="carouselNext()">&#8250;</button>
        </div>` : ''}
      </div>
    </div>
  `;
}

let _carouselIndex = 0;
let _carouselTimer = null;

function carouselNav(dir) {
  const slides = document.querySelectorAll('.about__carousel-slide');
  const dots   = document.querySelectorAll('#carousel-dots .about__dot');
  if (!slides.length) return;
  slides[_carouselIndex].classList.remove('active');
  dots[_carouselIndex]?.classList.remove('about__dot--active');
  _carouselIndex = (_carouselIndex + dir + slides.length) % slides.length;
  slides[_carouselIndex].classList.add('active');
  dots[_carouselIndex]?.classList.add('about__dot--active');
}

function carouselPrev() {
  clearInterval(_carouselTimer);
  carouselNav(-1);
  _carouselTimer = setInterval(() => carouselNav(1), 5000);
}

function carouselNext() {
  clearInterval(_carouselTimer);
  carouselNav(1);
  _carouselTimer = setInterval(() => carouselNav(1), 5000);
}

function startCarouselAuto() {
  const slides = document.querySelectorAll('.about__carousel-slide');
  if (slides.length > 1) {
    _carouselTimer = setInterval(() => carouselNav(1), 5000);
  }
}

function toggleFunFacts(btn) {
  const panel = btn.nextElementSibling;
  const isOpen = panel.classList.toggle('open');
  btn.textContent = isOpen ? 'Less about me ↑' : 'Fun facts about me ↓';
  if (isOpen) startCarouselAuto(); else clearInterval(_carouselTimer);
}


// ── Skills ────────────────────────────────────────────────────────────────────
// renders each skill group: name + dot header, rule, then item list
// items with a "sub" field render as an indented sub-item below the main entry

function renderSkills(skills) {
  document.getElementById('skills-grid').innerHTML = skills.map(group => `
    <div class="skills__group">
      <div class="skills__group-header">
        <h3 class="skills__group-name">${group.name}</h3>
        <span class="skills__dot" aria-hidden="true"></span>
      </div>
      <hr class="skills__rule" />
      <ul class="skills__list">
        ${group.items.map(item => `
          <li>${item.text}</li>
          ${item.sub ? `<li class="skills__sub-item">${item.sub}</li>` : ''}
        `).join('')}
      </ul>
    </div>
  `).join('');
}


// ── Projects ──────────────────────────────────────────────────────────────────
// each project gets a .reveal class so it animates in on scroll
// set image to a filename string (e.g. "website.png") or null for the placeholder

function renderProjects(projects) {
  // support both old string "tag" and new array "tags"
  const normalized = projects.map(p => ({
    ...p,
    tags: p.tags || (p.tag ? [p.tag] : [])
  }));

  // collect all unique tags in the order they first appear
  const allTags = [...new Set(normalized.flatMap(p => p.tags))];

  // filter bar — "All" button + one per unique tag
  document.getElementById('projects-filters').innerHTML = `
    <div class="projects__filters">
      <button class="projects__filter active" data-tag="all">All</button>
      ${allTags.map(tag => `<button class="projects__filter" data-tag="${tag}">${tag}</button>`).join('')}
    </div>
  `;

  // project cards — store tags as data attribute for filtering
  document.getElementById('projects-grid').innerHTML = normalized.map(p => `
    <article class="project-card reveal" data-tags="${p.tags.join('|')}">
      ${p.image
        ? `<img src="${p.image}" alt="${p.title} screenshot" class="project-card__image project-card__image--photo" />`
        : `<div class="project-card__image" role="img" aria-label="Project screenshot placeholder"></div>`
      }
      <div class="project-card__body">
        <div class="project-card__tags">
          ${p.tags.map(tag => `<span class="project-card__tag">${tag}</span>`).join('')}
        </div>
        <h3 class="project-card__title">${p.title}</h3>
        <p class="project-card__desc">${p.desc}</p>
        ${p.link && p.link !== '#' ? `<a href="${p.link}" target="_blank" rel="noopener" class="btn btn--outline btn--sm">${p.linkLabel}</a>` : ''}
      </div>
    </article>
  `).join('');

  // filter click handler
  document.querySelectorAll('.projects__filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.projects__filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tag = btn.dataset.tag;
      document.querySelectorAll('.project-card').forEach(card => {
        const cardTags = card.dataset.tags.split('|');
        card.classList.toggle('hidden', tag !== 'all' && !cardTags.includes(tag));
      });
    });
  });
}


// ── Research ──────────────────────────────────────────────────────────────────
// supports multiple entries — each gets its own research__inner block
// set posterImage to a filename or null for the placeholder

function renderResearch(research) {
  document.getElementById('research-list').innerHTML = research.map(r => `
    <div class="research__inner reveal">
      <div class="research__poster-wrap">
        <div class="research__poster-img" role="img" aria-label="Research poster">
          ${r.posterImage
            ? `<img src="${r.posterImage}" alt="Research poster" class="research__poster-photo" />`
            : `<span class="research__poster-label">poster</span>`
          }
        </div>
      </div>
      <div class="research__content">
        <span class="research__badge">${r.badge}</span>
        <h3 class="research__title">${r.title}</h3>
        ${r.authors ? `<p class="research__authors">${r.authors}</p>` : ''}
        <p class="research__desc">${r.desc}</p>
        <button class="research__toggle" onclick="toggleAbstract(this)">See more...</button>
        ${r.posterLink && r.posterLink !== '#' ? `<a href="${r.posterLink}" class="btn btn--outline btn--sm">View Poster →</a>` : ''}
      </div>
    </div>
  `).join('');
}

// expands/collapses the abstract above the clicked button
function toggleAbstract(btn) {
  const desc = btn.previousElementSibling;
  const expanded = desc.classList.toggle('expanded');
  btn.textContent = expanded ? 'See less' : 'See more...';
}


// ── Contact ───────────────────────────────────────────────────────────────────
// reuses email, linkedin, and github from hero data so there's only one place to update them

function renderContact(h) {
  document.getElementById('contact-grid').innerHTML = `
    <div class="contact__item">
      <a href="mailto:${h.email}" class="contact__circle" aria-label="Email">${ICON.email(20)}</a>
      <span class="contact__label">Email</span>
      <span class="contact__handle">${h.email}</span>
    </div>
    <div class="contact__item">
      <a href="${h.linkedin}" target="_blank" rel="noopener" class="contact__circle" aria-label="LinkedIn">${ICON.linkedin(20)}</a>
      <span class="contact__label">LinkedIn</span>
      <span class="contact__handle">linkedin.com/in/lo-abigail</span>
    </div>
    <div class="contact__item">
      <a href="${h.github}" target="_blank" rel="noopener" class="contact__circle" aria-label="GitHub">${ICON.github(20)}</a>
      <span class="contact__label">GitHub</span>
      <span class="contact__handle">github.com/HiAbigailLo</span>
    </div>
  `;
}


// ── Footer ────────────────────────────────────────────────────────────────────

function renderFooter(data) {
  document.getElementById('year').textContent = new Date().getFullYear();
  const updated = document.getElementById('last-updated');
  if (updated && data.lastUpdated) updated.textContent = data.lastUpdated;
}


// ── SVG Icons ─────────────────────────────────────────────────────────────────
// functions so the same icon can be used at different sizes (hero = 18, contact = 20)

const ICON = {
  email: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>`,

  linkedin: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,

  github: (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`
};
