// Burn-to-mint calculator — fixed-rate 20 ADM / USD-eq across all sources.
// Not a live oracle. Calibrated at protocol design time.
import * as React from 'react';
import { useMemo, useState } from 'react';

const SOURCES = [
  { code: 'BTC',  name: 'Bitcoin',  note: 'calibrated at design' },
  { code: 'ETH',  name: 'Ethereum', note: 'calibrated at design' },
  { code: 'USDT', name: 'Tether',   note: '1 : 20 fixed' },
  { code: 'USDC', name: 'USD Coin', note: '1 : 20 fixed' },
];

const fmt = (n) => (n == null ? '—' : n.toLocaleString('en-US'));

export default function BurnCalculator() {
  const [src, setSrc] = useState('USDC');
  const [usd, setUsd] = useState('100');

  const source = useMemo(() => SOURCES.find((s) => s.code === src) ?? SOURCES[0], [src]);
  const usdNum = parseFloat(usd) || 0;
  const adm = usdNum * 20;

  return (
    <div className="burn-calc">
      <div className="burn-tabs">
        {SOURCES.map((s) => (
          <button
            key={s.code}
            type="button"
            className={`burn-tab ${src === s.code ? 'on' : ''}`}
            onClick={() => setSrc(s.code)}
          >
            {s.code}
          </button>
        ))}
      </div>
      <div className="burn-flow">
        <div className="burn-side">
          <div className="k">Burn (source)</div>
          <input
            className="burn-input"
            type="text"
            value={usd}
            onChange={(e) => setUsd(e.target.value.replace(/[^0-9.]/g, ''))}
            inputMode="decimal"
            aria-label="USD-equivalent amount to burn"
          />
          <div className="src">{source.name} · {source.note}</div>
        </div>
        <div className="burn-arrow" aria-hidden="true">
          <span>→</span>
          <span className="ln" />
          <span style={{ fontSize: 9, letterSpacing: '0.10em' }}>MINT</span>
        </div>
        <div className="burn-side">
          <div className="k">Receive (destination)</div>
          <div className="burn-output">{fmt(adm)}</div>
          <div className="src">ADM · native</div>
        </div>
      </div>
      <p className="burn-foot">
        <strong>Burn-to-mint</strong> is the only launch-phase issuance.
        USDT / USDC are pegged 1 : 20. BTC / ETH calibrated at protocol design time
        and held constant through launch — <span style={{ color: 'var(--accent)' }}>not a live oracle</span>.
        Per-address claim cap ramps 1 % → 2 % → 4 % → 8 % → uncapped across months 0–12.
      </p>
    </div>
  );
}
