import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as YUKA from "yuka";
function PathFollow() {
  const pathRef = useRef(null);

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
    camera.position.set(0, 20, 0);
    // camera.lookAt(scene.position);
    const controls = new OrbitControls(camera, canvas); 

    const vehicleGeometry = new THREE.ConeGeometry(0.5, 1, 4);  
    vehicleGeometry.rotateX(Math.PI * 0.5);    
    const vehicleMaterial = new THREE.MeshNormalMaterial();
    const vehicleMesh = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
    vehicleMesh.matrixAutoUpdate = false;
    scene.add(vehicleMesh);  

    const vehicle = new YUKA.Vehicle();
    vehicle.setRenderComponent(vehicleMesh, sync);
    vehicle.maxSpeed = 1;

    function sync(entity, renderComponent) {
      renderComponent.matrix.copy(entity.worldMatrix);
    }

    const path = new YUKA.Path();
    path.add(new YUKA.Vector3(-4, 0, 4));
    path.add(new YUKA.Vector3(-10, 0, 0));
    path.add(new YUKA.Vector3(-6, 0, -4));
    path.add(new YUKA.Vector3(0, 0, 0));
    path.add(new YUKA.Vector3(10, 0, -4));
    path.add(new YUKA.Vector3(8,0, 0));
    path.add(new YUKA.Vector3(12, 0, 4));
    path.add(new YUKA.Vector3(0, 0, 6));

    path.loop = true;
    vehicle.position.copy(path.current());

    const followPathBehavior = new YUKA.FollowPathBehavior(path, 0.5);
    vehicle.steering.add(followPathBehavior);

    const onPathBehavior = new YUKA.OnPathBehavior(path);
    onPathBehavior.radius = 2;
    vehicle.steering.add(onPathBehavior);

    const entityManager = new YUKA.EntityManager();
    entityManager.add(vehicle);

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

  return <canvas ref={pathRef}>PathFollow</canvas>;
}

export default PathFollow;
