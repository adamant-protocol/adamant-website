// The hero: massive globe cut off at the bottom; scroll drives a zoom-in
// that reveals a futuristic city skyline below. Glitch headline overlay.
import * as React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import Globe from './Globe.jsx';
import CitySkyline from './CitySkyline.jsx';
import GlitchText from './GlitchText.jsx';
import HeroHUD from './HeroHUD.jsx';

// deterministic prng so SSR markup matches client
function rng(seed) {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
}

export default function WorldDive({ phase }) {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  // Pre-compute star field with a seeded RNG so SSR + client agree.
  const stars = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: 90 }, () => ({
      x: (r() * 100).toFixed(2),
      y: (r() * 100).toFixed(2),
      r: (0.5 + r() * 1.4).toFixed(1),
      a: (0.2 + r() * 0.7).toFixed(2),
      dur: (2 + r() * 6).toFixed(1),
    }));
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      if (stageRef.current) stageRef.current.style.setProperty('--p', '0.6');
      return;
    }
    let rafId = 0;
    function onScroll() {
      if (!sectionRef.current || !stageRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      stageRef.current.style.setProperty('--p', p.toFixed(4));
    }
    function onScrollRAF() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        onScroll();
      });
    }
    window.addEventListener('scroll', onScrollRAF, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScrollRAF);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Larger than viewport — only top dome visible.
  const globeSize = typeof window !== 'undefined'
    ? Math.max(2200, Math.max(window.innerWidth, window.innerHeight) * 1.8)
    : 2200;

  return (
    <section ref={sectionRef} className="dive-section" data-screen-label="00 hero">
      <div ref={stageRef} className="dive-stage" style={{ '--p': 0 }}>
        <div className="dive-stars" aria-hidden="true">
          {stars.map((s, i) => (
            <span
              key={i}
              className="dive-star"
              style={{
                left: s.x + '%',
                top: s.y + '%',
                width: s.r + 'px',
                height: s.r + 'px',
                opacity: s.a,
                animationDuration: s.dur + 's',
              }}
            />
          ))}
        </div>
        <div className="dive-globe-wrap">
          <Globe size={globeSize} />
        </div>
        <div className="dive-horizon" aria-hidden="true" />
        <div className="dive-city">
          <CitySkyline />
        </div>
        <div className="dive-fog" aria-hidden="true" />

        <div className="dive-headline">
          <h1>
            <span className="ln">
              <GlitchText text="Privacy by default." intensity={1.0} />
            </span>
            <span className="ln">
              <GlitchText text="Verifiable by anyone." intensity={0.9} />
            </span>
            <span className="ln">
              <span className="serif-it">Governed</span>{' '}
              <GlitchText text="by no one." intensity={1.2} />
            </span>
          </h1>
        </div>

        <HeroHUD phase={phase} />

        <div className="dive-scroll" aria-hidden="true">
          <span>SCROLL</span>
          <span className="ln" />
        </div>

        <div className="dive-vignette" aria-hidden="true" />
        <div className="dive-grain" aria-hidden="true" />
        <div className="dive-letterbox t" />
        <div className="dive-letterbox b" />
      </div>
    </section>
  );
}
