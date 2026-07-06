/* ===================================================
   WOODLANDS RESTAURANT – main.js
   =================================================== */

// ── Navbar scroll state ─────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


// ── Mobile hamburger menu ───────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});


// ── Reveal on scroll (IntersectionObserver) ─────────
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger within the same parent
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 90);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);
revealEls.forEach(el => revealObserver.observe(el));


// ── Menu tabs ───────────────────────────────────────
const tabs     = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Deactivate all
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    contents.forEach(c => c.classList.remove('active'));

    // Activate clicked
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const target = document.getElementById('tab-' + tab.dataset.tab + '-content');
    if (target) {
      target.classList.add('active');
      // Re-trigger reveal for newly visible cards
      target.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('visible');
        setTimeout(() => revealObserver.observe(el), 10);
      });
    }
  });
});


// ── Smooth active nav link highlight on scroll ──────
const sections = document.querySelectorAll('section[id], header[id]');
const navItems  = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(a => {
          a.classList.toggle('active-nav', a.getAttribute('href') === '#' + id);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach(s => sectionObserver.observe(s));


// ── Stats counter animation ─────────────────────────
const statsBar = document.querySelector('.stats-bar');
let statsAnimated = false;

const statsObserver = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      animateCounters();
      statsObserver.disconnect();
    }
  },
  { threshold: 0.5 }
);
if (statsBar) statsObserver.observe(statsBar);

function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const raw  = el.textContent.trim();
    const num  = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const pre  = raw.replace(/[0-9.]+.*$/, '');
    const suf  = raw.replace(/^[^0-9.]*[0-9.]+/, '');
    const dur  = 1200;
    const step = 16;
    const inc  = num / (dur / step);
    let cur    = 0;
    const t    = setInterval(() => {
      cur = Math.min(cur + inc, num);
      el.textContent = pre + (Number.isInteger(num) ? Math.round(cur) : cur.toFixed(1)) + suf;
      if (cur >= num) clearInterval(t);
    }, step);
  });
}
