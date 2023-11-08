import React, { useEffect, useRef } from "react";
import * as THREE from "three";

function Second() {
  const mounts = useRef(null);
  const renderers = new THREE.WebGLRenderer();
  //   console.log(THREE.WebGL.isWebGLAvailable())
  console.log(renderers);

  useEffect(() => {
    let raycaster, mouse;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 10 / 4, 0.1, 5);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);
    // const helper = new THREE.CameraHelper(camera);
    // scene.add(helper);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth - 15 , window.innerHeight);
    mounts.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "red" });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 4;

    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.z += 0.01;
    //   cube.rotation.x += 0.01;
    //   cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    function onMouseMove(event) {
      event.preventDefault();
      if (!raycaster) raycaster = new THREE.Raycaster();
      if (!mouse) mouse = new THREE.Vector2();

      // Calculate mouse position relative to the canvas
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Cast a ray from the camera to the mouse position
      raycaster.setFromCamera(mouse, camera);

      // Check if the ray intersects with the cube
      const intersects = raycaster.intersectObject(cube);
      if (intersects.length > 0) {
        cube.material.color.set("#f00"); // Change color to red
      } else {
        cube.material.color.set("#fff"); // Change color back to white
      }
    }

    animate();

    // Add mousemove event listener to the canvas
    mounts.current.addEventListener("mousemove", onMouseMove);

    return () => {
      // Remove event listener when component unmountss
    //   mounts.current.removeEventListener(
    //     "mousemove",
    //     cube.material.color.set("#f00")
    //   );
    };
  }, []);

  return <div ref={mounts} />;
}

export default Second;
