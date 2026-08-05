import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Orbit } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Home', id: 'home' },
  { name: 'About', id: 'about' },
  { name: 'Experience', id: 'experience' },
  { name: 'Skills', id: 'skills' },
  { name: 'Projects', id: 'projects' },
  { name: 'Contact', id: 'contact' }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Scroll listener for shrink effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. IntersectionObserver for active section tracking
  useEffect(() => {
    const observers = [];
    
    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(item.id);
          }
        },
        {
          rootMargin: '-30% 0px -40% 0px', // Focus window centered in screen
          threshold: 0.15
        }
      );

      observer.observe(el);
      observers.push({ observer, el });
    });

    return () => {
      observers.forEach(({ observer, el }) => observer.unobserve(el));
    };
  }, []);

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* FLOATING PILL CONTAINER */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 flex justify-center px-6 pointer-events-none select-none"
      >
        <motion.div
          animate={{
            padding: isScrolled ? "8px 20px" : "14px 32px",
            y: isScrolled ? 12 : 24,
            borderRadius: isScrolled ? "30px" : "20px",
            maxWidth: isScrolled ? "540px" : "780px"
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full pointer-events-auto bg-[#0d0722]/55 border border-white/10 backdrop-blur-md shadow-2xl flex items-center justify-between"
        >
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 cursor-pointer text-white hover:text-cyan-400 transition-colors"
          >
            <Orbit className="w-5 h-5 text-purple-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs font-mono font-bold tracking-widest uppercase">ANULAKSHMI P B</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6 relative items-center">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-xs font-mono font-bold uppercase tracking-wider relative py-1.5 transition-colors cursor-pointer ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  
                  {/* Sliding Underline Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                      transition={{ type: "spring", damping: 30, stiffness: 380 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Hamburger Trigger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </motion.nav>

      {/* MOBILE FULL-SCREEN EXPANSION OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 w-full h-full bg-[#030014]/98 z-40 md:hidden flex flex-col items-center justify-center space-y-8 backdrop-blur-lg"
          >
            {/* Ambient Background glows */}
            <div className="absolute top-[20%] left-[20%] w-64 h-64 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[20%] w-64 h-64 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />

            <div className="flex flex-col items-center gap-6 relative z-10">
              {NAV_ITEMS.map((item, idx) => {
                const isActive = activeSection === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-lg font-mono font-bold tracking-widest uppercase cursor-pointer transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </motion.button>
                );
              })}
            </div>

            {/* Exit/Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute bottom-12 p-3 rounded-full border border-white/10 hover:border-purple-500/30 bg-white/5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
