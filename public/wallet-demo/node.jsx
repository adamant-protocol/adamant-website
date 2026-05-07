// Node tab — phone-based Node Watcher + opt-in participation in the watcher pool
// Honest framing: a phone can't be a full Node Runner. It can be an always-on
// Node Watcher (light verifier) and contribute signatures when plugged in and on Wi-Fi.

const NODE_SAMPLE = {
  status: 'active', // offline | standby | active | throttled
  uptime: '14h 22m',
  sessionStart: 'today · 06:14',
  signatures: 1847,
  signaturesPerHour: 132,
  rewards: 0.142,
  rewardsUSD: 0.20,
  rounds: 3284,
  peer_id: 'adm1node9q2v4n7pcr8gk4t9mjxlz6h2vp7kfd',
  region: 'na-east · auto',
  power: { source: 'AC', battery: 92, thermal: 'nominal' },
  network: { type: 'Wi-Fi', latency: 18, throughput: '4.2 MB/s' },
  recentSessions: [
    { date: 'May 6', dur: '6h 12m', sigs: 802, reward: 0.061 },
    { date: 'May 5', dur: '4h 48m', sigs: 624, reward: 0.048 },
    { date: 'May 4', dur: '8h 02m', sigs: 1041, reward: 0.078 },
    { date: 'May 3', dur: '2h 30m', sigs: 320, reward: 0.024 },
  ],
};

// ── Top-level Node screen ─────────────────────────────
function NodeScreen({ enabled, setEnabled, settings, setSettings, onView }) {
  const data = NODE_SAMPLE;
  const status = enabled ? data.status : 'offline';

  return (
    <div className="adm-scroll" style={{ padding: '8px 0 90px', height: '100%', overflow: 'auto', position: 'relative' }}>
      <div style={{ padding: '16px 24px 8px' }}>
        <Eyebrow>Node · §3.4</Eyebrow>
        <div className="display" style={{ fontSize: 30, fontWeight: 300, marginTop: 14, color: 'var(--adm-text-1)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
          <span style={{ color: 'var(--adm-text-2)' }}>Run a node</span>
          <br />
          <span style={{ color: 'var(--adm-text-1)' }}>from this phone.</span>
        </div>
      </div>

      {/* Status visualization */}
      <div style={{ padding: '20px 24px 24px' }}>
        <NodePulse status={status} />
      </div>

      {/* Status block */}
      <div style={{ padding: '0 24px 8px' }}>
        <NodeStatusBlock status={status} data={data} />
      </div>

      {/* Toggle row */}
      <div style={{ padding: '20px 20px 8px' }}>
        <div className="adm-card" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: 'var(--adm-text-1)' }}>Node Watcher participation</div>
              <div style={{ fontSize: 12, color: 'var(--adm-text-3)', marginTop: 4, lineHeight: 1.5 }}>
                Contribute signatures to the consensus DAG. On only when plugged in and on Wi-Fi by default.
              </div>
            </div>
            <Toggle on={enabled} onChange={setEnabled} />
          </div>
        </div>
      </div>

      {/* Live contribution stats */}
      {enabled && status !== 'offline' && (
        <div style={{ padding: '20px 20px 8px' }}>
          <Eyebrow dot={status === 'active' ? 'ember' : 'muted'}>This session</Eyebrow>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <NodeStat label="Uptime" value={data.uptime} mono />
            <NodeStat label="Signatures" value={data.signatures.toLocaleString()} mono />
            <NodeStat label="Rounds watched" value={data.rounds.toLocaleString()} mono />
            <NodeStat label="Earned" value={`+${data.rewards.toFixed(3)} ADM`} accent />
          </div>
        </div>
      )}

      {/* Constraints */}
      {enabled && (
        <div style={{ padding: '20px 20px 8px' }}>
          <Eyebrow dot="muted">Conditions</Eyebrow>
          <div className="adm-card" style={{ padding: '4px 16px', marginTop: 10 }}>
            <ConstraintRow icon="power" label="Power" detail={`${data.power.source} · ${data.power.battery}%`} ok={data.power.source === 'AC' || data.power.battery > 50} />
            <ConstraintRow icon="thermal" label="Thermal" detail={data.power.thermal} ok={data.power.thermal === 'nominal'} />
            <ConstraintRow icon="net" label="Network" detail={`${data.network.type} · ${data.network.latency}ms`} ok={data.network.type === 'Wi-Fi'} />
            <ConstraintRow icon="cpu" label="CPU budget" detail={`Max ${settings.maxCpu}%`} ok last />
          </div>
        </div>
      )}

      {/* Recent sessions */}
      {enabled && (
        <div style={{ padding: '20px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Eyebrow dot="muted">Recent sessions</Eyebrow>
            <button onClick={() => onView('node-log')} style={{ background: 'transparent', border: 'none', padding: 0, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--adm-text-3)', cursor: 'pointer' }}>Full log</button>
          </div>
          <div className="adm-card" style={{ marginTop: 10, padding: '4px 16px' }}>
            {data.recentSessions.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i === data.recentSessions.length - 1 ? 'none' : '1px solid var(--adm-border-1)' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--adm-text-3)', textTransform: 'uppercase' }}>{s.date}</div>
                  <div style={{ marginTop: 2, fontSize: 13, color: 'var(--adm-text-1)' }}>{s.dur} · {s.sigs.toLocaleString()} sigs</div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--adm-ember)', letterSpacing: '0.02em' }}>+{s.reward.toFixed(3)} ADM</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings entry */}
      <div style={{ padding: '20px 20px 0' }}>
        <button className="row-tap" onClick={() => onView('node-settings')} style={{
          width: '100%', background: 'var(--adm-surface-1)', border: '1px solid var(--adm-border-1)',
          borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, color: 'var(--adm-text-1)' }}>Node settings</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', color: 'var(--adm-text-3)', marginTop: 2 }}>
              {settings.onlyAC ? 'AC only' : 'AC + battery'} · {settings.onlyWifi ? 'Wi-Fi only' : 'any network'} · {settings.maxCpu}% cpu
            </div>
          </div>
          <svg width="10" height="14" viewBox="0 0 10 14"><path d="M2 1l5 6-5 6" stroke="var(--adm-text-3)" strokeWidth="1.4" fill="none" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Honesty footer */}
      <div style={{ padding: '24px 24px 0', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--adm-text-3)', letterSpacing: '0.04em', lineHeight: 1.7 }}>
        Phones cannot be full Node Runners. This device contributes signatures to the Node Watcher pool and verifies new tips locally. Block production runs on dedicated hardware.
      </div>
    </div>
  );
}

// ── Pulse ring (status visualization) ───────────────
function NodePulse({ status }) {
  const color = status === 'active' ? 'var(--adm-ember)'
    : status === 'standby' ? 'var(--adm-cold)'
    : status === 'throttled' ? '#c98e3a'
    : 'var(--adm-text-4)';

  return (
    <div style={{ position: 'relative', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Concentric pulses */}
      {status === 'active' && (
        <>
          <div className="node-pulse" style={{ '--c': color, animationDelay: '0s' }} />
          <div className="node-pulse" style={{ '--c': color, animationDelay: '0.6s' }} />
          <div className="node-pulse" style={{ '--c': color, animationDelay: '1.2s' }} />
        </>
      )}
      {/* Static rings */}
      <svg width="160" height="160" viewBox="0 0 160 160" style={{ position: 'absolute' }}>
        <circle cx="80" cy="80" r="76" stroke="var(--adm-border-1)" strokeWidth="0.5" fill="none" />
        <circle cx="80" cy="80" r="58" stroke="var(--adm-border-1)" strokeWidth="0.5" fill="none" strokeDasharray="2 4" />
        <circle cx="80" cy="80" r="40" stroke="var(--adm-border-1)" strokeWidth="0.5" fill="none" />
      </svg>
      {/* Core */}
      <div style={{
        width: 56, height: 56, borderRadius: 28,
        background: status === 'active' ? `radial-gradient(circle, ${color} 0%, var(--adm-ember-faint) 70%)` : 'var(--adm-surface-2)',
        border: `1px solid ${status === 'offline' ? 'var(--adm-border-2)' : color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        boxShadow: status === 'active' ? `0 0 24px ${color}` : 'none',
        transition: 'all 600ms ease',
      }}>
        <div style={{
          width: 14, height: 14, borderRadius: 7,
          background: status === 'offline' ? 'var(--adm-text-4)' : color,
          boxShadow: status === 'active' ? `0 0 12px ${color}` : 'none',
        }} />
      </div>
    </div>
  );
}

function NodeStatusBlock({ status, data }) {
  const map = {
    offline: { eyebrow: 'Offline', dot: 'muted', body: 'Node Watcher participation is off. Local verification still runs whenever you open the app.' },
    standby: { eyebrow: 'Standby', dot: 'cold', body: 'Waiting for power and Wi-Fi. Will join the Node Watcher pool automatically when conditions are met.' },
    active: { eyebrow: 'Active · contributing', dot: 'ember', body: `Connected to Node Watcher pool. Signing rounds at ~${data.signaturesPerHour}/hour.` },
    throttled: { eyebrow: 'Throttled', dot: 'muted', body: 'Holding back to respect thermal or CPU limits. Will resume full participation when conditions improve.' },
  };
  const m = map[status];
  return (
    <div className="adm-fade">
      <Eyebrow dot={m.dot}>{m.eyebrow}</Eyebrow>
      <div style={{ marginTop: 10, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--adm-text-2)', letterSpacing: '0.02em', lineHeight: 1.6 }}>
        {m.body}
      </div>
      {status === 'active' && (
        <div style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-3)', letterSpacing: '0.04em' }}>
          peer · {data.peer_id.slice(0, 12)}…{data.peer_id.slice(-4)}<br />
          region · {data.region}
        </div>
      )}
    </div>
  );
}

function NodeStat({ label, value, mono, accent }) {
  return (
    <div style={{ background: 'var(--adm-surface-1)', border: '1px solid var(--adm-border-1)', borderRadius: 10, padding: '12px 14px' }}>
      <div className="mono-cap" style={{ color: 'var(--adm-text-3)', fontSize: 9 }}>{label}</div>
      <div style={{
        marginTop: 6,
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-display)',
        fontSize: mono ? 14 : 18, fontWeight: mono ? 400 : 300,
        color: accent ? 'var(--adm-ember)' : 'var(--adm-text-1)',
        letterSpacing: mono ? '0.02em' : '-0.02em',
      }}>{value}</div>
    </div>
  );
}

function ConstraintRow({ icon, label, detail, ok, last }) {
  const icons = {
    power: <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="4" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/><rect x="11" y="6" width="1.5" height="2" fill="currentColor"/><rect x="3.5" y="5.5" width={ok ? 6 : 2} height="3" fill="currentColor"/></svg>,
    thermal: <svg width="14" height="14" viewBox="0 0 14 14"><path d="M5.5 8V2.5C5.5 1.7 6.2 1 7 1C7.8 1 8.5 1.7 8.5 2.5V8" stroke="currentColor" strokeWidth="1.2" fill="none"/><circle cx="7" cy="10" r="2" fill="currentColor"/></svg>,
    net: <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 5C2.5 3 4.5 2 7 2C9.5 2 11.5 3 13 5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/><path d="M3 8C4 7 5.4 6.3 7 6.3C8.6 6.3 10 7 11 8" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/><circle cx="7" cy="11" r="1" fill="currentColor"/></svg>,
    cpu: <svg width="14" height="14" viewBox="0 0 14 14"><rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/><rect x="5" y="5" width="4" height="4" fill="currentColor"/><path d="M5 1V3M9 1V3M5 11V13M9 11V13M1 5H3M1 9H3M11 5H13M11 9H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: last ? 'none' : '1px solid var(--adm-border-1)' }}>
      <div style={{
        width: 26, height: 26, borderRadius: 6,
        background: ok ? 'var(--adm-ember-faint)' : 'var(--adm-surface-2)',
        color: ok ? 'var(--adm-ember)' : 'var(--adm-text-3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{icons[icon]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--adm-text-1)' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--adm-text-3)', marginTop: 2, letterSpacing: '0.04em' }}>{detail}</div>
      </div>
      <div style={{
        width: 6, height: 6, borderRadius: 3,
        background: ok ? 'var(--adm-ember)' : 'var(--adm-text-4)',
        boxShadow: ok ? '0 0 6px var(--adm-ember-dim)' : 'none',
        flexShrink: 0,
      }} />
    </div>
  );
}

// ── Node settings ───────────────────────────────────
function NodeSettingsScreen({ onBack, settings, setSettings }) {
  const set = (k, v) => setSettings({ ...settings, [k]: v });
  return (
    <div className="adm-scroll" style={{ padding: '12px 20px 90px', height: '100%', overflow: 'auto' }}>
      <ScreenHeader title="Node settings" onBack={onBack} />

      <Eyebrow>When to run</Eyebrow>
      <div className="adm-card" style={{ padding: '4px 16px', marginTop: 10 }}>
        <div className="row-tap" onClick={() => set('onlyAC', !settings.onlyAC)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--adm-border-1)', cursor: 'pointer' }}>
          <div>
            <div style={{ fontSize: 14, color: 'var(--adm-text-1)' }}>Only when plugged in</div>
            <div style={{ fontSize: 11, color: 'var(--adm-text-3)', marginTop: 2 }}>Recommended. Off-grid drains battery quickly.</div>
          </div>
          <Toggle on={settings.onlyAC} onChange={(v) => set('onlyAC', v)} />
        </div>
        <div className="row-tap" onClick={() => set('onlyWifi', !settings.onlyWifi)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--adm-border-1)', cursor: 'pointer' }}>
          <div>
            <div style={{ fontSize: 14, color: 'var(--adm-text-1)' }}>Only on Wi-Fi</div>
            <div style={{ fontSize: 11, color: 'var(--adm-text-3)', marginTop: 2 }}>Node Watcher traffic is ~2 GB/day average.</div>
          </div>
          <Toggle on={settings.onlyWifi} onChange={(v) => set('onlyWifi', v)} />
        </div>
        <div className="row-tap" onClick={() => set('runInBackground', !settings.runInBackground)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', cursor: 'pointer' }}>
          <div>
            <div style={{ fontSize: 14, color: 'var(--adm-text-1)' }}>Run in background</div>
            <div style={{ fontSize: 11, color: 'var(--adm-text-3)', marginTop: 2 }}>Keeps participating when the app is closed.</div>
          </div>
          <Toggle on={settings.runInBackground} onChange={(v) => set('runInBackground', v)} />
        </div>
      </div>

      <div style={{ height: 24 }} />

      <Eyebrow>Resource budget</Eyebrow>
      <div className="adm-card" style={{ padding: 16, marginTop: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 14, color: 'var(--adm-text-1)' }}>Max CPU</div>
          <div className="mono" style={{ fontSize: 13, color: 'var(--adm-ember)' }}>{settings.maxCpu}%</div>
        </div>
        <input
          type="range" min="10" max="80" step="5"
          value={settings.maxCpu}
          onChange={(e) => set('maxCpu', +e.target.value)}
          className="adm-range"
          style={{ width: '100%', marginTop: 12 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--adm-text-3)' }}>
          <span>10%</span><span>40%</span><span>80%</span>
        </div>
      </div>

      <div style={{ height: 24 }} />

      <Eyebrow>Identity</Eyebrow>
      <div className="adm-card" style={{ padding: 16, marginTop: 10 }}>
        <div className="mono-cap" style={{ color: 'var(--adm-text-3)' }}>Peer ID</div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--adm-text-1)', marginTop: 6, wordBreak: 'break-all', lineHeight: 1.5 }}>
          adm1node9q2v4n7pcr8gk4t9mjxlz6h2vp7kfd
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--adm-border-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="mono-cap" style={{ color: 'var(--adm-text-3)' }}>Region</span>
          <span className="mono" style={{ fontSize: 12, color: 'var(--adm-text-1)' }}>na-east · auto</span>
        </div>
      </div>

      <div style={{ height: 24 }} />

      <Eyebrow>Rewards</Eyebrow>
      <div className="adm-card" style={{ padding: 16, marginTop: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, color: 'var(--adm-text-1)' }}>Auto-payout to wallet</div>
            <div style={{ fontSize: 11, color: 'var(--adm-text-3)', marginTop: 2 }}>Transparent · paid hourly</div>
          </div>
          <Toggle on={settings.autoPayout} onChange={(v) => set('autoPayout', v)} />
        </div>
      </div>

      <div style={{ marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--adm-text-3)', letterSpacing: '0.04em', lineHeight: 1.7 }}>
        Node Watcher signatures are non-anonymous. Your peer ID is public and is paired with a transparent payout address.
      </div>
    </div>
  );
}

// ── Full session log ────────────────────────────────
function NodeLogScreen({ onBack }) {
  const sessions = [
    ...NODE_SAMPLE.recentSessions,
    { date: 'May 2', dur: '5h 18m', sigs: 712, reward: 0.054 },
    { date: 'May 1', dur: '7h 03m', sigs: 924, reward: 0.071 },
    { date: 'Apr 30', dur: '3h 41m', sigs: 488, reward: 0.037 },
    { date: 'Apr 29', dur: '6h 55m', sigs: 880, reward: 0.066 },
  ];
  const total = sessions.reduce((a, s) => a + s.reward, 0);
  const totalSigs = sessions.reduce((a, s) => a + s.sigs, 0);

  return (
    <div className="adm-scroll" style={{ padding: '12px 20px 90px', height: '100%', overflow: 'auto' }}>
      <ScreenHeader title="Session log" onBack={onBack} />

      <div className="adm-card" style={{ padding: 16 }}>
        <Eyebrow dot="ember">All-time</Eyebrow>
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div className="mono-cap" style={{ color: 'var(--adm-text-3)' }}>Earned</div>
            <div className="display" style={{ marginTop: 4, fontSize: 22, fontWeight: 300, color: 'var(--adm-ember)', letterSpacing: '-0.02em' }}>
              {total.toFixed(3)} <span style={{ fontSize: 11, color: 'var(--adm-text-3)' }}>ADM</span>
            </div>
          </div>
          <div>
            <div className="mono-cap" style={{ color: 'var(--adm-text-3)' }}>Signatures</div>
            <div className="display" style={{ marginTop: 4, fontSize: 22, fontWeight: 300, color: 'var(--adm-text-1)', letterSpacing: '-0.02em' }}>
              {totalSigs.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 20 }} />

      <Eyebrow>Sessions</Eyebrow>
      <div className="adm-card" style={{ padding: '4px 16px', marginTop: 10 }}>
        {sessions.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i === sessions.length - 1 ? 'none' : '1px solid var(--adm-border-1)' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--adm-text-3)', textTransform: 'uppercase' }}>{s.date}</div>
              <div style={{ marginTop: 2, fontSize: 13, color: 'var(--adm-text-1)' }}>{s.dur} · {s.sigs.toLocaleString()} sigs</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--adm-ember)' }}>+{s.reward.toFixed(3)} ADM</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { NodeScreen, NodeSettingsScreen, NodeLogScreen, NODE_SAMPLE });
