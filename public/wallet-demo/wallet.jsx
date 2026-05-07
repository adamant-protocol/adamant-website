// Wallet tab — Home, Send, Receive, Tx Detail

const ADM_PRICE_USD = 1.42;

const SAMPLE_TXS = [
  { id: 't1', kind: 'in', shielded: true, amount: 124.50, peer: 'Stealth · self', memo: 'Invoice #2026-039', when: '2m ago', status: 'final' },
  { id: 't2', kind: 'out', shielded: true, amount: 12.00, peer: 'adm1qz9w…7fk2', memo: 'Coffee', when: '34m ago', status: 'final' },
  { id: 't3', kind: 'out', shielded: false, amount: 500.00, peer: 'adm1pub2…99x0', memo: 'Public bounty payout', when: '5h ago', status: 'final' },
  { id: 't4', kind: 'in', shielded: true, amount: 2400.00, peer: 'Stealth · self', memo: '', when: 'yesterday', status: 'final' },
  { id: 't5', kind: 'out', shielded: true, amount: 240.00, peer: 'Marie Tremblay', memo: 'CPA retainer', when: '2 days ago', status: 'final', standingOrder: 'Bookkeeping retainer' },
];

function formatADM(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

function WalletHome({ onNav, onTx, onVerify, balanceVisible, account, fiat, setFiat, contacts, orders, onOpenOrders, onOpenContacts }) {
  const [seg, setSeg] = React.useState('shielded');
  const shieldedBal = 18432.07;
  const transparentBal = 240.00;
  const bal = seg === 'shielded' ? shieldedBal : transparentBal;
  const activeOrders = (orders || []).filter(o => o.status === 'active');

  return (
    <div className="adm-scroll" style={{ padding: '0 0 80px', height: '100%', overflow: 'auto' }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AdmMark size={22} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--adm-text-3)', textTransform: 'uppercase' }}>Account</div>
            <div style={{ fontSize: 13, color: 'var(--adm-text-1)', marginTop: 2 }}>{account}</div>
          </div>
        </div>
        <button className="btn" style={{ padding: 8, background: 'transparent', border: 'none' }} onClick={() => onNav('settings')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="2.5" stroke="var(--adm-text-2)" strokeWidth="1.4"/>
            <path d="M10 1.5v3M10 15.5v3M18.5 10h-3M4.5 10h-3M16 4l-2 2M6 14l-2 2M16 16l-2-2M6 6L4 4" stroke="var(--adm-text-2)" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Balance block */}
      <div style={{ padding: '36px 24px 24px', textAlign: 'left' }}>
        <Eyebrow dot="ember">Balance · {seg === 'shielded' ? 'Shielded' : 'Transparent'}</Eyebrow>
        <div className="display" style={{ fontSize: 56, fontWeight: 300, marginTop: 14, color: 'var(--adm-text-1)', lineHeight: 1, letterSpacing: '-0.04em' }}>
          {balanceVisible ? formatADM(bal) : '••••••'}
          <span style={{ fontSize: 22, color: 'var(--adm-text-3)', marginLeft: 4, fontWeight: 300 }}>ADM</span>
        </div>
        <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--adm-text-3)', letterSpacing: '0.06em', cursor: 'pointer' }} onClick={() => setFiat(!fiat)}>
          {fiat ? `≈ $${(bal * ADM_PRICE_USD).toLocaleString('en-US', { maximumFractionDigits: 2 })} USD` : '— show fiat'}
        </div>
      </div>

      {/* Shielded / Transparent segmented */}
      <div style={{ padding: '0 20px 28px' }}>
        <div className="adm-seg">
          <button className={`adm-seg-btn ${seg === 'shielded' ? 'active' : ''}`} onClick={() => setSeg('shielded')}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="9" height="11" viewBox="0 0 9 11"><path d="M4.5 0.5 L8.5 2 V5.5 C8.5 8 6.5 9.8 4.5 10.5 C2.5 9.8 0.5 8 0.5 5.5 V2 Z" stroke="currentColor" fill="none" strokeWidth="1"/></svg>
              Shielded
            </span>
          </button>
          <button className={`adm-seg-btn ${seg === 'transparent' ? 'active' : ''}`} onClick={() => setSeg('transparent')}>
            Transparent
          </button>
        </div>
      </div>

      {/* Three primary actions */}
      <div style={{ padding: '0 20px 36px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <ActionTile icon="send" label="Send" onClick={() => onNav('send')} />
        <ActionTile icon="receive" label="Receive" onClick={() => onNav('receive')} />
        <ActionTile icon="verify" label="Verify" onClick={onVerify} />
      </div>

      {/* Standing orders strip */}
      {activeOrders.length > 0 && (
        <div style={{ padding: '0 20px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <Eyebrow dot="ember">Standing orders · {activeOrders.length} active</Eyebrow>
            <button onClick={onOpenOrders} style={{
              background: 'transparent', border: 'none', padding: 0,
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--adm-text-3)', cursor: 'pointer',
            }}>Manage</button>
          </div>
          <div className="adm-scroll" style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -20px', padding: '0 20px' }}>
            {activeOrders.map(o => {
              const c = (contacts || []).find(c => c.id === o.contactId);
              return (
                <div key={o.id} className="row-tap" onClick={onOpenOrders} style={{
                  flexShrink: 0, width: 220,
                  background: 'var(--adm-surface-1)',
                  border: '1px solid var(--adm-border-1)',
                  borderRadius: 12, padding: 14, cursor: 'pointer',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--adm-ember)', boxShadow: '0 0 8px var(--adm-ember-dim)' }} />
                    <span style={{ fontSize: 13, color: 'var(--adm-text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.label}</span>
                  </div>
                  <div className="display" style={{ marginTop: 12, fontSize: 22, fontWeight: 300, color: 'var(--adm-text-1)', letterSpacing: '-0.025em' }}>
                    {o.amount.toLocaleString()}
                    <span style={{ fontSize: 11, color: 'var(--adm-text-3)', marginLeft: 4 }}>ADM</span>
                  </div>
                  <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', color: 'var(--adm-text-3)' }}>
                    {cadenceLabel(o.cadence)} · next {o.nextRun}
                  </div>
                  {c && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--adm-border-1)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-2)' }}>
                      → {c.label}
                    </div>
                  )}
                </div>
              );
            })}
            <div onClick={onOpenOrders} className="row-tap" style={{
              flexShrink: 0, width: 80,
              border: '1px dashed var(--adm-border-2)', borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--adm-text-3)',
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            </div>
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div style={{ padding: '0 20px 24px' }}>
        <SectionHead eyebrow="Recent activity" />
        <div className="adm-card" style={{ overflow: 'hidden' }}>
          {SAMPLE_TXS.slice(0, 5).map((tx, i) => (
            <TxRow key={tx.id} tx={tx} isLast={i === 4} onClick={() => onTx(tx)} />
          ))}
        </div>
      </div>

      {/* Verified footer */}
      <div style={{ borderTop: '1px solid var(--adm-border-1)', marginTop: 16 }}>
        <ChainVerifiedFooter secondsAgo={142} ms={250} onTap={onVerify} />
      </div>
    </div>
  );
}

function ActionTile({ icon, label, onClick }) {
  const icons = {
    send: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 14V4M9 4L4.5 8.5M9 4L13.5 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" transform="rotate(45 9 9)"/></svg>,
    receive: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 4V14M9 14L4.5 9.5M9 14L13.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" transform="rotate(45 9 9)"/></svg>,
    verify: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5L15 4V8.5C15 12 12.5 14.5 9 16C5.5 14.5 3 12 3 8.5V4L9 1.5Z" stroke="currentColor" strokeWidth="1.3" fill="none"/><path d="M6.5 9L8.5 11L11.5 7.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  };
  return (
    <button onClick={onClick} className="row-tap" style={{
      background: 'var(--adm-surface-1)',
      border: '1px solid var(--adm-border-1)',
      borderRadius: 14,
      padding: '18px 8px 14px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      color: 'var(--adm-text-1)', cursor: 'pointer',
    }}>
      {icons[icon]}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--adm-text-2)' }}>{label}</span>
    </button>
  );
}

function TxRow({ tx, isLast, onClick }) {
  const sign = tx.kind === 'in' ? '+' : '−';
  const color = tx.kind === 'in' ? 'var(--adm-text-1)' : 'var(--adm-text-2)';
  return (
    <div className="row-tap" onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px',
      borderBottom: isLast ? 'none' : '1px solid var(--adm-border-1)',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        border: '1px solid var(--adm-border-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--adm-text-2)',
      }}>
        {tx.kind === 'in'
          ? <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 7L6 10L9 7M6 10V2" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
          : <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 5L6 2L9 5M6 2V10" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, color: 'var(--adm-text-1)' }}>{tx.peer}</span>
          {!tx.shielded && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.18em',
              color: 'var(--adm-text-3)', textTransform: 'uppercase',
            }}>· transparent</span>
          )}
          {tx.standingOrder && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em',
              color: 'var(--adm-ember)', textTransform: 'uppercase',
              padding: '2px 6px',
              border: '1px solid var(--adm-ember-dim)',
              borderRadius: 4,
            }}>
              <svg width="7" height="7" viewBox="0 0 7 7"><circle cx="3.5" cy="3.5" r="3" stroke="currentColor" strokeWidth="0.8" fill="none"/><path d="M3.5 1.5V3.5L4.7 4.4" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round"/></svg>
              auto
            </span>
          )}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-3)', marginTop: 2, letterSpacing: '0.04em' }}>
          {tx.standingOrder ? `${tx.standingOrder} · ${tx.when}` : tx.memo ? `${tx.memo} · ${tx.when}` : tx.when}
        </div>
      </div>
      <div className="display" style={{ fontSize: 16, color, fontWeight: 300, letterSpacing: '-0.02em' }}>
        {sign}{formatADM(tx.amount)}
      </div>
    </div>
  );
}

// ── Send flow ──────────────────────────────────────
function SendScreen({ onBack, onNav, contacts, onSavedContact }) {
  const [step, setStep] = React.useState('compose'); // compose | review | confirm
  const [recipient, setRecipient] = React.useState('adm1qz9w8x4r3kn7p…7fk2');
  const [pickedContact, setPickedContact] = React.useState(null);
  const [amount, setAmount] = React.useState('250');
  const [memo, setMemo] = React.useState('Invoice #2026-040');
  const [transparent, setTransparent] = React.useState(false);
  const [feeOpen, setFeeOpen] = React.useState(false);
  const [pickerOpen, setPickerOpen] = React.useState(false);

  if (step === 'review') return <SendReview {...{ recipient, amount, memo, transparent, pickedContact, onBack: () => setStep('compose'), onSign: () => setStep('confirm') }} />;
  if (step === 'confirm') return <SendConfirmed {...{ amount, recipient, transparent, pickedContact, contacts, onSavedContact, onDone: () => onNav('wallet') }} />;

  if (pickerOpen) {
    return (
      <ContactsScreen
        contacts={contacts || []}
        onBack={() => setPickerOpen(false)}
        onAdd={() => setPickerOpen(false)}
        onEdit={() => {}}
        onPick={(c) => { setPickedContact(c); setRecipient(c.address); setTransparent(c.privacy === 'transparent'); setPickerOpen(false); }}
      />
    );
  }

  const recents = (contacts || []).slice(0, 3);

  return (
    <div className="adm-scroll" style={{ padding: '12px 20px 100px', height: '100%', overflow: 'auto' }}>
      <ScreenHeader title="Send" onBack={onBack} />

      <Eyebrow>To</Eyebrow>
      {pickedContact ? (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--adm-surface-1)', border: '1px solid var(--adm-border-2)', borderRadius: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: pickedContact.privacy === 'shielded' ? 'var(--adm-ember-faint)' : 'var(--adm-surface-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 13,
            color: pickedContact.privacy === 'shielded' ? 'var(--adm-ember)' : 'var(--adm-text-2)',
          }}>{pickedContact.label[0].toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, color: 'var(--adm-text-1)' }}>{pickedContact.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-3)', marginTop: 2 }}>
              {pickedContact.address.slice(0, 8)}…{pickedContact.address.slice(-6)}
            </div>
          </div>
          <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 11 }} onClick={() => { setPickedContact(null); setRecipient(''); }}>Change</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <input className="adm-input mono" value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="adm1… · paste address" />
            <button className="btn btn-ghost" style={{ padding: 12, flexShrink: 0 }} aria-label="Scan QR">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="11" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="2" y="11" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M11 11h2v2M14 14v2h2v-2M11 16h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </button>
          </div>
          {recents.length > 0 && (
            <>
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--adm-text-3)' }}>Contacts</span>
                <button onClick={() => setPickerOpen(true)} style={{ background: 'transparent', border: 'none', padding: 0, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--adm-text-2)', cursor: 'pointer' }}>See all →</button>
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {recents.map(c => (
                  <button key={c.id} onClick={() => { setPickedContact(c); setRecipient(c.address); setTransparent(c.privacy === 'transparent'); }} style={{
                    background: 'var(--adm-surface-1)', border: '1px solid var(--adm-border-1)',
                    borderRadius: 999, padding: '8px 12px', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    fontSize: 12, color: 'var(--adm-text-1)',
                  }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, background: c.privacy === 'shielded' ? 'var(--adm-ember-faint)' : 'var(--adm-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: 10, color: c.privacy === 'shielded' ? 'var(--adm-ember)' : 'var(--adm-text-2)' }}>{c.label[0].toUpperCase()}</div>
                    {c.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <div style={{ height: 24 }} />

      <Eyebrow>Amount</Eyebrow>
      <div style={{ marginTop: 10, padding: '20px 16px', background: 'var(--adm-surface-1)', border: '1px solid var(--adm-border-1)', borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <input
            className="display"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 38, fontWeight: 300, color: 'var(--adm-text-1)',
              letterSpacing: '-0.025em', minWidth: 0,
            }}
          />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--adm-text-3)' }}>ADM</span>
        </div>
        <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-3)' }}>
          ≈ ${(parseFloat(amount || 0) * ADM_PRICE_USD).toFixed(2)} USD · Available 18,432.07
        </div>
      </div>

      <div style={{ height: 24 }} />

      {/* Privacy panel */}
      <div style={{
        padding: '14px 16px',
        background: transparent ? 'var(--adm-surface-1)' : 'var(--adm-ember-faint)',
        border: `1px solid ${transparent ? 'var(--adm-border-2)' : 'var(--adm-ember-dim)'}`,
        borderRadius: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: transparent ? 'var(--adm-surface-3)' : 'rgba(255,125,77,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {transparent
              ? <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="3" stroke="var(--adm-text-2)" strokeWidth="1.2" fill="none"/><path d="M1 7C2.5 4 4.5 2.5 7 2.5C9.5 2.5 11.5 4 13 7C11.5 10 9.5 11.5 7 11.5C4.5 11.5 2.5 10 1 7Z" stroke="var(--adm-text-2)" strokeWidth="1.2" fill="none"/></svg>
              : <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1L12 2.5V7C12 10 9.7 12.5 7 13.5C4.3 12.5 2 10 2 7V2.5L7 1Z" stroke="var(--adm-ember)" strokeWidth="1.2" fill="none"/></svg>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: 'var(--adm-text-1)', fontWeight: 500 }}>
              {transparent ? 'This transaction will be visible to the public chain.' : 'This transaction will be private.'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--adm-text-2)', marginTop: 4, lineHeight: 1.5 }}>
              {transparent
                ? 'Sender, recipient, amount and memo are publicly visible. The chain will retain this record indefinitely.'
                : 'Sender, recipient, amount and memo are concealed by Halo 2 proof. Only you and your recipient can decrypt this transaction.'}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--adm-border-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="mono-cap" style={{ color: 'var(--adm-text-2)' }}>Make transparent</span>
          <Toggle on={transparent} onChange={setTransparent} />
        </div>
      </div>

      <div style={{ height: 24 }} />

      <Eyebrow>Encrypted memo</Eyebrow>
      <input className="adm-input" style={{ marginTop: 10 }} value={memo} onChange={e => setMemo(e.target.value)} placeholder="Visible to recipient only" />

      <div style={{ height: 24 }} />

      {/* Fee panel */}
      <div className="adm-card" style={{ padding: '12px 16px' }}>
        <div onClick={() => setFeeOpen(!feeOpen)} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Eyebrow dot="muted">Network fee</Eyebrow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="mono" style={{ fontSize: 13, color: 'var(--adm-text-1)' }}>0.00012 ADM</span>
            <svg width="10" height="10" viewBox="0 0 10 10" style={{ transform: feeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
              <path d="M2 4L5 7L8 4" stroke="var(--adm-text-3)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        {feeOpen && (
          <div className="adm-fade" style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--adm-border-1)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['Computation', '0.00003'],
              ['State storage', '0.00002'],
              ['State rent · prepaid', '0.00002'],
              ['Bandwidth', '0.00001'],
              ['Proof verification', '0.00003'],
              ['Proof generation', '0.00001'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-2)' }}>
                <span style={{ letterSpacing: '0.18em', textTransform: 'uppercase' }}>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ height: 32 }} />

      <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setStep('review')}>
        Review
      </button>
    </div>
  );
}

function SendReview({ recipient, amount, memo, transparent, onBack, onSign }) {
  return (
    <div className="adm-scroll" style={{ padding: '12px 20px 100px', height: '100%', overflow: 'auto' }}>
      <ScreenHeader title="Review" onBack={onBack} />

      <div style={{ marginTop: 8, padding: '20px 0' }}>
        <Eyebrow dot={transparent ? 'cold' : 'ember'}>{transparent ? 'Transparent transaction' : 'Private transaction'}</Eyebrow>
        <div className="display" style={{ fontSize: 44, fontWeight: 300, marginTop: 12, color: 'var(--adm-text-1)', letterSpacing: '-0.03em' }}>
          {amount}
          <span style={{ fontSize: 18, color: 'var(--adm-text-3)', marginLeft: 8 }}>ADM</span>
        </div>
        <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-3)' }}>
          ≈ ${(parseFloat(amount) * ADM_PRICE_USD).toFixed(2)} USD
        </div>
      </div>

      <div className="adm-card" style={{ padding: '4px 16px' }}>
        {[
          ['To', recipient],
          ['Memo', memo || '—'],
          ['Network fee', '0.00012 ADM'],
          ['Privacy', transparent ? 'Public · visible on chain' : 'Shielded · Halo 2'],
          ['Estimated finality', '~500 ms'],
        ].map(([k, v], i, arr) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--adm-border-1)' }}>
            <span className="mono-cap" style={{ color: 'var(--adm-text-3)' }}>{k}</span>
            <span style={{ fontFamily: k === 'To' ? 'var(--font-mono)' : 'var(--font-body)', fontSize: 13, color: 'var(--adm-text-1)', letterSpacing: k === 'To' ? '0.04em' : '-0.01em' }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ height: 32 }} />
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={onSign}>
        Sign and submit
      </button>
      <button className="btn btn-ghost" style={{ width: '100%', marginTop: 10 }} onClick={onBack}>
        Edit
      </button>
    </div>
  );
}

function SendConfirmed({ amount, recipient, transparent, pickedContact, contacts, onSavedContact, onDone }) {
  const [stage, setStage] = React.useState(0);
  const [saveOpen, setSaveOpen] = React.useState(false);
  const [saveLabel, setSaveLabel] = React.useState('');
  const [saved, setSaved] = React.useState(false);

  // Show save CTA only if recipient isn't already a known contact
  const isKnown = pickedContact || (contacts || []).some(c => c.address === recipient);

  React.useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 400);
    const t2 = setTimeout(() => setStage(2), 1100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const doSave = () => {
    if (!saveLabel.trim()) return;
    onSavedContact && onSavedContact({
      id: `c${Date.now()}`,
      label: saveLabel.trim(),
      address: recipient,
      privacy: transparent ? 'transparent' : 'shielded',
      note: '',
    });
    setSaved(true);
    setSaveOpen(false);
  };
  return (
    <div style={{ padding: '40px 24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
        <Eyebrow dot={stage === 2 ? 'ember' : 'muted'}>
          {stage === 0 ? 'Submitting' : stage === 1 ? 'Sequencing' : 'Final'}
        </Eyebrow>
        <div className="display" style={{ fontSize: 32, fontWeight: 300, marginTop: 20, color: 'var(--adm-text-1)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
          {stage < 2 ? <span style={{ color: 'var(--adm-text-2)' }}>Sending</span> : 'Sent.'}
          <br />
          <span style={{ color: stage === 2 ? 'var(--adm-ember)' : 'var(--adm-text-1)' }}>{amount} ADM</span>
        </div>

        <div style={{ marginTop: 32, width: '100%', maxWidth: 280 }}>
          <div className="adm-bar" style={{ height: 2 }}>
            <div className="adm-bar-fill" style={{
              width: stage === 0 ? '20%' : stage === 1 ? '70%' : '100%',
              transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
          </div>
          <div style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-3)', letterSpacing: '0.06em' }}>
            tx · {stage === 0 ? '042 ms' : stage === 1 ? '180 ms' : '487 ms · finalised'}
          </div>
        </div>

        {stage === 2 && (
          <div className="adm-fade" style={{ marginTop: 32, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-3)', letterSpacing: '0.04em' }}>
            <div>tx_hash · 0x9e3a…f17b</div>
            <div style={{ marginTop: 4 }}>{transparent ? 'transparent · public record' : 'shielded · halo2 proof verified'}</div>
          </div>
        )}

        {stage === 2 && !isKnown && !saved && (
          <div className="adm-fade" style={{ marginTop: 28, width: '100%' }}>
            {!saveOpen ? (
              <button onClick={() => setSaveOpen(true)} style={{
                width: '100%',
                background: 'var(--adm-surface-1)',
                border: '1px solid var(--adm-border-2)',
                borderRadius: 12, padding: '14px 16px',
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
              }}>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--adm-text-1)' }}>Save recipient as contact</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', color: 'var(--adm-text-3)', marginTop: 2 }}>
                    Stored locally · the chain learns nothing
                  </div>
                </div>
                <svg width="10" height="14" viewBox="0 0 10 14"><path d="M2 1l5 6-5 6" stroke="var(--adm-text-3)" strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
              </button>
            ) : (
              <div style={{ background: 'var(--adm-surface-1)', border: '1px solid var(--adm-border-2)', borderRadius: 12, padding: 14 }}>
                <Eyebrow>Save as contact</Eyebrow>
                <input
                  className="adm-input"
                  autoFocus
                  style={{ marginTop: 10 }}
                  value={saveLabel}
                  onChange={e => setSaveLabel(e.target.value)}
                  placeholder="Label · e.g. Carlos · Rent"
                />
                <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--adm-text-3)', letterSpacing: '0.04em' }}>
                  {recipient.slice(0, 16)}…{recipient.slice(-6)} · {transparent ? 'transparent' : 'shielded'}
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setSaveOpen(false)}>Cancel</button>
                  <button className="btn btn-primary" style={{ flex: 1, opacity: saveLabel.trim() ? 1 : 0.4 }} onClick={doSave}>Save</button>
                </div>
              </div>
            )}
          </div>
        )}

        {stage === 2 && saved && (
          <div className="adm-fade" style={{ marginTop: 28, padding: '12px 14px', background: 'var(--adm-ember-faint)', border: '1px solid var(--adm-ember-dim)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7L6 11L12 3" stroke="var(--adm-ember)" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
            <span style={{ fontSize: 13, color: 'var(--adm-text-1)' }}>Contact saved</span>
          </div>
        )}
      </div>
      <button className="btn btn-ghost" style={{ width: '100%' }} onClick={onDone}>Done</button>
    </div>
  );
}

// ── Receive ────────────────────────────────────────
function ReceiveScreen({ onBack, account }) {
  const [mode, setMode] = React.useState('default'); // default | stealth
  const [stealthGenerated, setStealthGenerated] = React.useState(false);

  const addr = mode === 'default'
    ? 'adm1qz9w8x4r3kn7pq2vh84ml6kfd2c8m9tjpyq84r3kn7fk2'
    : 'adm1stealth9q2v4n7pcr8gk4t9mjxlz6h2vp7kfd';

  return (
    <div className="adm-scroll" style={{ padding: '12px 20px 100px', height: '100%', overflow: 'auto' }}>
      <ScreenHeader title="Receive" onBack={onBack} />

      <div style={{ marginTop: 8 }} className="adm-seg">
        <button className={`adm-seg-btn ${mode === 'default' ? 'active' : ''}`} onClick={() => setMode('default')}>Default</button>
        <button className={`adm-seg-btn ${mode === 'stealth' ? 'active' : ''}`} onClick={() => { setMode('stealth'); setStealthGenerated(true); }}>Stealth · One-time</button>
      </div>

      <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* QR placeholder */}
        <div style={{ width: 220, height: 220, background: 'var(--adm-text-1)', borderRadius: 16, padding: 12, position: 'relative' }}>
          <FakeQR seed={addr} />
        </div>

        <div style={{ marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.04em', color: 'var(--adm-text-2)', textAlign: 'center', wordBreak: 'break-all', padding: '0 24px', lineHeight: 1.5 }}>
          {addr}
        </div>

        <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => navigator.clipboard?.writeText(addr)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 0.5h6v6" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>
          Copy address
        </button>
      </div>

      <div style={{ height: 32 }} />

      {mode === 'stealth' ? (
        <div className="adm-card" style={{ padding: 16 }}>
          <Eyebrow>One-time stealth address</Eyebrow>
          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--adm-text-2)', lineHeight: 1.55 }}>
            Tied to a specific expected payment. Deriving from your view-key, observers cannot link this to your default address. Reusing it weakens unlinkability — generate a fresh one for the next payer.
          </div>
        </div>
      ) : (
        <div className="adm-card" style={{ padding: 16 }}>
          <Eyebrow>Default address</Eyebrow>
          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--adm-text-2)', lineHeight: 1.55 }}>
            Senders publish through stealth-address derivation: each payment lands on a fresh, unlinkable address that only you can recognise. Sharing this address is safe.
          </div>
        </div>
      )}

      <button className="btn btn-ghost" style={{ width: '100%', marginTop: 12 }}>
        Address book
      </button>
    </div>
  );
}

function FakeQR({ seed }) {
  // Pseudo-random pattern based on seed for visual texture
  const cells = React.useMemo(() => {
    const out = [];
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    for (let y = 0; y < 25; y++) for (let x = 0; x < 25; x++) {
      h = (h * 1664525 + 1013904223) >>> 0;
      out.push((h & 1) === 1);
    }
    return out;
  }, [seed]);
  // Three corner markers
  const corner = (cx, cy) => (
    <g key={`${cx}${cy}`}>
      <rect x={cx} y={cy} width="7" height="7" fill="#000" />
      <rect x={cx + 1} y={cy + 1} width="5" height="5" fill="#ece8df" />
      <rect x={cx + 2} y={cy + 2} width="3" height="3" fill="#000" />
    </g>
  );
  return (
    <svg viewBox="0 0 25 25" width="100%" height="100%" shapeRendering="crispEdges">
      {cells.map((on, i) => {
        const x = i % 25, y = Math.floor(i / 25);
        // Skip the corner zones
        if ((x < 8 && y < 8) || (x > 16 && y < 8) || (x < 8 && y > 16)) return null;
        if (!on) return null;
        return <rect key={i} x={x} y={y} width="1" height="1" fill="#000" />;
      })}
      {corner(0, 0)}
      {corner(18, 0)}
      {corner(0, 18)}
    </svg>
  );
}

// ── Tx detail ──────────────────────────────────────
function TxDetail({ tx, onBack }) {
  return (
    <div className="adm-scroll" style={{ padding: '12px 20px 100px', height: '100%', overflow: 'auto' }}>
      <ScreenHeader title="Transaction" onBack={onBack} />

      <div style={{ padding: '24px 0' }}>
        <Eyebrow dot={tx.shielded ? 'ember' : 'cold'}>{tx.shielded ? 'Shielded' : 'Transparent'}</Eyebrow>
        <div className="display" style={{ fontSize: 40, fontWeight: 300, marginTop: 12, color: 'var(--adm-text-1)', letterSpacing: '-0.03em' }}>
          {tx.kind === 'in' ? '+' : '−'}{formatADM(tx.amount)}
          <span style={{ fontSize: 16, color: 'var(--adm-text-3)', marginLeft: 8 }}>ADM</span>
        </div>
        <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-3)' }}>
          ≈ ${(tx.amount * ADM_PRICE_USD).toFixed(2)} USD · {tx.when}
        </div>
      </div>

      <div className="adm-card" style={{ padding: '4px 16px' }}>
        {[
          [tx.kind === 'in' ? 'From' : 'To', tx.peer],
          ['Memo', tx.memo || '—'],
          ['Status', 'Final · 487 ms'],
          ['Round', '#1,847,392'],
          ['Vertex', '0x4c7a2e91…3b8d'],
          ['tx_hash', '0x9e3a4f7c8b2d…f17b'],
        ].map(([k, v], i, arr) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--adm-border-1)' }}>
            <span className="mono-cap" style={{ color: 'var(--adm-text-3)' }}>{k}</span>
            <span style={{ fontFamily: ['From','To','tx_hash'].includes(k) ? 'var(--font-mono)' : 'var(--font-body)', fontSize: 13, color: 'var(--adm-text-1)', letterSpacing: '0.02em' }}>{v}</span>
          </div>
        ))}
      </div>

      <div style={{ height: 24 }} />

      <button className="btn btn-ghost" style={{ width: '100%' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L12 2.5V7C12 10 9.7 12.5 7 13.5C4.3 12.5 2 10 2 7V2.5L7 1Z" stroke="currentColor" strokeWidth="1.2" fill="none"/><path d="M5 7L6.5 8.5L9 6" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
        Generate disclosure proof
      </button>
      <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--adm-text-3)', letterSpacing: '0.04em', textAlign: 'center', lineHeight: 1.5 }}>
        Produces a shareable cryptographic receipt that this transaction occurred,<br />without revealing your other activity.
      </div>
    </div>
  );
}

function ScreenHeader({ title, onBack, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0 24px' }}>
      <button onClick={onBack} className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }}>
        <svg width="12" height="12" viewBox="0 0 12 12"><path d="M8 2L3 6L8 10" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back
      </button>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 400, color: 'var(--adm-text-1)', letterSpacing: '-0.02em' }}>{title}</div>
      <div style={{ minWidth: 64, display: 'flex', justifyContent: 'flex-end' }}>{action}</div>
    </div>
  );
}

Object.assign(window, { WalletHome, SendScreen, ReceiveScreen, TxDetail, ScreenHeader, formatADM, SAMPLE_TXS });
