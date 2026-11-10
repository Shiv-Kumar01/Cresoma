import React, { useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function HeroScene() {
  const particlesRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  const particleCount = 1000;

  const { positions, colors } = useMemo(() => {
    const posArray = new Float32Array(particleCount * 3);
    const colorArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 20;
      posArray[i + 1] = (Math.random() - 0.5) * 20;
      posArray[i + 2] = (Math.random() - 0.5) * 20;

      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.3 + 0.6, 0.8, 0.6);
      colorArray[i] = color.r;
      colorArray[i + 1] = color.g;
      colorArray[i + 2] = color.b;
    }
    return { positions: posArray, colors: colorArray };
  }, [particleCount]);

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x += 0.001;
      particlesRef.current.rotation.y += 0.002;

      particlesRef.current.rotation.x += (mouse.current.y * 0.0001);
      particlesRef.current.rotation.y += (mouse.current.x * 0.0001);
    }
  });

  const handlePointerMove = useCallback((event) => {
    mouse.current.x = (event.clientX - window.innerWidth / 2);
    mouse.current.y = (event.clientY - window.innerHeight / 2);
  }, []);

  return (
    <group onPointerMove={handlePointerMove}>

      <ambientLight color={0x6366f1} intensity={0.5} />
      <directionalLight color={0x8b5cf6} intensity={0.8} position={[5, 5, 5]} />

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors={true}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

    </group>
  );
}

export default HeroScene;