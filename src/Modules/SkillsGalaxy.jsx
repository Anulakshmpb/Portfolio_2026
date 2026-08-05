import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Sparkles, Globe, Cpu, X, Orbit } from 'lucide-react';

// --- DATA DEFINITION ---
const SKILLS_DATA = [
  {
    name: "React",
    radius: 1.6,
    speed: 0.45,
    color: "#06b6d4",
    orbitOffset: 0,
    relates: ["Redux", "Tailwind", "TypeScript"],
    experience: "3+ Years",
    projects: "15+ Applications Built",
    description: "Specializing in visual editor architectures, complex reactive state hooks, custom hook abstractions, dynamic DOM manipulation, and R3F integration."
  },
  {
    name: "Redux",
    radius: 2.1,
    speed: 0.38,
    color: "#7c3aed",
    orbitOffset: 1.2,
    relates: ["React"],
    experience: "3+ Years",
    projects: "8+ Mid-to-Large scale products",
    description: "Designing unified state abstractions, slices, customized middleware, and RTK Query caching configurations for high-throughput enterprise panels."
  },
  {
    name: "Tailwind",
    radius: 1.85,
    speed: 0.42,
    color: "#38bdf8",
    orbitOffset: 2.5,
    relates: ["React"],
    experience: "4+ Years",
    projects: "25+ Visual interfaces deployed",
    description: "Writing layout structures using custom theme extensions, utility classes, and optimized responsive frameworks. Zero-CSS-overhead architectures."
  },
  {
    name: "TypeScript",
    radius: 2.5,
    speed: 0.32,
    color: "#2563eb",
    orbitOffset: 0.8,
    relates: ["React", "Node.js"],
    experience: "3+ Years",
    projects: "12+ Large production codebases",
    description: "Strict compile-time type safety enforcement, generic interfaces, advanced utility mapper types, and unified typings across full-stack applications."
  },
  {
    name: "Node.js",
    radius: 2.0,
    speed: 0.4,
    color: "#22c55e",
    orbitOffset: 3.4,
    relates: ["Express", "MongoDB", "Firebase", "TypeScript"],
    experience: "2+ Years",
    projects: "10+ Backend services launched",
    description: "Architecting modular server instances, background task queues, file processing systems, and secure API architectures."
  },
  {
    name: "Express",
    radius: 2.4,
    speed: 0.36,
    color: "#64748b",
    orbitOffset: 4.2,
    relates: ["Node.js"],
    experience: "2+ Years",
    projects: "10+ Microservices deployed",
    description: "Building light-weight REST routes, middleware pipelines, error handlers, and cors/security integrations."
  },
  {
    name: "MongoDB",
    radius: 3.1,
    speed: 0.28,
    color: "#10b981",
    orbitOffset: 1.8,
    relates: ["Node.js"],
    experience: "2+ Years",
    projects: "6+ Production Databases",
    description: "Database modeling, complex aggregation pipelines, performance indexing, scaling data pipelines, and backup configurations."
  },
  {
    name: "Firebase",
    radius: 2.7,
    speed: 0.3,
    color: "#f59e0b",
    orbitOffset: 5.1,
    relates: ["Node.js"],
    experience: "2+ Years",
    projects: "8+ Serverless/Web platforms",
    description: "Real-time sync architectures, Firebase auth structures, firestore listeners, and secure storage rules."
  },
  {
    name: "Docker",
    radius: 3.5,
    speed: 0.22,
    color: "#0284c7",
    orbitOffset: 2.1,
    relates: ["Node.js"],
    experience: "1+ Year",
    projects: "5+ Containerized service networks",
    description: "Writing multi-stage Dockerfiles, optimizing image size, orchestrating container grids using docker-compose."
  },
  {
    name: "Stripe",
    radius: 2.9,
    speed: 0.29,
    color: "#6366f1",
    orbitOffset: 0.3,
    relates: ["Razorpay"],
    experience: "2+ Years",
    projects: "4+ Subscriptions platforms",
    description: "Custom checkouts, subscription billing lifecycle webhooks processing, payment intent logs, and multi-currency operations."
  },
  {
    name: "Razorpay",
    radius: 3.3,
    speed: 0.24,
    color: "#0984e3",
    orbitOffset: 1.5,
    relates: ["Stripe"],
    experience: "1+ Year",
    projects: "3+ Transaction portals",
    description: "Domestic payment portal setup, UPI routing, order status verification callbacks, and merchant dashboard analytics."
  }
];

// --- INDIVIDUAL SKILL PLANET COMPONENT ---
const SkillPlanet = ({ skill, activeSkill, setActiveSkill, setHoveredSkill, planetRefs }) => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Orbit calculations
    const angle = time * skill.speed + skill.orbitOffset;
    
    // Position updates
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle) * skill.radius;
      groupRef.current.position.z = Math.sin(angle) * skill.radius;
      groupRef.current.position.y = Math.sin(time * 1.2 + skill.orbitOffset) * 0.15; // float amplitude
      groupRef.current.rotation.y = time * 0.2;
    }
  });

  // Store reference to this group's mesh position for drawing lines
  useEffect(() => {
    if (groupRef.current) {
      planetRefs.current[skill.name] = groupRef.current;
    }
  }, [skill.name, planetRefs]);

  const scale = hovered ? 1.4 : 1.0;

  return (
    <group ref={groupRef}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          setHoveredSkill(skill.name);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          setHoveredSkill(null);
          document.body.style.cursor = 'default';
        }}
        onClick={(e) => {
          e.stopPropagation();
          setActiveSkill(skill);
        }}
        scale={[scale, scale, scale]}
      >
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshPhysicalMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={hovered ? 1.6 : 0.3}
          roughness={0.08}
          transmission={0.65}
          thickness={0.6}
          ior={1.4}
        />
      </mesh>

      {/* HTML Tag */}
      <Html distanceFactor={5.5} position={[0, 0.28, 0]} center>
        <div className={`px-2 py-0.5 rounded-md text-[9px] font-mono select-none font-bold uppercase transition-all duration-300 border ${
          hovered 
            ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.7)] scale-110' 
            : 'bg-[#030014]/80 text-slate-300 border-white/10 backdrop-blur-sm'
        }`}>
          {skill.name}
        </div>
      </Html>
    </group>
  );
};

// --- DYNAMIC CONNECTION LINES ---
const ConnectionLines = ({ skills, planetRefs }) => {
  const lineSegmentsRef = useRef();

  // Find unique connection pairs
  const pairs = useMemo(() => {
    const list = [];
    skills.forEach((s) => {
      s.relates.forEach((relName) => {
        // Prevent duplicate lines (e.g. A->B and B->A)
        if (s.name < relName) {
          list.push({ from: s.name, to: relName });
        }
      });
    });
    return list;
  }, [skills]);

  useFrame(() => {
    if (!lineSegmentsRef.current) return;
    
    const positions = [];
    pairs.forEach((pair) => {
      const fromObj = planetRefs.current[pair.from];
      const toObj = planetRefs.current[pair.to];
      if (fromObj && toObj) {
        positions.push(fromObj.position.x, fromObj.position.y, fromObj.position.z);
        positions.push(toObj.position.x, toObj.position.y, toObj.position.z);
      }
    });

    if (positions.length > 0) {
      lineSegmentsRef.current.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      );
      lineSegmentsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={lineSegmentsRef}>
      <bufferGeometry />
      <lineBasicMaterial color="#a855f7" transparent opacity={0.2} />
    </lineSegments>
  );
};

// --- GALAXY CORE ---
const GalaxyCore = () => {
  const coreRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    coreRef.current.rotation.y = time * 0.15;
    coreRef.current.scale.setScalar(0.95 + Math.sin(time * 2.0) * 0.05);
  });

  return (
    <mesh ref={coreRef}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial
        color="#a855f7"
        emissive="#06b6d4"
        emissiveIntensity={2.5}
      />
    </mesh>
  );
};

// --- GALAXY ENVIRONMENT ---
const GalaxyOrbitPaths = ({ skills }) => {
  return (
    <>
      {skills.map((skill, idx) => (
        <mesh key={idx} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[skill.radius - 0.005, skill.radius + 0.005, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.03} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
};

// --- MAIN PORTFOLIO SKILLS PAGE ---
export default function SkillsGalaxy() {
  const [activeSkill, setActiveSkill] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const planetRefs = useRef({});

  return (
    <section id="skills" className="relative min-h-screen w-full flex flex-col justify-center py-24 px-6 md:px-12 xl:px-24 bg-[#030014] overflow-hidden border-t border-slate-900">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[25%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-purple-900/10 blur-[130px] animate-float-slow" />
        <div className="absolute bottom-[25%] right-[20%] w-[35vw] h-[35vw] rounded-full bg-cyan-900/10 blur-[130px] animate-float-reverse" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT COLUMN: GALAXY INFO LOGS */}
        <div className="lg:col-span-4 flex flex-col text-left space-y-6">
          <div>
            <span className="text-xs font-bold font-mono tracking-[0.25em] text-purple-400 uppercase">Expertise Cluster</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none mt-2">
              Skills <span className="text-gradient-purple-cyan font-extrabold">Galaxy</span>
            </h2>
            <p className="text-sm text-slate-400 mt-4 leading-relaxed max-w-md font-normal">
              An interactive 3D solar system modeling my technical dependencies. Drag to rotate the viewport, hover over nodes to spotlight tools, and click any planet to retrieve complete telemetry specs.
            </p>
          </div>

          {/* Current selected status console */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
              <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              Cluster Telemetry
            </div>
            
            <div className="text-xs font-mono text-slate-300 space-y-2 pt-1">
              <div className="flex justify-between">
                <span>SYSTEM STATUS:</span>
                <span className="text-green-400 font-bold">OPERATIONAL</span>
              </div>
              <div className="flex justify-between">
                <span>ACTIVE NODES:</span>
                <span className="text-slate-100">{SKILLS_DATA.length} Online</span>
              </div>
              <div className="flex justify-between">
                <span>FOCUS CLUSTER:</span>
                <span className="text-purple-400 uppercase font-semibold">
                  {hoveredSkill ? hoveredSkill : activeSkill ? activeSkill.name : "AWAITING_INPUT"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: R3F INTERACTIVE 3D GALAXY */}
        <div className="lg:col-span-8 h-[400px] md:h-[550px] xl:h-[650px] w-full relative flex items-center justify-center">
          
          {/* Subtle reflection floor below */}
          <div className="absolute bottom-6 w-[80%] h-[30px] rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-xl pointer-events-none" />

          {/* R3F Canvas Container */}
          <div className="w-full h-full cursor-grab active:cursor-grabbing relative z-10">
            <Canvas
              camera={{ position: [0, 2.5, 4.8], fov: 50 }}
              gl={{ antialias: true }}
            >
              <ambientLight intensity={1.2} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />
              
              {/* Controls */}
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                maxPolarAngle={Math.PI / 2.2} 
                minPolarAngle={Math.PI / 6}
              />

              {/* Glowing Core */}
              <GalaxyCore />

              {/* Orbit Lines */}
              <GalaxyOrbitPaths skills={SKILLS_DATA} />

              {/* Planet Nodes */}
              {SKILLS_DATA.map((skill, idx) => (
                <SkillPlanet
                  key={idx}
                  skill={skill}
                  activeSkill={activeSkill}
                  setActiveSkill={setActiveSkill}
                  setHoveredSkill={setHoveredSkill}
                  planetRefs={planetRefs}
                />
              ))}

              {/* Connected Lines segments */}
              <ConnectionLines skills={SKILLS_DATA} planetRefs={planetRefs} />
            </Canvas>
          </div>
        </div>
      </div>

      {/* Categorized Skills Directory */}
      <div className="relative w-full max-w-7xl mx-auto z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-white/5 text-left">
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">Languages & Frontend</h4>
          <div className="p-5 rounded-2xl border border-white/5 bg-white/2 space-y-3 text-xs leading-relaxed text-slate-300">
            <div>
              <span className="text-slate-500 font-mono block text-[9px] uppercase tracking-wider">Languages</span>
              <p className="font-semibold text-white">JavaScript (ES6+), Python, C</p>
              <span className="text-[10px] text-slate-400 font-mono">(Learning: TypeScript, NestJS, Docker)</span>
            </div>
            <div>
              <span className="text-slate-500 font-mono block text-[9px] uppercase tracking-wider">Frontend</span>
              <p className="font-semibold text-white">React.js, HTML5, CSS3, Tailwind CSS, Redux Toolkit, Context API, Framer Motion, Material UI, Bootstrap</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">Backend & Databases</h4>
          <div className="p-5 rounded-2xl border border-white/5 bg-white/2 space-y-3 text-xs leading-relaxed text-slate-300">
            <div>
              <span className="text-slate-500 font-mono block text-[9px] uppercase tracking-wider">Backend</span>
              <p className="font-semibold text-white">Node.js, Express.js, Firebase Cloud Functions, REST APIs</p>
            </div>
            <div>
              <span className="text-slate-500 font-mono block text-[9px] uppercase tracking-wider">Databases</span>
              <p className="font-semibold text-white">MongoDB, Firestore, SQL</p>
            </div>
            <div>
              <span className="text-slate-500 font-mono block text-[9px] uppercase tracking-wider">Security & Auth</span>
              <p className="font-semibold text-white">JWT, RBAC, OTP Auth, Bcrypt, Helmet, Rate Limiting</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold tracking-widest text-pink-400 uppercase">Tools & Integrations</h4>
          <div className="p-5 rounded-2xl border border-white/5 bg-white/2 space-y-3 text-xs leading-relaxed text-slate-300">
            <div>
              <span className="text-slate-500 font-mono block text-[9px] uppercase tracking-wider">Tools & libraries</span>
              <p className="font-semibold text-white">Git, GitHub, Postman, ExcelJS, Recharts, Socket.io, Nodemailer, Joi</p>
            </div>
            <div>
              <span className="text-slate-500 font-mono block text-[9px] uppercase tracking-wider">Integrations</span>
              <p className="font-semibold text-white">Stripe, Razorpay, Twilio, Google Maps API, Firebase Cloud Messaging</p>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP DETAIL CARD (GLASS PANEL) */}
      <AnimatePresence>
        {activeSkill && (
          <div className="fixed inset-0 w-full h-full flex items-center justify-center z-50 px-6 backdrop-blur-md">
            
            {/* Modal backdrop dark blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSkill(null)}
              className="absolute inset-0 bg-[#020108]/90 cursor-pointer"
            />

            {/* Premium details card overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#0b0520]/80 border border-white/10 p-8 shadow-2xl z-10 overflow-hidden"
            >
              {/* Corner accent glow */}
              <div 
                className="absolute top-0 right-0 w-36 h-36 rounded-full blur-[60px] pointer-events-none" 
                style={{ backgroundColor: `${activeSkill.color}25` }}
              />

              {/* Close Button */}
              <button 
                onClick={() => setActiveSkill(null)}
                className="absolute top-4 right-4 p-2 rounded-full border border-white/10 hover:border-purple-500/40 bg-white/5 hover:bg-purple-500/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Card Contents */}
              <div className="space-y-6">
                {/* Tech Badge */}
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full border shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                    style={{ backgroundColor: activeSkill.color, borderColor: activeSkill.color }}
                  />
                  <h3 className="text-3xl font-black text-white tracking-tight uppercase select-none">{activeSkill.name}</h3>
                </div>

                {/* Substats Console */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4">
                  <div className="flex gap-2.5 items-center">
                    <Sparkles className="w-4.5 h-4.5 text-purple-400 flex-shrink-0" />
                    <div>
                      <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">Experience Level</span>
                      <span className="text-sm font-bold text-white leading-none mt-1 block">{activeSkill.experience}</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-center">
                    <Globe className="w-4.5 h-4.5 text-cyan-400 flex-shrink-0" />
                    <div>
                      <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest">Projects Log</span>
                      <span className="text-sm font-bold text-white leading-none mt-1 block">{activeSkill.projects}</span>
                    </div>
                  </div>
                </div>

                {/* Description details */}
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase">
                    <Cpu className="w-3.5 h-3.5" />
                    Technical Specs
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {activeSkill.description}
                  </p>
                </div>

                {/* Action button */}
                <button 
                  onClick={() => setActiveSkill(null)}
                  className="w-full py-3 rounded-xl border border-white/10 hover:border-purple-500/40 bg-white/5 hover:bg-purple-500/10 text-xs font-mono font-bold tracking-widest text-slate-300 hover:text-white uppercase transition-all mt-2 cursor-pointer"
                >
                  Exit Specs Log
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
