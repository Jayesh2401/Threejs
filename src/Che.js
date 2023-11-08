import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { Clock } from "three";
import ThreeScene from "./ThreeScene";

function Che() {
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
    camera.position.z = 5;
    scene.add(camera);
    const gui = new dat.GUI();

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const object1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: "red" })
    );
    object1.position.x = -2;

    const object2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: "red" })
    );

    const object3 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: "red" })
    );
    object3.position.x = 2;

    scene.add(object1, object2, object3);

    const raycaster = new THREE.Raycaster();

    // const rayOrigin = new THREE.Vector3(-3, 0, 0);
    // const rayDirection = new THREE.Vector3(10, 0, 0);
    // rayDirection.normalize();
    // raycaster.set(rayOrigin, rayDirection);

    // const intersect = raycaster.intersectObject(object2);
    // console.log(intersect);

    // const intersects = raycaster.intersectObjects([object1, object2, object3]);
    // console.log(intersects);

    const mouse = new THREE.Vector2();

    window.addEventListener("mousemove", (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
      object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
      object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

      // raycaster.setFromCamera(mouse, camera);
      // const objecttooTest = [object1, object2, object3];
      // const intersect = raycaster.intersectObjects(objecttooTest);

      // for (const obj of objecttooTest) {
      //   obj.material.color.set("red");
      // }

      // for (const inters of intersect) {
      //   inters.object.material.color.set("white");
      // }

      const rayorigin = new THREE.Vector3(-3, 0, 0);
      const raydirectiopn = new THREE.Vector3(1, 0, 0);
      raydirectiopn.normalize();

      raycaster.set(rayorigin, raydirectiopn);

      const objecttooTest = [object1, object2, object3];
      const intersect = raycaster.intersectObjects(objecttooTest);

      for (const obj of objecttooTest) {
        obj.material.color.set("red");
      }

      for (const inters of intersect) {
        inters.object.material.color.set("white");
      }

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

  return <canvas ref={canvasRef}>Che</canvas>;
}

export default Che;
