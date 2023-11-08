import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import CannonDebugger from "cannon-es-debugger";
import Stats from "stats.js";

function LearningPhysic() {
  const PhyRef = useRef(null);

  useEffect(() => {
    const canvas = PhyRef.current;
    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    //Made renderer for canvas
    const renderer = new THREE.WebGL1Renderer({
      canvas,
      antialias: true,
    });
    renderer.setSize(screen.width, screen.height);

    //Making scene
    const scene = new THREE.Scene();

    //Making camera
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 0, 58);

    //Orbitcontrols for all over view
    const controls = new OrbitControls(camera, canvas);
    //stats for checking animation load
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

    //Making physics world
    const physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      // infinte geometric plane
      shape: new CANNON.Plane(),
    });
    groundBody.position.x = 2.5;
    groundBody.position.y = 2.5;

    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    physicsWorld.addBody(groundBody);
    const radius = 1;
    const sphereBody = new CANNON.Body({
      mass: 100,
      shape: new CANNON.Sphere(radius),
    });
    sphereBody.linearDamping = 0.5;
    sphereBody.position.set(1.5, 9, 0);
    physicsWorld.addBody(sphereBody);

    // physicsWorld.step(1/60);
    // setTimeout(function() {
    //     physicsWorld.removeBody(sphereBody);
    //   }, 10000);

    // controls.addEventListener("change", () => {
    //     const { x, y, z } = controls.target;
    //     const groundQuaternion = new THREE.Quaternion().setFromEuler(
    //         new THREE.Euler(-Math.PI / 2, 0, Math.atan2(y, x))
    //         );
    //         // console.log("called",controls.target);
    //     groundBody.quaternion.copy(groundQuaternion);
    //   });

    controls.addEventListener("change", () => {
      console.log("called", controls);

      const { x, y, z } = controls.object.rotation;
    //   groundBody.quaternion.setFromEuler(-Math.PI/2 + x, y, z, "XYZ");
    });

    const sphGemotry = new THREE.SphereGeometry(radius);
    const sphMaterail = new THREE.MeshNormalMaterial();
    const sphMesh = new THREE.Mesh(sphGemotry, sphMaterail);
    scene.add(sphMesh);

    const sphGemotrys = new THREE.SphereGeometry(radius);
    const sphMaterails = new THREE.MeshNormalMaterial();
    const sphMeshs = new THREE.Mesh(sphGemotry, sphMaterail);
    scene.add(sphMeshs);

    const boxBody = new CANNON.Body({
      mass: 15,
      shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    });
    boxBody.position.set(2.5, 7, 0);
    physicsWorld.addBody(boxBody);

    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshNormalMaterial();
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(boxMesh);

    const cannonDebugger = new CannonDebugger(scene, physicsWorld, {
      color: 'lightblue',
    });

    function render() {
      stats.update();
      physicsWorld.fixedStep();
      controls.update();
      cannonDebugger.update();
      boxMesh.position.copy(boxBody.position);
      boxMesh.quaternion.copy(boxBody.quaternion);
      sphMeshs.position.copy(sphereBody.position);
      sphMeshs.quaternion.copy(groundBody.quaternion);
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

  return <canvas ref={PhyRef}>LearningPhysic</canvas>;
}

export default LearningPhysic;
