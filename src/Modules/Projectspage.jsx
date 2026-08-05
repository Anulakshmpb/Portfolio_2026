import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

// --- R3F BACKGROUND: FLOATING CUBES & GRIDS ---
const FloatingCube = ({ position, size, speed, color }) => {
  const ref = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(time * speed) * 0.25;
    ref.current.rotation.x = time * 0.08;
    ref.current.rotation.y = time * 0.12;
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[size, size, size]} />
      <meshPhysicalMaterial
        color={color}
        transmission={0.9}
        roughness={0.15}
        thickness={0.5}
        transparent
        opacity={0.25}
      />
    </mesh>
  );
};

const AnimatedGrid = () => {
  const ref = useRef();
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.position.z = (time * 0.15) % 2; // move grid lines backward
  });
  return (
    <gridHelper ref={ref} args={[30, 20, "#4f46e5", "#121034"]} position={[0, -1.8, 0]} />
  );
};

const Projects3DBackground = () => {
  const cubes = useMemo(() => [
    { position: [-2.5, 1.2, -1], size: 0.5, speed: 0.5, color: "#06b6d4" },
    { position: [2.8, -0.8, -1.5], size: 0.6, speed: 0.4, color: "#f59e0b" },
    { position: [-2.2, -1.3, -2], size: 0.4, speed: 0.6, color: "#f97316" },
    { position: [2.5, 1.5, -1.2], size: 0.45, speed: 0.45, color: "#a855f7" }
  ], []);

  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 50 }} className="w-full h-full">
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <AnimatedGrid />
      {cubes.map((cube, idx) => (
        <FloatingCube key={idx} {...cube} />
      ))}
    </Canvas>
  );
};

// --- DATA DEFINITION ---
const PROJECTS_DATA = [
  {
    id: "myrailpool",
    title: "MyRailPool",
    role: "Shared Commuting Platform",
    duration: "Production Ready",
    color: "#06b6d4",
    accentClass: "from-cyan-500/10 via-transparent text-cyan-400 border-cyan-500/30 hover:border-cyan-500/60 shadow-cyan-500/5",
    glowColor: "rgba(6,182,212,0.3)",
    impact: "A ride-sharing platform designed for railway commuters",
    technologies: ["React", "Redux Toolkit", "Firebase", "Node.js", "Tailwind CSS", "Stripe", "Google Maps API"],
    caseStudy: {
      challenge: "Railway commuters struggled to coordinate shared rides, leading to empty seats, high travel costs, and complex booking validation.",
      solution: "Engineered a production-ready ride-sharing platform utilizing real-time sync, OTP verification, Google Maps route discovery, and Stripe integrations.",
      architecture: [
        "React UI with client side Redux state management.",
        "Firebase authentication hooks verifying user OTP tokens.",
        "Stripe capturing bookings securely in real-time."
      ]
    },
    dashboardType: "logistics"
  },
  {
    id: "atc-erp",
    title: "ATC Business Management Dashboard",
    role: "Enterprise ERP Platform",
    duration: "Production Ready",
    color: "#f59e0b",
    accentClass: "from-amber-500/10 via-transparent text-amber-400 border-amber-500/30 hover:border-amber-500/60 shadow-amber-500/5",
    glowColor: "rgba(245,158,11,0.3)",
    impact: "Dashboard managing finance, logistics, trading, inventory, investments, and property operations",
    technologies: ["React", "Firebase", "Firestore", "Cloud Functions", "Tailwind CSS", "Material UI", "ExcelJS", "Recharts"],
    caseStudy: {
      challenge: "Operations managers lacked a unified interface to control logistics, investment metrics, trading, and financial closing files.",
      solution: "Implemented a full-featured ERP console integrating real-time Firestore synchronization, dynamic Recharts plots, and secure Excel report triggers.",
      architecture: [
        "Reactive dashboard widgets rendering key metric indicators.",
        "Firestore synchronization capturing inventory updates dynamically.",
        "Cloud Functions automating document processing via ExcelJS."
      ]
    },
    dashboardType: "finance"
  },
  {
    id: "construction-erp",
    title: "Construction ERP",
    role: "Enterprise Construction Management Platform",
    duration: "Production Ready",
    color: "#f97316",
    accentClass: "from-orange-500/10 via-transparent text-orange-400 border-orange-500/30 hover:border-orange-500/60 shadow-orange-500/5",
    glowColor: "rgba(249,115,22,0.3)",
    impact: "Realtime tracking for projects, material inventories, attendance, and Measurement Books",
    technologies: ["React", "Firebase", "Firestore", "Tailwind CSS", "Material UI", "Recharts"],
    caseStudy: {
      challenge: "On-site managers struggled to log daily worker attendance, material consumption, and measurement registers cleanly.",
      solution: "Designed a lightweight, responsive ERP system linking Firestore listeners and dynamic trackers to sync real-time project logs.",
      architecture: [
        "Dynamic form validation pipelines preventing duplicate entry logs.",
        "Real-time Firestore listeners updating materials sheets within 150ms.",
        "Responsive Material UI templates optimized for mobile workers."
      ]
    },
    dashboardType: "construction"
  },
  {
    id: "rivora",
    title: "Rivora",
    role: "Full Stack MERN E-Commerce Platform",
    duration: "Production Ready",
    color: "#a855f7",
    accentClass: "from-purple-500/10 via-transparent text-purple-400 border-purple-500/30 hover:border-purple-500/60 shadow-purple-500/5",
    glowColor: "rgba(168,85,247,0.3)",
    impact: "MERN storefront with Razorpay checkout gateways, OTP validation, and socket logs",
    technologies: ["React", "Node.js", "Express.js", "MongoDB", "JWT", "Socket.io", "Razorpay", "Joi", "Nodemailer"],
    caseStudy: {
      challenge: "Online e-commerce portals require high API security thresholds, secure checkouts, and real-time status updates.",
      solution: "Coded a full-stack MERN storefront with Razorpay checkout gateways, API rate limiting, JWT + OTP controls, and Socket.io logs.",
      architecture: [
        "Express.js middleware filtering requests with Joi and Helmet schemas.",
        "Razorpay SDK handling direct captures and status callbacks.",
        "Socket.io relays broadcasting order notifications instantly."
      ]
    },
    dashboardType: "luxury"
  }
];

// --- MINI LIVE ANIMATED DASHBOARD PREVIEW ---
const MiniDashboardPreview = ({ type, color }) => {
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTicker((prev) => (prev + 1) % 100);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  if (type === "logistics") {
    return (
      <div className="w-full h-full bg-[#050b18] text-white p-3 font-mono text-[9px] flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex justify-between border-b border-cyan-500/20 pb-1 items-center">
          <span className="text-cyan-400 font-bold">RAIL_POOL_TELEMETRY</span>
          <span className="animate-ping w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </div>
        {/* Chart Lines */}
        <div className="flex items-end gap-1.5 h-16 border-b border-cyan-500/15 pb-1 relative justify-center">
          <div className="absolute top-1 left-1 text-[7px] text-cyan-500/50">SPEED CLUSTER (KM/H)</div>
          {[40, 75, 60, 95, 80, 110, 85, 120].map((h, i) => (
            <motion.div 
              key={i} 
              animate={{ height: `${(h + (i === ticker % 8 ? 20 : 0)) * 0.4}px` }}
              className="w-2.5 bg-cyan-500/70 rounded-t"
            />
          ))}
        </div>
        {/* Logs */}
        <div className="space-y-1 pt-1 text-slate-400">
          <div className="flex justify-between">
            <span>TRAIN_4491:</span>
            <span className="text-cyan-400 font-semibold">ON_ROUTE_A</span>
          </div>
          <div className="flex justify-between">
            <span>CAPACITY:</span>
            <span className="text-white">92.4%</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "finance") {
    return (
      <div className="w-full h-full bg-[#0d0a03] text-white p-3 font-mono text-[9px] flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex justify-between border-b border-amber-500/20 pb-1 items-center">
          <span className="text-amber-400 font-bold">LEDGER_CONSOLE</span>
          <span className="text-[7px] text-amber-500/60 font-mono">NODE_982</span>
        </div>
        {/* Statistics Ticker */}
        <div className="py-2 flex items-center justify-between">
          <div>
            <span className="text-slate-500 block text-[7px]">OPERATIONS VALUE</span>
            <span className="text-amber-400 font-black text-xs">${(148920 + ticker * 110).toLocaleString()}</span>
          </div>
          <div className="w-10 h-10 rounded-full border border-amber-500/25 flex items-center justify-center relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0.5 border-t border-amber-500/80 rounded-full"
            />
            <span className="text-[6px] text-slate-300">AUTO</span>
          </div>
        </div>
        {/* Logs Console */}
        <div className="bg-amber-950/20 border border-amber-500/10 p-1.5 rounded space-y-0.5 font-mono text-[7px] text-slate-400">
          <div>&gt; AUTH_MATCH_COMPLETED</div>
          <div className="text-green-400">&gt; COMPILING_REPORT_DONE</div>
        </div>
      </div>
    );
  }

  if (type === "construction") {
    return (
      <div className="w-full h-full bg-[#0b0603] text-white p-3 font-mono text-[9px] flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex justify-between border-b border-orange-500/20 pb-1 items-center">
          <span className="text-orange-400 font-bold">MATERIAL_LOGISTICS</span>
          <span className="bg-orange-500/20 px-1 py-0.2 rounded text-[7px] text-orange-400 font-bold">CAPACITY</span>
        </div>
        {/* Load Indicators */}
        <div className="space-y-2 py-2">
          <div className="space-y-1">
            <div className="flex justify-between text-[7px] text-slate-400">
              <span>SITE_ALPHA_CEMENT:</span>
              <span className="text-orange-400">{78 + (ticker % 10)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 border border-white/5 rounded-full overflow-hidden">
              <motion.div animate={{ width: `${78 + (ticker % 10)}%` }} className="h-full bg-orange-500" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[7px] text-slate-400">
              <span>SITE_BETA_STEEL:</span>
              <span className="text-orange-400">{42 + (ticker % 5)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 border border-white/5 rounded-full overflow-hidden">
              <motion.div animate={{ width: `${42 + (ticker % 5)}%` }} className="h-full bg-orange-500" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#07050e] text-white p-3 font-mono text-[9px] flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="flex justify-between border-b border-purple-500/20 pb-1 items-center">
        <span className="text-purple-400 font-bold">RIVORA_VISUALIZER</span>
        <span className="text-purple-500/70 text-[7px]">ROOMS_CLUSTER</span>
      </div>
      {/* Grid Occupancy Map */}
      <div className="grid grid-cols-4 gap-1 py-2 justify-center">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            className={`w-4 h-4 rounded border flex items-center justify-center text-[7px] font-bold ${
              (i + ticker) % 3 === 0 
                ? 'bg-purple-500/30 border-purple-400/80 text-white shadow-[0_0_5px_rgba(168,85,247,0.3)]' 
                : 'bg-black/40 border-white/5 text-slate-600'
            }`}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <div className="text-[7px] text-slate-400 text-center">OCCUPANCY: 42%</div>
    </div>
  );
};

// --- MAIN PROJECTSPAGE COMPONENT ---
export default function Projectspage({ onOpenCaseStudy }) {

  const handleCardMouseMove = (e, el) => {
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    gsap.to(el, {
      rotateY: x * 12,
      rotateX: -y * 12,
      translateZ: 20,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleCardMouseLeave = (el) => {
    if (!el) return;
    gsap.to(el, {
      rotateY: 0,
      rotateX: 0,
      translateZ: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)"
    });
  };

  return (
    <section id="projects" className="relative min-h-screen w-full flex flex-col justify-center py-24 px-6 md:px-12 xl:px-24 bg-[#030014] overflow-hidden border-t border-slate-900">
      
      {/* 3D background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <Projects3DBackground />
      </div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      {/* Section Header */}
      <div className="relative w-full max-w-7xl mx-auto z-10 mb-20 flex flex-col text-left">
        <span className="text-xs font-bold font-mono tracking-[0.25em] text-purple-400 uppercase">Deliverables Inventory</span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none mt-2">
          Featured <span className="text-gradient-purple-cyan font-extrabold">Projects</span>
        </h2>
      </div>

      {/* APPLE-STYLE SCROLL CARD GRID */}
      <div className="relative w-full max-w-7xl mx-auto z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
        {PROJECTS_DATA.map((proj, idx) => {
          let cardRef = React.createRef();
          return (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: (idx % 2) * 0.2 }}
              onClick={() => onOpenCaseStudy(proj)}
              className="cursor-pointer group relative rounded-3xl"
            >
              {/* Glow Behind */}
              <div 
                className="absolute -inset-1 rounded-[28px] opacity-10 group-hover:opacity-20 blur-2xl transition duration-500 pointer-events-none"
                style={{ backgroundColor: proj.color }}
              />

              {/* Glass Card Container */}
              <div
                ref={cardRef}
                onMouseMove={(e) => handleCardMouseMove(e, cardRef.current)}
                onMouseLeave={() => handleCardMouseLeave(cardRef.current)}
                style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                className={`relative w-full rounded-3xl bg-gradient-to-b ${proj.accentClass} border flex flex-col justify-between p-8 md:p-10 shadow-2xl transition-all duration-300 overflow-hidden min-h-[460px]`}
              >
                {/* Visual Laptop Mockup */}
                <div 
                  className="w-full flex flex-col items-center mb-8" 
                  style={{ transform: 'translateZ(30px)' }}
                >
                  {/* Outer Bevel Frame */}
                  <div className="w-[85%] aspect-[16/10] bg-[#1c1a2c] rounded-t-xl border border-white/10 p-2 shadow-inner relative flex items-center justify-center">
                    {/* Screen panel holding live dashboard */}
                    <div className="w-full h-full bg-black rounded overflow-hidden border border-black relative">
                      <MiniDashboardPreview type={proj.dashboardType} color={proj.color} />
                    </div>
                  </div>
                  {/* Laptop Base Bevel */}
                  <div className="w-[95%] h-2.5 bg-[#2a283e] rounded-b-md shadow-lg border-t border-white/5 relative flex justify-center">
                    {/* Trackpad marker */}
                    <div className="w-[18%] h-1 bg-[#1a182b] rounded-b opacity-45" />
                  </div>
                </div>

                {/* Info and Impact */}
                <div style={{ transform: 'translateZ(20px)' }} className="flex flex-col text-left space-y-3 mt-auto">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                      {proj.title}
                    </h3>
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-semibold">{proj.duration}</span>
                  </div>

                  <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                    {proj.role}
                  </p>

                  <div className="flex gap-2.5 items-start bg-white/3 border border-white/5 p-3 rounded-xl mt-2 select-none">
                    <TrendingUp className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" style={{ color: proj.color }} />
                    <p className="text-xs text-slate-300 leading-normal font-medium">
                      {proj.impact}
                    </p>
                  </div>

                  {/* Technology icons and view metrics */}
                  <div className="flex justify-between items-end pt-4 border-t border-white/5 mt-4">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.slice(0, 3).map((tech, i) => (
                        <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300 font-semibold select-none">
                          {tech}
                        </span>
                      ))}
                      {proj.technologies.length > 3 && (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-500 font-bold select-none">
                          +{proj.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-widest uppercase" style={{ color: proj.color }}>
                      Inspect Case Study
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
