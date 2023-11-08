import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";

function GLTFLoaderDemo() {
  const canvasRef = useRef(null);
  const [animation, setAnimation] = useState(0);
  // const [mixer, setMixer] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  let clock = new THREE.Clock();

  function setupGui(camera, controls) {
    const gui = new dat.GUI();

    const cameraFolder = gui.addFolder("Camera");
    cameraFolder.add(camera.position, "x", -50, 50).step(0.1);
    // cameraFolder.add(camera.position, 'y', 0, 50).step(0.1);
    cameraFolder
      .add(camera.position, "y", 0, 50)
      .step(0.1)
      .onChange(() => {
        camera.position.y = Math.max(0, camera.position.y); // clamp to positive values
      });
    cameraFolder.add(camera.position, "z", -50, 50).step(0.1);
    // cameraFolder.add(camera, 'fov', 1, 10).onChange(() => {
    //     camera.updateProjectionMatrix();
    //   });

    const controlsFolder = gui.addFolder("Controls");
    controlsFolder.add(controls, "autoRotate");
    controlsFolder.add(controls, "autoRotateSpeed", 0, 10).step(0.1);
    controlsFolder.add(controls, "enableDamping");
    controlsFolder.add(controls, "dampingFactor", 0, 1).step(0.01);
    controlsFolder.add(controls, "enableZoom");
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(window.innerWidth - 15, window.innerHeight);

    const fov = 40;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 10;
    camera.fov = 10;
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(10, 50, 50);
    controls.update();

    // setupGui(camera, controls);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("black");

    {
      const planeSize = 40;

      const loader = new THREE.TextureLoader();
      const texture = loader.load(
        "https://threejs.org/examples/textures/uv_grid_opengl.jpg"
      );
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.magFilter = THREE.NearestFilter;
      const repeats = planeSize / 2;
      texture.repeat.set(repeats, repeats);

      const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
      const planeMat = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(planeGeo, planeMat);
      mesh.rotation.x = Math.PI * -0.5;
      scene.add(mesh);
    }

    {
      const skyColor = 0xb1e1ff; // light blue
      const groundColor = 0xb97a20; // brownish orange
      const intensity = 0.6;
      const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
      scene.add(light);
    }

    {
      const color = 0xffffff;
      const intensity = 0.8;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(5, 10, 2);
      scene.add(light);
      scene.add(light.target);
    }

    function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
      const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
      const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
      const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
      // compute a unit vector that points in the direction the camera is now
      // in the xz plane from the center of the box
      const direction = new THREE.Vector3()
        .subVectors(camera.position, boxCenter)
        .multiply(new THREE.Vector3(1, 0, 1))
        .normalize();

      // move the camera to a position distance units way from the center
      // in whatever direction the camera was from the center already
      camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

      // pick some near and far values for the frustum that
      // will contain the box.
      camera.near = boxSize / 100;
      camera.far = boxSize * 100;
      camera.updateProjectionMatrix();

      // point the camera to look at the center of the box
      camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
    }

    let mixer = null;
    {
      const loader = new GLTFLoader();

      loader.load(
        "https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb",
        (gltf) => {
          console.log(gltf);
          const root = gltf.scene;
          const animations = gltf.animations;
          if (animations && animations.length) {
            // Create a new AnimationMixer object and play the animation
            mixer = new THREE.AnimationMixer(gltf.scene);
            const animationAction = mixer.clipAction(animations[animation]);
            animationAction.setLoop(THREE.LoopRepeat);
            animationAction.play();
            // mixer.timeScale = 0.9;
          }
          scene.add(root);

          // compute the box that contains the model
          const box = new THREE.Box3().setFromObject(root);

          const boxSize = box.getSize(new THREE.Vector3()).length();
          const boxCenter = box.getCenter(new THREE.Vector3());

          // set the camera to frame the model
          frameArea(boxSize * 0.5, boxSize, boxCenter, camera);

          // update the controls to handle the new camera limits
          controls.maxDistance = boxSize * 25;
          controls.target.copy(boxCenter);
          controls.update();
        },
        // Log the progress of the loading process
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        undefined,
        (error) => {
          console.error(error);
        }
      );
    }

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }

    function render() {
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }, [animation]);

  const handleDirection = (e) => {
    console.log(e, "first");
    switch (e) {
      case 119:
        setAnimation(10);
        break;
      case 32:
        setAnimation(11);
        break;
      case 100:
        setAnimation(1);
        break;
      case 97:
        setAnimation(5);
        break;
      case 116:
        setAnimation(9);
        break;
      case 115:
        setAnimation(13);
        break;
      default:
        console.log(e);

        break;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      tabIndex="0"
      onKeyPress={(e) => handleDirection(e.charCode)}
      onKeyUp={(e) => setAnimation(0)}
    />
  );
}

export default GLTFLoaderDemo;
