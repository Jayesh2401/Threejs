import React, { useEffect, useRef } from "react";
import * as THREE from "three";

function Third() {
  const thrid = useRef(null);

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth - 15, window.innerHeight);
    thrid.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    camera.position.set(0, 0, 90);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();

    // const material = new THREE.LineBasicMaterial({ color: "white" });
    const materialss = new THREE.LineDashedMaterial({
      color: "white",
      linewidth: 1,
      scale: 5,
      dashSize: 3,
      gapSize: 4,
    });

    const points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, materialss);
    scene.add(line);
    renderer.render(scene, camera);
  }, []);

  return <div ref={thrid} style={{ width: "90vw" }}></div>;
}

export default Third;
