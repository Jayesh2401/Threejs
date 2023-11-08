import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import watervertexShader from "./shaders/pattern/vertex.glsl.js";
import waterfragmentShader from "./shaders/pattern/fragment.glsl.js";

import * as dat from "dat.gui";

function Experiment() {
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
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 1);
    // camera.rotation.set(Math.PI / 4, 20, 0);
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

    // Material
    const material = new THREE.ShaderMaterial({
      vertexShader: watervertexShader,
      fragmentShader: waterfragmentShader,
      uniforms: {
        time: { value: 0.5 },
        NUM_SIDES: { value: 0.04 },
        // patterns: { value: 0.08 },
        Randomise_Fractal: { value: new THREE.Vector2(0.2, 0.009) },
      },
      side: THREE.DoubleSide,
    });
    
    gui
      .add(material.uniforms.NUM_SIDES,"value")
      .min(0.01)
      .max(1)
      .step(0.01)
      .name("NUM_SIDES");
    // gui
    //   .add(material.uniforms.patterns,"value")
    //   .min(0.001)
    //   .max(1)
    //   .step(0.001)
    //   .name("patterns");
    gui
      .add(material.uniforms.Randomise_Fractal.value, "x")
      .min(0)
      .max(5)
      .step(0.001)
      .name("XRandomise_Fractal");
    gui
      .add(material.uniforms.Randomise_Fractal.value, "y")
      .min(0)
      .max(1)
      .step(0.001)
      .name("yRandomise_Fractal");
   

    // Mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI ;
    scene.add(mesh);

    const animate = () => {
      const delta = clock.getDelta();
      const t = clock.getElapsedTime();

      material.uniforms.time.value = t;
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

export default Experiment;
