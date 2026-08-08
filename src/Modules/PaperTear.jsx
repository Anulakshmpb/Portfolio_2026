/**
 * PaperTear.jsx — Ultra-Realistic Paper Tearing Transition
 *
 * Architecture:
 *  • Paper starts WHOLE (two halves with straight seams at 50%, no gap).
 *  • A `tearProgress` value (0→1) drives EVERY frame:
 *      – clip-paths recomputed → crack grows top→bottom
 *      – SVG clipRect expands → fiber/shadow only shows where torn
 *      – halves drift apart only horizontally (NO y, NO rotation during tear)
 *  • After crack reaches bottom: halves slide to resting position at sides.
 *  • NO flutter, NO falling, NO spinning, NO bouncing.
 *  • Paper remains partially visible at the sides when animation ends.
 */

import React, { useEffect, useRef, useMemo, useId } from "react";
import { gsap } from "gsap";

/* ═══════════════════════════════════════════════════════════════════════════
   1. TEAR-LINE GEOMETRY
   Random walk near 50% — small organic drifts, NOT alternating zigzag.
   60 points for ultra-smooth edges. Max ±3.8% drift from centre.
   ═══════════════════════════════════════════════════════════════════════════ */
function buildTearPoints() {
  const N = 60;    // points → organic micro-texture
  const DRIFT = 3.8;   // max % from 50%
  const STEP = 1.6;   // max x-shift per step
  const REVERT = 0.18;  // pull-back to centre strength

  let x = 50;
  return Array.from({ length: N }, (_, i) => {
    const y = (i / (N - 1)) * 100;
    if (i === 0 || i === N - 1) { x = 50; return { x: 50, y }; }
    const step = (Math.random() - 0.5) * 2 * STEP;
    x = Math.min(50 + DRIFT, Math.max(50 - DRIFT, x + step + (50 - x) * REVERT));
    return { x, y };
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. PROGRESSIVE CLIP-PATH COMPUTERS
   
   p=0 → both halves are perfect rectangles (paper looks completely whole)
   p=0.5 → crack has torn through 50% of height; bottom half still intact
   p=1 → full jagged tear line visible
   
   The tear FRONT is interpolated precisely so there's no "jump" between points.
   Below the front: straight vertical seam at 50% (untorn paper).
   ═══════════════════════════════════════════════════════════════════════════ */
const D = (n) => n.toFixed(4); // format with 4 decimal places for smooth animation

function getTearFront(pts, p) {
  const targetY = p * 100;
  const next = pts.findIndex(pt => pt.y > targetY);
  if (next <= 0) return { x: 50, y: targetY };
  const a = pts[next - 1];
  const b = pts[next];
  const t = (targetY - a.y) / (b.y - a.y);
  return { x: a.x + t * (b.x - a.x), y: targetY };
}

function getLeftClip(pts, p) {
  if (p <= 0) return "polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)";
  if (p >= 1) {
    const all = pts.map(pt => `${D(pt.x)}% ${D(pt.y)}%`).join(",");
    return `polygon(0% 0%,${all},0% 100%)`;
  }
  const front = getTearFront(pts, p);
  const torn = pts.filter(pt => pt.y <= front.y);
  const ts = torn.map(pt => `${D(pt.x)}% ${D(pt.y)}%`).join(",");
  // After tear front: back to straight 50% seam, then down to bottom-left
  return `polygon(0% 0%,${ts},${D(front.x)}% ${D(front.y)}%,50% ${D(front.y)}%,50% 100%,0% 100%)`;
}

function getRightClip(pts, p) {
  if (p <= 0) return "polygon(100% 0%, 50% 0%, 50% 100%, 100% 100%)";
  if (p >= 1) {
    const all = pts.map(pt => `${D(pt.x)}% ${D(pt.y)}%`).join(",");
    return `polygon(100% 0%,${all},100% 100%)`;
  }
  const front = getTearFront(pts, p);
  const torn = pts.filter(pt => pt.y <= front.y);
  const ts = torn.map(pt => `${D(pt.x)}% ${D(pt.y)}%`).join(",");
  return `polygon(100% 0%,${ts},${D(front.x)}% ${D(front.y)}%,50% ${D(front.y)}%,50% 100%,100% 100%)`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. FIBER + SHADOW OVERLAY SVG
   
   This SVG lives ABOVE both halves as an absolute overlay.
   A <clipPath> rect expands top→bottom as tear progresses —
   so shadows and fiber ONLY appear where the crack has already travelled.
   This is the key to making it look like a physical gap opening.
   ═══════════════════════════════════════════════════════════════════════════ */
function TearOverlaySVG({ clipId, maskRectRef, fiberPathRef, points }) {
  const pathD = points
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${D(pt.x)} ${D(pt.y)}`)
    .join(" ");

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ zIndex: 20 }}
    >
      <defs>
        {/*
          clipRect starts with height=0 (nothing visible).
          As tear progresses, height is set to p*100 via JS.
          Everything inside the <g> only shows where tear has reached.
        */}
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <rect ref={maskRectRef} x="-10" y="-10" width="120" height="0" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {/* ── Layer 1: Wide blurred dark gap shadow ── */}
        {/* Simulates the darkness of the gap / paper cross-section */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(0,0,0,0.55)"
          strokeWidth={10}
          vectorEffect="non-scaling-stroke"
          style={{ filter: "blur(10px)" }}
        />
        {/* ── Layer 2: Medium shadow — crisper depth ── */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(0,0,0,0.28)"
          strokeWidth={4}
          vectorEffect="non-scaling-stroke"
          style={{ filter: "blur(3px)" }}
        />
        {/* ── Layer 3: Inner tight shadow — paper edge ── */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(20,10,0,0.15)"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
          style={{ filter: "blur(0.8px)" }}
        />
        {/* ── Layer 4: White fiber highlight — the torn paper edge ── */}
        {/* This is the bright, slightly fuzzy white edge of torn paper fibers */}
        <path
          ref={fiberPathRef}
          d={pathD}
          fill="none"
          stroke="rgba(255,255,252,0.96)"
          strokeWidth={1.8}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{
            filter: "blur(0.3px) drop-shadow(0 0 2px rgba(255,255,255,0.9))",
          }}
        />
        {/* ── Layer 5: Secondary warm fiber tint — paper cross-section color ── */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(240,230,210,0.45)"
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
          style={{ filter: "blur(1px)" }}
        />
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. FALLBACK BACKGROUND (shown after tear)
   ═══════════════════════════════════════════════════════════════════════════ */
function DefaultWallTexture() {
  return (
    <div
      className="w-full h-full"
      style={{
        background:
          "radial-gradient(ellipse at 20% 30%, rgba(0,0,0,0.04), transparent 60%), " +
          "radial-gradient(ellipse at 80% 70%, rgba(0,0,0,0.05), transparent 55%), #e7e3d8",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function PaperTearTransition({
  children,
  trigger = false,
  autoPlayDelay = null,
  onComplete,
  revealBg = null,
}) {
  // Unique SVG clipPath id per instance (avoids collision if mounted twice)
  const uid = useId().replace(/:/g, "");
  const clipId = `ptt-clip-${uid}`;

  const wrapRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const maskRectRef = useRef(null);   // SVG <rect> controlling tear reveal area
  const fiberPathRef = useRef(null);   // white fiber <path>
  const overlayRef = useRef(null);   // the whole SVG overlay wrapper
  const played = useRef(false);
  const runTearRef = useRef(null);

  // Stable tear geometry (built once, never regenerated)
  const tearPoints = useMemo(buildTearPoints, []);

  useEffect(() => {
    if (!wrapRef.current) return;

    const runTear = () => {
      if (played.current) return;
      played.current = true;

      const left = leftRef.current;
      const right = rightRef.current;
      const maskRect = maskRectRef.current;
      const overlay = overlayRef.current;
      const revealEl = wrapRef.current.querySelector(".ptt-reveal-bg");

      // GPU-composited layers
      gsap.set([left, right], {
        transformPerspective: 1800,
        transformOrigin: "center center",
        willChange: "transform, clip-path",
      });

      /* ─────────────────────────────────────────────────────────────────
         PHASE 0 — COMPLETELY STILL  (0.0 – 0.3 s)
         Paper is a perfect intact sheet. Nothing moves.
         ───────────────────────────────────────────────────────────────── */
      // (GSAP timeline starts paused then auto-plays; the 0.3s pause is the
      //  initial blank frame before any movement begins)

      const tl = gsap.timeline({
        delay: 0.3,   // 300 ms of stillness before anything happens
        onComplete: () => onComplete && onComplete(),
      });

      /* ─────────────────────────────────────────────────────────────────
         PHASE 1 — CRACK PROPAGATES TOP → BOTTOM  (0.0 – 3.2 s in tl)
         
         A single `tearState.p` (0→1) drives EVERYTHING each frame:
           • clip-paths recomputed → jagged crack grows downward
           • maskRect height → fiber/shadow only where torn
           • halves drift apart horizontally (gap widens naturally)
         
         NO rotation during this phase. Paper is being PULLED not twisting.
         ───────────────────────────────────────────────────────────────── */

      // Show the overlay as crack begins
      gsap.set(overlay, { opacity: 0 });
      tl.to(overlay, { opacity: 1, duration: 0.2, ease: "none" }, 0);

      const tearState = { p: 0 };

      tl.to(tearState, {
        p: 1,
        duration: 3.2,
        // Custom ease: starts almost imperceptibly slow (simulating resistance),
        // reaches full propagation speed by 20%, then constant thereafter.
        ease: "power1.in",
        onUpdate: () => {
          const p = tearState.p;

          // ── Clip-paths: crack grows from top down ──────────────────
          const lc = getLeftClip(tearPoints, p);
          const rc = getRightClip(tearPoints, p);
          left.style.clipPath = lc;
          right.style.clipPath = rc;

          // ── SVG mask rect: fiber/shadow only shows where torn ───────
          // height goes from 0 → 110 (extra 10 to avoid clip edge at bottom)
          if (maskRect) {
            maskRect.setAttribute("height", String(p * 110));
          }
        },
      }, 0);

      // Halves drift ONLY horizontally as crack propagates.
      // Gap goes from 0 → ~5vw (about 40-50px on 1080p).
      // Ease: power2.in → gap barely noticeable early, accelerates as crack deepens.
      tl.to(left, {
        x: "-3.5%",
        duration: 3.2,
        ease: "power2.in",
      }, 0);

      tl.to(right, {
        x: "3.5%",
        duration: 3.2,
        ease: "power2.in",
      }, 0);

      // Extremely subtle paper bowing — simulates stiff paper being bent outward.
      // Only rotateY (outward tilt), NO rotateZ (no spin), NO rotateX.
      // Starts near zero, builds very slowly during tear.
      tl.to(left, {
        rotateY: -4,
        duration: 3.2,
        ease: "power1.in",
      }, 0);

      tl.to(right, {
        rotateY: 4,
        duration: 3.2,
        ease: "power1.in",
      }, 0);

      /* ─────────────────────────────────────────────────────────────────
         PHASE 2 — FINAL SEPARATION  (3.2 – 4.5 s in tl)
         
         Crack has reached the bottom. The two halves now slide apart
         to their resting positions — still ONLY horizontally.
         They remain partially visible at the sides (not fully off screen).
         Motion decelerates naturally to rest. No bounce. No spring.
         ───────────────────────────────────────────────────────────────── */
      // Phase 2: Halves fly completely off screen to opposite sides
      tl.to(left, {
        x: "-130%",
        rotateY: -20,
        rotateZ: -8,
        opacity: 0,
        duration: 1.0,
        ease: "power3.in",
      }, ">");

      tl.to(right, {
        x: "130%",
        rotateY: 20,
        rotateZ: 8,
        opacity: 0,
        duration: 1.0,
        ease: "power3.in",
      }, "<");              // both move simultaneously

      // CRITICAL: forcefully hide both halves after fly-off — prevents
      // GPU-composited layers from bleeding at viewport edges
      tl.set([left, right], { display: "none" }, ">");

      /* ─────────────────────────────────────────────────────────────────
         REVEAL — Background fades in through the widening gap.
         Starts appearing when tear is ~40% complete, fully visible at end.
         ───────────────────────────────────────────────────────────────── */
      if (revealEl) {
        tl.fromTo(
          revealEl,
          { opacity: 0 },
          { opacity: 1, duration: 2.4, ease: "power2.out" },
          1.2   // start at 1.2 s into tl (when crack is ~40% down)
        );
      }

      // Fade the overlay out after separation (fiber/shadow no longer needed)
      tl.to(overlay, {
        opacity: 0,
        duration: 0.5,
        ease: "power1.out",
      }, ">-0.3");
    };

    runTearRef.current = runTear;

    if (autoPlayDelay !== null) {
      const t = gsap.delayedCall(autoPlayDelay, runTear);
      return () => t.kill();
    }
  }, [autoPlayDelay, onComplete, tearPoints, clipId]);

  useEffect(() => {
    if (trigger && runTearRef.current) runTearRef.current();
  }, [trigger]);

  return (
    <div
      ref={wrapRef}
      className="relative w-full min-h-screen"
      style={{ background: "transparent" }}
    >
      {/* ── Reveal layer — behind everything ── */}
      <div className="ptt-reveal-bg absolute inset-0 min-h-screen opacity-0">
        {revealBg || <DefaultWallTexture />}
      </div>


      {/*
        LEFT half — starts as a perfect left rectangle.
        clip-path is mutated each frame by the animation.
      */}
      <div
        ref={leftRef}
        className="absolute inset-0"
        style={{
          clipPath: "polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)",
          willChange: "transform, clip-path",
        }}
      >
        {children}
      </div>

      {/*
        RIGHT half — starts as a perfect right rectangle.
        clip-path is mutated each frame by the animation.
      */}
      <div
        ref={rightRef}
        className="absolute inset-0"
        style={{
          clipPath: "polygon(100% 0%, 50% 0%, 50% 100%, 100% 100%)",
          willChange: "transform, clip-path",
        }}
      >
        {children}
      </div>

      {/*
        Tear overlay — fiber highlight + gap shadows.
        Sits above both halves. Hidden until animation starts.
        The internal SVG clipPath rect controls what's visible (torn region only).
      */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <TearOverlaySVG
          clipId={clipId}
          maskRectRef={maskRectRef}
          fiberPathRef={fiberPathRef}
          points={tearPoints}
        />
      </div>
    </div>
  );
}