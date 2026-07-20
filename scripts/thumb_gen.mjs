import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC = path.join(process.cwd(), 'public');
const THUMBS = path.join(PUBLIC, 'static', 'thumbs');
fs.mkdirSync(THUMBS, { recursive: true });

// Built-in fallbacks per slug if no metadata match
const FALLBACKS = {
  'daftar-harga-sewa-event-space-piccs-2026': 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/2025/_MG_9258.JPG',
  'event-space-fasilitas-lengkap-jakarta-selatan': 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/2025/_MG_8654.JPG',
  'event-space-jakarta-selatan': 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/2025/_MG_8590.JPG',
  'meeting-room-tebet': 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/2025/_MG_9237.JPG',
  'budget-friendly-venue-jakarta': 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/2025/_MG_8575.JPG',
  'ide-gathering-seru-jakarta': 'https://photos.piccreativespace.id/DEKOR%20WEDDING%202025/_MG_1074.JPG',
};

const FALLBACK_VENUE = 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/2025/_MG_8590.JPG';

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function norm(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function tokenize(text) {
  return new Set(norm(text).split(' ').filter(Boolean));
}

function jaccard(a, b) {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter || 1);
}

function scorePhoto(photo, articleTokens) {
  const pt = tokenize([...(photo.tags || []), photo.description || ''].join(' '));
  let s = jaccard(articleTokens, pt);
  // Title keywords boost
  const titleTokens = tokenize(photo.description || '');
  if (titleTokens.size) s += 0.05;
  return s;
}

async function pickPhotoFor(slug, title, tags) {
  const articleTokens = tokenize([title, ...tags].join(' '));
  const rows = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'scripts', 'photos_cache.json'), 'utf8')
  );

  let best = null;
  let bestScore = -1;
  for (const p of rows) {
    const s = scorePhoto(p, articleTokens);
    if (s > bestScore) {
      bestScore = s;
      best = p;
    }
  }
  if (best && bestScore > 0.05 && best.path) {
    let src = best.path;
    if (!src.startsWith('http')) {
      const rel = path.join(best.folder || '', src).split('piccs-photos/').pop();
      src = `https://photos.piccreativespace.id/${encodeURIComponent(rel)}`;
    }
    return src;
  }
  return FALLBACKS[slug] || FALLBACK_VENUE;
}

async function makeThumb(sourceUrl, outPath) {
  try {
    const src = await fetchBuffer(sourceUrl);
    const svg = Buffer.from(
      `<svg width="1200" height="630">
        <rect width="1200" height="630" fill="rgba(0,0,0,0)"/>
      </svg>`
    );
    await sharp(src)
      .rotate()
      .resize(1200, 630, { fit: 'cover', position: 'entropy' })
      .composite([{ input: svg, top: 0, left: 0 }])
      .jpeg({ quality: 88 })
      .toFile(outPath);
  } catch (e) {
    console.warn('SKIP', outPath, e.message);
  }
}

(async () => {
  const rows = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'scripts', 'photos_cache.json'), 'utf8')
  );

  const articles = [
    { slug: 'budget-friendly-venue-jakarta', title: 'Budget Friendly Event Venue di Jakarta: Tips Sewa Tanpa Bikin Kantong Bolong', tags: ['Budget','Tips','Venue Murah','Jakarta'] },
    { slug: 'daftar-harga-sewa-event-space-piccs-2026', title: 'Daftar Harga Sewa Event Space PIC Creative Space Jakarta 2026 — The Sanctuary, The Dwelling, dan The Salt & Light', tags: ['Harga','Event Space','Jakarta Selatan','Venue','Booking'] },
    { slug: 'event-space-fasilitas-lengkap-jakarta-selatan', title: 'Event Space Fasilitas Terlengkap di Jakarta Selatan', tags: ['Event Space','Fasilitas','Jakarta Selatan','The Sanctuary','The Dwelling','Salt & Light'] },
    { slug: 'event-space-jakarta-selatan', title: 'Event Space Jakarta Selatan: Panduan Lengkap Memilih Venue', tags: ['Event Space','Jakarta Selatan','Venue','Panduan'] },
    { slug: 'ide-gathering-seru-jakarta', title: '5 Ide Gathering Seru di Jakarta — Dari Workshop Sampe Nobar', tags: ['Gathering','Jakarta','Event','Komunitas','Inspirasi'] },
    { slug: 'meeting-room-tebet', title: 'Meeting Room di Tebet untuk Rapat Kantor & Diskusi Tim', tags: ['Meeting Room','Tebet','Jakarta Selatan','Diskusi Tim','Rapat'] },
  ];

  for (const a of articles) {
    const url = await pickPhotoFor(a.slug, a.title, a.tags);
    const out = path.join(THUMBS, `${a.slug}.jpg`);
    await makeThumb(url, out);
    const stat = fs.statSync(out);
    console.log('OK', a.slug, stat.size, 'src=', url);
  }
})();
