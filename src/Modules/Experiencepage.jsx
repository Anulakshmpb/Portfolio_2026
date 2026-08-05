import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { Briefcase, Calendar, Award, Cpu, BarChart3, X, ArrowLeft, ArrowRight } from 'lucide-react';

// --- R3F DATA PATHWAYS AND BEAMS ---
const LightBeamConduit = ({ startY, speed, color }) => {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Translate horizontal position representing a packet traveling down a wire
    meshRef.current.position.x = -6 + ((time * speed) % 12);
  });

  return (
    <group position={[0, startY, -2]}>
      {/* Horizontal conduit line */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.006, 0.006, 12, 4]} />
        <meshBasicMaterial color="#312e81" transparent opacity={0.15} />
      </mesh>
      {/* Moving packet light beam */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

const Experience3DBackground = () => {
  const conduits = useMemo(() => [
    { startY: 1.5, speed: 1.8, color: "#a855f7" },
    { startY: 0.5, speed: 2.2, color: "#06b6d4" },
    { startY: -0.8, speed: 1.4, color: "#ec4899" },
    { startY: -1.8, speed: 2.5, color: "#06b6d4" }
  ], []);

  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 60 }} className="w-full h-full">
      <ambientLight intensity={1.0} />
      {conduits.map((conduit, idx) => (
        <LightBeamConduit key={idx} {...conduit} />
      ))}
    </Canvas>
  );
};

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
    <section id="experience" className="relative min-h-screen w-full flex flex-col justify-center py-24 px-6 md:px-12 xl:px-24 bg-[#030014] overflow-hidden border-t border-slate-900">
      
      {/* Moving Light Beams Background (HTML/CSS) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[15%] -left-[10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-sm animate-pulse-slow" />
        <div className="absolute bottom-[25%] -left-[10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent blur-sm animate-pulse-slow" />
      </div>

      {/* R3F Background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <Experience3DBackground />
      </div>

      {/* Section Header */}
      <div className="relative w-full max-w-7xl mx-auto z-10 mb-16 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <span className="text-xs font-bold font-mono tracking-[0.25em] text-cyan-400 uppercase">Operational Log</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none mt-2">
            Engineering <span className="text-gradient-purple-cyan font-extrabold">Milestones</span>
          </h2>
        </div>

        {/* Custom Navigation buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => scrollTimeline('left')}
            className="p-3 rounded-full border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:border-purple-500/30 hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => scrollTimeline('right')}
            className="p-3 rounded-full border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:border-cyan-500/30 hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* HORIZONTAL TIMELINE ROW */}
      <div className="relative w-full max-w-7xl mx-auto z-10 flex items-center">
        {/* Glow Line Connector (Framer motion animated scroll trigger) */}
        <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500/20 via-cyan-500/30 to-purple-500/20 z-0 pointer-events-none" />

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
                  <div className="w-5 h-5 rounded-full border-[3px] border-[#030014] bg-slate-800 group-hover:bg-cyan-400 group-hover:scale-125 shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all duration-300 relative">
                    {/* Glowing pulse ring */}
                    <div className="absolute -inset-1.5 rounded-full border border-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 mt-2 font-bold select-none">{exp.duration.split(' ')[0]}</span>
                </div>

                {/* Glassmorphic Node Card */}
                <div
                  ref={cardRef}
                  onMouseMove={(e) => handleCardMouseMove(e, cardRef.current)}
                  onMouseLeave={() => handleCardMouseLeave(cardRef.current)}
                  style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                  className="w-full rounded-2xl glass-panel p-6 border border-white/5 hover:border-purple-500/40 hover:shadow-[0_15px_35px_rgba(168,85,247,0.15)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div style={{ transform: 'translateZ(20px)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono text-purple-400 tracking-wider font-semibold uppercase">{exp.company}</span>
                      <Briefcase className="w-4 h-4 text-purple-400" />
                    </div>

                    <h3 className="text-xl font-bold text-white tracking-tight mb-2 group-hover:text-cyan-400 transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal mb-6">
                      {exp.tagline}
                    </p>
                  </div>

                  {/* Open details badge */}
                  <div 
                    style={{ transform: 'translateZ(10px)' }}
                    className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase mt-auto group-hover:underline"
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

      {/* POPUP DETAIL MODAL DIALOG (CINEMATIC EXPANSION) */}
      <AnimatePresence>
        {selectedExp && (
          <div className="fixed inset-0 w-full h-full flex items-center justify-center z-50 px-6 backdrop-blur-md">
            
            {/* Modal backdrop dark blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExp(null)}
              className="absolute inset-0 bg-[#020108]/90 cursor-pointer"
            />

            {/* Immersive Glassmorphic Card Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-3xl rounded-3xl bg-[#0b0520]/80 border border-white/10 p-6 md:p-10 shadow-2xl z-10 overflow-hidden flex flex-col md:grid md:grid-cols-12 gap-8 max-h-[85vh] md:max-h-none overflow-y-auto md:overflow-visible"
            >
              {/* Top ambient color dots */}
              <div className="absolute top-[-5%] left-[40%] w-60 h-60 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />
              <div className="absolute bottom-[-5%] right-[20%] w-60 h-60 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />

              {/* Close Button */}
              <button 
                onClick={() => setSelectedExp(null)}
                className="absolute top-4 right-4 p-2 rounded-full border border-white/10 hover:border-purple-500/40 bg-white/5 hover:bg-purple-500/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* LEFT POPUP PANEL: METRICS & CONSOLE */}
              <div className="md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8 space-y-6">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 tracking-[0.2em] font-semibold uppercase">{selectedExp.company}</span>
                  <h3 className="text-2xl font-extrabold text-white tracking-tight mt-1 leading-tight">{selectedExp.role}</h3>
                  
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-4">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>{selectedExp.duration}</span>
                  </div>
                </div>

                {/* Impact Highlight Stats Box */}
                <div className="p-5 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm flex flex-col">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase mb-2">
                    <BarChart3 className="w-3.5 h-3.5" />
                    Operational Impact
                  </div>
                  <p className="text-sm font-bold text-white leading-snug">
                    {selectedExp.impact}
                  </p>
                </div>
              </div>

              {/* RIGHT POPUP PANEL: ACHIEVEMENTS & TECH */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                
                {/* Achievements List */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase border-b border-white/5 pb-2">
                    <Award className="w-3.5 h-3.5" />
                    Key Deliverables
                  </div>
                  
                  <ul className="space-y-3.5">
                    {selectedExp.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies used */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase border-b border-white/5 pb-2">
                    <Cpu className="w-3.5 h-3.5" />
                    Core Platform Machinery
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedExp.technologies.map((tech, idx) => (
                      <span 
                        key={idx} 
                        className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md border border-white/5 bg-white/3 text-slate-300 hover:text-white hover:border-purple-500/20 hover:bg-purple-500/5 transition-all select-none"
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
