import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
function Trialodffloor() {
  THREE.Cache.enabled = true;
  const container = useRef(null);
  //   let container;

  let camera, cameraTarget, scene, renderer;

  let group, textMesh1, textMesh2, textGeo, materials;

  let firstLetter = true;

  let text = "three.js";
  let bevelEnabled = true;
  let font = undefined;
  let fontName = "optimer"; // helvetiker, optimer, gentilis, droid sans, droid serif
  let fontWeight = "bold";
  const height = 20;
  const size = 70;
  const hover = 30;
  const curveSegments = 4;
  const bevelThickness = 2;
  const bevelSize = 1.5;

  const mirror = true;

  const fontMap = {
    helvetiker: 0,
    optimer: 1,
    gentilis: 2,
    "droid/droid_sans": 3,
    "droid/droid_serif": 4,
  };

  const weightMap = {
    regular: 0,
    bold: 1,
  };

  const reverseFontMap = [];
  const reverseWeightMap = [];

  for (const i in fontMap) reverseFontMap[fontMap[i]] = i;
  for (const i in weightMap) reverseWeightMap[weightMap[i]] = i;

  let pointerX = 0;
  let pointerXOnPointerDown = 0;

  let windowHalfX = window.innerWidth / 2;

  let fontIndex = 1;

  function loadFont() {
    const loader = new FontLoader();
    loader.load(
      "fonts/" + fontName + "_" + fontWeight + ".typeface.json",
      function (response) {
        font = response;
      }
    );
  }

  function createText() {
    textGeo = new TextGeometry(text, {
      font: font,

      size: size,
      height: height,
      curveSegments: curveSegments,

      bevelThickness: bevelThickness,
      bevelSize: bevelSize,
      bevelEnabled: bevelEnabled,
    });

    textGeo.computeBoundingBox();

    const centerOffset =
      -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

    textMesh1 = new THREE.Mesh(textGeo, materials);

    textMesh1.position.x = centerOffset;
    textMesh1.position.y = hover;
    textMesh1.position.z = 0;

    textMesh1.rotation.x = 0;
    textMesh1.rotation.y = Math.PI * 2;

    group.add(textMesh1);

    if (mirror) {
      textMesh2 = new THREE.Mesh(textGeo, materials);

      textMesh2.position.x = centerOffset;
      textMesh2.position.y = -hover;
      textMesh2.position.z = height;

      textMesh2.rotation.x = Math.PI;
      textMesh2.rotation.y = Math.PI * 2;

      group.add(textMesh2);
    }
  }

  useEffect(() => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      1500
    );
    camera.position.set(0, 400, 700);
    cameraTarget = new THREE.Vector3(0, 150, 0);
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 250, 1400);
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: container.current,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
    dirLight.position.set(0, 0, 1).normalize();
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.color.setHSL(Math.random(), 1, 0.5);
    pointLight.position.set(0, 100, 90);
    scene.add(pointLight);

    materials = [
      new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
      new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
    ];

    group = new THREE.Group();
    group.position.y = 100;

    scene.add(group);

    loadFont();

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10000, 10000),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.5,
        transparent: true,
      })
    );
    plane.position.y = 100;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }, []);

  return <canvas ref={container}></canvas>;
}

export default Trialodffloor;
