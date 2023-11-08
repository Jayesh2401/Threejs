import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { DoubleSide } from "three";

function PhsSound() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(-3, 3, 3);
    scene.add(camera);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      //   alpha: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const gui = new dat.GUI();
    const debugObject = {};
    debugObject.createSphere = () => {
      createSphere(Math.random() * 0.5, {
        x: Math.random() * 0.5 * 3,
        y: 3,
        z: Math.random() * 0.5 * 3,
      });
    };
    gui.add(debugObject, "createSphere");

    debugObject.createBox = () => {
      createBox(Math.random(), Math.random(), Math.random(), {
        x: Math.random() * 0.5 * 3,
        y: 3,
        z: Math.random() * 0.5 * 3,
      });
    };
    gui.add(debugObject, "createBox");

    debugObject.reset = () => {
      for (const object of objectsToUpdate) {
        object.body.removeEventListener("collide", playHitSound);
        object.body.removeEventListener("collide", playBounceSound);
        physicsWorld.removeBody(object.body);
        scene.remove(object.mesh);
        // objectsToUpdate.splice(0, objectsToUpdate.length);
      }
    };
    gui.add(debugObject, "reset");

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;

    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    const environmentMapTexture = cubeTextureLoader.load([
      "/textures/environmentMaps/0/px.png",
      "/textures/environmentMaps/0/nx.png",
      "/textures/environmentMaps/0/py.png",
      "/textures/environmentMaps/0/ny.png",
      "/textures/environmentMaps/0/pz.png",
      "/textures/environmentMaps/0/nz.png",
    ]);

    const hitSound = new Audio("hit.mp3");
    const bounceSound = new Audio("bounce1.mp3");

    const playBounceSound = (collison) => {
      const impactStrenght = collison.contact.getImpactVelocityAlongNormal();

      if (impactStrenght > 1.5) {
        bounceSound.volume = Math.random();
        console.log(bounceSound.volume);
        bounceSound.currentTime = 0;
        bounceSound.play();
      }
    };

    const playHitSound = (collison) => {
      const impactStrenght = collison.contact.getImpactVelocityAlongNormal();

      if (impactStrenght > 2) {
        hitSound.volume = Math.random();
        hitSound.currentTime = 0;
        hitSound.play();
      }
    };

    // const sphere = new THREE.Mesh(
    //   new THREE.SphereGeometry(0.5, 32, 32),
    //   new THREE.MeshStandardMaterial({
    //     metalness: 0.3,
    //     roughness: 0.4,
    //     // envMap: environmentMapTexture,
    //     envMapIntensity: 0.5,
    //   })
    // );
    // sphere.castShadow = true;
    // sphere.position.y = 0.5;
    // scene.add(sphere);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: "#777777",
        metalness: 0.3,
        roughness: 0.4,
        side: DoubleSide,
        // envMap: environmentMapTexture,
        envMapIntensity: 0.5,
      })
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;
    scene.add(floor);

    const physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });
    physicsWorld.broadphase = new CANNON.SAPBroadphase(physicsWorld);
    physicsWorld.allowSleep = true;
    const defaultMaterial = new CANNON.Material("default");

    const concretePlastic = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 0.1,
        restitution: 0.7,
      }
    );
    physicsWorld.addContactMaterial(concretePlastic);
    physicsWorld.defaultContactMaterial = concretePlastic;
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({
      mass: 0,
      shape: floorShape,
      material: defaultMaterial,
    });
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    physicsWorld.addBody(floorBody);

    // const sphereBody = new CANNON.Body({
    //   mass: 2,
    //   shape: new CANNON.Sphere(0.5),
    // });
    // sphereBody.position.set(0, 3, 0);
    // sphereBody.applyLocalForce(
    //   new CANNON.Vec3(200, 0, 0),
    //   new CANNON.Vec3(0, 0, 0)
    // );
    // physicsWorld.addBody(sphereBody);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const cannonDebugger = new CannonDebugger(scene, physicsWorld, {
      color: 0xff0000,
    });

    const objectsToUpdate = [];

    const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
    });

    const createSphere = (radius, position) => {
      const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      mesh.scale.set(radius, radius, radius);
      mesh.castShadow = true;
      mesh.position.copy(position);
      scene.add(mesh);

      const shape = new CANNON.Sphere(radius);
      const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial,
      });
      body.position.copy(position);
      body.addEventListener("collide", playBounceSound);
      physicsWorld.addBody(body);

      objectsToUpdate.push({
        mesh,
        body,
      });
    };
    createSphere(0.5, { x: 0, y: 3, z: 0 });

    const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const BoxMaterial = new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
    });

    const createBox = (width, height, depth, position) => {
      const mesh = new THREE.Mesh(BoxGeometry, BoxMaterial);
      mesh.scale.set(width, height, depth);
      mesh.castShadow = true;
      mesh.position.copy(position);
      scene.add(mesh);

      const shape = new CANNON.Box(
        new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
      );
      const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape,
        material: defaultMaterial,
      });
      body.position.copy(position);
      body.addEventListener("collide", playHitSound);
      physicsWorld.addBody(body);

      objectsToUpdate.push({
        mesh,
        body,
      });
    };

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      //   sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);

      physicsWorld.fixedStep();
      for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion);
      }
      cannonDebugger.update();
      controls.update();
      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}

export default PhsSound;
