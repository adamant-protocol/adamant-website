// Drifting film grain via tiny canvas. Very faint.
import * as React from 'react';
import { useRef, useEffect } from 'react';

export default function AmbientNoise() {
  const ref = useRef(null);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const W = 240, H = 240;
    c.width = W; c.height = H;
    let raf = 0;
    let last = 0;
    function tick(now) {
      // throttle to ~24fps; full ImageData every frame is heavy
      if (now - last < 42) {
        raf = requestAnimationFrame(tick);
        return;
      }
      last = now;
      const id = ctx.createImageData(W, H);
      const d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 12;
      }
      ctx.putImageData(id, 0, 0);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="noise" aria-hidden="true" />;
}
