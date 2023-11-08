import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

function Thanos() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();
  let sceneLight,
    portalGeo,
    portalMaterial,
    smokeGeo,
    smokeMaterial,
    portalParticles = [],
    smokeParticles = [];

  useEffect(() => {
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color("grey");

    sceneLight = new THREE.DirectionalLight(0xffffff, 0.5);
    sceneLight.position.set(0, 0, 1);
    scene.add(sceneLight);

    const camera = new THREE.PerspectiveCamera(
      80,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = 1000;
    scene.add(camera);
    // const controls = new OrbitControls(camera, canvasRef.current);
    // controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);


    let loader = new THREE.TextureLoader();

    loader.load("smoke.png", function (texture) {
      portalGeo = new THREE.PlaneGeometry(300, 300);
      portalMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
      });

      smokeGeo = new THREE.PlaneGeometry(500, 500);
      smokeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
      });
      for (let p = 880; p > 250; p--) {
        let particle = new THREE.Mesh(portalGeo, portalMaterial);
        particle.position.set(
          0.5 * p * Math.cos((4 * p * Math.PI) / 180),
          0.5 * p * Math.sin((4 * p * Math.PI) / 180),
          0.1 * p
        );
        particle.rotation.z = Math.random() * 360;
        // particle.position.z = -1;
        portalParticles.push(particle); //keep the reference to the particle to animate it later
        scene.add(particle);
      }
      for (let p = 0; p < 40; p++) {
        let particle = new THREE.Mesh(smokeGeo, smokeMaterial);
        particle.position.set(
          Math.random() * 1000 - 500,
          Math.random() * 400 - 200,
          25
        );
        particle.rotation.z = Math.random() * 360;
        particle.material.opacity = 0.5;
        portalParticles.push(particle);
        scene.add(particle);
      }
    });

    let portalLight = new THREE.PointLight("#9435df", 10, 650, 1.7);
    portalLight.position.set(0, 0, 250);
    scene.add(portalLight);

    const animate = () => {
      portalLight.power = 100;
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      portalParticles.forEach((p) => {
        p.rotation.z -= delta * 1.5;
      });
      smokeParticles.forEach((p) => {
        p.rotation.z -= delta * 0.2;
      });

      if (Math.random() > 0.9) {
        portalLight.power = 150 + Math.random() * 5;
      }

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

export default Thanos;
