import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC = path.join(process.cwd(), 'public');
const THUMBS = path.join(PUBLIC, 'thumbs');
fs.mkdirSync(THUMBS, { recursive: true });

const tasks = [
  {
    slug: 'daftar-harga-sewa-event-space-piccs-2026',
    url: 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/2025/_MG_9258.JPG',
    title: 'Daftar Harga Sewa Event Space PIC Creative Space Jakarta 2026',
  },
  {
    slug: 'event-space-fasilitas-lengkap-jakarta-selatan',
    url: 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/2025/_MG_8654.JPG',
    title: 'Event Space Fasilitas Terlengkap di Jakarta Selatan',
  },
  {
    slug: 'event-space-jakarta-selatan',
    url: 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/2025/_MG_8590.JPG',
    title: 'Event Space Jakarta Selatan: Panduan Lengkap Memilih Venue',
  },
  {
    slug: 'meeting-room-tebet',
    url: 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/2025/_MG_9237.JPG',
    title: 'Meeting Room di Tebet untuk Rapat Kantor & Diskusi Tim',
  },
  {
    slug: 'budget-friendly-venue-jakarta',
    url: 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/2025/_MG_8575.JPG',
    title: 'Budget Friendly Event Venue di Jakarta: Tips Sewa Tanpa Bikin Kantong Bolong',
  },
  {
    slug: 'ide-gathering-seru-jakarta',
    url: 'https://photos.piccreativespace.id/DEKOR%20WEDDING%202025/_MG_1074.JPG',
    title: '5 Ide Gathering Seru di Jakarta — Dari Workshop Sampe Nobar',
  },
];

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function makeThumb(sourceUrl, outPath, title) {
  const src = await fetchBuffer(sourceUrl);
  const maxChars = 36;
  const lines = [];
  const words = title.split(' ');
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars && line) {
      lines.push(line.trim()); line = w;
    } else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  const display = lines.slice(0, 3).join('\n');

  const svg = Buffer.from(
    `<svg width="1200" height="630">
      <rect width="1200" height="630" fill="rgba(0,0,0,0.45)"/>
      <text x="50%" y="50%" font-family="DejaVu Sans, Arial, sans-serif" font-size="52" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${display.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '</text><text x="50%" y="50%" font-family="DejaVu Sans, Arial, sans-serif" font-size="52" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">')}</text>
      <rect x="40" y="40" width="1120" height="2" fill="#ccff00" opacity="0.95"/>
    </svg>`
  );

  await sharp(src)
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: 'entropy' })
    .composite([{ input: svg, top: 0, left: 0 }])
    .jpeg({ quality: 85 })
    .toFile(outPath);
}

(async () => {
  for (const t of tasks) {
    const out = path.join(THUMBS, `${t.slug}.jpg`);
    await makeThumb(t.url, out, t.title);
    console.log('OK', t.slug, fs.statSync(out).size);
  }
})();
