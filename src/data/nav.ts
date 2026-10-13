/* Site navigation data. Single source for the header menus, the phone
   menu, the footer Explore column and the placeholder pages, so labels
   and links only ever change here. Facet keys match the nine logo pieces
   in src/assets/brand/karamba-pieces/manifest.json. */

export type FacetKey =
  | 'next'
  | 'arrow'
  | 'education'
  | 'core'
  | 'commerce'
  | 'cloud'
  | 'logistics'
  | 'automation'
  | 'intelligence';

export interface NavItem {
  name: string;
  description: string;
  href: string;
  status?: string;
  facet: FacetKey;
}

export interface NavMenu {
  key: string;
  label: string;
  hubHref: string;
  introText: string;
  introButtonText: string;
  items: NavItem[];
}

export const NAV_MENUS: NavMenu[] = [
  {
    key: 'services',
    label: 'Services',
    hubHref: '/services',
    introText: 'Software, automation and digital tools, built around how you work.',
    introButtonText: 'View all services',
    items: [
      {
        name: 'Custom software',
        description: 'Systems built around how you work',
        href: '/services/custom-software',
        facet: 'core',
      },
      {
        name: 'Management systems',
        description: 'Records, admissions, results and orders',
        href: '/services/management-systems',
        facet: 'education',
      },
      {
        name: 'Websites and branding',
        description: 'A site people trust at first glance',
        href: '/services/websites-and-branding',
        facet: 'commerce',
      },
      {
        name: 'Automation and AI',
        description: 'Take repetitive work off your team',
        href: '/services/automation-and-ai',
        facet: 'intelligence',
      },
      {
        name: 'Cloud and support',
        description: 'Secure, reliable and looked after',
        href: '/services/cloud-and-support',
        facet: 'cloud',
      },
    ],
  },
  {
    key: 'products',
    label: 'Products',
    hubHref: '/products',
    introText: 'What we are building, with honest status on each.',
    introButtonText: 'View all products',
    items: [
      {
        name: 'Broiler farm system',
        description: 'Flock counts and break-even prices',
        href: '/products/broiler-farm-system',
        status: 'In development',
        facet: 'automation',
      },
    ],
  },
  {
    key: 'work',
    label: 'Work',
    hubHref: '/work',
    introText: 'What we have built, and how.',
    introButtonText: 'View all work',
    items: [
      {
        name: 'Bluelite Poultry',
        description: 'A QR batch story page for every pack',
        href: '/work/bluelite-poultry',
        status: 'Case study',
        facet: 'arrow',
      },
    ],
  },
  {
    key: 'company',
    label: 'Company',
    hubHref: '/company',
    introText: 'A software engineer and a team, building from Kano.',
    introButtonText: 'About Karamba',
    items: [
      {
        name: 'Our story',
        description: 'Who we are and why we build',
        href: '/company',
        facet: 'core',
      },
      {
        name: 'How we work',
        description: 'Discovery, design, build and support',
        href: '/company#how-we-work',
        facet: 'automation',
      },
      {
        name: 'Join us',
        description: 'For developers and designers',
        href: '/join',
        status: 'Open',
        facet: 'next',
      },
    ],
  },
];

export const PRIMARY_ACTION = { label: 'Get a quote', href: '/quote' };

/* Footer Explore column: the four hubs plus Join us. */
export const FOOTER_EXPLORE: { label: string; href: string }[] = [
  ...NAV_MENUS.map((menu) => ({ label: menu.label, href: menu.hubHref })),
  { label: 'Join us', href: '/join' },
];

/** The menu a path belongs to, for aria-current. Matches hub and children. */
export function menuForPath(pathname: string): NavMenu | undefined {
  return NAV_MENUS.find(
    (menu) =>
      pathname === menu.hubHref ||
      pathname.startsWith(menu.hubHref + '/') ||
      menu.items.some((item) => item.href.split('#')[0] === pathname),
  );
}
