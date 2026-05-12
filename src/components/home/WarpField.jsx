// Sticky canvas tunnel — stars streak radially from center based on scroll
// progress within the section. Peak flash at midpoint, then fades.
import * as React from 'react';
import { useEffect, useRef } from 'react';

export default function WarpField({ height = '220vh', children }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef({ raf: 0, progress: 0, stars: [], running: false });

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    requestAnimationFrame(resize);

    const N = 280;
    const stars = stateRef.current.stars = [];
    for (let i = 0; i < N; i++) {
      stars.push({
        angle: Math.random() * Math.PI * 2,
        d: Math.random() * 0.4,
        speed: 0.0008 + Math.random() * 0.0022,
        len: 4 + Math.random() * 60,
      });
    }

    function onScroll() {
      const rect = sectionRef.current.getBoundingClientRect();
      const vp = window.innerHeight;
      const total = rect.height - vp;
      const scrolled = -rect.top;
      const p = total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0;
      stateRef.current.progress = p;
      // Only run the loop while the section is somewhere on screen
      const onScreen = rect.bottom > 0 && rect.top < vp;
      if (onScreen && !stateRef.current.running) {
        stateRef.current.running = true;
        stateRef.current.raf = requestAnimationFrame(loop);
      } else if (!onScreen && stateRef.current.running) {
        stateRef.current.running = false;
        cancelAnimationFrame(stateRef.current.raf);
      }
    }

    function loop() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const cx = w / 2, cy = h / 2;
      const p = stateRef.current.progress;
      const peak = 1 - Math.abs(p - 0.5) * 2;
      const intensity = Math.max(0, peak) ** 0.7;
      const jolt = Math.exp(-Math.pow((p - 0.5) * 18, 2));

      ctx.fillStyle = 'rgba(0,0,0,0.20)';
      ctx.fillRect(0, 0, w, h);

      const speedMul = 0.6 + intensity * 5.5;
      ctx.lineCap = 'round';
      for (let i = 0; i < stateRef.current.stars.length; i++) {
        const s = stateRef.current.stars[i];
        s.d += s.speed * speedMul;
        if (s.d > 1.6) { s.d = 0; s.angle = Math.random() * Math.PI * 2; }
        const r = s.d * Math.max(w, h) * 0.75;
        const r2 = (s.d - s.speed * speedMul * s.len * 0.5) * Math.max(w, h) * 0.75;
        const x1 = cx + Math.cos(s.angle) * r;
        const y1 = cy + Math.sin(s.angle) * r;
        const x2 = cx + Math.cos(s.angle) * Math.max(0, r2);
        const y2 = cy + Math.sin(s.angle) * Math.max(0, r2);
        const alpha = Math.min(1, s.d * 1.6) * (0.35 + intensity * 0.65);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 0.6 + intensity * 1.4;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }

      if (jolt > 0.01) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
        g.addColorStop(0, `rgba(255,255,255,${jolt * 0.7})`);
        g.addColorStop(0.4, `rgba(255,255,255,${jolt * 0.18})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      if (stateRef.current.running) {
        stateRef.current.raf = requestAnimationFrame(loop);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(stateRef.current.raf);
      stateRef.current.running = false;
    };
  }, []);

  return (
    <section ref={sectionRef} className="warp-section" style={{ height }}>
      <div className="warp-sticky">
        <canvas ref={canvasRef} className="warp-canvas" aria-hidden="true" />
        <div className="warp-overlay">{children}</div>
      </div>
    </section>
  );
}
