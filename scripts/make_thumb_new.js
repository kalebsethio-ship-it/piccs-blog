import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC = path.join(process.cwd(), 'public');
const THUMBS = path.join(PUBLIC, 'static', 'thumbs');
fs.mkdirSync(THUMBS, { recursive: true });

const slug = 'cooking-class-workshop-hands-on-50-100-pax-jakarta';
const sourceUrl = 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/_MG_0561.JPG';
const outPath = path.join(THUMBS, `${slug}.jpg`);

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function makeThumb(srcBuffer, out) {
  const svg = Buffer.from(
    `<svg width="1200" height="630">
      <rect width="1200" height="630" fill="rgba(0,0,0,0)"/>
    </svg>`
  );
  await sharp(srcBuffer)
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: 'entropy' })
    .composite([{ input: svg, top: 0, left: 0 }])
    .jpeg({ quality: 88 })
    .toFile(out);
}

(async () => {
  try {
    const buf = await fetchBuffer(sourceUrl);
    await makeThumb(buf, outPath);
    const stat = fs.statSync(outPath);
    console.log('OK', slug, stat.size, 'src=', sourceUrl);
  } catch (e) {
    console.warn('FAIL', slug, e.message);
  }
})();
