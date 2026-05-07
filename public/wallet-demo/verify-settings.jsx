// Verify tab + Settings + View keys + Onboarding

// ── Verify tab ─────────────────────────────────────
function VerifyScreen({ lastVerified, setLastVerified }) {
  // states: idle | running | done | failed (we don't show failed except as type)
  const [phase, setPhase] = React.useState('idle');
  const [progress, setProgress] = React.useState(0);
  const [resultMs, setResultMs] = React.useState(127);
  const [tipHash] = React.useState('0xa9c2f81e3b4d7f209a8c2e9f4b1d6a3e0c7f9b2d5a4e8f1c0b3d6a9e7f2c5b8d');

  React.useEffect(() => {
    if (phase !== 'running') return;
    const start = performance.now();
    let raf;
    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(elapsed / 1300, 1);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        const ms = Math.round(120 + Math.random() * 30);
        setResultMs(ms);
        setPhase('done');
        setLastVerified(Date.now());
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, setLastVerified]);

  const verify = () => { setProgress(0); setPhase('running'); };

  return (
    <div className="adm-scroll" style={{ padding: '8px 0 90px', height: '100%', overflow: 'auto', position: 'relative' }}>
      <div style={{ padding: '20px 24px 12px' }}>
        <Eyebrow>Verify · §2.3</Eyebrow>
        <div className="display" style={{ fontSize: 30, fontWeight: 300, marginTop: 14, color: 'var(--adm-text-1)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
          <span style={{ color: 'var(--adm-text-2)' }}>Verify the chain</span>
          <br />
          <span style={{ color: 'var(--adm-text-1)' }}>on this device.</span>
        </div>
      </div>

      {/* Mechanism diagram */}
      <div style={{ padding: '24px 24px 8px' }}>
        <VerifyDiagram phase={phase} progress={progress} />
      </div>

      {/* Status block */}
      <div style={{ padding: '20px 24px 8px' }}>
        {phase === 'idle' && (
          <div className="adm-fade">
            <Eyebrow dot={lastVerified ? 'ember' : 'muted'}>
              {lastVerified ? 'Last verified' : 'Not yet verified'}
            </Eyebrow>
            <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--adm-text-2)', letterSpacing: '0.04em', lineHeight: 1.6 }}>
              chain_tip · {tipHash.slice(0, 18)}…{tipHash.slice(-6)}
              <br />
              {lastVerified ? `${Math.round((Date.now() - lastVerified) / 1000)}s ago · ${resultMs}ms` : 'tap below'}
            </div>
          </div>
        )}

        {phase === 'running' && (
          <div className="adm-fade">
            <Eyebrow dot="muted">Verifying</Eyebrow>
            <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--adm-text-2)', letterSpacing: '0.04em', lineHeight: 1.6 }}>
              loading recursive proof · 8.2 KB<br />
              checking against tip · {tipHash.slice(0, 18)}…<br />
              <span style={{ color: 'var(--adm-text-1)' }}>{Math.round(progress * resultMs)} ms elapsed</span>
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="adm-fade">
            <Eyebrow>Chain verified</Eyebrow>
            <div className="display" style={{ marginTop: 12, fontSize: 36, fontWeight: 300, color: 'var(--adm-text-1)', letterSpacing: '-0.03em' }}>
              {resultMs} <span style={{ fontSize: 16, color: 'var(--adm-text-3)' }}>ms</span>
            </div>
            <div style={{ marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-2)', letterSpacing: '0.04em', lineHeight: 1.7 }}>
              proof_size · 8.2 KB<br />
              chain_tip · <span style={{ color: 'var(--adm-text-1)' }}>{tipHash.slice(0, 18)}…{tipHash.slice(-6)}</span><br />
              halo2 · verified locally
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '24px 20px 0' }}>
        <button
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={verify}
          disabled={phase === 'running'}
        >
          {phase === 'idle' ? 'Verify now' : phase === 'running' ? 'Verifying…' : 'Verify again'}
        </button>
      </div>

      {/* Explainer */}
      <div style={{ padding: '32px 24px' }}>
        <details>
          <summary style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--adm-text-2)', cursor: 'pointer',
            outline: 'none', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ color: 'var(--adm-text-3)' }}>—</span>
            What does this prove?
          </summary>
          <div style={{ marginTop: 14, fontSize: 13, color: 'var(--adm-text-2)', lineHeight: 1.7 }}>
            You have personally cryptographically verified the entire state of the Adamant chain at this moment, against a ~5–10&nbsp;KB recursive zero-knowledge proof. You did not trust any server, RPC provider, or third party. The proof was generated by Node Runners and verified locally, on your device, in milliseconds.
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--adm-border-1)', color: 'var(--adm-text-3)', fontSize: 12 }}>
              No other chain currently lets you do this.
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}

function VerifyDiagram({ phase, progress }) {
  // Three boxes: chain history → recursive proof → device
  // running: progress fills
  return (
    <div style={{ position: 'relative', padding: '20px 0 8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {/* Chain history */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--adm-text-3)', marginBottom: 8 }}>
            Chain history
          </div>
          <div style={{ display: 'flex', gap: 2, height: 36 }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const active = phase === 'running' ? progress * 12 > i : phase === 'done';
              return (
                <div key={i} style={{
                  flex: 1,
                  background: active ? 'var(--adm-text-2)' : 'var(--adm-border-2)',
                  borderRadius: 1,
                  transition: 'background 80ms ease',
                }} />
              );
            })}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.04em', color: 'var(--adm-text-3)', marginTop: 6 }}>
            1,847,392 blocks
          </div>
        </div>

        {/* Arrow */}
        <svg width="20" height="36" viewBox="0 0 20 36" style={{ flexShrink: 0 }}>
          <path d="M2 18 H17 M13 14 L17 18 L13 22" stroke="var(--adm-text-3)" strokeWidth="1" fill="none" strokeLinecap="round"/>
        </svg>

        {/* Proof box */}
        <div style={{
          width: 80, height: 80, flexShrink: 0,
          border: '1px solid var(--adm-border-3)',
          borderRadius: 12,
          background: phase === 'done' ? 'rgba(255,125,77,0.06)' : phase === 'running' ? 'rgba(255,125,77,0.03)' : 'transparent',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 4, position: 'relative', overflow: 'hidden',
          transition: 'background 300ms ease',
        }}>
          {phase === 'running' && (
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(180deg, transparent 0%, var(--adm-ember-faint) ${progress * 100}%, transparent ${progress * 100}%)`,
              transition: 'background 80ms linear',
            }} />
          )}
          <div className="mono-cap" style={{ fontSize: 9, color: phase === 'done' ? 'var(--adm-ember)' : 'var(--adm-text-2)', position: 'relative' }}>Halo 2</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-1)', position: 'relative' }}>~8 KB</div>
          {phase === 'done' && (
            <svg width="14" height="14" viewBox="0 0 14 14" style={{ position: 'absolute', top: 6, right: 6 }} className="adm-fade">
              <path d="M2 7L6 11L12 3" stroke="var(--adm-ember)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          )}
        </div>

        {/* Arrow */}
        <svg width="20" height="36" viewBox="0 0 20 36" style={{ flexShrink: 0 }}>
          <path d="M2 18 H17 M13 14 L17 18 L13 22" stroke="var(--adm-text-3)" strokeWidth="1" fill="none" strokeLinecap="round"/>
        </svg>

        {/* Device */}
        <div style={{ flexShrink: 0, position: 'relative' }}>
          <div style={{
            width: 50, height: 80, borderRadius: 8,
            border: '1px solid var(--adm-border-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', background: 'var(--adm-surface-2)',
          }}>
            {phase === 'done' ? (
              <svg width="22" height="22" viewBox="0 0 22 22" className="adm-fade">
                <circle cx="11" cy="11" r="9" stroke="var(--adm-ember)" strokeWidth="1.4" fill="none"/>
                <path d="M6 11L10 15L16 7" stroke="var(--adm-ember)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
              </svg>
            ) : (
              <div style={{ width: 16, height: 16, borderRadius: 4, background: phase === 'running' ? 'var(--adm-ember)' : 'var(--adm-border-2)', animation: phase === 'running' ? 'adm-pulse 1s infinite' : 'none' }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Settings ────────────────────────────────────────
function SettingsScreen({ onBack, onView, onClose, theme, setTheme, contactsCount, ordersCount }) {
  return (
    <div className="adm-scroll" style={{ padding: '12px 0 90px', height: '100%', overflow: 'auto' }}>
      <div style={{ padding: '0 20px' }}>
        <ScreenHeader title="Settings" onBack={onClose} />
      </div>

      <SettingsGroup label="Account">
        <SettingsRow k="Personal" detail="Default" onClick={() => {}} />
        <SettingsRow k="Public" detail="Transparent only" onClick={() => {}} />
        <SettingsRow k="+ Create or import account" plain onClick={() => {}} />
      </SettingsGroup>

      <SettingsGroup label="Send">
        <SettingsRow k="Contacts" detail={`${contactsCount || 0} saved`} onClick={() => onView('contacts')} />
        <SettingsRow k="Standing orders" detail={`${ordersCount || 0} active`} onClick={() => onView('orders')} />
      </SettingsGroup>

      <SettingsGroup label="Disclosure">
        <SettingsRow k="View keys" detail="3 active" onClick={() => onView('viewkeys')} accent />
        <SettingsRow k="Privacy preferences" detail="" onClick={() => {}} />
      </SettingsGroup>

      <SettingsGroup label="Verification">
        <SettingsRow k="Verify on app open" detail="On" toggle on />
        <SettingsRow k="RPC node" detail="Local only" mono />
        <SettingsRow k="Network" detail="Mainnet" mono />
      </SettingsGroup>

      <SettingsGroup label="Security">
        <SettingsRow k="Signature scheme" detail="Ed25519 + ML-DSA" mono />
        <SettingsRow k="Export seed phrase" detail="Requires biometric + 10s hold" onClick={() => {}} />
        <SettingsRow k="Lock now" plain onClick={() => {}} />
      </SettingsGroup>

      <SettingsGroup label="Appearance">
        <SettingsRow
          k="Theme"
          detail={theme === 'dark' ? 'Dark' : 'Light'}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          mono
        />
      </SettingsGroup>

      <SettingsGroup label="About">
        <SettingsRow k="Version" detail="0.1.0-genesis" mono />
        <SettingsRow k="Whitepaper" detail="adamantprotocol.com" mono onClick={() => {}} />
        <SettingsRow k="Source" detail="github.com/adamant-protocol" mono onClick={() => {}} />
      </SettingsGroup>

      <div style={{ padding: '24px 24px 16px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--adm-text-3)', letterSpacing: '0.04em', lineHeight: 1.7 }}>
          Adamant has no team page by design.<br />The protocol is what you trust.
        </div>
      </div>
    </div>
  );
}

function SettingsGroup({ label, children }) {
  return (
    <div style={{ padding: '0 20px 8px', marginTop: 24 }}>
      <div style={{ padding: '0 4px 10px' }}>
        <Eyebrow dot="muted">{label}</Eyebrow>
      </div>
      <div className="adm-card" style={{ padding: '0 16px' }}>
        {children}
      </div>
    </div>
  );
}

function SettingsRow({ k, detail, onClick, mono, accent, plain, toggle, on }) {
  return (
    <div className="row-tap" onClick={onClick} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0', borderBottom: '1px solid var(--adm-border-1)',
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <span style={{ fontSize: 14, color: plain ? 'var(--adm-text-2)' : 'var(--adm-text-1)' }}>
        {k}
        {accent && <span style={{ color: 'var(--adm-ember)', marginLeft: 8, fontSize: 11 }}>●</span>}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className={mono ? 'mono' : ''} style={{ fontSize: 12, color: 'var(--adm-text-3)' }}>{detail}</span>
        {toggle ? <Toggle on={on} onChange={() => {}} />
          : onClick && <svg width="8" height="12" viewBox="0 0 8 12"><path d="M1 1l5 5-5 5" stroke="var(--adm-text-4)" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
      </span>
    </div>
  );
}

// ── View keys ─────────────────────────────────────
const SAMPLE_VIEW_KEYS = [
  { id: 'vk1', label: 'Accountant · 2025–26', scope: 'time-window', range: '2025-04-06 → 2026-04-05', expires: 'in 47 d', status: 'active' },
  { id: 'vk2', label: 'Audit · DAO treasury', scope: 'counterparty', range: 'adm1dao9k…2v7p', expires: 'no expiry', status: 'active' },
  { id: 'vk3', label: 'Solvency proof · Dec 2025', scope: 'amount-threshold', range: '> 10,000 ADM', expires: 'in 2 d', status: 'active' },
  { id: 'vk4', label: 'Tax · 2024–25', scope: 'time-window', range: '2024-04-06 → 2025-04-05', expires: 'expired 38 d', status: 'expired' },
];

function ViewKeysScreen({ onBack, onCreate }) {
  return (
    <div className="adm-scroll" style={{ padding: '12px 0 90px', height: '100%', overflow: 'auto' }}>
      <div style={{ padding: '0 20px' }}>
        <ScreenHeader title="View keys" onBack={onBack} />
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ fontSize: 14, color: 'var(--adm-text-2)', lineHeight: 1.6 }}>
          Cryptographic credentials you hand to specific parties to grant scoped read access to your activity. The chain has no view-key logic — only your wallet and the holder do.
        </div>
      </div>

      <div style={{ padding: '0 20px 16px' }}>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={onCreate}>
          + Generate new view key
        </button>
      </div>

      <div style={{ padding: '0 20px 12px' }}>
        <Eyebrow dot="muted">Active · 3</Eyebrow>
      </div>
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SAMPLE_VIEW_KEYS.filter(v => v.status === 'active').map(v => <ViewKeyCard key={v.id} vk={v} />)}
      </div>

      <div style={{ padding: '24px 20px 12px' }}>
        <Eyebrow dot="muted">Expired · 1</Eyebrow>
      </div>
      <div style={{ padding: '0 20px' }}>
        {SAMPLE_VIEW_KEYS.filter(v => v.status === 'expired').map(v => <ViewKeyCard key={v.id} vk={v} expired />)}
      </div>
    </div>
  );
}

function ViewKeyCard({ vk, expired }) {
  return (
    <div className="adm-card" style={{ padding: 14, opacity: expired ? 0.55 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, color: 'var(--adm-text-1)' }}>{vk.label}</div>
          <div style={{ marginTop: 4 }} className="mono-cap" >
            <span style={{ color: 'var(--adm-text-3)' }}>{vk.scope.replace('-', ' ')}</span>
          </div>
        </div>
        <span className="mono-cap" style={{ color: expired ? 'var(--adm-text-3)' : 'var(--adm-ember)' }}>
          {vk.expires}
        </span>
      </div>
      <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-2)', letterSpacing: '0.04em' }}>
        {vk.range}
      </div>
      {!expired && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--adm-border-1)', display: 'flex', gap: 12 }}>
          <button style={{ background: 'none', border: 'none', padding: 0, color: 'var(--adm-text-2)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }}>View key</button>
          <button style={{ background: 'none', border: 'none', padding: 0, color: 'var(--adm-text-2)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer' }}>Revoke</button>
        </div>
      )}
    </div>
  );
}

function ViewKeyCreate({ onBack, onDone }) {
  const [step, setStep] = React.useState('config'); // config | confirm | generated
  const [label, setLabel] = React.useState('Accountant · 2025–26');
  const [scope, setScope] = React.useState('time-window');
  const [recipient, setRecipient] = React.useState('Marie Tremblay, CPA');

  if (step === 'generated') {
    return (
      <div className="adm-scroll" style={{ padding: '12px 0 90px', height: '100%', overflow: 'auto' }}>
        <div style={{ padding: '0 20px' }}>
          <ScreenHeader title="" onBack={() => onDone()} />
        </div>
        <div style={{ padding: '0 24px 32px' }}>
          <Eyebrow>Generated · ready to share</Eyebrow>
          <div className="display" style={{ fontSize: 24, fontWeight: 300, marginTop: 14, color: 'var(--adm-text-1)', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
            View key for<br />
            <span style={{ color: 'var(--adm-ember)' }}>{recipient}.</span>
          </div>
        </div>

        <div style={{ padding: '0 20px 16px' }}>
          <div className="adm-card" style={{ padding: 14 }}>
            <div className="mono-cap" style={{ color: 'var(--adm-text-3)', marginBottom: 10 }}>Sub-view-key · time-window</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-1)', wordBreak: 'break-all', lineHeight: 1.7, letterSpacing: '0.02em' }}>
              vk1q9p4n7wv2x6kf8r3jd2c8m9tjpyq84r3kn7fk2pq2vh84ml6kfd2c8m9tjpyq84r3kn7fk2x6kf8r3
            </div>
          </div>
        </div>

        <div style={{ padding: '0 20px' }}>
          <div className="adm-card" style={{ padding: '4px 16px' }}>
            <Row k="Scope" v="2025-04-06 → 2026-04-05" />
            <div style={{ height: 1, background: 'var(--adm-border-1)' }} />
            <Row k="Visibility" v="All shielded transactions in window" />
            <div style={{ height: 1, background: 'var(--adm-border-1)' }} />
            <Row k="Spending" v="No · view only" />
          </div>
        </div>

        <div style={{ padding: '24px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={onDone}>Copy · share</button>
          <button className="btn btn-ghost" style={{ width: '100%' }} onClick={onDone}>Done</button>
        </div>

        <div style={{ padding: '20px 24px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--adm-text-3)', letterSpacing: '0.04em', lineHeight: 1.7 }}>
          Disclosure is a positive action. {recipient} now sees your shielded activity within the declared scope. Revoke at any time from the View keys list.
        </div>
      </div>
    );
  }

  return (
    <div className="adm-scroll" style={{ padding: '12px 0 90px', height: '100%', overflow: 'auto' }}>
      <div style={{ padding: '0 20px' }}>
        <ScreenHeader title="New view key" onBack={onBack} />
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <Eyebrow>For</Eyebrow>
        <input className="adm-input" style={{ marginTop: 10 }} value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Recipient label" />
        <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--adm-text-3)', letterSpacing: '0.04em' }}>
          Stored locally. Only you and the recipient see this label.
        </div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <Eyebrow>Scope</Eyebrow>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { id: 'time-window', label: 'Time window', desc: 'A specific date range, e.g. tax year' },
            { id: 'counterparty', label: 'Counterparty', desc: 'Transactions with one specific address' },
            { id: 'amount-threshold', label: 'Amount threshold', desc: 'Transactions above (or below) a value' },
            { id: 'compliance', label: 'Compliance · rules-based', desc: 'Auditor checks transactions against a declared rule set' },
          ].map(o => (
            <button key={o.id} onClick={() => setScope(o.id)} style={{
              background: 'transparent',
              border: '1px solid ' + (scope === o.id ? 'var(--adm-border-3)' : 'var(--adm-border-1)'),
              borderRadius: 10,
              padding: '12px 14px',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
            }}>
              <div>
                <div style={{ fontSize: 14, color: 'var(--adm-text-1)' }}>{o.label}</div>
                <div style={{ fontSize: 12, color: 'var(--adm-text-3)', marginTop: 2 }}>{o.desc}</div>
              </div>
              {scope === o.id && (
                <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7L6 11L12 3" stroke="var(--adm-ember)" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <Eyebrow>Range</Eyebrow>
        <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
          <input className="adm-input mono" defaultValue="2025-04-06" style={{ fontSize: 12 }} />
          <input className="adm-input mono" defaultValue="2026-04-05" style={{ fontSize: 12 }} />
        </div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        <div className="adm-card" style={{ padding: 14 }}>
          <Eyebrow dot="muted">Recipient will see</Eyebrow>
          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--adm-text-2)', lineHeight: 1.6 }}>
            All shielded transactions in the declared scope, with their amounts, counterparties (truncated), and decrypted memos. They <span style={{ color: 'var(--adm-text-1)' }}>cannot</span> spend or sign anything on your behalf.
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setStep('generated')}>
          Generate
        </button>
      </div>
    </div>
  );
}

// ── Onboarding ─────────────────────────────────────
function Onboarding({ onDone }) {
  const [step, setStep] = React.useState(0);
  const next = () => setStep(s => Math.min(s + 1, 4));
  const back = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Progress */}
      <div style={{ display: 'flex', gap: 4, padding: '60px 24px 0' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 2, borderRadius: 2,
            background: i <= step ? 'var(--adm-text-1)' : 'var(--adm-border-2)',
            transition: 'background 200ms ease',
          }} />
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '32px 24px' }}>
        {step === 0 && <OnbWelcome />}
        {step === 1 && <OnbFork />}
        {step === 2 && <OnbSeed />}
        {step === 3 && <OnbConfirm />}
        {step === 4 && <OnbReady />}
      </div>

      <div style={{ padding: '0 24px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {step > 0 && step < 4 && (
          <button className="btn btn-ghost" style={{ alignSelf: 'flex-start', padding: '6px 10px' }} onClick={back}>
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M8 2L3 6L8 10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back
          </button>
        )}
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={step === 4 ? onDone : next}>
          {step === 0 ? 'Get started' : step === 4 ? 'Open wallet' : step === 3 ? 'Confirm' : 'Continue'}
        </button>
      </div>
    </div>
  );
}

function OnbWelcome() {
  return (
    <div style={{ paddingTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 32 }}>
        <AdmMark size={56} />
      </div>
      <Eyebrow>Adamant · pre-launch · v0.1</Eyebrow>
      <div className="display" style={{ fontSize: 36, fontWeight: 300, marginTop: 24, color: 'var(--adm-text-1)', letterSpacing: '-0.035em', lineHeight: 1.1 }}>
        <span style={{ color: 'var(--adm-text-2)' }}>The chain you use</span><br />
        <span>when you don't trust</span><br />
        <span style={{ color: 'var(--adm-ember)' }}>anyone.</span>
      </div>
      <div style={{ marginTop: 36, fontSize: 13, color: 'var(--adm-text-3)', lineHeight: 1.7, fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
        Adamant is a draft protocol.<br />
        Pre-launch. Use real ADM only at your own risk.
      </div>
    </div>
  );
}

function OnbFork() {
  const [choice, setChoice] = React.useState(null);
  return (
    <div style={{ paddingTop: 12 }}>
      <Eyebrow>Step 1 · choose a path</Eyebrow>
      <div className="display" style={{ fontSize: 28, fontWeight: 300, marginTop: 16, color: 'var(--adm-text-1)', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
        Create a new account,<br />
        or import an existing one.
      </div>
      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { k: 'create', t: 'Create new account', d: '24-word seed phrase. Generated locally on this device.' },
          { k: 'import', t: 'Import existing account', d: 'Paste a seed phrase or scan a backup QR.' },
        ].map(o => (
          <button key={o.k} onClick={() => setChoice(o.k)} style={{
            background: 'transparent',
            border: '1px solid ' + (choice === o.k ? 'var(--adm-border-3)' : 'var(--adm-border-1)'),
            borderRadius: 12, padding: 16, textAlign: 'left', cursor: 'pointer',
          }}>
            <div style={{ fontSize: 15, color: 'var(--adm-text-1)' }}>{o.t}</div>
            <div style={{ fontSize: 12, color: 'var(--adm-text-3)', marginTop: 6 }}>{o.d}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

const SEED = ['adamant', 'circle', 'forge', 'glacier', 'horizon', 'ledger', 'orbit', 'prism', 'quartz', 'recurse', 'sable', 'tundra', 'unbroken', 'verify', 'witness', 'yield', 'zenith', 'altar', 'beacon', 'cipher', 'defiant', 'ember', 'frost', 'granite'];

function OnbSeed() {
  const [a, setA] = React.useState(false);
  const [b, setB] = React.useState(false);
  const [c, setC] = React.useState(false);
  return (
    <div style={{ paddingTop: 12 }}>
      <Eyebrow>Step 2 · seed phrase</Eyebrow>
      <div className="display" style={{ fontSize: 26, fontWeight: 300, marginTop: 16, color: 'var(--adm-text-1)', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
        Write these down.<br />
        On paper, in order.
      </div>

      <div style={{ marginTop: 24, padding: 14, background: 'var(--adm-surface-1)', border: '1px solid var(--adm-border-2)', borderRadius: 12, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {SEED.map((w, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.04em' }}>
            <span style={{ color: 'var(--adm-text-4)', fontSize: 10, width: 18, textAlign: 'right' }}>{String(i + 1).padStart(2, '0')}</span>
            <span style={{ color: 'var(--adm-text-1)' }}>{w}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { v: a, set: setA, t: 'I have written this down.' },
          { v: b, set: setB, t: 'I understand losing it means losing access.' },
          { v: c, set: setC, t: 'I understand no one can recover it for me.' },
        ].map((o, i) => (
          <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
            <div onClick={() => o.set(!o.v)} style={{
              width: 18, height: 18, borderRadius: 4, flexShrink: 0,
              border: '1px solid ' + (o.v ? 'var(--adm-ember)' : 'var(--adm-border-2)'),
              background: o.v ? 'var(--adm-ember)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginTop: 1,
            }}>
              {o.v && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6L5 9L10 3" stroke="#1a0f08" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>}
            </div>
            <span style={{ fontSize: 13, color: 'var(--adm-text-1)', lineHeight: 1.5 }}>{o.t}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function OnbConfirm() {
  const indices = [3, 11, 18];
  const [vals, setVals] = React.useState(['', '', '']);
  return (
    <div style={{ paddingTop: 12 }}>
      <Eyebrow>Step 3 · confirm</Eyebrow>
      <div className="display" style={{ fontSize: 26, fontWeight: 300, marginTop: 16, color: 'var(--adm-text-1)', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
        Type the words at<br />
        positions 4, 12, and 19.
      </div>

      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {indices.map((idx, i) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="mono" style={{ width: 28, color: 'var(--adm-text-3)', fontSize: 11, letterSpacing: '0.06em' }}>
              {String(idx + 1).padStart(2, '0')}
            </div>
            <input
              className="adm-input mono"
              placeholder={`word ${idx + 1}`}
              value={vals[i]}
              onChange={e => {
                const next = [...vals]; next[i] = e.target.value; setVals(next);
              }}
              style={{ fontSize: 13 }}
            />
            {vals[i] === SEED[idx] && (
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7L6 11L12 3" stroke="var(--adm-ember)" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function OnbReady() {
  return (
    <div style={{ paddingTop: 12 }}>
      <Eyebrow>Ready</Eyebrow>
      <div className="display" style={{ fontSize: 32, fontWeight: 300, marginTop: 24, color: 'var(--adm-text-1)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
        Account created.<br />
        <span style={{ color: 'var(--adm-text-2)' }}>The chain is</span><br />
        <span style={{ color: 'var(--adm-ember)' }}>yours to verify.</span>
      </div>
      <div style={{ marginTop: 36, padding: 14, background: 'var(--adm-surface-1)', border: '1px solid var(--adm-border-1)', borderRadius: 12 }}>
        <div className="mono-cap" style={{ color: 'var(--adm-text-3)', marginBottom: 8 }}>Defaults you can change later</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--adm-text-1)' }}>
          <div>· Privacy by default · all sends shielded</div>
          <div>· Verify on app open · on</div>
          <div>· RPC node · local only</div>
          <div>· Network · mainnet</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { VerifyScreen, SettingsScreen, ViewKeysScreen, ViewKeyCreate, Onboarding });
