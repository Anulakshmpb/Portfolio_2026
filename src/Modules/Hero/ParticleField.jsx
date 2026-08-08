import { useMemo } from "react";

const rand = (min, max) => min + Math.random() * (max - min);

/**
 * ParticleField
 * Pure-CSS floating particle dots scattered across the hero section.
 * Very lightweight (no canvas), zero layout cost. Particles slowly drift
 * upward and fade out, creating depth and ambient motion.
 */
export default function ParticleField({ count = 55 }) {
  // Memoized so positions don't re-randomize on parent re-renders
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: rand(0, 100),      // % left
        y: rand(5, 95),       // % top
        size: rand(1, 3.5),   // px
        opacity: rand(0.06, 0.22),
        duration: rand(9, 24), // animation duration
        delay: rand(0, 14),    // stagger start
        color:
          Math.random() > 0.55
            ? "#f97316"         // orange
            : Math.random() > 0.5
            ? "#fbbf24"         // amber
            : "#ffffff",        // white
      })),
    [count]
  );

  return (
    <>
      <style>{`
        @keyframes particleDrift {
          0%   { transform: translateY(0)    translateX(0);   opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translateY(-110px) translateX(24px); opacity: 0; }
        }
      `}</style>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.color,
              opacity: p.opacity,
              animation: `particleDrift ${p.duration}s ${p.delay}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
}
