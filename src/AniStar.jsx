import { useEffect, useRef } from "react";
import * as THREE from "three";
import watervertexShader from "./shaders/stars/vertex.glsl.js";
import waterfragmentShader from "./shaders/stars/fragment.glsl.js";

import * as dat from "dat.gui";

function AniStar() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();
  useEffect(() => {
    const canvas = canvasRef.current;
    const gui = new dat.GUI();

    const debugObject = {
      depthColor: "#281f11",
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 1);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.PlaneGeometry(2, 2, 512, 512);

    const material = new THREE.ShaderMaterial({
      vertexShader: watervertexShader,
      fragmentShader: waterfragmentShader,
      uniforms: {
        time: { value: 0.5 },
        speed: { value: 1 },
        fadeAway: { value: 0.5 },
        color: { value: new THREE.Color(debugObject.depthColor) },
        mouse: { value: new THREE.Vector2(0.5, 0.5) },
        resolution: { value: new THREE.Vector2(1, 1) },
        uniformity: { value: 10 },
      },
      side: THREE.DoubleSide,
    });

    gui
      .add(material.uniforms.speed, "value")
      .min(0.001)
      .max(10)
      .step(0.1)
      .name("speed");
    gui
      .add(material.uniforms.resolution.value, "y")
      .min(0.01)
      .max(5)
      .step(0.001)
      .name("yresolution");
    gui
      .add(material.uniforms.resolution.value, "x")
      .min(0.01)
      .max(5)
      .step(0.001)
      .name("Xresolution");
    gui
      .add(material.uniforms.fadeAway, "value")
      .min(0.01)
      .max(1)
      .step(0.1)
      .name("fadeAway");
    gui
      .addColor(debugObject, "depthColor")
      .name("depthColor")
      .onChange(() => {
        material.uniforms.color.value.set(debugObject.depthColor);
      });

    let wheelSpeed = 1;
    let materialSpeed = 1;
    const decreaseFactor = 0.01;
    let lastWheelTime = Date.now();
    const handleWheel = (event) => {
      event.preventDefault();

      wheelSpeed += event.deltaY * 0.001;
      lastWheelTime = Date.now();
      console.log(wheelSpeed);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });

    // Mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = Math.PI;
    scene.add(mesh);

    const animate = () => {
      const delta = clock.getDelta();
      const t = clock.getElapsedTime();
      const currentTime = Date.now();
      const elapsedTime = currentTime - lastWheelTime;

      if (elapsedTime > 1200) {
        if (wheelSpeed > 1) {
          console.log(wheelSpeed);
          wheelSpeed -= 1;
        }
      }

      material.uniforms.speed.value = wheelSpeed;
      // console.log(materialSpeed);
      material.uniforms.time.value = t;

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

export default AniStar;
