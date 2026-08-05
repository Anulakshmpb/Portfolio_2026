import React, { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Rocket, Mail, ArrowUp } from 'lucide-react';

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

// --- R3F CONSTELLATION NODES & CONNECTORS ---
const ConstellationLines = ({ stars }) => {
  const lineRef = useRef();

  useFrame(() => {
    if (!lineRef.current) return;
    const positions = [];
    
    // Calculate distance-based line segment arrays
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 1.4) {
          positions.push(stars[i].x, stars[i].y, stars[i].z);
          positions.push(stars[j].x, stars[j].y, stars[j].z);
        }
      }
    }
    
    lineRef.current.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );
    lineRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color="#a855f7" transparent opacity={0.16} />
    </lineSegments>
  );
};

const StarNode = ({ star }) => {
  const meshRef = useRef();
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(star.x, star.y, star.z);
    }
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
    </mesh>
  );
};

const ConstellationsBackground = () => {
  const stars = useMemo(() => {
    const list = [];
    for (let i = 0; i < 24; i++) {
      list.push({
        x: (Math.random() - 0.5) * 7.5,
        y: (Math.random() - 0.5) * 3.5,
        z: (Math.random() - 0.5) * 1.5,
        vx: (Math.random() - 0.5) * 0.01,
        vy: (Math.random() - 0.5) * 0.01
      });
    }
    return list;
  }, []);

  useFrame(() => {
    stars.forEach((star) => {
      star.x += star.vx;
      star.y += star.vy;
      
      // Boundary check & reverse direction
      if (Math.abs(star.x) > 3.8) star.vx *= -1;
      if (Math.abs(star.y) > 1.8) star.vy *= -1;
    });
  });

  return (
    <group>
      {stars.map((star, idx) => (
        <StarNode key={idx} star={star} />
      ))}
      <ConstellationLines stars={stars} />
    </group>
  );
};

// --- MAIN PORTFOLIO FOOTER COMPONENT ---
export default function Footer() {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleBackToTop = () => {
    if (isLaunching) return;
    
    setIsLaunching(true);
    
    // Simulate rocket liftoff off-screen before smooth scrolling
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 450);

    setTimeout(() => {
      setIsLaunching(false);
    }, 1200);
  };

  const handleLinkClick = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="relative w-full py-16 bg-[#02000f] overflow-hidden border-t border-slate-900 select-none">
      
      {/* 3D R3F Constellation Background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-50">
        <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
          <ConstellationsBackground />
        </Canvas>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 xl:px-24 z-10 flex flex-col items-center gap-12 text-center">
        
        {/* UPPER ROW: QUICK CONNECTIONS */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 border-b border-white/5 pb-12">
          
          {/* Logo brand & mini slogan */}
          <div className="flex flex-col items-center md:items-start text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-white uppercase">ANULAKSHMI P B</span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1">Full Stack Engineer (MERN)</span>
          </div>

          {/* Quick links map */}
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-400">
            {['about', 'experience', 'skills', 'projects', 'contact'].map((link) => (
              <button 
                key={link}
                onClick={() => handleLinkClick(link)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {link}
              </button>
            ))}
          </div>

          {/* Socials connections */}
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/Anulakshmpb" 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-xl border border-white/5 hover:border-purple-500/30 bg-white/3 hover:bg-white/8 text-slate-400 hover:text-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center"
            >
              <GithubIcon className="w-4 h-4" />
            </a>

            <a 
              href="https://www.linkedin.com/in/anulakshmipb" 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 rounded-xl border border-white/5 hover:border-cyan-500/30 bg-white/3 hover:bg-white/8 text-slate-400 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>

            <a 
              href="mailto:anulakshmipb2407@gmail.com"
              className="p-2.5 rounded-xl border border-white/5 hover:border-pink-500/30 bg-white/3 hover:bg-white/8 text-slate-400 hover:text-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all flex items-center justify-center"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* BOTTOM ROW: ROCKET LAUNCHER & COPYRIGHTS */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            © {new Date().getFullYear()} ANULAKSHMI P B. Coded in React + Tailwind.
          </span>

          {/* ROCKET SCROLL TRIGGER */}
          <div className="relative">
            <AnimatePresence>
              {isLaunching && (
                <motion.div
                  initial={{ y: 0, opacity: 1, scale: 1 }}
                  animate={{ y: -180, opacity: 0, scale: 0.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none text-purple-400 flex flex-col items-center"
                >
                  <Rocket className="w-5 h-5 rotate-0" />
                  {/* exhaust sparks */}
                  <motion.div 
                    animate={{ scale: [1, 1.5, 0] }}
                    className="w-1.5 h-3 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-full mt-0.5 blur-[1px]" 
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleBackToTop}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-white/3 hover:bg-white/8 text-[9px] font-mono font-bold tracking-widest text-slate-400 hover:text-white uppercase transition-all cursor-pointer"
            >
              Back to Top
              <ArrowUp className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
