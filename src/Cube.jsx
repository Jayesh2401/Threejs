import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";
import * as dat from "dat.gui";

function Cube() {
  const cubeRef = useRef(null);

  useEffect(() => {
    const canvas = cubeRef.current;
    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const renderer = new THREE.WebGL1Renderer({ canvas, antialias: true });
    renderer.setSize(screen.width, screen.height);
    const scene = new THREE.Scene();
    //   scene.background = new THREE.Color("grey");
    const camera = new THREE.PerspectiveCamera(
      55,
      screen.width / screen.height,
      0.1,
      700
    );
    camera.position.set(0, 0.1, -2);
    camera.rotation.y = Math.PI / 2;
    scene.add(camera);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    // controls.minPolarAngle = Math.PI / 2.5;
    // controls.maxPolarAngle = Math.PI / 2.3;
    // controls.minDistance = 500;
    // controls.maxDistance = 1500;

    let materialArray = [];
    let texture_ft = new THREE.TextureLoader().load("bbb.png");
    let texture_bk = new THREE.TextureLoader().load(
      "diego-ph-BCuxVP5WEsU-unsplash.jpg"
    );
    let texture_up = new THREE.TextureLoader().load("ff.jpg");
    let texture_dn = new THREE.TextureLoader().load("floor.jpg");
    let texture_rt = new THREE.TextureLoader().load("logo192.png");
    let texture_lf = new THREE.TextureLoader().load("aa.jpg");

    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
    materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

    for (let i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide;

    let skyboxGeo = new THREE.BoxGeometry(10, 10, 10);
    let skybox = new THREE.Mesh(skyboxGeo, materialArray);
    scene.add(skybox);

    function render() {
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, []);

  return <canvas ref={cubeRef}>Cube</canvas>;
}

export default Cube;
