import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { Briefcase, Calendar, Award, Cpu, BarChart3, X, ArrowLeft, ArrowRight } from 'lucide-react';

// --- STARFIELD BACKGROUND (canvas, shared) ---
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

const EXPERIENCES = [
  {
    id: "kenmerk",
    company: "Kenmerk Softwares Pvt. Ltd.",
    role: "Full Stack Engineer",
    duration: "June 2025 – Present",
    tagline: "Developing enterprise ERP platforms and business management systems.",
    achievements: [
      "Developed scalable React dashboards for business operations.",
      "Built secure REST APIs using JWT Authentication and RBAC.",
      "Developed reusable UI components across multiple modules.",
      "Integrated Stripe and Razorpay payment gateways.",
      "Implemented Firebase Cloud Functions and real-time Firestore synchronization.",
      "Worked closely with stakeholders throughout the complete SDLC.",
      "Improved maintainability through reusable component architecture."
    ],
    technologies: ["React.js", "Node.js", "Firebase", "Firestore", "Stripe", "Razorpay", "JWT"],
    impact: "Designed and built operational dashboards and sync pipelines with 100% data fidelity."
  },
  {
    id: "mentorbro-engineer",
    company: "MentorBro Learning LLP",
    role: "Full Stack Engineer",
    duration: "Sept 2025 – Present",
    tagline: "Developing full-stack MERN applications with responsive interfaces.",
    achievements: [
      "Developed reusable React components.",
      "Built scalable REST APIs.",
      "Integrated third-party APIs.",
      "Participated in Agile development.",
      "Improved frontend-backend workflows."
    ],
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "Agile"],
    impact: "Optimized frontend component reusability and structured secure endpoint integrations."
  },
  {
    id: "mentorbro-intern",
    company: "MentorBro",
    role: "Full Stack Developer Intern",
    duration: "April 2025 – June 2025",
    tagline: "MERN application development and production workflows.",
    achievements: [
      "Developed MERN applications.",
      "Built REST APIs.",
      "Implemented JWT Authentication.",
      "Worked on frontend-backend integration.",
      "Participated in code reviews.",
      "Learned production engineering workflows."
    ],
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Git"],
    impact: "Built solid fundamentals in backend route handling, authentication, and team Git workflows."
  }
];

// --- EXPERIENCE MODULE ---
export default function Experiencepage() {
  const [selectedExp, setSelectedExp] = useState(null);
  const timelineRef = useRef(null);

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

  const handleSectionMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    rawX.set(nx * 8);
    rawY.set(-ny * 6);
    rawDotX.set(-nx * 35);
    rawDotY.set(-ny * 30);
  }, [rawX, rawY, rawDotX, rawDotY]);

  const handleSectionMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    rawDotX.set(0);
    rawDotY.set(0);
  }, [rawX, rawY, rawDotX, rawDotY]);

  const scrollTimeline = (direction) => {
    if (!timelineRef.current) return;
    const scrollAmount = direction === 'left' ? -350 : 350;
    timelineRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleCardMouseMove = (e, cardEl) => {
    if (!cardEl) return;
    const { left, top, width, height } = cardEl.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    gsap.to(cardEl, {
      rotateY: x * 10,
      rotateX: -y * 10,
      translateZ: 15,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleCardMouseLeave = (cardEl) => {
    if (!cardEl) return;
    gsap.to(cardEl, {
      rotateY: 0,
      rotateX: 0,
      translateZ: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)"
    });
  };

  return (
    <section
      id="experience"
      onMouseMove={handleSectionMouseMove}
      onMouseLeave={handleSectionMouseLeave}
      className="relative min-h-screen w-full flex flex-col justify-center py-24 px-6 md:px-12 xl:px-24 bg-black overflow-hidden"
      style={{ perspective: "1100px", perspectiveOrigin: "50% 50%" }}
    >
      <style>{`
        @keyframes dotFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>

      {/* Shared starfield canvas */}
      <Starfield />

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

      {/* 3D tilt & translation wrapper for glow/dot layers and section content */}
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
          flexDirection: "column",
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

        {/* Section Header */}
        <div className="relative w-full max-w-7xl mx-auto z-10 mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 px-4">
          <div>
            <span className="text-xs font-bold font-mono tracking-[0.25em] text-white/50 uppercase">Operational Log</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none mt-2">
              Experience
            </h2>
          </div>

          {/* Custom Navigation buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => scrollTimeline('left')}
              className="p-3 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollTimeline('right')}
              className="p-3 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* HORIZONTAL TIMELINE ROW */}
        <div className="relative w-full max-w-7xl mx-auto z-10 flex items-center">
          {/* Glow Line Connector */}
          <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-white/5 via-white/20 to-white/5 z-0 pointer-events-none" />

          {/* Timeline Horizontal Wrapper */}
          <div
            ref={timelineRef}
            className="w-full flex gap-12 overflow-x-auto py-12 px-4 scrollbar-none scroll-smooth relative z-10"
            style={{ scrollbarWidth: 'none' }}
          >
            {EXPERIENCES.map((exp, index) => {
              let cardRef = React.createRef();
              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="flex-shrink-0 w-[290px] sm:w-[360px] relative group cursor-pointer"
                  onClick={() => setSelectedExp(exp)}
                >
                  {/* Connecting Node Point */}
                  <div className="absolute top-[-26px] left-[50%] transform -translate-x-[50%] z-20 flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full border-[3px] border-black bg-white/10 group-hover:bg-white/80 group-hover:scale-125 shadow-[0_0_10px_rgba(255,255,255,0.25)] transition-all duration-300 relative">
                      <div className="absolute -inset-1.5 rounded-full border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping" />
                    </div>
                    <span className="text-[10px] font-mono text-white/60 mt-2 font-bold select-none">{exp.duration.split(' ')[0]}</span>
                  </div>

                  {/* Card */}
                  <div
                    ref={cardRef}
                    onMouseMove={(e) => handleCardMouseMove(e, cardRef.current)}
                    onMouseLeave={() => handleCardMouseLeave(cardRef.current)}
                    style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                    className="w-full rounded-2xl bg-white/[0.03] backdrop-blur-md p-6 border border-white/10 hover:border-white/30 hover:shadow-[0_15px_35px_rgba(255,255,255,0.06)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
                  >
                    <div style={{ transform: 'translateZ(20px)' }}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono text-white/50 tracking-wider font-semibold uppercase">{exp.company}</span>
                        <Briefcase className="w-4 h-4 text-white/50" />
                      </div>

                      <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-white/80 transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-normal mb-6">
                        {exp.tagline}
                      </p>
                    </div>

                    <div
                      style={{ transform: 'translateZ(10px)' }}
                      className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-white/60 uppercase mt-auto group-hover:underline"
                    >
                      Load Operations Log
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* POPUP DETAIL MODAL DIALOG */}
      <AnimatePresence>
        {selectedExp && (
          <div className="fixed inset-0 w-full h-full flex items-center justify-center z-50 px-6 backdrop-blur-md">

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExp(null)}
              className="absolute inset-0 bg-black/90 cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-3xl rounded-3xl bg-[#080808]/90 border border-white/10 p-6 md:p-10 shadow-2xl z-10 overflow-hidden flex flex-col md:grid md:grid-cols-12 gap-8 max-h-[85vh] md:max-h-none overflow-y-auto md:overflow-visible"
            >
              <div className="absolute top-[-5%] left-[40%] w-60 h-60 rounded-full bg-white/5 blur-[80px] pointer-events-none" />
              <div className="absolute bottom-[-5%] right-[20%] w-60 h-60 rounded-full bg-white/5 blur-[80px] pointer-events-none" />

              <button
                onClick={() => setSelectedExp(null)}
                className="absolute top-4 right-4 p-2 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* LEFT PANEL */}
              <div className="md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8 space-y-6">
                <div>
                  <span className="text-[10px] font-mono text-white/50 tracking-[0.2em] font-semibold uppercase">{selectedExp.company}</span>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight mt-1 leading-tight">{selectedExp.role}</h3>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-4">
                    <Calendar className="w-4 h-4 text-white/50" />
                    <span>{selectedExp.duration}</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm flex flex-col">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase mb-2">
                    <BarChart3 className="w-3.5 h-3.5" />
                    Operational Impact
                  </div>
                  <p className="text-sm font-bold text-white leading-snug">
                    {selectedExp.impact}
                  </p>
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-6">

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase border-b border-white/10 pb-2">
                    <Award className="w-3.5 h-3.5" />
                    Key Deliverables
                  </div>

                  <ul className="space-y-3.5">
                    {selectedExp.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-white/50 uppercase border-b border-white/10 pb-2">
                    <Cpu className="w-3.5 h-3.5" />
                    Core Platform Machinery
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedExp.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all select-none"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}