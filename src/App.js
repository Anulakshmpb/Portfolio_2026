import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion';
import Navbar from './Modules/Navbar';
import Heropage from './Modules/Heropage';
import Aboutpage from './Modules/Aboutpage';
import Experiencepage from './Modules/Experiencepage';
import SkillsGalaxy from './Modules/SkillsGalaxy';
import Projectspage from './Modules/Projectspage';
import Contactpage from './Modules/Contactpage';
import Footer from './Modules/Footer';
import CaseStudyPage from './Modules/CaseStudyPage';
import './App.css';

/* ─────────────────────────────────────────────────────────────
   WARP TUNNEL — streaking star lines that react to scroll speed,
   giving a "flying forward through space" feel while scrolling.
───────────────────────────────────────────────────────────────── */
function WarpTunnel({ scrollYProgress }) {
  const canvasRef = useRef(null);
  const rawVelocity = useVelocity(scrollYProgress);
  const velocity = useSpring(rawVelocity, { stiffness: 400, damping: 60 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w, h, cx, cy;
    let raf;

    const streaks = Array.from({ length: 140 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: Math.random() * 0.9 + 0.05,
      len: Math.random() * 40 + 10,
      speed: Math.random() * 0.6 + 0.4,
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
      const v = Math.min(Math.abs(velocity.get()) * 3, 1); // 0..1 warp intensity
      ctx.clearRect(0, 0, w, h);

      if (v > 0.02) {
        streaks.forEach((s) => {
          s.dist += s.speed * v * 0.03;
          if (s.dist > 1) s.dist = 0.05;

          const r = s.dist * Math.max(w, h) * 0.7;
          const x = cx + Math.cos(s.angle) * r;
          const y = cy + Math.sin(s.angle) * r;
          const trail = s.len * (0.3 + v);
          const x2 = cx + Math.cos(s.angle) * (r - trail);
          const y2 = cy + Math.sin(s.angle) * (r - trail);

          ctx.strokeStyle = `rgba(255,255,255,${0.08 + v * 0.5 * s.dist})`;
          ctx.lineWidth = 1 + v * 1.5;
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
  }, [velocity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 40,
        mixBlendMode: 'screen',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   FLY-THROUGH SECTION — scales up from distance, holds sharp
   while centered in view, then rushes past (scales/fades out)
   as the next section arrives — mimicking a camera flythrough.
───────────────────────────────────────────────────────────────── */
function FlySection({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Enter: blurry + slightly small, sharpens to full clarity centered.
  // Hold: sharp, full size while centered in viewport.
  // Exit: zooms IN from center (scale up) while fading + blurring out —
  //        content appears to rush toward/through the viewer.
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.55, 1], [0.9, 1, 1, 1.6]);
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.55, 0.85], [0, 1, 1, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.18, 0.55, 0.85], [14, 0, 0, 18]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.div
        style={{
          scale,
          opacity,
          filter,
          transformOrigin: 'center center',
          willChange: 'transform, opacity, filter',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function App() {
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const { scrollYProgress } = useScroll();

  if (activeCaseStudy) {
    return (
      <div className="App">
        <CaseStudyPage project={activeCaseStudy} onClose={() => setActiveCaseStudy(null)} />
      </div>
    );
  }

  return (
    <div className="App" style={{ position: 'relative', background: '#000000' }}>
      <WarpTunnel scrollYProgress={scrollYProgress} />

      {/* <Navbar /> */}

      <FlySection>
        <Heropage />
      </FlySection>

      <FlySection>
        <Aboutpage />
      </FlySection>

      <FlySection>
        <Experiencepage />
      </FlySection>

      <FlySection>
        <SkillsGalaxy />
      </FlySection>

      <FlySection>
        <Projectspage onOpenCaseStudy={(proj) => setActiveCaseStudy(proj)} />
      </FlySection>

      <FlySection>
        <Contactpage />
      </FlySection>

      <Footer />
    </div>
  );
}

export default App;