import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import testVertexShader from "./shaders/test/vertex.glsl.js";
import testFragmentShader from "./shaders/test/fragment.glsl.js";
import * as dat from "dat.gui";

function Shaderdemo() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();
  useEffect(() => {
    const canvas = canvasRef.current;
    const gui = new dat.GUI();

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color("#7580ab");

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0.25, - 0.25, 1);
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

    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

    // Material
    const material = new THREE.ShaderMaterial({
      vertexShader: testVertexShader,
      fragmentShader: testFragmentShader,
      side: THREE.DoubleSide,
    });

    // Mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const animate = () => {
      const delta = clock.getDelta();
      const t = clock.getElapsedTime();
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

  return <canvas ref={canvasRef}>Fpsgame</canvas>;
}

export default Shaderdemo;
