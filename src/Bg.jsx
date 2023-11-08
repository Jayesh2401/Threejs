import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

function Bg() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();
  let textMesh;
  useEffect(() => {
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color("grey");

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 5;
    // camera.position.x = -2.5;
    scene.add(camera);

    const gui = new dat.GUI();

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    // controls.minAzimuthAngle = -Math.PI / 4; // -90 degrees
    // controls.maxAzimuthAngle = Math.PI / 4; // 90 degrees
    controls.minDistance = 3;
    controls.maxDistance = 7;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const parameters = {
      count: 1200,
      size: 0.19,
    };

    let geometry = null;
    let material = null;
    let points = null;
    let shapesize;
    const textureLoader = new THREE.TextureLoader();
    const partcilesTexture = textureLoader.load("11.png");
    const beemsmallTexture = textureLoader.load("4.png");
    const hugeXbeemTexture = textureLoader.load("5.png");
    const sharpbeemTexture = textureLoader.load("8.png");
    const gloowbeemTexture = textureLoader.load("1.png");
    const thickbeemTexture = textureLoader.load("9.png");
    const matcapTexture = textureLoader.load("mat2.jpg");
    const matcapTextures = textureLoader.load("mat5.jpg");
    const matcapTexturess = textureLoader.load("mat9.jpg");

    const textures = [
      beemsmallTexture,
      hugeXbeemTexture,
      sharpbeemTexture,
      gloowbeemTexture,
      thickbeemTexture,
      partcilesTexture,
    ];

    const fontLoader = new FontLoader();
    fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      const textGeometry = new TextGeometry("Hello", {
        font: font,
        size: 0.5,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelOffset: 0,
        bevelSegments: 1,
      });

      //   const textMaterial = new THREE.MeshBasicMaterial({
      //     color: "red",
      //     metalness: 1,
      //   });

      const textMaterial = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
        // metalness: 1,
      });

      textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-1, 0, 2);
      //   textMesh.rotation.y = Math.PI / 5; // 45 degrees in radians
      //   textMesh.rotation.x = Math.PI /4; // 45 degrees in radians

      scene.add(textMesh);
    });

    const genarateGalxy = () => {
      if (points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
      }

      geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.count * 3);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        positions[i3 + 0] = (Math.random() - 0.5) * 10;
        positions[i3 + 1] = (Math.random() - 0.5) * 7;
        positions[i3 + 2] = (Math.random() - 0.5) * 15;
      }
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        alphaMap: thickbeemTexture,
        transparent: true,
        // vertexColors: true,
        color: "#9435df",
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        //   blending: THREE.CustomBlending,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);
    };
    genarateGalxy();

    gui
      .add(parameters, "count")
      .min(100)
      .max(10000)
      .step(100)
      .onFinishChange(genarateGalxy);
    gui
      .add(parameters, "size")
      .min(0.01)
      .max(0.5)
      .step(0.001)
      .onFinishChange(genarateGalxy);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
      <canvas ref={canvasRef}></canvas>
  );
}

export default Bg;
