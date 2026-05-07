// Adamant — App shell, tab bar, device frame, routing

const TAB_DEFS = [
  { id: 'wallet', label: 'Wallet', icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2.5" y="5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M2.5 8H17.5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="13" cy="12" r="1" fill="currentColor"/>
    </svg>
  )},
  { id: 'verify', label: 'Verify', icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L16 4V9C16 13 13.5 16 10 17C6.5 16 4 13 4 9V4L10 2Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
      <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
  { id: 'node', label: 'Node', icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2"/>
      <circle cx="10" cy="3" r="1.2" fill="currentColor"/>
      <circle cx="16" cy="13" r="1.2" fill="currentColor"/>
      <circle cx="4" cy="13" r="1.2" fill="currentColor"/>
    </svg>
  )},
  { id: 'settings', label: 'Settings', icon: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M10 1.5v3M10 15.5v3M18.5 10h-3M4.5 10h-3M16 4l-2 2M6 14l-2 2M16 16l-2-2M6 6L4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )},
];

function TabBar({ tab, setTab }) {
  return (
    <div className="tabbar" data-screen-label="tabbar">
      {TAB_DEFS.map(t => (
        <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
          {t.icon}
          <span style={{ marginTop: 2 }}>{t.label}</span>
          <div className="tab-dot" />
        </button>
      ))}
    </div>
  );
}

function DeviceFrame({ children, theme }) {
  return (
    <div style={{
      width: 393, height: 852, borderRadius: 54, overflow: 'hidden',
      position: 'relative',
      background: theme === 'dark' ? '#000' : 'var(--adm-bg)',
      boxShadow: '0 50px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), 0 0 0 8px #1a1a1a, 0 0 0 9px #2a2a2a',
      fontFamily: 'var(--font-body)',
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* Atmosphere */}
      <div className="adm-grid-overlay" />
      <div className="adm-warm-overlay" />

      {/* Dynamic island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 124, height: 36, borderRadius: 24,
        background: '#000', zIndex: 60,
      }} />

      <StatusBar light={theme === 'light'} />
      <div style={{ position: 'absolute', inset: 0, paddingTop: 47, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      <HomeIndicator />
    </div>
  );
}

function App() {
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "theme": "dark",
    "showVerifyFooter": true,
    "balanceVisible": true,
    "showTweakHint": true
  }/*EDITMODE-END*/);

  const theme = tweaks.theme;

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // App state
  // Honor a ?tab= URL parameter so external embeds (the marketing site) can
  // land on a specific tab. Falls back to 'wallet' when missing or invalid.
  const initialTab = (() => {
    if (typeof window === 'undefined') return 'wallet';
    const p = new URLSearchParams(window.location.search).get('tab');
    return ['wallet', 'verify', 'node', 'settings'].includes(p) ? p : 'wallet';
  })();
  const [tab, setTab] = React.useState(initialTab);
  const [walletStack, setWalletStack] = React.useState([]); // 'send' | 'receive' | 'orders' | 'order-edit'(id|null) | { type: 'tx', tx }
  const [settingsStack, setSettingsStack] = React.useState([]); // 'viewkeys' | 'viewkey-create' | 'contacts' | 'contact-edit'(id|null) | 'orders' | 'order-edit'
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [account] = React.useState('Personal');
  const [fiat, setFiat] = React.useState(true);
  const [lastVerified, setLastVerified] = React.useState(Date.now() - 142 * 1000);
  const [contacts, setContacts] = React.useState(SAMPLE_CONTACTS);
  const [orders, setOrders] = React.useState(SAMPLE_STANDING_ORDERS);
  const [nodeEnabled, setNodeEnabled] = React.useState(true);
  const [nodeSettings, setNodeSettings] = React.useState({
    onlyAC: true, onlyWifi: true, runInBackground: true,
    maxCpu: 40, autoPayout: true,
  });
  const [nodeStack, setNodeStack] = React.useState([]); // 'node-settings' | 'node-log'

  const saveContact = (c) => setContacts(prev => {
    const i = prev.findIndex(x => x.id === c.id);
    if (i === -1) return [...prev, c];
    const next = [...prev]; next[i] = c; return next;
  });
  const deleteContact = (id) => setContacts(prev => prev.filter(c => c.id !== id));
  const saveOrder = (o) => setOrders(prev => {
    const i = prev.findIndex(x => x.id === o.id);
    if (i === -1) return [...prev, o];
    const next = [...prev]; next[i] = o; return next;
  });
  const deleteOrder = (id) => setOrders(prev => prev.filter(o => o.id !== id));
  const toggleOrder = (id) => setOrders(prev => prev.map(o => o.id === id ? { ...o, status: o.status === 'active' ? 'paused' : 'active' } : o));

  const goVerify = () => { setTab('verify'); };

  // Tweaks panel content
  const tweaksUI = (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Appearance">
        <TweakRadio label="Theme" value={tweaks.theme} options={[
          { value: 'dark', label: 'Dark' },
          { value: 'light', label: 'Light' },
        ]} onChange={v => setTweak('theme', v)} />
      </TweakSection>
      <TweakSection title="Wallet">
        <TweakToggle label="Show balance" value={tweaks.balanceVisible} onChange={v => setTweak('balanceVisible', v)} />
        <TweakToggle label="Chain-verified footer" value={tweaks.showVerifyFooter} onChange={v => setTweak('showVerifyFooter', v)} />
      </TweakSection>
      <TweakSection title="Navigate">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {TAB_DEFS.map(t => (
            <TweakButton key={t.id} onClick={() => { setTab(t.id); setWalletStack([]); setSettingsStack([]); }}>{t.label}</TweakButton>
          ))}
        </div>
        <div style={{ height: 8 }} />
        <TweakButton onClick={() => setShowOnboarding(true)}>Show onboarding</TweakButton>
        <TweakButton onClick={() => { setTab('settings'); setSettingsStack(['viewkeys']); }}>View keys</TweakButton>
        <TweakButton onClick={() => { setTab('settings'); setSettingsStack(['contacts']); }}>Contacts</TweakButton>
        <TweakButton onClick={() => { setTab('settings'); setSettingsStack(['orders']); }}>Standing orders</TweakButton>
      </TweakSection>
    </TweaksPanel>
  );

  // ── Render current screen ──
  let body;
  if (showOnboarding) {
    body = <Onboarding onDone={() => setShowOnboarding(false)} />;
  } else if (tab === 'wallet') {
    const top = walletStack[walletStack.length - 1];
    if (!top) {
      body = (
        <WalletHome
          onNav={(s) => setWalletStack([...walletStack, s])}
          onTx={(tx) => setWalletStack([...walletStack, { type: 'tx', tx }])}
          onVerify={goVerify}
          balanceVisible={tweaks.balanceVisible}
          account={account}
          fiat={fiat}
          setFiat={setFiat}
          contacts={contacts}
          orders={orders}
          onOpenOrders={() => { setTab('settings'); setSettingsStack(['orders']); }}
          onOpenContacts={() => { setTab('settings'); setSettingsStack(['contacts']); }}
        />
      );
    } else if (top === 'send') {
      body = <SendScreen
        onBack={() => setWalletStack(walletStack.slice(0, -1))}
        onNav={() => setWalletStack([])}
        contacts={contacts}
        onSavedContact={saveContact}
      />;
    } else if (top === 'receive') {
      body = <ReceiveScreen onBack={() => setWalletStack(walletStack.slice(0, -1))} account={account} />;
    } else if (top.type === 'tx') {
      body = <TxDetail tx={top.tx} onBack={() => setWalletStack(walletStack.slice(0, -1))} />;
    }
  } else if (tab === 'verify') {
    body = <VerifyScreen lastVerified={lastVerified} setLastVerified={setLastVerified} />;
  } else if (tab === 'node') {
    const top = nodeStack[nodeStack.length - 1];
    const popN = () => setNodeStack(nodeStack.slice(0, -1));
    if (!top) {
      body = <NodeScreen enabled={nodeEnabled} setEnabled={setNodeEnabled} settings={nodeSettings} setSettings={setNodeSettings} onView={(s) => setNodeStack([...nodeStack, s])} />;
    } else if (top === 'node-settings') {
      body = <NodeSettingsScreen onBack={popN} settings={nodeSettings} setSettings={setNodeSettings} />;
    } else if (top === 'node-log') {
      body = <NodeLogScreen onBack={popN} />;
    }
  } else if (tab === 'settings') {
    const top = settingsStack[settingsStack.length - 1];
    const pop = () => setSettingsStack(settingsStack.slice(0, -1));
    if (!top) {
      body = <SettingsScreen onView={(s) => setSettingsStack([...settingsStack, s])} onClose={() => setTab('wallet')} theme={theme} setTheme={(t) => setTweak('theme', t)} contactsCount={contacts.length} ordersCount={orders.filter(o => o.status === 'active').length} />;
    } else if (top === 'viewkeys') {
      body = <ViewKeysScreen onBack={pop} onCreate={() => setSettingsStack([...settingsStack, 'viewkey-create'])} />;
    } else if (top === 'viewkey-create') {
      body = <ViewKeyCreate onBack={pop} onDone={() => setSettingsStack(['viewkeys'])} />;
    } else if (top === 'contacts') {
      body = <ContactsScreen contacts={contacts} onBack={pop} onAdd={() => setSettingsStack([...settingsStack, { kind: 'contact-edit', contact: null }])} onEdit={(c) => setSettingsStack([...settingsStack, { kind: 'contact-edit', contact: c }])} />;
    } else if (top && top.kind === 'contact-edit') {
      body = <ContactEdit contact={top.contact} onBack={pop} onSave={(c) => { saveContact(c); pop(); }} onDelete={(id) => { deleteContact(id); pop(); }} />;
    } else if (top === 'orders') {
      body = <StandingOrdersScreen orders={orders} contacts={contacts} onBack={pop} onCreate={() => setSettingsStack([...settingsStack, { kind: 'order-edit', order: null }])} onOpen={(o) => setSettingsStack([...settingsStack, { kind: 'order-edit', order: o }])} onToggle={toggleOrder} />;
    } else if (top && top.kind === 'order-edit') {
      body = <StandingOrderEdit order={top.order} contacts={contacts} onBack={pop} onSave={(o) => { saveOrder(o); pop(); }} onDelete={(id) => { deleteOrder(id); pop(); }} />;
    }
  }

  // Screen labels for comments
  const screenLabel = showOnboarding ? '00 Onboarding'
    : tab === 'wallet' ? (walletStack.length === 0 ? '01 Wallet · home' : `01 Wallet · ${typeof walletStack[walletStack.length-1] === 'string' ? walletStack[walletStack.length-1] : 'tx detail'}`)
    : tab === 'verify' ? '02 Verify'
    : tab === 'node' ? (nodeStack.length === 0 ? '03 Node' : nodeStack[nodeStack.length-1] === 'node-settings' ? '03 Node · settings' : '03 Node · log')
    : (settingsStack.length === 0 ? '04 Settings' : settingsStack[settingsStack.length-1] === 'viewkeys' ? '04 Settings · view keys' : '04 Settings · new view key');

  return (
    <>
      <DeviceFrame theme={theme}>
        <div data-screen-label={screenLabel} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {body}
          </div>
          {!showOnboarding && <TabBar tab={tab} setTab={(t) => { setTab(t); setWalletStack([]); setSettingsStack([]); setNodeStack([]); }} />}
        </div>
      </DeviceFrame>
      {tweaksUI}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
