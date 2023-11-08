import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

function Sixth() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("grey");

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const loader = new GLTFLoader();
    let mixer = null;

    loader.load(
      "phoenix_bird.glb",
      // "iron-man_mark_85__rigged.glb",
      (gltf) => {
        // console.log(gltf)
        const animations = gltf.animations;
        if (animations && animations.length) {
          // Create a new AnimationMixer object and play the animation
          mixer = new THREE.AnimationMixer(gltf.scene);
          const animationAction = mixer.clipAction(animations[0]);
          animationAction.setLoop(THREE.LoopRepeat);
          animationAction.play();
          mixer.timeScale = 0.9;
        }

        gltf.scene.add(new THREE.AmbientLight("#fff", 0.8))

        scene.add(gltf.scene);

        // const renderScene = new THREE.RenderPass(scene, camera);
        // const effectComposer = new THREE.EffectComposer(renderer);
        // effectComposer.addPass(renderScene);
        // const glowPass = new THREE.GlitchPass(1);
        // effectComposer.addPass(glowPass);

        // const raycaster = new THREE.Raycaster();
        // const mouse = new THREE.Vector2();
        // const onKeyDown = (event) => {
        //   if (event.key === " ") {
        //     // Pause animation on spacebar press
        //     if (mixer) {
        //       mixer.paused = !mixer.paused;
        //     }
        //   }
        // };

        // window.addEventListener("keydown", onKeyDown);
        // const onMouseMove = (event) => {
        //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        // };
        // window.addEventListener("mousemove", onMouseMove);
        // const animateRays = () => {
        //   raycaster.setFromCamera(mouse, camera);
        //   const intersects = raycaster.intersectObjects(scene.children, true);
        //   for (let i = 0; i < intersects.length; i++) {
        //     const intersect = intersects[i];
        //     intersect.object.material.emissive.set(0xff0000);
        //   }
        //   renderer.render(scene, camera);
        //   effectComposer.render();
        //   requestAnimationFrame(animateRays);
        // };
        // animateRays();

        // const auraGeometry = new THREE.SphereGeometry(50, 32, 32);
        // const auraMaterial = new THREE.MeshBasicMaterial({
        //   color: "#ffffff",
        //   blending: THREE.AdditiveBlending,
        //   transparent: true,
        //   opacity: 0.2,
        // });
        // const auraMesh = new THREE.Mesh(auraGeometry, auraMaterial);
        // auraMesh.position.set(0, 0, 0);
        // scene.add(auraMesh);

        // Position the camera to frame the model
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = new THREE.Vector3();
        box.getCenter(center);
        camera.position.set(center.x + 200, center.y, -box.max.z - 200);

        // Add OrbitControls for user interaction
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(center.x, center.y, center.z);
        controls.update();
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );

    // Add ambient light
    const ambientLight = new THREE.AmbientLight("#fff", 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight("white", 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Render the scene
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef} />;
}

export default Sixth;
