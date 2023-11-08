import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

function Mirror() {
  const riverRef = useRef(null);
  let water, sun, mesh, textMesh;

  useEffect(() => {
    const canvas = riverRef.current;
    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    let clock = new THREE.Clock();
    const renderer = new THREE.WebGL1Renderer({
      canvas,
      antialias: true,
      //   alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0.0);
    renderer.autoClear = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setSize(screen.width, screen.height);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("pink");

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(30, 20, 100);
    scene.add(camera);

    sun = new THREE.Vector3(0, 0, 0);

    const waterGeometry = new THREE.PlaneGeometry(100, 100);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.minAzimuthAngle = -Math.PI / 7;
    controls.maxAzimuthAngle = Math.PI / 3;
    controls.minPolarAngle = Math.PI / 2.5;
    controls.maxPolarAngle = Math.PI / 2.3;
    controls.minDistance = 100;
    controls.maxDistance = 150;

    water = new Water(waterGeometry, {
      textureWidth: 1024,
      textureHeight: 1024,
      waterNormals: new THREE.TextureLoader().load(
        "ddd.png",
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      //   sunDirection: new THREE.Vector3(),
      sunColor: "black",
      waterColor: "black",
      distortionScale: 0,
      fog: scene.fog !== undefined,
    });
    water.rotation.x = -Math.PI / 2.2;
    water.rotation.z = -Math.PI / 1.7;

    scene.add(water);

    const sky = new Sky();
    // sky.scale.setScalar(120);

    const parameters = {
      elevation: 10,
      azimuth: 10,
    };

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    let renderTarget;

    function updateSun() {
      const phi = THREE.MathUtils.degToRad(80 - parameters.elevation);
      const theta = THREE.MathUtils.degToRad(parameters.azimuth - 1);

      sun.setFromSphericalCoords(1, phi, theta);

      sky.material.uniforms["sunPosition"].value.copy(sun);
      //   water.material.uniforms["sunDirection"].value.copy(sun).normalize();

      if (renderTarget !== undefined) renderTarget.dispose();

      renderTarget = pmremGenerator.fromScene(sky);

      scene.environment = renderTarget.texture;
    }

    updateSun();
    let texture_up = new THREE.TextureLoader().load("icon.png");
    let texture_do = new THREE.TextureLoader().load("icon2.png");
    let fi = new THREE.TextureLoader().load("fi.png");
    let se = new THREE.TextureLoader().load("se.png");
    let th = new THREE.TextureLoader().load("th.png");
    let fo = new THREE.TextureLoader().load("for.webp");
    let five = new THREE.TextureLoader().load("fif.webp");
    let si = new THREE.TextureLoader().load("six.webp");

    const directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(25, 25, 25);
    scene.add(directionalLight);
    const material = [
      new THREE.MeshStandardMaterial({
        // color: "plum",
        // color: "white",
        roughness: 0,
        metalness: 1,
        map: fi,
      }),
      new THREE.MeshStandardMaterial({
        // color: 0x00ff00,
        // color: "white",
        roughness: 0,
        metalness: 1,
        map: se,
      }),
      new THREE.MeshStandardMaterial({
        // color: 0x0000ff,
        // color: "white",
        roughness: 0,
        metalness: 1,
        map: th,
      }),
      new THREE.MeshStandardMaterial({
        // color: 0xffff00,
        // color: "white",
        roughness: 0,
        metalness: 1,
        map: fo,
      }),
      new THREE.MeshStandardMaterial({
        // color: 0xff00ff,
        // color: "white",
        roughness: 0,
        metalness: 1,
        map: five,
      }),
      new THREE.MeshStandardMaterial({
        // color: 0x00ffff,
        // color: "white",
        roughness: 0,
        metalness: 1,
        map: si,
      }),
    ];
    const geometry = new THREE.BoxGeometry(15, 15, 15);
    // const material = new THREE.MeshStandardMaterial({ roughness: 0, metalness:1 , color:"black" });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 15;
    mesh.rotation.x = 1;
    mesh.rotation.y = 1;

    let textureMI = new THREE.TextureLoader().load("s.png");
    let textureMI2 = new THREE.TextureLoader().load("2020-08-31.jpg");

    const leftWall = new THREE.PlaneGeometry(100, 60);
    const materialleft = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      //   color: "red",
      map: textureMI,
      metalness: 1,
    });
    const leftmesh = new THREE.Mesh(leftWall, materialleft);
    leftmesh.rotation.y = Math.PI / 2.4;
    leftmesh.position.y = 24.5;
    leftmesh.position.x = -49;
    leftmesh.position.z = -15;

    // const fiButton = new THREE.BoxGeometry(1, 1, 0.1);
    // const fimaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    // const fimesh = new THREE.Mesh(fiButton, fimaterial);
    // leftmesh.add(fimesh)


    const rightWall = new THREE.PlaneGeometry(107, 50);
    const materiaRight = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      color: "black",
      //   map: textureMI2,
      metalness: 1,
    });
    const rigthtmesh = new THREE.Mesh(rightWall, materiaRight);
    rigthtmesh.rotation.y = -0.31;
    rigthtmesh.position.y = 29.6;
    rigthtmesh.position.x = 10.5;
    rigthtmesh.position.z = -49.9;

    const fontLoader = new FontLoader();

    fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      console.log(font);
      const textGeometry = new TextGeometry("Mindinventory", {
        font: font,
        size: 5,
        height: 1.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 1,
      });

      const textMaterial = new THREE.MeshStandardMaterial({
        color: "red",
        metalness: 1,
      });

      textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(5, 10, 5);

        rigthtmesh.add(textMesh);
    });

    scene.add(mesh, leftmesh, rigthtmesh);

    function render() {
        mesh.rotation.y += 0.01;
        mesh.rotation.z += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
    function handleResize() {
      const { innerWidth, innerHeight } = window;
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      //   scene.dispose();
    };
  }, []);

  return <canvas ref={riverRef}></canvas>;
}

export default Mirror;
