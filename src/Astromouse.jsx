import { render } from "@testing-library/react";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";

function Astromouse() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();

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
      const root = gltf.scene;
      root.position.y = -0.4;
      root.position.z = -1;
      // root.rotation.y = -Math.PI / 2;
      if (animations && animations.length) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        const animationAction = mixer.clipAction(animations[0]);
        animationAction.setLoop(THREE.LoopRepeat);
        animationAction.play();
        mixer.timeScale = 0.9;
      }
      const skeleton = gltf.scene.getObjectByName("Head_039");
      // skeleton.rotation.y = 1
      console.log(skeleton);

      const transformControls = new TransformControls(
        camera,
        renderer.domElement
      );
      // transformControls.attach(root);
      // scene.add(transformControls);
      transformControls.attach(gltf.scene);

      scene.add(gltf.scene);

      canvasRef.current.addEventListener("mousemove", (event) => {
        const mouse = new THREE.Vector2(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const direction = raycaster.ray.direction;

        // Update head bone rotation
        const headBone = skeleton.getObjectByName("Head_039");
        const rotationY = -Math.atan(-direction.x);
        const rotationX = -Math.asin(direction.y);
        console.log(rotationX, rotationY);

        headBone.rotation.set(rotationX, rotationY, 0);
        
      });
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
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}

export default Astromouse;
