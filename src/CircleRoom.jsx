import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CannonDebugger from "cannon-es-debugger";

function Circleroom() {
  const circleRef = useRef(null);
  let circleBody, sphere;
  let sphereBodies = [];
  let sphereMeshes = [];
  useEffect(() => {
    const canvas = circleRef.current;
    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const renderer = new THREE.WebGL1Renderer({
      canvas,
      antialias: true,
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
    camera.position.set(0, 12, 20);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.minPolarAngle = Math.PI / 2.5;
    controls.maxPolarAngle = Math.PI / 2.3;
    const ambientLight = new THREE.AmbientLight("white", 1.5);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight("white", 0.1);
    directionalLight1.position.set(-10, 10, -5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight("white", 0.1);
    directionalLight2.position.set(50, 50, 25);
    directionalLight2.castShadow = true;
    directionalLight2.shadow.mapSize = new THREE.Vector2(256, 256);
    directionalLight2.shadow.camera.left = -10;
    directionalLight2.shadow.camera.right = 10;
    directionalLight2.shadow.camera.top = 10;
    directionalLight2.shadow.camera.bottom = -10;
    scene.add(directionalLight2);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("aa.jpg");
    texture.minFilter = THREE.LinearFilter;
    const materials = new THREE.MeshStandardMaterial({
      map: texture,
      color: "grey",
      side: THREE.DoubleSide,
    });

    materials.roughness = 1;

    const cubeSize = 25;
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMaterial = new THREE.MeshStandardMaterial({
      color: "grey",
      side: THREE.BackSide, // show the backside of the cube
    });
    const cubeRoom = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeRoom.position.y = 12.5;
    scene.add(cubeRoom);

    let planeGeometry = new THREE.PlaneGeometry(25, 25);
    const planeFlorr = new THREE.Mesh(planeGeometry, materials);
    planeFlorr.rotation.x = -Math.PI * 0.5;
    planeFlorr.position.y = 0.01;
    scene.add(planeFlorr);

    const physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      mass: 0,
      shape: new CANNON.Plane(),
    });
    groundBody.position.y = 0.01;
    groundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    physicsWorld.addBody(groundBody);

    const kinematicBody = new CANNON.Body({
      type: CANNON.Body.KINEMATIC,
      mass: 0, // Set mass to 0 to make it immovable
      shape: new CANNON.Sphere(1), // Example shape, you can use other shapes as well
    });
    physicsWorld.addBody(kinematicBody);

    window.addEventListener("mousemove", (event) => {
      // Update kinematic body position based on mouse position
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);
      const intersects = raycaster.intersectObject(planeFlorr); // Example object to intersect with
      if (intersects.length > 0) {
        const intersectionPoint = intersects[0].point;
        kinematicBody.position.copy(intersectionPoint); // Update kinematic body position
      }
    });

    let count = 100;
    const sphereRadius = 0.5;
    const sphereMass = 10;

    const wallBody1 = new CANNON.Body({
      mass: 0,
    });
    const wallBody2 = new CANNON.Body({
      mass: 0,
    });
    const wallBody3 = new CANNON.Body({
      mass: 0,
    });
    const wallBody4 = new CANNON.Body({
      mass: 0,
    });
    // ...
    const wallShape = new CANNON.Box(new CANNON.Vec3(25 / 2, 25 / 2, 0.1));
    wallBody1.addShape(wallShape);
    wallBody1.position.z = -12.5;
    wallBody1.position.y = 12.5;
    physicsWorld.addBody(wallBody1);

    const wallright = new CANNON.Box(new CANNON.Vec3(25 / 2, 25 / 2, 0.1));
    wallBody2.addShape(wallright);
    wallBody2.position.x = -12.5;
    wallBody2.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      Math.PI * 0.5
    );
    wallBody2.position.y = 12.5;
    physicsWorld.addBody(wallBody2);

    const wallleft = new CANNON.Box(new CANNON.Vec3(25 / 2, 25 / 2, 0.1));
    wallBody3.addShape(wallleft);
    wallBody3.position.x = 12.5;
    wallBody3.quaternion.setFromAxisAngle(
      new CANNON.Vec3(0, 1, 0),
      Math.PI * 0.5
    );
    wallBody3.position.y = 12.5;
    physicsWorld.addBody(wallBody3);

    const wallahead = new CANNON.Box(new CANNON.Vec3(25 / 2, 25 / 2, 0.1));
    wallBody4.addShape(wallahead);
    wallBody4.position.z = 12.5;
    wallBody4.position.y = 12.5;
    physicsWorld.addBody(wallBody4);

    const onCollision = (event) => {
      const contact = event.contact;
      const sphereBody =
        contact.bi.id === wallBody1.id ? contact.bj : contact.bi;
      const sphereBodys =
        contact.bi.id === wallBody2.id ? contact.bj : contact.bi;
      sphereBody.velocity.x *= -1;
      sphereBody.velocity.z *= -1;
      sphereBodys.velocity.x *= -1;
      sphereBodys.velocity.z *= -1;
    };

    for (let i = 0; i < 200; i++) {
      //   const color = Math.floor(Math.random() * 16777215).toString(16);
      const color = (
        "00000" + Math.floor(Math.random() * 16777215).toString(16)
      ).slice(-6);
      //   const color = Math.floor(Math.random() * 15)
      const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: `#${color}`,
        metalness: 1,
        roughness: 0.2,
        emissive: `#${color}`,
      });
      const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(sphereMesh);

      const sphereBody = new CANNON.Body({
        mass: sphereMass,
        shape: new CANNON.Sphere(sphereRadius),
        material: sphereMaterial,
        restitution: 0.8,
        linearDamping : 0.1,
      });
      sphereBody.position.set(
        Math.random() * 15 - 5,
        10 + i * 1,
        Math.random() * 15 - 5
      );
      physicsWorld.addBody(sphereBody);
      sphereBody.addEventListener("collide", onCollision);
      sphereMeshes.push(sphereMesh);
      sphereBodies.push(sphereBody);
    }

    const updateSphereMeshes = () => {
      for (let i = 0; i < sphereBodies.length; i++) {
        const sphereMesh = scene.children[i + 5];
        const sphereBody = sphereBodies[i];
        const sphereMeshs = sphereMeshes[i];
        sphereMeshs.position.copy(sphereBody.position);
        sphereMeshs.quaternion.copy(sphereBody.quaternion);
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

    const cannonDebugger = new CannonDebugger(scene, physicsWorld, {
      color: "lightblue",
    });

    function render() {
      physicsWorld.step(1 / 60);
      // cannonDebugger.update();
      controls.update();
      updateBoxMesh();
      updateSphereMeshes();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, []);

  return <canvas ref={circleRef}></canvas>;
}

export default Circleroom;
