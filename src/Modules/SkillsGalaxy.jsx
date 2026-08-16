import React, { useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   Design tokens — identical to Heropage / Aboutpage
───────────────────────────────────────────────────────────────────────────── */
const C = {
  bg: "#000000",
  white: "#F0EDE8",
  muted: "rgba(240,237,232,0.45)",
  dim: "rgba(240,237,232,0.22)",
  faint: "rgba(240,237,232,0.1)",
};

const EASE = [0.22, 1, 0.36, 1];

const STAR_SPEEDS = ["3.2s", "2.8s", "3.6s", "4.0s"];
const STAR_DELAYS = ["0s", "0.8s", "0.4s", "1.2s"];

/* 6-pointed sparkle star — same as Heropage / Aboutpage */
function SparkeStar({ size = 12, color = "rgba(240,237,232,0.6)", speed = "3s", delay = "0s" }) {
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
        <line x1="1" y1="7" x2="13" y2="7" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="3.5" y1="2" x2="10.5" y2="12" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="10.5" y1="2" x2="3.5" y2="12" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/* Soft glowing accent orbs — same set used on Heropage / Aboutpage */
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

/* ─────────────────────────────────────────────────────────────────────────────
   Skill data — restructured into categories from the provided list
───────────────────────────────────────────────────────────────────────────── */
const SKILL_CATEGORIES = [
  { title: "Frontend Development", items: ["React.js", "JavaScript (ES6+)", "HTML5", "CSS3", "Tailwind CSS", "Material UI", "Bootstrap", "Framer Motion", "Redux Toolkit", "Context API"] },
  { title: "Backend Development", items: ["Node.js", "Express.js", "Firebase Cloud Functions", "REST API Design"] },
  { title: "Database Management", items: ["MongoDB", "Firestore", "SQL"] },
  { title: "APIs & Integrations", items: ["Stripe", "Razorpay", "Twilio", "Google Maps API", "Firebase Cloud Messaging (FCM)"] },
  { title: "Cloud & DevOps Tools", items: ["Firebase Hosting", "Cloud Functions", "AWS S3", "Git", "GitHub", "Postman"] },
  { title: "Authentication & Security", items: ["JWT", "RBAC", "OTP Authentication", "Bcrypt", "Helmet", "API Rate Limiting"] },
  { title: "Other Tools & Libraries", items: ["Socket.io", "Joi", "Nodemailer", "Recharts", "ExcelJS"] },
  { title: "Programming Languages", items: ["JavaScript", "Python", "C"] },
  { title: "Professional Skills", items: ["Problem Solving", "Team Collaboration", "Communication", "Time Management"] },
];

/* One category card — compact, fits a 3x3 grid on one screen */
function SkillCard({ category, index }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
      }}
      style={{
        position: "relative",
        padding: "10px 14px 12px",
        borderRadius: 12,
        border: `1px solid ${C.faint}`,
        background: "rgba(240,237,232,0.02)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", top: -1, right: -1, width: 14, height: 14, borderTop: `1.5px solid ${C.dim}`, borderRight: `1.5px solid ${C.dim}` }} />
      <div style={{ position: "absolute", bottom: -1, left: -1, width: 14, height: 14, borderBottom: `1.5px solid ${C.dim}`, borderLeft: `1.5px solid ${C.dim}` }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <SparkeStar
          size={11}
          color="rgba(240,237,232,0.7)"
          speed={STAR_SPEEDS[index % STAR_SPEEDS.length]}
          delay={STAR_DELAYS[index % STAR_DELAYS.length]}
        />
        <h3
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: 10.5,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: C.white,
            margin: 0,
          }}
        >
          {category.title}
        </h3>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {category.items.map((item) => (
          <span
            key={item}
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 11,
              lineHeight: 1.3,
              color: "rgba(240,237,232,0.7)",
              padding: "3px 8px",
              borderRadius: 999,
              border: "1px solid rgba(240,237,232,0.14)",
              background: "rgba(240,237,232,0.03)",
              whiteSpace: "nowrap",
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main SkillsGalaxy export — Technical Skills, styled to match Hero/About.
   All 9 categories in a 3x3 grid, sized to fit one viewport, no scrolling.
───────────────────────────────────────────────────────────────────────────── */
export default function SkillsGalaxy() {
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
      id="skills"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "transparent",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 0",
        perspective: "1100px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      <style>{`
        @keyframes starSpinY {
          0%   { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes dotFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>

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

      {/* Content — capped to viewport, grid sized to never need scroll */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6" style={{ maxHeight: "92vh" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ marginBottom: 14, textAlign: "left" }}
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
            Expertise
          </span>
          <h2
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(1.25rem, 2.1vw, 1.6rem)",
              color: "rgba(240,237,232,0.92)",
              margin: "4px 0 0",
            }}
          >
            Technical Skills
          </h2>
          <div style={{ height: 1, width: 64, background: "rgba(240,237,232,0.15)", marginTop: 8 }} />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
          }}
        >
          {SKILL_CATEGORIES.map((category, i) => (
            <SkillCard key={category.title} category={category} index={i} />
          ))}
        </motion.div>
      </div>
      </motion.div>
    </section>
  );
}