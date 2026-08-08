import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * MouseGlow — Enhanced premium custom cursor.
 *
 * Two-layer cursor system:
 *  1. Large ambient glow — slow spring, warm orange radial
 *  2. Precise cursor dot — near-instant spring, sharp orange dot
 *
 * The default OS cursor is hidden while this component is mounted.
 */
export default function MouseGlow() {
  const rawX = useMotionValue(-1000);
  const rawY = useMotionValue(-1000);

  // Glow: slow, atmospheric trailing
  const glowX = useSpring(rawX, { stiffness: 55, damping: 18, mass: 1 });
  const glowY = useSpring(rawY, { stiffness: 55, damping: 18, mass: 1 });

  // Dot: nearly instant, precise tracking
  const dotX = useSpring(rawX, { stiffness: 600, damping: 38 });
  const dotY = useSpring(rawY, { stiffness: 600, damping: 38 });

  useEffect(() => {
    const onMove = (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    // Hide default cursor for premium feel
    document.documentElement.style.cursor = "none";
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.style.cursor = "";
    };
  }, [rawX, rawY]);

  return (
    <>
      {/* Ambient trailing glow */}
      <motion.div
        aria-hidden
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          position: "fixed",
          top: 0,
          left: 0,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(232,117,12,0.1) 0%, rgba(245,158,11,0.04) 45%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 9990,
          willChange: "transform",
        }}
      />

      {/* Sharp cursor dot */}
      <motion.div
        aria-hidden
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#E8750C",
          boxShadow: "0 0 8px rgba(232,117,12,0.6)",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
        }}
      />
    </>
  );
}
