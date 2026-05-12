// One animated tier card. Uses IntersectionObserver to stagger reveal.
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

function NodeRunnerAnim() {
  return (
    <div className="anim-block">
      <span className="blk" /><span className="blk" /><span className="blk" />
      <span className="blk" /><span className="blk" />
    </div>
  );
}
function NodeWatcherAnim() {
  return (
    <div className="anim-attest">
      <span className="dot" /><span className="dot" /><span className="dot" />
      <span className="dot" /><span className="dot" /><span className="dot" />
      <span className="dot" /><span className="check">✓</span>
    </div>
  );
}
function ProverAnim() {
  return (
    <div className="anim-proof">
      <span className="ln">π = halo2.prove(circuit)</span>
      <span className="ln">π = halo2.verify(π, vk)</span>
      <span className="ln">π = recursive.fold(π)</span>
    </div>
  );
}
function ServiceAnim() {
  return (
    <div className="anim-query">
      <span className="req">adamant_getBlock</span>
      <span className="arrow">→</span>
      <span className="res">Block #4,829,117</span>
    </div>
  );
}

const ANIMS = {
  'Node Runner':  <NodeRunnerAnim />,
  'Node Watcher': <NodeWatcherAnim />,
  'Prover':       <ProverAnim />,
  'Service Node': <ServiceAnim />,
};

export default function TheatreTier({ tier, idx = 0 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setSeen(true); return; }
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } });
    }, { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const open = tier.permissionless;
  const anim = ANIMS[tier.k] ?? null;

  return (
    <div
      ref={ref}
      className={`theatre ${seen ? 'in' : ''}`}
      style={{ transitionDelay: `${idx * 120}ms` }}
    >
      <div className="t-num">T.{String(idx + 1).padStart(2, '0')}</div>
      <div className={`t-perm ${open ? 'open' : ''}`}>{open ? 'OPEN' : 'BONDED'}</div>
      <div className="t-name">{tier.k}</div>
      <div className="t-role">{tier.role}</div>
      <div className="t-anim">{anim}</div>
      <div className="t-stats">
        <div className="row"><span className="k">STAKE</span><span className="v">{tier.stake}</span></div>
        <div className="row"><span className="k">HW</span><span className="v">{tier.hw}</span></div>
        <div className="row"><span className="k">COUNT</span><span className="v">{tier.count}</span></div>
      </div>
    </div>
  );
}
