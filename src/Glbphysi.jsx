import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";
import { TweenMax } from "gsap";
import * as CANNON from "cannon-es";
import Stats from "stats.js";
import CannonDebugger from "cannon-es-debugger";
import { gsap } from "gsap";

function Glbphysi() {
  const eleventhRef = useRef(null);
  let mixer = null;

  let clipAction,
    clips,
    modal,
    robotBoxGeometry,
    robotBoxSize,
    robotBoxShape,
    robotBody;
  let currentAnimationTime = 0;
  useEffect(() => {
    const canvas = eleventhRef.current;
    eleventhRef.current.focus();
    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let clock = new THREE.Clock();
    const renderer = new THREE.WebGL1Renderer({ canvas, antialias: true });
    renderer.setSize(screen.width, screen.height);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("grey");
    const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 100);
    camera.position.set(1, 4, 15);

    scene.add(camera);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.minPolarAngle = Math.PI / 2.5;
    controls.maxPolarAngle = Math.PI / 2.3;

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("aa.jpg");
    texture.minFilter = THREE.LinearFilter;
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      color: "grey",
      side: THREE.DoubleSide,
    });

    material.roughness = 1;

    let planeGeometry = new THREE.PlaneGeometry(25, 25);
    const planeFlorr = new THREE.Mesh(planeGeometry, material);
    planeFlorr.rotation.x = -Math.PI * 0.5;

    scene.add(planeFlorr);

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshStandardMaterial({ color: "red" });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    // box.position.set(2, 0.5, 0);
    scene.add(box);

    const physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      mass: 0,
      // infinte geometric plane
      shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    physicsWorld.addBody(groundBody);

    const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    const boxBody = new CANNON.Body({ mass: 0.5, shape: boxShape });
    boxBody.position.set(3, 0.5, 0);
    physicsWorld.addBody(boxBody);

    const loader = new GLTFLoader();
    loader.load("RobotExpressive.glb", (gltf) => {
      console.log(gltf);
      const root = gltf.scene;
      modal = gltf.scene;
      root.scale.set(0.7, 0.7, 0.7);
      const robotBoxSize = new CANNON.Box(new CANNON.Vec3(0.7, 0.7, 0.7));

      robotBody = new CANNON.Body({
        mass: 10,
        // shape: robotBoxSize,
      });
      robotBody.addShape(new CANNON.Sphere(0.5), new CANNON.Vec3(0, 2.5, 0.4));
      robotBody.addShape(new CANNON.Box(new CANNON.Vec3(0, 0, 0)));
      robotBody.addShape(
        new CANNON.Cylinder(0.5, 0.5, 0.8),
        new CANNON.Vec3(0, 0.9, 0)
      );
      robotBody.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0, 0.5)));
    //   const robotCylinderRadius = 0.1; // radius of the cylinders
    //   const robotCylinderHeight = 1.5; // height of the cylinders
    //   const robotArmOffset = 0.5; // offset for positioning the arms from the body

      // Create left arm
    //   const leftArmShape = new CANNON.Cylinder(
    //     robotCylinderRadius,
    //     robotCylinderRadius,
    //     robotCylinderHeight
    //   );
    //   const leftArmPosition = new CANNON.Vec3(-0.5, 1, 0); // position relative to body
    //   const leftArmQuaternion = new CANNON.Quaternion(0,0,0); // quaternion for rotation of the arm if needed
    //   robotBody.addShape(leftArmShape, leftArmPosition, leftArmQuaternion);

      root.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

    //   robotBody.position.set(0, 0.701, 0);

      physicsWorld.addBody(robotBody);

      mixer = new THREE.AnimationMixer(root);
      clipAction = mixer.clipAction(gltf.animations[0]);
      clips = {
        dance: mixer.clipAction(gltf.animations[0]),
        death: mixer.clipAction(gltf.animations[1]),
        idle: mixer.clipAction(gltf.animations[2]),
        jump: mixer.clipAction(gltf.animations[3]),
        no: mixer.clipAction(gltf.animations[4]),
        punch: mixer.clipAction(gltf.animations[5]),
        running: mixer.clipAction(gltf.animations[6]),
        sitting: mixer.clipAction(gltf.animations[7]),
        standing: mixer.clipAction(gltf.animations[8]),
        thumbup: mixer.clipAction(gltf.animations[9]),
        walking: mixer.clipAction(gltf.animations[10]),
        walkjump: mixer.clipAction(gltf.animations[11]),
        wave: mixer.clipAction(gltf.animations[12]),
        yes: mixer.clipAction(gltf.animations[13]),
      };

      //   clips.walking.play();
      scene.add(root);
    });

    const updateBoxMesh = () => {
      box.position.copy(boxBody.position);
      box.quaternion.copy(boxBody.quaternion);
    };

    const updateRobotMesh = () => {
      modal.position.copy(robotBody.position);
      modal.quaternion.copy(robotBody.quaternion);
    };

    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.9);
    hemiLight.position.set(50, 200, 0);
    scene.add(hemiLight);

    const directionalLight = new THREE.DirectionalLight("white", 1.2);
    directionalLight.position.set(1, 25, 10);
    scene.add(directionalLight);

    const keys = {
      a: {
        pressed: false,
      },
      d: {
        pressed: false,
      },
      s: {
        pressed: false,
      },
      w: {
        pressed: false,
      },
    };

    window.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "KeyA":
          keys.a.pressed = true;
          break;
        case "KeyD":
          keys.d.pressed = true;
          break;
        case "KeyS":
          keys.s.pressed = true;
          break;
        case "KeyW":
          keys.w.pressed = true;
          break;
        case "KeyQ":
          robotBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(-1, 0, 0),
            Math.PI * 0.5
          );
          break;
        case "Space":
          robotBody.position.y = 2.5;
          updateRobotMesh();
          setTimeout(() => {
            // robotBody.position.y = 0;
          }, 1000);
          break;
      }
    });

    window.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "KeyA":
          keys.a.pressed = false;
          clips.walking.stop();
          break;
        case "KeyD":
          keys.d.pressed = false;
          clips.walking.stop();

          break;
        case "KeyS":
          keys.s.pressed = false;
          clips.walking.stop();

          break;
        case "KeyW":
          keys.w.pressed = false;
          clips.walking.stop();

          break;
        case "Space":
          //   robotBody.position.y = 0;
          break;
      }
    });

    const cannonDebugger = new CannonDebugger(scene, physicsWorld, {
      color: "lightblue",
    });

    function render() {
      stats.update();
      cannonDebugger.update();
      physicsWorld.step(1 / 60);
      updateBoxMesh();
      if (modal !== undefined) updateRobotMesh();
      if (keys.a.pressed) {
        robotBody.position.x -= 0.05;
        clips.walking.play();
        updateRobotMesh();
      } else if (keys.d.pressed) {
        robotBody.position.x += 0.05;
        clips.walking.play();
        updateRobotMesh();
      }

      if (keys.s.pressed) {
        robotBody.position.z += 0.05;
        clips.walking.play();

        updateRobotMesh();
      } else if (keys.w.pressed) {
        robotBody.position.z -= 0.05;
        clips.walking.play();
        updateRobotMesh();
      }

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
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.removeChild(stats.dom);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={eleventhRef} tabIndex="0"></canvas>;
}

export default Glbphysi;
