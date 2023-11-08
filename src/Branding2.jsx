// import React, { useEffect, useRef, useState } from "react";
// import * as THREE from "three";

// function Branding2() {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const containerRef = useRef(null);
//   const boxRefs = useRef([]);
//   const handleBoxClick = (index) => {
//     setActiveIndex(index);
//   };

//   const boxes = [
//     { name: "Branding" },
//     { name: "Design" },
//     { name: "Gaming" },
//     { name: "Devlopment" },
//   ];

//   useEffect(() => {
//     const scene = new THREE.Scene();
//     const canvas = containerRef.current;

//     const camera = new THREE.PerspectiveCamera(
//       50,
//       window.innerWidth / window.innerHeight,
//       1,
//       100
//     );
//     camera.position.z = 3;
//     const renderer = new THREE.WebGLRenderer({
//       antialias: true,
//       canvas,
//       alpha: true,
//     });
//     renderer.shadowMap.enabled = true;
//     renderer.setSize(window.innerWidth, window.innerHeight);

//     const planeCount = 4;
//     const cones = [];

//     for (let i = 0; i < planeCount; i++) {
//       const cone = new THREE.Mesh(
//         new THREE.ConeGeometry(0.1, 0.2, 5, 1, true),
//         new THREE.MeshBasicMaterial({
//           color: "red",
//           wireframeLinewidth: 2.5,
//           wireframe: true,
//         })
//       );
//       // cone.position.z = 1.14;
//       cone.rotation.x = 0.5;
//       // cone.position.y = 0.5;
//       // cone.position.x = -0.1;
//       cones.push(cone);
//       scene.add(cone);
//     }
//     function animate() {
//       renderer.render(scene, camera);
//       requestAnimationFrame(animate);
//     }
//     requestAnimationFrame(animate);
//   }, []);

//   return (
//     <div>
//       <div
//         style={{
//           position: "relative",
//           width: "100%",
//           height: "100vh",
//         }}
//       >
//         <div style={{ display: "flex", gap: "20px", zIndex: 2 }}>
//           {boxes.map((box, index) => (
//             <div
//               key={index}
//               className={`box ${activeIndex === index ? "active" : ""}`}
//               style={{
//                 width: activeIndex === index ? "300px" : "150px",
//                 backgroundColor: activeIndex === index ? "black" : "purple",
//                 height: "400px",
//                 color: "white",
//                 transition: "width 0.3s",
//                 position: "relative",
//                 zIndex: 3,
//               }}
//               onMouseEnter={() => handleBoxClick(index)}
//             >
//               <canvas ref={containerRef}></canvas>
//               {box.name}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Branding2;

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { DoubleSide } from "three";


function Cone() {
  const coneRef = React.useRef();

  React.useEffect(() => {
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.1, 0.2, 5, 1, true),
      new THREE.MeshBasicMaterial({
        color: "red",
        wireframeLinewidth: 2.5,
        wireframe: true,
      })
    );
    coneRef.current.appendChild(cone);
    return () => {
      coneRef.current.removeChild(cone);
    };
  }, []);

  return <div ref={coneRef} className="cone"></div>;
}

function Branding2() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cones = useRef([]);

  const handleBoxClick = (index) => {
    setActiveIndex(index);
  };

  const boxes = [
    { name: "Branding" },
    { name: "Design" },
    { name: "Gaming" },
    { name: "Development" },
  ];

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      100
    );
    camera.position.z = 3;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const planeCount = 4;

    for (let i = 0; i < planeCount; i++) {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.1, 0.2, 5, 1, true),
        new THREE.MeshStandardMaterial({
          color: "red",
          wireframeLinewidth: 2.5,
          wireframe: true,
          side: DoubleSide,
        })
      );
      cone.add(new THREE.AmbientLight("red", 2));
      cones.current.push(cone);
      scene.add(cone);
    }

    const animate = () => {
    
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();
  }, []);



  return (
    <div>
      <div style={{ display: "flex", gap: "20px" }}>
        {boxes.map((box, index) => (
          <div
            key={index}
            className={`box ${activeIndex === index ? "active" : ""}`}
            style={{
              width: activeIndex === index ? "300px" : "150px",
              backgroundColor: activeIndex === index ? "black" : "purple",
              height: "400px",
              color: "white",
              transition: "width 0.3s",
              position: "relative",
              zIndex: 3,
            }}
            onMouseEnter={() => handleBoxClick(index)}
          >
            {box.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Branding2;

// import React, { useState, useEffect, useRef } from "react";
// import * as THREE from "three";

// function Branding2() {
//   const [activeIndex, setActiveIndex] = useState(null);
//   const containerRef = useRef(null);
//   const scene = useRef(null);
//   const camera = useRef(null);
//   const renderer = useRef(null);
//   const cones = useRef([]);

//   const handleBoxEnter = (index) => {
//     setActiveIndex(index);
//   };

//   const handleBoxLeave = () => {
//     setActiveIndex(null);
//   };

//   const boxes = [
//     { color: "red" },
//     { color: "blue" },
//     { color: "green" },
//     { color: "yellow" },
//   ];

//   useEffect(() => {
//     // Three.js code
//     scene.current = new THREE.Scene();
//     camera.current = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     renderer.current = new THREE.WebGLRenderer({ alpha: true });
//     renderer.current.setSize(window.innerWidth, window.innerHeight);
//     containerRef.current.appendChild(renderer.current.domElement);

//     const coneGeometry = new THREE.ConeGeometry(0.1, 0.2, 5, 1, true);

//     cones.current = boxes.map((box) => {
//       const coneMaterial = new THREE.MeshBasicMaterial({
//         color: getRandomColor(),
//         wireframeLinewidth: 2.5,
//         wireframe: true,
//       });
//       const cone = new THREE.Mesh(coneGeometry, coneMaterial);
//       scene.current.add(cone);
//       return cone;
//     });

//     camera.current.position.z = 5;

//     function animate() {
//       requestAnimationFrame(animate);

//       cones.current.forEach((cone, index) => {
//         cone.rotation.y += 0.01;
//         cone.position.set(-2 + index * 1.3, 0, 0);
//       });

//       renderer.current.render(scene.current, camera.current);
//     }

//     animate();

//     return () => {
//       containerRef.current.removeChild(renderer.current.domElement);
//     };
//   }, []);

//   function getRandomColor() {
//     const colors = ["red", "green", "blue", "yellow", "orange", "purple"];
//     const randomIndex = Math.floor(Math.random() * colors.length);
//     return colors[randomIndex];
//   }

//   return (
//     <div>
//       <div
//         ref={containerRef}
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//         }}
//       ></div>
//       <div style={{ display: "flex", gap: "20px" }}>
//         {boxes.map((box, index) => (
//           <div
//             key={index}
//             className={`box ${activeIndex === index ? "active" : ""}`}
//             style={{
//               background: box.color,
//               width: activeIndex === index ? "300px" : "150px",
//               height: "400px",
//               transition: "width 0.3s",
//             }}
//             onMouseEnter={() => handleBoxEnter(index)}
//             onMouseLeave={handleBoxLeave}
//           >
//             <div
//               style={{
//                 position: "relative",
//                 width: "100%",
//                 height: "100%",
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               {activeIndex === index && (
//                 <div
//                   style={{
//                     width: "50px",
//                     height: "100px",
//                     backgroundColor: "rgba(255, 255, 255, 0.5)",
//                   }}
//                 ></div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Branding2;
