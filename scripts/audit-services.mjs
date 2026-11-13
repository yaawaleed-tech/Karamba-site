import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../dist/services/', import.meta.url);
const pages = ['websites-and-branding', 'custom-software', 'management-systems', 'automation-and-ai', 'cloud-and-support'];
const allowedDark = new Set(['websites-and-branding', 'cloud-and-support']);
const allowedRepeat = new Set(['questions', 'related', 'closing', 'hero']);
const failures = [];
const allPatterns = new Map();

for (const slug of pages) {
  const html = readFileSync(new URL(`${slug}/index.html`, root), 'utf8');
  const sections = [...html.matchAll(/<section\b([^>]*)>/g)].map((m) => m[1]);
  const content = sections.filter((attrs) => !attrs.includes('questions-section') && !attrs.includes('related-section'));
  const expected = slug === 'websites-and-branding' ? 7 : 6;
  if (content.length < expected) failures.push(`${slug}: expected ${expected} content sections, found ${content.length}`);
  const patterns = sections.map((attrs) => attrs.match(/data-pattern="([^"]+)"/)?.[1]).filter(Boolean);
  for (const pattern of patterns) {
    if (allowedRepeat.has(pattern)) continue;
    if (allPatterns.has(pattern) && allPatterns.get(pattern) !== slug) failures.push(`pattern repeats across pages: ${pattern}`);
    allPatterns.set(pattern, slug);
  }
  if ((html.match(/full-bleed-indigo/g) || []).length > 1) failures.push(`${slug}: more than one indigo section`);
  if (!allowedDark.has(slug) && html.includes('full-bleed-indigo')) failures.push(`${slug}: indigo section is not allowed`);
  for (const text of ['What you can expect', 'How a project runs', 'What we cover']) if (html.includes(text)) failures.push(`${slug}: forbidden string ${text}`);
  if ((html.match(/data-slot="/g) || []).length < 3) failures.push(`${slug}: fewer than three image slots`);
  if (!html.includes('"@type":"BreadcrumbList"') && !html.includes('"@type": "BreadcrumbList"')) failures.push(`${slug}: missing BreadcrumbList`);
  if (!html.includes('"@type":"FAQPage"') && !html.includes('"@type": "FAQPage"')) failures.push(`${slug}: missing FAQPage`);
  if (/<(?:p|h[1-6]|li|span|a|b)[^>]*>[^<]*\b(?:I|I'm|my)\b/.test(html)) failures.push(`${slug}: first-person singular visible text`);
  if (html.includes('—')) failures.push(`${slug}: em dash`);
  const animated = (html.match(/\b(?:rv|rv-s|rv-line|rv-scene|experience-section|visual)\b/g) || []).length;
  if (animated >= 70) failures.push(`${slug}: animated element count ${animated} is >= 70`);
}

if (failures.length) {
  console.error('Services audit failed:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log(`Services audit passed: ${pages.length} pages, unique patterns ${allPatterns.size}, image slots >= 3 each.`);
