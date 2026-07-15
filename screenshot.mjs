import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'temporary screenshots');

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const width = Number(process.argv[4]) || 1440;
const height = Number(process.argv[5]) || 900;
const fullPage = process.argv[6] !== 'false';

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const existing = fs.readdirSync(OUT_DIR)
  .map((f) => {
    const m = f.match(/^screenshot-(\d+)/);
    return m ? Number(m[1]) : 0;
  });
const next = existing.length ? Math.max(...existing) + 1 : 1;
const fileName = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const filePath = path.join(OUT_DIR, fileName);

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width, height });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: filePath, fullPage });
await browser.close();

console.log(`Saved: ${filePath}`);
