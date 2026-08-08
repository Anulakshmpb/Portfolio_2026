import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  Sparkles,
} from "@react-three/drei";

// ── Camera: drifts subtly with mouse position ─────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5);
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.9 - camera.position.x) * 0.04;
    camera.position.y += (mouse.current.y * 0.6 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── Central glass sphere ──────────────────────────────────────────────────
function GlassSphere() {
  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.35}>
      <mesh>
        <icosahedronGeometry args={[1.55, 4]} />
        <MeshTransmissionMaterial
          backside
          samples={8}
          thickness={0.28}
          roughness={0}
          transmission={0.96}
          envMapIntensity={1.6}
          color="#ffb84d"
          chromaticAberration={0.045}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.3}
          temporalDistortion={0.08}
        />
      </mesh>
    </Float>
  );
}

// ── Thin gold orbiting ring ───────────────────────────────────────────────
function OrbitRing() {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.rotation.y = t * 0.22;
    ref.current.rotation.z = t * 0.08;
  });

  return (
    <mesh ref={ref} rotation={[1.35, 0, 0.3]}>
      <torusGeometry args={[2.5, 0.022, 8, 120]} />
      <meshStandardMaterial
        color="#f59e0b"
        metalness={1}
        roughness={0.04}
        emissive="#92400e"
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

// ── Second outer ring (slower, different plane) ───────────────────────────
function OuterRing() {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.rotation.x = t * 0.12;
    ref.current.rotation.y = -t * 0.18;
  });

  return (
    <mesh ref={ref} rotation={[0.6, 0.2, 0]}>
      <torusGeometry args={[3.2, 0.012, 6, 100]} />
      <meshStandardMaterial
        color="#ffffff"
        metalness={0.8}
        roughness={0.2}
        opacity={0.3}
        transparent
      />
    </mesh>
  );
}

// ── Small orbiting wireframe icosahedron ──────────────────────────────────
function SmallOrb() {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.position.x = Math.cos(t * 0.55) * 2.6;
    ref.current.position.y = Math.sin(t * 0.75) * 1.3;
    ref.current.position.z = Math.sin(t * 0.45) * 1.1;
    ref.current.rotation.y = t * 1.5;
    ref.current.rotation.x = t * 0.8;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.22, 1]} />
      <meshBasicMaterial color="#f97316" wireframe />
    </mesh>
  );
}

// ── Full 3D scene ─────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.45} color="#fff8f0" />
      <pointLight position={[3, 3, 3]}   intensity={8}  color="#ea580c" />
      <pointLight position={[-3, -2, 2]} intensity={3}  color="#fbbf24" />
      <pointLight position={[0, -4, -2]} intensity={1.5} color="#ffe0b2" />

      {/* Environment (provides reflections & refractions for the glass) */}
      <Environment preset="city" />

      {/* Objects */}
      <GlassSphere />
      <OrbitRing />
      <OuterRing />
      <SmallOrb />

      {/* Ambient sparkle particles */}
      <Sparkles
        count={70}
        scale={8}
        size={0.9}
        speed={0.35}
        color="#f97316"
        opacity={0.45}
      />

      {/* Camera parallax */}
      <CameraRig />
    </>
  );
}

// ── Exported component (transparent canvas) ───────────────────────────────
export default function ThreeScene() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.5], fov: 50 }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // let portrait/parent receive mouse events too
      }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
