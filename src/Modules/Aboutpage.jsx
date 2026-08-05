import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';

// --- SUBTLE FLOATING 3D GLASS SHAPES ---
const FloatingGlassShape = ({ geometry, position, speed, rotationSpeed }) => {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.25;
    meshRef.current.rotation.x += rotationSpeed[0];
    meshRef.current.rotation.y += rotationSpeed[1];
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      {geometry}
      <meshPhysicalMaterial
        transmission={0.9}
        roughness={0.15}
        thickness={0.8}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        ior={1.5}
        color="#a855f7"
        attenuationColor="#ffffff"
        attenuationDistance={1}
        transparent
        opacity={0.35}
      />
    </mesh>
  );
};

const About3DBackground = () => {
  const shapes = useMemo(() => [
    {
      geometry: <torusGeometry args={[0.5, 0.15, 16, 100]} />,
      position: [-2.2, 1.2, -1],
      speed: 0.4,
      rotationSpeed: [0.005, 0.003]
    },
    {
      geometry: <boxGeometry args={[0.7, 0.7, 0.7]} />,
      position: [2.5, -1.2, -1.5],
      speed: 0.5,
      rotationSpeed: [-0.004, 0.006]
    },
    {
      geometry: <octahedronGeometry args={[0.55]} />,
      position: [-1.8, -1.5, -2],
      speed: 0.3,
      rotationSpeed: [0.007, -0.002]
    },
    {
      geometry: <coneGeometry args={[0.4, 0.8, 4]} />,
      position: [2.2, 1.5, -1.2],
      speed: 0.6,
      rotationSpeed: [0.003, 0.008]
    }
  ], []);

  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} className="w-full h-full">
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2.0} />
      <pointLight position={[-5, -5, 5]} color="#06b6d4" intensity={3} />
      <pointLight position={[5, 5, -5]} color="#a855f7" intensity={3} />
      {shapes.map((shape, idx) => (
        <FloatingGlassShape key={idx} {...shape} />
      ))}
    </Canvas>
  );
};

// --- ANIMATING STATISTICS COUNT-UP ---
const AboutStat = ({ end, label, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let startTime;
    const isNumeric = !isNaN(parseFloat(end));
    const endVal = isNumeric ? parseFloat(end) : 0;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 1800, 1);
      
      const easedProgress = progress * (2 - progress); // Ease out quad
      const currentVal = easedProgress * endVal;

      setCount(Math.floor(currentVal));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (isNumeric) {
          requestAnimationFrame(animateCount);
        } else {
          setCount(end);
        }
        observer.disconnect();
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center border border-white/5 shadow-lg relative overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
        {isNaN(parseFloat(end)) ? end : `${count}${suffix}`}
      </span>
      <span className="text-xs text-slate-400 mt-2 font-mono uppercase tracking-widest text-center">
        {label}
      </span>
    </div>
  );
};

// --- ABOUTPAGE MAIN MODULE ---
export default function Aboutpage() {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    
    // Normalize coordinates between -0.5 and 0.5
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;

    // Apply rotation transforms on hover
    gsap.to(cardRef.current, {
      rotateY: x * 15,
      rotateX: -y * 15,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)"
    });
  };

  return (
    <section id="about" className="relative min-h-screen w-full flex items-center justify-center py-24 px-6 md:px-12 xl:px-24 bg-[#030014] overflow-hidden border-t border-slate-900">
      {/* 3D Glass Geometries Canvas Container */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <About3DBackground />
      </div>

      {/* Floating Geometric Glass Panels (HTML/CSS Parallax depth) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] right-[15%] w-72 h-44 rounded-3xl border border-white/5 bg-white/2 backdrop-blur-[3px] transform rotate-12 animate-float-slow opacity-25" />
        <div className="absolute bottom-[20%] left-[8%] w-80 h-48 rounded-3xl border border-white/5 bg-white/2 backdrop-blur-[4px] transform -rotate-12 animate-float-reverse opacity-20" />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-16 items-center z-10">
        
        {/* LEFT COLUMN: PROFILE CARD WITH GLOWING BORDER */}
        <div className="lg:col-span-5 flex justify-center w-full">
          {/* Animated Glow Wrapper */}
          <div className="relative group w-full max-w-[360px] aspect-[4/5] rounded-[24px]">
            {/* The rotating/sweeping glow background */}
            <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 opacity-50 blur-xl group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow" />
            
            {/* Inner Glassmorphic Card */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
              className="relative w-full h-full rounded-[24px] bg-[#0d0722]/55 border border-white/10 backdrop-blur-2xl flex flex-col justify-between p-8 shadow-2xl overflow-hidden"
            >
              {/* Scanline overlay for code aesthetic */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none" />
              
              {/* Card Header Console */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4" style={{ transform: 'translateZ(30px)' }}>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase">System.Console</span>
              </div>

              {/* Monogram Display */}
              <div className="my-auto py-8 flex flex-col items-center justify-center text-center" style={{ transform: 'translateZ(50px)' }}>
                <div className="relative w-32 h-32 rounded-full border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.15)] mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0,transparent_70%)] animate-pulse-slow" />
                  <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-cyan-300 select-none">
                    A
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white tracking-tight">Anulakshmi P B</h3>
                <p className="text-xs text-cyan-400 font-mono mt-1 tracking-widest uppercase">Full Stack Engineer (MERN)</p>
              </div>

              {/* Card Footer Console */}
              <div className="border-t border-white/5 pt-4 text-xs font-mono text-slate-400 space-y-2" style={{ transform: 'translateZ(30px)' }}>
                <div className="flex justify-between">
                  <span>STATUS:</span>
                  <span className="text-green-400 animate-pulse">ACTIVE_DEPLOY</span>
                </div>
                <div className="flex justify-between">
                  <span>TARGET:</span>
                  <span className="text-purple-400">PRODUCTION_READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PROFESSIONAL STORY */}
        <div className="lg:col-span-7 flex flex-col text-left space-y-8">
          <div>
            <span className="text-xs font-bold font-mono tracking-[0.25em] text-purple-400 uppercase">Product Thinking</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none mt-2">
              Engineering with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-extrabold">Product Ownership</span>
            </h2>
          </div>

          {/* Scrolling Revealed Paragraphs */}
          <div className="space-y-6 text-slate-300 text-sm md:text-base leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              I am a Full Stack Engineer with more than one year of professional experience developing enterprise-grade web applications. Rather than building demo projects, I specialize in creating software that organizations rely on every day—from ERP platforms and operational dashboards to payment systems and real-time business applications. I enjoy designing scalable architectures, building secure authentication systems, integrating third-party services, and delivering responsive user interfaces that remain fast even with large volumes of data.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            >
              My journey as a developer has been centered around solving practical business challenges using modern web technologies. Over the past year, I have worked across enterprise applications involving finance, logistics, inventory, construction management, and e-commerce. My work spans the complete software development lifecycle—from understanding business requirements and designing scalable architectures to developing production-ready frontend and backend systems. I enjoy building reusable component libraries, secure REST APIs, real-time applications with Firebase, role-based authentication systems, and payment integrations using Stripe and Razorpay.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
              I believe good software should be scalable, maintainable, secure, and provide meaningful business value rather than simply demonstrating technical concepts.
            </motion.p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <AboutStat end="1" suffix="+" label="Years Experience" />
            <AboutStat end="10" suffix="+" label="Projects Delivered" />
            <AboutStat end="4" label="Production Systems" />
            <AboutStat end="Enterprise" label="ERP Applications" />
          </div>

          {/* Education & Certifications */}
          <div className="pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold tracking-widest text-purple-400 uppercase">Education</h4>
              <div className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-1">
                <span className="text-sm font-bold text-white block">Bachelor of Technology</span>
                <span className="text-xs text-slate-300 block">Computer Science & Engineering</span>
                <span className="text-xs text-slate-400 block">GCE Kannur | CGPA: 8.08</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">Certifications</h4>
              <div className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-1.5 font-mono text-[10px] text-slate-300">
                <div className="flex gap-1.5 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 flex-shrink-0" />
                  <span>Supervised Machine Learning: Regression and Classification</span>
                </div>
                <div className="flex gap-1.5 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1 flex-shrink-0" />
                  <span>Getting Started with Python</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
