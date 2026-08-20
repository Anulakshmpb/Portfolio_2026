import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Database, Network, ShieldAlert, Award, 
  Rocket, HelpCircle as InfoCircle, 
  Workflow, Zap, BookOpen, Layers
} from 'lucide-react';

// --- INTERACTIVE DATABASE SCHEMA DIAGRAM ---
const DatabaseDiagram = ({ color }) => {
  const [activeTable, setActiveTable] = useState('trains');
  
  const tables = {
    trains: {
      name: "Freight_Collections",
      fields: ["_id (UUID)", "train_number (Index)", "load_capacity (Float)", "status (String)", "route_id (Relation)"]
    },
    routes: {
      name: "Routes_Metadata",
      fields: ["_id (UUID)", "origin_station (String)", "dest_station (String)", "ETA (Timestamp)", "distance_km (Int)"]
    },
    allocations: {
      name: "Fleet_Allocations",
      fields: ["_id (UUID)", "train_id (Relation)", "driver_id (UUID)", "assigned_at (Timestamp)", "urgency (Enum)"]
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/5 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      {/* Table Selector */}
      <div className="md:col-span-5 flex flex-col gap-3">
        <h4 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mb-2">Collections / Tables</h4>
        {Object.keys(tables).map((key) => (
          <button
            key={key}
            onClick={() => setActiveTable(key)}
            className={`w-full p-4 rounded-xl border font-mono text-xs text-left transition-all cursor-pointer ${
              activeTable === key 
                ? 'bg-white/10 text-white font-bold' 
                : 'bg-white/2 text-slate-400 border-white/5 hover:border-white/20'
            }`}
            style={{ borderColor: activeTable === key ? color : 'rgba(255,255,255,0.05)' }}
          >
            {tables[key].name}
          </button>
        ))}
      </div>

      {/* Fields Inspector */}
      <div className="md:col-span-7 p-6 rounded-2xl bg-black/40 border border-white/5 min-h-[160px] flex flex-col justify-between font-mono text-xs relative">
        <div className="absolute top-2 right-2 text-[8px] text-slate-600 uppercase">Schema Telemetry</div>
        <div className="space-y-2">
          <div className="text-slate-400 border-b border-white/5 pb-2 uppercase tracking-widest text-[9px] font-bold">
            Structure for: <span style={{ color }}>{tables[activeTable].name}</span>
          </div>
          <ul className="space-y-1.5 pt-1">
            {tables[activeTable].fields.map((field, idx) => (
              <motion.li 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="flex items-center gap-2 text-slate-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{field}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- INTERACTIVE API FLOW PIPELINE ANIMATION ---
const ApiFlowDiagram = ({ color }) => {
  const [step, setStep] = useState(0);

  const steps = [
    { label: "1. Client Request", desc: "User triggers dispatch allocation in high-fidelity React UI, dispatching post payload." },
    { label: "2. Gateway API Router", desc: "API entry parses payloads and routes them to operational microservice endpoints." },
    { label: "3. Auth Middleware", desc: "Inspects auth headers, validates JWT encryption token structure." },
    { label: "4. Database Logic", desc: "Controller resolves transaction queries and posts freight allocations to MongoDB." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">Request Lifecycle Stream</h4>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className="w-2.5 h-2.5 rounded-full transition-all duration-300"
              style={{ backgroundColor: step === i ? color : 'rgba(255,255,255,0.1)' }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
        {steps.map((s, idx) => (
          <div 
            key={idx}
            onClick={() => setStep(idx)}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              step === idx 
                ? 'bg-white/5 border-slate-700 text-white' 
                : 'bg-white/2 border-white/5 text-slate-500 hover:border-white/10'
            }`}
            style={{ borderColor: step === idx ? color : 'rgba(255,255,255,0.05)' }}
          >
            <div className="text-xs font-bold font-mono uppercase tracking-wider">{s.label}</div>
            <p className="text-[10px] leading-relaxed mt-4 font-normal select-none">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- AUTHENTICATION HANDSHAKE DIAGRAM ---
const AuthHandshakeDiagram = () => {
  const [stage, setStage] = useState(0);

  const stages = [
    { title: "JWT Decryption", text: "Token payload signature check. Verifying SHA256 matches header." },
    { title: "Claims Assessment", text: "Verifying permissions. Checking expiry and scopes constraints." },
    { title: "Granted Access", text: "Access context loaded. Dispatch token approved for backend queries." }
  ];

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-6 flex flex-col md:flex-row md:items-center justify-between gap-8">
      <div className="md:w-1/2 space-y-4">
        <h4 className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">Gateway Token Handshake</h4>
        <div className="space-y-3">
          {stages.map((st, idx) => (
            <div 
              key={idx}
              onClick={() => setStage(idx)}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-4 ${
                stage === idx 
                  ? 'bg-purple-950/15 border-purple-500/40 text-white' 
                  : 'bg-white/2 border-white/5 text-slate-500'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                stage === idx ? 'bg-purple-500 text-white shadow-[0_0_8px_rgba(168,85,247,0.4)]' : 'bg-slate-800 text-slate-400'
              }`}>
                {idx + 1}
              </div>
              <div>
                <div className="text-xs font-bold font-mono uppercase">{st.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulator view */}
      <div className="md:w-1/2 p-6 rounded-2xl bg-black/40 border border-white/5 min-h-[160px] flex flex-col justify-between font-mono text-[11px] text-slate-300">
        <div className="flex justify-between border-b border-white/5 pb-2 text-[9px] uppercase tracking-widest text-slate-500">
          <span>Security Stream</span>
          <span className="text-purple-400 font-bold">STATE: VERIFYING</span>
        </div>
        <div className="py-4 space-y-1 leading-relaxed">
          <div>&gt; Inspecting header authorization...</div>
          <div className="text-cyan-400">&gt; Executing verification protocol: {stages[stage].title}</div>
          <p className="text-slate-400 text-[10px] mt-2 leading-relaxed">
            {stages[stage].text}
          </p>
        </div>
        <div className="text-green-400 text-[9px] border-t border-white/5 pt-2 uppercase tracking-widest font-bold">
          STATUS: VERIFIED_TOKEN_PROCEED
        </div>
      </div>
    </div>
  );
};

// --- DEDICATED CASE STUDY MAIN PAGE ---
export default function CaseStudyPage({ project, onClose }) {

  // Handle smooth scrolls
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    // Scroll to top automatically when mounted
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-slate-100 font-sans overflow-x-hidden">
      
      {/* Ambient backgrounds */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full blur-[150px] opacity-15"
          style={{ backgroundColor: project.color }}
        />
        <div 
          className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full blur-[140px] opacity-10"
          style={{ backgroundColor: project.color }}
        />
      </div>

      {/* STICKY GLASS SUB-NAVBAR */}
      <header className="sticky top-0 w-full z-40 glass-panel border-b border-white/5 select-none">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-slate-400 hover:text-white uppercase transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Dashboard
          </button>
          
          <div className="hidden md:flex gap-6 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">
            {["Overview", "Systems", "Security", "Execution", "Delivery"].map((sec) => (
              <button 
                key={sec} 
                onClick={() => scrollToSection(sec.toLowerCase())}
                className="hover:text-white transition-all cursor-pointer relative py-1 hover:border-b"
                style={{ hoverBorderColor: project.color }}
              >
                {sec}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: project.color }} />
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-300 uppercase">{project.title} Case Study</span>
          </div>
        </div>
      </header>

      {/* DEDICATED LAUNCH CONTAINER */}
      <main className="relative max-w-5xl mx-auto px-6 py-16 space-y-24 z-10">

        {/* 1. HERO SECTION */}
        <section id="overview" className="min-h-[70vh] flex flex-col justify-center text-left space-y-8 pt-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/2 text-[10px] font-mono font-semibold text-slate-400 select-none">
              <Rocket className="w-3.5 h-3.5" style={{ color: project.color }} />
              Live Project Launch
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.05]">
              Coded Case Study: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r font-black" style={{ backgroundImage: `linear-gradient(90deg, #ffffff 10%, ${project.color} 80%)` }}>
                {project.title}
              </span>
            </h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-b border-white/5 py-8">
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Role Assignment</span>
              <span className="text-base font-bold text-white mt-1 block">{project.role}</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Operational Impact</span>
              <span className="text-base font-bold text-white mt-1 block" style={{ color: project.color }}>{project.caseStudy.architecture[0].split(' ')[0]} Improved</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Engineering Timeline</span>
              <span className="text-base font-bold text-white mt-1 block">{project.duration}</span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Platform Stack</span>
              <span className="text-base font-bold text-white mt-1 block">React / Node.js</span>
            </div>
          </div>
        </section>

        {/* 2. PROBLEM & RESEARCH */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-left">
          <div className="space-y-4">
            <span className="text-xs font-bold font-mono tracking-[0.25em] text-purple-400 uppercase">Operational Bottleneck</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight leading-snug">The Challenge</h3>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
              {project.caseStudy.challenge}
            </p>
          </div>

          <div className="space-y-4 p-6 rounded-3xl border border-white/5 bg-white/2 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-2">
              <InfoCircle className="w-4 h-4 text-cyan-400" />
              Research & Metrics Log
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Internal research and testing profiling logs highlighted severe rendering lags during telemetry processing. Thread blocks on the main JavaScript layer occurred when drawing tracks, resulting in browser pauses exceeding 800ms.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block">Main-Thread block</span>
                <span className="text-lg font-bold text-red-400">&gt; 800ms</span>
              </div>
              <div>
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block">DOM Node overload</span>
                <span className="text-lg font-bold text-red-400">2,000+ Active</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ARCHITECTURE & TECH STACK */}
        <section id="systems" className="space-y-8 text-left">
          <div>
            <span className="text-xs font-bold font-mono tracking-[0.25em] text-cyan-400 uppercase">Systems Layout</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight leading-snug mt-2">Architecture Blueprint</h3>
          </div>

          {/* 3D Floating Architecture Cards stack */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-white/2 to-transparent backdrop-blur-sm relative group hover:border-purple-500/20 transition-all duration-300">
              <div className="absolute top-2 right-2 text-[8px] text-slate-600 uppercase font-mono">Layer 01</div>
              <Layers className="w-6 h-6 text-purple-400 mb-4" />
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Client Presentation</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                React rendering nodes, virtualized grid charts, state machinery managing coordinates and layout bindings.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-white/2 to-transparent backdrop-blur-sm relative group hover:border-cyan-500/20 transition-all duration-300">
              <div className="absolute top-2 right-2 text-[8px] text-slate-600 uppercase font-mono">Layer 02</div>
              <Network className="w-6 h-6 text-cyan-400 mb-4" />
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Gateway & Auth</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Micro-routers parsing requests, verifying JWT tokens, checking security permissions, and load-balancing service payloads.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-white/2 to-transparent backdrop-blur-sm relative group hover:border-pink-500/20 transition-all duration-300">
              <div className="absolute top-2 right-2 text-[8px] text-slate-600 uppercase font-mono">Layer 03</div>
              <Database className="w-6 h-6 text-pink-400 mb-4" />
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Database Core</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Optimized SQL indexes, MongoDB collections, caching maps executing data calls in sub-50ms times.
              </p>
            </div>
          </div>

          {/* Tech stack badging */}
          <div className="p-5 rounded-2xl border border-white/5 bg-white/2 text-slate-300 font-mono text-xs flex flex-wrap gap-2.5 items-center select-none">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mr-2">Cluster Tools:</span>
            {project.technologies.map((tech, idx) => (
              <span key={idx} className="bg-white/5 px-2.5 py-1 rounded-md border border-white/5 text-slate-200">
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* 4. DATABASE DESIGN */}
        <section className="space-y-8 text-left">
          <div>
            <span className="text-xs font-bold font-mono tracking-[0.25em] text-purple-400 uppercase">Schema Layout</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight leading-snug mt-2">Database design</h3>
          </div>
          <DatabaseDiagram color={project.color} />
        </section>

        {/* 5. API FLOW */}
        <section className="space-y-8 text-left">
          <div>
            <span className="text-xs font-bold font-mono tracking-[0.25em] text-cyan-400 uppercase">Network Lifeline</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight leading-snug mt-2">API Flow Pipeline</h3>
          </div>
          <ApiFlowDiagram color={project.color} />
        </section>

        {/* 6. AUTHENTICATION */}
        <section id="security" className="space-y-8 text-left">
          <div>
            <span className="text-xs font-bold font-mono tracking-[0.25em] text-purple-400 uppercase">Access Guard</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight leading-snug mt-2">Security & Authentication</h3>
          </div>
          <AuthHandshakeDiagram />
        </section>

        {/* 7. CHALLENGES & SOLUTION */}
        <section id="execution" className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div className="space-y-4 p-6 rounded-3xl border border-red-500/10 bg-red-950/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
            <span className="text-xs font-bold font-mono tracking-widest text-red-400 uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Critical Blocker Log
            </span>
            <h4 className="text-lg font-bold text-white font-mono uppercase">Memory Leaks under Telemetry Load</h4>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
              High-frequency updates to stations logs periodically triggered memory leaks in the browser, degrading performance until crash states. Garbage collector routines struggled with virtual DOM re-renders.
            </p>
          </div>

          <div className="space-y-4 p-6 rounded-3xl border border-green-500/10 bg-green-950/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
            <span className="text-xs font-bold font-mono tracking-widest text-green-400 uppercase flex items-center gap-1.5">
              <Workflow className="w-4 h-4 text-green-400" />
              Resolution architecture
            </span>
            <h4 className="text-lg font-bold text-white font-mono uppercase">Memoized Node Caching Engine</h4>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal">
              Implemented static state matrices caching node properties, recalculating layouts only when coordinates changed. Used web hooks to dispatch telemetry outside component render boundaries.
            </p>
          </div>
        </section>

        {/* 8. SOLUTION & IMPACT */}
        <section className="space-y-8 text-left">
          <div>
            <span className="text-xs font-bold font-mono tracking-[0.25em] text-cyan-400 uppercase">Performance Metrics</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight leading-snug mt-2">Deliverables Impact</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="p-6 rounded-2xl bg-white/2 border border-white/5 text-slate-300 space-y-4">
              <p className="text-sm leading-relaxed font-normal">
                {project.caseStudy.solution}
              </p>
              <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mt-4 select-none">
                <Award className="w-4 h-4 text-cyan-400" />
                DETERMINISTIC_DEPLOY_SUCCESS
              </div>
            </div>
            {/* Impact Metric Banner */}
            <div className="p-8 rounded-2xl border border-white/5 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 text-center flex flex-col justify-center items-center h-full">
              <span className="text-5xl font-black text-white leading-none tracking-tight block">
                {project.impact.split(' ')[0]}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-3 block">
                {project.impact.substring(project.impact.indexOf(' ') + 1)}
              </span>
            </div>
          </div>
        </section>

        {/* 9. LESSONS LEARNED / DEPLOYMENT / FUTURE */}
        <section id="delivery" className="space-y-8 text-left">
          <div>
            <span className="text-xs font-bold font-mono tracking-[0.25em] text-purple-400 uppercase">Operational Wrap</span>
            <h3 className="text-3xl font-extrabold text-white tracking-tight leading-snug mt-2">Delivery & Continuous Improvement</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase">
                <BookOpen className="w-4.5 h-4.5 text-purple-400" />
                Lessons Learned
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Thread separation is essential when building real-time dashboard systems. Outsourcing coordinate math to Web Workers is required to maintain a fluid main thread.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                <Rocket className="w-4.5 h-4.5 text-cyan-400" />
                Deployment Pipeline
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Multi-stage Docker builds compiled images efficiently. Static presentation files served from AWS S3 CDN edge servers reduced page paint latency down to sub-150ms.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-pink-400 uppercase">
                <Zap className="w-4.5 h-4.5 text-pink-400" />
                Future Roadmap
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Integrating predictive analytics networks to forecast fleet dispatch queues. Migration plans to migrate from standard Canvas structures to customized WebGL layouts.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Sub-Footer exit button */}
      <footer className="w-full border-t border-slate-900/80 py-12 text-center relative z-10">
        <button 
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-white/5 hover:bg-white/10 text-xs font-mono font-bold tracking-widest text-slate-300 hover:text-white uppercase transition-all cursor-pointer"
        >
          Exit Case Study Console
        </button>
      </footer>

    </div>
  );
}
