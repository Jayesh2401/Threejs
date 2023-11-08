import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js";
import { Font } from "three/examples/jsm/loaders/FontLoader.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";

function ThanosSmall() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();
  let sceneLight,
    portalGeo,
    portalMaterial,
    textMesh,
    smokeGeo,
    smokeMaterial,
    portalParticles = [],
    smokeParticles = [];

  useEffect(() => {
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color("grey");

    sceneLight = new THREE.DirectionalLight(0xffffff, 0.5);
    sceneLight.position.set(0, 0, 1);
    scene.add(sceneLight);

    const camera = new THREE.PerspectiveCamera(
      80,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = 1000;
    camera.position.x = -800;
    scene.add(camera);
    // const controls = new OrbitControls(camera, canvasRef.current);
    // controls.enableDamping = true;
    // controls.minAzimuthAngle = -Math.PI / 4; // -90 degrees
    // controls.maxAzimuthAngle = Math.PI / 4; // 90 degrees
    const gui = new dat.GUI();
    const canvas = canvasRef.current;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const textureLoader = new THREE.TextureLoader();
    const thickbeemTexture = textureLoader.load("9.png");
    const matcapTexture = textureLoader.load("mat2.jpg");
    const matcapTextures = textureLoader.load("mat1.jpg");

    const object1 = new THREE.Mesh(
      new RoundedBoxGeometry(400, 125, 45, 40, 40),
      new THREE.MeshMatcapMaterial({
        matcap: matcapTexture,
      })
    );
    object1.position.x = -1500;
    object1.rotation.x = -Math.PI;
    scene.add(object1);

    canvas.addEventListener("click", onCanvasClick);

    // Define the event listener function
    function onCanvasClick(event) {
      // Calculate the mouse position relative to the canvas
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Calculate the normalized device coordinates
      const mouse = new THREE.Vector2();
      mouse.x = (x / canvas.clientWidth) * 2 - 1;
      mouse.y = -(y / canvas.clientHeight) * 2 + 1;

      // Raycast from the camera to the mouse position
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Check for intersections with the object1 mesh
      const intersects = raycaster.intersectObject(object1);

      // Log a message to the console if the object was clicked
      if (intersects.length > 0) {
        console.log("Object1 was clicked!");
      }
    }

    const buttonLoader = new TTFLoader();

    buttonLoader.load("Audiowide/Audiowide-Regular.ttf", (fontData) => {
      // ttfLoader.load("stars-font/Stars-DEa1.ttf", (fontData) => {
      // Convert the parsed fontData to the format Three.js understands
      const font = new Font(fontData);

      // Create the text geometry
      const textGeometry = new TextGeometry("Testing", {
        font: font,
        size: 40,
        height: 5,
        curveSegments: 32,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.5,
        bevelSegments: 8,
      });

      // Create a standard material with red color and 50% gloss
      // const material = new THREE.MeshStandardMaterial({
      //   color: 'hotpink',
      //   roughness: 0.5
      // });
      const material = new THREE.MeshMatcapMaterial({
        matcap: matcapTextures,
      });

      // Geometries are attached to meshes so that they get rendered
      textMesh = new THREE.Mesh(textGeometry, material);
      // Update positioning of the text
      textMesh.position.set(-140, 15, -50);
      textMesh.rotation.x = Math.PI;
      object1.add(textMesh);
    });

    const ttfLoader = new TTFLoader();

    // ttfLoader.load("Audiowide/Audiowide-Regular.ttf", (fontData) => {
    // ttfLoader.load("Creepster/Creepster-Regular.ttf", (fontData) => {
    // ttfLoader.load("Julee/Julee-Regular.ttf", (fontData) => {
    // ttfLoader.load("Caesar_Dressing/CaesarDressing-Regular.ttf", (fontData) => {
    ttfLoader.load(
      "Cinzel_Decorative/CinzelDecorative-Regular.ttf",
      (fontData) => {
        // ttfLoader.load("stars-font/Stars-DEa1.ttf", (fontData) => {
        // Convert the parsed fontData to the format Three.js understands
        const font = new Font(fontData);

        // Create the text geometry
        const textGeometry = new TextGeometry("Mindinventory", {
          font: font,
          size: 40,
          height: 5,
          curveSegments: 32,
          bevelEnabled: true,
          bevelThickness: 0.5,
          bevelSize: 0.5,
          bevelSegments: 8,
        });

        // Create a standard material with red color and 50% gloss
        // const material = new THREE.MeshStandardMaterial({
        //   color: 'hotpink',
        //   roughness: 0.5
        // });
        const material = new THREE.MeshMatcapMaterial({
          matcap: matcapTexture,
        });

        // Geometries are attached to meshes so that they get rendered
        textMesh = new THREE.Mesh(textGeometry, material);
        // Update positioning of the text
        textMesh.position.set(-2000, 500, 100);
        // textMesh.rotation.y = 0.1;
        scene.add(textMesh);
      }
    );

    // const fontLoader = new FontLoader();
    // fontLoader.load("/fonts/try.json", (font) => {
    //   const textGeometry = new TextGeometry("Hello", {
    //     font: font,
    //     size: 50,
    //     height: 18,
    //     curveSegments: 15,
    //     bevelEnabled: true,
    //     bevelThickness: 1,
    //     bevelSize: 1,
    //     bevelOffset: 0.5,
    //     bevelSegments: 1,
    //   });

    //   const textMaterial = new THREE.MeshMatcapMaterial({
    //     matcap: matcapTexture,
    //   });

    //   textMesh = new THREE.Mesh(textGeometry, textMaterial);
    //   textMesh.position.set(-2000, 500, 0);
    //   textMesh.rotation.y = Math.PI / 3; // 45 degrees in radians
    //   textMesh.rotation.x = Math.PI / 12; // 45 degrees in radians
    //   // scene.add(textMesh);
    // });

    const parameters = {
      count: 1000,
      size: 40,
    };

    let geometry = null;
    let material = null;
    let points = null;
    let positions;

    const genarateGalxy = () => {
      if (points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
      }

      geometry = new THREE.BufferGeometry();
      positions = new Float32Array(parameters.count * 3);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        positions[i3 + 0] = -(Math.random() - 0.5) * 5000;
        positions[i3 + 1] = (Math.random() - 0.5) * 1800;
        positions[i3 + 2] = -(Math.random() - 0.5) * 3000;
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
        color: "#9435df",
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        //   blending: THREE.CustomBlending,
      });

      points = new THREE.Points(geometry, material);
      scene.add(points);
    };
    genarateGalxy();

    let loader = new THREE.TextureLoader();

    loader.load("smoke.png", function (texture) {
      portalGeo = new THREE.PlaneGeometry(300, 300);
      portalMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
      });

      smokeGeo = new THREE.PlaneGeometry(500, 500);
      smokeMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
      });
      for (let p = 800; p > 200; p--) {
        let particle = new THREE.Mesh(portalGeo, portalMaterial);
        particle.position.set(
          0.5 * p * Math.cos((3 * p * Math.PI) / 180),
          0.5 * p * Math.sin((3 * p * Math.PI) / 180),
          0.1 * p
        );
        particle.rotation.z = Math.random() * 360;
        portalParticles.push(particle); //keep the reference to the particle to animate it later
        scene.add(particle);
      }
      for (let p = 0; p < 40; p++) {
        let particle = new THREE.Mesh(smokeGeo, smokeMaterial);
        particle.position.set(
          Math.random() * 750 - 400,
          Math.random() * 500 - 200,
          30
        );
        particle.rotation.z = Math.random() * 360;
        particle.material.opacity = 0.5;
        portalParticles.push(particle);
        scene.add(particle);
      }
    });

    let portalLight = new THREE.PointLight("#9435df", 10, 650, 1);
    portalLight.position.set(0, 0, 250);
    scene.add(portalLight);
    let fontflags = true;
    let Buttonflags = true;
    const animate = () => {
      portalLight.power = 100;
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (object1) {
        if (object1.rotation.y < 0.1 && Buttonflags) {
          object1.rotation.y += 0.001;
          if (object1.rotation.y > 0.098) {
            Buttonflags = false;
          }
        }

        if (object1.rotation.y > -1.1 && !Buttonflags) {
          object1.rotation.y -= 0.01;
          if (object1.rotation.y < -0.98) {
            Buttonflags = true;
          }
        }
      }

      if (textMesh) {
        if (textMesh.rotation.y < 0.3 && fontflags) {
          textMesh.rotation.y += 0.001;
          if (textMesh.rotation.y > 0.27) {
            fontflags = false;
          }
        }
        if (textMesh.rotation.y > -0.01 && !fontflags) {
          textMesh.rotation.y -= 0.001;
          if (textMesh.rotation.y < -0.0095) {
            fontflags = true;
          }
        }
      }
      points.rotateY(0.001);
      //
      portalParticles.forEach((p) => {
        p.rotation.z -= delta * 1.5;
      });
      smokeParticles.forEach((p) => {
        p.rotation.z -= delta * 0.2;
      });

      if (Math.random() > 0.9) {
        portalLight.power = 150 + Math.random() * 5;
      }

      // controls.update();
      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return <canvas ref={canvasRef}></canvas>;
}

export default ThanosSmall;
