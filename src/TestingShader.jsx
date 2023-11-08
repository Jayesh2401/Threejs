import { useEffect, useRef } from "react";
import * as THREE from "three";
import vShader from "./TestingShader/vertexShader.glsl.js";
import fShader from "./TestingShader/fragmentShader.glsl.js";

function TestingShader() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();

  useEffect(() => {
    const canvas = canvasRef.current;
    let clock = new THREE.Clock();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x88ccee);

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 2;
    scene.add(camera);
    const renderer = new THREE.WebGL1Renderer({
      canvas,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const uniforms = {
      time: { value: 0.5 },
      waterColor: { value: { x: 0.0, y: 0.5, z: 1.0 } },
      //   speed: { value: 15.0 },
      //   charSize: { value: { x: 2.0, y: 1.5 } },
      //   charResolution: { value: 5.5 },
      //   color: { value: new THREE.Color("violet") },
      //   resolution: { value: { x: 1.0, y: 1.0 } },
    };

    const customShaderMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vShader,
      fragmentShader: fShader,
    });

    const cubeMesh = new THREE.Mesh(geometry, customShaderMaterial);
    scene.add(cubeMesh);

    function animate() {
      renderer.render(scene, camera);
      uniforms.time.value = clock.getElapsedTime();
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, []);

  return <canvas ref={canvasRef}>Fpsgame</canvas>;
}

export default TestingShader;
