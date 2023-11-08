import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

const SmileyEmoji = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // const onMount = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      2,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth - 15, window.innerHeight);
    renderer.setClearColor(0x993399, 1);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.CircleGeometry(2, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const circle = new THREE.Mesh(geometry, material);
    scene.add(circle);

    const leftEyeGeometry = new THREE.CircleGeometry(0.3, 32);

    const rightEyeGeometry = new THREE.CircleGeometry(0.3, 32);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const leftEye = new THREE.Mesh(leftEyeGeometry, eyeMaterial);
    const rightEye = new THREE.Mesh(rightEyeGeometry, eyeMaterial);
    leftEye.position.x = -0.8;
    leftEye.position.y = 0.5;
    rightEye.position.x = 0.6;
    rightEye.position.y = 0.5;
    circle.add(leftEye);
    circle.add(rightEye);
    const leftEyeWhite = new THREE.CircleGeometry(0.1, 32);
    const eyeMaterialWhite = new THREE.MeshBasicMaterial({ color: "#fff" });
    const lefteyewhitecheck = new THREE.Mesh(leftEyeWhite, eyeMaterialWhite);
    lefteyewhitecheck.position.x = 0;
    lefteyewhitecheck.position.y = 0;
    leftEye.add(lefteyewhitecheck);
    const mouthCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-1, -0.5, 0),
        new THREE.Vector3(0, -1.5, 0),
        new THREE.Vector3(1, -0.5, 0)
        // new THREE.Vector3(-1, -0.5, 0),
        // new THREE.Vector3(0, -1, 0),
        // new THREE.Vector3(1, -0.5, 0)
    );
    const mouthPoints = mouthCurve.getPoints(50);
    const mouthGeometry = new THREE.BufferGeometry().setFromPoints(mouthPoints);
    const mouthMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const mouth = new THREE.Line(mouthGeometry, mouthMaterial);
    circle.add(mouth);

    camera.position.z = 5;

    const animate = () => {
      const time = Date.now() * 0.001;
      const scale = 1 + 0.5 * Math.sin(time * 5);
      lefteyewhitecheck.scale.set(scale, scale , 1)
      renderer.render(scene, camera);
      TWEEN.update();
      requestAnimationFrame(animate);
    };
    animate();

    circle.addEventListener("mouseenter", () => {
      new TWEEN.Tween(circle.scale)
        .to({ x: 0.8, y: 0.8 }, 200)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    });

    circle.addEventListener("mouseleave", () => {
      new TWEEN.Tween(circle.scale)
        .to({ x: 1, y: 1 }, 200)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    });
    // };
  }, []);

  return <div ref={mountRef}></div>;
};

export default SmileyEmoji;
