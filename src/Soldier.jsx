import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";
import { TweenMax } from "gsap";
import Stats from "stats.js";
import { gsap } from "gsap";

function Soldier() {
  const eleventhRef = useRef(null);
  const [keys, setKeys] = useState({});
  let mixer = null;

  let clipAction, clips, modal;
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
    renderer.setSize(screen.width - 15, screen.height);
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
    const texture = textureLoader.load("bbb.png");
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      color: "grey",
      side: THREE.DoubleSide,
    });

    material.roughness = 1;

    let planeGeometry = new THREE.PlaneGeometry(25, 25);
    const planeFlorr = new THREE.Mesh(planeGeometry, material);
    planeFlorr.rotation.x = -Math.PI * 0.5;
    // planeFlorr.rotation.z = -Math.PI * 0.5;
    planeFlorr.position.y = -0.65;

    scene.add(planeFlorr);

    const loader = new GLTFLoader();
    loader.load("Soldier.glb", (gltf) => {
      console.log(gltf);
      const root = gltf.scene;
      modal = gltf.scene;
      root.scale.set(2, 2, 2);
      root.rotation.y = Math.PI;
      root.position.y = -0.6;
      root.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      mixer = new THREE.AnimationMixer(root);
      clipAction = mixer.clipAction(gltf.animations[0]);
      clips = {
        idle: mixer.clipAction(gltf.animations[0]),
        run: mixer.clipAction(gltf.animations[1]),
        tpose: mixer.clipAction(gltf.animations[2]),
        walk: mixer.clipAction(gltf.animations[3]),
      };
      // window.onload() = clips.idle.play();
      scene.add(root);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },);

    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.9);
    hemiLight.position.set(50, 200, 0);
    scene.add(hemiLight);

    const directionalLight = new THREE.DirectionalLight("white", 1.2);
    directionalLight.position.set(1, 25, 10);
    scene.add(directionalLight);

    function render() {
      stats.update();

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
      document.body.removeChild(stats.dom);
      renderer.dispose();
    };
  }, []);

  //   useEffect(() => {}, []);
  // setKeys((prevState) => ({
  //   ...prevState,
  //   [event.key]: true,
  // }));
  let isJumping = false;
  let jumpTimer;
  const handleKeys = (event) => {
    console.log(event);
    switch (event) {
      case 87:
        modal.rotation.y = Math.PI;
        modal.position.z += 0.1;
        clips.run.play();
        clips.idle.stop();
        clips.tpose.stop();
        clips.walk.stop();
        break;
      case 65:
        modal.rotation.y = Math.PI / 2;
        modal.position.x -= 0.1;
        clips.run.play();
        clips.idle.stop();
        clips.tpose.stop();
        clips.walk.stop();
        break;
      case 68:
        modal.rotation.y = -Math.PI / 2;
        modal.position.x += 0.1;
        clips.run.play();
        clips.idle.stop();
        clips.tpose.stop();
        clips.walk.stop();
        break;
      case 83:
        modal.rotation.y = Math.PI * 2;
        modal.position.z -= 0.1;
        clips.run.play();
        clips.idle.stop();
        clips.tpose.stop();
        clips.walk.stop();
        break;
      case 81:
        // modal.rotation.y = Math.PI * 2;
        modal.position.z += 0.1;
        modal.position.x -= 0.05;
        clips.run.stop();
        clips.idle.stop();
        clips.tpose.stop();
        clips.walk.play();
        break;
      case 32:
        if(modal.position.y >=2){
          modal.position.y = 0
        }
        if (!isJumping) {
          isJumping = true;
          // modal.rotation.y = Math.PI * 2;
          const jumpHeight = 2; // set the jump height
          const jumpDuration = 0.5; // set the duration of the jump animation
          const jumpEase = "power2.out"; // set the easing of the jump animation
          gsap.to(modal.position, {
            y: modal.position.y + jumpHeight,
            duration: jumpDuration / 2,
            ease: jumpEase,
            onComplete: () => {
              gsap.to(modal.position, {
                y: modal.position.y - jumpHeight,
                duration: jumpDuration / 2,
                ease: jumpEase,
                onComplete: () => {
                  isJumping = false;
                  if(modal.position.y >= 1){
                    modal.position.y = 0
                  }
                },
              });
            },
          });
          jumpTimer = setTimeout(() => {
            isJumping = false;
          }, 10000);
        }
        break;
      case 1232:
        clips.idle.play();
        clips.run.stop();
        clips.tpose.stop();
        clips.walk.stop();
        break;
      default:
        break;
    }
  };
  const resetJumpTimer = () => {
    clearTimeout(jumpTimer);
    isJumping = false;
  };

  return (
    <canvas
      ref={eleventhRef}
      tabIndex="0"
      onKeyDown={(e) => handleKeys(e.keyCode)}
      onKeyUp={(event) => {
        handleKeys(1232);
        resetJumpTimer();
      }}
    >
      Eleventh
    </canvas>
  );
}

export default Soldier;
