import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

function TestingBg() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();
  let cubeCamera, cubeRenderTarget, material;
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 40;
    scene.rotation.y = 0.5;
    scene.add(camera);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("black");
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.autoRotate = true;

    const photo = new THREE.TextureLoader();
    const sphereGalaxy = photo.load("astr5.jpg");
    const spherehelp = photo.load("astr5help.jpg");
    const object1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 32, 32),
      new THREE.MeshBasicMaterial({
        map: sphereGalaxy,
        depthWrite: true,
      })
    );
    object1.position.y = -7;
    object1.position.z = -1;
    object1.scale.set(11, 11, 11);

    scene.add(object1);

    // const loaders = new GLTFLoader();
    // loaders.load("Stylized_Kitchen.glb", (gltf) => {
    //   const rock = gltf.scene;
    //   // rock.position.y = -1.1;
    //   // rock.position.z = -0.8;
    //   // rock.rotation.x = 0.15;
    //   rock.scale.set(4, 4, 4);

    //   scene.add(rock);
    // });

    new RGBELoader().load("quarry_01_1k.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      scene.background = texture;
      scene.environment = texture;

      cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
      cubeRenderTarget.texture.type = THREE.HalfFloatType;

      cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
      material = new THREE.MeshStandardMaterial({
        envMap: cubeRenderTarget.texture,
        roughness: 0.05,
        metalness: 1,
      });
    });

    const loader = new GLTFLoader();
    let mixer = null;

    const ambientLight = new THREE.AmbientLight("#fff", 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(-10, 10, 10);
    scene.add(directionalLight);

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      controls.update();
      if (cubeCamera) {
        cubeCamera.update(renderer, scene);
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
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}

export default TestingBg;
