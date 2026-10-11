/* Hero assembling-logo configuration.
   Tune the mark placement and the six label slots by eye here; the stage is
   a 1000 by 620 coordinate space and the logo canvas is 656 by 684.
   Facet copy, slot assignment and the assembly order live here too, so the
   HeroMark component stays a pure renderer. Piece pixels (x, y, w, h, ax,
   ay, poly) are NOT duplicated here; they come from
   src/assets/brand/karamba-pieces/manifest.json at build time. */

export interface HeroSlot {
  id: number;
  /** Dot position in stage coordinates. */
  x: number;
  y: number;
  /** L labels sit left of their dot (right-aligned), R labels right of it. */
  side: 'L' | 'R';
}

export interface HeroFacet {
  key: string;
  name: string;
  description: string;
  slot: number;
}

export interface HeroLayout {
  stage: { width: number; height: number };
  /** Logo placement inside the stage: left/top/width in stage units. */
  mark: { left: number; top: number; width: number };
  canvas: { width: number; height: number };
  slots: HeroSlot[];
}

export const HERO_LAYOUT: HeroLayout = {
  stage: { width: 1000, height: 620 },
  mark: { left: 330, top: 105, width: 340 },
  canvas: { width: 656, height: 684 },
  slots: [
    { id: 1, x: 300, y: 190, side: 'L' },
    { id: 2, x: 300, y: 310, side: 'L' },
    { id: 3, x: 300, y: 430, side: 'L' },
    { id: 4, x: 700, y: 80, side: 'R' },
    { id: 5, x: 700, y: 290, side: 'R' },
    { id: 6, x: 700, y: 450, side: 'R' },
  ],
};

export const HERO_FACETS: HeroFacet[] = [
  { key: 'next', name: 'Next', description: 'Tell us what to build next.', slot: 1 },
  { key: 'arrow', name: 'Technology', description: 'Digital systems built to move you forward.', slot: 4 },
  { key: 'education', name: 'Education', description: 'Admissions, records and results without the paperwork.', slot: 1 },
  { key: 'core', name: 'Software', description: 'Custom systems built around how you work.', slot: 5 },
  { key: 'commerce', name: 'Commerce', description: 'Orders, stock and customers in one place.', slot: 2 },
  { key: 'cloud', name: 'Cloud', description: 'Secure, reliable and ready to scale.', slot: 5 },
  { key: 'logistics', name: 'Logistics', description: 'Connecting operations with precision.', slot: 3 },
  { key: 'automation', name: 'Automation', description: 'Smarter workflows, less friction.', slot: 3 },
  { key: 'intelligence', name: 'Intelligence', description: 'AI that takes on the repetitive work.', slot: 6 },
];

/* Assembly order: core lands first, arrow lands last. */
export const HERO_ASSEMBLY_ORDER: string[] = [
  'core',
  'commerce',
  'education',
  'next',
  'logistics',
  'cloud',
  'automation',
  'intelligence',
  'arrow',
];

/* Reduced-motion visitors get no flying pieces and no rotation: these three
   (distinct slots) are shown fixed, and tapping a piece swaps them. */
export const HERO_FIXED_FACETS: string[] = ['next', 'core', 'arrow'];
