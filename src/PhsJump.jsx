import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { DoubleSide } from "three";

function PhsJump() {
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

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        // envMap: environmentMapTexture,
        envMapIntensity: 0.5,
      })
    );
    sphere.castShadow = true;
    sphere.position.y = 0.5;
    scene.add(sphere);

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

    const concrateMaterial = new CANNON.Material("concrete");
    const plasticMaterial = new CANNON.Material("plastic");

    const concretePlastic = new CANNON.ContactMaterial(
      concrateMaterial,
      plasticMaterial,
      {
        friction: 0.1,
        restitution: 0.7,
      }
    );
    physicsWorld.addContactMaterial(concretePlastic)

    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({
      mass: 0,
      shape: floorShape,
      material:concrateMaterial
    });
    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1, 0, 0),
      Math.PI * 0.5
    );
    physicsWorld.addBody(floorBody);

    const sphereBody = new CANNON.Body({
      mass: 2,
      shape: new CANNON.Sphere(0.5),
      material:plasticMaterial
    });
    sphereBody.position.set(0, 3, 0);
    physicsWorld.addBody(sphereBody);

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

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      physicsWorld.fixedStep();
      sphere.position.copy(sphereBody.position);
      sphere.quaternion.copy(sphereBody.quaternion);
      // if (mixer) {
      //   mixer.update(delta);
      // }
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

export default PhsJump;
