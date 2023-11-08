// import React, { useRef, useEffect } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { Reflector } from "three/examples/jsm/objects/Reflector";

// function Refle() {
//   const mirrorRef = useRef(null);
//   const canvasRef = useRef(null);
//   const { RGBFormat } = THREE

//   useEffect(() => {
//     // Three.js setup
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(0, 5, 10);

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0x333333);
//     canvasRef.current.appendChild(renderer.domElement);

//     // Create floor
//     const floor = new THREE.Mesh(
//       new THREE.PlaneGeometry(10, 10),
//       new THREE.MeshStandardMaterial({
//         color: "white",
//         side: THREE.DoubleSide,
//         metalness: 1,
//         roughness: 0,
//       })
//     );
//     floor.rotateX(-Math.PI / 2);
//     scene.add(floor);

//     // Create cube
//     const cube = new THREE.Mesh(
//       new THREE.BoxGeometry(1, 1, 1),
//       new THREE.MeshStandardMaterial({ color: "red" })
//     );
//     cube.position.set(0, 0.5, 0);
//     scene.add(cube);

//     // Create mirror
//     const mirror = new Reflector(new THREE.PlaneGeometry(10, 10), {
//       textureWidth: window.innerWidth * window.devicePixelRatio,
//       textureHeight: window.innerHeight * window.devicePixelRatio,
//       color: 0x777777,
//       clipBias: 0.003,
//       recursion: 1,
//     });
//     mirror.position.y = -0.001;
//     mirror.rotateX(-Math.PI / 2);
//     scene.add(mirror);

//     // Render target for mirror
//     const renderTarget = new THREE.WebGLRenderTarget(
//       window.innerWidth,
//       window.innerHeight,
//       { format: RGBFormat }
//     );

//     // Render loop
//     const animate = () => {
//       requestAnimationFrame(animate);
//       renderer.render(scene, camera, renderTarget);
//       mirror.material.uniforms.tDiffuse.value = renderTarget.texture;
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Add controls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.target.set(0, 0.5, 0);
//     controls.update();

//     // Resize listener
//     const onWindowResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//       renderTarget.setSize(
//         window.innerWidth * window.devicePixelRatio,
//         window.innerHeight * window.devicePixelRatio
//       );
//     };
//     window.addEventListener("resize", onWindowResize);

//     // Clean up function
//     return () => {
//       window.removeEventListener("resize", onWindowResize);
//     };
//   }, []);

//   return <div ref={canvasRef} />;
// }

// export default Refle;

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Reflector } from "three/examples/jsm/objects/Reflector";

function Refle() {
  const mirrorRef = useRef(null);
  const canvasRef = useRef(null);
  // const { RGBFormat } = THREE;

  useEffect(() => {
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x333333);
    canvasRef.current.appendChild(renderer.domElement);

    // Create floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: "white",
        side: THREE.DoubleSide,
        metalness: 1,
        roughness: 0,
      })
    );
    floor.rotateX(-Math.PI / 2);
    scene.add(floor);

    // Create cube
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: "red" })
    );
    cube.position.set(0, 0.5, 0);
    scene.add(cube);

    // Create mirror
    const mirror = new Reflector(new THREE.PlaneGeometry(10, 10), {
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: 0x777777,
      clipBias: 0.003,
      recursion: 1,
    });
    mirror.position.y = -0.001;
    mirror.rotateX(-Math.PI / 2);
    scene.add(mirror);

    // Add directional light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 0);
    scene.add(light);

    const pointLightHelper = new THREE.PointLightHelper(light, 4);
    scene.add(pointLightHelper);

    // Set needsUpdate flag to true to update material after adding light
    mirror.material.needsUpdate = true;

    // Render target for mirror
    const renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      // { format: RGBFormat }
    );

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera, renderTarget);
      mirror.material.uniforms.tDiffuse.value = renderTarget.texture;
      renderer.render(scene, camera);
    };
    animate();

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.5, 0);
    controls.update();

    // Resize listener
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderTarget.setSize(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio
      );
    };
    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  return <div ref={canvasRef} />;
}

export default Refle;
