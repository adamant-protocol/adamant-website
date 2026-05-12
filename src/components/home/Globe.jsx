// Canvas-rendered wireframe Earth. Land dots + graticule + slow rotation.
import * as React from 'react';
import { useEffect, useMemo, useRef } from 'react';

// Bounding-box continental stencil — accurate enough that rotation reads as Earth.
function isLand(lat, lon) {
  if (lat > 25 && lat < 72 && lon > -168 && lon < -55) {
    if (lat > 56 && lat < 63 && lon > -95 && lon < -78) return false; // Hudson
    return true;
  }
  if (lat > 8 && lat < 25 && lon > -108 && lon < -77) return true;
  if (lat > -56 && lat < 12 && lon > -82 && lon < -35) {
    if (lat > 0 && lon < -73) return false;
    if (lat < -38 && lon < -68) return false;
    if (lat < -45 && lon > -68) return false;
    return true;
  }
  if (lat > 36 && lat < 71 && lon > -10 && lon < 50) {
    if (lat > 36 && lat < 44 && lon > 0 && lon < 18) return false;
    return true;
  }
  if (lat > 50 && lat < 72 && lon > 50 && lon < 92) return true;
  if (lat > -35 && lat < 37 && lon > -18 && lon < 52) {
    if (lat > 18 && lon < -10) return false;
    if (lat < -22 && lon < 15) return false;
    return true;
  }
  if (lat > 12 && lat < 42 && lon > 35 && lon < 65) return true;
  if (lat > 8 && lat < 78 && lon > 40 && lon < 145) {
    if (lat > 8 && lat < 28 && lon > 60 && lon < 75) return false;
    return true;
  }
  if (lat > -10 && lat < 22 && lon > 95 && lon < 142) {
    if (lat > 8 && lat < 18 && lon > 118 && lon < 128) return false;
    return true;
  }
  if (lat > 30 && lat < 46 && lon > 130 && lon < 146) return true;
  if (lat > -40 && lat < -10 && lon > 113 && lon < 155) return true;
  if (lat > 60 && lat < 84 && lon > -55 && lon < -20) return true;
  if (lat < -65) return true;
  if (lat > 50 && lat < 60 && lon > -10 && lon < 2) return true;
  if (lat > -26 && lat < -12 && lon > 43 && lon < 51) return true;
  return false;
}

export default function Globe({ size = 760 }) {
  const ref = useRef(null);
  const stateRef = useRef({ raf: 0, last: 0 });

  const points = useMemo(() => {
    const land = [];
    const ocean = [];
    const N = 9000;
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = phi * i;
      const x = Math.cos(t) * r;
      const z = Math.sin(t) * r;
      const lat = Math.asin(y) * 180 / Math.PI;
      const lon = Math.atan2(z, x) * 180 / Math.PI;
      const pt = { x, y, z };
      if (isLand(lat, lon)) land.push(pt); else ocean.push(pt);
    }
    const grat = [];
    const M = 96;
    for (let m = 0; m < 12; m++) {
      const lon = (m / 12) * 2 * Math.PI;
      for (let i = 0; i < M; i++) {
        const lat = (-Math.PI / 2) + (i / (M - 1)) * Math.PI;
        const cl = Math.cos(lat);
        grat.push({ x: cl * Math.cos(lon), y: Math.sin(lat), z: cl * Math.sin(lon) });
      }
    }
    for (let p = -3; p <= 3; p++) {
      if (p === 0) continue;
      const lat = (p / 4) * (Math.PI / 2);
      const cl = Math.cos(lat), sl = Math.sin(lat);
      for (let i = 0; i < M; i++) {
        const lon = (i / (M - 1)) * 2 * Math.PI;
        grat.push({ x: cl * Math.cos(lon), y: sl, z: cl * Math.sin(lon) });
      }
    }
    for (let i = 0; i < M * 1.4; i++) {
      const lon = (i / (M * 1.4 - 1)) * 2 * Math.PI;
      grat.push({ x: Math.cos(lon), y: 0, z: Math.sin(lon), eq: true });
    }
    return { land, ocean, grat };
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2;
    const R = size * 0.40;
    const tilt = 23.4 * Math.PI / 180;
    const ct = Math.cos(tilt), st = Math.sin(tilt);

    function project(p, angle) {
      const cosA = Math.cos(angle), sinA = Math.sin(angle);
      const x = p.x * cosA + p.z * sinA;
      const z = -p.x * sinA + p.z * cosA;
      const y = p.y;
      const y2 = y * ct - z * st;
      const z2 = y * st + z * ct;
      return { x: cx + x * R, y: cy + y2 * R, z: z2 };
    }

    const start = performance.now();
    function draw(now) {
      const t = (now - start) / 1000;
      const angle = t * 0.10;
      ctx.clearRect(0, 0, size, size);

      const grad = ctx.createRadialGradient(cx, cy, R * 0.98, cx, cy, R * 1.18);
      grad.addColorStop(0, 'rgba(255,255,255,0.05)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      for (let i = 0; i < points.grat.length; i++) {
        const p = points.grat[i];
        const pr = project(p, angle);
        if (pr.z >= 0) continue;
        const dim = (pr.z + 1) * 0.5;
        ctx.fillStyle = `rgba(255,255,255,${0.04 + dim * 0.05})`;
        ctx.fillRect(pr.x, pr.y, 0.7, 0.7);
      }
      for (let i = 0; i < points.ocean.length; i += 6) {
        const p = points.ocean[i];
        const pr = project(p, angle);
        if (pr.z >= 0) continue;
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.fillRect(pr.x, pr.y, 0.5, 0.5);
      }
      for (let i = 0; i < points.land.length; i++) {
        const p = points.land[i];
        const pr = project(p, angle);
        if (pr.z >= 0) continue;
        const dim = (pr.z + 1) * 0.5;
        ctx.fillStyle = `rgba(255,255,255,${0.12 + dim * 0.10})`;
        ctx.fillRect(pr.x, pr.y, 0.9, 0.9);
      }

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.10)';
      ctx.lineWidth = 1;
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < points.grat.length; i++) {
        const p = points.grat[i];
        const pr = project(p, angle);
        if (pr.z < 0) continue;
        const a = 0.10 + pr.z * 0.18;
        ctx.fillStyle = p.eq
          ? `rgba(255,255,255,${0.20 + pr.z * 0.35})`
          : `rgba(255,255,255,${a})`;
        ctx.fillRect(pr.x, pr.y, p.eq ? 0.9 : 0.7, p.eq ? 0.9 : 0.7);
      }
      for (let i = 0; i < points.ocean.length; i += 5) {
        const p = points.ocean[i];
        const pr = project(p, angle);
        if (pr.z < 0) continue;
        ctx.fillStyle = `rgba(255,255,255,${0.04 + pr.z * 0.05})`;
        ctx.fillRect(pr.x, pr.y, 0.6, 0.6);
      }
      for (let i = 0; i < points.land.length; i++) {
        const p = points.land[i];
        const pr = project(p, angle);
        if (pr.z < 0) continue;
        const a = 0.45 + pr.z * 0.55;
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        const s = 1.0 + pr.z * 0.5;
        ctx.fillRect(pr.x - s / 2, pr.y - s / 2, s, s);
      }

      [{ p: { x: 0, y: 1, z: 0 }, label: 'N' }, { p: { x: 0, y: -1, z: 0 }, label: 'S' }].forEach((px) => {
        const pr = project(px.p, angle);
        if (pr.z <= -0.05) return;
        ctx.fillStyle = `rgba(255,255,255,${0.4 + pr.z * 0.4})`;
        ctx.font = '10px Geist Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(px.label, pr.x, pr.y - 6);
      });

      stateRef.current.raf = requestAnimationFrame(draw);
    }
    stateRef.current.raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(stateRef.current.raf);
  }, [size, points]);

  return <canvas ref={ref} className="globe-canvas" aria-hidden="true" />;
}
