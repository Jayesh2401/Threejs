// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import * as dat from "dat.gui";
// import { TweenMax } from "gsap";
// import Stats from "stats.js";
// import { gsap } from "gsap";

// function NavbarCube() {
//   const cubeRef = useRef(null);

//   return <canvas ref={cubeRef}></canvas>;
// }

// export default NavbarCube;


import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function Cube() {
  const canvasRef = useRef(null);
  const cubeRef = useRef(null);

  const handleMoveUp = () => {
    if (cubeRef.current) {
      cubeRef.current.position.y += 1;
    }
  };

  const handleMoveDown = () => {
    if (cubeRef.current) {
      cubeRef.current.position.y -= 1;
    }
  };

  const handleMoveLeft = () => {
    if (cubeRef.current) {
      cubeRef.current.position.x -= 1;
    }
  };

  const handleMoveRight = () => {
    if (cubeRef.current) {
      cubeRef.current.position.x += 1;
    }
  };

  const handleMoveForward = () => {
    if (cubeRef.current) {
      cubeRef.current.position.z -= 1;
    }
  };

  const handleMoveBackward = () => {
    if (cubeRef.current) {
      cubeRef.current.position.z += 1;
    }
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("grey");

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const controls = new OrbitControls(camera, canvasRef.current);

    const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const material = [
        new THREE.MeshBasicMaterial({ color: 0xff0000 }),
        new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
        new THREE.MeshBasicMaterial({ color: 0x0000ff }),
        new THREE.MeshBasicMaterial({ color: 0xffff00 }),
        new THREE.MeshBasicMaterial({ color: 0xff00ff }),
        new THREE.MeshBasicMaterial({ color: 0x00ffff }),
      ];
  
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cubeRef.current = cube;

    camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return (
    <div className="cubeRef">
      <canvas ref={canvasRef} />
      <div className="buttonsCube">
        <button onClick={handleMoveUp}>Move Up</button>
        <button onClick={handleMoveDown}>Move Down</button>
        <button onClick={handleMoveLeft}>Move Left</button>
        <button onClick={handleMoveRight}>Move Right</button>
        <button onClick={handleMoveForward}>Move Forward</button>
        <button onClick={handleMoveBackward}>Move Backward</button>
      </div>
    </div>
  );
}

export default Cube;
