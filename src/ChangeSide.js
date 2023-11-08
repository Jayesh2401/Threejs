import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

function ChangeSide() {
  const canvasRef = useRef(null);
  const cubeRef = useRef(null);
  const contolRef = useRef(null);
  let targetRotation, controls, camera;

  const material = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    new THREE.MeshBasicMaterial({ color: 0xff00ff }),
    new THREE.MeshBasicMaterial({ color: 0x00ffff }),
  ];

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("grey");

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BoxGeometry();
    // const material = [
    //     new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    //   new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    //   new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    //   new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    //   new THREE.MeshBasicMaterial({ color: 0xff00ff }),
    //   new THREE.MeshBasicMaterial({ color: 0x00ffff }),
    // ];
    const cube = new THREE.Mesh(geometry, material);
    cubeRef.current = cube;
    scene.add(cube);
    controls = new OrbitControls(camera, canvasRef.current);
    // controls.target.copy(cubeRef.current.position);
    // contolRef.current = controls;
    camera.position.z = 5;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    // scene.add(ambientLight);

    // Add a directional light to provide a strong light source
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 10, 10);
    // scene.add(directionalLight);

    const floorGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: "white",
      metalness: 1,
      roughness: 0.2,
      envMap: cubeRef.current.material[0].envMap, // Use the environment map of the cube
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    // floor.rotation.x = -Math.PI / 2; // Rotate the floor so it is flat
    // floor.position.y= -1
    // scene.add(floor);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  const handleButtonClick = (color) => {
    // contolRef.current.reset();
    // controls.reset();

    camera.position.set(0, 0, 5);
    controls.target.set(0, 0, 0);
    console.log(
      cubeRef.current.rotation._x,
      cubeRef.current.rotation._y,
      cubeRef.current.rotation._z
    );
    // console.log(cubeRef.current.rotation);
    // console.log(cubeRef.current);
    // console.log(cubeRef.current.position);

    // if (cubeRef.current) {
    // const material = [
    //   new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    //   new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    //   new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    //   new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    //   new THREE.MeshBasicMaterial({ color: 0xff00ff }),
    //   new THREE.MeshBasicMaterial({ color: 0x00ffff }),
    // ];
    switch (color) {
      case "red":
        targetRotation =
          (material.indexOf(cubeRef.current.material) + 0.5) * Math.PI;
        gsap.to(cubeRef.current.rotation, {
          y: targetRotation,
          x: 0,
          duration: 1,
          onComplete: () => {
            console.log(cubeRef.current.rotation, "complete");
          },
        });
        break;
      case "green":
        targetRotation =
          (material.indexOf(cubeRef.current.material) + 0.5) * -Math.PI;
        gsap.to(cubeRef.current.rotation, {
          y: targetRotation,
          x: 0,

          duration: 1,
          onComplete: () => {
            console.log(cubeRef.current.rotation, "complete");
          },
        });
        break;
      case "blue":
        targetRotation =
          (material.indexOf(cubeRef.current.material) + 0.5) * -Math.PI;
        gsap.to(cubeRef.current.rotation, {
          x: targetRotation,
          duration: 1,
          onComplete: () => {
            console.log(cubeRef.current.rotation, "complete");
          },
        });
        break;
      case "yellow":
        targetRotation =
          (material.indexOf(cubeRef.current.material) + 0.5) * Math.PI;
        gsap.to(cubeRef.current.rotation, {
          x: targetRotation,

          duration: 1,
          onComplete: () => {
            console.log(cubeRef.current.rotation, "complete");
          },
        });
        break;
      case "magenta":
        targetRotation =
          (material.indexOf(cubeRef.current.material) + 0.5) * Math.PI;
        gsap.to(cubeRef.current.rotation, {
          y: 0,
          x: 0,

          duration: 1,
          onComplete: () => {
            console.log(cubeRef.current.rotation, "complete");
          },
        });
        break;
      case "cyan":
        targetRotation =
          (material.indexOf(cubeRef.current.material) + 0.5) * Math.PI * 2;
        gsap.to(cubeRef.current.rotation, {
          y: targetRotation,
          x: 0,
          duration: 1,
          onComplete: () => {
            console.log(cubeRef.current.rotation, "complete");
          },
        });
        break;
      default:
        break;
    }
    cubeRef.current.material = material;
    // contolRef.current.reset();

    //   const targetRotation = (material.indexOf(cubeRef.current.material) + 0.5) * (Math.PI / 3);
    //   gsap.to(cubeRef.current.rotation, { y: targetRotation, duration: 1 });
    // }
  };

  return (
    <div className="cubeRef">
      <canvas ref={canvasRef} />
      <div className="buttonsCube">
        <button onClick={() => handleButtonClick("red")}>Red</button>
        <button onClick={() => handleButtonClick("green")}>Green</button>
        <button onClick={() => handleButtonClick("blue")}>Blue</button>
        <button onClick={() => handleButtonClick("yellow")}>Yellow</button>
        <button onClick={() => handleButtonClick("magenta")}>Magenta</button>
        <button onClick={() => handleButtonClick("cyan")}>Cyan</button>
      </div>
    </div>
  );
}

export default ChangeSide;
