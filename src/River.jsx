import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TweenMax } from "gsap";
import Stats from "stats.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { BloomPass } from "three/examples/jsm/postprocessing/BloomPass.js";
import { gsap } from "gsap";

function River() {
  const riverRef = useRef(null);
  let camera, scene, renderer;
  let controls, water, sun, mesh;
  let particleSystem, mixer, bird, fish, line, star;

  useEffect(() => {
    const canvas = riverRef.current;
    let intervalId;
    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    let clock = new THREE.Clock();
    const renderer = new THREE.WebGL1Renderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0.0);
    renderer.autoClear = false;

    // const gpuMemoryUsage = renderer.info.memory.gpu;
    // console.log(`GPU memory usage: ${renderer}`);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setSize(screen.width, screen.height);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("purple");
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.set(30, 20, 100);
    scene.add(camera);

    sun = new THREE.Vector3(0, 0, 0);

    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.minPolarAngle = Math.PI / 2.5;
    controls.maxPolarAngle = Math.PI / 2.3;
    controls.minDistance = 100;
    controls.maxDistance = 150;

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
      sunColor: "red",
      waterColor: "Plum",
      distortionScale: 3.7,
      fog: scene.fog !== undefined,
    });

    water.rotation.x = -Math.PI / 2;

    scene.add(water);

    const sky = new Sky();
    sky.scale.setScalar(20000);

    scene.add(sky);

    const skyUniforms = sky.material.uniforms;

    skyUniforms["turbidity"].value = 15;
    skyUniforms["rayleigh"].value = 2;
    skyUniforms["mieCoefficient"].value = 0.001;
    skyUniforms["mieDirectionalG"].value = 0.5;

    const parameters = {
      elevation: 3,
      azimuth: 200,
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
    const textureLoader = new THREE.TextureLoader();
    const loader = new GLTFLoader();
    loader.load("cloud_test.glb", (gltf) => {
      //   console.log(gltf);
      const root = gltf.scene;
      root.position.y = 350;
      root.position.x = 10;
      root.position.z = -1500;
      root.scale.set(30, 10, 5);
      scene.add(root);
    });
    loader.load("cloud_test.glb", (gltf) => {
      //   console.log(gltf);
      const root = gltf.scene;
      root.position.y = 350;
      root.position.x = -1500;
      root.position.z = -1500;
      root.scale.set(30, 10, 5);
      scene.add(root);
    });
    loader.load("cloud_test.glb", (gltf) => {
      //   console.log(gltf);
      const root = gltf.scene;
      root.position.y = 300;
      root.position.x = -900;
      root.position.z = -1500;
      root.scale.set(10, 5, 5);
      scene.add(root);
    });
    loader.load("cloud_test.glb", (gltf) => {
      //   console.log(gltf);
      const root = gltf.scene;
      root.position.y = 170;
      root.position.x = 700;
      root.position.z = -1500;
      root.scale.set(80, 50, 5);
      scene.add(root);
    });

    loader.load("cloud_test.glb", (gltf) => {
      //   console.log(gltf);
      const root = gltf.scene;
      root.position.y = 120;
      root.position.x = -700;
      root.position.z = -1500;
      root.scale.set(40, 25, 5);
      scene.add(root);
    });

    // loader.load("fluffy_cloud.glb", (gltf) => {
    //   //   console.log(gltf);
    //   const root = gltf.scene;
    //   root.position.y = 100;
    //   root.position.x = 400;
    //   root.position.z = -1500;
    //   root.scale.set(500, 500, 50);
    //   TweenMax.to(root.position, 35, {
    //     x: -1600,
    //     y: 50,
    //     z: -1500,
    //     ease: "ease",
    //     // repeat: -1,
    //     // yoyo: true,
    //   });

    // scene.add(root);
    // });

    loader.load("boat.glb", (gltf) => {
      //   console.log(gltf);
      const root = gltf.scene;
      root.position.x = -500;
      root.position.y = -1;
      root.position.z = -400;
      root.rotation.y = Math.PI / 4;
      root.scale.set(0.1, 0.1, 0.1);
      const duration = 40; // seconds
      const startX = -500;
      const endX = 200;
      const startY = -1;
      const endY = -1;
      const startZ = -400;
      const endZ = -100;

      // Animate the boat
      TweenMax.to(root.position, duration, {
        x: endX,
        y: endY,
        z: endZ,
        ease: "ease",
        repeat: -1,
        yoyo: true,
      });

      scene.add(root);
    });

    loader.load("ship.glb", (gltf) => {
      //   console.log(gltf);
      const root = gltf.scene;
      root.position.x = 100;
      root.position.y = -76;
      root.position.z = -500;
      root.rotation.y = Math.PI / 6;
      root.scale.set(5, 5, 5);
      const duration = 50; // seconds
      // const startX = -500;
      const endX = -400;
      // const startY = -1;
      const endY = -76;
      // const startZ = -400;
      const endZ = -100;

      // // Animate the boat
      TweenMax.to(root.position, duration, {
        x: endX,
        y: endY,
        z: endZ,
        ease: "linear",
        repeat: -1,
        yoyo: true,
      });

      scene.add(root);
    });

    loader.load("the_fish_particle.glb", (gltf) => {
        console.log(gltf);
      const root = gltf.scene;

      root.rotation.y = Math.PI / 6;

      fish = new THREE.AnimationMixer(root);
      const clipAction = fish.clipAction(gltf.animations[0]);
      clipAction.play();
      clipAction.timeScale = 0.4;

      root.scale.set(50, 0.1, 50);
      const duration = 50; // seconds
      // const startX = -500;
      const endX = -400;
      // const startY = -1;
      const endY = -76;
      // const startZ = -400;
      const endZ = -100;

      // // Animate the boat
      // TweenMax.to(root.position, duration, {
      //   x: endX,
      //   y: endY,
      //   z: endZ,
      //   ease: "linear",
      //   repeat: -1,
      //   yoyo: true,
      // });

      scene.add(root);
    });

    loader.load("birds.glb", (gltf) => {
      //   console.log(gltf);
      const root = gltf.scene;
      root.position.y = 120;
      root.position.z = 10;

      // root.rotation.y = Math.PI / 6;

        mixer = new THREE.AnimationMixer(root);
        const clipAction = mixer.clipAction(gltf.animations[0]);
        clipAction.play();
      root.scale.set(50, 0.1, 50);
      const duration = 35; // seconds
      // const startX = -500;
      const endX = 200;
      // const startY = -1;
      const endY = 76;
      // const startZ = -400;
      const endZ = -1500;

      // Animate the boat
      TweenMax.to(root.position, duration, {
        x: endX,
        y: endY,
        z: endZ,
        ease: "linear",
        // repeat: -1,
        // yoyo: true,
      });

      scene.add(root);
    });

    loader.load("white_eagle_animation_fast_fly.glb", (gltf) => {
      // console.log(gltf);
      const root = gltf.scene;
      root.position.x = 700;
      root.position.y = 120;
      root.position.z = -800;
      root.rotation.x = Math.PI * 2;
      root.rotation.y = Math.PI;

      bird = new THREE.AnimationMixer(root);
      const clipAction = bird.clipAction(gltf.animations[0]);
      clipAction.timeScale = 0.4;
      clipAction.play();
      root.scale.set(1, 1, 1);
      const duration = 20; // seconds
      // const startX = -500;
      const endX = -1900;
      // const startY = -1;
      const endY = 250;
      // const startZ = -400;
      const endZ = -900;

      // // Animate the boat
      TweenMax.to(root.position, duration, {
        x: endX,
        y: endY,
        z: endZ,
        ease: "linear",
        // repeat: -1,
        // yoyo: true,
      });

      scene.add(root);
    });

    const directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    // const positions = [];
    // const numStars = 50;
    // const radius = 50;
    // for (let i = 0; i < numStars; i++) {
    //   const x = Math.random() * radius * 2 - radius;
    //   const y = Math.random() * radius * 2 - radius;
    //   const z = Math.random() * radius * 2 - radius;
    //   positions.push(x, y, z);
    // }

    // // create a new geometry for the stars
    // const geometry = new THREE.BufferGeometry();
    // geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    // // create a new material for the stars
    // const material = new THREE.PointsMaterial({
    //   size: 20,
    //   sizeAttenuation: false,
    //   color: 0xffffff,
    //   map: new THREE.TextureLoader().load("star.png"),
    //   alphaTest: 0.5,
    //   transparent: true,
    //   depthWrite: false,
    // });

    // // create new points with point lights attached to them
    // const stars = new THREE.Points(geometry, material);
    // positions.forEach((_, index) => {
    //   const pointLight = new THREE.PointLight(0xffffff, 0.5, 1000);
    //   pointLight.position.set(positions[index], positions[index + 1], positions[index + 2]);
    //   stars.add(pointLight);
    // });

    // // add the stars to the scene
    // scene.add(stars);

    // const stars = [];

    // // Create a geometry for the star
    // const starGeometry = new THREE.BufferGeometry().setFromPoints([
    //   new THREE.Vector3(0, 0, 0),
    //   new THREE.Vector3(0, 0, 5),
    //   new THREE.Vector3(0, 0, 0),
    //   new THREE.Vector3(5, 0, 0),
    //   new THREE.Vector3(0, 0, 0),
    //   new THREE.Vector3(-5, 0, 0),
    //   new THREE.Vector3(0, 0, 0),
    //   new THREE.Vector3(0, 5, 0),
    //   new THREE.Vector3(0, 0, 0),
    //   new THREE.Vector3(0, -5, 0),
    // ]);

    // // Create a material for the star
    // const starMaterial = new THREE.LineBasicMaterial({ color: "gold" });

    // // Create 50 stars and add them to the scene
    // for (let i = 0; i < 50; i++) {
    //   // Generate a random position for the star
    //   const x = Math.random() * 2000 - 1000;
    //   const y = Math.random() * 2000 - 1000;
    //   const z = Math.random() * 2000 - 1000;

    //   // Create a new star object and set its position
    //   const star = new THREE.Line(starGeometry, starMaterial);
    //   star.position.set(0, 20, 1);

    //   // Add the star to the scene and the array
    //   scene.add(star);
    //   stars.push(star);
    // }

    // const pointLight = new THREE.PointLight(0xffffff, 10, 10);
    // pointLight.position.set(0, -100, 0);
    // scene.add(pointLight);
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, 4);
    // scene.add(pointLightHelper);

    // const lights = [];
    // const positionRange = {
    //   min: new THREE.Vector3(-1500, 160, -1200),
    //   max: new THREE.Vector3(500, 200, -1000),
    // };

    // for (let i = 0; i < 100; i++) {
    //   const color = new THREE.Color("yellow");
    //   const intensity = Math.random() * 2 + 1;
    //   const distance = Math.random() * 200 + 100;
    //   const light = new THREE.PointLight(color, intensity, distance);
    //   const position = getRandomPosition(positionRange.min, positionRange.max);
    //   light.position.copy(position);
    //   scene.add(light);
    //   lights.push(light);
    //   const pointLightHelper = new THREE.PointLightHelper(light);
    //   scene.add(pointLightHelper);
    // }

    // function getRandomPosition(min, max) {
    //   const x = Math.random() * 10 * (max.x - min.x) + min.x;
    //   const y = Math.random() * (max.y - min.y) + min.y;
    //   const z = Math.random() * 10 * (max.z - min.z) + min.z;
    //   return new THREE.Vector3(x, y, z);
    // }

    // function getRandomColor() {
    //   const colors = ["#FF4136", "#FF851B", "#FFDC00", "#2ECC40", "#FFFFFF"];
    //   return colors[Math.floor(Math.random() * colors.length)];
    // }

    // const sphereGeometry = new THREE.SphereGeometry(1, 1, 1);
    // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    // const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // sphere.position.set(0, 100, -500)
    // const pointLight = new THREE.PointLight(0xffffff, 50, 50);
    // pointLight.position.set(0, 100, -500);

    // const glowMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xffff00,
    //   transparent: true,
    //   opacity: 0.8,
    //   blending: THREE.AdditiveBlending,
    // });

    // const glowGeometry = new THREE.SphereGeometry(1,1,1);
    // const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    // glowMesh.position.set(0, 100, -500);

    // scene.add(sphere);
    // sphere.add(pointLight);
    // sphere.add(glowMesh);

    const pointLight = new THREE.PointLight("yellow", 2, 50, 100);
    pointLight.position.set(-1000, 200, -1000);
    scene.add(pointLight);

    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    scene.add(pointLightHelper);

    // ...

    const composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);
    const finalPass = new BloomPass(
      1, // strength
      25, // kernel size
      4, // sigma ?
      2560 // blur render target resolution
    );
    finalPass.renderToScreen = true;
    composer.addPass(finalPass);
    //    const positionRange = {
    //   min: new THREE.Vector3(-1500, 160, -1200),
    //   max: new THREE.Vector3(500, 200, -1000),
    // };
    const positionRange = {
      min: new THREE.Vector3(-1500, 120, -1200),
      max: new THREE.Vector3(500, 240, 800),
    };

    // Add 50 stars with glowing and shiny effect
    const starGeometry = new THREE.SphereGeometry(1, 24, 24);
    const starMaterial = new THREE.MeshBasicMaterial({
      color: "white",
      // emissive: "yellow",
      // emissiveIntensity: 1,
      transparent: true,
      opacity: 1,
    });
    // bloomPass.strength = 3;
    // bloomPass.radius = 1;
    // bloomPass.threshold = 0.9;
    const starGlowMaterial = new THREE.MeshBasicMaterial({
      color: "white",
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const starShinyMaterial = new THREE.MeshBasicMaterial({
      color: "black",
      transparent: true,
      opacity: 1,
      // blending: THREE.AdditiveBlending,
    });
    const starGroup = new THREE.Group();
    for (let i = 0; i < 100; i++) {
      const star = new THREE.Mesh(starGeometry, starMaterial);
      const starGlow = new THREE.Mesh(starGeometry, starGlowMaterial);
      star.scale.setScalar(0.1);
      starGlow.scale.setScalar(1);

      // star.position.set(Math.random() * 100 - 50, Math.random() * 100, Math.random() * 100 );
      // console.log(  Math.max(Math.min(Math.random() * (positionRange.max.x - positionRange.min.x) + positionRange.min.x, positionRange.max.x), positionRange.min.x),
      // Math.max(Math.min(Math.random() * (positionRange.max.y - positionRange.min.y) + positionRange.min.y, positionRange.max.y), positionRange.min.y),
      // Math.max(Math.min(Math.random() * (positionRange.max.z - positionRange.min.z) + positionRange.min.z, positionRange.max.z), positionRange.min.z))
      star.position.set(
        Math.max(
          Math.min(
            Math.random() * (positionRange.max.x - positionRange.min.x) +
              positionRange.min.x,
            positionRange.max.x
          ),
          positionRange.min.x
        ),
        Math.max(
          Math.min(
            Math.random() * (positionRange.max.y - positionRange.min.y) +
              positionRange.min.y,
            positionRange.max.y
          ),
          positionRange.min.y
        ),
        Math.max(
          Math.min(
            Math.random() * (positionRange.max.z - positionRange.min.z) +
              positionRange.min.z,
            positionRange.max.z
          ),
          positionRange.min.z
        )
      );
      starGlow.scale.setScalar(2);
      starGlow.position.copy(star.position);
      starGroup.add(star);
      starGroup.add(starGlow);
    }
    scene.add(starGroup);

    // let shinyIndex = -1;

    // // Add a white shiny effect to a randomly chosen star every second
    // setInterval(() => {
    //   // Set the material of the previous shiny star back to the glow material
    //   if (shinyIndex !== -1) {
    //     starGroup.children[shinyIndex].material = starGlowMaterial;
    //   }

    //   // Choose a new random index for the next shiny star
    //   const randomIndex = Math.floor(Math.random() * 50);

    //   // Set the material of the new shiny star to the shiny material
    //   starGroup.children[randomIndex].material = starShinyMaterial;

    //   // Update the shiny index
    //   shinyIndex = randomIndex;
    // }, 500);

    let shinyIndices = new Set();

    // Add a white shiny effect to 5 randomly chosen stars every second
    setInterval(() => {
      // Set the material of the previous shiny stars back to the glow material
      shinyIndices.forEach((index) => {
        starGroup.children[index].material = starGlowMaterial;
      });

      // Choose 5 new random indices for the next shiny stars
      shinyIndices.clear();
      while (shinyIndices.size < 25) {
        const randomIndex = Math.floor(Math.random() * 50);
        shinyIndices.add(randomIndex);
      }

      // Set the material of the new shiny stars to the shiny material
      shinyIndices.forEach((index) => {
        starGroup.children[index].material = starShinyMaterial;
      });
    }, 1500);

    // const fogColor = "#9b4dff";
    // const fogNear = 10;
    // const fogFar = 100;
    // scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);

    // const renderScene = new RenderPass(scene, camera);
    // const bloomPass = new UnrealBloomPass(
    //   new THREE.Vector2(window.innerWidth, window.innerHeight),
    //   1.5,
    //   0.4,
    //   0.85
    // );
    // bloomPass.threshold = 0;
    // bloomPass.strength = 2; //intensity of glow
    // bloomPass.radius = 0;
    // const bloomComposer = new EffectComposer(renderer);
    // bloomComposer.setSize(window.innerWidth, window.innerHeight);
    // bloomComposer.renderToScreen = true;
    // bloomComposer.addPass(renderScene);
    // bloomComposer.addPass(bloomPass);
    // const color = new THREE.Color("#FDB813");
    // const geometry = new THREE.IcosahedronGeometry(15, 15);
    // const material = new THREE.MeshBasicMaterial({ color: color });
    // const sphere = new THREE.Mesh(geometry, material);
    // sphere.position.set(0, 10, 10);
    // sphere.layers.set(1);
    // scene.add(sphere);
    // const ambientlight = new THREE.AmbientLight(0xffffff, 0.1);
    // scene.add(ambientlight);

    // function createStar(){
    //   const geometrys = new THREE.SphereGeometry(0.5, 10.5, 16);
    //   const materials = new THREE.MeshBasicMaterial({ color: 0xffffff });
    //   const spheres = new THREE.Mesh(geometrys, materials);

    //   const pointLightss = new THREE.PointLight(0xffffff, 0, 0);
    //   pointLightss.position.set(100, 80, -100);

    //   const glowMaterials = new THREE.MeshBasicMaterial({
    //     color: "black",
    //     transparent: true,
    //     opacity: 0.0,
    //     blending: THREE.AdditiveBlending,
    //   });

    //   const glowGeometrys = new THREE.SphereGeometry(0.5, 10.5, 16);
    //   const glowMeshs = new THREE.Mesh(glowGeometrys, glowMaterials);
    //   glowMeshs.position.set(100, 80, -200);

    //   scene.add(spheres);
    //   // spheres.add(pointLightss);
    //   spheres.add(glowMeshs);

    //   gsap.to([glowMeshs.position], {
    //     duration: 5,
    //     x: -200,
    //     y: -5,
    //     z: -500,
    //     ease: "linear",
    //     scale: 1.2,
    //     onComplete: () => {
    //       scene.remove(spheres);
    //       spheres.remove(glowMeshs);
    //       renderer.dispose();
        // },
    //   });
    // }

    // let count = 0;
    // intervalId = setInterval(() => {
    //   if (count === 5) {
    //     clearInterval(intervalId);
    //     return;
    //   }
    //   createStar();
    //   count++;
    // }, 3000);

    function render() {
      stats.update();
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      if (bird) {
        bird.update(delta);
      }
      if (fish) {
        fish.update(delta);
      }
      water.material.uniforms["time"].value += 1.0 / 60.0;
      renderer.render(scene, camera);
      // camera.layers.set(1);
      // bloomComposer.render();
      //   for (let i = 0; i < lights.length; i++) {
      //     const light = lights[i];
      //     light.power = Math.random() * 10 + 10;
      //   }
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
      //   scene.dispose();
    };
  }, []);

  return <canvas ref={riverRef} className="riverRef"></canvas>;
}

export default River;
