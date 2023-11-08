// import React, { useEffect, useRef } from "react";
// import * as THREE from "three";

// function FirstDemo() {
//   const mount = useRef(null);
//   const hoverTarget = useRef(null);
//   useEffect(() => {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(60, 10 / 4, 0.1, 5);
//     const helper = new THREE.CameraHelper(camera);
//     scene.add(helper);

//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     mount.current.appendChild(renderer.domElement);

//     const geometry = new THREE.BoxGeometry(1, 1, 1);
//     const material = new THREE.MeshBasicMaterial({ color: "#fff" });
//     const cube = new THREE.Mesh(geometry, material);
//     scene.add(cube);

//     camera.position.z = 4;

//     function animate() {
//       requestAnimationFrame(animate);
//       cube.rotation.z += 0.01;
//       cube.rotation.x += 0.01;
//       cube.rotation.y += 0.01;
//       renderer.render(scene, camera);
//     }
//     animate();
//   }, []);

//   return <div ref={mount} className="firstDemo"/>;
// }

// export default FirstDemo;

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

function FirstDemo() {
  const mount = useRef(null);
  const hoverTarget = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 10 / 4, 0.1, 5);
    const helper = new THREE.CameraHelper(camera);
    scene.add(helper);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth - 15 , window.innerHeight );
    mount.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: "#fff" });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.userData.originalColor = cube.material.color.getHex(); // Save original color
    cube.userData.hoverColor = 0xfff000; // Define hover color

    camera.position.z = 4;

    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.z += 0.01;
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();

    function onMouseMove(event) {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children);
      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj !== hoverTarget.current) {
          // Check if we are already hovering this object
          if (hoverTarget.current) {
            // Restore original color
            hoverTarget.current.material.color.setHex(
              hoverTarget.current.userData.originalColor
            );
          }
          // Change color to hover color
          obj.userData.originalColor = obj.material.color.getHex();
          obj.material.color.setHex(obj.userData.hoverColor);
          hoverTarget.current = obj;
        }
      } else {
        if (hoverTarget.current) {
          // Restore original color
          hoverTarget.current.material.color.setHex(
            hoverTarget.current.userData.originalColor
          );
          hoverTarget.current = null;
        }
      }
    }
    cube.addEventListener('mouseover', () => {
      cube.material.color.set(0xff0000); // change color to red on hover
    });
    cube.addEventListener('mouseout', () => {
      cube.material.color.set(0xffffff); // change color back to white on mouseout
    });

    mount.current.addEventListener("mousemove", onMouseMove);

    return () => {
      mount.current.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return <div ref={mount} />;
}

export default FirstDemo;
