// Adamant chain state — pre-launch phase data.
// Mirrors the design package's data.js but trimmed to what server-rendered Astro needs.

export interface PhaseState {
  key: string;
  label: string;
  shortLabel: string;
  tagline: string;
  live: boolean;
  spec: boolean;
  halted?: boolean;
  blockHeight: number | null;
  activeValidators: number;
  activeMax: number;
  activeFloor: number;
  standbyQueue: number;
  securityTier: string;
  tps: number | null;
  finality: number | null;
  circulation: number;
  genesisPool: { total: number; burnRemaining: number; validatorRemaining: number };
  cohortFilled: number;
  validators: Array<{ order: number; addr: string; full: string }>;
}

export const PHASES: Record<string, PhaseState> = {
  prelaunch: {
    key: 'prelaunch',
    label: 'Specification phase',
    shortLabel: 'Pre-launch',
    tagline: 'Specification phase. Reference implementation in progress.',
    live: false, spec: true,
    blockHeight: null,
    activeValidators: 0, activeMax: 75, activeFloor: 7, standbyQueue: 0,
    securityTier: '—',
    tps: null, finality: null, circulation: 0,
    genesisPool: { total: 100_000_000, burnRemaining: 70_000_000, validatorRemaining: 30_000_000 },
    cohortFilled: 0, validators: [],
  },
  'testnet-early': {
    key: 'testnet-early',
    label: 'Testnet · early',
    shortLabel: 'Testnet (early)',
    tagline: 'Public testnet, week 3. Cohort forming.',
    live: true, spec: false,
    blockHeight: 184_217,
    activeValidators: 12, activeMax: 75, activeFloor: 7, standbyQueue: 2,
    securityTier: 'I',
    tps: 1_842, finality: 612, circulation: 1_204_318,
    genesisPool: { total: 100_000_000, burnRemaining: 64_211_000, validatorRemaining: 28_840_000 },
    cohortFilled: 12, validators: [],
  },
  'testnet-mature': {
    key: 'testnet-mature',
    label: 'Testnet · mature',
    shortLabel: 'Testnet (mature)',
    tagline: 'Operational. Cohort filling.',
    live: true, spec: false,
    blockHeight: 1_247_832,
    activeValidators: 42, activeMax: 75, activeFloor: 7, standbyQueue: 8,
    securityTier: 'II',
    tps: 14_283, finality: 487, circulation: 8_403_219,
    genesisPool: { total: 100_000_000, burnRemaining: 31_847_000, validatorRemaining: 14_222_000 },
    cohortFilled: 42, validators: [],
  },
  mainnet: {
    key: 'mainnet',
    label: 'Mainnet · live',
    shortLabel: 'Mainnet',
    tagline: 'Live mainnet. Cohort closed.',
    live: true, spec: false,
    blockHeight: 4_829_117,
    activeValidators: 75, activeMax: 75, activeFloor: 7, standbyQueue: 23,
    securityTier: 'III',
    tps: 38_204, finality: 412, circulation: 21_847_000,
    genesisPool: { total: 100_000_000, burnRemaining: 18_204_000, validatorRemaining: 9_417_000 },
    cohortFilled: 75, validators: [],
  },
  halted: {
    key: 'halted',
    label: 'Below floor — halted',
    shortLabel: 'Halted',
    tagline: 'Active set below 7. Normal operation suspended.',
    live: false, spec: false, halted: true,
    blockHeight: 1_247_832,
    activeValidators: 5, activeMax: 75, activeFloor: 7, standbyQueue: 4,
    securityTier: '—',
    tps: 0, finality: null, circulation: 8_403_219,
    genesisPool: { total: 100_000_000, burnRemaining: 31_847_000, validatorRemaining: 14_222_000 },
    cohortFilled: 42, validators: [],
  },
};

export const PHASE_OPTIONS = [
  { key: 'prelaunch',      label: 'Pre-launch',          desc: 'specification phase' },
  { key: 'testnet-early',  label: 'Testnet · early',     desc: 'cohort forming' },
  { key: 'testnet-mature', label: 'Testnet · mature',    desc: 'operational' },
  { key: 'mainnet',        label: 'Mainnet · live',      desc: 'cohort closed' },
  { key: 'halted',         label: 'Below floor · halt',  desc: 'safety preserved' },
];

export const PHASE: PhaseState = PHASES.prelaunch;

export const PAGES = [
  { k: 'home',     href: '/',         label: 'Home' },
  { k: 'about',    href: '/about',    label: 'About' },
  { k: 'genesis',  href: '/genesis',  label: 'Genesis' },
  { k: 'network',  href: '/network',  label: 'Network' },
  { k: 'wallet',   href: '/wallet',   label: 'Wallet' },
  { k: 'operator', href: '/operator', label: 'Operator' },
  { k: 'spec',     href: '/spec',     label: 'Spec' },
  { k: 'updates',  href: '/updates',  label: 'Updates' },
] as const;

export const SEVEN_PROPERTIES = [
  { k: 'Privacy', note: 'Privacy by default', detail: 'Halo 2 zero-knowledge proofs. Selective disclosure via view keys.',
    gap: { btc: false, eth: false, monero: true, zec: true, mina: true, adm: true } },
  { k: 'Post-quantum', note: 'PQ secure', detail: 'ML-DSA + Ed25519 hybrid signatures. ML-KEM-768 key agreement.',
    gap: { btc: false, eth: false, monero: false, zec: false, mina: false, adm: true } },
  { k: 'Throughput', note: '≥50 000 TPS floor', detail: 'DAG-BFT consensus, Mysticeti-shaped.',
    gap: { btc: false, eth: false, monero: false, zec: false, mina: false, adm: true } },
  { k: 'Finality', note: 'Sub-second', detail: 'Average 412–487ms at security tier II–III.',
    gap: { btc: false, eth: false, monero: false, zec: false, mina: true, adm: true } },
  { k: 'Mempool integrity', note: 'Encrypted by default', detail: 'Threshold encryption + time-lock VDF, two regimes.',
    gap: { btc: false, eth: false, monero: false, zec: false, mina: false, adm: true } },
  { k: 'Verifiability', note: 'Phone-verifiable', detail: 'Recursive proofs allow client-side full verification.',
    gap: { btc: false, eth: false, monero: false, zec: false, mina: true, adm: true } },
  { k: 'Decentralisation', note: 'Residential-fibre', detail: 'Validators run from home connections at launch. No data-centre requirement.',
    gap: { btc: false, eth: false, monero: false, zec: false, mina: false, adm: true } },
];

export const FIVE_MECHANISMS = [
  { num: '01', name: 'Consensus', d: 'DAG-BFT, Mysticeti-shaped. Active set floor 7, ceiling 75.', meta: 'Throughput ≥ 50 000 TPS · sub-second finality' },
  { num: '02', name: 'Mempool', d: 'Threshold encryption + time-lock VDF. Two-regime fallback.', meta: 'Encrypted by default · MEV-resistant' },
  { num: '03', name: 'Verification', d: 'Recursive proofs. Phone-verifiable. Light clients without trust.', meta: 'Halo 2 · ML-KEM-768' },
  { num: '04', name: 'Governance', d: 'None. No foundation, no admin keys, no governance contracts.', meta: 'Hard-fork-only protocol changes' },
  { num: '05', name: 'Infrastructure', d: 'Residential-fibre runnable. Four participation tiers, two permissionless.', meta: 'Stake floors 1 000 / 100 ADM' },
];

export const UPDATES = [
  { date: '2026-05-01', tag: 'Spec', title: 'Whitepaper v0.1 published',
    d: 'Full specification, including the two-regime mempool design and the genesis cohort mechanics, is now public on GitHub.' },
  { date: '2026-04-18', tag: 'Impl', title: 'Reference client repository opened',
    d: 'Rust reference implementation is public. Networking and consensus modules stubbed; cryptography in progress.' },
  { date: '2026-04-02', tag: 'Spec', title: 'Cryptographic primitives selected',
    d: 'Ed25519 + ML-DSA (FIPS 204) hybrid signatures; ML-KEM-768 (FIPS 203) for key agreement; Wesolowski VDF for the time-lock mempool.' },
  { date: '2026-03-20', tag: 'Spec', title: 'Throughput floor revised to 50 000 TPS',
    d: 'Earlier 200K figure was projected against ideal Mysticeti throughput; 50K is the conservative residential-fibre floor with 7–75 active set.' },
  { date: '2026-03-01', tag: 'Ops', title: 'Project journal opened',
    d: 'Material design and operational changes will be logged here. Decisions before this date are reconstructed in the appendix.' },
];

export const FOUR_TIERS = [
  { k: 'Node Runner',  role: 'Consensus participant',                       stake: '1 000 ADM', hw: '16 GB RAM · 2 TB NVMe · 100 Mbit symmetric', comp: 'Block rewards (validator pool) + fee dimension share', count: '7–75', permissionless: false },
  { k: 'Node Watcher', role: 'Attestation, DA sampling, fraud detection',   stake: '100 ADM',   hw: '8 GB RAM · 500 GB SSD · 25 Mbit',           comp: 'Issuance share (~5%) + fee slice',                     count: 'uncapped', permissionless: false },
  { k: 'Prover',       role: 'Recursive proof generation',                  stake: '—',         hw: 'GPU recommended (proof-rate competitive)',  comp: 'Per-proof bounty (open market)',                       count: 'permissionless', permissionless: true },
  { k: 'Service Node', role: 'Light-client infrastructure',                 stake: '—',         hw: 'Reliable connectivity; modest compute',     comp: 'Per-query payment channels',                           count: 'permissionless', permissionless: true },
];

export const SEVEN_PRINCIPLES = [
  { n: '01', k: 'Decentralisation as default', d: 'If a feature requires trust in any single party — including the project\'s authors — it is not in the protocol.' },
  { n: '02', k: 'Privacy as default',          d: 'Transactions are shielded unless the user opts to reveal them. View keys, not court orders, control disclosure.' },
  { n: '03', k: 'Verifiability over assertion',d: 'Every claim the protocol makes about itself is a checkable proof a phone can verify.' },
  { n: '04', k: 'No foundation, no premine',   d: 'There is no entity that owns Adamant and no allocation that bypasses burn-to-mint.' },
  { n: '05', k: 'Permanence over fashion',     d: 'The protocol is built to outlive the people who built it. Decisions are taken on a 50-year horizon.' },
  { n: '06', k: 'Plain language',              d: 'If a property cannot be explained without jargon, the property is not yet correctly stated.' },
  { n: '07', k: 'Operational honesty',         d: 'Pre-launch is pre-launch. Specification is specification. No promise is made about features that don\'t yet exist.' },
];

export const PLAIN_FRAMINGS = [
  { vs: 'vs. retail banking',
    ada: 'You hold the keys. No bank can freeze, debit, or close your account.',
    adb: 'The ledger is public, but your activity is not. Selective disclosure is yours, not the bank\'s.' },
  { vs: 'vs. Bitcoin',
    ada: 'Same scarcity discipline (no premine, no foundation). 100M genesis pool plus a fixed-schedule issuance regime.',
    adb: 'Adds privacy by default and post-quantum security. Same monetary posture; updated cryptography.' },
  { vs: 'vs. Ethereum',
    ada: 'Adamant is a settlement chain, not a smart-contract platform — focused, narrow.',
    adb: 'No on-chain governance, no upgrades, no admin keys. Hard-fork is the only protocol-change mechanism.' },
  { vs: 'vs. Monero / Zcash',
    ada: 'Privacy by default like Monero. Selective disclosure like Zcash. Halo 2 proofs, no trusted setup.',
    adb: 'Adds post-quantum signatures and DAG-BFT throughput. Same privacy primitive class; modernised.' },
];

export const NOT_THIS_LIST = [
  'A token launch — there is no premine, no foundation allocation, no investor round.',
  'A smart-contract platform — Adamant does not host arbitrary computation.',
  'A governance system — there is no on-chain governance and no admin key.',
  'A scaling layer — Adamant is a base layer, not a rollup or sidechain.',
  'A privacy add-on — privacy is structural, not an opt-in module.',
  'A novel-cryptography research project — primitives are standard, peer-reviewed, audited.',
];

// formatters
export const fmtAdm = (n: number | null) => (n == null ? '—' : n.toLocaleString('en-US'));
export const fmtBlock = (n: number | null) =>
  n == null ? '—' : n.toLocaleString('en-US').replace(/,/g, '<span class="sep">,</span>');
