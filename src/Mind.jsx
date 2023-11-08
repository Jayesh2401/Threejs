import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import { PointLightHelper } from "three";

function Mind() {
  const mindRef = useRef(null);
  let scene, camera, renderer, geometryBox, cube, controls;
  let material = [
    new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide }),
    new THREE.MeshBasicMaterial({ color: 0x00ff00, visible: false }),
    new THREE.MeshBasicMaterial({ color: 0x0000ff, visible: false }),
    new THREE.MeshStandardMaterial({
      color: "white",
      side: THREE.DoubleSide,
      metalness: 1,
      roughness: 0,
    }),
    new THREE.MeshBasicMaterial({ color: 0xff00ff, visible: false }),
    new THREE.MeshBasicMaterial({ color: "red", side: THREE.DoubleSide }),
  ];

  let materialsmall = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    new THREE.MeshBasicMaterial({ color: 0xffff00 }),
    new THREE.MeshBasicMaterial({ color: 0xff00ff }),
    new THREE.MeshBasicMaterial({ color: 0x00ffff }),
  ];

  useEffect(() => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("black");
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 15;

    renderer = new THREE.WebGLRenderer({
      canvas: mindRef.current,
      antialias: true,
      alpha:true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const light = new THREE.PointLight("white", 100000, 100);
    light.position.set(-1, 20, -20);
    scene.add(light);

    const pointLightHelper = new THREE.PointLightHelper(light, 1);
    scene.add(pointLightHelper);

    geometryBox = new THREE.BoxGeometry(10, 10, 10);

    cube = new THREE.Mesh(geometryBox, material);
    cube.rotation.y = 0.5;
    // cube.rotation.x = 0.8
    scene.add(cube);
    controls = new OrbitControls(camera, mindRef.current);

    const childCubeGeomtry = new THREE.BoxGeometry();
    const smallCube = new THREE.Mesh(childCubeGeomtry, materialsmall);
    smallCube.position.y = -4
    smallCube.rotation.x = 1
    smallCube.rotation.y = 1
    cube.add(smallCube);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);
  }, []);

  return (
    <div>
      <canvas ref={mindRef}></canvas>
    </div>
  );
}

export default Mind;
