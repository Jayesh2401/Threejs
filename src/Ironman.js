// import React, { useRef, useEffect } from "react";
// import * as THREE from "three";
// import { Geometry } from 'three';

// const IronManHelmet = () => {
//   const sceneRef = useRef(null);

//   useEffect(() => {
//     const width = window.innerWidth;
//     const height = window.innerHeight;

//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(width, height);
//     sceneRef.current.appendChild(renderer.domElement);

//     const material = new THREE.LineBasicMaterial({ color: 0xffffff });
//     const geometry = new Geometry();
    
//     // Define points for Iron Man's helmet
//     geometry.vertices.push(
//       new THREE.Vector3(-10, 0, 0),
//       new THREE.Vector3(10, 0, 0),
//       new THREE.Vector3(10, 20, 0),
//       new THREE.Vector3(-10, 20, 0),
//       new THREE.Vector3(-10, 0, 0),
//       new THREE.Vector3(-10, 10, 10),
//       new THREE.Vector3(10, 10, 10),
//       new THREE.Vector3(10, 20, 0),
//       new THREE.Vector3(10, 10, 10),
//       new THREE.Vector3(-10, 10, 10)
//     );

//     const line = new THREE.Line(geometry, material);
//     scene.add(line);

//     camera.position.z = 50;

//     const animate = function () {
//       requestAnimationFrame(animate);

//       line.rotation.x += 0.01;
//       line.rotation.y += 0.01;

//       renderer.render(scene, camera);
//     };

//     animate();

//     return () => {
//       scene.remove(line);
//       geometry.dispose();
//       material.dispose();
//       renderer.dispose();
//     };
//   }, []);

//   return <div ref={sceneRef}></div>;
// };

// export default IronManHelmet;


import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const IronManHelmet = () => {
  const sceneRef = useRef(null);

  useEffect(() => {
    const width = window.innerWidth - 15;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    sceneRef.current.appendChild(renderer.domElement);

    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const geometry = new THREE.BufferGeometry();
    
    // Define points for Iron Man's helmet
    const vertices = new Float32Array([
      -10, 0, 0,
      10, 0, 0,
      10, 20, 0,
      -10, 20, 0,
      -10, 0, 0,
      -10, 10, 10,
      10, 10, 10,
      10, 20, 0,
      10, 10, 10,
      -10, 10, 10
    ]);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const line = new THREE.Line(geometry, material);
    scene.add(line);

    camera.position.z = 50;

    const animate = function () {
      requestAnimationFrame(animate);

      line.rotation.x += 0.01;
      line.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      scene.remove(line);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={sceneRef}></div>;
};

export default IronManHelmet;
