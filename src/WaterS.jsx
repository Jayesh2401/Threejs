// // import React, { useEffect, useRef } from "react";
// // import * as THREE from "three";
// // import { Water } from "three/examples/jsm/objects/Water.js";
// // import { Sky } from "three/examples/jsm/objects/Sky.js";
// // import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// // const Ocean = () => {
// //   const containerRef = useRef(null);

// //   useEffect(() => {
// //     const container = containerRef.current;

// //     // renderer
// //     const renderer = new THREE.WebGLRenderer();
// //     renderer.setPixelRatio(window.devicePixelRatio);
// //     renderer.setSize(container.clientWidth, container.clientHeight);
// //     renderer.toneMapping = THREE.ACESFilmicToneMapping;
// //     container.appendChild(renderer.domElement);

// //     // scene
// //     const scene = new THREE.Scene();

// //     // camera
// //     const camera = new THREE.PerspectiveCamera(
// //       55,
// //       container.clientWidth / container.clientHeight,
// //       1,
// //       20000
// //     );
// //     camera.position.set(30, 30, 100);

// //     // sun
// //     const sun = new THREE.Vector3();

// //     // water
// //     const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

// //     const water = new Water(waterGeometry, {
// //       textureWidth: 512,
// //       textureHeight: 512,
// //       waterNormals: new THREE.TextureLoader().load(
// //         "waternormals.jpg",
// //         function (texture) {
// //           texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
// //         }
// //       ),
// //       sunDirection: new THREE.Vector3(),
// //       sunColor: 0xffffff,
// //       waterColor: 0x001e0f,
// //       distortionScale: 3.7,
// //       fog: scene.fog !== undefined,
// //     });

// //     water.rotation.x = -Math.PI / 2;
// //     scene.add(water);

// //     // sky
// //     const sky = new Sky();
// //     sky.scale.setScalar(10000);
// //     scene.add(sky);

// //     const skyUniforms = sky.material.uniforms;

// //     skyUniforms["turbidity"].value = 10;
// //     skyUniforms["rayleigh"].value = 2;
// //     skyUniforms["mieCoefficient"].value = 0.005;
// //     skyUniforms["mieDirectionalG"].value = 0.8;

// //     const parameters = {
// //       elevation: 2,
// //       azimuth: 180,
// //     };

// //     const pmremGenerator = new THREE.PMREMGenerator(renderer);
// //     let renderTarget;

// //     function updateSun() {
// //       const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
// //       const theta = THREE.MathUtils.degToRad(parameters.azimuth);

// //       sun.setFromSphericalCoords(1, phi, theta);

// //       sky.material.uniforms["sunPosition"].value.copy(sun);
// //       water.material.uniforms["sunDirection"].value.copy(sun).normalize();

// //       if (renderTarget !== undefined) renderTarget.dispose();

// //       renderTarget = pmremGenerator.fromScene(sky);

// //       scene.environment = renderTarget.texture;
// //     }

// //     updateSun();

// //     // box
// //     const geometry = new THREE.BoxGeometry(30, 30, 30);
// //     const material = new THREE.MeshStandardMaterial({ roughness: 0 });

// //     const mesh = new THREE.Mesh(geometry, material);
// //     scene.add(mesh);

// //     // controls

// //     const controls = new OrbitControls(camera, renderer.domElement);
// //     controls.maxPolarAngle = Math.PI / 2;
// //     controls.minDistance = 10;
// //     controls.maxDistance = 300;
// //     function onWindowResize() {
// //       camera.aspect = container.clientWidth / container.clientHeight;
// //       camera.updateProjectionMatrix();
// //       renderer.setSize(container.clientWidth, container.clientHeight);
// //     }

// //     window.addEventListener("resize", onWindowResize);

// //     function animate() {
// //       requestAnimationFrame(animate);

// //       controls.update();

// //       renderer.render(scene, camera);
// //     }

// //     animate();

// //     return () => {
// //       // clean up on unmount
// //       container.removeChild(renderer.domElement);
// //       renderer.dispose();
// //       controls.dispose();
// //       pmremGenerator.dispose();
// //       if (renderTarget !== undefined) renderTarget.dispose();
// //     };
// //   }, []);

// //   return <canvas ref={containerRef} tabIndex="0" style={{ width: '100%', height: '100%' }}></canvas>;
// // };

// // export default Ocean;

// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { Water } from "three/examples/jsm/objects/Water.js";
// import { Sky } from "three/examples/jsm/objects/Sky.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// const Ocean = () => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const container = containerRef.current;

//     // renderer
//     const renderer = new THREE.WebGLRenderer();
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(container.clientWidth, container.clientHeight);
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     container.appendChild(renderer.domElement);

//     // scene
//     const scene = new THREE.Scene();

//     // camera
//     const camera = new THREE.PerspectiveCamera(
//       55,
//       container.clientWidth / container.clientHeight,
//       1,
//       20000
//     );
//     camera.position.set(30, 30, 100);

//     // sun
//     const sun = new THREE.Vector3();

//     // water
//     const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

//     const water = new Water(waterGeometry, {
//       textureWidth: 512,
//       textureHeight: 512,
//       waterNormals: new THREE.TextureLoader().load(
//         "waternormals.jpg",
//         function (texture) {
//           texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//         }
//       ),
//       sunDirection: new THREE.Vector3(),
//       sunColor: 0xffffff,
//       waterColor: 0x001e0f,
//       distortionScale: 3.7,
//       fog: scene.fog !== undefined,
//     });

//     water.rotation.x = -Math.PI / 2;
//     scene.add(water);

//     // sky
//     const sky = new Sky();
//     sky.scale.setScalar(10000);
//     scene.add(sky);

//     const skyUniforms = sky.material.uniforms;

//     skyUniforms["turbidity"].value = 10;
//     skyUniforms["rayleigh"].value = 2;
//     skyUniforms["mieCoefficient"].value = 0.005;
//     skyUniforms["mieDirectionalG"].value = 0.8;

//     const parameters = {
//       elevation: 2,
//       azimuth: 180,
//     };

//     const pmremGenerator = new THREE.PMREMGenerator(renderer);
//     let renderTarget;

//     function updateSun() {
//       const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
//       const theta = THREE.MathUtils.degToRad(parameters.azimuth);

//       sun.setFromSphericalCoords(1, phi, theta);

//       sky.material.uniforms["sunPosition"].value.copy(sun);
//       water.material.uniforms["sunDirection"].value.copy(sun).normalize();

//       if (renderTarget !== undefined) renderTarget.dispose();

//       renderTarget = pmremGenerator.fromScene(sky);

//       scene.environment = renderTarget.texture;
//     }

//     updateSun();

//     // box
//     const geometry = new THREE.BoxGeometry(30, 30, 30);
//     const material = new THREE.MeshStandardMaterial({ roughness: 0 });

//     const mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);

//     // controls
//     const controlsRef = useRef(null);

//     useEffect(() => {
//       const controls = new OrbitControls(camera, renderer.domElement);
//       controls.maxPolarAngle = Math.PI / 2;
//       controls.minDistance = 10;
//       controls.maxDistance = 300;
//       controlsRef.current = controls;

//       return () => {
//         controls.dispose();
//       };
//     }, [camera, renderer.domElement]);

//     // animate
//     const animate = () => {
//       requestAnimationFrame(animate);
//       water.material.uniforms["time"].value += 1.0 / 60.0;
//       renderer.render(scene, camera);
//     };

//     animate();
//   }, []);

//   return <div ref={containerRef} />;
// };

// export default Ocean;

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const WaterS = () => {
  const containerRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const waterRef = useRef(null);
  const skyRef = useRef(null);
  const pmremGeneratorRef = useRef(null);
  const renderTargetRef = useRef(null);   

  useEffect(() => {
    const container = containerRef.current;

    // renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // camera
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      1,
      20000
    );
    camera.position.set(30, 30, 100);
    cameraRef.current = camera;

    // sun
    const sun = new THREE.Vector3();

    // water
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    const water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        "waternormals.jpg",
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined,
    });

    water.rotation.x = -Math.PI / 2;
    scene.add(water);
    waterRef.current = water;

    // sky
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);
    skyRef.current = sky;

    const skyUniforms = sky.material.uniforms;

    skyUniforms["turbidity"].value = 1000;
    skyUniforms["rayleigh"].value = 2;
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.8;

    const parameters = {
      elevation: 2,
      azimuth: 180,
    };

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGeneratorRef.current = pmremGenerator;

    function updateSun() {
      const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
      const theta = THREE.MathUtils.degToRad(parameters.azimuth);

      sun.setFromSphericalCoords(1, phi, theta);
      sky.material.uniforms["sunPosition"].value.copy(sun);
      // update the sun position
      function updateSun() {
        const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        const theta = THREE.MathUtils.degToRad(parameters.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        sky.material.uniforms["sunPosition"].value.copy(sun);
        water.material.uniforms["sunDirection"].value.copy(sun).normalize();

        scene.environment = pmremGenerator.fromScene(sky).texture;
      }

      // controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.maxPolarAngle = Math.PI * 0.495;
      controls.minDistance = 100;
      controls.maxDistance = 1000;
      controlsRef.current = controls;

      // resize
      function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
      window.addEventListener("resize", onWindowResize);

      // animate
      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        water.material.uniforms["time"].value += 1.0 / 60.0;
        renderer.render(scene, camera, renderTargetRef.current);
      }
      animate();

      return () => {
        pmremGeneratorRef.current.dispose();
        rendererRef.current.dispose();
        container.removeChild(rendererRef.current.domElement);
        window.removeEventListener("resize", onWindowResize);
      };
    }
  }, []);

  return <div ref={containerRef} />;
};

export default WaterS;
