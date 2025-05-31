
import React from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface VectorDisplayProps {
  axis: [number, number, number];
  magnitude: number;
  position: [number, number, number];
}

const VectorDisplay: React.FC<VectorDisplayProps> = ({ axis, magnitude, position }) => {
  const vector = new THREE.Vector3(...axis).normalize().multiplyScalar(magnitude);
  
  return (
    <group position={position}>
      {/* Vector Arrow */}
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, magnitude, 8]} />
        <meshBasicMaterial color="#ff6b6b" />
      </mesh>
      
      {/* Arrow Head */}
      <mesh position={[0, magnitude / 2, 0]}>
        <coneGeometry args={[0.05, 0.1, 8]} />
        <meshBasicMaterial color="#ff6b6b" />
      </mesh>
      
      {/* Label */}
      <Html position={[0, magnitude / 2 + 0.2, 0]} center>
        <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
          Angular Momentum
        </div>
      </Html>
    </group>
  );
};

export default VectorDisplay;
