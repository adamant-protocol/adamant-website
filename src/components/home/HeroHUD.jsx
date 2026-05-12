// Corner brackets + faint terminal HUD overlay for the dive hero.
import * as React from 'react';
import { useEffect, useState } from 'react';

const SEQ = [
  '$ adamant.connect()',
  'awaiting active set ≥ 7 ...',
  'spec phase · whitepaper v0.1',
  '$ verify(commit, proof)',
  '✓ halo2 recursive proof ok',
  '$ mempool.regime',
  '→ threshold | vdf-fallback',
  '$ tier.status',
  '○ tier  I  (n = 7  – 14)',
  '○ tier  II (n = 15 – 29)',
  '● tier  III (n ≥ 30)',
];

export default function HeroHUD({ phase }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1400);
    return () => clearInterval(id);
  }, []);
  const display = [
    SEQ[tick % SEQ.length],
    SEQ[(tick + 1) % SEQ.length],
    SEQ[(tick + 2) % SEQ.length],
  ];
  const p = phase || {};
  return (
    <div className="hero-hud" aria-hidden="true">
      <div className="hud-corner tl">
        <span>┌</span>
        <div className="hud-label">ADAMANT / L1 · OBSERVE</div>
      </div>
      <div className="hud-corner tr">
        <div className="hud-label right">SPEC v0.1 · MAY 2026</div>
        <span>┐</span>
      </div>
      <div className="hud-corner bl">
        <span>└</span>
        <div className="hud-terminal">
          {display.map((l, i) => (
            <div key={tick + '-' + i} className={`hud-line ${i === 0 ? 'fresh' : ''}`}>{l}</div>
          ))}
        </div>
      </div>
      <div className="hud-corner br">
        <div className="hud-meta">
          <div><span className="k">PHASE</span> <span className="v">{(p.shortLabel || '—').toUpperCase()}</span></div>
          <div><span className="k">SET</span> <span className="v">{p.activeValidators ?? 0}/{p.activeMax ?? 75}</span></div>
          <div><span className="k">TIER</span> <span className="v">{p.securityTier || '—'}</span></div>
        </div>
        <span>┘</span>
      </div>
    </div>
  );
}
