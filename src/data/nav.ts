// Single source of truth for top-bar navigation + footer link groups.
// Every entry below must point to a real route under src/pages.

export interface NavLink {
  href: string;
  label: string;
  desc?: string;
  key: string;
}

export interface NavGroup {
  label: string;
  key: string;
  // The "active" key on the page maps to this group when present
  matches?: string[];
  // First column inside the dropdown
  primary?: NavLink[];
  // Optional second column inside the dropdown
  secondary?: NavLink[];
  // If set, treat the group as a direct link instead of a dropdown
  href?: string;
  // The big italic phrase shown in the dropdown footer
  tagline?: string;
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Start',
    key: 'start',
    href: '/start',
    matches: ['start', 'home'],
  },
  {
    label: 'Protocol',
    key: 'protocol',
    matches: ['about', 'genesis', 'spec', 'tokenomics', 'security'],
    primary: [
      { key: 'about',      href: '/about',      label: 'About',     desc: 'What Adamant is, in plain language.' },
      { key: 'genesis',    href: '/genesis',    label: 'Genesis',   desc: 'How ADM enters circulation. 100M pool, 70/30 split.' },
      { key: 'tokenomics', href: '/tokenomics', label: 'Tokenomics',desc: 'Issuance, burn, fees, post-genesis schedule.' },
    ],
    secondary: [
      { key: 'spec',     href: '/spec',     label: 'Spec',     desc: 'Whitepaper, ADIPs, test vectors.' },
      { key: 'security', href: '/security', label: 'Security', desc: 'Primitives, threat model, audits.' },
      { key: 'faq',      href: '/faq',      label: 'FAQ',      desc: 'Questions that come up first.' },
    ],
    tagline: 'A protocol is the team.',
  },
  {
    label: 'Network',
    key: 'network',
    matches: ['network', 'status', 'operator', 'roadmap'],
    primary: [
      { key: 'network',  href: '/network',  label: 'Explorer', desc: 'Blocks, mempool, validators, burns.' },
      { key: 'status',   href: '/status',   label: 'Status',   desc: 'Live phase, halts, security tier.' },
      { key: 'roadmap',  href: '/roadmap',  label: 'Roadmap',  desc: 'Milestones, code-gated.' },
    ],
    secondary: [
      { key: 'operator', href: '/operator', label: 'Operator', desc: 'Validator, watcher, prover, service node.' },
    ],
    tagline: 'A chain that asks who shows up.',
  },
  {
    label: 'Build',
    key: 'build',
    matches: ['developers', 'integrations', 'grants'],
    primary: [
      { key: 'developers',   href: '/developers',   label: 'Developers',   desc: 'JSON-RPC, SDKs, Adamant Move, burn-tx.' },
      { key: 'integrations', href: '/integrations', label: 'Integrations', desc: 'Wallets, custody, indexers, oracles.' },
      { key: 'grants',       href: '/grants',       label: 'Grants',       desc: 'Public funding for reference work.' },
    ],
    secondary: [
      { key: 'docs', href: '/docs', label: 'Docs', desc: 'How-tos, conventions, code reference.' },
    ],
    tagline: 'No platform owner. Public-source from commit zero.',
  },
  {
    label: 'Use',
    key: 'use',
    matches: ['wallet', 'ecosystem', 'community'],
    primary: [
      { key: 'wallet',    href: '/wallet',    label: 'Wallet',    desc: 'Self-custody, shielded by default.' },
      { key: 'ecosystem', href: '/ecosystem', label: 'Ecosystem', desc: 'Reference apps + third-party builds.' },
    ],
    secondary: [
      { key: 'community', href: '/community', label: 'Community', desc: 'Where contributors gather.' },
    ],
    tagline: 'You hold the keys. No one else can.',
  },
  {
    label: 'Read',
    key: 'read',
    matches: ['updates', 'press', 'archive', 'glossary', 'legal', 'license'],
    primary: [
      { key: 'updates',  href: '/updates',  label: 'Updates',  desc: 'Project journal, in order.' },
      { key: 'glossary', href: '/glossary', label: 'Glossary', desc: 'Every term, defined once.' },
      { key: 'press',    href: '/press',    label: 'Press',    desc: 'One-liners, brand, contact.' },
    ],
    secondary: [
      { key: 'archive', href: '/archive', label: 'Archive', desc: 'Historical decisions, reconstructed.' },
      { key: 'legal',   href: '/legal',   label: 'Legal',   desc: 'Disclosures, jurisdiction posture.' },
      { key: 'license', href: '/license', label: 'License', desc: 'Apache 2.0, everywhere.' },
    ],
    tagline: 'Decisions, in order. No revisionism.',
  },
];

// Resolve which top-level group is "active" for a given page key
export function activeGroupKey(pageKey: string): string | null {
  for (const g of NAV_GROUPS) {
    if (g.key === pageKey) return g.key;
    if (g.matches?.includes(pageKey)) return g.key;
  }
  return null;
}

// Flat list of footer columns. Each link is checked against the real pages list.
export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: 'Protocol',
    links: [
      { key: 'about',      href: '/about',      label: 'About' },
      { key: 'genesis',    href: '/genesis',    label: 'Genesis' },
      { key: 'tokenomics', href: '/tokenomics', label: 'Tokenomics' },
      { key: 'spec',       href: '/spec',       label: 'Spec' },
      { key: 'security',   href: '/security',   label: 'Security' },
      { key: 'roadmap',    href: '/roadmap',    label: 'Roadmap' },
    ],
  },
  {
    title: 'Network',
    links: [
      { key: 'network',  href: '/network',           label: 'Explorer' },
      { key: 'blocks',   href: '/network/blocks',    label: 'Blocks' },
      { key: 'mempool',  href: '/network/mempool',   label: 'Mempool' },
      { key: 'validators', href: '/network/validators', label: 'Validators' },
      { key: 'burns',    href: '/network/burns',     label: 'Burns' },
      { key: 'status',   href: '/status',            label: 'Status' },
    ],
  },
  {
    title: 'Build',
    links: [
      { key: 'developers',   href: '/developers',   label: 'Developers' },
      { key: 'docs',         href: '/docs',         label: 'Docs' },
      { key: 'integrations', href: '/integrations', label: 'Integrations' },
      { key: 'grants',       href: '/grants',       label: 'Grants' },
      { key: 'operator',     href: '/operator',     label: 'Run a node' },
    ],
  },
  {
    title: 'Use',
    links: [
      { key: 'start',     href: '/start',     label: 'Start' },
      { key: 'wallet',    href: '/wallet',    label: 'Wallet' },
      { key: 'ecosystem', href: '/ecosystem', label: 'Ecosystem' },
      { key: 'community', href: '/community', label: 'Community' },
      { key: 'faq',       href: '/faq',       label: 'FAQ' },
      { key: 'glossary',  href: '/glossary',  label: 'Glossary' },
    ],
  },
  {
    title: 'Org',
    links: [
      { key: 'updates', href: '/updates', label: 'Updates' },
      { key: 'press',   href: '/press',   label: 'Press' },
      { key: 'archive', href: '/archive', label: 'Archive' },
      { key: 'legal',   href: '/legal',   label: 'Legal' },
      { key: 'license', href: '/license', label: 'License' },
    ],
  },
];

export const FOOTER_REPOS: NavLink[] = [
  { key: 'core',    href: 'https://github.com/adamant-protocol/adamant',              label: 'adamant (core)' },
  { key: 'spec',    href: 'https://github.com/adamant-protocol/adamant-spec',          label: 'adamant-spec' },
  { key: 'sdk-rs',  href: 'https://github.com/adamant-protocol/adamant-sdk-rust',      label: 'sdk-rust' },
  { key: 'sdk-js',  href: 'https://github.com/adamant-protocol/adamant-sdk-js',        label: 'sdk-js' },
  { key: 'wallet',  href: 'https://github.com/adamant-protocol/adamant-wallet',        label: 'wallet' },
  { key: 'explorer',href: 'https://github.com/adamant-protocol/adamant-explorer',      label: 'explorer' },
  { key: 'all',     href: 'https://github.com/adamant-protocol',                       label: 'all repos ↗' },
];
