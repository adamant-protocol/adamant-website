// Cold-open black frame with single wordmark — fades after short hold.
import * as React from 'react';
import { useEffect, useState } from 'react';
import Mark from '../ui/Mark.jsx';

export default function TitleCard() {
  const [stage, setStage] = useState('hold');
  useEffect(() => {
    const reduced = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setStage('gone');
      return;
    }
    // Skip on repeat visits in the same session
    let seen = false;
    try { seen = sessionStorage.getItem('adm.titlecard') === '1'; } catch (e) {}
    if (seen) {
      setStage('gone');
      return;
    }
    const t1 = setTimeout(() => setStage('fade'), 900);
    const t2 = setTimeout(() => {
      setStage('gone');
      try { sessionStorage.setItem('adm.titlecard', '1'); } catch (e) {}
    }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (stage === 'gone') return null;
  return (
    <div className={`title-card ${stage}`} aria-hidden="true">
      <div className="tc-mono small">ADAMANT / L1 — OBSERVATORY</div>
      <div className="tc-mark"><Mark size={160} color="#ffffff" /></div>
      <div className="tc-mono">privacy by default · verifiable by anyone · governed by no one</div>
    </div>
  );
}
