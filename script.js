// ============ Media manifest ============
// Demolition images 01-14 (old temple + demolition)
// Inauguration images 01-41 are ceremony/pooja photos (batch at 12.24)
// Inauguration images 42-44 are new temple shots (batch at 12.53)

const pad = (n) => String(n).padStart(2, '0');

const DEMOLITION_CAPTIONS = [
  'Old Shrine',
  'Heritage Memory',
  'Final Darshan',
  'Demolition Works',
  'Making Way',
  'Clearing the Ground',
  'Sacred Foundation',
];

const DEMOLITION_IMAGES = Array.from({ length: 14 }, (_, i) => ({
  src: `assets/demolition/demolition-${pad(i + 1)}.jpg`,
  caption: DEMOLITION_CAPTIONS[i % DEMOLITION_CAPTIONS.length],
  alt: `Old temple demolition — photo ${i + 1}`,
}));

// Varied devotional captions cycled across the inauguration photos
const CEREMONY_CAPTIONS = [
  'Sacred Inauguration',
  'Vedic Rituals',
  'Divine Blessings',
  'Temple Ceremony',
  'Holy Pooja',
  'Priests & Devotees',
  'Sanctum Rites',
  'Auspicious Moments',
];

const CEREMONY_IMAGES = Array.from({ length: 41 }, (_, i) => ({
  src: `assets/inauguration/inauguration-${pad(i + 1)}.jpg`,
  caption: CEREMONY_CAPTIONS[i % CEREMONY_CAPTIONS.length],
  alt: `Sri Gokulakrishnar Temple inauguration — photo ${i + 1}`,
}));

const NEW_TEMPLE_IMAGES = Array.from({ length: 3 }, (_, i) => ({
  src: `assets/inauguration/inauguration-${pad(42 + i)}.jpg`,
  caption: 'Temple Sanctum',
  alt: `Sri Gokulakrishnar Temple site — photo ${i + 1}`,
}));

const INAUGURATION_VIDEOS = Array.from({ length: 9 }, (_, i) => ({
  src: `assets/videos/inauguration/inauguration-${pad(i + 1)}.mp4`,
  poster: `assets/inauguration/inauguration-${pad(i + 1)}.jpg`,
  caption: `Sacred Inauguration Ceremony — Clip ${i + 1}`,
}));

const DEMOLITION_VIDEOS = Array.from({ length: 8 }, (_, i) => ({
  src: `assets/videos/demolition/demolition-${pad(i + 1)}.mp4`,
  poster: `assets/demolition/demolition-${pad(i + 1)}.jpg`,
  caption: `Old Shrine & Demolition — Clip ${i + 1}`,
}));

// ============ Gallery builder ============
function buildFigure({ src, caption, alt }) {
  const fig = document.createElement('figure');
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || caption;
  img.loading = 'lazy';
  img.addEventListener('error', () => fig.classList.add('placeholder'));
  const cap = document.createElement('figcaption');
  cap.textContent = caption;
  fig.appendChild(img);
  fig.appendChild(cap);
  return fig;
}

function populate(id, items) {
  const host = document.getElementById(id);
  if (!host) return;
  items.forEach((it) => host.appendChild(buildFigure(it)));
}

// Journey: before (old temple — first 4 demolition shots) + after (new temple — 3 shots)
populate('gallery-demolition', DEMOLITION_IMAGES.slice(0, 6));
populate('gallery-new-temple', NEW_TEMPLE_IMAGES.concat(CEREMONY_IMAGES.slice(0, 3)));

// Ceremony gallery — first 8 visible, rest hidden behind "Show all"
const ceremonyHost = document.getElementById('gallery-ceremony');
if (ceremonyHost) {
  CEREMONY_IMAGES.forEach((it, i) => {
    const fig = buildFigure(it);
    if (i >= 8) fig.classList.add('hidden-extra');
    ceremonyHost.appendChild(fig);
  });
}
const loadMoreBtn = document.getElementById('loadMoreCeremony');
if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', () => {
    document.querySelectorAll('#gallery-ceremony .hidden-extra').forEach((el) => {
      el.classList.remove('hidden-extra');
    });
    loadMoreBtn.remove();
  });
}

// ============ Video builder ============
function buildVideoCard({ src, poster, caption }) {
  const fig = document.createElement('figure');
  fig.className = 'video-card';
  const video = document.createElement('video');
  video.controls = true;
  video.preload = 'metadata';
  video.poster = poster;
  const source = document.createElement('source');
  source.src = src;
  source.type = 'video/mp4';
  video.appendChild(source);
  const cap = document.createElement('figcaption');
  cap.textContent = caption;
  fig.appendChild(video);
  fig.appendChild(cap);
  return fig;
}

function populateVideos(id, items) {
  const host = document.getElementById(id);
  if (!host) return;
  items.forEach((it) => host.appendChild(buildVideoCard(it)));
}

populateVideos('video-grid-inauguration', INAUGURATION_VIDEOS);
populateVideos('video-grid-demolition', DEMOLITION_VIDEOS);

// ============ Video tabs ============
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.tab;
    document.getElementById('video-grid-inauguration').classList.toggle('hidden', target !== 'inauguration');
    document.getElementById('video-grid-demolition').classList.toggle('hidden', target !== 'demolition');
    // Pause any playing videos when switching tabs
    document.querySelectorAll('video').forEach((v) => v.pause());
  });
});

// ============ Mobile nav toggle ============
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('siteNav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// ============ Topbar shadow on scroll ============
const topbar = document.querySelector('.topbar');
if (topbar) {
  const onScroll = () => {
    topbar.style.boxShadow = window.scrollY > 8 ? '0 4px 20px rgba(13, 77, 107, 0.12)' : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============ Lightbox on gallery images ============
document.addEventListener('click', (e) => {
  const img = e.target.closest('.gallery figure img');
  if (!img || img.closest('figure.placeholder')) return;
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(6,53,73,0.92);
    display: grid; place-items: center; z-index: 9999; cursor: zoom-out;
    padding: 20px;
  `;
  const bigImg = document.createElement('img');
  bigImg.src = img.src;
  bigImg.alt = img.alt;
  bigImg.style.cssText = `
    max-width: 94%; max-height: 94%; border-radius: 14px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.6);
    border: 3px solid #c9a24a;
  `;
  overlay.appendChild(bigImg);
  overlay.addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);
});

// Make all gallery images look zoomable
const style = document.createElement('style');
style.textContent = `.gallery figure img { cursor: zoom-in; }`;
document.head.appendChild(style);

// ============ KUMBABHISHEKAM MODAL & COUNTDOWN ============
const KUMB_DATE = new Date('2026-04-30T08:00:00+05:30'); // Main Kumbabhishekam
const KUMB_STORAGE_KEY = 'kumbabishekam-modal-dismissed';
const KUMB_DISMISS_HOURS = 12; // Re-show after 12 hours

const kumbModal = document.getElementById('kumbModal');
const kumbOpenNav = document.getElementById('openKumbModal');
const kumbOpenBanner = document.getElementById('openKumbFromBanner');
const kumbCloseBtn = document.getElementById('kumbModalClose');
const kumbDismissBtn = document.getElementById('kumbDismissBtn');
const kumbDonateLink = document.getElementById('kumbDonateLink');

function openKumbModal(e) {
  if (e) e.preventDefault();
  if (!kumbModal) return;
  kumbModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeKumbModal() {
  if (!kumbModal) return;
  kumbModal.classList.remove('open');
  document.body.style.overflow = '';
  try {
    localStorage.setItem(KUMB_STORAGE_KEY, String(Date.now()));
  } catch (_) {}
}

if (kumbOpenNav) kumbOpenNav.addEventListener('click', openKumbModal);
if (kumbOpenBanner) kumbOpenBanner.addEventListener('click', openKumbModal);
if (kumbCloseBtn) kumbCloseBtn.addEventListener('click', closeKumbModal);
if (kumbDismissBtn) kumbDismissBtn.addEventListener('click', closeKumbModal);
if (kumbDonateLink) kumbDonateLink.addEventListener('click', closeKumbModal);

// Close on backdrop click
if (kumbModal) {
  kumbModal.addEventListener('click', (e) => {
    if (e.target === kumbModal) closeKumbModal();
  });
}

// Close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && kumbModal && kumbModal.classList.contains('open')) {
    closeKumbModal();
  }
  if (e.key === 'Escape' && payModal && payModal.classList.contains('open')) {
    closePayModal();
  }
});

// Auto-open on first visit (or every 12h)
(function autoOpenKumb() {
  if (!kumbModal) return;
  try {
    const last = Number(localStorage.getItem(KUMB_STORAGE_KEY) || 0);
    const hoursSince = (Date.now() - last) / (1000 * 60 * 60);
    if (!last || hoursSince > KUMB_DISMISS_HOURS) {
      // Wait a moment so the page renders first, then open
      setTimeout(() => openKumbModal(), 800);
    }
  } catch (_) {
    setTimeout(() => openKumbModal(), 800);
  }
})();

// Countdown — updates both the banner (compact) and modal (full)
function updateCountdown() {
  const now = Date.now();
  const diff = KUMB_DATE.getTime() - now;

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  if (diff <= 0) {
    setText('cd-days', '0'); setText('cd-hours', '0');
    setText('cd-mins', '0'); setText('cd-secs', '0');
    setText('cdc-days', '0'); setText('cdc-hours', '0'); setText('cdc-mins', '0');
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  setText('cd-days', String(days));
  setText('cd-hours', String(hours).padStart(2, '0'));
  setText('cd-mins', String(mins).padStart(2, '0'));
  setText('cd-secs', String(secs).padStart(2, '0'));

  setText('cdc-days', String(days));
  setText('cdc-hours', String(hours).padStart(2, '0'));
  setText('cdc-mins', String(mins).padStart(2, '0'));
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Click on invitation images inside modal opens lightbox too
document.querySelectorAll('.kumb-invite-images img').forEach((img) => {
  img.style.cursor = 'zoom-in';
});
document.addEventListener('click', (e) => {
  const img = e.target.closest('.kumb-invite-images figure img');
  if (!img) return;
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(6,53,73,0.95);
    display: grid; place-items: center; z-index: 100000; cursor: zoom-out;
    padding: 20px;
  `;
  const bigImg = document.createElement('img');
  bigImg.src = img.src;
  bigImg.alt = img.alt;
  bigImg.style.cssText = `
    max-width: 96%; max-height: 96%; border-radius: 12px;
    box-shadow: 0 30px 80px rgba(0,0,0,0.7);
    border: 3px solid #c9a24a;
  `;
  overlay.appendChild(bigImg);
  overlay.addEventListener('click', () => overlay.remove());
  document.body.appendChild(overlay);
});

// ============ Donate QR modal ============ 
const payModal = document.getElementById('payModal');
const openPayModalBtn = document.getElementById('openPayModal');
const payModalClose = document.getElementById('payModalClose');
const shareQrBtn = document.getElementById('shareQrBtn');
const openQrImageBtn = document.getElementById('openQrImageBtn');

function openPayModal() {
  if (!payModal) return;
  payModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePayModal() {
  if (!payModal) return;
  payModal.classList.remove('open');
  document.body.style.overflow = '';
}

if (openPayModalBtn) {
  openPayModalBtn.addEventListener('click', openPayModal);
  openPayModalBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPayModal();
    }
  });
}

if (payModalClose) payModalClose.addEventListener('click', closePayModal);
if (openQrImageBtn) openQrImageBtn.addEventListener('click', closePayModal);

if (payModal) {
  payModal.addEventListener('click', (e) => {
    if (e.target === payModal) closePayModal();
  });
}

if (shareQrBtn) {
  shareQrBtn.addEventListener('click', async () => {
    const qrUrl = new URL('assets/qr/payment-qr.jpeg', window.location.href).toString();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sri Gokulakrishnar Kovil Trust UPI QR',
          text: 'Pay using this UPI QR in PhonePe, GPay, Paytm, or another UPI app.',
          url: qrUrl,
        });
        return;
      } catch (_) {}
    }
    window.open(qrUrl, '_blank', 'noopener');
  });
}

// ============ Hero carousel ============
(function initHeroCarousel() {
  const root = document.getElementById('heroCarousel');
  if (!root) return;
  const slides = Array.from(root.querySelectorAll('.hero-slide'));
  const dots = Array.from(root.querySelectorAll('.hero-dot'));
  const prevBtn = root.querySelector('.hero-nav--prev');
  const nextBtn = root.querySelector('.hero-nav--next');
  if (slides.length === 0) return;

  let index = 0;
  let timer = null;
  const INTERVAL = 5000;

  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  function start() {
    stop();
    timer = setInterval(() => show(index + 1), INTERVAL);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  prevBtn && prevBtn.addEventListener('click', () => { show(index - 1); start(); });
  nextBtn && nextBtn.addEventListener('click', () => { show(index + 1); start(); });
  dots.forEach((d) => {
    d.addEventListener('click', () => {
      const i = Number(d.getAttribute('data-dot')) || 0;
      show(i);
      start();
    });
  });

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);

  start();
})();
