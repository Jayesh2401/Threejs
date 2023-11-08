import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { DoubleSide } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
// import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import * as POSTPROCESSING from "postprocessing";
import Trial from "./Trial";
import gsap from "gsap";

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
    // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load("mat13.jpg");

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(1.3, 0.009, 2, 100, 6.3),
      new THREE.MeshStandardMaterial({
        color: "cyan",
        // map: matcapTexture,
      })
    );
    torus.rotation.x = Math.PI / 1.85;
    scene.add(torus);

    const torusArc1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.02, 2, 100, 0.7),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );
    torusArc1.position.x = 0.325;
    torusArc1.rotation.z = Math.PI * 1.89;

    const torusArc2 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.02, 2, 100, 0.7),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );
    torusArc2.position.x = -0.325;
    torusArc2.rotation.z = -Math.PI * 1.12;
    // torusArc2.rotation.y = 0.1;
    // torusArc2.rotation.x = 0.1;

    const torusArc3 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.02, 2, 100, 0.7),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );
    torusArc3.position.y = 0.325;
    torusArc3.rotation.z = Math.PI / 2.56;

    const torus2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.26, 0.002, 2, 100, 6.3),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );

    const torus3 = new THREE.Mesh(
      new THREE.TorusGeometry(1.22, 0.008, 2, 100, 6.3),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );

    const torus4 = new THREE.Mesh(
      new THREE.TorusGeometry(1.19, 0.002, 2, 100, 6.3),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );

    const torus4Arc1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.02, 2, 100, 0.4),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );
    torus4Arc1.position.x = -0.172;
    torus4Arc1.rotation.z = Math.PI * 2.97;

    const tri1 = new THREE.Mesh(
      new THREE.CircleGeometry(0.18, 32, 0, 1.3),
      new THREE.MeshBasicMaterial({ color: "cyan", side: DoubleSide })
    );
    tri1.position.set(0.82, 0.18, 0.012);
    tri1.rotation.z = -0.51;
    torus4Arc1.add(tri1);

    const torus4Arc2 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.02, 2, 100, 0.4),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );
    torus4Arc2.position.x = 0.175;
    torus4Arc2.rotation.z = Math.PI * 1.999;

    const tri2 = new THREE.Mesh(
      new THREE.CircleGeometry(0.18, 32, 0, 1.3),
      new THREE.MeshBasicMaterial({ color: "cyan", side: DoubleSide })
    );
    tri2.position.set(0.82, 0.16, 0.008);
    tri2.rotation.z = -0.4;
    torus4Arc2.add(tri2);

    const torus4Arc3 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.02, 2, 100, 0.4),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );
    torus4Arc3.position.y = -0.168;
    torus4Arc3.rotation.z = -Math.PI / 1.8;

    const tri3 = new THREE.Mesh(
      new THREE.CircleGeometry(0.18, 32, 0, 1.3),
      new THREE.MeshBasicMaterial({ color: "cyan", side: DoubleSide })
    );
    tri3.position.set(0.82, 0.17, 0.01);
    tri3.rotation.z = -0.4;
    torus4Arc3.add(tri3);

    const torus4Arc4 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.02, 2, 100, 0.4),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );
    torus4Arc4.position.y = 0.168;
    torus4Arc4.rotation.z = Math.PI / 2.3;

    const tri4 = new THREE.Mesh(
      new THREE.CircleGeometry(0.18, 32, 0, 1.3),
      new THREE.MeshBasicMaterial({ color: "cyan", side: DoubleSide })
    );
    tri4.position.set(0.82, 0.17, 0.01);
    tri4.rotation.z = -0.4;
    torus4Arc4.add(tri4);

    torus4.add(torus4Arc1, torus4Arc2, torus4Arc3, torus4Arc4);

    const torus5 = new THREE.Mesh(
      new THREE.TorusGeometry(0.91, 0.003, 2, 100, 0),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );

    const torus6 = new THREE.Mesh(
      new THREE.TorusGeometry(0.87, 0.018, 2, 100, 0),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );

    // const geometry = torus6.geometry;
    // console.log(geometry);
    // // Set the initial arc position to 0
    // geometry.parameters.arc = 0;

    // // Animate the arc position to 6.4 over 5 seconds using GSAP
    // gsap.to(geometry.parameters, { arc: 6.4, duration: 5 });

    const torus7 = new THREE.Mesh(
      new THREE.TorusGeometry(0.825, 0.002, 2, 100, 0),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );

    const torus8 = new THREE.Mesh(
      new THREE.TorusGeometry(0.75, 0.002, 2, 100, 0),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );

    const torus9 = new THREE.Mesh(
      new THREE.TorusGeometry(0.715, 0.015, 2, 100, 0),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );

    const torus10 = new THREE.Mesh(
      new THREE.TorusGeometry(0.68, 0.002, 2, 100, 0),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );

    const torus11 = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.002, 2, 100, 0),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );
    const torus12 = new THREE.Mesh(
      new THREE.TorusGeometry(0.505, 0.019, 2, 100, 0),
      new THREE.MeshStandardMaterial({ color: "cyan" })
    );

    torus.add(
      torusArc1,
      torusArc2,
      torusArc3,
      torus2,
      torus3,
      torus4,
      torus5,
      torus6,
      torus7,
      torus8,
      torus9,
      torus10,
      torus11,
      torus12
    );

    const directionalLight = new THREE.DirectionalLight("white", 5);
    directionalLight.position.set(0, 1, 2);
    // scene.add(directionalLight);

    const helper = new THREE.DirectionalLightHelper(directionalLight, 0.1);
    // scene.add(helper);

    const ambientLight = new THREE.AmbientLight("#fff", 1);
    scene.add(ambientLight);

    const sphere = new THREE.SphereGeometry(0, 16, 8);
    const center = new THREE.Mesh(
      sphere,
      new THREE.MeshBasicMaterial({ color: "cyan" })
    );
    center.position.z = 0.15;
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

    // **********************************

    let godraysEffect = new POSTPROCESSING.GodRaysEffect(camera, center, {
      resolutionScale: 0.8,
      density: 0.9,
      decay: 0.96,
      // exposure: 0.5,
      weight: 0.25,
      // samples: 100,
    });

    // const fogColor = new THREE.Color("cyan");
    // const fog = new THREE.FogExp2(fogColor, 0.8);
    // fog.position.y = 1;
    // scene.add(fog)
    // scene.fog = fog;

    let renderPass = new POSTPROCESSING.RenderPass(scene, camera);
    let effectPass = new POSTPROCESSING.EffectPass(camera, godraysEffect);
    effectPass.renderToScreen = true;

    composer = new POSTPROCESSING.EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(effectPass);

    const torusArray = [torus, torus2, torus3, torus4, torus5, torus6, torus7];

    // function to set random rotation to each torus in the array
    // const setRandomRotation = () => {
    //   torusArray.forEach((torus) => {
    //     torus.rotation.x = Math.random() * Math.PI * 2;
    //     torus.rotation.y = Math.random() * Math.PI * 2;
    //     torus.rotation.z = Math.random() * Math.PI * 2;
    //   });
    // };
    // setRandomRotation();

    const animate = () => {
      requestAnimationFrame(animate);
      // setRandomRotation();
      const delta = clock.getDelta();
      // console.log(delta)
      // torus.rotation.z += 0.001;
      // torus.rotateZ(0.001);
      torusArray.forEach((torus) => {
        torus.rotation.z += Math.random() * 0.01;
      });

      if (torus12.position.z <= -0.14) {
        if (center.geometry.parameters.radius < 0.1) {
          center.geometry = new THREE.SphereGeometry(
            (center.geometry.parameters.radius += 0.003),
            16,
            8
          );
        }
      }

      if (torus12.position.z < -0.05) {
        if (center.position.z > -0.25) {
          center.position.z -= 0.01;
        }
      }

      // torus.rotation.z += 0.001;

      if (torus6.geometry.parameters.arc < 6.4) {
        torus6.geometry = new THREE.TorusGeometry(
          0.87,
          0.018,
          2,
          100,
          (torus6.geometry.parameters.arc += 0.05)
        );
        torus5.geometry = new THREE.TorusGeometry(
          0.91,
          0.003,
          2,
          100,
          (torus5.geometry.parameters.arc += 0.05)
        );
        torus7.geometry = new THREE.TorusGeometry(
          0.825,
          0.002,
          2,
          100,
          (torus7.geometry.parameters.arc += 0.05)
        );
      }

      if (torus6.geometry.parameters.arc > 4) {
        if (torus9.geometry.parameters.arc > -6.4) {
          torus8.geometry = new THREE.TorusGeometry(
            0.75,
            0.002,
            2,
            100,
            (torus8.geometry.parameters.arc -= 0.05)
          );
          torus9.geometry = new THREE.TorusGeometry(
            0.715,
            0.015,
            2,
            100,
            (torus9.geometry.parameters.arc -= 0.05)
          );
          torus10.geometry = new THREE.TorusGeometry(
            0.68,
            0.002,
            2,
            100,
            (torus10.geometry.parameters.arc -= 0.05)
          );
        }
      }

      if (torus9.geometry.parameters.arc < -3.4) {
        if (torus11.geometry.parameters.arc < 6.4) {
          torus11.geometry = new THREE.TorusGeometry(
            0.55,
            0.002,
            2,
            100,
            (torus11.geometry.parameters.arc += 0.05)
          );
          torus12.geometry = new THREE.TorusGeometry(
            0.505,
            0.019,
            2,
            100,
            (torus12.geometry.parameters.arc += 0.05)
          );
        }
      }

      if (torus11.geometry.parameters.arc >= 6.4) {
        if (torus6.position.z > -0.05) {
          torus5.position.z -= 0.005;
          torus6.position.z -= 0.005;
          torus7.position.z -= 0.005;
        }
      }
      // console.log(torus6.position.z >= -0.045);
      if (torus6.position.z <= -0.045) {
        if (torus9.position.z >= -0.1) {
          torus8.position.z -= 0.005;
          torus9.position.z -= 0.005;
          torus10.position.z -= 0.005;
        }
      }

      if (torus9.position.z <= -0.09) {
        if (torus11.position.z >= -0.15) {
          torus11.position.z -= 0.005;
          torus12.position.z -= 0.005;
        }
      }

      // torus.rotation.z += 0.005;
      //   controls.update();
      // renderer.render(scene, camera);
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
