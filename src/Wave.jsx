import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FogExp2 } from "three";
import watervertexShader from "./shaders/water/vertex.glsl.js";
import waterfragmentShader from "./shaders/water/fragment.glsl.js";

import * as dat from "dat.gui";

function Wave() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();
  useEffect(() => {
    const canvas = canvasRef.current;
    const gui = new dat.GUI();

    const debugObject = {
      depthColor: "#107093",
      surfaceColor: "#1dcee6",
    };

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color("#7580ab");
    scene.fog = new THREE.FogExp2("red", 2);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(1, 1, 1);
    camera.rotation.set(Math.PI / 4, 20, 0);
    scene.add(camera);

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.PlaneGeometry(2, 2, 512, 512);
    // const geometry = new THREE.ConeGeometry( 5, 20, 32 );;

    // Material
    const material = new THREE.ShaderMaterial({
      vertexShader: watervertexShader,
      fragmentShader: waterfragmentShader,
      uniforms: {
        uTime: { value: 0 },

        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.5 },
        uSmallWavesElevarion: { value: 0.106 },
        uSMallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallWavesIteration: { value: 3.0 },

        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMuliplier: { value: 5 },
      },
      side: THREE.DoubleSide,
    });

    gui
      .add(material.uniforms.uBigWavesElevation, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("uBigWavesElevation");
    gui
      .add(material.uniforms.uBigWavesFrequency.value, "x")
      .min(0)
      .max(10)
      .step(0.001)
      .name("XuBigWavesFrequency");
    gui
      .add(material.uniforms.uBigWavesFrequency.value, "y")
      .min(0)
      .max(10)
      .step(0.001)
      .name("yuBigWavesFrequency");
    gui
      .add(material.uniforms.uBigWavesSpeed, "value")
      .min(0)
      .max(4)
      .step(0.001)
      .name("uBigWavesSpeed");
    gui
      .addColor(debugObject, "depthColor")
      .name("depthColor")
      .onChange(() => {
        material.uniforms.uDepthColor.value.set(debugObject.depthColor);
      });
    gui
      .addColor(debugObject, "surfaceColor")
      .name("surfaceColor")
      .onChange(() => {
        material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
      });

    gui
      .add(material.uniforms.uColorOffset, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("uColorOffset");
    gui
      .add(material.uniforms.uColorMuliplier, "value")
      .min(0)
      .max(10)
      .step(0.001)
      .name("uColorMuliplier");
    gui
      .add(material.uniforms.uSmallWavesElevarion, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("uSmallWavesElevarion");

    gui
      .add(material.uniforms.uSmallWavesIteration, "value")
      .min(0)
      .max(5)
      .step(1)
      .name("uSmallWavesIteration");

    gui
      .add(material.uniforms.uSmallWavesSpeed, "value")
      .min(0)
      .max(5)
      .step(0.001)
      .name("uSmallWavesSpeed");

    gui
      .add(material.uniforms.uSMallWavesFrequency, "value")
      .min(0)
      .max(30)
      .step(1)
      .name("uSMallWavesFrequency");



    // Mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI * 0.5;
    scene.add(mesh);

    const animate = () => {
      const delta = clock.getDelta();
      const t = clock.getElapsedTime();

      material.uniforms.uTime.value = t;
      controls.update();

      requestAnimationFrame(animate);
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

export default Wave;
