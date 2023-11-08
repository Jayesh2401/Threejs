// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { Water } from "three/addons/objects/Water.js";
// import { Sky } from "three/addons/objects/Sky.js";
// import Stats from "three/addons/libs/stats.module.js";

// import { GUI } from "three/addons/libs/lil-gui.module.min.js";

// function Check() {
//   const container = useRef(null);
//   let stats;
//   let camera, scene, renderer;
//   let controls, water, sun, mesh;

//   // animate();

//   useEffect(() => {
//     const canvas = container.current;
//     const renderer = new THREE.WebGL1Renderer({
//       canvas,
//       antialias: true,
//       alpha: true,
//     });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setClearColor(0x000000, 0.0);
//     renderer.setSize(window.innerWidth, window.innerHeight);

//     renderer.autoClear = false;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     let clock = new THREE.Clock();

//     scene = new THREE.Scene();

//     camera = new THREE.PerspectiveCamera(
//       55,
//       window.innerWidth / window.innerHeight,
//       1,
//       20000
//     );
//     camera.position.set(30, 30, 100);

//     sun = new THREE.Vector3();

//     const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

//     water = new Water(waterGeometry, {
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

//     const geometry = new THREE.BoxGeometry(30, 30, 30);
//     const material = new THREE.MeshStandardMaterial({ roughness: 0 });

//     mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);

//     controls = new OrbitControls(camera, renderer.domElement);
//     controls.maxPolarAngle = Math.PI * 0.495;
//     controls.target.set(0, 10, 0);
//     controls.minDistance = 40.0;
//     controls.maxDistance = 200.0;

//     //

//     stats = new Stats();
//     stats.showPanel(0);
//     document.body.appendChild(stats.dom);

//     // GUI
//     const gui = new GUI();

//     const folderSky = gui.addFolder("Sky");
//     folderSky.add(parameters, "elevation", 0, 90, 0.1).onChange(updateSun);
//     folderSky.add(parameters, "azimuth", -180, 180, 0.1).onChange(updateSun);
//     folderSky.open();

//     const waterUniforms = water.material.uniforms;

//     const folderWater = gui.addFolder("Water");
//     folderWater
//       .add(waterUniforms.distortionScale, "value", 0, 8, 0.1)
//       .name("distortionScale");
//     folderWater.add(waterUniforms.size, "value", 0.1, 10, 0.1).name("size");
//     folderWater.open();

//     //

//     function render() {
//       stats.update();
//       const delta = clock.getDelta();

//       water.material.uniforms["time"].value += 1.0 / 60.0;
//       renderer.render(scene, camera);
//       requestAnimationFrame(render);
//     }
//     requestAnimationFrame(render);
//     function handleResize() {
//       const { innerWidth, innerHeight } = window;
//       renderer.setSize(innerWidth, innerHeight);
//       camera.aspect = innerWidth / innerHeight;
//       camera.updateProjectionMatrix();
//     }
//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       document.body.removeChild(stats.dom);
//       renderer.dispose();
//       //   scene.dispose();
//     };
//   }, []);

//   return <canvas id="container" ref={container}></canvas>;
// }

// export default Check;


import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "three/addons/objects/Water.js";
import { Sky } from "three/addons/objects/Sky.js";
import Stats from "three/addons/libs/stats.module.js";

import { GUI } from "three/addons/libs/lil-gui.module.min.js";

function Check() {
  const canvasRef = useRef(null);
  useEffect(() => {
    let container, stats;
    let camera, scene, renderer;
    let controls, water, sun, mesh;

    init();
    animate();

    function init() {
      container = document.getElementById("container");

      //

      renderer = new THREE.WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      container.appendChild(renderer.domElement);

      //

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        1,
        20000
      );
      camera.position.set(30, 30, 100);

      //

      sun = new THREE.Vector3();

      // Water

      const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

      water = new Water(waterGeometry, {
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

      // Skybox

      const sky = new Sky();
      sky.scale.setScalar(10000);
      scene.add(sky);

      const skyUniforms = sky.material.uniforms;

      skyUniforms["turbidity"].value = 10;
      skyUniforms["rayleigh"].value = 2;
      skyUniforms["mieCoefficient"].value = 0.005;
      skyUniforms["mieDirectionalG"].value = 0.8;

      const parameters = {
        elevation: 2,
        azimuth: 180,
      };

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      let renderTarget;

      function updateSun() {
        const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        const theta = THREE.MathUtils.degToRad(parameters.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        sky.material.uniforms["sunPosition"].value.copy(sun);
        water.material.uniforms["sunDirection"].value.copy(sun).normalize();

        if (renderTarget !== undefined) renderTarget.dispose();

        renderTarget = pmremGenerator.fromScene(sky);

        scene.environment = renderTarget.texture;
      }

      updateSun();

      //

      const geometry = new THREE.BoxGeometry(30, 30, 30);
      const material = new THREE.MeshStandardMaterial({ roughness: 0 });

      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      //

      controls = new OrbitControls(camera, renderer.domElement);
      controls.maxPolarAngle = Math.PI * 0.495;
      controls.target.set(0, 10, 0);
      controls.minDistance = 40.0;
      controls.maxDistance = 200.0;
      controls.update();

      //

      stats = new Stats();
      container.appendChild(stats.dom);

      // GUI

      const gui = new GUI();

      const folderSky = gui.addFolder("Sky");
      folderSky.add(parameters, "elevation", 0, 90, 0.1).onChange(updateSun);
      folderSky.add(parameters, "azimuth", -180, 180, 0.1).onChange(updateSun);
      folderSky.open();

      const waterUniforms = water.material.uniforms;

      const folderWater = gui.addFolder("Water");
      folderWater
        .add(waterUniforms.distortionScale, "value", 0, 8, 0.1)
        .name("distortionScale");
      folderWater.add(waterUniforms.size, "value", 0.1, 10, 0.1).name("size");
      folderWater.open();

      //

      window.addEventListener("resize", onWindowResize);
    }

    function animate() {
    //   requestAnimationFrame(animate);
      render();
    }
    
    function render() {
        stats.update();
      const time = performance.now() * 0.001;

      mesh.position.y = Math.sin(time) * 20 + 5;
      mesh.rotation.x = time * 0.5;
      mesh.rotation.z = time * 0.51;

      water.material.uniforms["time"].value += 1.0 / 60.0;

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }, []);

  return (
    <>
      <div id="container"></div>
    </>
  );
}

export default Check;
