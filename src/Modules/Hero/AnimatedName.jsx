import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * AnimatedName — Premium word-mask slide-up reveal.
 *
 * Each line clips upward from behind an overflow:hidden mask, the
 * signature technique used by Linear, Framer templates, and SOTD winners.
 * The name stays as a two-line typographic composition with a subtle
 * metallic shimmer running across it.
 */

const LINE1 = "ANULAKSHMI";
const LINE2 = "P B";

// Mask slide-up timing
const maskVariant = {
  hidden: { y: "105%", opacity: 0 },
  visible: (delay) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: 1.05,
      ease: [0.22, 1, 0.36, 1],
      delay,
    },
  }),
};

export default function AnimatedName() {
  const ref = useRef(null);
  const rX = useMotionValue(0);
  const rY = useMotionValue(0);
  const srX = useSpring(rX, { stiffness: 60, damping: 20 });
  const srY = useSpring(rY, { stiffness: 60, damping: 20 });

  const onMouseMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rX.set(((e.clientY - r.top - r.height / 2) / r.height) * -6);
    rY.set(((e.clientX - r.left - r.width / 2) / r.width) * 6);
  };

  return (
    <>
      <style>{`
        @keyframes shimmerSweep {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .name-l1 {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(3.2rem, 6.5vw, 6rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 0.92;
          background: linear-gradient(
            100deg,
            #f5f0e8 0%,
            #fde68a 30%,
            #ffffff 50%,
            #fde68a 70%,
            #f5f0e8 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmerSweep 7s linear infinite;
          display: block;
        }
        .name-l2 {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(3.2rem, 6.5vw, 6rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 0.92;
          color: #E8750C;
          display: block;
          padding-left: clamp(1.5rem, 3vw, 3rem);
        }
      `}</style>

      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={() => { rX.set(0); rY.set(0); }}
        style={{
          rotateX: srX,
          rotateY: srY,
          transformStyle: "preserve-3d",
          perspective: "1200px",
        }}
        className="cursor-default select-none"
      >
        {/* Line 1 — white metallic */}
        <div style={{ overflow: "hidden" }}>
          <motion.div
            custom={0.25}
            variants={maskVariant}
            initial="hidden"
            animate="visible"
          >
            <span className="name-l1">{LINE1}</span>
          </motion.div>
        </div>

        {/* Line 2 — orange accent, slightly indented for drama */}
        <div style={{ overflow: "hidden" }}>
          <motion.div
            custom={0.45}
            variants={maskVariant}
            initial="hidden"
            animate="visible"
          >
            <span className="name-l2">{LINE2}</span>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
