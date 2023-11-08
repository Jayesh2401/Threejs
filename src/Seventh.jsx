import React, { useRef, useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import * as dat from "dat.gui";

function Seventh() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth - 15, window.innerHeight);

    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 3;
    // camera.position.z = 10;
    // camera.position.y = 10;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("skyblue");

    const color = 0xffffff;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(2, 2, 0);
    light.castShadow = true;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 10;
    light.shadow.camera.left = -20;
    light.shadow.camera.right = 20;
    light.shadow.camera.top = 20;
    light.shadow.camera.bottom = -20;
    light.shadow.mapSize.width = 2048 + 2048;
    light.shadow.mapSize.height = 2048 + 2048;
    light.shadow.bias = -0.1;
    light.shadow.camera.color = "lightgrey";

    scene.add(light);
    const helper = new THREE.DirectionalLightHelper(light, 5);
    scene.add(helper);

    const diitCamera = new THREE.CameraHelper(light.shadow.camera);
    scene.add(diitCamera);

    const gui = new dat.GUI();

    const lightFolder = gui.addFolder("Light");
    lightFolder.open();

    const lightPosition = {
      x: light.position.x,
      y: light.position.y,
      z: light.position.z,
    };
    lightFolder
      .add(lightPosition, "x", -10, 10)
      .step(0.1)
      .onChange(() => {
        light.position.x = lightPosition.x;
      });
    lightFolder
      .add(lightPosition, "y", -10, 10)
      .step(0.1)
      .onChange(() => {
        light.position.y = lightPosition.y;
      });
    lightFolder
      .add(lightPosition, "z", -10, 10)
      .step(0.1)
      .onChange(() => {
        light.position.z = lightPosition.z;
      });

    const floorFolder = gui.addFolder("Floor");
    floorFolder.open();

    const floorSize = { width: 11, height: 11 };
    // floorSize.side = THREE.DoubleSide
    floorFolder
      .add(floorSize, "width", 1, 200)
      .step(1)
      .onChange(() => {
        planeGeometry.dispose();
        planeGeometry = new THREE.PlaneGeometry(
          floorSize.width,
          floorSize.height
        );
        planeMesh.geometry = planeGeometry;
      });
    floorFolder
      .add(floorSize, "height", 1, 200)
      .step(1)
      .onChange(() => {
        planeGeometry.dispose();
        planeGeometry = new THREE.PlaneGeometry(
          floorSize.width,
          floorSize.height
        );
        planeMesh.geometry = planeGeometry;
      });

    const floorPosition = { x: 0, y: -1, z: 0 };
    floorFolder
      .add(floorPosition, "x", -10, 10)
      .step(0.1)
      .onChange(() => {
        planeMesh.position.x = floorPosition.x;
      });
    floorFolder
      .add(floorPosition, "y", -10, 10)
      .step(0.1)
      .onChange(() => {
        planeMesh.position.y = floorPosition.y;
      });
    floorFolder
      .add(floorPosition, "z", -10, 10)
      .step(0.1)
      .onChange(() => {
        planeMesh.position.z = floorPosition.z;
      });

    const floorRotation = { x: 0, y: 0, z: 0 };
    floorFolder
      .add(floorRotation, "x", -Math.PI, Math.PI)
      .step(0.01)
      .onChange(() => {
        planeMesh.rotation.x = floorRotation.x;
      });
    floorFolder
      .add(floorRotation, "y", -Math.PI, Math.PI)
      .step(0.01)
      .onChange(() => {
        planeMesh.rotation.y = floorRotation.y;
      });
    floorFolder
      .add(floorRotation, "z", -Math.PI, Math.PI)
      .step(0.01)
      .onChange(() => {
        planeMesh.rotation.z = floorRotation.z;
      });

    let planeGeometry = new THREE.PlaneGeometry(
      floorSize.width,
      floorSize.height
    );
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });

    const planeShadowMaterial = new THREE.ShadowMaterial({
      // side: THREE.DoubleSide,
    });
    planeShadowMaterial.opacity = 0.5;
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.castShadow = true;
    planeMesh.receiveShadow = true;
    planeMesh.shadowMaterial = planeShadowMaterial;
    // planeMesh.position.y = -1;
    planeMesh.position.y = floorPosition.y;
    planeMesh.frustumCulled = false;
    planeMesh.rotation.x = -Math.PI / 2;
    // planeMesh.rotation.x = -Math.PI * 0.5;
    scene.add(planeMesh);

    const boxWidth = 0.5;
    const boxHeight = 0.5;
    const boxDepth = 0.5;
    const geometry = new THREE.BoxGeometry(
      boxWidth,
      boxHeight,
      boxDepth,
      4,
      4,
      4
    );

    const colors = ["darkviolet", "grey", "green", "yellow", "blue", "orange"];
    const materials = [];

    for (let i = 0; i < 6; i++) {
      const material = new THREE.MeshPhongMaterial({ color: colors[i] });
      materials.push(material);
    }
    // const material = new THREE.MeshPhongMaterial({ color: "black" });
    const center = new THREE.Vector3();

    const cube = new THREE.Mesh(geometry, materials);
    cube.castShadow = true;
    cube.position.y = -0.5;
    let step = 0;
    let speed = 0.01;
    scene.add(cube);

    const circleFolder = gui.addFolder("Circle");
    circleFolder.open();

    // Circle segment width control
    const circleSegmentsWidth = { segmentsWidth: 24 };
    circleFolder
      .add(circleSegmentsWidth, "segmentsWidth", 3, 48, 1)
      .onChange(() => {
        circleGeometry.dispose();
        circleGeometry = new THREE.CircleGeometry(
          1,
          circleSegmentsWidth.segmentsWidth,
          Math.PI * 0.82,
          Math.PI * 1.46
        );
        circleModal.geometry.dispose();
        circleModal.geometry = circleGeometry;
      });

    // Circle segment height control
    const circleSegmentsHeight = { segmentsHeight: 1 };
    circleFolder
      .add(circleSegmentsHeight, "segmentsHeight", 1, 48, 1)
      .onChange(() => {
        circleGeometry.dispose();
        circleGeometry = new THREE.CircleGeometry(
          1,
          circleSegmentsWidth.segmentsWidth,
          Math.PI * 0.82,
          Math.PI * 1.46,
          undefined,
          0,
          (Math.PI / 2) * (1 - circleSegmentsHeight.segmentsHeight / 48)
        );
        circleModal.geometry.dispose();
        circleModal.material = circleMaterial.clone();
        circleModal.material.color.setHex(0xfff000);
        circleModal.geometry.dispose();

        circleModal.geometry = circleGeometry;
      });

    // Circle position controls
    const circlePosition = { x: -3, y: 0, z: 0 };
    circleFolder.add(circlePosition, "x", -10, 10).onChange(() => {
      circleModal.position.x = circlePosition.x;
    });
    circleFolder.add(circlePosition, "y", -10, 10).onChange(() => {
      circleModal.position.y = circlePosition.y;
    });
    circleFolder.add(circlePosition, "z", -10, 10).onChange(() => {
      circleModal.position.z = circlePosition.z;
    });

  

    let circleGeometry = new THREE.CircleGeometry(
      1,
      24,
      Math.PI * 0.82,
      Math.PI * 1.46
    );
    const circleMaterial = new THREE.MeshBasicMaterial({
      color: "lightBlue",
      side: THREE.DoubleSide,
      // roughness: 0.5,
      // metalness: 0.5,
    });
    const circleModal = new THREE.Mesh(circleGeometry, circleMaterial);
    circleModal.position.x = -3;
    circleModal.castShadow = true;
    circleModal.receiveShadow = false;
    scene.add(circleModal);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(center.x, center.y, center.z);
    controls.update();

    function render(time) {
      time *= 0.001;
      step += speed;
      cube.position.y = -0.5 * Math.abs(Math.sin(step));
      //   cube.rotation.x = time;
      //   cube.rotation.y = time;

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, []);

  return <canvas ref={canvasRef} />;
}
export default Seventh;
