import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
function Branding() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f9f5ed");
    const canvas = canvasRef.current;

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      1,
      100
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);

    const planeWidth = 0.5;
    const planeHeight = 1.5;
    const planeCount = 4;
    const planeSpacing = 0.58;

    const planes = [];
    const cones = [];
    const labels = [];

    for (let i = 0; i < planeCount; i++) {
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(planeWidth, planeHeight),
        new THREE.MeshBasicMaterial({ color: "white" })
      );
      plane.position.x = (i - (planeCount - 1) / 2) * planeSpacing;
      planes.push(plane);
      scene.add(plane);

      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(0.1, 0.2, 5, 1, true),
        new THREE.MeshBasicMaterial({
          color: getRandomColor(),
          wireframeLinewidth: 2.5,
          wireframe: true,
        })
      );
      cone.position.copy(plane.position);
      cone.position.z = 0.14;
      cone.rotation.x = 0.5;
      cone.position.y = 0.5;
      cones.push(cone);
      scene.add(cone);

      const label = document.createElement("div");
      label.className = "label";
      label.textContent = `Plane ${i + 1}`;
      const labelObject = new CSS2DObject(label);
      labelObject.position.copy(plane.position);
      labelObject.position.y -= 0.65; // Adjust the label position
      labels.push(labelObject);
      scene.add(labelObject);
    }

    function scalePlane(plane, scale) {
      plane.scale.x = scale;

      const material = plane.material;

      if (scale === 1) {
        material.color.set("white");
      } else if (scale === 2) {
        material.color.set("grey");
      }
    }

    function getRandomColor() {
      const colors = [
        "red",
        "green",
        "blue",
        "yellow",
        "orange",
        "purple",
        "black",
        "plum",
        "grey",
      ];
      const randomIndex = Math.floor(Math.random() * colors.length);
      return colors[randomIndex];
    }
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    labelRenderer.domElement.style.fontSize = "18px";
    labelRenderer.domElement.style.fontWeight = 600;
    document.body.appendChild(labelRenderer.domElement);

    const raycaster = new THREE.Raycaster();

    // Track the currently hovered plane
    let hoveredPlane = null;

    function handleMouseMove(event) {
      const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(planes);

      if (intersects.length > 0) {
        const intersectedPlane = intersects[0].object;

        if (hoveredPlane !== intersectedPlane) {
          if (hoveredPlane) {
            scalePlane(hoveredPlane, 1);
            movePlanesBack(hoveredPlane);
          }

          scalePlane(intersectedPlane, 2);
          movePlanesAhead(intersectedPlane);

          hoveredPlane = intersectedPlane;
        }
      } else {
        if (hoveredPlane) {
          scalePlane(hoveredPlane, 1);
          movePlanesBack(hoveredPlane);
          hoveredPlane = null;
        } else {
          // If no plane is hovered, bring all planes, cones, and labels to initial state
          planes.forEach((plane, index) => {
            plane.position.x = (index - (planeCount - 1) / 2) * planeSpacing;
            const cone = cones[index];
            cone.position.copy(plane.position);
            cone.position.y = 0.5
            cone.position.z = 0.2
            const label = labels[index];
            label.position.copy(plane.position);
          });
        }
      }
    }

    function movePlanesAhead(plane) {
      const index = planes.indexOf(plane);

      for (let i = 0; i < index; i++) {
        const precedingPlane = planes[i];
        const precedingCone = cones[i];
        const precedingLabel = labels[i];
        const precedingPlaneScale = precedingPlane.scale.x;

        // Calculate the shifted position based on the scale and spacing
        const shiftedOffset =
          precedingPlane.position.x - planeSpacing * precedingPlaneScale;

        precedingPlane.position.x = shiftedOffset;
        precedingCone.position.x = shiftedOffset;
        precedingLabel.position.x = shiftedOffset;
      }
    }

    function movePlanesBack(plane) {
      const index = planes.indexOf(plane);

      for (let i = index + 1; i < planes.length; i++) {
        const succeedingPlane = planes[i];
        const succeedingCone = cones[i];
        const succeedingLabel = labels[i];
        const succeedingPlaneScale = succeedingPlane.scale.x;

        // Calculate the shifted position based on the scale and spacing
        const shiftedOffset =
          succeedingPlane.position.x + planeSpacing * succeedingPlaneScale;

        succeedingPlane.position.x = shiftedOffset;
        succeedingCone.position.x = shiftedOffset;
        succeedingLabel.position.x = shiftedOffset;
      }
    }

    // function movePlanesAhead(plane) {
    //   const index = planes.indexOf(plane);

    //   for (let i = 0; i < index; i++) {
    //     const precedingPlane = planes[i];
    //     const precedingCone = cones[i];
    //     const precedingLabel = labels[i];
    //     precedingPlane.position.x =
    //       (i - (index - 1) / 2) * planeSpacing - planeSpacing;
    //     precedingCone.position.x = precedingPlane.position.x;
    //     precedingLabel.position.x = precedingPlane.position.x;
    //   }
    // }

    // function movePlanesBack(plane) {
    //   const index = planes.indexOf(plane);

    //   for (let i = index + 1; i < planes.length; i++) {
    //     const succeedingPlane = planes[i];
    //     const succeedingCone = cones[i];
    //     const succeedingLabel = labels[i];
    //     succeedingPlane.position.x =
    //       (i - (index + 1 + (planes.length - index - 1)) / 2) * planeSpacing +
    //       planeSpacing;
    //     succeedingCone.position.x = succeedingPlane.position.x;
    //     succeedingLabel.position.x = succeedingPlane.position.x;
    //   }
    // }

    function animate() {
      const delta = clock.getElapsedTime();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
      cones.forEach((cone) => {
        cone.rotation.y = delta * 0.3;
      });
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    function handleResize() {
      const { innerWidth, innerHeight } = window;
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      labelRenderer.setSize(innerWidth, innerHeight);
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default Branding;
