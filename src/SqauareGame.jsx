import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

function SqauareGame() {
  const gameRef = useRef(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const enemiesRef = useRef([]);

  // useEffect(() => {
  //   fetch("https://api.ipify.org?format=json")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const publicIP = data.ip;
  //       console.log("Public IP address:", publicIP , data);
  //       // Use the publicIP value in your game logic
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching public IP address:", error);
  //     });
  // }, []);

  useEffect(() => {
    const canvas = gameRef.current;
    const screen = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    let clock = new THREE.Clock();

    const renderer = new THREE.WebGL1Renderer({
      canvas,
      antialias: true,
    });
    renderer.setSize(screen.width, screen.height);
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(4.61, 2.74, 8);
    const controls = new OrbitControls(camera, canvas);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.y = 3;
    light.position.z = 1;
    light.castShadow = true;
    scene.add(light);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    camera.position.z = 5;

    const playergeo = new THREE.BoxGeometry(1, 1.01, 1);
    const palyerMaterial = new THREE.MeshStandardMaterial({ color: "purple" });
    const playerMesh = new THREE.Mesh(playergeo, palyerMaterial);
    playerMesh.castShadow = true;
    // playerMesh.velocity.y = -0.01
    scene.add(playerMesh);

    const groundgeo = new THREE.BoxGeometry(10, 0.5, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: "white" });
    const groundMesh = new THREE.Mesh(groundgeo, groundMaterial);
    groundMesh.position.y = -1;
    groundMesh.castShadow = true;
    scene.add(groundMesh);

    const keys = {
      a: {
        pressed: false,
      },
      d: {
        pressed: false,
      },
      s: {
        pressed: false,
      },
      w: {
        pressed: false,
      },
    };

    window.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "KeyA":
          keys.a.pressed = true;
          break;
        case "KeyD":
          keys.d.pressed = true;
          break;
        case "KeyS":
          keys.s.pressed = true;
          break;
        case "KeyW":
          keys.w.pressed = true;
          break;
        case "Space":
          playerMesh.position.y = 1.08;
          setTimeout(() => {
            playerMesh.position.y = -0.08;
          }, 1000);
          break;
      }
    });

    window.addEventListener("keyup", (event) => {
      switch (event.code) {
        case "KeyA":
          keys.a.pressed = false;
          break;
        case "KeyD":
          keys.d.pressed = false;
          break;
        case "KeyS":
          keys.s.pressed = false;
          break;
        case "KeyW":
          keys.w.pressed = false;
          break;
        case "Space":
          playerMesh.position.y = -0.08;
          break;
      }
    });

    let frames = 0;
    let spawnRate = 100;
    function boxCollision({ box1, box2 }) {
      const box1BB = new THREE.Box3().setFromObject(box1);
      // console.log(box1BB);
      const box2BB = new THREE.Box3().setFromObject(box2);
      // console.log(box2BB);
      return box1BB.intersectsBox(box2BB);
    }

    function render() {
      if (keys.a.pressed) playerMesh.position.x -= 0.05;
      else if (keys.d.pressed) playerMesh.position.x += 0.05;

      if (keys.s.pressed) playerMesh.position.z += 0.05;
      else if (keys.w.pressed) playerMesh.position.z -= 0.05;

      const enemies = [];

      let time;

      if (frames % spawnRate === 0) {
        if (spawnRate > 20) spawnRate -= 20;
        // console.log(frames, spawnRate, spawnRate > 20);
        const enemyGeometry = new THREE.BoxGeometry(1, 1, 1);
        const enemyMaterial = new THREE.MeshStandardMaterial({ color: "red" });
        const enemyMesh = new THREE.Mesh(enemyGeometry, enemyMaterial);
        enemyMesh.position.x = (Math.random() - 0.5) * 10;
        enemyMesh.position.z = -20;
        enemyMesh.castShadow = true;
        enemiesRef.current.push(enemyMesh);
        enemiesRef.current.forEach((enemyMes) => {
          if (
            boxCollision({
              box1: playerMesh,
              box2: enemyMesh,
            })
          ) {
            cancelAnimationFrame(requestAnimationFrame(render));
          }
          gsap.to(enemyMes.position, {
            duration: 20, // animation duration in seconds
            z: 20, // end position on the z-axis
          });
        });
        scene.add(enemyMesh);
        enemies.push(enemyMesh);
      }
      frames++;

      controls.update();

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }, []);

  return (
    <div>{isGameOver ? <div>Game Over</div> : <canvas ref={gameRef} />}</div>
  );
}

export default SqauareGame;
