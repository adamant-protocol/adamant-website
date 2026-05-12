// Binary scramble + jitter for cinematic headlines.
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

export default function GlitchText({ text, className = '', intensity = 1, as = 'span' }) {
  const [chars, setChars] = useState(() => text.split(''));
  const baseRef = useRef(text);

  useEffect(() => {
    baseRef.current = text;
    setChars(text.split(''));
  }, [text]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let mounted = true;
    const timeouts = [];

    function tick() {
      if (!mounted) return;
      const runs = 1 + Math.floor(Math.random() * 3 * intensity);
      const base = baseRef.current;
      const indices = [];
      for (let r = 0; r < runs; r++) {
        const start = Math.floor(Math.random() * base.length);
        const len = 1 + Math.floor(Math.random() * 5);
        for (let i = 0; i < len && start + i < base.length; i++) {
          const ch = base[start + i];
          if (ch !== ' ' && ch !== '.' && ch !== ',') indices.push(start + i);
        }
      }
      if (indices.length) {
        setChars((prev) => {
          const next = [...prev];
          indices.forEach((i) => { next[i] = Math.random() > 0.5 ? '1' : '0'; });
          return next;
        });
        const restore = setTimeout(() => {
          if (!mounted) return;
          setChars((prev) => {
            const next = [...prev];
            indices.forEach((i) => { next[i] = baseRef.current[i]; });
            return next;
          });
        }, 60 + Math.random() * 160);
        timeouts.push(restore);
      }
      const delay = 220 + Math.random() * 1100 / intensity;
      timeouts.push(setTimeout(tick, delay));
    }

    timeouts.push(setTimeout(tick, 400));

    return () => {
      mounted = false;
      timeouts.forEach(clearTimeout);
    };
  }, [intensity]);

  const Tag = as;
  return (
    <Tag className={`glitch ${className}`} data-text={text}>
      <span className="glitch-base">{chars.join('')}</span>
      <span className="glitch-ghost glitch-a" aria-hidden="true">{chars.join('')}</span>
      <span className="glitch-ghost glitch-b" aria-hidden="true">{chars.join('')}</span>
      <span className="glitch-slice" aria-hidden="true">{chars.join('')}</span>
    </Tag>
  );
}
