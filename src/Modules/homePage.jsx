import React, { useMemo, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Portrait from "../Logo/portrait_clean.png";

/* ─────────────────────────────────────────────────────────────────────────────
   Design tokens — pure dark starfield palette
───────────────────────────────────────────────────────────────────────────── */
const C = {
  bg: "#000000",
  white: "#F0EDE8",
  muted: "rgba(240,237,232,0.45)",
  dim: "rgba(240,237,232,0.22)",
  faint: "rgba(240,237,232,0.1)",
  red: "rgba(240,237,232,0.9)",
};

const EASE = [0.22, 1, 0.36, 1];
const fade = (d = 0, y = 20) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { delay: d, duration: 0.9, ease: EASE },
});

/* ─────────────────────────────────────────────────────────────────────────────
   Star Field — three-tier galaxy star field (dust / stars / bright)
─────────────────────────────────────────────────────────────────────────────── */
const rand = (min, max) => min + Math.random() * (max - min);

/* Tiered star config: dust micro-particles, mid stars, bright stars */
const STAR_TIERS = [
  { count: 420, sizeMin: 0.4, sizeMax: 1.0, opMin: 0.10, opMax: 0.50, twMin: 3, twMax: 9, glow: false },
  { count: 240, sizeMin: 1.0, sizeMax: 2.2, opMin: 0.30, opMax: 0.80, twMin: 2, twMax: 6, glow: false },
  { count: 45, sizeMin: 2.2, sizeMax: 3.6, opMin: 0.60, opMax: 1.00, twMin: 1, twMax: 4, glow: true },
];

function StarField() {
  const allStars = useMemo(() => {
    let id = 0;
    return STAR_TIERS.flatMap((tier) =>
      Array.from({ length: tier.count }, () => ({
        id: id++,
        x: rand(0, 100),
        y: rand(0, 100),
        size: rand(tier.sizeMin, tier.sizeMax),
        opacity: rand(tier.opMin, tier.opMax),
        twinkleDuration: rand(tier.twMin, tier.twMax),
        twinkleDelay: rand(0, 7),
        glow: tier.glow,
      }))
    );
  }, []);

  return (
    <>
      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: var(--star-opacity); transform: scale(1); }
          50%       { opacity: calc(var(--star-opacity) * 0.18); transform: scale(0.6); }
        }
        @keyframes starPulse {
          0%, 100% { opacity: var(--star-opacity); transform: scale(1);   box-shadow: 0 0 4px 1px rgba(255,255,255,0.3); }
          50%       { opacity: 1;                   transform: scale(1.35); box-shadow: 0 0 10px 3px rgba(255,255,255,0.55); }
        }
        @keyframes shootingStar {
          0%   { transform: translateX(0)   translateY(0)   scaleX(0);   opacity: 0; }
          5%   { opacity: 1; scaleX(1); }
          80%  { opacity: 0.8; }
          100% { transform: translateX(260px) translateY(130px) scaleX(1); opacity: 0; }
        }
      `}</style>

      {/* Star particles */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {allStars.map((s) => (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: "#ffffff",
              "--star-opacity": s.opacity,
              opacity: s.opacity,
              animation: `starTwinkle ${s.twinkleDuration}s ${s.twinkleDelay}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Logo icon — modern bare monogram, no background box
─────────────────────────────────────────────────────────────────────────────── */
function LogoIcon() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, gap: 3 }}>
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 900,
          fontSize: 22,
          lineHeight: 1,
          color: "#F0EDE8",
          letterSpacing: "-0.06em",
          opacity: 0.92,
        }}
      >
        A
      </span>
      <span
        style={{
          display: "block",
          width: 14,
          height: 1.5,
          borderRadius: 2,
          background: "rgba(240,237,232,0.5)",
        }}
      />
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────────────────
   Top navigation bar
───────────────────────────────────────────────────────────────────────────── */
function TopNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.1 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "36px 48px",
        maxWidth: 1100,
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Left: Logo + Name */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <LogoIcon />
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 400,
            fontSize: 13,
            letterSpacing: "0.05em",
            color: "rgba(240,237,232,0.75)",
          }}
        >
          Anulakshmi P B
        </span>
      </div>

      {/* Right: Portfolio label */}
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          letterSpacing: "0.28em",
          color: "rgba(240,237,232,0.4)",
          textTransform: "uppercase",
        }}
      >
        Portfolio
      </span>
    </motion.header>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Portrait in rectangular frame
───────────────────────────────────────────────────────────────────────────── */
function PortraitFrame() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.55, ease: EASE }}
      style={{
        position: "relative",
        width: 170,
        height: 195,
        flexShrink: 0,
      }}
    >
      {/* Outer frame border */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1.5px solid rgba(240,237,232,0.55)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      {/* Corner accent — top-right */}
      <div
        style={{
          position: "absolute",
          top: -5,
          right: -5,
          width: 18,
          height: 18,
          borderTop: "1.5px solid rgba(240,237,232,0.55)",
          borderRight: "1.5px solid rgba(240,237,232,0.55)",
          zIndex: 3,
        }}
      />
      {/* Corner accent — bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: -5,
          left: -5,
          width: 18,
          height: 18,
          borderBottom: "1.5px solid rgba(240,237,232,0.55)",
          borderLeft: "1.5px solid rgba(240,237,232,0.55)",
          zIndex: 3,
        }}
      />

      {/* Image — grayscale */}
      <img
        src={Portrait}
        alt="Anulakshmi P B"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          filter: "grayscale(100%) contrast(1.1) brightness(0.88)",
          display: "block",
        }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Roles list 
───────────────────────────────────────────────────────────────────────────── */
const ROLES = [
  { label: "Full Stack Developer (MERN)" },
  { label: "React.js • Node.js • MongoDB • Firebase | Building ERP" },
  { label: "Building ERP, Dashboards & Payment Systems" },
  { label: "Open to India & Gulf (UAE, KSA, Qatar, Oman, Kuwait, Bahrain)" },
];

/* 6-pointed sparkle star — 3 crossing lines at 0°, 60°, 120° */
function SparkeStar({ size = 14, color = "rgba(240,237,232,0.7)", speed = "3s", delay = "0s" }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
        perspective: "80px",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: `starSpinY ${speed} ${delay} linear infinite`,
          transformStyle: "preserve-3d",
          filter: `drop-shadow(0 0 3px ${color})`,
        }}
      >
        {/* Line 1: horizontal */}
        <line x1="1" y1="7" x2="13" y2="7" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        {/* Line 2: diagonal \ */}
        <line x1="3.5" y1="2" x2="10.5" y2="12" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        {/* Line 3: diagonal / */}
        <line x1="10.5" y1="2" x2="3.5" y2="12" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

const STAR_SPEEDS = ["3.2s", "2.8s", "3.6s", "4.0s"];
const STAR_DELAYS = ["0s", "0.8s", "0.4s", "1.2s"];

function RoleList() {
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } },
      }}
      style={{ listStyle: "none", padding: 0, margin: 0 }}
    >
      {ROLES.map((r, i) => (
        <motion.li
          key={r.label}
          variants={{
            hidden: { opacity: 0, x: -16 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 9,
          }}
        >
          <SparkeStar speed={STAR_SPEEDS[i]} delay={STAR_DELAYS[i]} />
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(0.82rem, 1.1vw, 1rem)",
              color: C.white,
              letterSpacing: "0.04em",
            }}
          >
            {r.label}
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

function ScrollIcon() {
  return (
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: 14,
        background: "rgba(240,237,232,0.06)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(240,237,232,0.18)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
      }}
    >
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main HomePage export
───────────────────────────────────────────────────────────────────────────── */
export default function HomePage() {
  /* ── 3D mouse parallax & translation movement ── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawDotX = useMotionValue(0);
  const rawDotY = useMotionValue(0);

  const SPRING = { stiffness: 60, damping: 18, mass: 0.9 };
  const rotateX = useSpring(rawY, SPRING);   // mouse Y  → tilt around X-axis
  const rotateY = useSpring(rawX, SPRING);   // mouse X  → tilt around Y-axis
  const moveX = useSpring(rawDotX, SPRING);   // mouse X  → translation movement
  const moveY = useSpring(rawDotY, SPRING);   // mouse Y  → translation movement

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2; // -1 … +1
    const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    rawX.set(nx * 8);       // max ±8° tilt
    rawY.set(-ny * 6);      // max ±6° tilt
    rawDotX.set(-nx * 35);  // shift in opposite direction of mouse X
    rawDotY.set(-ny * 30);  // shift in opposite direction of mouse Y
  }, [rawX, rawY, rawDotX, rawDotY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    rawDotX.set(0);
    rawDotY.set(0);
  }, [rawX, rawY, rawDotX, rawDotY]);

  return (
    <>
      {/* ── Global keyframes ── */}
      <style>{`
        @keyframes dotFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes scrollLineAnim {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          50.1% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @keyframes sectionArrow {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-3px); }
        }
        @keyframes starSpinY {
          0%   { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
      `}</style>

      <section
        id="home"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          minHeight: 600,
          background: "transparent",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          perspective: "1100px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* ── Galaxy star field — STATIC background ── */}
        {/* StarField removed in favor of global fixed canvas backdrop in App.js */}

        {/* ── Subtle vignette — STATIC ── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* ── 3D tilt & translation wrapper ── */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            rotateX,
            rotateY,
            x: moveX,
            y: moveY,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >

        {/* ── Soft glowing accent orbs — blurry galaxy halos ── */}
        {[
          { top: "30%", left: "44%", size: 7,  blur: 10, delay: 1.4, animDelay: "1.5s", dur: "3s",   op: 0.55 },
          { top: "22%", left: "18%", size: 9,  blur: 14, delay: 1.7, animDelay: "0.8s", dur: "3.8s", op: 0.40 },
          { top: "68%", left: "72%", size: 11, blur: 18, delay: 2.0, animDelay: "2.1s", dur: "4.2s", op: 0.35 },
          { top: "15%", left: "60%", size: 6,  blur: 12, delay: 1.9, animDelay: "1.0s", dur: "3.4s", op: 0.45 },
          { top: "55%", left: "25%", size: 10, blur: 16, delay: 2.2, animDelay: "3.0s", dur: "4.8s", op: 0.30 },
          { top: "80%", left: "50%", size: 8,  blur: 14, delay: 2.5, animDelay: "0.5s", dur: "3.6s", op: 0.28 },
          { top: "40%", left: "82%", size: 12, blur: 20, delay: 2.8, animDelay: "1.8s", dur: "5.0s", op: 0.25 },
          { top: "10%", left: "35%", size: 7,  blur: 11, delay: 1.6, animDelay: "2.5s", dur: "3.2s", op: 0.38 },
          { top: "72%", left: "12%", size: 9,  blur: 15, delay: 3.0, animDelay: "0.3s", dur: "4.0s", op: 0.22 },
          { top: "48%", left: "92%", size: 6,  blur: 10, delay: 2.1, animDelay: "1.3s", dur: "3.5s", op: 0.32 },
        ].map((dot, i) => (
          <motion.div
            key={`glow-${i}`}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: dot.op }}
            transition={{ delay: dot.delay, duration: 1.2 }}
            style={{
              position: "absolute",
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.88)",
              filter: `blur(${dot.blur}px)`,
              boxShadow: `0 0 ${dot.blur * 2}px ${dot.blur}px rgba(255,255,255,0.15), 0 0 ${dot.blur * 4}px ${dot.blur * 2}px rgba(255,255,255,0.06)`,
              zIndex: 5,
              animation: `dotFloat ${dot.dur} ${dot.animDelay} ease-in-out infinite`,
            }}
          />
        ))}

        {/* ── Center dots — dense horizontal constellation ── */}
        {[
          { top: "38%", left: "38%", size: 4, opacity: 0.35, blur: 3, delay: "0s" },
          { top: "52%", left: "42%", size: 3, opacity: 0.28, blur: 4, delay: "0.6s" },
          { top: "44%", left: "55%", size: 5, opacity: 0.22, blur: 5, delay: "1.1s" },
          { top: "60%", left: "48%", size: 3, opacity: 0.30, blur: 3, delay: "1.7s" },
          { top: "35%", left: "50%", size: 4, opacity: 0.18, blur: 6, delay: "0.3s" },
          { top: "48%", left: "36%", size: 3, opacity: 0.25, blur: 4, delay: "2.0s" },
          { top: "55%", left: "58%", size: 5, opacity: 0.20, blur: 5, delay: "1.4s" },
          { top: "42%", left: "46%", size: 3, opacity: 0.32, blur: 3, delay: "0.9s" },
          { top: "65%", left: "43%", size: 4, opacity: 0.16, blur: 6, delay: "1.8s" },
          { top: "33%", left: "60%", size: 3, opacity: 0.24, blur: 4, delay: "2.3s" },
          { top: "46%", left: "8%", size: 3, opacity: 0.20, blur: 4, delay: "0.4s" },
          { top: "50%", left: "14%", size: 4, opacity: 0.28, blur: 3, delay: "1.2s" },
          { top: "43%", left: "21%", size: 3, opacity: 0.22, blur: 5, delay: "0.7s" },
          { top: "48%", left: "28%", size: 5, opacity: 0.18, blur: 6, delay: "2.1s" },
          { top: "45%", left: "32%", size: 3, opacity: 0.30, blur: 3, delay: "0.2s" },
          { top: "51%", left: "51%", size: 4, opacity: 0.26, blur: 4, delay: "1.5s" },
          { top: "47%", left: "62%", size: 3, opacity: 0.22, blur: 5, delay: "0.8s" },
          { top: "49%", left: "68%", size: 5, opacity: 0.19, blur: 6, delay: "2.4s" },
          { top: "44%", left: "74%", size: 3, opacity: 0.28, blur: 3, delay: "1.0s" },
          { top: "52%", left: "79%", size: 4, opacity: 0.24, blur: 4, delay: "0.5s" },
          { top: "46%", left: "86%", size: 3, opacity: 0.20, blur: 5, delay: "1.9s" },
          { top: "50%", left: "92%", size: 4, opacity: 0.17, blur: 6, delay: "2.6s" },
          { top: "48%", left: "33%",   size: 1, opacity: 0.38, blur: 1, delay: "0.1s" },
          { top: "51%", left: "36%",   size: 2, opacity: 0.30, blur: 2, delay: "0.9s" },
          { top: "46%", left: "38%",   size: 1, opacity: 0.42, blur: 1, delay: "1.6s" },
          { top: "53%", left: "40%",   size: 2, opacity: 0.28, blur: 2, delay: "0.3s" },
          { top: "47%", left: "43%",   size: 1, opacity: 0.35, blur: 1, delay: "2.0s" },
          { top: "50%", left: "45%",   size: 2, opacity: 0.32, blur: 2, delay: "1.1s" },
          { top: "45%", left: "47%",   size: 1, opacity: 0.40, blur: 1, delay: "0.5s" },
          { top: "54%", left: "49%",   size: 2, opacity: 0.26, blur: 2, delay: "1.8s" },
          { top: "48%", left: "52%",   size: 1, opacity: 0.36, blur: 1, delay: "2.5s" },
          { top: "46%", left: "54%",   size: 2, opacity: 0.30, blur: 2, delay: "0.7s" },
          { top: "52%", left: "56%",   size: 1, opacity: 0.38, blur: 1, delay: "1.3s" },
          { top: "49%", left: "58%",   size: 2, opacity: 0.28, blur: 2, delay: "0.2s" },
          { top: "44%", left: "61%",   size: 1, opacity: 0.34, blur: 1, delay: "2.2s" },
          { top: "53%", left: "63%",   size: 2, opacity: 0.26, blur: 2, delay: "1.0s" },
          { top: "47%", left: "65%",   size: 1, opacity: 0.40, blur: 1, delay: "0.6s" },
          { top: "50%", left: "67%",   size: 2, opacity: 0.30, blur: 2, delay: "1.7s" },
          { top: "48%", left: "34.5%", size: 1, opacity: 0.33, blur: 1, delay: "2.8s" },
          { top: "52%", left: "41.5%", size: 1, opacity: 0.37, blur: 1, delay: "0.4s" },
          { top: "46%", left: "53.5%", size: 1, opacity: 0.41, blur: 1, delay: "1.5s" },
          { top: "50%", left: "60.5%", size: 1, opacity: 0.29, blur: 1, delay: "2.1s" },
        ].map((d, i) => (
          <motion.div
            key={`cdot-${i}`}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: d.opacity }}
            transition={{ delay: 1.6 + i * 0.12, duration: 1 }}
            style={{
              position: "absolute",
              top: d.top,
              left: d.left,
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.95)",
              filter: `blur(${d.blur}px)`,
              zIndex: 4,
              animation: `dotFloat ${3 + i * 0.4}s ease-in-out infinite`,
              animationDelay: d.delay,
            }}
          />
        ))}


        {/* ── Top Navigation ── */}
        <TopNav />

        {/* ── Main hero layout ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 0px 60px",
          }}
        >
          {/* Centered inner container */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              maxWidth: 1000,
              padding: "0 32px",
            }}
          >
            {/* ══ Left content ══ */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* HEADLINE: single row — outlined + solid side by side */}
              <div style={{ overflow: "hidden", marginBottom: 14 }}>
                <motion.div
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.05, delay: 0.2, ease: EASE }}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.28em",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span className="hero-name-outline">ANULAKSHMI </span>
                  <span className="hero-name-solid"> P B</span>
                </motion.div>
              </div>

              {/* Role list */}
              <RoleList />
            </div>

            {/* ══ Right side: portrait ══ */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
                flexShrink: 0,
              }}
            >
              <PortraitFrame />
            </div>
          </div>
        </div>


        {/* ── Bottom center: scroll icon + label + line ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.9 }}
          style={{
            position: "absolute",
            bottom: 48,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            zIndex: 20,
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: C.dim,
            }}
          >
            Scroll to fly
          </span>

          {/* Animated vertical line */}
          <div
            style={{
              width: 1,
              height: 44,
              background: `linear-gradient(to bottom, rgba(240,237,232,0.5), transparent)`,
              animation: "scrollLineAnim 2s ease-in-out infinite",
            }}
          />
        </motion.div>

        {/* ── Bottom left: section label ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          style={{
            position: "absolute",
            bottom: 28,
            left: 32,
            display: "flex",
            alignItems: "center",
            gap: 8,
            zIndex: 20,
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              color: "rgba(240,237,232,0.28)",
              textTransform: "uppercase",
            }}
          >
            Section
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.2em",
              color: "rgba(240,237,232,0.72)",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Intro
          </span>
          <span
            style={{
              fontSize: 9,
              color: "rgba(240,237,232,0.45)",
              animation: "sectionArrow 2s ease-in-out infinite",
              display: "inline-block",
            }}
          >
            ∧
          </span>
        </motion.div>

        {/* ── Inline CSS for hero name typography ── */}
        <style>{`
          .hero-name-outline {
            font-family: 'Outfit', sans-serif;
            font-weight: 900;
            font-size: clamp(2rem, 4.8vw, 5rem);
            letter-spacing: 0.08em;
            line-height: 0.95;
            display: inline;
            color: transparent;
            -webkit-text-stroke: 1.6px rgba(240,237,232,0.88);
            text-stroke: 1.6px rgba(240,237,232,0.88);
          }

          .hero-name-solid {
            font-family: 'Outfit', sans-serif;
            font-weight: 900;
            font-size: clamp(2rem, 4.8vw, 5rem);
            letter-spacing: 0.02em;
            line-height: 0.95;
            display: inline;
            color: #F0EDE8;
            margin-left:10px;
          }

          @media (max-width: 640px) {
            .hero-name-outline,
            .hero-name-solid {
              font-size: clamp(1.4rem, 7vw, 2.6rem);
              -webkit-text-stroke-width: 1px;
            }
          }
        `}</style>
        </motion.div>{/* end 3D tilt wrapper */}
      </section>
    </>
  );
}