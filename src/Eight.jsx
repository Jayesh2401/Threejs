import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function Eigth() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();

  useEffect(() => {
    let animationId;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(window.innerWidth - 20, window.innerHeight);
    const gui = new dat.GUI();
    const fov = 40;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 50, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color("skyblue");
    // const loader = new THREE.TextureLoader();

    const loader = new GLTFLoader();
    let mixer = null;

    loader.load(
      "simplebg.glb",
      function (gltf) {
        const animations = gltf.animations;
        if (animations && animations.length) {
          // Create a new AnimationMixer object and play the animation
          mixer = new THREE.AnimationMixer(gltf.scene);
          const animationAction = mixer.clipAction(animations[0]);
          animationAction.setLoop(THREE.LoopRepeat);
        //   animationAction.play();
        //   mixer.timeScale = 0.9;
        }
        scene.add(gltf.scene);
        const center = new THREE.Vector3();

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(center.x, center.y, center.z);
        controls.update();
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    // loader.load("scene.gltf", (gltf) => {
    //     console.log(gltf)
    //     const background = gltf.scene;
    //     background.position.set(0, 0, 0);
    //     background.scale.set(100, 10, 10);
    //     scene.background = background;
    //   });

    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);

    const objects = [];

    const sphereGeometry = new THREE.SphereGeometry(1, 6, 6);

    const solarSystem = new THREE.Object3D();
    scene.add(solarSystem);
    objects.push(solarSystem);

    const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5);
    solarSystem.add(sunMesh);
    objects.push(sunMesh);

    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.x = 10;
    solarSystem.add(earthOrbit);
    objects.push(earthOrbit);

    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244,
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthOrbit.add(earthMesh);
    objects.push(earthMesh);

    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);

    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x222222,
    });
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonOrbit.add(moonMesh);
    objects.push(moonMesh);

    class AxisGridHelper {
      constructor(node, units = 10) {
        const axes = new THREE.AxesHelper();
        axes.material.depthTest = false;
        axes.renderOrder = 2; // after the grid
        node.add(axes);

        const grid = new THREE.GridHelper(units, units);
        grid.material.depthTest = false;
        grid.renderOrder = 1;
        node.add(grid);

        this.grid = grid;
        this.axes = axes;
        this.visible = false;
      }
      get visible() {
        return this._visible;
      }
      set visible(v) {
        this._visible = v;
        this.grid.visible = v;
        this.axes.visible = v;
      }
    }

    function makeAxisGrid(node, label, units) {
      const helper = new AxisGridHelper(node, units);
      gui.add(helper, "visible").name(label);
    }

    makeAxisGrid(solarSystem, "solarSystem", 26);
    makeAxisGrid(sunMesh, "sunMesh");
    makeAxisGrid(earthOrbit, "earthOrbit");
    makeAxisGrid(earthMesh, "earthMesh");
    makeAxisGrid(moonOrbit, "moonOrbit");
    makeAxisGrid(moonMesh, "moonMesh");

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

    function render(time) {
      time *= 0.001; // convert to seconds;

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }

      objects.forEach((obj) => {
        obj.rotation.y = time;
      });

      earthOrbit.rotation.y = time * 0.5;
      moonOrbit.rotation.y = time * 0.2;

      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);

    }
    render();

    return () => {
      gui.destroy();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

export default Eigth;
