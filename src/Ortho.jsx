import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Ortho = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -5, // left
      5, // right
      5, // top
      -5, // bottom
      0.1, // near
      100 // far
    );
    camera.position.z = 5;
    const canvas = containerRef.current
    const renderer = new THREE.WebGLRenderer({ antialias: true , canvas });
    renderer.setSize(window.innerWidth,window.innerHeight);

    // Create the cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "lightblue" });
    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    // Animate the cube
    const animate = () => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

  }, []);

  return <canvas ref={containerRef}  />;
};

export default Ortho;
