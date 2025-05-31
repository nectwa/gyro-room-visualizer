
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Mesh } from 'three';

interface GyroscopeProps {
  spinRate: number;
  spinDirection: number;
  spinAxis: [number, number, number];
  gimbalLocked: boolean;
}

const Gyroscope: React.FC<GyroscopeProps> = ({ spinRate, spinDirection, spinAxis, gimbalLocked }) => {
  const outerGimbalRef = useRef<Mesh>(null);
  const innerGimbalRef = useRef<Mesh>(null);
  const wheelRef = useRef<Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (wheelRef.current) {
      // Calculate rotation speed in radians per frame
      const rotationSpeed = (spinRate * spinDirection * delta * Math.PI) / 30; // Convert RPM to rad/frame
      
      // Apply rotation to the spinning wheel based on the selected axis
      if (spinAxis[0] === 1) {
        // X-axis rotation
        wheelRef.current.rotation.x += rotationSpeed;
      } else if (spinAxis[1] === 1) {
        // Y-axis rotation
        wheelRef.current.rotation.y += rotationSpeed;
      } else if (spinAxis[2] === 1) {
        // Z-axis rotation
        wheelRef.current.rotation.z += rotationSpeed;
      }
    }

    // Gimbal physics simulation
    if (!gimbalLocked && outerGimbalRef.current && innerGimbalRef.current) {
      // Subtle gimbal movement for realism
      outerGimbalRef.current.rotation.x += Math.sin(state.clock.elapsedTime * 0.5) * 0.001;
      innerGimbalRef.current.rotation.z += Math.cos(state.clock.elapsedTime * 0.3) * 0.001;
    }
  });

  return (
    <group position={[0, 2.2, 0]} castShadow receiveShadow>
      {/* Outer Gimbal Ring */}
      <mesh ref={outerGimbalRef} castShadow>
        <torusGeometry args={[2, 0.08, 12, 32]} />
        <meshStandardMaterial color="#CD7F32" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Inner Gimbal Ring */}
      <mesh ref={innerGimbalRef} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.5, 0.08, 12, 32]} />
        <meshStandardMaterial color="#B8860B" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Central Spinning Wheel */}
      <mesh ref={wheelRef} castShadow>
        <cylinderGeometry args={[1, 1, 0.3, 32]} />
        <meshStandardMaterial color="#8B4513" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Wheel Details - concentric rings for classic look */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.8, 0.03, 8, 32]} />
        <meshStandardMaterial color="#654321" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.6, 0.03, 8, 32]} />
        <meshStandardMaterial color="#654321" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.4, 0.03, 8, 32]} />
        <meshStandardMaterial color="#654321" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Base support */}
      <mesh position={[0, -1.2, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.5, 0.4, 8]} />
        <meshStandardMaterial color="#8B4513" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
};

const Room: React.FC = () => {
  // Create a more realistic concrete/stone floor texture
  const floorTexture = new THREE.TextureLoader().load('data:image/svg+xml;base64,' + btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="concrete" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="#e8e6e1"/>
          <rect x="1" y="1" width="48" height="48" fill="#f2f0eb" stroke="#d4d2cd" stroke-width="0.5"/>
          <circle cx="25" cy="25" r="2" fill="#c9c7c2" opacity="0.3"/>
          <circle cx="12" cy="38" r="1.5" fill="#bfbdb8" opacity="0.4"/>
          <circle cx="38" cy="12" r="1.2" fill="#d1cfc9" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#concrete)"/>
      <rect x="50" y="0" width="1" height="200" fill="#d4d2cd" opacity="0.8"/>
      <rect x="100" y="0" width="1" height="200" fill="#d4d2cd" opacity="0.8"/>
      <rect x="150" y="0" width="1" height="200" fill="#d4d2cd" opacity="0.8"/>
      <rect x="0" y="50" width="200" height="1" fill="#d4d2cd" opacity="0.8"/>
      <rect x="0" y="100" width="200" height="1" fill="#d4d2cd" opacity="0.8"/>
      <rect x="0" y="150" width="200" height="1" fill="#d4d2cd" opacity="0.8"/>
    </svg>
  `));
  
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(15, 15);

  return (
    <group>
      {/* Floor with realistic concrete texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          map={floorTexture} 
          roughness={0.8} 
          metalness={0.02}
          transparent={false}
          opacity={1}
        />
      </mesh>
      
      {/* Back Wall */}
      <mesh position={[0, 5, -10]} receiveShadow>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.9} metalness={0.0} transparent={false} opacity={1} />
      </mesh>
      
      {/* Left Wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-10, 5, 0]} receiveShadow>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.9} metalness={0.0} transparent={false} opacity={1} />
      </mesh>
      
      {/* Right Wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[10, 5, 0]} receiveShadow>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.9} metalness={0.0} transparent={false} opacity={1} />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 10, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.9} metalness={0.0} transparent={false} opacity={1} />
      </mesh>
    </group>
  );
};

const GyroscopeSimulation: React.FC = () => {
  const [spinRate, setSpinRate] = useState(60);
  const [spinDirection, setSpinDirection] = useState(1);
  const [spinAxis, setSpinAxis] = useState<[number, number, number]>([0, 1, 0]);
  const [gimbalLocked, setGimbalLocked] = useState(false);

  const handleAxisChange = (axis: string) => {
    switch (axis) {
      case 'X':
        setSpinAxis([1, 0, 0]);
        break;
      case 'Y':
        setSpinAxis([0, 1, 0]);
        break;
      case 'Z':
        setSpinAxis([0, 0, 1]);
        break;
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 relative">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg z-10 min-w-80">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Gyroscope Controls</h2>
        
        {/* Spin Rate */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spin Rate: {spinRate} RPM
          </label>
          <input
            type="range"
            min="0"
            max="300"
            value={spinRate}
            onChange={(e) => setSpinRate(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Spin Direction */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spin Direction
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => setSpinDirection(1)}
              className={`px-4 py-2 rounded ${spinDirection === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Clockwise
            </button>
            <button
              onClick={() => setSpinDirection(-1)}
              className={`px-4 py-2 rounded ${spinDirection === -1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Counter-CW
            </button>
          </div>
        </div>

        {/* Spin Axis */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spin Axis
          </label>
          <div className="flex space-x-2">
            {['X', 'Y', 'Z'].map((axis) => (
              <button
                key={axis}
                onClick={() => handleAxisChange(axis)}
                className={`px-3 py-2 rounded ${
                  (axis === 'X' && spinAxis[0] === 1) ||
                  (axis === 'Y' && spinAxis[1] === 1) ||
                  (axis === 'Z' && spinAxis[2] === 1)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {axis}
              </button>
            ))}
          </div>
        </div>

        {/* Gimbal Lock */}
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={gimbalLocked}
              onChange={(e) => setGimbalLocked(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">Lock Gimbal Rings</span>
          </label>
        </div>

        {/* Status Display */}
        <div className="text-xs text-gray-600 border-t pt-3">
          <p>Current Axis: [{spinAxis.join(', ')}]</p>
          <p>Angular Velocity: {(spinRate * 6).toFixed(1)}°/s</p>
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas
        camera={{ position: [5, 3, 5], fov: 60 }}
        shadows
        className="w-full h-full"
      >
        {/* Improved lighting setup to prevent bleeding */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[8, 8, 3]}
          intensity={1.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={25}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.0001}
        />
        <spotLight 
          position={[5, 8, 5]} 
          intensity={0.3} 
          castShadow 
          angle={Math.PI / 6}
          penumbra={0.3}
          decay={2}
          distance={20}
        />

        {/* Environment */}
        <Room />
        
        {/* Gyroscope */}
        <Gyroscope
          spinRate={spinRate}
          spinDirection={spinDirection}
          spinAxis={spinAxis}
          gimbalLocked={gimbalLocked}
        />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={15}
          target={[0, 0, 0]}
        />

        {/* Environment mapping for reflections */}
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
};

export default GyroscopeSimulation;
