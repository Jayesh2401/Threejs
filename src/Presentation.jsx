import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Font } from "three/examples/jsm/loaders/FontLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";

function Presentation() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();
  let flag, rock, thanos, textMesh, laser;

  const leftarray = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eigth",
    "ninth",
    "Tenth",
  ];

  const rightarray = [
    "third",
    "first",
    "fourth",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eigth",
    "ninth",
    "Tenth",
  ];

  useEffect(() => {
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color("grey");
    const canvas = canvasRef.current;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 3.5;
    // camera.position.y = 1;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // const controls = new OrbitControls(camera, canvasRef.current);
    // controls.enableDamping = true;
    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load("mat13.jpg");
    const fontTexture = textureLoader.load("try2.jpg");
    const matcapTextures = textureLoader.load("mat14.jpg");
    const thickbeemTexture = textureLoader.load("9.png");
    const thickbeemTextures = textureLoader.load("try4.jpg");

    const buttonLoader = new TTFLoader();

    // buttonLoader.load("Audiowide/Audiowide-Regular.ttf", (fontData) => {
    //   const font = new Font(fontData);
    //   const textGeometry = new TextGeometry("Testing", {
    //     font: font,
    //     size: 0.08,
    //     height: 0.01,
    //     curveSegments: 32,
    //     bevelEnabled: true,
    //     bevelThickness: 0.01,
    //     bevelSize: 0.001,
    //     bevelSegments: 8,
    //   });

    //   const material = new THREE.MeshMatcapMaterial({
    //     matcap: matcapTextures,
    //   });

    //   textMesh = new THREE.Mesh(textGeometry, material);
    //   textMesh.position.set(0, -0.7, 2.5);
    //   //   textMesh.rotation.x = Math.PI;
    //   scene.add(textMesh);
    // });

    // const canvasWidth = canvas.clientWidth;
    // const margin = 200; // Adjust the margin as per your requirement

    // // Calculate the end position based on canvas width and margin
    // // const endPositionX = canvasWidth / 2 - margin;
    // const endPositionX = window.innerWidth / 2 - margin;
    // const marginPercentage = 0.1; // Adjust the margin percentage as per your requirement
    // const screenWidth = window.innerWidth;
    // const endPositionX = (screenWidth / 2) * (1 - marginPercentage);
    const screenWidth = window.innerWidth;
    const baseScreenWidth = 1920;
    const baseXPosition = -5;
    const screenWidthScaleFactor = 100;
    const xPosition =
      baseXPosition +
      ((baseScreenWidth - screenWidth) / screenWidthScaleFactor) * 0.5;

    buttonLoader.load("Audiowide/Audiowide-Regular.ttf", (fontData) => {
      const font = new Font(fontData);
      const startY = 2.2;
      const gap = 0.5;
      const size = 0.08;
      const height = 0.001;
      const curveSegments = 32;
      const bevelEnabled = true;
      const bevelThickness = 0.00001;
      const bevelSize = 0.000001;
      const bevelSegments = 8;

      for (let i = 0; i <= 9; i++) {
        const textGeometry = new TextGeometry(leftarray[i], {
          font: font,
          size: size,
          height: height,
          curveSegments: curveSegments,
          bevelEnabled: bevelEnabled,
          bevelThickness: bevelThickness,
          bevelSize: bevelSize,
          bevelSegments: bevelSegments,
        });

        const material = new THREE.MeshMatcapMaterial({
          matcap: fontTexture,
        });

        const textMesh = new THREE.Mesh(textGeometry, material);
        textMesh.position.set(xPosition, startY - i * gap, 0);
        textMesh.rotation.y = 0.3;
        textMesh.userData.id = i;
        textMesh.userData.text = leftarray[i];
        scene.add(textMesh);
        createClickableArea(textMesh);
      }

      for (let i = 0; i <= 9; i++) {
        const textGeometry = new TextGeometry(rightarray[i], {
          font: font,
          size: size,
          height: height,
          curveSegments: curveSegments,
          bevelEnabled: bevelEnabled,
          bevelThickness: bevelThickness,
          bevelSize: bevelSize,
          bevelSegments: bevelSegments,
        });

        const material = new THREE.MeshMatcapMaterial({
          matcap: fontTexture,
        });

        const textMesh = new THREE.Mesh(textGeometry, material);
        textMesh.position.set(-xPosition - 0.5, startY - i * gap, 0);
        textMesh.rotation.y = -0.3;
        textMesh.userData.id = i;
        textMesh.userData.text = rightarray[i];
        scene.add(textMesh);
        createClickableArea(textMesh);
      }
    });

    function createLaser(startPosition, endPosition, dir) {
      if (dir === "right") {
        startPosition.setX(startPosition.x + 0.1);
        startPosition.setY(startPosition.y + 0.5);
        startPosition.setZ(0.5);
      } else {
        startPosition.setX(startPosition.x - 0.3);
        startPosition.setY(startPosition.y + 0.5);
        startPosition.setZ(0.5);
      }
      const geometry = new THREE.BufferGeometry().setFromPoints([
        startPosition,
        endPosition,
      ]);
      const material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        linewidth: 2,
      });

      const line = new THREE.Line(geometry, material);
      return line;
    }

    function removeLaser() {
      if (laser) {
        scene.remove(laser);
        laser = null;
      }
    }

    const clickableAreas = [];

    function createClickableArea(textMesh) {
      if (textMesh.geometry) {
        const boundingBox = new THREE.Box3().setFromObject(textMesh);
        const size = boundingBox.getSize(new THREE.Vector3());

        const geometry = new THREE.PlaneGeometry(size.x, size.y);
        const material = new THREE.MeshBasicMaterial({ visible: false });
        const clickableArea = new THREE.Mesh(geometry, material);

        clickableArea.position.copy(textMesh.position);
        clickableArea.position.x = textMesh.position.x + 0.2;
        clickableArea.position.y = textMesh.position.y + 0.02;
        clickableArea.position.z = 0;
        clickableArea.rotation.copy(textMesh.rotation);
        clickableArea.userData.id = textMesh.userData.id;
        clickableArea.userData.text = textMesh.userData.text;
        scene.add(clickableArea);
        clickableAreas.push(clickableArea);
      }
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Add a click event listener to the canvas
    canvas.addEventListener("click", onCanvasClick);
    scene.remove(laser);
    laser = undefined;
    function onCanvasClick(event) {
      removeLaser();
      // Calculate the mouse position relative to the canvas
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Calculate the normalized device coordinates
      mouse.x = (x / canvas.clientWidth) * 2 - 1;
      mouse.y = -(y / canvas.clientHeight) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Perform raycasting on the scene objects
      const intersects = raycaster.intersectObjects(clickableAreas, true);
      const righthand = thanos.getObjectByName("Bip001_L_Hand_023");
      const lefthand = thanos.getObjectByName("Bip001_R_Hand_053");

      const mouseX = event.clientX;
      const halfWidth = window.innerWidth / 2;
      let dir = null;
      let startPosition, endPosition;

      // Check for intersections with the text meshes
      for (const intersect of intersects) {
        const object = intersect.object;

        if (object instanceof THREE.Mesh && object.userData) {
          const text = object.userData.text;
          const index = object.userData.id;
          console.log("Clicked Text:", text);
          // console.log("Clicked Index:", index);

          if (mouseX > halfWidth) {
            dir = "right";
            startPosition = righthand.position.clone();
            endPosition = object.position.clone();
          } else {
            dir = "left";
            startPosition = lefthand.position.clone();
            endPosition = object.position.clone();
          }
          laser = createLaser(startPosition, endPosition, dir);

          // Add the laser to the scene
          scene.add(laser);
        }
      }
    }

    const parameters = {
      count: 2000,
      size: 0.28,
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

        positions[i3 + 0] = -(Math.random() - 0.5) * 10;
        positions[i3 + 1] = (Math.random() - 0.5) * 7;
        positions[i3 + 2] = -(Math.random() - 0.5) * 12;
      }
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        alphaMap: thickbeemTextures,
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

    const directionalLight = new THREE.DirectionalLight("#fff", 1);
    directionalLight.position.set(0, 2, -1);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight("#9435df", 1);
    scene.add(ambientLight);

    const loader = new GLTFLoader();
    loader.load("mana_fantasy_teamed_portal/scene.gltf", (gltf) => {
      rock = gltf.scene;
      rock.position.y = -1.1;
      rock.position.z = -0.8;
      rock.rotation.x = 0.15;
      rock.scale.set(4, 4, 4);

      scene.add(rock);
    });

    loader.load("thanos_-_future_fight_obsidian_king_set.glb", (gltf) => {
      thanos = gltf.scene;
      thanos.position.y = -0.1;
      thanos.position.z = 2.4;
      thanos.position.x = 0.08;
      thanos.scale.set(0.07, 0.07, 0.07);

      const sword = gltf.scene.getObjectByName("sv_thanos_wp");
      // const neck = gltf.scene.getObjectByName("Bip001_Neck_046");
      const neck = gltf.scene.getObjectByName("Bip001_Head_047");
      const righthand = gltf.scene.getObjectByName("Bip001_L_UpperArm_021");
      const lefthand = gltf.scene.getObjectByName("Bip001_R_UpperArm_051");
      const leftarm = thanos.getObjectByName("Bip001_R_Hand_053");
      if (sword) {
        const parent = sword.parent;
        parent.remove(sword);
      }

      const transformControls = new TransformControls(
        camera,
        renderer.domElement
      );
      transformControls.attach(gltf.scene);

      scene.add(gltf.scene);

      scene.add(thanos);

      thanos.add(new THREE.AmbientLight("#fff", 2));
      //   thanos.add(new THREE.DirectionalLight("#0xe86262", 4));

      canvasRef.current.addEventListener("mousemove", (event) => {
        scene.remove(laser);
        laser = undefined;

        const mouse = new THREE.Vector2(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const direction = raycaster.ray.direction;

        const rotationY = -Math.atan(direction.y);
        const rotationX = Math.asin(direction.x);

        const mouseX = event.clientX;
        const halfWidth = window.innerWidth / 2;

        if (mouseX > halfWidth) {
          // Mouse is on the right side
          righthand.rotation.set(
            THREE.MathUtils.degToRad(20),
            rotationY,
            THREE.MathUtils.degToRad(-14)
          );
          lefthand.rotation.set(
            THREE.MathUtils.degToRad(-20),
            THREE.MathUtils.degToRad(-47),
            THREE.MathUtils.degToRad(-14)
          );
        } else {
          // Mouse is on the left side
          righthand.rotation.set(
            THREE.MathUtils.degToRad(20),
            THREE.MathUtils.degToRad(47),
            THREE.MathUtils.degToRad(-14)
          );
          lefthand.rotation.set(
            THREE.MathUtils.degToRad(20),
            -rotationY,
            THREE.MathUtils.degToRad(14)
          );
        }

        if (laser) {
          if (mouseX > halfWidth) {
            const startPosition = righthand.position.clone();
            const endPosition = laser.geometry.attributes.position.array[3];
            laser.geometry.setFromPoints([startPosition, endPosition]);
          } else {
            const startPosition = lefthand.position.clone();
            const endPosition = laser.geometry.attributes.position.array[3];
            laser.geometry.setFromPoints([startPosition, endPosition]);
          }
        }

        // righthand.rotation.set(THREE.MathUtils.degToRad(20), rotationY ,  THREE.MathUtils.degToRad(-14) );
        // righthand.rotation.set(THREE.MathUtils.degToRad(20), THREE.MathUtils.degToRad(47),  THREE.MathUtils.degToRad(-14) );
        neck.rotation.set(rotationX, 0, rotationY);
      });
    });

    const animate = () => {
      const delta = clock.getDelta();
      const t = clock.getElapsedTime();

      points.rotateY(0.001);

      requestAnimationFrame(animate);
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

  return <canvas ref={canvasRef}></canvas>;
}

export default Presentation;
