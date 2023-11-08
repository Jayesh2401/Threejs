import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import TWEEN from "tween.js";
import { gsap } from "gsap";

function Thememind() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();
  let root, cartoon;
  let helloTrue = 0;
  let previousTimestamp = 0;
  let isScrolling = false;
  let isElementCreated = false;
  let imageDiv = null;
  let imageDiv2 = null;
  let span = null;
  let span2 = null;

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 40;
    camera.position.y = -11;
    // scene.rotation.y = 0.5;
    scene.add(camera);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("black");
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // const controls = new OrbitControls(camera, canvasRef.current);
    // controls.enableDamping = true;
    // controls.autoRotate = true;

    const textureLoader = new THREE.TextureLoader();
    const cubeTexture = textureLoader.load("test2.png");
    const cuberight = textureLoader.load("test1.jpg");
    const cubeleft = textureLoader.load("test3.jpg");
    const cubestaright = textureLoader.load("test4.jpg");
    const cubefloor = textureLoader.load("rush-2203494_960_720.jpg");
    const cubeMaterial = [
      new THREE.MeshBasicMaterial({ map: cuberight, side: THREE.BackSide }), // Right side
      new THREE.MeshBasicMaterial({ map: cubestaright, side: THREE.BackSide }), // Left side
      new THREE.MeshBasicMaterial({ map: cubeTexture, side: THREE.BackSide }), // Top side
      new THREE.MeshBasicMaterial({ map: cubefloor, side: THREE.BackSide }), // Bottom side
      new THREE.MeshBasicMaterial({ map: cubeTexture, side: THREE.BackSide }), // Front side
      new THREE.MeshBasicMaterial({ map: cubeleft, side: THREE.BackSide }), // Back side
    ];

    const cubeGeometry = new THREE.BoxGeometry(70, 55, 50);
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    const loader = new GLTFLoader();
    let mixer = null;
    let mixer1 = null;

    loader.load("adventure_boy/scene.gltf", (gltf) => {
      const animations = gltf.animations;
      root = gltf.scene;
      //   root.position.y = -15.4;
      root.position.x = 8;
      root.position.z = 30;
      root.rotation.y = -Math.PI / 2;
      if (animations && animations.length) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        const animationAction = mixer.clipAction(animations[0]);
        animationAction.setLoop(THREE.LoopRepeat);
        animationAction.play();
        mixer.timeScale = 0.9;
      }
      scene.add(gltf.scene);

      const initialPosition = { y: 0 };
      const targetPosition = { y: -15.4 };
      const duration = 3000; // 3 seconds

      const tween = new TWEEN.Tween(initialPosition)
        .to(targetPosition, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          root.position.y = initialPosition.y;
        })
        .start();
    });

    loader.load("schoolboy.glb", (gltf) => {
      const animations = gltf.animations;
      cartoon = gltf.scene;
      //   cartoon.scale.set(2, 2, 2);
      cartoon.scale.set(0.6, 0.6, 0.6);
      //   cartoon.position.y = -15.4;
      cartoon.position.x = -8;
      cartoon.position.z = 30;
      cartoon.rotation.y = Math.PI / 2;

      if (animations && animations.length) {
        mixer1 = new THREE.AnimationMixer(gltf.scene);
        const animationAction = mixer1.clipAction(animations[0]);
        animationAction.setLoop(THREE.LoopRepeat);
        animationAction.play();
        mixer1.timeScale = 0.5;
      }
      scene.add(gltf.scene);

      const initialPosition = { y: 0 };
      const targetPosition = { y: -15.4 };
      const duration = 3000; // 3 seconds

      const tween = new TWEEN.Tween(initialPosition)
        .to(targetPosition, duration)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          cartoon.position.y = initialPosition.y;
        })
        .start();
    });

    const handleMouseWheel = (event) => {
      const delta = Math.sign(event.deltaY);
      const currentTimestamp = performance.now();
      const timeElapsed = currentTimestamp - previousTimestamp;
      previousTimestamp = currentTimestamp;

      const speed = delta / timeElapsed;

      const opacityChange = 0.05 * delta;
      const positionChange = 0.1 * delta;

      if (root.position.x > 2) {
        root.position.x -= positionChange;
        cartoon.position.x += positionChange;
        // console.log(root.position.x, cartoon.position.x);
        isScrolling = true;
      }

      if (root.position.x < 2.1) {
        const imageName = "board.png";
        if (imageName === "board.png" && !isElementCreated) {
          imageDiv = document.createElement("div");
          const image = document.createElement("img");
          image.src = "board.png";
          image.style.width = "100%";
          imageDiv.appendChild(image);
          imageDiv.style.position = "relative";
          imageDiv.style.display = "inline-block";
          imageDiv.style.top = "48%";
          imageDiv.style.left = "62%";
          imageDiv.style.width = "225px";
          imageDiv.style.height = "165px";
          imageDiv.style.transform = "translate(-48%, -338%)";

          span = document.createElement("span");
          span.textContent = "";
          span.style.position = "absolute";
          span.style.top = "50%";
          span.style.left = "50%";
          span.style.transform = "translate(-50%, -90%)";
          imageDiv.appendChild(span);

          document.body.appendChild(imageDiv);

          imageDiv2 = document.createElement("div");
          const image2 = document.createElement("img");
          image2.src = "board.png";
          image2.style.width = "100%";
          image2.style.transform = "scaleX(-1)";

          imageDiv2.appendChild(image2);
          imageDiv2.style.position = "relative";
          imageDiv2.style.display = "inline-block";
          imageDiv2.style.top = "35%";
          imageDiv2.style.left = "31%";
          imageDiv2.style.width = "225px";
          imageDiv2.style.height = "165px";
          imageDiv2.style.transform = "translateY(-580px)";

          span2 = document.createElement("span");
          span2.textContent = "";
          span2.style.position = "absolute";
          span2.style.top = "45%";
          span2.style.left = "50%";
          span2.style.transform = "translate(-50%, -90%)";
          imageDiv2.appendChild(span2);
          // document.body.appendChild(imageDiv2);

          isElementCreated = true;
          const text = "Hello";
          const text2 = "bolo";
          let currentIndex = 0;

          const typeWriter = () => {
            if (currentIndex < text.length && helloTrue < 1) {
              span.textContent += text[currentIndex];
              currentIndex++;
              gsap.delayedCall(0.15, typeWriter);
              if (currentIndex === 5) {
                helloTrue = 1;
                console.log(helloTrue);
                currentIndex = 0;
              }
            }
          };

          typeWriter();
        }
      }

      if (root.position.x > 2.1 && isElementCreated && imageDiv) {
        
        document.body.removeChild(imageDiv);
        document.body.removeChild(imageDiv2);
        isElementCreated = false;
        imageDiv = null;
      }

      if (root.position.x < 2.01) {
        root.position.x += positionChange;
        cartoon.position.x -= positionChange;
        console.log(root.position.x, cartoon.position.x);
        isScrolling = true;
      }

      setTimeout(() => {
        isScrolling = false;
      }, 200);
    };

    window.addEventListener("keyup", (event) => {
      console.log(root.position.x < 2.1001);
      if (event.code === "Enter" && root.position.x < 2.1001) {
        helloTrue++;
        handleChat();
        // console.log(helloTrue);
      }
    });

    const handleChat = () => {
      switch (helloTrue) {
        case 2:
          const text2 = "bolo";
          document.body.removeChild(imageDiv);
          document.body.appendChild(imageDiv2);
          mainWriter(span2, text2, 2);
          break;
        case 3:
          const text3 = "kuch ni";
          document.body.removeChild(imageDiv2);
          document.body.appendChild(imageDiv);
          mainWriter(span, text3, 2);
          break;
        case 4:
          const text4 = "Tumse na hopayega";
          document.body.removeChild(imageDiv);
          document.body.appendChild(imageDiv2);
          mainWriter(span2, text4, 2);
          break;

        default:
          console.log("came");
          break;
      }
    };
    const mainWriter = (span, text, value) => {
      let mainIndex = 0;
      span.textContent = "";
      const typeWriter = () => {
        if (mainIndex < text.length) {
          span.textContent += text[mainIndex];
          mainIndex++;
          gsap.delayedCall(0.15, typeWriter);
        }
      };
      typeWriter();
    };

    window.addEventListener("wheel", handleMouseWheel);

    const ambientLight = new THREE.AmbientLight("#fff", 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(-10, 10, 10);
    scene.add(directionalLight);

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      //   controls.update();
      TWEEN.update();

      if (mixer && isScrolling) {
        mixer.update(delta);
        mixer1.update(delta);
      }
      if (mixer1 && isScrolling) {
        mixer1.update(delta);
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

export default Thememind;
