import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

function Port() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();
  let previous = 0;
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 4;
    // scene.add(camera);
    const gui = new dat.GUI();

    // const controls = new OrbitControls(camera, canvasRef.current);
    // controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const parameters = {
      materialColor: "#ae58c8",
    };

    gui.addColor(parameters, "materialColor").onChange(() => {
      material.color.set(parameters.materialColor);
      particleMaterial.color.set(parameters.materialColor);
    });

    // const cube = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshBasicMaterial({ color: "red" })
    // );
    // scene.add(cube);

    const textureLoader = new THREE.TextureLoader();
    const gardientTexture = textureLoader.load("3.jpg");
    gardientTexture.magFilter = THREE.NearestFilter;

    const material = new THREE.MeshToonMaterial({
      color: parameters.materialColor,
      gradientMap: gardientTexture,
    });

    const objectDistance = 4;

    const mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      material
      //   new THREE.MeshBasicMaterial({ color: "#ff0000" })
    );

    const mesh2 = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 32),
      material
      //   new THREE.MeshBasicMaterial({ color: "#ff0000" })
    );

    const mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      material
      //   new THREE.MeshBasicMaterial({ color: "#ff0000" })
    );

    mesh1.position.y = -objectDistance * 0;
    mesh2.position.y = -objectDistance * 1;
    mesh3.position.y = -objectDistance * 2;

    mesh1.position.x = 2;
    mesh2.position.x = -2;
    mesh3.position.x = 2;

    // mesh1.position.y = 2;
    // mesh1.scale.set(0.5, 0.5, 0.5);

    // mesh2.visible = false;

    // mesh3.position.y = -2;
    // mesh3.scale.set(0.5, 0.5, 0.5);

    scene.add(mesh1, mesh2, mesh3);

    const mestObj = [mesh1, mesh2, mesh3];

    const directionLight = new THREE.DirectionalLight("#ffffff", 1);
    directionLight.position.set(1, 1, 0);
    scene.add(directionLight);

    let scrolly = window.scrollY;

    window.addEventListener("scroll", () => {
      scrolly = window.scrollY;
    });

    const cursor = {
      x: 0,
      y: 0,
    };

    window.addEventListener("mousemove", (event) => {
      cursor.x = event.clientX / window.innerWidth - 0.5;
      cursor.y = event.clientY / window.innerHeight - 0.5;
    });

    const cameraGroup = new THREE.Group();
    scene.add(cameraGroup);
    cameraGroup.add(camera);

    const particlesCount = 1000;
    const positons = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      positons[i * 3 + 0] = (Math.random() - 0.5) * 10;
      positons[i * 3 + 1] =
        objectDistance * 0.9 - Math.random() * objectDistance * 5;
      positons[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positons, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: parameters.materialColor,
      sizeAttenuation: true,
      size: 0.01,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      // const delta = clock.delta
      const deltaTime = elapsedTime - previous;
      previous = elapsedTime;
      //   controls.update();

      camera.position.y = (-scrolly / window.innerHeight) * objectDistance;

      const parallaxX = cursor.x * 0.5;
      const ParallaxY = -cursor.y * 0.5;

      cameraGroup.position.x +=
        (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
      cameraGroup.position.y +=
        (ParallaxY - cameraGroup.position.y) * 5 * deltaTime;

      for (const mesh of mestObj) {
        mesh.rotation.x = elapsedTime * 0.1;
        mesh.rotation.y = elapsedTime * 0.12;
      }

      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  document.body.style.overflow = 'scroll';


  return (
    <>
      <canvas ref={canvasRef} className="bg-port"></canvas>
      <section class="section">
        <h1>My Portfolio</h1>
      </section>
      <section class="section">
        <h2>My projects</h2>
      </section>
      <section class="section">
        <h2>Contact me</h2>
      </section>
    </>
  );
}

export default Port;
