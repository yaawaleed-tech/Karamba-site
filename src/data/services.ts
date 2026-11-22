/* Service page data. Single source for the five service pages and the
   services hub, in the same order as the services menu in nav.ts.
   Sections with no data are not rendered; the owner edits this file.
   Only confirmed facts live here: titles, outcomes and lists come from
   the home page cards or the nav, everything else stays empty. */

import type { FacetKey } from './nav';

export type ServiceTone = 'mist' | 'indigo' | 'paper';

export interface ServiceClosing {
  strong: string;
  soft: string;
  line: string;
  /** Omitted entries fall back to the site quote button label. */
  button?: string;
  tone: ServiceTone;
}

export interface ServiceEntry {
  slug: string;
  name: string;
  strong: string;
  soft: string;
  facet: FacetKey;
  scene: string;
  outcome: string;
  included: string[];
  audience: string[];
  closing: ServiceClosing;
  metaDescription: string;
}

export const SERVICES: ServiceEntry[] = [
  {
    slug: 'custom-software',
    name: 'Custom software',
    strong: 'Custom',
    soft: 'software',
    facet: 'core',
    scene: '',
    outcome: 'Web and mobile applications built around how your business actually runs.',
    included: ['Web applications', 'Mobile applications'],
    audience: [],
    closing: {
      strong: 'What should we',
      soft: 'build for you?',
      line: 'Describe the system or app you need. We will tell you what it takes.',
      button: 'Get a quote',
      tone: 'mist',
    },
    metaDescription:
      'Web and mobile applications built around how your business actually runs.',
  },
  {
    slug: 'management-systems',
    name: 'Management systems',
    strong: 'Management',
    soft: 'systems',
    facet: 'education',
    scene: 'management-systems.svg',
    outcome:
      'Custom management systems for shops, schools, funds and any organisation that wants to automate its work.',
    included: [],
    audience: ['Shops', 'Schools', 'Funds', 'Any organisation that wants to automate its work'],
    closing: {
      strong: 'What should your',
      soft: 'system manage?',
      line: 'Tell us how your shop, school or organisation runs today. We will design a system around it.',
      tone: 'indigo',
    },
    metaDescription:
      'Custom management systems for shops, schools, funds and any organisation that wants to automate its work.',
  },
  {
    slug: 'websites-and-branding',
    name: 'Websites and branding',
    strong: 'Websites',
    soft: 'and branding',
    facet: 'commerce',
    scene: 'websites-and-branding.svg',
    outcome: 'A site and identity that make people trust you before you say a word.',
    included: ['Websites', 'Branding'],
    audience: [],
    closing: {
      strong: 'Ready for a website',
      soft: 'that works for you?',
      line: 'Tell us about your business. We will quote the website it needs.',
      tone: 'paper',
    },
    metaDescription:
      'A site and identity that make people trust you before you say a word.',
  },
  {
    slug: 'automation-and-ai',
    name: 'Automation and AI',
    strong: 'Automation',
    soft: 'and AI',
    facet: 'intelligence',
    scene: 'automation-and-ai.svg',
    outcome: 'Workflows, reports and assistants that take repetitive work off your team.',
    included: [],
    audience: [],
    closing: {
      strong: 'What should run',
      soft: 'by itself?',
      line: 'Describe the task your team repeats. We will tell you whether it can be automated.',
      tone: 'mist',
    },
    metaDescription: 'Workflows, reports and assistants that take repetitive work off your team.',
  },
  {
    slug: 'cloud-and-support',
    name: 'Cloud and support',
    strong: 'Cloud',
    soft: 'and support',
    facet: 'cloud',
    scene: 'cloud-and-support.svg',
    outcome:
      'Hosting, monitoring, security updates and ongoing support, so your systems stay fast and available.',
    included: [],
    audience: [],
    closing: {
      strong: 'Need your systems',
      soft: 'looked after?',
      line: 'Tell us what you run today. We will quote hosting and support for it.',
      tone: 'indigo',
    },
    metaDescription:
      'Hosting, monitoring, security updates and ongoing support, so your systems stay fast and available.',
  },
];

export function serviceBySlug(slug: string): ServiceEntry {
  const entry = SERVICES.find((s) => s.slug === slug);
  if (!entry) throw new Error(`Unknown service slug: ${slug}`);
  return entry;
}

/* The three promises shown on every service page. */
export interface PromiseItem {
  title: string;
  text: string;
}

export const PROMISES: PromiseItem[] = [
  {
    title: 'A quote for your project',
    text: 'There is no price list. Every project is quoted from what you need.',
  },
  {
    title: 'Support after launch',
    text: 'Support is available. Its terms are agreed with you for each project.',
  },
  {
    title: 'Ownership agreed with you',
    text: 'Who owns the code is discussed and agreed with you.',
  },
];

/* Questions and answers shared by every service page. */
export interface FaqItem {
  q: string;
  a: string;
}

export const COMMON_FAQ: FaqItem[] = [
  {
    q: 'How much does it cost?',
    a: 'There is no price list. Every project is quoted based on what you need and the services involved. Tell us what you want and we reply with a quote.',
  },
  {
    q: 'Who owns the code and the data?',
    a: 'That depends on what you need, and it is discussed and agreed with you before work is finalised.',
  },
  {
    q: 'Is support included after launch?',
    a: 'Support after launch is available. Its terms depend on the agreement we make for your project.',
  },
];

export const MOBILE_APPS_FAQ: FaqItem = {
  q: 'Do you build mobile apps?',
  a: 'Yes. We build mobile applications as well as web applications.',
};
