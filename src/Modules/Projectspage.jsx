import React, { useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { gsap } from "gsap";

/* ─────────────────────────────────────────────────────────────────────────────
   Design tokens — identical to Heropage / Aboutpage / SkillsGalaxy / Experiencepage
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

/* 6-pointed sparkle star — same as Heropage / Aboutpage / SkillsGalaxy */
function SparkeStar({ size = 13, color = "rgba(240,237,232,0.6)", speed = "3s", delay = "0s" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, flexShrink: 0, perspective: "80px" }}>
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ animation: `starSpinY ${speed} ${delay} linear infinite`, transformStyle: "preserve-3d", filter: `drop-shadow(0 0 3px ${color})` }}>
        <line x1="1" y1="7" x2="13" y2="7" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="3.5" y1="2" x2="10.5" y2="12" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="10.5" y1="2" x2="3.5" y2="12" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/* Soft glowing accent orbs — same set used site-wide */
const GLOW_ORBS = [
  { top: "30%", left: "44%", size: 7, blur: 10, delay: 1.4, animDelay: "1.5s", dur: "3s", op: 0.55 },
  { top: "22%", left: "18%", size: 9, blur: 14, delay: 1.7, animDelay: "0.8s", dur: "3.8s", op: 0.40 },
  { top: "68%", left: "72%", size: 11, blur: 18, delay: 2.0, animDelay: "2.1s", dur: "4.2s", op: 0.35 },
  { top: "15%", left: "60%", size: 6, blur: 12, delay: 1.9, animDelay: "1.0s", dur: "3.4s", op: 0.45 },
  { top: "55%", left: "25%", size: 10, blur: 16, delay: 2.2, animDelay: "3.0s", dur: "4.8s", op: 0.30 },
  { top: "80%", left: "50%", size: 8, blur: 14, delay: 2.5, animDelay: "0.5s", dur: "3.6s", op: 0.28 },
  { top: "40%", left: "82%", size: 12, blur: 20, delay: 2.8, animDelay: "1.8s", dur: "5.0s", op: 0.25 },
  { top: "10%", left: "35%", size: 7, blur: 11, delay: 1.6, animDelay: "2.5s", dur: "3.2s", op: 0.38 },
  { top: "72%", left: "12%", size: 9, blur: 15, delay: 3.0, animDelay: "0.3s", dur: "4.0s", op: 0.22 },
  { top: "48%", left: "92%", size: 6, blur: 10, delay: 2.1, animDelay: "1.3s", dur: "3.5s", op: 0.32 },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Project data — unchanged content
───────────────────────────────────────────────────────────────────────────── */
const PROJECTS_DATA = [
  {
    id: "myrailpool",
    title: "MyRailPool",
    role: "Shared Commuting Platform",
    duration: "Production Ready",
    impact: "A ride-sharing platform designed for railway commuters",
    technologies: ["React", "Redux Toolkit", "Firebase", "Node.js", "Tailwind CSS", "Stripe", "Google Maps API"],
    dashboardType: "logistics",
  },
  {
    id: "atc-erp",
    title: "ATC Business Management Dashboard",
    role: "Enterprise ERP Platform",
    duration: "Production Ready",
    impact: "Dashboard managing finance, logistics, trading, inventory, investments, and property operations",
    technologies: ["React", "Firebase", "Firestore", "Cloud Functions", "Tailwind CSS", "Material UI", "ExcelJS", "Recharts"],
    dashboardType: "finance",
  },
  {
    id: "construction-erp",
    title: "Construction ERP",
    role: "Enterprise Construction Management Platform",
    duration: "Production Ready",
    impact: "Realtime tracking for projects, material inventories, attendance, and Measurement Books",
    technologies: ["React", "Firebase", "Firestore", "Tailwind CSS", "Material UI", "Recharts"],
    dashboardType: "construction",
  },
  {
    id: "rivora",
    title: "Rivora",
    role: "Full Stack MERN E-Commerce Platform",
    duration: "Production Ready",
    impact: "MERN storefront with Razorpay checkout gateways, OTP validation, and socket logs",
    technologies: ["React", "Node.js", "Express.js", "MongoDB", "JWT", "Socket.io", "Razorpay", "Joi", "Nodemailer"],
    dashboardType: "luxury",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Mini live dashboard preview
───────────────────────────────────────────────────────────────────────────── */
function MiniDashboardPreview({ type }) {
  const [ticker, setTicker] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => setTicker((p) => (p + 1) % 100), 1500);
    return () => clearInterval(timer);
  }, []);

  const base = {
    background: "#000000",
    color: C.white,
    fontFamily: "monospace",
  };
  const label = { color: "rgba(240,237,232,0.45)" };
  const accent = { color: "rgba(240,237,232,0.85)" };
  const bar = "rgba(240,237,232,0.55)";
  const border = "rgba(240,237,232,0.12)";

  if (type === "logistics") {
    return (
      <div style={{ ...base, width: "100%", height: "100%", padding: 10, fontSize: 9, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${border}`, paddingBottom: 4, alignItems: "center" }}>
          <span style={{ ...accent, fontWeight: 700 }}>RAIL_POOL_TELEMETRY</span>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: bar }} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 56, borderBottom: `1px solid ${border}`, paddingBottom: 4, justifyContent: "center" }}>
          {[40, 75, 60, 95, 80, 110, 85, 120].map((h, i) => (
            <motion.div key={i} animate={{ height: `${(h + (i === ticker % 8 ? 20 : 0)) * 0.35}px` }} style={{ width: 8, background: bar, borderRadius: "2px 2px 0 0" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", ...label }}>
          <span>TRAIN_4491:</span>
          <span style={accent}>ON_ROUTE_A</span>
        </div>
      </div>
    );
  }

  if (type === "finance") {
    return (
      <div style={{ ...base, width: "100%", height: "100%", padding: 10, fontSize: 9, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${border}`, paddingBottom: 4 }}>
          <span style={{ ...accent, fontWeight: 700 }}>LEDGER_CONSOLE</span>
          <span style={label}>NODE_982</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
          <div>
            <span style={{ ...label, display: "block", fontSize: 7 }}>OPERATIONS VALUE</span>
            <span style={{ ...accent, fontWeight: 900, fontSize: 12 }}>${(148920 + ticker * 110).toLocaleString()}</span>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${border}`, position: "relative" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ position: "absolute", inset: 1, borderTop: `1px solid ${bar}`, borderRadius: "50%" }} />
          </div>
        </div>
        <div style={{ ...label, fontSize: 7 }}>&gt; COMPILING_REPORT_DONE</div>
      </div>
    );
  }

  if (type === "construction") {
    return (
      <div style={{ ...base, width: "100%", height: "100%", padding: 10, fontSize: 9, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${border}`, paddingBottom: 4 }}>
          <span style={{ ...accent, fontWeight: 700 }}>MATERIAL_LOGISTICS</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "8px 0" }}>
          {[
            { label: "SITE_ALPHA_CEMENT", val: 78 + (ticker % 10) },
            { label: "SITE_BETA_STEEL", val: 42 + (ticker % 5) },
          ].map((row) => (
            <div key={row.label}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 7, ...label }}>
                <span>{row.label}:</span>
                <span style={accent}>{row.val}%</span>
              </div>
              <div style={{ height: 4, width: "100%", background: "rgba(240,237,232,0.06)", borderRadius: 4, overflow: "hidden", marginTop: 2 }}>
                <motion.div animate={{ width: `${row.val}%` }} style={{ height: "100%", background: bar }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...base, width: "100%", height: "100%", padding: 10, fontSize: 9, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${border}`, paddingBottom: 4 }}>
        <span style={{ ...accent, fontWeight: 700 }}>RIVORA_VISUALIZER</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4, padding: "8px 0", justifyItems: "center" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            width: 16, height: 16, borderRadius: 4,
            border: `1px solid ${(i + ticker) % 3 === 0 ? "rgba(240,237,232,0.6)" : border}`,
            background: (i + ticker) % 3 === 0 ? "rgba(240,237,232,0.14)" : "rgba(240,237,232,0.02)",
            fontSize: 7, display: "flex", alignItems: "center", justifyContent: "center", ...label,
          }}>
            {i + 1}
          </div>
        ))}
      </div>
      <div style={{ ...label, fontSize: 7, textAlign: "center" }}>OCCUPANCY: 42%</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Project card with interactive mouse tilt
───────────────────────────────────────────────────────────────────────────── */
function ProjectCard({ proj, index, onOpenCaseStudy }) {
  const cardRef = useRef(null);

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cardRef.current, {
      rotateY: x * 8,
      rotateX: -y * 8,
      translateZ: 10,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleCardMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      translateZ: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: EASE }}
      className="flex-shrink-0 group cursor-pointer"
      style={{
        width: "min(82vw, 380px)",
        perspective: "1000px",
      }}
      onClick={() => onOpenCaseStudy(proj)}
    >
      <div
        ref={cardRef}
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        style={{
          position: "relative",
          borderRadius: 20,
          border: `1px solid ${C.faint}`,
          background: "rgba(240,237,232,0.025)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          overflow: "hidden",
          padding: "20px 20px 22px",
          transformStyle: "preserve-3d",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        }}
        className="hover:border-white/20 hover:shadow-[0_10px_30px_rgba(255,255,255,0.04)]"
      >
        <div style={{ position: "absolute", top: -1, right: -1, width: 18, height: 18, borderTop: `1.5px solid ${C.dim}`, borderRight: `1.5px solid ${C.dim}` }} />
        <div style={{ position: "absolute", bottom: -1, left: -1, width: 18, height: 18, borderBottom: `1.5px solid ${C.dim}`, borderLeft: `1.5px solid ${C.dim}` }} />

        {/* Screen mockup */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 18, transform: "translateZ(15px)" }}>
          <div style={{ width: "90%", aspectRatio: "16/10", background: "#0a0a0a", borderRadius: "10px 10px 0 0", border: `1px solid ${C.faint}`, padding: 5 }}>
            <div style={{ width: "100%", height: "100%", borderRadius: 4, overflow: "hidden", border: "1px solid rgba(0,0,0,0.6)" }}>
              <MiniDashboardPreview type={proj.dashboardType} />
            </div>
          </div>
          <div style={{ width: "96%", height: 7, background: "#0a0a0a", borderRadius: "0 0 6px 6px", borderTop: `1px solid ${C.faint}` }} />
        </div>

        {/* Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left", transform: "translateZ(10px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SparkeStar size={12} color="rgba(240,237,232,0.7)" speed={STAR_SPEEDS[index % STAR_SPEEDS.length]} delay={STAR_DELAYS[index % STAR_DELAYS.length]} />
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17, color: C.white, margin: 0, letterSpacing: "0.01em" }}>
                {proj.title}
              </h3>
            </div>
            <span style={{ fontFamily: "monospace", fontSize: 8.5, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dim, whiteSpace: "nowrap" }}>
              {proj.duration}
            </span>
          </div>

          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(240,237,232,0.4)", margin: 0 }}>
            {proj.role}
          </p>

          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 10px", borderRadius: 10, border: `1px solid ${C.faint}`, background: "rgba(240,237,232,0.02)" }}>
            <TrendingUp size={14} style={{ flexShrink: 0, marginTop: 2, color: "rgba(240,237,232,0.6)" }} />
            <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 13, lineHeight: 1.4, color: "rgba(240,237,232,0.72)", margin: 0 }}>
              {proj.impact}
            </p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, marginTop: 2, borderTop: `1px solid ${C.faint}` }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {proj.technologies.slice(0, 3).map((tech) => (
                <span key={tech} style={{ fontFamily: "monospace", fontSize: 9, padding: "2px 8px", borderRadius: 999, border: "1px solid rgba(240,237,232,0.14)", background: "rgba(240,237,232,0.03)", color: "rgba(240,237,232,0.6)" }}>
                  {tech}
                </span>
              ))}
              {proj.technologies.length > 3 && (
                <span style={{ fontFamily: "monospace", fontSize: 9, padding: "2px 8px", borderRadius: 999, border: "1px solid rgba(240,237,232,0.1)", color: "rgba(240,237,232,0.35)" }}>
                  +{proj.technologies.length - 3}
                </span>
              )}
            </div>

            <div className="group-hover:underline" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,237,232,0.85)", whiteSpace: "nowrap" }}>
              Case Study
              <ArrowUpRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Projectspage export
───────────────────────────────────────────────────────────────────────────── */
export default function Projectspage({ onOpenCaseStudy }) {
  const sliderRef = useRef(null);

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

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = direction === "left" ? -360 : 360;
    sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section
      id="projects"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "transparent",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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

      {/* Vignette */}
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

      {/* Parallax ambient dots */}
      <motion.div style={{ position: "absolute", inset: 0, rotateX, rotateY, x: moveX, y: moveY, transformStyle: "preserve-3d", willChange: "transform", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {GLOW_ORBS.map((dot, i) => (
          <motion.div
            key={`glow-${i}`}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: dot.op }}
            transition={{ delay: dot.delay, duration: 1.2 }}
            style={{
              position: "absolute", top: dot.top, left: dot.left, width: dot.size, height: dot.size, borderRadius: "50%",
              background: "rgba(255,255,255,0.88)", filter: `blur(${dot.blur}px)`,
              boxShadow: `0 0 ${dot.blur * 2}px ${dot.blur}px rgba(255,255,255,0.15), 0 0 ${dot.blur * 4}px ${dot.blur * 2}px rgba(255,255,255,0.06)`,
              zIndex: 5, animation: `dotFloat ${dot.dur} ${dot.animDelay} ease-in-out infinite`, pointerEvents: "none",
            }}
          />
        ))}

      {/* Section Header with navigation arrows */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-row items-end justify-between" style={{ marginBottom: 20 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ textAlign: "left" }}
        >
          <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.dim }}>
            Deliverables
          </span>
          <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 400, fontSize: "clamp(1.8rem, 3.2vw, 2.5rem)", color: "rgba(240,237,232,0.92)", margin: "4px 0 0" }}>
            Featured Projects
          </h2>
          <div style={{ height: 1, width: 80, background: "rgba(240,237,232,0.15)", marginTop: 12 }} />
        </motion.div>

        {/* Carousel arrows */}
        <div className="flex gap-3">
          <button
            onClick={() => scrollSlider("left")}
            className="p-2.5 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
            aria-label="Previous project"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollSlider("right")}
            className="p-2.5 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
            aria-label="Next project"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal smooth slider */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto py-4 scroll-smooth relative z-10"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {PROJECTS_DATA.map((proj, idx) => (
            <ProjectCard
              key={proj.id}
              proj={proj}
              index={idx}
              onOpenCaseStudy={onOpenCaseStudy}
            />
          ))}
        </div>
      </div>
      </motion.div>
    </section>
  );
}
