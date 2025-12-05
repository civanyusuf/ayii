import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, Vector3, MathUtils } from 'three';
import { BearMood } from '../types';

interface BearModelProps {
  mood: BearMood;
}

// Helper for smooth interpolation
const lerp = MathUtils.lerp;

export const BearModel: React.FC<BearModelProps> = ({ mood }) => {
  const headGroupRef = useRef<Group>(null);
  const leftEyeRef = useRef<Group>(null);
  const rightEyeRef = useRef<Group>(null);
  const leftArmGroupRef = useRef<Group>(null);
  const rightArmGroupRef = useRef<Group>(null);
  const mouthRef = useRef<Group>(null);

  // Materials colors
  const furColor = "#8B5A2B"; // Bear brown
  const snoutColor = "#D2B48C"; // Tan
  const noseColor = "#3e2723"; // Dark brown
  const scarfColor = "#ef4444"; // Red Tailwind-ish

  // Animation Loop
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const mouseX = state.mouse.x * 0.5;
    const mouseY = state.mouse.y * 0.5;

    // --- Target Values based on Mood ---
    let targetHeadRotX = 0;
    let targetHeadRotZ = 0;
    let targetEyeScaleY = 1;
    let targetArmRotZ = 0;
    
    // Breathing animation (subtle scale or position)
    const breathe = Math.sin(t * 2) * 0.02;

    switch (mood) {
      case BearMood.HAPPY:
        targetHeadRotZ = 0.2; // Tilt head
        targetEyeScaleY = 0.5; // Squint slightly
        targetArmRotZ = 2.5; // Arms up!
        break;
      case BearMood.SLEEPY:
        targetHeadRotX = 0.4; // Nod down
        targetHeadRotZ = 0.1;
        targetEyeScaleY = 0.1; // Closed eyes
        targetArmRotZ = 0.2; // Arms relaxed
        break;
      case BearMood.IDLE:
      default:
        targetHeadRotX = 0;
        targetHeadRotZ = 0;
        targetEyeScaleY = 1; // Open eyes
        targetArmRotZ = 0.5; // Resting arms
        break;
    }

    // --- Apply Animations (Lerp) ---

    if (headGroupRef.current) {
      // Base rotation from mood
      headGroupRef.current.rotation.x = lerp(headGroupRef.current.rotation.x, targetHeadRotX + (mouseY * 0.2), 0.1);
      headGroupRef.current.rotation.y = lerp(headGroupRef.current.rotation.y, mouseX * 0.5, 0.1);
      headGroupRef.current.rotation.z = lerp(headGroupRef.current.rotation.z, targetHeadRotZ, 0.1);
      
      // Add subtle breathing movement to head position
      headGroupRef.current.position.y = lerp(headGroupRef.current.position.y, 1.5 + breathe, 0.1);
    }

    if (leftEyeRef.current) {
        leftEyeRef.current.scale.y = lerp(leftEyeRef.current.scale.y, targetEyeScaleY, 0.2);
    }
    if (rightEyeRef.current) {
        rightEyeRef.current.scale.y = lerp(rightEyeRef.current.scale.y, targetEyeScaleY, 0.2);
    }

    // Arms Animation
    if (leftArmGroupRef.current) {
       // Left arm rotates outward/upward
       const targetZ = mood === BearMood.HAPPY ? -targetArmRotZ : -0.5;
       leftArmGroupRef.current.rotation.z = lerp(leftArmGroupRef.current.rotation.z, targetZ, 0.1);
       // Add a little swing
       leftArmGroupRef.current.rotation.x = lerp(leftArmGroupRef.current.rotation.x, Math.sin(t * 3) * 0.05, 0.1);
    }
    if (rightArmGroupRef.current) {
        // Right arm rotates outward/upward
        const targetZ = mood === BearMood.HAPPY ? targetArmRotZ : 0.5;
        rightArmGroupRef.current.rotation.z = lerp(rightArmGroupRef.current.rotation.z, targetZ, 0.1);
        rightArmGroupRef.current.rotation.x = lerp(rightArmGroupRef.current.rotation.x, Math.cos(t * 3) * 0.05, 0.1);
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* --- BODY --- */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.9, 1.8, 4, 16]} />
        <meshStandardMaterial color={furColor} roughness={0.6} />
      </mesh>

      {/* --- SCARF (Accessory) --- */}
      <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.7, 0.25, 16, 32]} />
        <meshStandardMaterial color={scarfColor} />
      </mesh>
      {/* Scarf tail */}
      <group position={[0.4, 0.8, 0.6]} rotation={[0, 0, -0.2]}>
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[0.3, 0.8, 0.1]} />
            <meshStandardMaterial color={scarfColor} />
          </mesh>
      </group>

      {/* --- ARMS --- */}
      {/* Pivot Point for Left Arm */}
      <group ref={leftArmGroupRef} position={[-0.8, 0.5, 0]}>
        <mesh position={[0, -0.6, 0]} castShadow>
          <capsuleGeometry args={[0.25, 1.2, 4, 8]} />
          <meshStandardMaterial color={furColor} />
        </mesh>
      </group>

      {/* Pivot Point for Right Arm */}
      <group ref={rightArmGroupRef} position={[0.8, 0.5, 0]}>
         <mesh position={[0, -0.6, 0]} castShadow>
          <capsuleGeometry args={[0.25, 1.2, 4, 8]} />
          <meshStandardMaterial color={furColor} />
        </mesh>
      </group>

      {/* --- HEAD GROUP --- */}
      <group ref={headGroupRef} position={[0, 1.5, 0]}>
        {/* Main Head Shape */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={furColor} />
        </mesh>

        {/* --- EARS --- */}
        {/* Left Ear */}
        <group position={[-0.7, 0.8, -0.2]} rotation={[0, 0, 0.5]}>
            <mesh castShadow>
                <sphereGeometry args={[0.35, 16, 16]} />
                <meshStandardMaterial color={furColor} />
            </mesh>
            {/* Inner Ear */}
            <mesh position={[0, 0, 0.25]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color={snoutColor} />
            </mesh>
        </group>
        
        {/* Right Ear */}
        <group position={[0.7, 0.8, -0.2]} rotation={[0, 0, -0.5]}>
             <mesh castShadow>
                <sphereGeometry args={[0.35, 16, 16]} />
                <meshStandardMaterial color={furColor} />
            </mesh>
             {/* Inner Ear */}
             <mesh position={[0, 0, 0.25]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color={snoutColor} />
            </mesh>
        </group>

        {/* --- FACE --- */}
        {/* Snout Area */}
        <mesh position={[0, -0.15, 0.85]} castShadow>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color={snoutColor} />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.05, 1.15]} castShadow>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={noseColor} roughness={0.2} />
        </mesh>

        {/* Eyes Container */}
        <group position={[0, 0.15, 0.9]}>
            {/* Left Eye */}
            <group position={[-0.3, 0, 0]}>
                <group ref={leftEyeRef}>
                     <mesh castShadow>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.5} />
                    </mesh>
                </group>
            </group>

            {/* Right Eye */}
            <group position={[0.3, 0, 0]}>
                 <group ref={rightEyeRef}>
                     <mesh castShadow>
                        <sphereGeometry args={[0.1, 16, 16]} />
                        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.5} />
                    </mesh>
                </group>
            </group>
        </group>

        {/* Mouth */}
        <group ref={mouthRef} position={[0, -0.3, 1.15]} rotation={[0, 0, 0]}>
             {mood === BearMood.HAPPY ? (
                 // Smile Shape (Torus segment)
                 <mesh rotation={[0, 0, Math.PI]} position={[0, 0.05, 0]}>
                     <torusGeometry args={[0.1, 0.02, 8, 16, Math.PI]} />
                     <meshStandardMaterial color="#1a1a1a" />
                 </mesh>
             ) : (
                 // Flat/Small mouth
                 <mesh scale={[1, 0.5, 1]}>
                    <sphereGeometry args={[0.03, 8, 8]} />
                    <meshStandardMaterial color="#1a1a1a" />
                 </mesh>
             )}
        </group>

      </group>
    </group>
  );
};
