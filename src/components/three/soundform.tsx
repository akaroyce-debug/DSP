"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * Abstract "soundform" sculpture — a morphing, slowly breathing mass ringed
 * by concentric waveform halos and a drifting particle field. Rendered in a
 * pearl-white / soft-bronze palette to sit on the luxury canvas.
 *
 * REPLACE: when a real product GLTF is ready, swap <Soundform> for a
 * drei <useGLTF> model, e.g.
 *   const { scene } = useGLTF("/models/aurum-core.glb");
 *   return <primitive object={scene} />;
 * Keep the lighting rig and Float wrapper for consistent presentation.
 */

function MorphingCore({ accent }: { accent: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.12;
    ref.current.rotation.z = Math.sin(t * 0.1) * 0.1;
  });

  return (
    <mesh ref={ref} scale={1.35}>
      <icosahedronGeometry args={[1, 24]} />
      {/* Distort animates the surface — gives the organic, sound-driven pulse */}
      <MeshDistortMaterial
        color={accent}
        envMapIntensity={0.6}
        metalness={0.42}
        roughness={0.18}
        clearcoat={0.6}
        clearcoatRoughness={0.25}
        distort={0.32}
        speed={1.4}
      />
    </mesh>
  );
}

function WaveformRings({ accent }: { accent: string }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.x = Math.PI / 2.6;
    group.current.rotation.z = t * 0.06;
  });

  const rings = [2.1, 2.7, 3.3, 3.9];
  return (
    <group ref={group}>
      {rings.map((r, i) => (
        <mesh key={r}>
          <torusGeometry args={[r, 0.006, 16, 220]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0.18 - i * 0.03}
          />
        </mesh>
      ))}
    </group>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 280;
    const arr = new Float32Array(count * 3);
    // Deterministic hash (GLSL-style) keeps the field stable across renders
    // and pure — no Math.random during render.
    const hash = (n: number) => {
      const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };
    for (let i = 0; i < count; i++) {
      const radius = 3 + hash(i) * 4;
      const theta = hash(i + 0.37) * Math.PI * 2;
      const phi = Math.acos(2 * hash(i + 0.91) - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = (hash(i + 0.53) - 0.5) * 6;
      arr[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#b8966a"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

export default function Soundform({
  accent = "#eceae3",
}: {
  accent?: string;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      {/* Lighting rig — soft key, cool fill, warm bronze rim */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 6, 5]} intensity={2.1} color="#ffffff" />
      <directionalLight position={[-6, -3, -4]} intensity={0.8} color="#cdd6e6" />
      <pointLight position={[-4, 2, 3]} intensity={1.2} color="#d8b487" />

      <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.9}>
        <MorphingCore accent={accent} />
      </Float>
      <WaveformRings accent="#b8966a" />
      <Particles />
    </Canvas>
  );
}
