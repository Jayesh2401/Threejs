import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function Astro() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();
  let root;
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 4;
    scene.add(camera);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      //   alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("black");

    // const controls = new OrbitControls(camera, canvasRef.current);
    // controls.enableDamping = true;

    const photo = new THREE.TextureLoader();
    const sphereGalaxy = photo.load("astr5.jpg");
    const spherehelp = photo.load("astr5help.jpg");
    const object1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 32, 32),
      new THREE.MeshBasicMaterial({
        map: sphereGalaxy,
        depthWrite: true,
        transparent: true, // Make the material transparent
        opacity: 0, //
        // alphaMap: spherehelp,
        // aoMap:spherehelp
        // aoMapIntensity:spherehelp
      })
    );
    object1.position.y = -7;
    object1.position.z = -1;
    object1.scale.set(11, 11, 11);

    scene.add(object1);

    const loader = new GLTFLoader();
    let mixer = null;

    loader.load("moon.glb", (gltf) => {
      const animations = gltf.animations;
      root = gltf.scene;
      root.position.y = -0.4;
      root.position.x = 5;
      root.position.z = -1;
      root.rotation.y = -Math.PI / 2;
      if (animations && animations.length) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        const animationAction = mixer.clipAction(animations[0]);
        animationAction.setLoop(THREE.LoopRepeat);
        animationAction.play();
        mixer.timeScale = 0.9;
      }
      scene.add(gltf.scene);
    });

    const ambientLight = new THREE.AmbientLight("#fff", 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(-10, 10, 10);
    scene.add(directionalLight);

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      object1.rotation.z += 0.005;

      // controls.update();
      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);
    let previousTimestamp = 0;

    const handleMouseWheel = (event) => {
      const delta = Math.sign(event.deltaY);
      const currentTimestamp = performance.now();
      const timeElapsed = currentTimestamp - previousTimestamp;
      previousTimestamp = currentTimestamp;

      // Calculate the speed based on the time elapsed and wheel delta
      const speed = delta / timeElapsed;
      console.log(delta, speed);

      const opacityChange = 0.05 * delta;
      const positionChange = 0.1 * delta;

      // if (root.position.x > 0) {
      root.position.x -= positionChange;
      // }
      object1.material.opacity += opacityChange;

      object1.material.opacity = THREE.MathUtils.clamp(
        object1.material.opacity,
        0,
        1
      );
    };

    window.addEventListener("wheel", handleMouseWheel);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.addEventListener("wheel", handleMouseWheel);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}

export default Astro;
