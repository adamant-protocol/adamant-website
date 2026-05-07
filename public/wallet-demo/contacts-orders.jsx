// Contacts + Standing orders
// Contacts live wallet-side; standing orders are wallet-signed-and-submitted (the chain has no scheduler).

const SAMPLE_CONTACTS = [
  { id: 'c1', label: 'Marie Tremblay', address: 'adm1qz9w8x4r3kn7pq2vh84ml6kfd2c8m9tjpyq84r3kn7fk2', privacy: 'shielded', note: 'Bookkeeper · CPA' },
  { id: 'c2', label: 'Lattice Treasury', address: 'adm1latticeq9k4t9mjxlz6h2vp7kfdk8r3jd2c8m', privacy: 'shielded', note: 'DAO multisig' },
  { id: 'c3', label: 'Carlos · Rent', address: 'adm1qx1f2c8m9tjpyq84r3kn7fk2pq2vh84ml6kfd', privacy: 'shielded', note: '' },
  { id: 'c4', label: 'Public bounty pool', address: 'adm1pub2x6kf8r3jd2c8m9tjpyq84r3kn7fk299x0', privacy: 'transparent', note: 'Open-source grants' },
  { id: 'c5', label: 'Eddy LP', address: 'adm1eddyqz9w8x4r3kn7pq2vh84ml6kfd2c8m9tjp', privacy: 'shielded', note: 'AMM contract · self-custody' },
];

const SAMPLE_STANDING_ORDERS = [
  {
    id: 'so1', label: 'Rent · Carlos',
    contactId: 'c3', amount: 1200, cadence: 'monthly',
    nextRun: 'Jun 1 · 09:00', startedISO: '2026-02-01',
    runs: 4, ends: 'after 12 runs',
    shielded: true, memo: 'Rent · {month}',
    status: 'active',
  },
  {
    id: 'so2', label: 'Bookkeeping retainer',
    contactId: 'c1', amount: 240, cadence: 'monthly',
    nextRun: 'May 28 · 14:00', startedISO: '2025-11-28',
    runs: 7, ends: 'no end',
    shielded: true, memo: 'CPA retainer',
    status: 'active',
  },
  {
    id: 'so3', label: 'DAO contribution',
    contactId: 'c2', amount: 50, cadence: 'weekly',
    nextRun: 'May 12 · 12:00', startedISO: '2026-03-10',
    runs: 8, ends: 'no end',
    shielded: true, memo: 'Weekly stipend',
    status: 'paused',
  },
];

// Helper: human-readable cadence
function cadenceLabel(c) {
  return { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', custom: 'Custom' }[c] || c;
}

// ── Contacts list ─────────────────────────────────
function ContactsScreen({ onBack, contacts, onAdd, onEdit, onPick }) {
  const [q, setQ] = React.useState('');
  const list = contacts.filter(c =>
    c.label.toLowerCase().includes(q.toLowerCase()) || c.address.toLowerCase().includes(q.toLowerCase())
  );
  const grouped = list.reduce((acc, c) => {
    const key = c.label[0].toUpperCase();
    (acc[key] = acc[key] || []).push(c);
    return acc;
  }, {});
  const keys = Object.keys(grouped).sort();

  return (
    <div className="adm-scroll" style={{ padding: '12px 0 100px', height: '100%', overflow: 'auto' }}>
      <div style={{ padding: '0 20px' }}>
        <ScreenHeader title="Contacts" onBack={onBack} action={
          <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }} onClick={onAdd}>
            <svg width="11" height="11" viewBox="0 0 11 11"><path d="M5.5 1V10M1 5.5H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            New
          </button>
        } />
      </div>

      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ position: 'relative' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" style={{ position: 'absolute', left: 14, top: 13 }}>
            <circle cx="6" cy="6" r="4.5" stroke="var(--adm-text-3)" strokeWidth="1.2" fill="none"/>
            <path d="M9.5 9.5L13 13" stroke="var(--adm-text-3)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <input className="adm-input" value={q} onChange={e => setQ(e.target.value)} placeholder="Search · label · address" style={{ paddingLeft: 38, fontSize: 14 }} />
        </div>
      </div>

      {list.length === 0 ? (
        <div style={{ padding: '32px 24px', textAlign: 'left' }}>
          <Eyebrow dot="muted">No contacts yet</Eyebrow>
          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--adm-text-2)', lineHeight: 1.6 }}>
            Saved labels live only on this device. The chain stores nothing about who you call what.
          </div>
          <button className="btn btn-primary" style={{ marginTop: 20, width: '100%' }} onClick={onAdd}>
            + Add first contact
          </button>
        </div>
      ) : (
        <>
          {keys.map(k => (
            <div key={k}>
              <div style={{ padding: '12px 24px 8px' }} className="mono-cap" style={{ color: 'var(--adm-text-3)', padding: '12px 24px 8px', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                {k}
              </div>
              <div style={{ padding: '0 20px' }}>
                <div className="adm-card" style={{ padding: '0 16px' }}>
                  {grouped[k].map((c, i) => (
                    <ContactRow
                      key={c.id}
                      contact={c}
                      isLast={i === grouped[k].length - 1}
                      onClick={() => onPick ? onPick(c) : onEdit(c)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div style={{ padding: '24px 24px 0', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--adm-text-3)', letterSpacing: '0.04em', lineHeight: 1.7 }}>
            {contacts.length} contact{contacts.length === 1 ? '' : 's'} · stored locally · never synced
          </div>
        </>
      )}
    </div>
  );
}

function ContactRow({ contact, isLast, onClick }) {
  return (
    <div className="row-tap" onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 0',
      borderBottom: isLast ? 'none' : '1px solid var(--adm-border-1)',
      cursor: 'pointer',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: contact.privacy === 'shielded' ? 'var(--adm-ember-faint)' : 'var(--adm-surface-2)',
        border: '1px solid ' + (contact.privacy === 'shielded' ? 'var(--adm-ember-dim)' : 'var(--adm-border-2)'),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 400,
        color: contact.privacy === 'shielded' ? 'var(--adm-ember)' : 'var(--adm-text-2)',
      }}>
        {contact.label[0].toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: 'var(--adm-text-1)' }}>{contact.label}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-3)', marginTop: 2, letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {contact.address.slice(0, 8)}…{contact.address.slice(-6)}
          {contact.note && <span style={{ color: 'var(--adm-text-4)' }}> · {contact.note}</span>}
        </div>
      </div>
      <svg width="8" height="12" viewBox="0 0 8 12" style={{ flexShrink: 0 }}>
        <path d="M1 1l5 5-5 5" stroke="var(--adm-text-4)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

// ── Contact edit/create ─────────────────────────────
function ContactEdit({ contact, onBack, onSave, onDelete }) {
  const isNew = !contact;
  const [label, setLabel] = React.useState(contact?.label || '');
  const [address, setAddress] = React.useState(contact?.address || '');
  const [privacy, setPrivacy] = React.useState(contact?.privacy || 'shielded');
  const [note, setNote] = React.useState(contact?.note || '');

  const valid = label.trim() && address.trim().startsWith('adm1');

  return (
    <div className="adm-scroll" style={{ padding: '12px 20px 100px', height: '100%', overflow: 'auto' }}>
      <ScreenHeader title={isNew ? 'New contact' : 'Edit contact'} onBack={onBack} />

      <Eyebrow>Label</Eyebrow>
      <input className="adm-input" style={{ marginTop: 10 }} value={label} onChange={e => setLabel(e.target.value)} placeholder="What you'll see when sending" />

      <div style={{ height: 24 }} />

      <Eyebrow>Address</Eyebrow>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <input className="adm-input mono" value={address} onChange={e => setAddress(e.target.value)} placeholder="adm1…" style={{ fontSize: 12 }} />
        <button className="btn btn-ghost" style={{ padding: 12, flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="2" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" fill="none"/><rect x="8" y="2" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" fill="none"/><rect x="2" y="8" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>
        </button>
      </div>

      <div style={{ height: 24 }} />

      <Eyebrow>Default privacy</Eyebrow>
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { id: 'shielded', t: 'Shielded · default', d: 'Sends to this contact use Halo 2 by default.' },
          { id: 'transparent', t: 'Transparent', d: 'Sends are public. Use for known public addresses (e.g. exchange deposits).' },
        ].map(o => (
          <button key={o.id} onClick={() => setPrivacy(o.id)} style={{
            background: 'transparent',
            border: '1px solid ' + (privacy === o.id ? 'var(--adm-border-3)' : 'var(--adm-border-1)'),
            borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
            textAlign: 'left',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          }}>
            <div>
              <div style={{ fontSize: 14, color: 'var(--adm-text-1)' }}>{o.t}</div>
              <div style={{ fontSize: 12, color: 'var(--adm-text-3)', marginTop: 2, lineHeight: 1.5 }}>{o.d}</div>
            </div>
            {privacy === o.id && (
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7L6 11L12 3" stroke="var(--adm-ember)" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
            )}
          </button>
        ))}
      </div>

      <div style={{ height: 24 }} />

      <Eyebrow>Note · optional</Eyebrow>
      <input className="adm-input" style={{ marginTop: 10 }} value={note} onChange={e => setNote(e.target.value)} placeholder="Visible to you only" />

      <div style={{ height: 32 }} />

      <button
        className="btn btn-primary"
        style={{ width: '100%', opacity: valid ? 1 : 0.4, pointerEvents: valid ? 'auto' : 'none' }}
        onClick={() => onSave({ id: contact?.id || `c${Date.now()}`, label, address, privacy, note })}
      >
        {isNew ? 'Save contact' : 'Save changes'}
      </button>
      {!isNew && (
        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 10, color: 'var(--adm-text-3)' }} onClick={() => onDelete(contact.id)}>
          Delete contact
        </button>
      )}

      <div style={{ marginTop: 20, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--adm-text-3)', letterSpacing: '0.04em', lineHeight: 1.7 }}>
        Stored locally on this device. The chain learns nothing about your label.
      </div>
    </div>
  );
}

// ── Standing orders list ────────────────────────────
function StandingOrdersScreen({ onBack, orders, contacts, onCreate, onOpen, onToggle }) {
  const active = orders.filter(o => o.status === 'active');
  const paused = orders.filter(o => o.status === 'paused');

  return (
    <div className="adm-scroll" style={{ padding: '12px 0 100px', height: '100%', overflow: 'auto' }}>
      <div style={{ padding: '0 20px' }}>
        <ScreenHeader title="Standing orders" onBack={onBack} action={
          <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }} onClick={onCreate}>
            <svg width="11" height="11" viewBox="0 0 11 11"><path d="M5.5 1V10M1 5.5H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            New
          </button>
        } />
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ fontSize: 13, color: 'var(--adm-text-2)', lineHeight: 1.6 }}>
          Recurring transactions your wallet signs and submits on schedule. The chain has no scheduler — your device must be online when an order runs, or it queues until next launch.
        </div>
      </div>

      {orders.length === 0 ? (
        <div style={{ padding: '20px 24px' }}>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={onCreate}>
            + Create first standing order
          </button>
        </div>
      ) : (
        <>
          <div style={{ padding: '0 20px 12px' }}>
            <Eyebrow>Active · {active.length}</Eyebrow>
          </div>
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {active.map(o => (
              <StandingOrderCard key={o.id} order={o} contact={contacts.find(c => c.id === o.contactId)} onClick={() => onOpen(o)} onToggle={() => onToggle(o.id)} />
            ))}
          </div>

          {paused.length > 0 && (
            <>
              <div style={{ padding: '24px 20px 12px' }}>
                <Eyebrow dot="muted">Paused · {paused.length}</Eyebrow>
              </div>
              <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {paused.map(o => (
                  <StandingOrderCard key={o.id} order={o} contact={contacts.find(c => c.id === o.contactId)} onClick={() => onOpen(o)} onToggle={() => onToggle(o.id)} paused />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

function StandingOrderCard({ order, contact, onClick, onToggle, paused, compact }) {
  return (
    <div className={`adm-card row-tap ${paused ? 'paused' : ''}`} onClick={onClick} style={{
      padding: compact ? '12px 14px' : 14,
      cursor: 'pointer',
      opacity: paused ? 0.55 : 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 6, height: 6, borderRadius: 3,
              background: paused ? 'var(--adm-text-4)' : 'var(--adm-ember)',
              boxShadow: paused ? 'none' : '0 0 8px var(--adm-ember-dim)',
              flexShrink: 0,
            }} />
            <div style={{ fontSize: 14, color: 'var(--adm-text-1)' }}>{order.label}</div>
          </div>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--adm-text-3)' }}>
            <span>{cadenceLabel(order.cadence)}</span>
            <span style={{ color: 'var(--adm-text-4)' }}>·</span>
            <span>{order.shielded ? 'Shielded' : 'Transparent'}</span>
            {!paused && (
              <>
                <span style={{ color: 'var(--adm-text-4)' }}>·</span>
                <span>Next {order.nextRun}</span>
              </>
            )}
          </div>
        </div>
        <div className="display" style={{ fontSize: 18, fontWeight: 300, color: 'var(--adm-text-1)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
          −{order.amount.toLocaleString()}
          <span style={{ fontSize: 11, color: 'var(--adm-text-3)', marginLeft: 4 }}>ADM</span>
        </div>
      </div>

      {!compact && contact && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--adm-border-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-2)', letterSpacing: '0.02em' }}>
            → {contact.label}
          </span>
          <button onClick={(e) => { e.stopPropagation(); onToggle(); }} style={{
            background: 'transparent', border: 'none', padding: 0,
            color: 'var(--adm-text-3)', fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer',
          }}>
            {paused ? 'Resume' : 'Pause'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Standing order detail / create ──────────────────
function StandingOrderEdit({ order, contacts, onBack, onSave, onDelete }) {
  const isNew = !order;
  const [label, setLabel] = React.useState(order?.label || '');
  const [contactId, setContactId] = React.useState(order?.contactId || (contacts[0]?.id || ''));
  const [amount, setAmount] = React.useState(order?.amount || '100');
  const [cadence, setCadence] = React.useState(order?.cadence || 'monthly');
  const [shielded, setShielded] = React.useState(order?.shielded ?? true);
  const [memo, setMemo] = React.useState(order?.memo || '');
  const [endsKind, setEndsKind] = React.useState(order?.ends?.startsWith('after') ? 'count' : order?.ends?.startsWith('on') ? 'date' : 'never');
  const [endsCount, setEndsCount] = React.useState(12);

  const contact = contacts.find(c => c.id === contactId);
  const valid = label.trim() && contactId && parseFloat(amount) > 0;

  return (
    <div className="adm-scroll" style={{ padding: '12px 20px 100px', height: '100%', overflow: 'auto' }}>
      <ScreenHeader title={isNew ? 'New standing order' : order.label} onBack={onBack} />

      <Eyebrow>Label</Eyebrow>
      <input className="adm-input" style={{ marginTop: 10 }} value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Rent · Carlos" />

      <div style={{ height: 24 }} />

      <Eyebrow>Recipient</Eyebrow>
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {contacts.length === 0 ? (
          <div style={{ padding: '14px 16px', border: '1px dashed var(--adm-border-2)', borderRadius: 10, fontSize: 13, color: 'var(--adm-text-3)' }}>
            Add a contact first to schedule recurring sends.
          </div>
        ) : (
          contacts.map(c => (
            <button key={c.id} onClick={() => setContactId(c.id)} style={{
              background: 'transparent',
              border: '1px solid ' + (contactId === c.id ? 'var(--adm-border-3)' : 'var(--adm-border-1)'),
              borderRadius: 10, padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: c.privacy === 'shielded' ? 'var(--adm-ember-faint)' : 'var(--adm-surface-2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: 12,
                color: c.privacy === 'shielded' ? 'var(--adm-ember)' : 'var(--adm-text-2)',
                flexShrink: 0,
              }}>
                {c.label[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, color: 'var(--adm-text-1)' }}>{c.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--adm-text-3)', marginTop: 2 }}>
                  {c.address.slice(0, 8)}…{c.address.slice(-6)}
                </div>
              </div>
              {contactId === c.id && (
                <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7L6 11L12 3" stroke="var(--adm-ember)" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
              )}
            </button>
          ))
        )}
      </div>

      <div style={{ height: 24 }} />

      <Eyebrow>Amount per run</Eyebrow>
      <div style={{ marginTop: 10, padding: '16px', background: 'var(--adm-surface-1)', border: '1px solid var(--adm-border-1)', borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <input
            className="display"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 30, fontWeight: 300, color: 'var(--adm-text-1)',
              letterSpacing: '-0.025em', minWidth: 0,
            }}
          />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--adm-text-3)' }}>ADM</span>
        </div>
      </div>

      <div style={{ height: 24 }} />

      <Eyebrow>Cadence</Eyebrow>
      <div className="adm-seg" style={{ marginTop: 10 }}>
        {['daily', 'weekly', 'monthly', 'custom'].map(k => (
          <button key={k} className={`adm-seg-btn ${cadence === k ? 'active' : ''}`} onClick={() => setCadence(k)}>
            {cadenceLabel(k)}
          </button>
        ))}
      </div>

      <div style={{ height: 24 }} />

      <Eyebrow>Ends</Eyebrow>
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { k: 'never', t: 'Never' },
          { k: 'count', t: `After ${endsCount} runs` },
          { k: 'date', t: 'On a specific date' },
        ].map(o => (
          <button key={o.k} onClick={() => setEndsKind(o.k)} style={{
            background: 'transparent',
            border: '1px solid ' + (endsKind === o.k ? 'var(--adm-border-3)' : 'var(--adm-border-1)'),
            borderRadius: 10, padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: 14, color: 'var(--adm-text-1)',
          }}>
            <span>{o.t}</span>
            {endsKind === o.k && (
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7L6 11L12 3" stroke="var(--adm-ember)" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
            )}
          </button>
        ))}
      </div>

      <div style={{ height: 24 }} />

      <Eyebrow>Memo · optional</Eyebrow>
      <input className="adm-input" style={{ marginTop: 10 }} value={memo} onChange={e => setMemo(e.target.value)} placeholder="Visible to recipient · use {month} for current month" />
      <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--adm-text-3)', letterSpacing: '0.04em' }}>
        Tokens · {'{month}'} · {'{date}'} · {'{run}'}
      </div>

      <div style={{ height: 24 }} />

      {/* Constraint disclosure */}
      <div className="adm-card" style={{
        padding: 14,
        background: 'var(--adm-ember-faint)',
        borderColor: 'var(--adm-ember-dim)',
      }}>
        <Eyebrow dot="ember">How standing orders execute</Eyebrow>
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--adm-text-2)', lineHeight: 1.6 }}>
          Adamant has no on-chain scheduler. Your wallet signs and submits each run from this device when it is unlocked. If your wallet is offline at the scheduled time, the run queues until next launch and submits then.
        </div>
      </div>

      <div style={{ height: 32 }} />

      <button
        className="btn btn-primary"
        style={{ width: '100%', opacity: valid ? 1 : 0.4, pointerEvents: valid ? 'auto' : 'none' }}
        onClick={() => onSave({
          id: order?.id || `so${Date.now()}`,
          label, contactId, amount: parseFloat(amount), cadence,
          shielded, memo,
          ends: endsKind === 'never' ? 'no end' : endsKind === 'count' ? `after ${endsCount} runs` : 'on date',
          nextRun: order?.nextRun || 'Jun 1 · 09:00',
          startedISO: order?.startedISO || new Date().toISOString().slice(0, 10),
          runs: order?.runs || 0,
          status: order?.status || 'active',
        })}
      >
        {isNew ? 'Create standing order' : 'Save changes'}
      </button>
      {!isNew && (
        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 10, color: 'var(--adm-text-3)' }} onClick={() => onDelete(order.id)}>
          Delete standing order
        </button>
      )}
    </div>
  );
}

Object.assign(window, {
  SAMPLE_CONTACTS, SAMPLE_STANDING_ORDERS,
  ContactsScreen, ContactEdit,
  StandingOrdersScreen, StandingOrderEdit, StandingOrderCard,
  cadenceLabel,
});
