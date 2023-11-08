import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function Testmicro2() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();

  useEffect(() => {
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color("black");

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 3;
    camera.position.x = 3;
    camera.position.y = 0;
    scene.add(camera);
    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial()
    );
    // scene.add(cube);

    const textureLoader = new THREE.TextureLoader();
    const partcilesTexture = textureLoader.load("2.png");

    const particleGeometry = new THREE.BufferGeometry();
    const count = 5000;

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      //   color: "#C9A7EB",
      alphaMap: partcilesTexture,
      transparent: true,
      //   alphaTest: 0.001,
      //   depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      //blending can cause perform issue
    });

    const particles = new THREE.Points(particleGeometry, particlesMaterial);
    scene.add(particles);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      const elapsedTime = clock.getElapsedTime();
      // for (let i = 0; i < count; i++) {
      //   const i3 = i * 3;
      //   const x = particleGeometry.attributes.position.array[i3];
      //   particleGeometry.attributes.position.array[i3 + 1] = Math.sin(
      //     elapsedTime + x
      //   );
      // }

    for (let i = 0; i < count; i++) {
            const i3 = i * 2;
            const x = particleGeometry.attributes.position.array[i3];
            particleGeometry.attributes.position.array[i3 + 1] = Math.cos(
              elapsedTime + x
            );
          }

      particleGeometry.attributes.position.needsUpdate = true;
        // particles.position.y = -elapsedTime*0.2
      //   const delta = clock.getDelta();
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

  return <canvas ref={canvasRef}>Testmicro</canvas>;
}

export default Testmicro2;
