import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";

function Eleventh() {
  const eleventhRef = useRef(null);
  let mixer = null;
  let clipAction = null;
  let currentAnimationTime = 0;
  useEffect(() => {
    const canvas = eleventhRef.current;

    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let clock = new THREE.Clock();
    const renderer = new THREE.WebGL1Renderer({ canvas, antialias: true });
    renderer.setSize(screen.width - 15, screen.height);
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("white");
    const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 100);
    // camera.position.z = 10;
    camera.position.set(1, 4, 15);

    scene.add(camera);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.minPolarAngle = Math.PI / 2.5;
    controls.maxPolarAngle = Math.PI / 2.3;
    // controls.minDistance = 15;
    // controls.maxDistance = 16;

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("floor.jpg");
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      color: "grey",
      side: THREE.DoubleSide,
    });

    material.roughness = 1;

    let planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeFlorr = new THREE.Mesh(planeGeometry, material);
    // planeFlorr.receiveShadow = true;
    // planeFlorr.castShadow = false;
    planeFlorr.rotation.x = -Math.PI * 0.5;
    planeFlorr.position.y = -0.65;
    planeFlorr.rotation.z = -Math.PI / 4;

    scene.add(planeFlorr);

    const loader = new GLTFLoader();
    loader.load("RobotExpressive.glb", (gltf) => {
      console.log(gltf);
      const root = gltf.scene;
      //   root.castShadow = true;
      root.position.y = -0.6;
      root.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      mixer = new THREE.AnimationMixer(root);
      const clipAction = mixer.clipAction(gltf.animations[2]);
      clipAction.play();
      scene.add(root);
    });

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
    hemiLight.position.set(0, 20, 0);
    // hemiLight.castShadow = true;
    scene.add(hemiLight);

    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(0, 3, 2);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 10;
    directionalLight.shadow.camera.far = 25;
    directionalLight.shadow.camera.left = -5;
    directionalLight.shadow.camera.right = 5;
    directionalLight.shadow.camera.top = 5;
    directionalLight.shadow.camera.bottom = -5;
    directionalLight.shadow.bias = -0.001;
    directionalLight.shadow.radius = 4;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.target = planeFlorr;

    scene.add(directionalLight);

    function render() {
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }

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
    };
  }, []);



  return <canvas ref={eleventhRef} tabIndex="0" >Eleventh</canvas>;
}

export default Eleventh;
