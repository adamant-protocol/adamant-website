// Adamant — shared UI primitives & helpers

const ADM_MARK = "assets/adm-logo.png";

// Brand A mark — uses the real logo PNG
function AdmMark({ size = 18, color }) {
  // The PNG is white; we render it as-is in dark theme. In light theme
  // we invert it via filter so the strokes go dark on the light bg.
  return (
    <img
      src={ADM_MARK}
      alt="Adamant"
      style={{
        width: size, height: size * (1168 / 784),
        objectFit: 'contain',
        flexShrink: 0,
        filter: 'var(--adm-logo-filter, none)',
        display: 'block',
      }}
    />
  );
}

// Eyebrow label, optional dot color
function Eyebrow({ children, dot = 'ember', className = '' }) {
  const cls = dot === 'cold' ? 'cold' : dot === 'muted' ? 'muted' : dot === 'none' ? 'no-dot' : '';
  return <div className={`adm-eyebrow ${cls} ${className}`}>{children}</div>;
}

// Address truncate with copy
function AddrPill({ value, prefix = 4, suffix = 4, copyable = true }) {
  const [copied, setCopied] = React.useState(false);
  const display = value.length > prefix + suffix + 3
    ? `${value.slice(0, prefix)}…${value.slice(-suffix)}`
    : value;
  return (
    <span className="addr" onClick={(e) => {
      if (!copyable) return;
      e.stopPropagation();
      navigator.clipboard?.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }} style={{ cursor: copyable ? 'pointer' : 'default' }}>
      <span>{display}</span>
      {copyable && (
        copied
          ? <svg width="11" height="11" viewBox="0 0 11 11"><path d="M2 5.5L4.5 8L9 3" stroke="var(--adm-ember)" strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
          : <svg width="11" height="11" viewBox="0 0 11 11" fill="none" opacity="0.5">
              <rect x="2.5" y="2.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1"/>
              <path d="M4.5 0.5h6v6" stroke="currentColor" strokeWidth="1" fill="none"/>
            </svg>
      )}
    </span>
  );
}

// Mutability badge
function MutBadge({ kind, size = 'md' }) {
  const cfg = {
    IMMUTABLE: { cls: 'mut-immutable', label: 'IMMUTABLE',
      icon: <svg width="9" height="9" viewBox="0 0 9 9"><rect x="1.5" y="4" width="6" height="4.5" rx="0.5" fill="none" stroke="currentColor" strokeWidth="1"/><path d="M3 4 V2.8 a1.5 1.5 0 0 1 3 0 V4" stroke="currentColor" strokeWidth="1" fill="none"/></svg> },
    OWNER_UPGRADEABLE: { cls: 'mut-owner', label: 'OWNER UPGRADEABLE',
      icon: <svg width="9" height="9" viewBox="0 0 9 9"><path d="M4.5 1 L8 7.5 H1 Z" stroke="currentColor" strokeWidth="1" fill="none"/><path d="M4.5 4 V5.5" stroke="currentColor" strokeWidth="1"/><circle cx="4.5" cy="6.5" r="0.4" fill="currentColor"/></svg> },
    VOTE_UPGRADEABLE: { cls: 'mut-vote', label: 'VOTE UPGRADEABLE',
      icon: <svg width="9" height="9" viewBox="0 0 9 9"><circle cx="4.5" cy="4.5" r="3.5" stroke="currentColor" strokeWidth="1" fill="none"/><path d="M3 4.5 L4 5.5 L6.5 3" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"/></svg> },
    UPGRADEABLE_UNTIL_FROZEN: { cls: 'mut-frozen', label: 'UNTIL FROZEN',
      icon: <svg width="9" height="9" viewBox="0 0 9 9"><circle cx="4.5" cy="4.5" r="3.5" stroke="currentColor" strokeWidth="1" fill="none"/><path d="M4.5 2.5 V4.5 L6 5.5" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"/></svg> },
    CUSTOM: { cls: 'mut-custom', label: 'CUSTOM',
      icon: <svg width="9" height="9" viewBox="0 0 9 9"><path d="M2 2 L7 2 M2 4.5 L7 4.5 M2 7 L5 7" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"/></svg> },
  };
  const c = cfg[kind] || cfg.IMMUTABLE;
  return (
    <span className={`mut-badge ${c.cls}`} style={size === 'sm' ? { fontSize: 9, padding: '3px 6px' } : {}}>
      {c.icon}
      <span>{c.label}</span>
    </span>
  );
}

// Toggle
function Toggle({ on, onChange }) {
  return <div className={`adm-toggle ${on ? 'on' : ''}`} onClick={() => onChange(!on)} />;
}

// Section header with eyebrow
function SectionHead({ eyebrow, title, action, dotColor = 'ember' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
      <div>
        {eyebrow && <Eyebrow dot={dotColor}>{eyebrow}</Eyebrow>}
        {title && <div style={{
          fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400,
          letterSpacing: '-0.025em', color: 'var(--adm-text-1)', marginTop: 8,
        }}>{title}</div>}
      </div>
      {action}
    </div>
  );
}

// Status bar mock
function StatusBar({ light = false }) {
  const c = light ? '#19171a' : '#ece8df';
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 47,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 28px 0', zIndex: 50, pointerEvents: 'none',
    }}>
      <span style={{ color: c, fontFamily: '-apple-system, system-ui', fontSize: 16, fontWeight: 600 }}>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: c }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="6.5" width="3" height="4" rx="0.6" fill={c}/><rect x="4.5" y="4.5" width="3" height="6" rx="0.6" fill={c}/><rect x="9" y="2.5" width="3" height="8" rx="0.6" fill={c}/><rect x="13.5" y="0" width="3" height="10" rx="0.6" fill={c}/></svg>
        <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 3C9.5 3 11.4 3.8 12.7 5L13.7 4C12 2.4 9.8 1.4 7.5 1.4C5.2 1.4 3 2.4 1.3 4L2.3 5C3.6 3.8 5.5 3 7.5 3Z" fill={c}/><path d="M7.5 6C8.7 6 9.7 6.4 10.5 7.2L11.5 6.2C10.4 5.2 9 4.6 7.5 4.6C6 4.6 4.6 5.2 3.5 6.2L4.5 7.2C5.3 6.4 6.3 6 7.5 6Z" fill={c}/><circle cx="7.5" cy="9" r="1.3" fill={c}/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="2.8" stroke={c} strokeOpacity="0.5" fill="none"/><rect x="2" y="2" width="17" height="7" rx="1.5" fill={c}/><rect x="21.3" y="3.7" width="1.5" height="3.5" rx="0.5" fill={c} opacity="0.5"/></svg>
      </div>
    </div>
  );
}

// Home indicator
function HomeIndicator() {
  return (
    <div style={{
      position: 'absolute', bottom: 8, left: 0, right: 0,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 100,
    }}>
      <div style={{ width: 134, height: 5, borderRadius: 99, background: 'var(--adm-text-1)', opacity: 0.6 }} />
    </div>
  );
}

// Chain verified footer
function ChainVerifiedFooter({ secondsAgo = 142, ms = 250, onTap }) {
  const stale = secondsAgo > 600;
  const timeStr = secondsAgo < 60 ? `${secondsAgo}s ago`
    : secondsAgo < 3600 ? `${Math.floor(secondsAgo / 60)}m ago`
    : `${Math.floor(secondsAgo / 3600)}h ago`;
  return (
    <div className={`chain-status ${stale ? 'stale' : ''}`} onClick={onTap} style={{ cursor: onTap ? 'pointer' : 'default' }}>
      <div className="dot" />
      <span>Chain verified · {timeStr} · {ms}ms</span>
    </div>
  );
}

Object.assign(window, { ADM_MARK, AdmMark, Eyebrow, AddrPill, MutBadge, Toggle, SectionHead, StatusBar, HomeIndicator, ChainVerifiedFooter });
