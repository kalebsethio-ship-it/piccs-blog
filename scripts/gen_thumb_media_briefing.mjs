const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC = path.join(process.cwd(), 'public');
const THUMBS = path.join(PUBLIC, 'static', 'thumbs');
fs.mkdirSync(THUMBS, { recursive: true });

const slug = 'media-briefing-press-conference-jakarta';
const sourceUrl = 'https://photos.piccreativespace.id/PHOTO%20SETTINGAN%20RUANGAN/_MG_9162.JPG';
const outPath = path.join(THUMBS, `${slug}.jpg`);

async function fetchBuffer(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`Failed ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function makeThumb(srcBuffer, out) {
  const svg = Buffer.from(
    '<svg width="1200" height="630">\n' +
    '  <rect width="1200" height="630" fill="rgba(0,0,0,0)"/>\n' +
    '</svg>'
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
    console.log('OK', slug, stat.size, 'bytes  src=', sourceUrl);
  } catch (e) {
    console.warn('FAIL', slug, e.message);
  }
})();
