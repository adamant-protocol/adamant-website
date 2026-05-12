// Hand-drawn SVG futuristic skyline with A-mark monument.
import * as React from 'react';
import { useMemo } from 'react';

const BUILDINGS = [
  [0, 60, 140], [60, 36, 220], [96, 80, 175], [176, 52, 260, 1],
  [228, 70, 200], [298, 60, 280, 1], [358, 110, 380, 1],
  [468, 50, 220], [518, 70, 330, 1], [588, 84, 400, 1],
  [672, 40, 280],
  [1248, 80, 360, 1], [1328, 60, 270], [1388, 110, 400, 1],
  [1498, 70, 250], [1568, 90, 320, 1], [1658, 60, 210],
  [1718, 100, 280, 1], [1818, 70, 230], [1888, 32, 170],
];

// deterministic prng so SSR + client agree
function rng(seed) {
  let s = seed | 0;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
}

export default function CitySkyline() {
  const { wins } = useMemo(() => {
    const r = rng(42);
    const w = [];
    BUILDINGS.forEach(([x, width, h, lit], bi) => {
      if (!lit) return;
      const rows = Math.floor((h - 20) / 14);
      const cols = Math.floor((width - 8) / 8);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (r() > 0.55) continue;
          w.push([x + 6 + col * 8, 500 - h + 18 + row * 14, bi, r() > 0.92, (3 + r() * 5).toFixed(1)]);
        }
      }
    });
    return { wins: w };
  }, []);

  return (
    <svg className="city-svg" viewBox="0 0 1920 500" preserveAspectRatio="xMidYEnd meet" aria-hidden="true">
      <defs>
        <linearGradient id="city-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="20%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bld" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
      </defs>
      <rect x="0" y="160" width="1920" height="340" fill="url(#city-fade)" />
      {BUILDINGS.map(([x, w, h], i) => (
        <g key={i}>
          <rect x={x} y={500 - h} width={w} height={h} fill="url(#bld)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
          <line x1={x} y1={500 - h} x2={x + w} y2={500 - h} stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
        </g>
      ))}
      <g>
        {wins.map(([wx, wy, , twinkle, dur], i) => (
          <rect key={i} x={wx} y={wy} width="2.5" height="3.5" fill="rgba(255,255,255,0.85)">
            {twinkle && (
              <animate attributeName="opacity" values="0.85;0.15;0.85" dur={`${dur}s`} repeatCount="indefinite" />
            )}
          </rect>
        ))}
      </g>
      <g transform="translate(810,40) scale(0.36)">
        <g transform="translate(0,-208)" fill="#fff" opacity="0.96">
          <path d="M523.189 551.686c1.908 4.669 3.886 8.91 5.374 13.316.443 1.31.073 3.787-.873 4.543-19.5 15.586-39.137 31.001-58.76 46.435-.232.183-.618.169-1.476.381-15.5-38.805-31.026-77.676-47.075-117.855-3.467 8.83-6.443 16.479-9.471 24.108-22.598 56.927-45.231 113.839-67.742 170.8-1.31 3.315-3.216 5.355-6.313 7.128-30.408 17.41-62.572 31.101-94.624 45.039-.569.247-1.206.337-2.572.704 2.118-5.422 3.96-10.291 5.913-15.116 31.038-76.694 62.124-153.368 93.122-230.078 12.534-31.018 24.93-62.093 37.243-93.2 1.342-3.39 2.998-4.778 6.794-4.754 25.323.16 50.648.175 75.97-.033 3.467-.024 4.807 1.218 6.041 4.279 19.36 48.013 38.861 95.97 58.449 144.303z" />
          <path d="M574.565 603.592c-48.42 57.681-105.078 105.248-168.62 144.743-32.15 19.984-65.732 37.27-100.452 52.368-1.952.849-3.87 2.99-4.708 4.989-5.41 12.893-10.526 25.909-15.71 38.896-.82 2.054-1.501 3.663-4.413 3.654-38.642-.111-77.284-.074-116.595-.074 0-5.45-.003-10.862 0-16.275.002-3.999.009-7.998.018-11.997.026-11.029.021-11.046 10.611-14.845 75.317-27.013 147.27-61.052 215.598-102.76 69.638-42.508 132.452-93.361 188.198-152.932 34.668-37.046 65.951-76.751 93.504-119.371 3.336-5.16 6.484-10.442 9.765-15.638.631-1 1.475-1.866 2.953-2.316-24.575 70.717-61.609 134.234-110.149 191.558z" />
          <path d="M537.611 797.481c-11.676-28.873-23.192-57.397-34.536-85.496 20.813-19.158 41.34-38.052 62.093-57.155 26.134 64.018 52.388 128.333 78.809 193.054-1.462.126-2.69.321-3.918.324-26.315.057-52.631.002-78.944.249-3.196.03-3.935-1.531-4.809-3.746-6.168-15.63-12.354-31.254-18.695-47.23z" />
        </g>
      </g>
      <rect x="0" y="495" width="1920" height="5" fill="rgba(255,255,255,0.20)" />
    </svg>
  );
}
