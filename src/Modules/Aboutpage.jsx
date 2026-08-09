import React, { useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// --- SPARKLE ROTATING STAR BULLET ---
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

const StarKeyframes = () => (
  <style>{`
    @keyframes starSpinY {
      from { transform: rotateY(0deg); }
      to { transform: rotateY(360deg); }
    }
    @keyframes dotFloat {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-8px); }
    }
  `}</style>
);

// --- STARFIELD BACKGROUND ---
const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let w, h;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      const count = Math.floor((w * h) / 3500);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.2,
        glow: Math.random() < 0.03,
        a: Math.random() * 0.6 + 0.3,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach((s) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.arc(s.x, s.y, s.glow ? s.r * 3 : s.r, 0, Math.PI * 2);
        if (s.glow) {
          const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 10);
          grad.addColorStop(0, 'rgba(255,255,255,0.25)');
          grad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = grad;
          ctx.arc(s.x, s.y, s.r * 10, 0, Math.PI * 2);
        }
        ctx.fill();
      });
    };

    resize();
    draw();
    window.addEventListener('resize', () => {
      resize();
      draw();
    });
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

// --- Soft glowing accent orbs (shared set) ---
const GLOW_ORBS = [
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
];

// --- Dense center-dot constellation (shared set) ---
const CENTER_DOTS = [
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
];

// --- ABOUT PAGE (no navbar, centered) ---
export default function Aboutpage() {
  const facts = [
    'Full Stack Engineer (MERN), 1+ years building production software',
    'ERP platforms, dashboards, and payment systems — not demo projects',
    'Firebase real-time apps, Stripe & Razorpay integrations',
    'B.Tech Computer Science, GCE Kannur — CGPA 8.08',
    'Believes good software is scalable, secure, and business-first',
  ];

  /* ── 3D mouse parallax & translation movement ── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawDotX = useMotionValue(0);
  const rawDotY = useMotionValue(0);

  const SPRING = { stiffness: 60, damping: 18, mass: 0.9 };
  const rotateX = useSpring(rawY, SPRING);
  const rotateY = useSpring(rawX, SPRING);
  const moveX = useSpring(rawDotX, SPRING);
  const moveY = useSpring(rawDotY, SPRING);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    rawX.set(nx * 8);
    rawY.set(-ny * 6);
    rawDotX.set(-nx * 35);
    rawDotY.set(-ny * 30);
  }, [rawX, rawY, rawDotX, rawDotY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    rawDotX.set(0);
    rawDotY.set(0);
  }, [rawX, rawY, rawDotX, rawDotY]);

  return (
    <section
      id="about"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden px-6"
      style={{ perspective: "1100px", perspectiveOrigin: "50% 50%" }}
    >
      <StarKeyframes />
      <Starfield />

      {/* Subtle Vignette */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* 3D tilt & translation wrapper */}
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Soft glowing accent orbs */}
        {GLOW_ORBS.map((dot, i) => (
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
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Center dots constellation */}
        {CENTER_DOTS.map((d, i) => (
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
              pointerEvents: "none",
            }}
          />
        ))}

        <div className="relative z-10 max-w-xl w-full text-left px-6">
          <h2
            className="text-3xl md:text-4xl font-normal text-white/90 mb-6"
            style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
          >
            About me
          </h2>
          <div className="h-px w-24 bg-white/15 mb-8" />

          <ul className="space-y-4">
            {facts.map((fact, i) => (
              <li key={i} className="flex items-start gap-3">
                <SparkeStar
                  size={13}
                  color={"rgba(240,237,232,0.6)"}
                  speed={STAR_SPEEDS[i % STAR_SPEEDS.length]}
                  delay={STAR_DELAYS[i % STAR_DELAYS.length]}
                />
                <span className="text-white/70 text-base md:text-lg font-light leading-relaxed" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
                  {fact}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-start gap-3">
            <SparkeStar size={13} color="rgba(240,237,232,0.6)" speed={STAR_SPEEDS[1]} delay={STAR_DELAYS[1]} />
            <span className="text-white/50 text-sm md:text-base font-light tracking-wide" style={{ fontFamily: "'EB Garamond', Georgia, serif" }}>
              Anulakshmi P B · Full Stack Engineer · Kerala
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}