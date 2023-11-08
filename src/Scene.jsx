import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

const Scene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let composer;
    let renderer;
    let scene;
    let camera;
    let cube , cube2;
    let animateId;

    const init = () => {
      // Set up scene, camera, and renderer
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z =3
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Create a cube
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: "red" });
      cube = new THREE.Mesh(geometry, material);
      cube2 = new THREE.Mesh(geometry, material);
      cube2.position.x = 2
      scene.add(cube );

      // Create an EffectComposer and add passes
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));

      const glitchPass = new GlitchPass();
      composer.addPass(glitchPass);

      const bloomPass = new UnrealBloomPass();
      composer.addPass(bloomPass);

      // Set up animation loop
      const animate = () => {
        animateId = requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        composer.render();
      };
      animate();
    };

    init();

    // Clean up on unmount
    return () => {
      cancelAnimationFrame(animateId);
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
};

export default Scene;
