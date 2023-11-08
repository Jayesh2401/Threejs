import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CannonDebugger from "cannon-es-debugger";

function Circle() {
  const circleRef = useRef(null);
  let circleBody, sphere;
  let sphereBodies = [];
  useEffect(() => {
    const canvas = circleRef.current;
    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const renderer = new THREE.WebGL1Renderer({
      canvas,
      antialias: false,
      stencil: false,
    });
    renderer.setSize(screen.width, screen.height);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      400
    );
    camera.position.set(0, 0, 40);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.minPolarAngle = Math.PI / 2.5;
    controls.maxPolarAngle = Math.PI / 2.3;
    const ambientLight = new THREE.AmbientLight("purple", 1.5);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight("purple", 0.5);
    directionalLight1.position.set(-10, -10, -5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight("purple", 1);
    directionalLight2.position.set(50, 50, 25);
    directionalLight2.castShadow = true;
    directionalLight2.shadow.mapSize = new THREE.Vector2(256, 256);
    directionalLight2.shadow.camera.left = -10;
    directionalLight2.shadow.camera.right = 10;
    directionalLight2.shadow.camera.top = 10;
    directionalLight2.shadow.camera.bottom = -10;
    scene.add(directionalLight2);

    const group = new THREE.Group();
    group.position.set(0, 0, -10);
    scene.add(group);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("aa.jpg");
    texture.minFilter = THREE.LinearFilter;
    const materials = new THREE.MeshStandardMaterial({
      map: texture,
      color: "grey",
      side: THREE.DoubleSide,
    });

    materials.roughness = 1;

    let planeGeometry = new THREE.PlaneGeometry(25, 25);
    const planeFlorr = new THREE.Mesh(planeGeometry, materials);
    planeFlorr.rotation.x = -Math.PI * 0.5;

    scene.add(planeFlorr);

    const physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      mass: 0,
      shape: new CANNON.Plane(),
    });
    groundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    physicsWorld.addBody(groundBody);

    let count = 100;
    const sphereRadius = 0.5;
    const sphereMass = 1;

    for (let i = 0; i < 100; i++) {
      const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
      const sphereMaterial = new THREE.MeshLambertMaterial({ color: "purple" });
      const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(sphereMesh);

      const sphereBody = new CANNON.Body({
        mass: sphereMass,
        shape: new CANNON.Sphere(sphereRadius),
      });
      sphereBody.position.set(
        Math.random() * 10 - 5, // random x position between -5 and 5
        10 + i * 1, // initial y position starting from 20 and increasing for each sphere
        Math.random() * 10 - 5 // random z position between -5 and 5
      );
      physicsWorld.addBody(sphereBody);
      sphereBodies.push(sphereBody);
    }

    const updateSphereMeshes = () => {
      for (let i = 0; i < sphereBodies.length; i++) {
        const sphereMesh = scene.children[i + 5]; // assuming the first 6 objects in the scene are other objects and not the spheres
        const sphereBody = sphereBodies[i];
        sphereMesh.position.copy(sphereBody.position);
        sphereMesh.quaternion.copy(sphereBody.quaternion);
      }
    };

    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshLambertMaterial({ color: "purple" });
    const instancedMeshs = new THREE.Mesh(geometry, material);
    scene.add(instancedMeshs);
    const circleBodys = new CANNON.Body({
      mass: 10,
    });
    circleBodys.addShape(new CANNON.Sphere(0.5));
    circleBodys.position.set(2, 5, 0);
    physicsWorld.addBody(circleBodys);

    const updateBoxMesh = () => {
      instancedMeshs.position.copy(circleBodys.position);
      instancedMeshs.quaternion.copy(circleBodys.quaternion);
    };

    // const cannonDebugger = new CannonDebugger(scene, physicsWorld, {
    //   color: "lightblue",
    // });

    function render() {
      physicsWorld.step(1 / 60);
    //   cannonDebugger.update();
      updateSphereMeshes();
      controls.update();
      updateBoxMesh();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, []);

  return <canvas ref={circleRef}></canvas>;
}

export default Circle;
