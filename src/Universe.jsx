import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

function Universe() {
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
    camera.position.y = 2;
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
      count: 10000,
      size: 0.01,
      radius: 5,
      branches: 3,
      spin: 1,
      randomness: 0.02,
      randomnessPower: 5,
      insideColor: "#27f0c0",
      outsideColor: "#dc00fc",
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
      const colors = new Float32Array(parameters.count * 3);

      const colorInside = new THREE.Color(parameters.insideColor);
      const coloroutside = new THREE.Color(parameters.outsideColor);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        const radiuss = Math.random() * parameters.radius;
        const spinAngle = radiuss * parameters.spin;
        const branchesangle =
          ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        // const randomx = (Math.random() -  0.5)* parameters.randomness;
        // const randomy = (Math.random() -  0.5)* parameters.randomness;
        // const randomz = (Math.random() -  0.5)* parameters.randomness;

        const randomx =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1);
        const randomy =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1);
        const randomz =
          Math.pow(Math.random(), parameters.randomnessPower) *
          (Math.random() < 0.5 ? 1 : -1);

        positions[i3] = Math.cos(branchesangle + spinAngle) * radiuss + randomx;
        positions[i3 + 1] = 0 + randomy;
        positions[i3 + 2] =
          Math.sin(branchesangle + spinAngle) * radiuss + randomz;

        const mixedColor = colorInside.clone();
        mixedColor.lerp(coloroutside, radiuss / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
        // positions[i3 + 0] = (Math.random() - 0.5) * 3;
        // positions[i3 + 1] = (Math.random() - 0.5) * 3;
        // positions[i3 + 2] = (Math.random() - 0.5) * 3;
      }
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);
    };
    genarateGalxy();

    gui
      .add(parameters, "count")
      .min(100)
      .max(50000)
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
    gui
      .add(parameters, "spin")
      .min(-5)
      .max(5)
      .step(0.001)
      .onFinishChange(genarateGalxy);
    gui
      .add(parameters, "randomness")
      .min(0)
      .max(2)
      .step(0.001)
      .onFinishChange(genarateGalxy);
    gui
      .add(parameters, "randomnessPower")
      .min(1)
      .max(10)
      .step(0.001)
      .onFinishChange(genarateGalxy);
    gui.addColor(parameters, "insideColor").onFinishChange(genarateGalxy);
    gui.addColor(parameters, "outsideColor").onFinishChange(genarateGalxy);

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

export default Universe;
