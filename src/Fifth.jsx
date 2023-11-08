import React, { useEffect, useRef } from "react";
import { Canvas } from "react-three-fiber";
import * as THREE from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";

function Fifth() {
  const group = useRef();
  const labels = useRef();
  const renderer = new CSS2DRenderer();

  // Initialize CSS2DRenderer
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 10 / 4, 0.1, 5);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);
    renderer.setSize(window.innerWidth - 15, window.innerHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0px";
    renderer.domElement.style.zIndex = "1";
    // group.current.appendChild(renderer.domElement);

    document.body.appendChild(renderer.domElement);

    // Add a 3D object to the scene
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Add a CSS2DObject as a label
    const labelDiv = document.createElement("div");
    labelDiv.className = "label";
    labelDiv.textContent = "My Object";
    const labelObj = new CSS2DObject(labelDiv);
    labelObj.position.set(0, 1, 0);
    labels.current = labelObj;
    scene.add(labelObj);

    function animate() {
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return (
    <Canvas>
      <group ref={group} />
    </Canvas>
    // <div ref={group}>dvav</div>
  );
}

export default Fifth;
