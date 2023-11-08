import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { DoubleSide } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
// import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import * as POSTPROCESSING from "postprocessing";

function Hologram() {
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();
  let pointlight, composer;
  useEffect(() => {
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color("grey");

    const gui = new dat.GUI();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 3;
    // camera.position.x = 3;
    camera.position.y = 1;
    scene.add(camera);
    // const controls = new OrbitControls(camera, canvasRef.current);
    // controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load("mat10.jpg");

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.009, 2, 100, 6.3),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );
    torus.rotation.x = Math.PI / 1.85;
    scene.add(torus);

    const torusArc1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.02, 2, 100, 0.7),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );
    torusArc1.position.x = 0.028;
    torusArc1.rotation.z = Math.PI * 1.75;

    const torusArc2 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.02, 2, 100, 0.7),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );
    torusArc2.position.x = -0.028;
    torusArc2.rotation.z = -Math.PI * 3;

    const torusArc3 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.02, 2, 100, 0.7),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );
    torusArc3.position.y = 0.028;
    torusArc3.rotation.z = Math.PI / 2.5;

    torus.add(torusArc1, torusArc2, torusArc3);

    const directionalLight = new THREE.DirectionalLight("white", 5);
    directionalLight.position.set(0, 1, 2);
    // scene.add(directionalLight);

    const helper = new THREE.DirectionalLightHelper(directionalLight, 0.1);
    // scene.add(helper);

    const ambientLight = new THREE.AmbientLight("#fff", 1);
    scene.add(ambientLight);

    const sphere = new THREE.SphereGeometry(0.1, 16, 8);
    const center = new THREE.Mesh(
      sphere,
      new THREE.MeshBasicMaterial({ color: "cyan" })
    );
    torus.add(center);

    // const check = new THREE.Mesh(
    //   new THREE.BoxGeometry(0.2, 0.2, 0.2),
    //   new THREE.MeshStandardMaterial({ color: "white" })
    // );
    // check.position.y = 0.25;
    // scene.add(check);

    // const lightPosition = new THREE.Vector3(0, 0.2, 0);
    // const light = new THREE.PointLight("cyan", 1000, 1, 20);
    // light.position.copy(lightPosition);
    // scene.add(light);

    let godraysEffect = new POSTPROCESSING.GodRaysEffect(camera, center, {
      resolutionScale: 0.8,
      density: 1.2,
      decay: 0.96,
      exposure: 0.5,
      weight: 0.5,
      samples: 100,
    });

    const fogColor = new THREE.Color("cyan");
    const fog = new THREE.FogExp2(fogColor, 0.8);
    // fog.position.y = 1;
    // scene.add(fog)
    scene.fog = fog;

    let renderPass = new POSTPROCESSING.RenderPass(scene, camera);
    let effectPass = new POSTPROCESSING.EffectPass(camera, godraysEffect);
    effectPass.renderToScreen = true;

    composer = new POSTPROCESSING.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(effectPass);

    const animate = () => {
      requestAnimationFrame(animate);
      torus.rotation.z += 0.005;
      //   controls.update();
      //   renderer.render(scene, camera);
      composer.render(0.1);
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

export default Hologram;
