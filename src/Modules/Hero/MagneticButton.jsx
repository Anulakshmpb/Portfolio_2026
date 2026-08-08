import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * MagneticButton
 * On hover, the button gently translates toward the cursor (up to 30%
 * of the cursor distance), creating a magnetic pull effect. Springs
 * back to center on mouse leave.
 *
 * Props:
 *   variant  – "primary" | "secondary"  (default "primary")
 *   onClick  – click handler
 *   children – button content
 */
export default function MagneticButton({
  children,
  variant = "primary",
  onClick,
  className = "",
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 24 });
  const sy = useSpring(y, { stiffness: 280, damping: 24 });

  const onMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.28);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.28);
  };
  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // ── Style maps ────────────────────────────────────────────────────────────
  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "14px 28px",
    borderRadius: 14,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    border: "none",
    outline: "none",
    willChange: "transform",
  };

  const variantStyle =
    variant === "primary"
      ? {
          background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
          color: "#ffffff",
          boxShadow:
            "0 4px 20px rgba(234,88,12,0.32), inset 0 1px 0 rgba(255,255,255,0.12)",
        }
      : {
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(234,88,12,0.28)",
          color: "rgba(255,255,255,0.88)",
        };

  const hoverGlowStyle =
    variant === "primary"
      ? "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 100%)"
      : "rgba(234,88,12,0.09)";

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      style={{ ...baseStyle, ...variantStyle, x: sx, y: sy }}
      className={className}
      onClick={onClick}
    >
      {/* Glow overlay on hover */}
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: hoverGlowStyle,
          pointerEvents: "none",
        }}
      />
      {children}
    </motion.button>
  );
}
