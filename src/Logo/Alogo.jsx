import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function LogoIntro() {
  const mountRef = useRef(null);
  const [showCookie, setShowCookie] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ---------- renderer / scene / camera ----------
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 9);

    // ---------- faint constellation / line background ----------
    const bgGroup = new THREE.Group();
    scene.add(bgGroup);

    const NUM_LINES = 7;
    for (let i = 0; i < NUM_LINES; i++) {
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        -5 - Math.random() * 10
      );
      const end = new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        -5 - Math.random() * 10
      );
      const geo = new THREE.BufferGeometry().setFromPoints([start, end]);
      const mat = new THREE.LineBasicMaterial({
        color: 0x6f8bab,
        transparent: true,
        opacity: 0.22,
      });
      bgGroup.add(new THREE.Line(geo, mat));
    }

    const dotGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const dots = [];
    for (let i = 0; i < 10; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xcfe8ff,
        transparent: true,
        opacity: 0.5 + Math.random() * 0.3,
      });
      const dot = new THREE.Mesh(dotGeo, mat);
      dot.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4 - 1
      );
      dot.userData.speed = 0.05 + Math.random() * 0.08;
      dot.userData.offset = Math.random() * Math.PI * 2;
      bgGroup.add(dot);
      dots.push(dot);
    }

    // ---------- the "A" logo mesh ----------
    const shape = new THREE.Shape();
    shape.moveTo(-0.15, 2.3); // apex
    shape.lineTo(0.15, 2.3);
    shape.lineTo(1.35, -2.3); // down right leg
    shape.lineTo(0.68, -2.3);
    shape.lineTo(0.4, -1.35);
    shape.lineTo(-0.4, -1.35);
    shape.lineTo(-0.68, -2.3); // down left leg
    shape.lineTo(-1.35, -2.3);
    shape.closePath();

    const counter = new THREE.Path();
    counter.moveTo(0, 0.85);
    counter.lineTo(0.24, 0.05);
    counter.lineTo(-0.24, 0.05);
    counter.closePath();
    shape.holes.push(counter);

    const extrudeSettings = {
      depth: 0.55,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.035,
      bevelSegments: 4,
      curveSegments: 2,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xc7d2dd,
      metalness: 1,
      roughness: 0.28,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
      reflectivity: 1,
      envMapIntensity: 1.8,
    });

    const logo = new THREE.Mesh(geometry, material);
    logo.rotation.x = 0.15;
    scene.add(logo);

    // glowing cyan core line, inset slightly beneath the chrome surface
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x2fd8ff,
      emissive: 0x2fd8ff,
      emissiveIntensity: 2.2,
      metalness: 0,
      roughness: 0.4,
      transparent: true,
      opacity: 0.9,
    });
    const coreGeometry = new THREE.ExtrudeGeometry(shape, {
      depth: extrudeSettings.depth * 0.35,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.015,
      bevelSegments: 2,
      curveSegments: 2,
    });
    coreGeometry.center();
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.scale.set(0.9, 0.9, 1.4);
    logo.add(core);

    // ---------- cool-toned environment map for reflections ----------
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size * 2;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0a1220";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0, "#101a2c");
    grad.addColorStop(0.5, "#dbe6f2");
    grad.addColorStop(1, "#101a2c");
    ctx.fillStyle = grad;
    ctx.fillRect(0, size * 0.28, canvas.width, size * 0.3);

    const grad2 = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad2.addColorStop(0, "#0d1626");
    grad2.addColorStop(0.5, "#8fd8ff");
    grad2.addColorStop(1, "#0d1626");
    ctx.fillStyle = grad2;
    ctx.fillRect(0, size * 0.62, canvas.width, size * 0.12);

    const envTex = new THREE.CanvasTexture(canvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const envRT = pmrem.fromEquirectangular(envTex);
    scene.environment = envRT.texture;
    envTex.dispose();

    // ---------- lights ----------
    const ambient = new THREE.AmbientLight(0x1a2438, 1.4);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xeaf2ff, 0.6);
    keyLight.position.set(-3, 4, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x3d6fa8, 0.4);
    fillLight.position.set(4, -2, 3);
    scene.add(fillLight);

    const sweepLight = new THREE.PointLight(0x2fd8ff, 55, 12, 2);
    sweepLight.position.set(0, -2, 1.5);
    scene.add(sweepLight);

    const sweepLight2 = new THREE.PointLight(0x6fe8ff, 20, 10, 2);
    sweepLight2.position.set(1, 1, 2);
    scene.add(sweepLight2);

    // ---------- interaction ----------
    let targetRotX = 0.15;
    let targetRotY = 0;
    let pointerX = 0;
    let pointerY = 0;

    const handlePointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", handleResize);

    // ---------- intro sequence ----------
    const clock = new THREE.Clock();
    logo.scale.setScalar(0.001);
    const INTRO_DELAY = 0.15;
    const INTRO_DUR = 1.3;

    const easeOutBack = (t) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (t > INTRO_DELAY) {
        const p = Math.min((t - INTRO_DELAY) / INTRO_DUR, 1);
        const eased = easeOutBack(p);
        logo.scale.setScalar(Math.max(eased, 0.001));
      }

      targetRotY = t * 0.18 + pointerX * 0.25;
      targetRotX = 0.15 + pointerY * 0.15;
      logo.rotation.y += (targetRotY - logo.rotation.y) * 0.06;
      logo.rotation.x += (targetRotX - logo.rotation.x) * 0.06;

      const sweep = Math.sin(t * 0.6) * 0.5 + 0.5;
      sweepLight.position.y = -2.6 + sweep * 5.2;
      sweepLight.position.x = Math.sin(t * 0.4) * 1.8;
      sweepLight.intensity = 35 + sweep * 45;

      sweepLight2.position.x = Math.cos(t * 0.5) * 2;
      sweepLight2.position.y = Math.sin(t * 0.35) * 1.5;

      dots.forEach((d) => {
        d.position.y +=
          Math.sin(t * d.userData.speed + d.userData.offset) * 0.0015;
      });
      bgGroup.rotation.y = t * 0.01;

      renderer.render(scene, camera);
    };
    animate();

    const cookieTimer = setTimeout(() => setShowCookie(true), 1600);

    // ---------- cleanup ----------
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(cookieTimer);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      coreGeometry.dispose();
      material.dispose();
      coreMaterial.dispose();
      envRT.texture.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "480px",
        background:
          "linear-gradient(115deg, transparent 40%, rgba(200,215,235,0.18) 49%, rgba(230,238,248,0.35) 52%, rgba(200,215,235,0.18) 55%, transparent 62%)," +
          "radial-gradient(ellipse at 30% 30%, #16233d 0%, #0a1220 55%, #050a14 100%)",
      }}
    >
      <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />
      {showCookie && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 36,
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "14px 22px",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 6,
            background: "rgba(10,10,10,0.55)",
            backdropFilter: "blur(6px)",
            color: "rgba(255,255,255,0.55)",
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
          }}
        >
          <span>We use cookies to enhance your experience.</span>
          <button
            onClick={() => setShowCookie(false)}
            style={cookieButtonStyle}
          >
            Decline
          </button>
          <button
            onClick={() => setShowCookie(false)}
            style={cookieButtonStyle}
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
}

const cookieButtonStyle = {
  background: "none",
  border: "none",
  color: "rgba(255,255,255,0.85)",
  font: "inherit",
  letterSpacing: "inherit",
  textTransform: "inherit",
  cursor: "pointer",
  padding: 0,
};