import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";
import { TweenMax } from "gsap";
import Stats from "stats.js";
import { gsap } from "gsap";

function Spline() {
  const eleventhRef = useRef(null);
  const [keys, setKeys] = useState({});
  let mixer = null;

  let clipAction, clips, modal;
  let currentAnimationTime = 0;
  useEffect(() => {
    const canvas = eleventhRef.current;
    eleventhRef.current.focus();
    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let clock = new THREE.Clock();
    const renderer = new THREE.WebGL1Renderer({ canvas, antialias: true });
    renderer.setSize(screen.width, screen.height);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#F9D3B7");
    const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 200);
    camera.position.set(1, 4, 55);

    scene.add(camera);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;


    const loader = new GLTFLoader();
    loader.load(
      "kids_playground_physics_copy.gltf",
      (gltf) => {
        const root = gltf.scene;
        modal = gltf.scene;
        root.scale.set(2, 2, 2);
        root.rotation.y = Math.PI;
        root.position.y = -0.6;
        root.add(new THREE.AmbientLight("white", 100));
        root.traverse((child) => {
          if (child.isMesh) {
            const randomColor = new THREE.Color(
              Math.random(),
              Math.random(),
              Math.random()
            );
            child.material = child.material.clone();
            child.material.color = randomColor;
          }
        });
        scene.add(root);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      }
    );

    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const directionalLight = new THREE.DirectionalLight("white", 2);
    directionalLight.position.set(1, 100, 100);
    scene.add(directionalLight);

    function render() {
      stats.update();

      const delta = clock.getDelta();

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    function handleResize() {
      const { innerWidth, innerHeight } = window;
      renderer.setSize(innerWidth - 15, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.removeChild(stats.dom);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={eleventhRef}>Eleventh</canvas>;
}

export default Spline;
