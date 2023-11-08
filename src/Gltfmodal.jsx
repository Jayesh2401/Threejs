import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as dat from "dat.gui";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

function Gltfmodal() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();
  let previousTime = 0;

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(2, 2, 2);
    scene.add(camera);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      //   antialias: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const gui = new dat.GUI();

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.target.set(0, 0.75, 0);
    controls.enableDamping = true;

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("draco/");
    const gltfloader = new GLTFLoader();
    gltfloader.setDRACOLoader(dracoLoader)

    gltfloader.load('glTF-Draco/Duck.gltf',(gltf)=>{
        // scene.add(gltf.scene)

        const children = [...gltf.scene.children]
        for(const child of children){
            scene.add(child)
        }

    },
    (progress)=>{

    },
    (error)=>{

    })

    gltfloader.load('Duck.gltf',(gltf)=>{

        gltf.scene.position.z = -2
        scene.add(gltf.scene)

        // const children = [...gltf.scene.children]
        // for(const child of children){
        //     scene.add(child)
        // }

    },
    (progress)=>{

    },
    (error)=>{

    })

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({
        color: "#444444",
        metalness: 0,
        roughness: 0.5,
      })
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;
    scene.add(floor);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.camera.left = -7;
    directionalLight.shadow.camera.top = 7;
    directionalLight.shadow.camera.right = 7;
    directionalLight.shadow.camera.bottom = -7;
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime;
      previousTime = elapsedTime;
      //   sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);

      controls.update();
      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}

export default Gltfmodal;
