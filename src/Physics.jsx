import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CannonDebugger from 'cannon-es-debugger';
import Stats from "stats.js";

function Physics() {
  const PhyRef = useRef(null);

  useEffect(() => {
    const canvas = PhyRef.current;
    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    const renderer = new THREE.WebGL1Renderer({
      canvas,
      antialias: true,
    });

    renderer.setSize(screen.width, screen.height);
    let clock = new THREE.Clock();
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 8, 24);

    const controls = new OrbitControls(camera, canvas);
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientlight.castShadow = true;
    scene.add(ambientlight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // directionalLight.castShadow = true;
    directionalLight.position.set(0, 32, 64);
    scene.add(directionalLight);

    const axesHelper = new THREE.AxesHelper(8);
    scene.add(axesHelper);

    const physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      // infinte geometric plane
      shape: new CANNON.Plane(),
    });

    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    physicsWorld.addBody(groundBody);

    const radius = 1;
    const sphereBody = new CANNON.Body({
      mass: 250 ,
      shape: new CANNON.Sphere(radius),
    });
    sphereBody.position.set(0.1, 7, 0);
    physicsWorld.addBody(sphereBody);


    const geometry = new THREE.SphereGeometry(radius);
    const material = new THREE.MeshNormalMaterial();
    const sphereMesh = new THREE.Mesh(geometry, material);
    scene.add(sphereMesh);

    const boxBody = new CANNON.Body({
      mass: 15,
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    });
    boxBody.position.set(2, 10, 0);
    physicsWorld.addBody(boxBody);

    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshNormalMaterial();
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(boxMesh);

    const cannonDebugger = new CannonDebugger(scene, physicsWorld, {
      color: 0xff0000,
    });

    function render() {
      stats.update();
      physicsWorld.fixedStep();
      controls.update()
      cannonDebugger.update();
      boxMesh.position.copy(boxBody.position);
      boxMesh.quaternion.copy(boxBody.quaternion);
      sphereMesh.position.copy(sphereBody.position);
      sphereMesh.quaternion.copy(sphereBody.quaternion);
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
      document.body.removeChild(stats.dom);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas ref={PhyRef} id="threePhy">
      Physics
    </canvas>
  );
}

export default Physics;
