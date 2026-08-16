import React, { useCallback, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Mail, Send, CheckCircle2, Download, Sparkles, MapPin } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   Design tokens — identical to Heropage / Aboutpage / SkillsGalaxy / Projectspage
───────────────────────────────────────────────────────────────────────────── */
const C = {
  bg: "#000000",
  white: "#F0EDE8",
  muted: "rgba(240,237,232,0.45)",
  dim: "rgba(240,237,232,0.22)",
  faint: "rgba(240,237,232,0.1)",
};

const EASE = [0.22, 1, 0.36, 1];
const STAR_SPEEDS = ["3.2s", "2.8s", "3.6s", "4.0s"];
const STAR_DELAYS = ["0s", "0.8s", "0.4s", "1.2s"];

function SparkeStar({ size = 13, color = "rgba(240,237,232,0.6)", speed = "3s", delay = "0s" }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, flexShrink: 0, perspective: "80px" }}>
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ animation: `starSpinY ${speed} ${delay} linear infinite`, transformStyle: "preserve-3d", filter: `drop-shadow(0 0 3px ${color})` }}>
        <line x1="1" y1="7" x2="13" y2="7" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="3.5" y1="2" x2="10.5" y2="12" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="10.5" y1="2" x2="3.5" y2="12" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

const GLOW_ORBS = [
  { top: "30%", left: "44%", size: 7,  blur: 10, delay: 1.4, animDelay: "1.5s", dur: "3s",   op: 0.55 },
  { top: "22%", left: "18%", size: 9,  blur: 14, delay: 1.7, animDelay: "0.8s", dur: "3.8s", op: 0.40 },
  { top: "68%", left: "72%", size: 11, blur: 18, delay: 2.0, animDelay: "2.1s", dur: "4.2s", op: 0.35 },
  { top: "15%", left: "60%", size: 6,  blur: 12, delay: 1.9, animDelay: "1.0s", dur: "3.4s", op: 0.45 },
  { top: "55%", left: "25%", size: 10, blur: 16, delay: 2.2, animDelay: "3.0s", dur: "4.8s", op: 0.30 },
  { top: "80%", left: "50%", size: 8,  blur: 14, delay: 2.5, animDelay: "0.5s", dur: "3.6s", op: 0.28 },
  { top: "40%", left: "82%", size: 12, blur: 20, delay: 2.8, animDelay: "1.8s", dur: "5.0s", op: 0.25 },
  { top: "10%", left: "35%", size: 7,  blur: 11, delay: 1.6, animDelay: "2.5s", dur: "3.2s", op: 0.38 },
  { top: "72%", left: "12%", size: 9,  blur: 15, delay: 3.0, animDelay: "0.3s", dur: "4.0s", op: 0.22 },
  { top: "48%", left: "92%", size: 6,  blur: 10, delay: 2.1, animDelay: "1.3s", dur: "3.5s", op: 0.32 },
];

/* ─── Brand SVGs, unchanged ─── */
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

/* Magnetic button wrapper — framer-motion springs instead of gsap,
   consistent with the mouse-parallax pattern used site-wide */
function MagneticWrapper({ children, style }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 16 });
  const springY = useSpring(y, { stiffness: 200, damping: 16 });

  const handleMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  }, [x, y]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div onMouseMove={handleMove} onMouseLeave={handleLeave} style={{ x: springX, y: springY, ...style }}>
      {children}
    </motion.div>
  );
}

/* Shared input style */
const inputStyle = {
  width: "100%",
  background: "rgba(240,237,232,0.02)",
  border: `1px solid ${C.faint}`,
  borderRadius: 12,
  padding: "12px 16px",
  fontSize: 14,
  fontFamily: "'EB Garamond', Georgia, serif",
  color: C.white,
  outline: "none",
  transition: "border-color 0.2s ease",
};

const labelStyle = {
  fontFamily: "monospace",
  fontSize: 9,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "rgba(240,237,232,0.45)",
  fontWeight: 700,
  display: "block",
  marginBottom: 6,
};

const pillButtonStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "12px 20px",
  borderRadius: 12,
  border: `1px solid ${C.faint}`,
  background: "rgba(240,237,232,0.02)",
  color: "rgba(240,237,232,0.75)",
  fontFamily: "monospace",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  cursor: "pointer",
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main Contactpage export — restyled to match Hero/About/Skills/Projects
───────────────────────────────────────────────────────────────────────────── */
export default function Contactpage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rawDotX = useMotionValue(0);
  const rawDotY = useMotionValue(0);

  const SPRING = { stiffness: 60, damping: 18, mass: 0.9 };
  const rotateX = useSpring(rawY, SPRING);
  const rotateY = useSpring(rawX, SPRING);
  const moveX = useSpring(rawDotX, SPRING);
  const moveY = useSpring(rawDotY, SPRING);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    rawX.set(nx * 8);
    rawY.set(-ny * 6);
    rawDotX.set(-nx * 35);
    rawDotY.set(-ny * 30);
  }, [rawX, rawY, rawDotX, rawDotY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    rawDotX.set(0);
    rawDotY.set(0);
  }, [rawX, rawY, rawDotX, rawDotY]);

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
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <section
      id="contact"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        background: "transparent",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "90px 0",
        perspective: "1100px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      <style>{`
        @keyframes starSpinY {
          0%   { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes dotFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .contact-input::placeholder { color: rgba(240,237,232,0.28); }
        .contact-input:focus { border-color: rgba(240,237,232,0.4) !important; }
      `}</style>

      <div aria-hidden style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none", zIndex: 1 }} />

      <motion.div style={{ position: "absolute", inset: 0, rotateX, rotateY, x: moveX, y: moveY, transformStyle: "preserve-3d", willChange: "transform", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {GLOW_ORBS.map((dot, i) => (
          <motion.div
            key={`glow-${i}`}
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: dot.op }}
            transition={{ delay: dot.delay, duration: 1.2 }}
            style={{
              position: "absolute", top: dot.top, left: dot.left, width: dot.size, height: dot.size, borderRadius: "50%",
              background: "rgba(255,255,255,0.88)", filter: `blur(${dot.blur}px)`,
              boxShadow: `0 0 ${dot.blur * 2}px ${dot.blur}px rgba(255,255,255,0.15), 0 0 ${dot.blur * 4}px ${dot.blur * 2}px rgba(255,255,255,0.06)`,
              zIndex: 5, animation: `dotFloat ${dot.dur} ${dot.animDelay} ease-in-out infinite`, pointerEvents: "none",
            }}
          />
        ))}

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
        {/* LEFT COLUMN — intro + quick contacts + links */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1" style={{ gap: 26 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.dim }}>
              Get In Touch
            </span>
            <h2 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 400, fontSize: "clamp(1.6rem, 2.8vw, 2.1rem)", color: "rgba(240,237,232,0.92)", margin: "8px 0 0", lineHeight: 1.3 }}>
              Let's build software that solves real business problems
            </h2>
            <div style={{ height: 1, width: 80, background: "rgba(240,237,232,0.15)", margin: "18px auto 0" }} className="lg:mx-0" />
            <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 15, lineHeight: 1.6, color: "rgba(240,237,232,0.55)", marginTop: 16, maxWidth: 420 }}>
              I'm always interested in collaborating on innovative projects, enterprise applications, and full-time software engineering opportunities.
            </p>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }} className="lg:justify-start">
              <SparkeStar size={12} speed={STAR_SPEEDS[0]} delay={STAR_DELAYS[0]} />
              <span style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(240,237,232,0.6)" }}>
                <MapPin size={13} style={{ display: "inline", marginRight: 6, verticalAlign: -2 }} />
                Kerala, India — open to India &amp; Gulf
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }} className="lg:justify-start">
              <SparkeStar size={12} speed={STAR_SPEEDS[1]} delay={STAR_DELAYS[1]} />
              <span style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(240,237,232,0.6)" }}>
                <Sparkles size={13} style={{ display: "inline", marginRight: 6, verticalAlign: -2 }} />
                Open to full-time & freelance opportunities
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 12 }} className="lg:justify-start">
            <MagneticWrapper>
              <button onClick={handleCopyEmail} style={pillButtonStyle}>
                <Mail size={14} />
                Copy Email
              </button>
            </MagneticWrapper>

            <MagneticWrapper>
              <button style={pillButtonStyle}>
                <Download size={14} />
                Resume
              </button>
            </MagneticWrapper>

            <MagneticWrapper>
              <a href="https://github.com/Anulakshmpb" target="_blank" rel="noreferrer"
                style={{ ...pillButtonStyle, padding: 12 }}>
                <GithubIcon width={15} height={15} />
              </a>
            </MagneticWrapper>

            <MagneticWrapper>
              <a href="https://www.linkedin.com/in/anulakshmipb" target="_blank" rel="noreferrer"
                style={{ ...pillButtonStyle, padding: 12 }}>
                <LinkedinIcon width={15} height={15} />
              </a>
            </MagneticWrapper>

            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(240,237,232,0.65)" }}
                >
                  Copied!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN — contact form */}
        <div className="lg:col-span-7 w-full order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 560,
              margin: "0 auto",
              borderRadius: 22,
              border: `1px solid ${C.faint}`,
              background: "rgba(240,237,232,0.02)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              padding: "36px 34px",
              overflow: "hidden",
              minHeight: 420,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ position: "absolute", top: -1, right: -1, width: 20, height: 20, borderTop: `1.5px solid ${C.dim}`, borderRight: `1.5px solid ${C.dim}` }} />
            <div style={{ position: "absolute", bottom: -1, left: -1, width: 20, height: 20, borderBottom: `1.5px solid ${C.dim}`, borderLeft: `1.5px solid ${C.dim}` }} />

            <AnimatePresence mode="wait">
              {!success ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 22, textAlign: "left", position: "relative", zIndex: 1 }}
                >
                  <div>
                    <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: C.dim }}>
                      Send a Message
                    </span>
                    <h3 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 400, fontSize: "clamp(1.5rem, 2.4vw, 1.9rem)", color: C.white, margin: "6px 0 0" }}>
                      Start a Conversation
                    </h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Your Name</label>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="contact-input"
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Email</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="contact-input"
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label style={labelStyle}>Message</label>
                      <textarea
                        required
                        rows="4"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell me about your project..."
                        className="contact-input"
                        style={{ ...inputStyle, resize: "none" }}
                      />
                    </div>
                  </div>

                  <MagneticWrapper>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: "100%",
                        padding: "14px 0",
                        borderRadius: 12,
                        border: `1px solid ${C.dim}`,
                        background: "rgba(240,237,232,0.06)",
                        color: C.white,
                        fontFamily: "monospace",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        cursor: "pointer",
                        opacity: loading ? 0.5 : 1,
                      }}
                    >
                      {loading ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <Send size={14} />
                          <span>Send Message</span>
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
                  style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 20, alignItems: "center", padding: "24px 0" }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 0.6 }}
                    style={{
                      width: 72, height: 72, borderRadius: "50%",
                      border: `1px solid ${C.dim}`,
                      background: "rgba(240,237,232,0.05)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <CheckCircle2 size={34} color="rgba(240,237,232,0.85)" />
                  </motion.div>

                  <div>
                    <h3 style={{ fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 400, fontSize: "clamp(1.4rem, 2.3vw, 1.8rem)", color: C.white, margin: 0 }}>
                      Message Sent
                    </h3>
                    <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(240,237,232,0.5)", marginTop: 8 }}>
                      Thanks for reaching out
                    </p>
                  </div>

                  <p style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 14, lineHeight: 1.6, color: "rgba(240,237,232,0.55)", maxWidth: 360, margin: 0 }}>
                    I've received your message and will get back to you as soon as possible.
                  </p>

                  <button
                    onClick={() => setSuccess(false)}
                    style={{
                      padding: "10px 22px",
                      borderRadius: 12,
                      border: `1px solid ${C.faint}`,
                      background: "rgba(240,237,232,0.02)",
                      color: "rgba(240,237,232,0.7)",
                      fontFamily: "monospace",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Send Another
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      </motion.div>
    </section>
  );
}