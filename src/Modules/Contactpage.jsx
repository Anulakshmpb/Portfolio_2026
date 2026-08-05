import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import gsap from 'gsap';
import { Mail, Send, CheckCircle2, Download, Sparkles, MapPin } from 'lucide-react';

// --- CUSTOM BRAND SVGS ---
const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// --- R3F CENTERPIECE: FLOATING GLASS ENVELOPE ---
const GlassEnvelope = ({ mouse }) => {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Slowly float
    meshRef.current.position.y = Math.sin(time * 0.8) * 0.15;
    
    // Inertial rotation following mouse + slight auto-rotate
    const targetX = mouse.current.y * 0.35;
    const targetY = time * 0.15 + mouse.current.x * 0.45;
    
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetY, 0.05);
  });

  const bodyShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.2, -0.75);
    s.lineTo(1.2, -0.75);
    s.lineTo(1.2, 0.75);
    s.lineTo(-1.2, 0.75);
    s.closePath();
    return s;
  }, []);

  const flapShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.2, 0.75);
    s.lineTo(1.2, 0.75);
    s.lineTo(0, 0.05);
    s.closePath();
    return s;
  }, []);

  return (
    <group ref={meshRef}>
      {/* Main envelope body */}
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[bodyShape, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 3 }]} />
        <meshPhysicalMaterial
          transmission={0.92}
          roughness={0.08}
          thickness={0.6}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          color="#d8e8fc"
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Back folding flap */}
      <mesh castShadow receiveShadow position={[0, 0, 0.065]}>
        <extrudeGeometry args={[flapShape, { depth: 0.02, bevelEnabled: false }]} />
        <meshPhysicalMaterial
          transmission={0.88}
          roughness={0.12}
          thickness={0.3}
          color="#a855f7"
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Glowing inner mail heart/data pulse */}
      <mesh position={[0, -0.1, 0.035]} scale={[0.13, 0.13, 0.13]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>
    </group>
  );
};

// --- MAGNETIC BUTTONS / ICONS ---
const MagneticWrapper = ({ children, className }) => {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    gsap.to(ref.current, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)"
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </div>
  );
};

// --- MAIN PORTFOLIO CONTACT PAGE ---
export default function Contactpage() {
  const mouse = useRef({ x: 0, y: 0 });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouse.current.x = (clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(clientY / window.innerHeight) * 2 + 1;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("anulakshmipb2407@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setLoading(true);
    // Simulate API packet delivery
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    }, 2000);
  };

  return (
    <section 
      id="contact"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex items-center justify-center py-24 px-6 md:px-12 xl:px-24 bg-[#030014] overflow-hidden border-t border-slate-900"
    >
      {/* Background Animated Conduits (CSS lines) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[30%] -left-[10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent blur-sm" />
        <div className="absolute bottom-[40%] -left-[10%] w-[120%] h-[1px] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-sm animate-pulse-slow" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* LEFT COLUMN: 3D ENVELOPE CENTERPIECE & INFO */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 order-2 lg:order-1">
          
          {/* R3F Canvas Container */}
          <div className="w-full h-[250px] sm:h-[300px] cursor-grab active:cursor-grabbing relative flex items-center justify-center">
            <div className="absolute inset-0.5 rounded-full bg-gradient-to-r from-purple-500/5 to-cyan-500/5 blur-2xl pointer-events-none" />
            <Canvas camera={{ position: [0, 0, 3.2], fov: 48 }}>
              <ambientLight intensity={1.2} />
              <pointLight position={[10, 10, 10]} intensity={1.5} />
              <GlassEnvelope mouse={mouse} />
            </Canvas>
          </div>

          {/* Quick Contacts Logs */}
          <div className="space-y-4 w-full">
            <h3 className="text-2xl font-bold text-white tracking-tight">Let's build software that solves real business problems</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal max-w-md">
              I'm always interested in collaborating on innovative projects, enterprise applications, and full-time software engineering opportunities.
            </p>

            <div className="space-y-3 font-mono text-xs text-slate-300 pt-2">
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Base Target: Kerala, India 🇮🇳</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Open to opportunities across India & Gulf countries</span>
              </div>
            </div>
          </div>

          {/* Brands Links and Resume Download */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 w-full">
            <MagneticWrapper>
              <button 
                onClick={handleCopyEmail}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-white/3 hover:bg-white/8 text-slate-300 hover:text-white transition-all text-xs font-mono font-bold uppercase cursor-pointer"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                Copy Email
              </button>
            </MagneticWrapper>

            <MagneticWrapper>
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-white/3 hover:bg-white/8 text-slate-300 hover:text-white transition-all text-xs font-mono font-bold uppercase cursor-pointer">
                <Download className="w-4 h-4 text-purple-400" />
                Download Resume
              </button>
            </MagneticWrapper>

            <div className="flex gap-2">
              <MagneticWrapper>
                <a 
                  href="https://github.com/Anulakshmpb" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-white/3 hover:bg-white/8 text-slate-400 hover:text-purple-400 transition-all flex items-center justify-center"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              </MagneticWrapper>
              
              <MagneticWrapper>
                <a 
                  href="https://www.linkedin.com/in/anulakshmipb" 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-white/3 hover:bg-white/8 text-slate-400 hover:text-cyan-400 transition-all flex items-center justify-center"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              </MagneticWrapper>
            </div>

            <AnimatePresence>
              {copied && (
                <motion.span 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-cyan-400 font-mono"
                >
                  Copied!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: GLASSMORPHIC CONTACT FORM */}
        <div className="lg:col-span-7 w-full order-1 lg:order-2">
          <div className="relative w-full max-w-[580px] mx-auto rounded-3xl bg-[#0d0722]/55 border border-white/10 backdrop-blur-2xl p-8 md:p-10 shadow-2xl overflow-hidden min-h-[420px] flex flex-col justify-center">
            
            {/* Scanline overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none" />

            <AnimatePresence mode="wait">
              {!success ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  className="space-y-6 text-left relative z-10"
                >
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase font-semibold">Dispatcher Connection</span>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none mt-2">Initialize Contact</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">Your Name / Company</label>
                      <input 
                        required
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe / Acme Corp" 
                        className="w-full bg-[#050212]/40 border border-white/5 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">Email Endpoint</label>
                      <input 
                        required
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com" 
                        className="w-full bg-[#050212]/40 border border-white/5 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">Project Brief / Message</label>
                      <textarea 
                        required
                        rows="4" 
                        name="message" 
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Describe your architectural challenges or dispatch details..." 
                        className="w-full bg-[#050212]/40 border border-white/5 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  <MagneticWrapper className="pt-2">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <span>TRANSMITTING PACKETS...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Dispatch Message</span>
                        </>
                      )}
                    </button>
                  </MagneticWrapper>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-6 py-6"
                >
                  <div className="flex justify-center">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5 }}
                      className="w-20 h-20 rounded-full border border-green-500/20 bg-green-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.2)]"
                    >
                      <CheckCircle2 className="w-10 h-10 text-green-400" />
                    </motion.div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">Transmission Success</h3>
                    <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Packet dispatched successfully</p>
                  </div>

                  <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Your contact telemetry package has been captured. I will process these specs and establish a communications link shortly.
                  </p>

                  <button 
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-white/5 hover:bg-white/10 text-[10px] font-mono font-bold tracking-widest text-slate-300 hover:text-white uppercase transition-all cursor-pointer"
                  >
                    Open New Channel
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </section>
  );
}
