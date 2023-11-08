import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";

function MindSpacerocket() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();
  let mixer;
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 4;
    scene.add(camera);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      //   alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#26927e");

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;

    // const object1 = new THREE.Mesh(
    //   new THREE.BoxGeometry(2, 2, 2),
    //   new THREE.MeshBasicMaterial({
    //     color: "#5D3891",
    //   })
    // );

    // scene.add(object1)

    const object1 = new THREE.Mesh(
      new RoundedBoxGeometry(1.45, 1.45, 1.45, 4, 0.2),
      new THREE.MeshStandardMaterial({
        color: "#9435df",
      })
    );
    object1.position.x = -3;
    object1.position.z = -2;
    object1.rotation.y = Math.PI / 4;
    object1.rotation.x = -Math.PI / 12;
    object1.rotation.z = Math.PI / 16;
    scene.add(object1);

    const floor1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.15, 32),
      new THREE.MeshStandardMaterial({ color: "#9435df" })
    );
    floor1.position.y = -0.77;
    floor1.position.x = -0.35;
    floor1.position.z = -0.4;

    const floor2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.15, 32),
      new THREE.MeshStandardMaterial({ color: "#9435df" })
    );
    floor2.position.y = -0.77;
    floor2.position.x = -0.35;
    floor2.position.z = 0.4;

    const floor3 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.15, 32),
      new THREE.MeshStandardMaterial({ color: "#9435df" })
    );
    floor3.position.y = -0.77;
    floor3.position.x = 0.35;
    floor3.position.z = 0.4;

    const floor4 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.15, 32),
      new THREE.MeshStandardMaterial({ color: "#9435df" })
    );
    floor4.position.y = -0.77;
    floor4.position.x = 0.35;
    floor4.position.z = -0.4;

    const object1part1 = new THREE.Mesh(
      new RoundedBoxGeometry(1, 1, 0.2, 4, 0.3),
      new THREE.MeshStandardMaterial({
        color: "#9435df",
      })
    );
    object1part1.position.z = 0.7;

    const geometry = new THREE.TorusGeometry(0.25, 0.035, 30, 100);
    const material = new THREE.MeshStandardMaterial({ color: "#33b9e7" });
    const torus = new THREE.Mesh(geometry, material);
    torus.position.z = 0.9;
    object1.add(object1part1, torus, floor1, floor2, floor3, floor4);

    const cygeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.25, 32);
    const cymaterial = new THREE.MeshStandardMaterial({ color: "#33b9e7" });
    const cylinder = new THREE.Mesh(cygeometry, cymaterial);
    cylinder.rotation.x = Math.PI / 2;
    cylinder.position.z = -0.1;

    const lock1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.135, 32),
      new THREE.MeshStandardMaterial({ color: "#33b9e7" })
    );
    lock1.position.x = 0.1;
    lock1.position.z = -0.11;
    lock1.position.y = 0.08;
    lock1.rotation.z = Math.PI / 2;
    lock1.rotation.y = Math.PI / 3.5;

    const lock2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.135, 32),
      new THREE.MeshStandardMaterial({ color: "#33b9e7" })
    );
    lock2.position.x = 0.1;
    lock2.position.z = 0.11;
    lock2.position.y = 0.08;
    lock2.rotation.z = Math.PI / 2;
    lock2.rotation.y = -Math.PI / 3.5;

    const lock3 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.135, 32),
      new THREE.MeshStandardMaterial({ color: "#33b9e7" })
    );
    lock3.position.x = -0.1;
    lock3.position.z = 0.11;
    lock3.position.y = 0.08;
    lock3.rotation.z = Math.PI / 2;
    lock3.rotation.y = Math.PI / 3.5;

    const lock4 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.135, 32),
      new THREE.MeshStandardMaterial({ color: "#33b9e7" })
    );
    lock4.position.x = -0.1;
    lock4.position.z = -0.11;
    lock4.position.y = 0.08;
    lock4.rotation.z = Math.PI / 2;
    lock4.rotation.y = -Math.PI / 3.5;

    cylinder.add(lock1, lock2, lock3, lock4);

    torus.add(cylinder);

 

    const ambientLight = new THREE.AmbientLight("#fff", 0.4);
    // ambientLight.position.set(1,1,5)
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("white", 0.7);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight("white", 0.5);
    directionalLight2.position.set(-5, 5, 5);
    scene.add(directionalLight2);

    const loader = new GLTFLoader();

    loader.load("the_rocket.glb", (gltf) => {
      const root = gltf.scene;
      root.position.y = -1;
      root.position.x = 0.4;
      // root.rotation.y = 0.1;
      root.rotation.set(
        THREE.MathUtils.degToRad(4.9),
        THREE.MathUtils.degToRad(-31),
        THREE.MathUtils.degToRad(-45)
      );
      //   root.rotation.y = 3;
      //   root.rotation.z = Math.PI / 2;
      //   root.rotation.x = -Math.PI;
      root.scale.set(0.2, 0.2, 0.2);
      scene.add(gltf.scene);
    });

    loader.load("cool_man.glb", (gltf) => {
      const animations = gltf.animations;

      const root = gltf.scene;
      root.position.y = -0.5;
      root.position.x = -0.8;

      if (animations && animations.length) {
        mixer = new THREE.AnimationMixer(gltf.scene);
        const animationAction = mixer.clipAction(animations[1]);
        animationAction.setLoop(THREE.LoopRepeat);
        animationAction.play();
        mixer.timeScale = 0.9;
      }
      // root.rotation.y = 0.1;
      //   root.rotation.y = 3;
      //   root.rotation.z = Math.PI / 2;
      //   root.rotation.x = -Math.PI;
      //   root.scale.set(0.2, 0.2, 0.2);
      scene.add(gltf.scene);
    });

    // loader.load("gold_star.glb", (gltf) => {
    //     const root = gltf.scene;
    //   //   root.position.y = -0.4;
    //   //   root.position.z = -1;
    //       root.scale.set(0.02,0.02,0.02)
    //     scene.add(gltf.scene);
    //   });

    // Define the star shape
    const starShape = new THREE.Shape();
    const starPoints = [
      [0, 0.5],
      [0.2, 0.2],
      [0.5, 0.2],
      [0.3, -0.1],
      [0.4, -0.4],
      [0, -0.2],
      [-0.4, -0.4],
      [-0.3, -0.1],
      [-0.5, 0.2],
      [-0.2, 0.2],
      [0, 0.5],
    ];
    starShape.moveTo(starPoints[0][0], starPoints[0][1]);
    for (let i = 1; i < starPoints.length; i++) {
      starShape.lineTo(starPoints[i][0], starPoints[i][1]);
    }

    // Extrude the star shape
    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: false,
    };
    const starGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings);

    // Create a StandardMaterial
    const materials = new THREE.MeshStandardMaterial({ color: "#FFD700" });

    // Create a mesh and add it to the scene
    const starMesh = new THREE.Mesh(starGeometry, materials);
    starMesh.position.x = 0.5;
    starMesh.position.y = 1;
    starMesh.rotation.y = -Math.PI / 4;
    starMesh.scale.set(0.5, 0.5, 0.5);
    scene.add(starMesh);

    // const geometry = new RoundedBoxGeometry( 10, 10, 10, 6, 2 );

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}

export default MindSpacerocket;
