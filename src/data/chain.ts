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

export const PRELAUNCH: PhaseState = {
  key: 'prelaunch',
  label: 'Specification phase',
  shortLabel: 'Pre-launch',
  tagline: 'Specification phase. Reference implementation in progress.',
  live: false,
  spec: true,
  blockHeight: null,
  activeValidators: 0,
  activeMax: 75,
  activeFloor: 7,
  standbyQueue: 0,
  securityTier: '—',
  tps: null,
  finality: null,
  circulation: 0,
  genesisPool: { total: 100_000_000, burnRemaining: 70_000_000, validatorRemaining: 30_000_000 },
  cohortFilled: 0,
  validators: [],
};

export const PHASE: PhaseState = PRELAUNCH;

export const PAGES = [
  { k: 'home', href: '/', label: 'Home' },
  { k: 'whitepaper', href: 'https://github.com/adamant-protocol/adamant-website/tree/main/whitepaper', label: 'Whitepaper', external: true },
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
  { date: '2026-05-01', tag: 'Specification', title: 'Whitepaper v0.1 published',
    d: 'Full specification, including the two-regime mempool design and the genesis cohort mechanics, is now public.' },
  { date: '2026-04-18', tag: 'Implementation', title: 'Reference client repository opened',
    d: 'Rust reference implementation is now public on GitHub. Networking and consensus modules are stubbed; cryptography is in progress.' },
  { date: '2026-04-02', tag: 'Audit', title: 'Cryptographic primitives selected',
    d: 'ML-DSA + Ed25519 hybrid signatures; ML-KEM-768 for key agreement. Rationale appendix added to the whitepaper.' },
];

// formatters
export const fmtAdm = (n: number | null) => (n == null ? '—' : n.toLocaleString('en-US'));
export const fmtBlock = (n: number | null) =>
  n == null ? '—' : n.toLocaleString('en-US').replace(/,/g, '<span class="sep">,</span>');
