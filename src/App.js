import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  useReducedMotion,
} from 'framer-motion';
import Heropage from './Modules/Heropage';
import Aboutpage from './Modules/Aboutpage';
import Experiencepage from './Modules/Experiencepage';
import SkillsGalaxy from './Modules/SkillsGalaxy';
import Projectspage from './Modules/Projectspage';
import Contactpage from './Modules/Contactpage';
// import Footer from './Modules/Footer';
import CaseStudyPage from './Modules/CaseStudyPage';
import './App.css';

/* DUST / STARFIELD */
function ParticleBackground({ reduced, scrollYProgress }) {
  const canvasRef = useRef(null);
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w, h, raf;

    const COUNT = window.innerWidth < 768 ? 40 : 90;
    const dust = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.4,
      o: Math.random() * 0.5 + 0.1,
      parallax: Math.random() * 0.6 + 0.2,
    }));

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const sp = smoothScroll.get();
      ctx.clearRect(0, 0, w, h);
      dust.forEach((d) => {
        const x = d.x * w;
        const y = (((d.y - sp * d.parallax) % 1) + 1) % 1 * h;
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${d.o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduced, smoothScroll]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}
    />
  );
}

/* WARP TUNNEL */
function WarpTunnel({ scrollYProgress, reduced }) {
  const canvasRef = useRef(null);
  const rawVelocity = useVelocity(scrollYProgress);
  const velocity = useSpring(rawVelocity, { stiffness: 300, damping: 40 });

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w, h, cx, cy, raf;

    const COUNT = window.innerWidth < 768 ? 70 : 180;
    const streaks = Array.from({ length: COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: Math.random() * 0.95 + 0.02,
      len: Math.random() * 55 + 15,
      speed: Math.random() * 0.7 + 0.3,
    }));

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      cx = w / 2;
      cy = h / 2;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const v = Math.min(Math.abs(velocity.get()) * 5 + 0.05, 1);
      ctx.clearRect(0, 0, w, h);
      if (v > 0.02) {
        streaks.forEach((s) => {
          s.dist += s.speed * v * 0.05;
          if (s.dist > 1) s.dist = 0.02;
          const r = s.dist * Math.max(w, h) * 0.85;
          const x = cx + Math.cos(s.angle) * r;
          const y = cy + Math.sin(s.angle) * r;
          const trail = s.len * (0.4 + v * 1.6);
          const x2 = cx + Math.cos(s.angle) * Math.max(0, r - trail);
          const y2 = cy + Math.sin(s.angle) * Math.max(0, r - trail);
          ctx.strokeStyle = `rgba(70,75,85,${0.03 + v * 0.18 * s.dist})`;
          ctx.lineWidth = 1 + v * 1.8;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [velocity, reduced]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, mixBlendMode: 'normal' }}
    />
  );
}

/* FIXED-VIEWPORT ZOOM SCENE — scale + opacity only, no blur, no vertical translation */
function SceneLayer({ children, index, totalScenes, scrollYProgress, reduced }) {
  const seg = 1 / totalScenes;
  const segStart = index * seg;
  const segEnd = segStart + seg;
  const at = (localStops) => localStops.map((f) => segStart + f * (segEnd - segStart));

  const isFirst = index === 0;
  const isLast = index === totalScenes - 1;

  const scaleStops = isFirst ? [0, 0.68, 1] : [0, 0.1, 0.42, 0.68, 1];
  const scaleVals = isFirst ? [1, 1, 2.6] : [0.12, 0.4, 1, 1, 2.6];
  const opStops = isFirst ? [0, 0.68, 0.92] : [0, 0.08, 0.22, 0.68, 0.92];
  const opVals = isFirst ? [1, 1, 0] : [0, 0.3, 1, 1, 0];

  const finalScaleStops = isLast ? [0, 0.1, 0.42, 1] : scaleStops;
  const finalScaleVals = isLast ? [0.12, 0.4, 1, 1] : scaleVals;
  const finalOpStops = isLast ? [0, 0.08, 0.22, 1] : opStops;
  const finalOpVals = isLast ? [0, 0.3, 1, 1] : opVals;

  const scale = useTransform(scrollYProgress, at(finalScaleStops), finalScaleVals);
  const opacity = useTransform(scrollYProgress, at(finalOpStops), finalOpVals);

  const smoothScale = useSpring(scale, { stiffness: 210, damping: 34, mass: 0.3 });
  const smoothOpacity = useSpring(opacity, { stiffness: 260, damping: 40 });

  const style = reduced
    ? { opacity }
    : {
      scale: smoothScale,
      opacity: smoothOpacity,
      transformOrigin: '50% 50%',
      willChange: 'transform, opacity',
    };

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        zIndex: totalScenes - index,
        pointerEvents: 'none',
        ...style,
      }}
    >
      <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
        {children}
      </div>
    </motion.div>
  );
}

const VH_PER_SCENE = 200;

function App() {
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const reduced = useReducedMotion();

  const scenesWrapperRef = useRef(null);
  const { scrollYProgress: scenesProgress } = useScroll({
    target: scenesWrapperRef,
    offset: ['start start', 'end end'],
  });

  const { scrollYProgress: pageProgress } = useScroll();

  const scenes = useMemo(
    () => [
      <Heropage key="hero" />,
      <Aboutpage key="about" />,
      <Experiencepage key="exp" />,
      <SkillsGalaxy key="skills" />,
      <Projectspage key="proj" onOpenCaseStudy={(proj) => setActiveCaseStudy(proj)} />,
      <Contactpage key="contact" />,
    ],
    []
  );

  if (activeCaseStudy) {
    return (
      <div className="App">
        <CaseStudyPage project={activeCaseStudy} onClose={() => setActiveCaseStudy(null)} />
      </div>
    );
  }

  return (
    <div className="App" style={{ position: 'relative', background: '#050505', minHeight: '100vh', overflowX: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, background: '#050505', zIndex: 0, pointerEvents: 'none' }} />

      <ParticleBackground reduced={reduced} scrollYProgress={pageProgress} />
      <WarpTunnel scrollYProgress={pageProgress} reduced={reduced} />

      <div ref={scenesWrapperRef} style={{ position: 'relative', height: `${VH_PER_SCENE * scenes.length}vh` }}>
        {scenes.map((scene, i) => (
          <SceneLayer
            key={i}
            index={i}
            totalScenes={scenes.length}
            scrollYProgress={scenesProgress}
            reduced={reduced}
          >
            {scene}
          </SceneLayer>
        ))}
      </div>

      {/* <Footer /> */}
    </div>
  );
}

export default App;