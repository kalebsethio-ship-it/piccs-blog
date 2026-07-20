import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC = path.join(process.cwd(), 'public');
const THUMBS = path.join(PUBLIC, 'static', 'thumbs');
fs.mkdirSync(THUMBS, { recursive: true });

const tasks = [
  {
    slug: 'daftar-harga-sewa-event-space-piccs-2026',
    url: 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/2025/_MG_9258.JPG',
  },
  {
    slug: 'event-space-fasilitas-lengkap-jakarta-selatan',
    url: 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/2025/_MG_8654.JPG',
  },
  {
    slug: 'event-space-jakarta-selatan',
    url: 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/2025/_MG_8590.JPG',
  },
  {
    slug: 'meeting-room-tebet',
    url: 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/2025/_MG_9237.JPG',
  },
  {
    slug: 'budget-friendly-venue-jakarta',
    url: 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/2025/_MG_8575.JPG',
  },
  {
    slug: 'ide-gathering-seru-jakarta',
    url: 'https://photos.piccreativespace.id/DEKOR%20WEDDING%202025/_MG_1074.JPG',
  },
];

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function makeThumb(sourceUrl, outPath) {
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
}

(async () => {
  for (const t of tasks) {
    const out = path.join(THUMBS, `${t.slug}.jpg`);
    await makeThumb(t.url, out);
    console.log('OK', t.slug, fs.statSync(out).size);
  }
})();
