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
  { k: 'home',     href: '/',         label: 'Home',     header: true  },
  { k: 'about',    href: '/about',    label: 'About',    header: true  },
  { k: 'genesis',  href: '/genesis',  label: 'Genesis',  header: true  },
  { k: 'spec',     href: '/spec',     label: 'Spec',     header: true  },
  { k: 'updates',  href: '/updates',  label: 'Updates',  header: true  },
  { k: 'network',  href: '/network',  label: 'Network',  header: false },
  { k: 'wallet',   href: '/wallet',   label: 'Wallet',   header: false },
  { k: 'operator', href: '/operator', label: 'Operator', header: false },
] as const;

export const HEADER_PAGES = PAGES.filter((p) => p.header);

export const SOCIAL_LINKS = {
  github: 'https://github.com/adamant-protocol',
  x: 'https://x.com/adamantprotocol',
};

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

export const CAPABILITIES = [
  {
    title: 'Private payments at consumer scale',
    desc: 'Send and receive value without exposing your transaction history to every observer in perpetuity. Sub-second confirmation, sub-cent fees, selective disclosure when you need it.',
    eg: 'Payments, payroll, remittance, donations, allowances.',
  },
  {
    title: 'Applications that hold money',
    desc: 'Smart contracts that inherit the chain’s properties. Default-private state. Sub-cent execution. No platform owner with the power to ban your contract or freeze your users.',
    eg: 'DEXes, lending markets, derivatives, escrow, payment channels, on-chain games with private state.',
  },
  {
    title: 'Long-lived contractual arrangements',
    desc: 'Wills, trusts, escrows, and inheritance instruments designed to outlive their creators by decades. The chain commits structurally that the rules cannot change without all participants agreeing.',
    eg: 'Digital inheritance, multi-decade trusts, dead-man’s-switch contracts, intergenerational financial planning.',
  },
  {
    title: 'Self-custody outside the banking system',
    desc: 'Hold value on a chain that cannot be captured. No bank that can fail. No deposit insurance contingent on a government’s solvency. No account that can be frozen at someone else’s discretion.',
    eg: 'Personal sovereignty over capital, jurisdictional independence, intergenerational wealth preservation.',
  },
  {
    title: 'Validators and witnesses run by individuals',
    desc: 'A residential-fibre operator with a desktop and a 1 Gbps home connection can be a validator. A phone can be a witness. Hardware floors that don’t drift toward datacentres over time.',
    eg: 'Real participation in chain security by individuals — not just infrastructure operators.',
  },
  {
    title: 'Privacy that doesn’t leak',
    desc: 'Default-shielded means your use of the chain doesn’t itself become a signal. Selective disclosure means you remain compliant where you must be, without exposing everything else.',
    eg: 'Compliance without surveillance. Audit trails on demand without permanent broadcast.',
  },
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
  'A general-purpose world computer — Move contracts pay gas; shielded functions carry proofs. The VM is narrow on purpose.',
  'A governance system — there is no on-chain governance and no admin key.',
  'A scaling layer — Adamant is a base layer, not a rollup or sidechain.',
  'A privacy add-on — privacy is structural, not an opt-in module.',
  'A novel-cryptography research project — primitives are standard, peer-reviewed, audited.',
];

// formatters
export const fmtAdm = (n: number | null) => (n == null ? '—' : n.toLocaleString('en-US'));
export const fmtBlock = (n: number | null) =>
  n == null ? '—' : n.toLocaleString('en-US').replace(/,/g, '<span class="sep">,</span>');

// ============ EXPLORER MOCK DATA ============
// Pre-launch placeholders. Replace with live RPC once chain is up.

export const RPC_METHODS = [
  { m: 'adamant_blockHeight',       p: '[]',                         r: 'u64',        d: 'Current finalised block height.' },
  { m: 'adamant_getBlock',          p: '[height: u64]',              r: 'Block',      d: 'Full block by height. Includes proposer, tx list, encryption-regime split.' },
  { m: 'adamant_getTransaction',    p: '[hash: H256]',               r: 'Tx',         d: 'Transaction metadata. Body is opaque if shielded.' },
  { m: 'adamant_getAddress',        p: '[addr: Address]',            r: 'AddressView',d: 'Public state of a transparent address; opaque view for shielded.' },
  { m: 'adamant_disclose',          p: '[viewKey: VK, scope: Scope]',r: 'Disclosure', d: 'Decrypt a slice of history under a view key.' },
  { m: 'adamant_getValidators',     p: '[]',                         r: 'Validator[]',d: 'Active set with bond, uptime, slashing record.' },
  { m: 'adamant_getMempool',        p: '[]',                         r: 'Mempool',    d: 'Pending tx count by encryption regime, oldest age.' },
  { m: 'adamant_getBurns',          p: '[from: u64, to: u64]',       r: 'BurnMint[]', d: 'Burn-to-mint events with source-chain tx hashes.' },
  { m: 'adamant_getGenesisNft',     p: '[slot: u8]',                 r: 'GenesisNft', d: 'Cohort slot record: marker (immovable), NFT owner (tradeable).' },
  { m: 'adamant_estimateFee',       p: '[tx: TxDraft]',              r: 'FeeQuote',   d: 'Fee estimate with dimension breakdown.' },
  { m: 'adamant_subscribe',         p: '[topic: Topic]',             r: 'SubId',      d: 'WebSocket subscription. Topics: blocks, mempool, validators, burns.' },
  { m: 'adamant_chainSpec',         p: '[]',                         r: 'ChainSpec',  d: 'Chain ID, security tier, primitives, current epoch.' },
];

export const MOCK_BLOCKS = Array.from({ length: 12 }, (_, i) => ({
  height: null as number | null,
  proposer: '—',
  txs: 0,
  fee: 0,
  finality: null as number | null,
  threshold: 0,
  vdf: 0,
  ts: '—',
  spec: true,
  i,
}));

export const MOCK_TXS = Array.from({ length: 14 }, (_, i) => ({
  hash: '—',
  block: null as number | null,
  fee: 0,
  regime: i % 3 === 0 ? 'vdf' : 'threshold',
  status: 'pending',
  shielded: true,
  spec: true,
  i,
}));

export const BURN_REGISTRY = [
  { ts: '—', source: 'BTC',  src_tx: '—', usd: 0, adm: 0, dest: 'adm1…', spec: true },
  { ts: '—', source: 'ETH',  src_tx: '—', usd: 0, adm: 0, dest: 'adm1…', spec: true },
  { ts: '—', source: 'USDT', src_tx: '—', usd: 0, adm: 0, dest: 'adm1…', spec: true },
  { ts: '—', source: 'USDC', src_tx: '—', usd: 0, adm: 0, dest: 'adm1…', spec: true },
];

export const GENESIS_NFTS = Array.from({ length: 75 }, (_, i) => ({
  slot: i + 1,
  marker: '—',          // permanent, bound to original cohort address
  nftOwner: '—',        // tradeable
  activatedEpoch: null as number | null,
  transferred: false,
  spec: true,
}));

export const SLASHING_CONDITIONS = [
  { code: 'S.01', name: 'Double sign',           penalty: '100% of bond',  unbond: 'forfeit', detect: 'Two signed headers same height', recover: 'None — exit only.' },
  { code: 'S.02', name: 'Liveness failure',      penalty: '0.05% per missed epoch (capped 5%)', unbond: 'partial', detect: 'No attestation in finalised window', recover: 'Resume; bond regenerates over 30 epochs.' },
  { code: 'S.03', name: 'Equivocation (DAG)',    penalty: '50% of bond',   unbond: 'forfeit half', detect: 'Conflicting DAG vertices', recover: 'Reduced — slot transferable.' },
  { code: 'S.04', name: 'Censorship (mempool)',  penalty: '10% of bond',   unbond: 'partial', detect: 'Threshold quorum signs censorship proof', recover: 'Probationary 60 epochs.' },
  { code: 'S.05', name: 'Watcher false claim',   penalty: '100% of bond (watcher)', unbond: 'forfeit', detect: 'Refuted attestation', recover: 'None for watcher; validator unaffected.' },
];

export const FEE_DIMENSIONS = [
  { code: 'F.01', name: 'Compute',     unit: 'gas-equivalent',     d: 'Verifier-cycles for proof checks + signature ops.' },
  { code: 'F.02', name: 'Bandwidth',   unit: 'bytes published',    d: 'On-DAG bytes; encrypted payloads priced by ciphertext size.' },
  { code: 'F.03', name: 'State',       unit: 'commitment slots',   d: 'New shielded notes or transparent UTXOs added to the state commitment.' },
  { code: 'F.04', name: 'Mempool',     unit: 'encryption regime',  d: 'Threshold regime is cheaper than VDF; VDF surcharges when active set < 15.' },
  { code: 'F.05', name: 'Disclosure',  unit: 'kB decrypted',       d: 'Optional. Paid only when a view-key disclosure is published on-chain.' },
];

export const FAQ_ITEMS = [
  { q: 'When is mainnet?',                          a: 'When the security tier signals align and at least 7 Node Runners are registered, stake-eligible, and online. There is no calendar date; the chain self-activates.' },
  { q: 'How do I get ADM?',                         a: 'Burn-to-mint. Provably burn BTC, ETH, USDT, or USDC at the source chain; the validator set verifies the burn proof and mints ADM at 20 ADM per USD-equivalent. There is no premine, no investor round, no foundation allocation.' },
  { q: 'Is Adamant a smart-contract platform?',     a: 'Yes — in a narrow sense. Adamant ships the Adamant Move language and Adamant Virtual Machine (AVM), based on Move\'s object-and-resource model. Contracts that touch shielded value carry a Halo 2 proof of correct state transition. The protocol is not a general-purpose computer — every function pays gas, every shielded function proves a circuit — but you can deploy non-trivial logic. See whitepaper §6.' },
  { q: 'How is privacy implemented?',               a: 'Default-shielded transactions using Halo 2 zero-knowledge proofs. Sender, recipient, amount, and contract calls are encrypted before the transaction leaves the device. Selective disclosure via view keys, scoped and revocable.' },
  { q: 'What is post-quantum, and what does Adamant use?', a: 'Cryptography designed to resist attack by a sufficiently large quantum computer. Adamant uses ML-DSA (FIPS 204) hybridised with Ed25519 for signatures, and ML-KEM-768 (FIPS 203) for key agreement.' },
  { q: 'Can my phone verify the chain?',            a: 'Yes. Recursive proofs let a client check the entire chain state from a single proof. A phone can be a full verifier, and a Node Watcher.' },
  { q: 'Who runs Adamant?',                         a: 'Whoever bonds the floor and meets the hardware spec. Genesis cohort is 75 Node Runners, first-come, first-served. There is no foundation, no admin key, no governance contract.' },
  { q: 'Is there governance?',                      a: 'No on-chain governance. Protocol changes happen only by hard fork; participants signal by running the new client.' },
  { q: 'Why DAG-BFT and not Tendermint or Ethereum-style?', a: 'DAG-BFT (Mysticeti-shaped) decouples transaction dissemination from ordering, which is what gets us the ≥50 000 TPS floor on residential-fibre hardware.' },
  { q: 'What is the inflation schedule?',           a: 'The 100M genesis pool drains via burn-to-mint and validator emission over the launch phase (5-year cap). Post-genesis emission follows the schedule in the whitepaper — fixed, predictable, no governance lever.' },
  { q: 'Can ADM be confiscated or frozen?',         a: 'No. There are no admin keys. Validators cannot reverse, freeze, or seize transactions. Selective disclosure is user-controlled.' },
  { q: 'Where is the team?',                        a: 'Adamant has no foundation and no central team. Contributors work from the public repositories. The protocol is the team.' },
];

export const GLOSSARY = [
  { term: 'Active set',           d: 'The validators currently producing blocks. Floor 7, ceiling 75. Below the floor, the chain halts.' },
  { term: 'Burn-to-mint',         d: 'Adamant\'s only launch-phase issuance: provably burn a source asset (BTC/ETH/USDT/USDC), receive ADM at the fixed rate.' },
  { term: 'Cohort marker',        d: 'A permanent on-chain marker bound to the original genesis validator address. Does not transfer with the slot.' },
  { term: 'DAG-BFT',              d: 'Directed-acyclic-graph Byzantine fault tolerance. Adamant\'s consensus, Mysticeti-shaped.' },
  { term: 'Disclosure',           d: 'A scoped, revocable decryption permission granted by a view key.' },
  { term: 'Genesis NFT',          d: 'A freely tradeable NFT paired with each genesis cohort slot. Separate from the immovable cohort marker.' },
  { term: 'Halo 2',               d: 'A recursive zero-knowledge proof system with no trusted setup. Adamant\'s privacy primitive.' },
  { term: 'ML-DSA',               d: 'Module-Lattice Digital Signature Algorithm (FIPS 204). Post-quantum signature scheme used in hybrid with Ed25519.' },
  { term: 'ML-KEM',               d: 'Module-Lattice Key Encapsulation Mechanism (FIPS 203). Post-quantum key agreement.' },
  { term: 'Mempool regime',       d: 'Two modes: threshold encryption (when active set ≥ 15) and time-lock VDF (when active set < 15). Auto-falls-back.' },
  { term: 'Node Runner',          d: 'Validator role. Stake floor 1 000 ADM. Produces blocks.' },
  { term: 'Node Watcher',         d: 'Witness role. Stake floor 100 ADM. Publishes attestations and DA samples.' },
  { term: 'Prover',               d: 'Permissionless tier. Generates recursive proofs on a per-bounty market.' },
  { term: 'Recursive proof',      d: 'A zero-knowledge proof that verifies other proofs. Allows phone-side full verification.' },
  { term: 'Security tier',        d: 'I, II, or III. A function of audit completion, time-in-operation, and active-set size.' },
  { term: 'Selective disclosure', d: 'A user-issued, scoped permission allowing a third party to decrypt some subset of the user\'s history.' },
  { term: 'Service Node',         d: 'Permissionless tier. Operates light-client RPC for end-user wallets, paid per query.' },
  { term: 'Shielded',             d: 'A transaction or balance whose details are encrypted on the public ledger. Default state.' },
  { term: 'Slot transfer',        d: 'Mutual-consent transfer of a validator slot at an epoch boundary. Seniority preserved; marker stays with original address.' },
  { term: 'Stealth address',      d: 'A one-time recipient address derived from a long-lived public viewing key. Unlinkable to other payments to the same recipient.' },
  { term: 'Threshold encryption', d: 'A scheme where decryption requires N-of-M validators to cooperate; prevents single-validator pre-execution MEV.' },
  { term: 'Transparent',          d: 'An address or transaction whose details are visible on the public ledger. Opt-in.' },
  { term: 'VDF',                  d: 'Verifiable Delay Function (Wesolowski). Provides time-lock encryption for the small-set mempool regime.' },
  { term: 'View key',             d: 'A read-only key issued by the holder of a spending key, allowing scoped decryption without spending authority.' },
];

export const SECURITY_PRIMITIVES = [
  { code: 'C.01', name: 'Halo 2',                use: 'Recursive zk-SNARKs',          version: 'spec',  audit: 'Implementation tracks zcash/halo2; audit pending public testnet.' },
  { code: 'C.02', name: 'ML-DSA (FIPS 204)',     use: 'Post-quantum signatures',      version: 'FIPS-204', audit: 'NIST-standardised; Adamant\'s hybrid construction unaudited.' },
  { code: 'C.03', name: 'Ed25519',               use: 'Classical signature (hybrid)', version: 'RFC 8032', audit: 'Industry standard.' },
  { code: 'C.04', name: 'ML-KEM-768 (FIPS 203)', use: 'Post-quantum KEM',             version: 'FIPS-203', audit: 'NIST-standardised.' },
  { code: 'C.05', name: 'Wesolowski VDF',        use: 'Mempool time-lock',            version: 'spec',  audit: 'Reference implementation pre-audit.' },
  { code: 'C.06', name: 'Threshold BLS',         use: 'Mempool threshold encryption', version: 'spec',  audit: 'Specified in whitepaper §06; audit pending.' },
  { code: 'C.07', name: 'BLAKE3',                use: 'Hashing, MAC',                 version: '1.x',   audit: 'Industry standard.' },
];

export const INCIDENT_LOG = [
  { date: '—', severity: '—', title: 'No incidents recorded — chain is pre-launch.', body: 'The incident log begins at testnet activation.' },
];

export const PUBLIC_RPC = [
  { url: '—', region: '—', operator: '—', spec: true },
];

export const POST_GENESIS_EMISSION = [
  { phase: 'Launch (0–5y)',    rule: 'Genesis pool drain · burn-to-mint + validator emission', source: 'Pool', cap: '100 000 000 ADM' },
  { phase: 'Post-genesis · A', rule: 'Fixed-schedule validator emission (whitepaper §11.3)',   source: 'Issuance', cap: 'declining curve' },
  { phase: 'Post-genesis · B', rule: 'Fee burn on transparent dimension; net-zero issuance target',source: 'Burn',     cap: 'asymptotic' },
];

export const ADIP_PROCESS = [
  { n: '01', h: 'Draft',         d: 'A proposal is published as a markdown document in the public repository. Anyone may submit.' },
  { n: '02', h: 'Review',        d: 'Open review window (≥30 days) on the repository. Discussion is logged in commit history; no voting.' },
  { n: '03', h: 'Reference',     d: 'A reference implementation is produced. Without code, the proposal cannot proceed.' },
  { n: '04', h: 'Public testnet',d: 'The proposal is exercised on a public testnet for ≥90 days. Results are appended to the proposal.' },
  { n: '05', h: 'Hard fork',     d: 'Operators run the proposal\'s client at a coordinated block height. There is no on-chain vote. Adoption is the signal.' },
];

export const HARDWARE_WALLETS = [
  { brand: 'Ledger',           model: 'Nano S+ / X / Stax',    classical: 'planned',  pq: 'planned (ML-DSA app)', target: 'mainnet + 6mo' },
  { brand: 'Trezor',           model: 'Safe 3 / Safe 5',       classical: 'planned',  pq: 'planned',              target: 'mainnet + 12mo' },
  { brand: 'Open-source HW',   model: 'reference design',      classical: 'spec',     pq: 'spec',                 target: 'open RFC' },
];

export const I18N_LOCALES = [
  { code: 'en', label: 'English',  path: '/' },
  { code: 'zh', label: '中文',      path: '/zh' },
  { code: 'ja', label: '日本語',    path: '/ja' },
  { code: 'ko', label: '한국어',    path: '/ko' },
  { code: 'es', label: 'Español',  path: '/es' },
  { code: 'ar', label: 'العربية',   path: '/ar' },
];
