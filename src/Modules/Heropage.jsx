import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import DrawingPortrait from "./DrawingPortriate";
import PaperTearTransition from "./PaperTear";

function Newspaper() {
  const pageRef = useRef(null);
  const headlineRef = useRef(null);
  const textBodyRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      if (headlineRef.current && textBodyRef.current) {
        gsap.set([headlineRef.current, textBodyRef.current], {
          opacity: 0,
          y: 20,
        });

        gsap.to([headlineRef.current, textBodyRef.current], {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.2,
          ease: "power2.out",
          delay: 6.2,
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen bg-[#E6D8B8] text-[#1a1a1a] font-serif overflow-x-hidden selection:bg-black selection:text-white vintage-paper-container"
    >
      <div className="absolute inset-0 old-paper-dots z-0" />
      <div className="absolute top-12 right-16 w-72 h-72 rounded-full border-[18px] border-[#4a2e00] blur-xl coffee-stain z-0" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full border-[24px] border-[#3d2400] blur-2xl coffee-stain z-0" />

      <div className="relative z-10">
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <div className="flex items-center justify-between text-[10px] tracking-widest uppercase border-b border-black pb-2 font-mono">
            <span>Wayanad, Kerala</span>
            <span>The Discovery Edition</span>
            <span>Est. 2026</span>
          </div>

          <div className="text-center py-6 border-b-4 border-black">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase font-serif">
              Anulakshmi P B
            </h1>
            <p className="text-xs tracking-[0.3em] uppercase mt-2 font-sans font-medium text-black/70">
              The personal record of a Full Stack Developer
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-[10px] uppercase tracking-widest py-2 border-b border-black font-mono">
            <span>August 2026</span>
            <span>·</span>
            <span>Vol. III</span>
            <span>·</span>
            <span>Selected works &amp; notes</span>
            <span>·</span>
            <span>Price: one coffee</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b-2 border-black font-sans">
            <span className="text-base font-bold tracking-tight">Anulakshmi P B</span>
            <nav className="flex items-center gap-6 text-xs uppercase tracking-wider font-semibold">
              <a href="#work" className="hover:underline transition-all">Work</a>
              <a href="#stack" className="hover:underline transition-all">Stack</a>
              <a href="#contact" className="hover:underline transition-all">Contact</a>
              <a
                href="#hire"
                className="bg-black text-white px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-neutral-800 transition-colors"
              >
                Hire me
              </a>
            </nav>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest mb-6 font-mono border-b border-black/20 pb-1">
            <span className="font-bold">Front page</span>
            <span>Filed under: Open investigations</span>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 space-y-4">
              <div ref={headlineRef}>
                <p className="text-xs uppercase tracking-widest font-mono text-black/60 mb-2">
                  Case No. 43 — Findings published
                </p>
                <h2 className="text-2xl md:text-4xl font-serif font-bold leading-[1.1] text-black tracking-tight">
                  A Full Stack Developer who builds modern web experiences —{" "}
                  <span className="italic font-normal">from concept to code.</span>
                </h2>
              </div>

              <div ref={textBodyRef} className="space-y-6 pt-2">
                <blockquote className="border-l-4 border-black pl-5 italic text-lg md:text-xl font-serif text-black/90 leading-relaxed my-6">
                  Specializing in high-performance frontend engineering, interactive SVG canvas animations, and full-stack system design.
                </blockquote>

                <div className="grid sm:grid-cols-2 gap-4 text-sm leading-relaxed border-t border-black/10 pt-4 font-sans text-black/80">
                  <p>
                    <span className="text-3xl font-bold float-left mr-2 leading-none font-serif text-black">A</span>
                    nulakshmi crafts pixel-perfect web interfaces that combine cinematic motion graphics with robust backend architectures. With expertise in React, Next.js, and GSAP, every project is built to captivate and deliver seamless functionality.
                  </p>
                  <p>
                    From custom interactive SVG canvas mask renders to complex state management, she focuses on delivering award-winning digital experiences with minimal load times and 60fps GPU-accelerated motion performance.
                  </p>
                </div>

                <p className="text-[10px] uppercase tracking-widest font-mono text-black/60 pt-2">
                  By <span className="font-bold text-black">The Editorial Desk</span> · Reporting from Kerala, India
                </p>
              </div>
            </div>

            <div className="w-full">
              <DrawingPortrait />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AfterTear() {
  return (
    <div className="relative z-20 flex min-h-screen items-center justify-center">
      <div className="text-center font-sans">
        <p className="text-xs uppercase tracking-[0.3em] text-black/50 mb-3">
          Chapter Two
        </p>
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-black/80">
          Let's build something.
        </h2>
      </div>
    </div>
  );
}

export default function Homepage() {
  const [tear, setTear] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setTear(true), 9500);
    return () => clearTimeout(t);
  }, []);

  return (
    <PaperTearTransition trigger={tear} revealBg={<AfterTear />}>
      <Newspaper />
    </PaperTearTransition>
  );
}