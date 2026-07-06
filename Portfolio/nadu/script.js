/* ── script.js  Naadu Restaurant ── */

/* ─── Navbar scroll effect ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ─── Hero parallax & bg load animation ─── */
const heroBg = document.getElementById('hero-bg');
if (heroBg) {
  const img = new Image();
  img.src = heroBg.style.backgroundImage.replace(/url\(["']?|["']?\)/g, '');
  img.onload = () => heroBg.classList.add('loaded');
}

/* ─── Scroll parallax on hero bg ─── */
window.addEventListener('scroll', () => {
  if (heroBg) {
    const scrolled = window.scrollY;
    heroBg.style.transform = `scale(1) translateY(${scrolled * 0.3}px)`;
  }
}, { passive: true });

/* ─── Hamburger menu ─── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ─── Reveal on scroll (IntersectionObserver) ─── */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revealObs.observe(el));

/* ─── Active nav link on scroll ─── */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

const activeObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAs.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${id}`) a.classList.add('active');
      });
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => activeObs.observe(s));

/* ─── Reservation form ─── */
const form       = document.getElementById('reserve-form');
const successMsg = document.getElementById('form-success');
const submitBtn  = document.getElementById('submit-reserve-btn');

// Set min date to today
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      form.reset();
      submitBtn.textContent = 'Confirm Reservation';
      submitBtn.disabled = false;
      successMsg.style.display = 'block';
      setTimeout(() => (successMsg.style.display = 'none'), 5000);
    }, 1200);
  });
}

/* ─── Smooth active nav style ─── */
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--clr-gold); }
.nav-links a.active::after { width: 100%; }`;
document.head.appendChild(style);

/* ─── Gallery lightbox (simple overlay) ─── */
const gCells = document.querySelectorAll('.g-cell');

// Build lightbox
const lb = document.createElement('div');
lb.id = 'lightbox';
lb.innerHTML = `
  <div id="lb-backdrop"></div>
  <div id="lb-content">
    <img id="lb-img" src="" alt="" />
    <button id="lb-close" aria-label="Close">✕</button>
    <button id="lb-prev" aria-label="Previous">‹</button>
    <button id="lb-next" aria-label="Next">›</button>
  </div>
`;
document.body.appendChild(lb);

const lbStyle = document.createElement('style');
lbStyle.textContent = `
#lightbox {
  display: none; position: fixed; inset: 0; z-index: 9999;
  align-items: center; justify-content: center;
}
#lightbox.open { display: flex; }
#lb-backdrop {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(10px);
}
#lb-content {
  position: relative; z-index: 1;
  max-width: 90vw; max-height: 90vh;
  display: flex; align-items: center; justify-content: center;
}
#lb-img {
  max-width: 85vw; max-height: 85vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 80px rgba(0,0,0,0.6);
  width: auto;
}
#lb-close {
  position: fixed; top: 24px; right: 24px;
  background: rgba(200,169,110,0.15); color: #c8a96e;
  border: 1px solid rgba(200,169,110,0.3);
  width: 44px; height: 44px; border-radius: 50%;
  font-size: 1.2rem; cursor: pointer; display: flex;
  align-items: center; justify-content: center;
  transition: background 0.2s;
}
#lb-close:hover { background: rgba(200,169,110,0.3); }
#lb-prev, #lb-next {
  position: fixed; top: 50%; transform: translateY(-50%);
  background: rgba(200,169,110,0.12); color: #c8a96e;
  border: 1px solid rgba(200,169,110,0.25);
  width: 48px; height: 48px; border-radius: 50%;
  font-size: 1.6rem; cursor: pointer; display: flex;
  align-items: center; justify-content: center;
  transition: background 0.2s;
}
#lb-prev { left: 24px; }
#lb-next { right: 24px; }
#lb-prev:hover, #lb-next:hover { background: rgba(200,169,110,0.25); }
`;
document.head.appendChild(lbStyle);

let currentIdx = 0;
const galleryImgs = [...gCells].map(c => ({
  src: c.querySelector('img').src,
  alt: c.querySelector('img').alt,
}));

function openLB(idx) {
  currentIdx = idx;
  const { src, alt } = galleryImgs[currentIdx];
  document.getElementById('lb-img').src = src;
  document.getElementById('lb-img').alt = alt;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLB() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

gCells.forEach((cell, i) => cell.addEventListener('click', () => openLB(i)));
document.getElementById('lb-close').addEventListener('click', closeLB);
document.getElementById('lb-backdrop').addEventListener('click', closeLB);
document.getElementById('lb-prev').addEventListener('click', () => {
  currentIdx = (currentIdx - 1 + galleryImgs.length) % galleryImgs.length;
  openLB(currentIdx);
});
document.getElementById('lb-next').addEventListener('click', () => {
  currentIdx = (currentIdx + 1) % galleryImgs.length;
  openLB(currentIdx);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLB();
  if (e.key === 'ArrowLeft') { currentIdx = (currentIdx - 1 + galleryImgs.length) % galleryImgs.length; openLB(currentIdx); }
  if (e.key === 'ArrowRight') { currentIdx = (currentIdx + 1) % galleryImgs.length; openLB(currentIdx); }
});
