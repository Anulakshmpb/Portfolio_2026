import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

import Portrait from "../Logo/portrait_clean.png";
import HandAsset from "../Logo/ha.png";

gsap.registerPlugin(MotionPathPlugin);

export default function DrawingPortrait({ onDrawingComplete }) {
    const containerRef = useRef(null);
    const handRef = useRef(null);
    const maskPathRef = useRef(null);
    const sigPathRef = useRef(null);
    const frameRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const maskPath = maskPathRef.current;
            const sigPath = sigPathRef.current;
            const hand = handRef.current;
            const frame = frameRef.current;
            const glow = glowRef.current;

            if (!maskPath || !hand) return;

            const pathLength = maskPath.getTotalLength();
            const sigLength = sigPath ? sigPath.getTotalLength() : 0;

            // Set initial stroke dash properties for progressive mask reveal
            gsap.set(maskPath, {
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength
            });

            if (sigPath) {
                gsap.set(sigPath, {
                    strokeDasharray: sigLength,
                    strokeDashoffset: sigLength
                });
            }

            // Hide hand off screen initial position
            gsap.set(hand, {
                x: 350,
                y: -40,
                rotate: -25,
                opacity: 0,
                scale: 0.95
            });

            gsap.set(frame, { opacity: 0, y: 15 });
            gsap.set(glow, { opacity: 0 });

            // Master Timeline
            const masterTl = gsap.timeline({
                onComplete: () => {
                    if (onDrawingComplete) onDrawingComplete();
                }
            });

            // 0.0s - 0.8s: Portrait frame appears
            masterTl.to(frame, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
            }, 0.8);

            // 1.2s: Hand enters from right with natural wrist rotation
            const startPt = maskPath.getPointAtLength(0);

            // Pen tip offset relative to hand container (140px wide, ~210px high)
            // Tip is near bottom-left of hand graphic (~20px X, 175px Y)
            const tipOffsetX = 20;
            const tipOffsetY = 175;

            masterTl.to(hand, {
                opacity: 1,
                x: startPt.x - tipOffsetX + 60,
                y: startPt.y - tipOffsetY - 40,
                rotate: -18,
                duration: 0.4,
                ease: "power2.out"
            }, 1.2);

            // 1.4s: Touchdown pen tip to paper
            masterTl.to(hand, {
                x: startPt.x - tipOffsetX,
                y: startPt.y - tipOffsetY,
                rotate: -12,
                duration: 0.2,
                ease: "sine.inOut"
            }, 1.4);

            // 1.4s - 5.5s: Drawing Process along SVG path
            const drawObj = { progress: 0 };

            masterTl.to(drawObj, {
                progress: 1,
                duration: 4.1,
                ease: "power1.inOut",
                onUpdate: () => {
                    const currentLength = drawObj.progress * pathLength;

                    // Update SVG mask stroke reveal
                    gsap.set(maskPath, {
                        strokeDashoffset: pathLength - currentLength
                    });

                    // Get current pen tip coordinate along Bezier curve
                    const pt = maskPath.getPointAtLength(currentLength);

                    // Add realistic wrist wobble & organic micro-movements
                    const progressVal = drawObj.progress;
                    const wobbleRot = Math.sin(progressVal * 40) * 3 - 10;
                    const jitterX = (Math.random() - 0.5) * 1.5;
                    const jitterY = (Math.random() - 0.5) * 1.5;

                    // Pen lift check (simulate lifting pen between major sections)
                    let liftY = 0;
                    if (
                        (progressVal > 0.22 && progressVal < 0.24) ||
                        (progressVal > 0.45 && progressVal < 0.47) ||
                        (progressVal > 0.72 && progressVal < 0.74)
                    ) {
                        liftY = -7; // 7px pen lift
                    }

                    gsap.set(hand, {
                        x: pt.x - tipOffsetX + jitterX,
                        y: pt.y - tipOffsetY + jitterY + liftY,
                        rotate: wobbleRot,
                        transformOrigin: "15% 85%"
                    });
                }
            }, 1.4);

            // 5.4s: Expand stroke width to 800 so the SVG mask reveals 100% of the complete portrait image
            masterTl.to(maskPath, {
                strokeWidth: 800,
                duration: 0.6,
                ease: "power2.out"
            }, 5.4);

            // 5.5s - 5.7s: Tiny Signature flourish
            if (sigPath) {
                const sigObj = { progress: 0 };
                masterTl.to(sigObj, {
                    progress: 1,
                    duration: 0.25,
                    ease: "power2.inOut",
                    onUpdate: () => {
                        const curSigLen = sigObj.progress * sigLength;
                        gsap.set(sigPath, {
                            strokeDashoffset: sigLength - curSigLen
                        });
                        const pt = sigPath.getPointAtLength(curSigLen);
                        gsap.set(hand, {
                            x: pt.x - tipOffsetX,
                            y: pt.y - tipOffsetY,
                            rotate: -5
                        });
                    }
                }, 5.5);
            }

            // 5.8s: Hand exits off-screen right
            masterTl.to(hand, {
                x: 400,
                y: 100,
                rotate: -30,
                opacity: 0,
                duration: 0.5,
                ease: "power2.in"
            }, 5.8);

            // 6.0s: Subtle warm glow around portrait frame
            masterTl.to(glow, {
                opacity: 1,
                duration: 0.6,
                ease: "power2.out"
            }, 6.0);

        }, containerRef);

        return () => ctx.revert();
    }, [onDrawingComplete]);

    return (
        <div ref={containerRef} className="relative w-full max-w-md mx-auto">
            {/* Outer Glow Highlight (Fades in at 6.0s) */}
            <div
                ref={glowRef}
                className="absolute -inset-1 rounded-sm bg-gradient-to-r from-[#d4af37]/30 via-[#1a1a1a]/10 to-[#d4af37]/30 blur-sm pointer-events-none transition-opacity"
            />

            {/* Main Vintage Newspaper Portrait Card */}
            <div
                ref={frameRef}
                className="relative w-full bg-[#F1EEE5] border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
                {/* SVG Container holding Mask and Portrait Image */}
                <div className="relative w-full aspect-[3/4] bg-[#eae5d8] overflow-hidden border border-black/20">

                    <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 300 400"
                        preserveAspectRatio="xMidYMid slice"
                    >
                        <defs>
                            {/* SVG Mask: Black hides, White reveals */}
                            <mask id="portrait-drawing-mask" maskUnits="userSpaceOnUse">
                                {/* Background: Black (hidden) */}
                                <rect x="0" y="0" width="300" height="400" fill="black" />

                                {/* Primary Organic Sketching Path covering the portrait from Hair down to Torso */}
                                <path
                                    ref={maskPathRef}
                                    d="
                    M 150,30 
                    C 190,25 240,40 245,85 
                    C 250,130 230,165 240,210 
                    C 245,240 215,265 185,275 
                    C 160,285 130,285 110,275 
                    C 80,260 55,230 55,185 
                    C 55,130 70,70 110,40 
                    C 130,25 150,30 150,30 Z

                    M 75,90 
                    C 110,70 190,70 225,90 
                    C 240,110 220,140 200,150 
                    C 160,170 120,170 90,150 
                    C 70,135 60,110 75,90 Z

                    M 90,130 
                    Q 120,120 145,135 
                    Q 170,120 205,130 
                    M 100,155 
                    Q 145,145 195,155

                    M 148,140 
                    L 145,185 
                    Q 155,195 162,185

                    M 115,210 
                    Q 150,228 185,210 
                    Q 150,240 115,210

                    M 60,180 
                    C 70,250 110,295 150,300 
                    C 190,295 230,250 240,180

                    M 105,295 
                    C 100,330 90,360 70,390 
                    M 195,295 
                    C 200,330 210,360 230,390

                    M 40,380 
                    Q 150,340 260,380

                    M 60,60 
                    S 240,120 80,180 
                    S 220,240 100,300 
                    S 240,360 140,395
                  "
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="50"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Signature stroke in mask */}
                                <path
                                    ref={sigPathRef}
                                    d="M 190,385 C 210,380 230,390 250,383"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                />
                            </mask>
                        </defs>

                        {/* Background Newspaper Canvas Texture */}
                        <rect width="300" height="400" fill="#F1EEE5" />

                        {/* Faint sketch outline placeholder (vintage halftone feel) */}
                        <image
                            href={Portrait}
                            x="0"
                            y="0"
                            width="300"
                            height="400"
                            preserveAspectRatio="xMidYMid slice"
                            opacity="0.06"
                            className="filter contrast-200 grayscale"
                        />

                        {/* Full Revealed Portrait Image (masked by SVG mask) */}
                        <image
                            href={Portrait}
                            x="0"
                            y="0"
                            width="300"
                            height="400"
                            preserveAspectRatio="xMidYMid slice"
                            mask="url(#portrait-drawing-mask)"
                        />
                    </svg>

                    {/* Hand holding Pen Asset */}
                    <div
                        ref={handRef}
                        className="absolute top-0 left-0 w-36 pointer-events-none z-30 mix-blend-multiply drop-shadow-lg"
                        style={{
                            willChange: "transform, opacity",
                            transformStyle: "preserve-3d"
                        }}
                    >
                        <img
                            src={HandAsset}
                            alt="Drawing Hand"
                            className="w-full h-auto select-none"
                        />
                    </div>
                </div>

                {/* Vintage Caption Bar */}
                <div className="mt-2 text-center border-t border-black/30 pt-1.5">
                    <p className="text-[10px] tracking-widest uppercase font-serif font-bold text-black/80">
                        Fig. 1 — Subject Portrait (Hand Drawn Record)
                    </p>
                </div>
            </div>
        </div>
    );
}