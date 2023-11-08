import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

function Pattern() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 5;
    scene.add(camera);

    const gui = new dat.GUI();

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial()
    );
    // scene.add(cube);

    const parameters = {
      count: 5000,
      size: 0.01,
      radius: 5,
      branches: 3,
    };

    let geometry = null;
    let material = null;
    let points = null;

    const genarateGalxy = () => {
      if (points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
      }

      geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.count * 3);
      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        const radiuss = Math.random() * parameters.radius;
        const branchesangle = (i % parameters.branches) / parameters.branches * Math.PI * 2
          
        positions[i3] = Math.cos(branchesangle) *radiuss;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = Math.sin(branchesangle) *radiuss;
        // positions[i3 + 0] = (Math.random() - 0.5) * 3;
        // positions[i3 + 1] = (Math.random() - 0.5) * 3;
        // positions[i3 + 2] = (Math.random() - 0.5) * 3;
      }
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);
    };
    genarateGalxy();

    gui
      .add(parameters, "count")
      .min(100)
      .max(10000)
      .step(100)
      .onFinishChange(genarateGalxy);
    gui
      .add(parameters, "size")
      .min(0.01)
      .max(0.1)
      .step(0.001)
      .onFinishChange(genarateGalxy);
    gui
      .add(parameters, "radius")
      .min(0.01)
      .max(20)
      .step(0.01)
      .onFinishChange(genarateGalxy);
    gui
      .add(parameters, "branches")
      .min(2)
      .max(20)
      .step(1)
      .onFinishChange(genarateGalxy);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
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

  return <canvas ref={canvasRef}></canvas>;
}

export default Pattern;
