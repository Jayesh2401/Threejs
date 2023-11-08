import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as YUKA from "yuka";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";

function Pathglb() {
  const pathRef = useRef(null);
  const [speed, setSpeed] = useState(5);

  let testt;
  useEffect(() => {
    const canvas = pathRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    renderer.setClearColor(0xa3a3a3);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 20);
    camera.lookAt(scene.position);
    const controls = new OrbitControls(camera, canvas);

    const ambientLight = new THREE.AmbientLight(0x33333);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);
    const gui = new dat.GUI();

    const vehicle = new YUKA.Vehicle();
    // vehicle.maxSpeed = 5
    vehicle.maxSpeed = speed;
    const cameraFolder = gui.addFolder("Camera");

    cameraFolder.add(vehicle, "maxSpeed", 0, 10).step(0.1).onChange(setSpeed);
    function sync(entity, renderComponent) {
      renderComponent.matrix.copy(entity.worldMatrix);
    }

    const path = new YUKA.Path();
    path.add(new YUKA.Vector3(-4, 0, 4));
    path.add(new YUKA.Vector3(-10, 0, 0));
    path.add(new YUKA.Vector3(-6, 0, -4));
    path.add(new YUKA.Vector3(3, 0, -2));
    path.add(new YUKA.Vector3(10, 0, -2));
    path.add(new YUKA.Vector3(15, 0, 0));
    path.add(new YUKA.Vector3(12, 0, 4));
    path.add(new YUKA.Vector3(0, 0, 6));

    path.loop = true;
    // vehicle.rotation.y = -1.5;
    vehicle.position.copy(path.current());

    const followPathBehavior = new YUKA.FollowPathBehavior(path, 0.5);
    vehicle.steering.add(followPathBehavior);

    const onPathBehavior = new YUKA.OnPathBehavior(path);
    // onPathBehavior.radius = 2;
    vehicle.steering.add(onPathBehavior);

    const entityManager = new YUKA.EntityManager();
    entityManager.add(vehicle);

    const loader = new GLTFLoader();
    loader.load("SUV.glb", function (glb) {
      const model = glb.scene;
      console.log(glb.scene.rotation._y);
      testt = glb.scene;
      //   const color = new THREE.Color("purple");
      //   const material = new THREE.MeshStandardMaterial({ color });
      //   model.traverse((child) => {
      //     console.log(child);
      //     if (child.isMesh) {
      //       child.material = material;
      //     }
      //   });
      //   model.rotation.y = Math.PI / 2;
      model.matrixAutoUpdate = false;
      vehicle.scale = new YUKA.Vector3(0.5, 0.5, 0.5);
      scene.add(model);
      vehicle.setRenderComponent(glb.scene, sync);
    });

    const position = [];
    for (let i = 0; i < path._waypoints.length; i++) {
      const waypoint = path._waypoints[i];
      position.push(waypoint.x, waypoint.y, waypoint.z);
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(position, 3)
    );

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const lines = new THREE.LineLoop(lineGeometry, lineMaterial);
    scene.add(lines);

    const time = new YUKA.Time();

    function render() {
      const delta = time.update().getDelta();
      entityManager.update(delta);
      controls.update();
      //   testt.position.x = 1

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    function handleResize() {
      const { innerWidth, innerHeight } = window;
      renderer.setSize(innerWidth - 15, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={pathRef}></canvas>;
}

export default Pathglb;
