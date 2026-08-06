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

  const locals = rows.filter(p => p.path && fs.existsSync(p.path));
  const pool = locals.length ? locals : rows;

  let best = null;
  let bestScore = -1;
  for (const p of pool) {
    const s = scorePhoto(p, articleTokens);
    if (s > bestScore) {
      bestScore = s;
      best = p;
    }
  }
  if (best && bestScore > 0.05 && best.path) {
    return best.path;
  }

  // explicit per-slug local fallbacks / dedup overrides
  const slugMap = {
    'harga-kapasitas-event-space-jakarta-2026-breakdown-biaya-gathering-launching-karaoke': '/home/kalebooo/piccs-photos/PHOTO SETTINGAN RUANGAN/_MG_0563.JPG',
    'policy-fb-event-space-jakarta': '/home/kalebooo/piccs-photos/F&B CATERING/_MG_6726.JPG',
    'sewa-event-space-jakarta-150-200-pax': '/home/kalebooo/piccs-photos/PHOTO SETTINGAN RUANGAN/2025/_MG_8590.JPG',
    'survey-dan-transparansi-harga-sewa-event-space-jakarta-selatan': '/home/kalebooo/piccs-photos/PHOTO SETTINGAN RUANGAN/_MG_7304.JPG',
    'budget-friendly-venue-jakarta': '/home/kalebooo/piccs-photos/PHOTO SETTINGAN RUANGAN/2025/_MG_8696.JPG',
    'pilih-ruang-event-jakarta-sesuai-format': '/home/kalebooo/piccs-photos/PHOTO SETTINGAN RUANGAN/2025/_MG_8590.JPG',
    'event-space-fasilitas-lengkap-jakarta-selatan': '/home/kalebooo/piccs-photos/PHOTO SETTINGAN RUANGAN/_MG_9401.JPG',
    'ide-gathering-seru-jakarta': '/home/kalebooo/piccs-photos/DEKOR WEDDING 2025/_MG_1074.JPG',
  };
  if (slugMap[slug] && fs.existsSync(slugMap[slug])) return slugMap[slug];

  return FALLBACKS[slug] || FALLBACK_VENUE;
}

async function makeThumb(sourceUrl, outPath) {
  try {
    let src;
    if (sourceUrl.startsWith('http')) {
      src = await fetchBuffer(sourceUrl);
    } else {
      src = fs.readFileSync(sourceUrl);
    }
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
    { slug: 'harga-kapasitas-event-space-jakarta-2026-breakdown-biaya-gathering-launching-karaoke', title: 'Harga & Kapasitas Event Space Jakarta 2026: Breakdown Biaya Sewa untuk Gathering, Launching, dan Karaoke', tags: ['Harga','Kapasitas','Event Space','Jakarta','Gathering','Launching','Karaoke'] },
    { slug: 'ide-gathering-seru-jakarta', title: '5 Ide Gathering Seru di Jakarta — Dari Workshop Sampe Nobar', tags: ['Gathering','Jakarta','Event','Komunitas','Inspirasi'] },
    { slug: 'meeting-room-tebet', title: 'Meeting Room di Tebet untuk Rapat Kantor & Diskusi Tim', tags: ['Meeting Room','Tebet','Jakarta Selatan','Diskusi Tim','Rapat'] },
    { slug: 'pilih-ruang-event-jakarta-sesuai-format', title: 'Workshop vs Private Party vs Podcast: Pilih Ruang Event di Jakarta Sesuai Format Acaramu', tags: ['Event Space','Jakarta Selatan','Workshop','Private Party','Podcast','Venue'] },
    { slug: 'policy-fb-event-space-jakarta', title: 'Policy F&B di Event Space Jakarta: Boleh Bawa Catering dari Luar atau Harus Pakai Partner?', tags: ['F&B','Event Space','Jakarta','Catering','Booking Tips'] },
    { slug: 'sewa-event-space-jakarta-150-200-pax', title: 'Sewa Event Space Jakarta untuk 150-200 Pax: 7 Tips Wajib', tags: ['Event Space','Jakarta Selatan','Corporate Event','Venue','PICCS'] },
    { slug: 'survey-dan-transparansi-harga-sewa-event-space-jakarta-selatan', title: 'Survey dan Transparansi Harga Sewa Event Space Jakarta Selatan — Tips Before Booking 2026', tags: ['Survey','Harga','Event Space','Jakarta Selatan','Booking Tips'] },
  ];

  for (const a of articles) {
    try {
      const url = await pickPhotoFor(a.slug, a.title, a.tags);
      const out = path.join(THUMBS, `${a.slug}.jpg`);
      await makeThumb(url, out);
      const stat = fs.statSync(out);
      console.log('OK', a.slug, stat.size, 'src=', url);
    } catch (e) {
      console.warn('FAIL', a.slug, e.message);
      try {
        const fallback = path.join(THUMBS, 'event-space-jakarta-selatan.jpg');
        const out = path.join(THUMBS, `${a.slug}.jpg`);
        if (fs.existsSync(fallback)) fs.copyFileSync(fallback, out);
        console.log('FALLBACK', a.slug, '-> event-space-jakarta-selatan.jpg');
      } catch (e2) {
        console.warn('FALLBACK_FAIL', a.slug, e2.message);
      }
    }
  }
})();
