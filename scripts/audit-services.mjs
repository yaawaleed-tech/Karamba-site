import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// A slug is added here when its page is migrated to a standalone component.
// Migrated pages follow the standalone rules below, other pages keep the old rules.
const MIGRATED = new Set(['custom-software', 'management-systems']);

const EXPECTATIONS = {
  'management-systems': {
    faq: true,
    ids: ['ms-industries', 'ms-parts', 'ms-shape', 'ms-proof', 'ms-answers', 'ms-closing', 'ms-explore'],
  },
  'custom-software': {
    faq: false,
    ids: ['cs-process', 'cs-architecture', 'cs-use-cases', 'cs-handover', 'cs-closing', 'cs-explore'],
  },
};

const pages = ['websites-and-branding', 'custom-software', 'management-systems', 'automation-and-ai', 'cloud-and-support'];
const allowedDark = new Set(['websites-and-branding', 'cloud-and-support']);
const allowedRepeat = new Set(['questions', 'related', 'closing', 'hero']);
const forbidden = ['What you can expect', 'How a project runs', 'What we cover'];
const failures = [];
const allPatterns = new Map();

const distDir = process.env.AUDIT_DIST;
const root = distDir
  ? pathToFileURL(join(resolve(distDir), 'services') + '/')
  : new URL('../dist/services/', import.meta.url);

function short(value, max = 80) {
  const clean = String(value).replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max) + '...' : clean;
}

function visibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ');
}

function ldBlocks(html) {
  return [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((match) => {
    let data = null;
    let error = null;
    try {
      data = JSON.parse(match[1]);
    } catch (cause) {
      error = cause.message;
    }
    return { data, error, raw: match[1] };
  });
}

function auditStandalone(slug, html) {
  const fail = (rule, detail) => failures.push(`${slug}: ${rule}: ${detail}`);
  const expectation = EXPECTATIONS[slug];
  const name = slug.replace(/-/g, ' ').replace(/^./, (letter) => letter.toUpperCase());

  const h1 = (html.match(/<h1\b/gi) || []).length;
  if (h1 !== 1) fail('h1 rule', `expected exactly one h1, found ${h1}`);

  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  if (!title) fail('title rule', 'missing or empty title');
  const meta = html.match(/<meta\b[^>]*name=["']description["'][^>]*>/i)?.[0];
  const description = meta?.match(/content=["']([^"']*)["']/i)?.[1]?.trim();
  if (!description) fail('meta description rule', 'missing or empty description');
  else if (description.length > 170) fail('meta description rule', `description is ${description.length} characters, max 170`);

  const blocks = ldBlocks(html);
  for (const block of blocks) {
    if (block.error) fail('JSON-LD parse rule', `block does not parse (${short(block.error, 60)}): ${short(block.raw, 60)}`);
  }
  const crumbs = blocks.filter((block) => block.data && block.data['@type'] === 'BreadcrumbList');
  if (crumbs.length !== 1) {
    fail('BreadcrumbList rule', `expected exactly one block, found ${crumbs.length}`);
  } else {
    const items = crumbs[0].data.itemListElement;
    const names = ['Home', 'Services', name];
    if (!Array.isArray(items) || items.length !== 3) {
      fail('BreadcrumbList rule', `expected exactly three ListItems, found ${Array.isArray(items) ? items.length : 'none'}`);
    } else {
      for (let index = 0; index < 3; index++) {
        const item = items[index];
        if (!item || item.position !== index + 1 || item.name !== names[index] || !item.item) {
          fail('BreadcrumbList rule', `item ${index + 1} mismatch: ${short(JSON.stringify(item))}`);
        }
      }
    }
  }

  const faqs = blocks.filter((block) => block.data && block.data['@type'] === 'FAQPage');
  if (expectation.faq) {
    if (faqs.length !== 1) fail('FAQPage rule', `expected exactly one block, found ${faqs.length}`);
    for (const block of faqs) {
      const entries = block.data.mainEntity;
      if (!Array.isArray(entries) || entries.length < 3) {
        fail('FAQPage rule', `expected at least 3 Question entries, found ${Array.isArray(entries) ? entries.length : 'none'}: ${short(block.raw, 60)}`);
        continue;
      }
      const empty = entries.filter((entry) => !entry || entry['@type'] !== 'Question' || !entry.acceptedAnswer || !String(entry.acceptedAnswer.text || '').trim()).length;
      if (empty) fail('FAQPage rule', `${empty} Question entries have an empty acceptedAnswer: ${short(block.raw, 60)}`);
    }
  }

  const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]));
  const missing = expectation.ids.filter((id) => !ids.has(id));
  if (missing.length) fail('ids rule', `missing ids: ${missing.join(', ')}`);

  if (html.includes('\u2014')) fail('em dash rule', 'em dash character found');
  for (const text of forbidden) if (html.includes(text)) fail('forbidden string rule', short(text));

  const text = visibleText(html);
  if (text.includes('Placeholder:')) fail('Placeholder rule', 'visible text contains Placeholder:');
  const firstPersonPattern = /\b(?:I|I'm|my)\b/g;
  let hit;
  while ((hit = firstPersonPattern.exec(text))) {
    const context = text.slice(Math.max(0, hit.index - 40), hit.index + hit[0].length + 40);
    fail('first person singular rule', `visible text "${hit[0]}" with context "${short(context, 120)}"`);
  }

  for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attrs = match[1];
    const snippet = `<img ${short(attrs, 60)}`;
    const altToken = attrs.match(/(?:^|\s)alt(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>=]+)))?/i);
    if (!altToken) {
      fail('img rule', `missing alt attribute: ${snippet}`);
      continue;
    }
    const alt = (altToken[1] ?? altToken[2] ?? altToken[3] ?? '').trim();
    const hidden = /(?:^|\s)aria-hidden\s*=\s*["']true["']/i.test(attrs);
    if (alt && !hidden) {
      const hasWidth = /(?:^|\s)width\s*=/i.test(attrs);
      const hasHeight = /(?:^|\s)height\s*=/i.test(attrs);
      if (!hasWidth || !hasHeight) fail('img rule', `content image missing width or height: ${snippet}`);
    }
  }

  if (!/\bdata-quote\b/.test(html)) fail('data-quote rule', 'no element with data-quote attribute');
}

for (const slug of pages) {
  const html = readFileSync(new URL(`${slug}/index.html`, root), 'utf8');
  if (MIGRATED.has(slug)) {
    auditStandalone(slug, html);
    continue;
  }
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
  if (html.includes('\u2014')) failures.push(`${slug}: em dash`);
  const animated = (html.match(/\b(?:rv|rv-s|rv-line|rv-scene|experience-section|visual)\b/g) || []).length;
  if (animated >= 70) failures.push(`${slug}: animated element count ${animated} is >= 70`);
}

if (failures.length) {
  const counts = new Map();
  for (const failure of failures) counts.set(failure, (counts.get(failure) || 0) + 1);
  const collapsed = [...counts].map(([text, count]) => count > 1 ? `${text} (x${count})` : text);
  console.error('Services audit failed:\n- ' + collapsed.join('\n- '));
  process.exit(1);
}
console.log(`Services audit passed: ${pages.length} pages, unique patterns ${allPatterns.size}, image slots >= 3 each (standalone: ${[...MIGRATED].join(', ')})`);
