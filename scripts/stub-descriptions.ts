import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOTS = [
  path.resolve(__dirname, '../docs'),
  path.resolve(__dirname, '../blog'),
];

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_')) continue;
    if (entry.name === 'plans') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) out.push(full);
  }
  return out;
}

function stub(file: string): boolean {
  const raw = fs.readFileSync(file, 'utf8');
  const parsed = matter(raw);
  if (parsed.data.description) return false;

  const h1Match = parsed.content.match(/^#\s+(.+)$/m);
  const titleSource =
    (typeof parsed.data.title === 'string' && parsed.data.title.trim()) ||
    (h1Match && h1Match[1].trim()) ||
    path.basename(file, path.extname(file));
  const stubText = `${titleSource} - Silhouette Exchange documentation.`;

  parsed.data.description = stubText;
  fs.writeFileSync(file, matter.stringify(parsed.content, parsed.data), 'utf8');
  return true;
}

let total = 0;
let changed = 0;
for (const root of ROOTS) {
  const files = walk(root);
  total += files.length;
  for (const f of files) if (stub(f)) changed++;
}
console.log(`Stubbed ${changed} of ${total} files`);
