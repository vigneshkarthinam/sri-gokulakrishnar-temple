// ============ Media manifest ============
// Demolition images 01-14 (old temple + demolition)
// Inauguration images 01-41 are ceremony/pooja photos (batch at 12.24)
// Inauguration images 42-44 are new temple shots (batch at 12.53)

const pad = (n) => String(n).padStart(2, '0');

const DEMOLITION_IMAGES = Array.from({ length: 14 }, (_, i) => ({
  src: `assets/demolition/demolition-${pad(i + 1)}.jpg`,
  caption: i < 4 ? 'Old temple' : i < 10 ? 'Demolition works' : 'Site cleared',
  alt: `Old temple demolition photo ${i + 1}`,
}));

const CEREMONY_IMAGES = Array.from({ length: 41 }, (_, i) => ({
  src: `assets/inauguration/inauguration-${pad(i + 1)}.jpg`,
  caption: 'Boomi Pooja & Door Pooja',
  alt: `Boomi Pooja / Door Pooja photo ${i + 1}`,
}));

const NEW_TEMPLE_IMAGES = Array.from({ length: 3 }, (_, i) => ({
  src: `assets/inauguration/inauguration-${pad(42 + i)}.jpg`,
  caption: 'Temple site',
  alt: `New temple site photo ${i + 1}`,
}));

const INAUGURATION_VIDEOS = Array.from({ length: 9 }, (_, i) => ({
  src: `assets/videos/inauguration/inauguration-${pad(i + 1)}.mp4`,
  poster: `assets/inauguration/inauguration-${pad(i + 1)}.jpg`,
  caption: `Boomi Pooja / Door Pooja — Clip ${i + 1}`,
}));

const DEMOLITION_VIDEOS = Array.from({ length: 8 }, (_, i) => ({
  src: `assets/videos/demolition/demolition-${pad(i + 1)}.mp4`,
  poster: `assets/demolition/demolition-${pad(i + 1)}.jpg`,
  caption: `Old Temple & Demolition — Clip ${i + 1}`,
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
