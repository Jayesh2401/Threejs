import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Test2() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas>
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 2, 5]} />
        
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="plum"/>
        </mesh>
        <OrbitControls/>
      </Canvas>
    </div>
  );
}

export default Test2;
