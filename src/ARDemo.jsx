import React, { useEffect, useRef } from "react";
import { Canvas, useThree } from "react-three-fiber";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

function ARDemo() {
  const gltfModelRef = useRef(null);

  useEffect(() => {
    let renderer, scene, camera;

    // Create an AR session
    const arButton = ARButton.createButton(renderer);
    document.body.appendChild(arButton);

    // Initialize Three.js objects
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#7580ab");

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Load the 3D model
    const loader = new GLTFLoader();
    loader.load(
      "RobotExpressive.glb",
      (gltf) => {
        const model = gltf.scene;
        // gltfModelRef.current = model;
        model.scale.set(0.8, 0.8, 0.8);
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("Error loading 3D model:", error);
      }
    );

    // Attach renderer to the container
    const container = document.getElementById("ar-container");
    container.appendChild(renderer.domElement);

    // Render loop
    function animate() {
      renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
      });
    }
    animate();

    return () => {
      renderer.setAnimationLoop(null);
    };
  }, []);

  return <div id="ar-container" />;
}

function ARScene({ gltfModelRef }) {
  const { scene } = useThree();

  useEffect(() => {
    scene.add(gltfModelRef.current);

    return () => {
      scene.remove(gltfModelRef.current);
    };
  }, [scene, gltfModelRef]);

  return (
    <>
      <ambientLight intensity={5} />
      <pointLight position={[10, 10, 10]} intensity={100} />
    </>
  );
}

export default ARDemo;
