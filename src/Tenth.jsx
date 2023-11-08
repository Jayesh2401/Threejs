import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function Tenth() {
  const tenthRef = useRef(null);

  useEffect(() => {
    const canvas = tenthRef.current;
    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    let clock = new THREE.Clock();

    const renderer = new THREE.WebGL1Renderer({ canvas });
    renderer.setSize(screen.width - 15, screen.height);
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color("black");

    const camera = new THREE.PerspectiveCamera(50, 2, 0.1, 100);
    camera.position.z = 5;
    scene.add(camera);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.minPolarAngle = Math.PI / 2.5;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 5;
    controls.maxDistance = 10;

    const ambientLight = new THREE.AmbientLight();
    ambientLight.color = new THREE.Color("violet");
    ambientLight.intensity = 0.1;
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("violet", 0.5);
    directionalLight.position.set(1, 0.35, -0.8);
    scene.add(directionalLight);

    // Hemisphere light
    const hemisphereLight = new THREE.HemisphereLight("white", 0x0000ff, 0.5);
    scene.add(hemisphereLight);

    const pointLight = new THREE.PointLight(0xff9000, 0.5, 50, 1);
    // pointLight.position.set(1, -0.5, 1);
    scene.add(pointLight);

    const rectAreaLight = new THREE.RectAreaLight("red", 2, 2, 2);
    rectAreaLight.position.set(-1.5, 5, 1.5);
    rectAreaLight.lookAt(new THREE.Vector3());
    scene.add(rectAreaLight);

    const spotLight = new THREE.SpotLight(
      0x78ff00,
      0.5,
      10,
      Math.PI * 0.1,
      0.25,
      1
    );
    spotLight.position.set(0, 1, 3);
    // scene.add(spotLight);

    spotLight.target.position.x = -2.75;
    scene.add(spotLight.target);

    const material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
    });
    material.roughness = 0.4;

    let planeGeometry = new THREE.PlaneGeometry(20, 20);

    const planeFlorr = new THREE.Mesh(planeGeometry, material);
    planeFlorr.rotation.x = -Math.PI * 0.5;
    planeFlorr.position.y = -0.65;

    // Objects
    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 32, 32),
      material
    );
    sphere.position.x = -1.5;

    const cube = new THREE.Mesh(
      new THREE.BoxBufferGeometry(0.75, 0.75, 0.75),
      material
    );
    cube.position.z = 0.6;

    const torus = new THREE.Mesh(
      new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64),
      material
    );
    torus.position.x = 1.5;
    planeFlorr.add(cube);

    scene.add(torus, sphere, planeFlorr);

    function render() {
      const elapsedTime = clock.getElapsedTime();
      sphere.rotation.y = 0.2 * elapsedTime;
      cube.rotation.y = 0.2 * elapsedTime;
      torus.rotation.y = 0.2 * elapsedTime;

      sphere.rotation.x = 0.2 * elapsedTime;
      cube.rotation.x = 0.2 * elapsedTime;
      torus.rotation.x = 0.2 * elapsedTime;

      const radius = 4;
      const xPos = radius * Math.sin(elapsedTime);
      const zPos = radius * Math.cos(elapsedTime);
        pointLight.position.set(xPos, 1.5, zPos);
      controls.update();

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, []);

  return <canvas ref={tenthRef} />;
}

export default Tenth;
