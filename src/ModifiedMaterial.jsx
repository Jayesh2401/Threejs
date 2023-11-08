import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "dat.gui";

function ModifiedMaterial() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();

  useEffect(() => {
    const scene = new THREE.Scene();

    const textureLoader = new THREE.TextureLoader();
    const gltfLoader = new GLTFLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();

    const updateAllMaterials = () => {
      scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMapIntensity = 1;
          child.material.needsUpdate = true;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    };

    const environmentMap = cubeTextureLoader.load([
      "0/px.jpg",
      "0/nx.jpg",
      "0/py.jpg",
      "0/ny.jpg",
      "0/pz.jpg",
      "0/nz.jpg",
    ]);
    environmentMap.encoding = THREE.sRGBEncoding;

    scene.background = environmentMap;
    scene.environment = environmentMap;

    const mapTexture = textureLoader.load("LeePerrySmith/color.jpg");
    mapTexture.encoding = THREE.sRGBEncoding;

    const normalTexture = textureLoader.load("LeePerrySmith/normal.jpg");

    // Material
    const material = new THREE.MeshStandardMaterial({
      map: mapTexture,
      normalMap: normalTexture,
    });

    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
        '#inclue <common>',
        `#include <common>
            mat2 get2dRotateMatrix(float _angle){
                return mat2(cos(_angle) , -sin(_angle) , sin(_angle) , cos(_angle));
            }
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#inclue <begin_vertex>',
        `
            #include <begin_vertex>
            float angle = position.y;
            mat2 rotateMatrix = get2dRotateMatrix(angle);
            transformed.xz = rotateMatrix * transformed.xz;
        `
      );
    };

    gltfLoader.load("LeePerrySmith/LeePerrySmith.glb", (gltf) => {
      // Model
      const mesh = gltf.scene.children[0];
      mesh.rotation.y = Math.PI * 0.5;
      mesh.material = material;
      scene.add(mesh);

      // Update materials
      updateAllMaterials();
    });

    const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.normalBias = 0.05;
    directionalLight.position.set(0.25, 2, -2.25);
    scene.add(directionalLight);

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.x = 4;
    camera.position.y = 1;
    camera.position.z = -4;
    scene.add(camera);

    const gui = new dat.GUI();

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const animate = () => {
      const t = clock.getElapsedTime();

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
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

export default ModifiedMaterial;
