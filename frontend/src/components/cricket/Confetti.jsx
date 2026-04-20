import React, { useEffect, useMemo, useState } from "react";

// Lightweight CSS confetti — 80 pieces, 2.2s animation, no libraries.
export default function Confetti({ show, onDone }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (show) {
      setActive(true);
      const t = setTimeout(() => {
        setActive(false);
        onDone?.();
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [show, onDone]);

  const pieces = useMemo(() => {
    const colors = ["#f5c518", "#1e6f3d", "#ef4444", "#8b5cf6", "#10b981", "#ffffff"];
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      rotate: Math.random() * 360,
      color: colors[i % colors.length],
      size: 6 + Math.random() * 6,
      duration: 1.6 + Math.random() * 0.8,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
      data-testid="confetti-overlay"
      aria-hidden
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.size,
            height: p.size * 0.45,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--r"]: `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}
