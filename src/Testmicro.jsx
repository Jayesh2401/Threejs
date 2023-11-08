import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function Testmicro() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();

  useEffect(() => {
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color("black");

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 3;
    scene.add(camera);
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
    const particleGeometry = new THREE.SphereBufferGeometry(1, 32, 32);
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      sizeAttenuation: true,
      color: "#C9A7EB"
    });

    const particles = new THREE.Points(particleGeometry, particlesMaterial);
    scene.add(particles);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      const delta = clock.getDelta();
      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef}>Testmicro</canvas>;
}

export default Testmicro;
