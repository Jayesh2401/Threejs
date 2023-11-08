import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const TwoCubes = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Set up the scene, camera, and renderer for the white cube
    // const whiteScene = new THREE.Scene();
    // const whiteCamera = new THREE.PerspectiveCamera(
    //   45, // fov
    //   window.innerWidth - 50 / window.innerHeight, // aspect ratio
    //   1, // near
    //   100 // far
    // );
    // whiteCamera.position.z = 5;
    // const whiteCanvas = containerRef.current;
    // const whiteRenderer = new THREE.WebGLRenderer({ antialias: true, canvas: whiteCanvas });
    // whiteRenderer.setSize(window.innerWidth / 2, window.innerHeight);
    // whiteRenderer.domElement.style.left = "100px"
    // whiteScene.background = new THREE.Color('white');
    // // Create the white cube
    // const whiteGeometry = new THREE.BoxGeometry(1, 1, 1);
    // const whiteMaterial = new THREE.MeshBasicMaterial({ color: 'lightblue' });
    // const whiteCube = new THREE.Mesh(whiteGeometry, whiteMaterial);
    // whiteScene.add(whiteCube);

    // // Animate the white cube
    // const whiteAnimate = () => {
    //   whiteCube.rotation.x += 0.01;
    //   whiteCube.rotation.y += 0.01;
    //   whiteRenderer.render(whiteScene, whiteCamera);
    //   requestAnimationFrame(whiteAnimate);
    // };
    // requestAnimationFrame(whiteAnimate);

    // Set up the scene, camera, and renderer for the black cube
    const blackScene = new THREE.Scene();
    const blackCamera = new THREE.OrthographicCamera(
      -3, // left
      3, // right
      3, // top
      -3, // bottom
      0.1, // near
      100 // far
    );
    blackCamera.position.z = 5;
    const blackCanvas = containerRef.current;
    const blackRenderer = new THREE.WebGLRenderer({ antialias: true, canvas: blackCanvas });
    blackRenderer.setSize(window.innerWidth , window.innerHeight);
    blackScene.background = new THREE.Color('black');

    // Create the black cube
    const blackGeometry = new THREE.BoxGeometry(1, 1, 1);
    const blackMaterial = new THREE.MeshBasicMaterial({ color: 'lightblue' });
    const blackCube = new THREE.Mesh(blackGeometry, blackMaterial);
    blackScene.add(blackCube);

    // Animate the black cube
    const blackAnimate = () => {
      blackCube.rotation.x += 0.01;
      blackCube.rotation.y += 0.01;
      blackRenderer.render(blackScene, blackCamera);
      requestAnimationFrame(blackAnimate);
    };
    requestAnimationFrame(blackAnimate);

  }, []);

  return <canvas ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default TwoCubes;
