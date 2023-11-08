import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function House() {
  const houseRef = useRef(null);
  const [screen] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  let renderer, scene, camera;
  let clock = new THREE.Clock();

  function forcameraScene() {
    const canvas = houseRef.current;

    renderer = new THREE.WebGL1Renderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(screen.width, screen.height);
    scene = new THREE.Scene();
    const axesHelper = new THREE.GridHelper(10, 16 ,"yellow" , "cyan");
    axesHelper.rotation.z = Math.PI / 2;
    axesHelper.position.z = -10
    axesHelper.rotation.y = 1.55;
    scene.add(axesHelper);

    var yGridHelper = new THREE.GridHelper(10, 16, "red", "#7fff00" );
    yGridHelper.position.y = -5.1
    yGridHelper.position.z = -5
    scene.add(yGridHelper);
    scene.background = new THREE.Color("black");
    camera = new THREE.PerspectiveCamera(
      55,
      screen.width / screen.height,
      0.1,
      100
    );
    camera.position.set(0, 0, 10);
    scene.add(camera);

    // const controls = new OrbitControls(camera, canvas);
  }

  const floor = () => {
    // const smileyGeometry = new THREE.CircleGeometry(2, 30);
    // const smileyMaterial = new THREE.MeshBasicMaterial({ color: "orange" });
    // const smiley = new THREE.Mesh(smileyGeometry, smileyMaterial);
    // smiley.position.set(0, 0, 0);
    // scene.add(smiley);
  };

  useEffect(() => {
    //for resize

   
  }, []);

  useEffect(() => {
    forcameraScene();
    floor();
    function render() {
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, []);

  return <canvas ref={houseRef}></canvas>;
}

export default House;
