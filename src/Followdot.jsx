import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as YUKA from "yuka";
function Followdot() {
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
    vehicle.maxSpeed = 1.5;

    vehicle.setRenderComponent(vehicleMesh, sync);

    function sync(entity, renderComponent) {
      renderComponent.matrix.copy(entity.worldMatrix);
    }

    const entityManager = new YUKA.EntityManager();
    entityManager.add(vehicle);

    const targetGeometry = new THREE.SphereGeometry(0.3);
    const targetMaterial = new THREE.MeshBasicMaterial({ color: "white" });
    const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
    targetMesh.matrixAutoUpdate = false;
    scene.add(targetMesh);

    const target = new YUKA.GameEntity();
    target.setRenderComponent(targetMesh, sync);
    entityManager.add(target);

    const seekBehavior = new YUKA.SeekBehavior(target.position);
    vehicle.steering.add(seekBehavior);

    vehicle.position.set(-5, 0, -2);

    setInterval(function () {
      const x = Math.random() *8;
      const y = Math.random() * 8;
      const z = Math.random() * 5;

      target.position.set(x, y, z);
    }, 2000);

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

export default Followdot;
