import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";

function Fourth() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Set up the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("white");

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth - 15, window.innerHeight);

    const smileyGeometry = new THREE.CircleGeometry(20, 32);
    const smileyMaterial = new THREE.MeshBasicMaterial({ color: "orange" });
    const smiley = new THREE.Mesh(smileyGeometry, smileyMaterial);
    smiley.position.set(0, 0, 0);
    scene.add(smiley);

    const borderGeometry = new THREE.CircleGeometry(22, 32);
    const borderMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const border = new THREE.LineLoop(borderGeometry, borderMaterial);
    border.position.set(0, 0, -1);
    scene.add(border);

    function animateBorder() {
      const time = Date.now() * 0.001;
      const scale = 1 + 0.1 * Math.sin(time * 1);
      border.scale.set(scale, scale, 1);
      renderer.render(scene, camera);
      requestAnimationFrame(animateBorder);
    }

    // smiley.current.addEventListener("mousemove", onHover);


    animateBorder();

    function onHover() {
      console.log("hover");
      const tween = new TWEEN.Tween(smiley.scale)
        .to({ y: 0.5 }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out);
      tween.start();
    }
    function onUnhover() {
      const tween = new TWEEN.Tween(smiley.scale)
        .to({ y: 1 }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out);
      tween.start();
    }


    smiley.onmouseover = onHover;
    // smiley.onmouseout = onUnhover;

    function render() {
      renderer.render(scene, camera);
    }
    render();
  }, []);

  return <canvas ref={canvasRef} />;
}

export default Fourth;
