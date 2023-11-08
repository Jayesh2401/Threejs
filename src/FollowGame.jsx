import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "three/addons/objects/Water.js";
import { Sky } from "three/addons/objects/Sky.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";
import { Font } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

function FollowGame() {
  const canvasRef = useRef(null);
  const lifesRef = useRef(3);

  let water,
    sun,
    mesh,
    mixer,
    clips,
    clipAction,
    robot,
    mixerflame,
    textMesh,
    skull,
    movementTimeout,
    coin,
    gameover = false,
    isRobotMoving = false,
    coinPoint = 0;

  const coinPositions = [];
  const skullPositions = [];
  const coinIds = [];
  const skullIds = [];
  let clock = new THREE.Clock();
  const [points, setPoints] = useState(0);
  const [lifes, setLifes] = useState(3);
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      1,
      20000
    );
    scene.add(camera);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,  
      antialias: true,
    }); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    sun = new THREE.Vector3();

    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        "waternormals.jpg",
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined,
    });

    water.rotation.x = -Math.PI / 2;

    scene.add(water);

    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;

    skyUniforms["turbidity"].value = 10;
    skyUniforms["rayleigh"].value = 1;
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.6;

    const parameters = {
      elevation: 2,
      azimuth: 170,
    };

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    let renderTarget;

    function updateSun() {
      const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
      const theta = THREE.MathUtils.degToRad(parameters.azimuth);

      sun.setFromSphericalCoords(1, phi, theta);

      sky.material.uniforms["sunPosition"].value.copy(sun);
      water.material.uniforms["sunDirection"].value.copy(sun).normalize();

      if (renderTarget !== undefined) renderTarget.dispose();

      renderTarget = pmremGenerator.fromScene(sky);

      scene.environment = renderTarget.texture;
    }

    updateSun();

    const ambientLight = new THREE.AmbientLight("#fff", 0.1);
    // ambientLight.position.set(1,1,5)
    scene.add(ambientLight);

    const directionalLight2 = new THREE.DirectionalLight("white", 0.5);
    directionalLight2.position.set(-5, 50, 4500);
    scene.add(directionalLight2);

    const photo = new THREE.TextureLoader();
    const sphereGalaxy = photo.load("test.jpg");
    sphereGalaxy.wrapS = THREE.RepeatWrapping;
    sphereGalaxy.wrapT = THREE.RepeatWrapping;
    sphereGalaxy.repeat.set(1, 40);

    const geometry = new THREE.BoxGeometry(100, 5, 4700);
    const material = new THREE.MeshBasicMaterial({
      map: sphereGalaxy,
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.z = 2400;
    scene.add(cube);

    const loader = new GLTFLoader();

    const loadCoin = new Promise((resolve, reject) => {
      loader.load(
        "stylized_coin.glb",
        (gltf) => {
          const coin = gltf.scene;
          coin.position.y = 25;
          coin.position.z = 4400;
          coin.rotation.y = Math.PI / 6;
          coin.scale.set(10, 10, 10);
          resolve(coin);
        },
        undefined,
        reject
      );
    });

    const loadSkull = new Promise((resolve, reject) => {
      loader.load(
        "forest_skull.glb",
        (gltf) => {
          const skull = gltf.scene;
          skull.position.y = 25;
          skull.position.x = 25;
          skull.position.z = 4400;
          skull.rotation.y = Math.PI / 6;
          skull.scale.set(1, 1, 1);
          resolve(skull);
        },
        undefined,
        reject
      );
    });
    const redSkull = new Promise((resolve, reject) => {
      loader.load(
        "hannya_mask_skull.glb",
        (gltf) => {
          const skull = gltf.scene;
          skull.position.y = 25;
          skull.position.x = 25;
          skull.position.z = 4400;
          skull.rotation.y = Math.PI / 6;
          skull.scale.set(30, 30, 30);
          resolve(skull);
        },
        undefined,
        reject
      );
    });

    Promise.all([loadCoin, redSkull])
      .then(([coin, skull]) => {
        const replicationSpacingX = 18;
        const replicationRowCount = 40;
        const replicationColCount = 3;

        const totalWidth = replicationColCount * replicationSpacingX;
        const rowStartX = -totalWidth / 2;

        const totalZRange = 4400 - 40;
        const replicationSpacingZ = totalZRange / replicationRowCount;

        for (let i = 0; i < replicationRowCount; i++) {
          const rowStartZ = 40 + i * replicationSpacingZ;

          const pattern = getRandomPattern();

          for (let j = 0; j < replicationColCount; j++) {
            const replicationIndex = j % pattern.length;

            let columnX;

            if (j === 0) {
              columnX = 1;
            } else if (j === 1) {
              columnX = 25;
            } else if (j === 2) {
              columnX = 48;
            }

            if (pattern[replicationIndex] === "coin") {
              const replicatedModel = coin.clone();
              replicatedModel.position.x = rowStartX + columnX;
              replicatedModel.position.z = rowStartZ - 25;
              replicatedModel.userData.type = "coin";
              replicatedModel.userData.id = `coin_${i}_${j}`;
              replicatedModel.name = `coin_${i}_${j}`;
              scene.add(replicatedModel);

              coinPositions.push({
                x: replicatedModel.position.x,
                y: replicatedModel.position.y,
                z: replicatedModel.position.z,
                i,
                j,
              });
            } else if (pattern[replicationIndex] === "skull") {
              const replicatedModel = skull.clone();
              replicatedModel.position.x = rowStartX + columnX;
              replicatedModel.position.z = rowStartZ - 25;
              replicatedModel.userData.type = "skull";
              replicatedModel.userData.id = `skull_${i}_${j}`;
              replicatedModel.name = `skull_${i}_${j}`;
              scene.add(replicatedModel);

              skullPositions.push({
                x: replicatedModel.position.x,
                y: replicatedModel.position.y,
                z: replicatedModel.position.z,
                i,
                j,
              });
            }
          }
        }
      })
      .catch((error) => {
        console.error("Error loading models:", error);
      });

    function getRandomPattern() {
      const patterns = [
        ["skull", "skull", "coin"],
        ["skull", "coin", "skull"],
        ["skull", "coin", "coin"],
        ["coin", "skull", "skull"],
        ["coin", "coin", "skull"],
        ["coin", "skull", "coin"],
        // Add more patterns here if needed
      ];
      const randomIndex = Math.floor(Math.random() * patterns.length);
      return patterns[randomIndex];
    }

    const handleCollision = () => {
      const robotPosition = robot.position.clone();
      coinPositions.forEach(({ x, y, z, i, j }, index) => {
        const distance = robotPosition.distanceTo({ x, y, z });
        if (distance < 15) {
          const coinToRemove = scene.getObjectByName(`coin_${i}_${j}`);
          if (coinToRemove) {
            scene.remove(coinToRemove);
            coinPositions.splice(index, 1);
            console.log(`Coin ${index} removed from the scene.`);
            setPoints((prev) => prev + 1);
          }
        }
      });

      skullPositions.forEach(({ x, y, z, i, j }, index) => {
        const distance = robotPosition.distanceTo({ x, y, z });
        if (distance < 15) {
          const coinToRemove = scene.getObjectByName(`skull_${i}_${j}`);
          if (coinToRemove) {
            scene.remove(coinToRemove);
            coinPositions.splice(index, 1);
            console.log(`skull ${index} removed from the scene.`, lifes);

            lifesRef.current = lifesRef.current - 1;
            if (lifesRef.current === 0) {
              // Lifes reached 0, stop renderer and display restart button
              gameover = true;
              // setTimeout(() => {
              while (scene.children.length > 0) {
                const object = scene.children[0];
                scene.remove(object);
              }

              const textureLoader = new THREE.TextureLoader();
              const matcapTexture = textureLoader.load("mat2.jpg");
              const ttfLoader = new TTFLoader();

              ttfLoader.load(
                "Cinzel_Decorative/CinzelDecorative-Regular.ttf",
                (fontData) => {
                  const font = new Font(fontData);
                  const textGeometry = new TextGeometry("Game Over", {
                    font: font,
                    size: 10,
                    height: 10,
                    curveSegments: 32,
                    bevelEnabled: true,
                    bevelThickness: 0.5,
                    bevelSize: 0.5,
                    bevelSegments: 8,
                  });
                  const material = new THREE.MeshMatcapMaterial({
                    matcap: matcapTexture,
                  });

                  textMesh = new THREE.Mesh(textGeometry, material);

                  scene.add(textMesh);
                }
              );
              return;
              // }, 2000);
            }
            setLifes((prev) => prev - 1);
          }
        }
      });
    };

    // const handleCollision = () => {
    //   const robotPosition = robot.position.clone();
    //   coinPositions.forEach((coinPosition, index) => {
    //     const distance = robotPosition.distanceTo(coinPosition);
    //     // console.log(distance);
    //     if (distance < 20) {
    //       console.log("Collision with coin:", index);

    //       const coinToRemove = scene.getObjectByName(`coin_${index}`);
    //       if (coinToRemove) {
    //         scene.remove(coinToRemove);
    //         coinPositions.splice(index, 1);
    //         console.log(`Coin ${index} removed from the scene.`);
    //         setPoints(points + 1);
    //       }
    //     }
    //   });
    // };

    // const handleCollision = () => {
    //   const robotPosition = robot.position.clone(); // Get robot's position

    //   // console.log(skullPositions, coinPositions);
    // };

    //   Promise.all([loadCoin, loadSkull])
    // .then(([coin, skull]) => {
    //   const replicationPattern = [
    //     "skull",
    //     "skull",
    //     "coin",
    //     "coin",
    //     "coin",
    //     "skull",
    //   ];
    //   const replicationSpacingX = 15;
    //   const replicationSpacingZ = 100;
    //   const replicationRowCount = 100;
    //   const replicationColCount = 3;

    //   for (let i = 0; i < replicationRowCount; i++) {
    //     const rowStartX = -(replicationColCount / 2) * replicationSpacingX;
    //     const rowStartZ =  25 + i * replicationSpacingZ;

    //     for (let j = 0; j < replicationColCount; j++) {
    //       const replicationIndex = (i % replicationPattern.length) * replicationColCount + j;
    //       if (replicationPattern[replicationIndex] === "coin") {
    //         const replicatedModel = coin.clone();
    //         replicatedModel.position.x = rowStartX + j * replicationSpacingX;
    //         replicatedModel.position.z = rowStartZ;
    //         scene.add(replicatedModel);
    //       } else if (replicationPattern[replicationIndex] === "skull") {
    //         const replicatedModel = skull.clone();
    //         replicatedModel.position.x = rowStartX + j * replicationSpacingX;
    //         replicatedModel.position.z = rowStartZ;
    //         scene.add(replicatedModel);
    //       }
    //     }
    //   }
    // })
    // .catch((error) => {
    //   console.error("Error loading models:", error);
    // });

    // Promise.all([loadCoin, loadSkull])
    //   .then(([coin, skull]) => {
    //     const replicationPattern = ["skull", "skull", "coin"];
    //     const replicationSpacing = 225;
    //     const replicationCount = 100;

    //     for (let i = 0; i < replicationCount; i++) {
    //       const replicationIndex = i % replicationPattern.length;

    //       if (replicationPattern[replicationIndex] === "coin") {
    //         const replicatedModel = coin.clone();
    //         replicatedModel.position.x =
    //           i % 3 === 0 ? -replicationSpacing : replicationSpacing;
    //         replicatedModel.position.z =
    //           25 + Math.floor(i / 3) * replicationSpacing;
    //         scene.add(replicatedModel);
    //       } else if (replicationPattern[replicationIndex] === "skull") {
    //         const replicatedModel = skull.clone();
    //         replicatedModel.position.z =
    //           25 + Math.floor(i / 3) * replicationSpacing;
    //         scene.add(replicatedModel);
    //       }
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error loading models:", error);
    //   });

    // Promise.all([loadCoin, loadSkull])
    //   .then(([coin, skull]) => {
    //     const replicationPattern = ["skull", "skull", "coin"];
    //     const replicationSpacing = 225;
    //     const replicationCount = 100;

    //     for (let i = 0; i < replicationCount; i++) {
    //       const replicationIndex = i % replicationPattern.length;

    //       if (replicationPattern[replicationIndex] === "coin") {
    //         const replicatedModel = coin.clone();
    //         replicatedModel.position.z = 25 + i * replicationSpacing;
    //         scene.add(replicatedModel);
    //       } else if (replicationPattern[replicationIndex] === "skull") {
    //         const replicatedModel = skull.clone();
    //         replicatedModel.position.z = 25 + i * replicationSpacing;
    //         scene.add(replicatedModel);
    //       }
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error loading models:", error);
    //   });

    // loader.load("stylized_coin.glb", (gltf) => {
    //   coin = gltf.scene;
    //   coin.position.y = 25;
    //   coin.position.z = 4400;
    //   coin.rotation.y = Math.PI / 6;
    //   coin.scale.set(10, 10, 10);
    //   scene.add(coin);
    // });

    // loader.load("forest_skull.glb", (gltf) => {
    //   skull = gltf.scene;
    //   skull.position.y = 25;
    //   skull.position.x = 25;
    //   skull.position.z = 4400;
    //   skull.rotation.y = Math.PI / 6;
    //   skull.scale.set(1, 1, 1);
    //   scene.add(skull);
    // });

    // const replicationPattern = ["skull", "skull", "coin"]; // Define the replication pattern

    // const replicationSpacing = 225; // Adjust the spacing between each replication
    // const replicationCount = 100; // Adjust the number of replications

    // for (let i = 0; i < replicationCount; i++) {
    //   const replicationIndex = i % replicationPattern.length; // Calculate the current index in the replication pattern

    //   if (replicationPattern[replicationIndex] === "coin") {
    //     const replicatedModel = coin.clone();
    //     replicatedModel.position.z = 25 + i * replicationSpacing; // Adjust the starting position and spacing
    //     scene.add(replicatedModel);
    //   } else if (replicationPattern[replicationIndex] === "skull") {
    //     const replicatedModel = skull.clone();
    //     replicatedModel.position.z = 25 + i * replicationSpacing; // Adjust the starting position and spacing
    //     scene.add(replicatedModel);
    //   }
    // }

    // loader.load("stylized_coin.glb", (gltf) => {
    //    coin = gltf.scene;
    //   coin.position.y = 25;
    //   coin.position.z = 4400;
    //   coin.rotation.y = Math.PI / 6;
    //   coin.scale.set(10, 10, 10);
    //   const spacing = 225;
    //   const numReplications = 100;
    //   scene.add(coin);
    //   // for (let i = 0; i < numReplications; i++) {
    //   //   const replicatedModel = root.clone(); // Clone the model

    //   //   // Set the position of the replicated model
    //   //   replicatedModel.position.z = (i + 1) * +spacing;

    //   //   scene.add(replicatedModel); // Add the replicated model to the scene
    //   // }
    // });

    // loader.load("forest_skull.glb", (gltf) => {
    //   skull = gltf.scene;
    //   skull.position.y = 25;
    //   skull.position.x = 25;
    //   skull.position.z = 4400;
    //   skull.rotation.y = Math.PI / 6;
    //   skull.scale.set(1, 1, 1);
    //   scene.add(skull);
    //   // if(animations && animations.length){
    //   //   mixerflame = new THREE.AnimationMixer(root)
    //   //   clipAction = mixerflame.clipAction(animations[0]);
    //   //   clipAction.setLoop(THREE.LoopRepeat);
    //   //   clipAction.play();
    //   //   mixerflame.timeScale = 15;
    //   // }

    //   // for (let i = 0; i < numReplications; i++) {
    //   //   const replicatedModel = root.clone(); // Clone the model

    //   //   // Set the position of the replicated model
    //   //   replicatedModel.position.z = (i + 1) * +spacing;

    //   //   scene.add(replicatedModel); // Add the replicated model to the scene
    //   // }
    // });

    loader.load("stylized_pillar.glb", (gltf) => {
      const root = gltf.scene;
      root.position.y = -4;
      root.position.x = 58;
      // root.position.z = 4500;
      root.rotation.y = Math.PI / 6;
      root.scale.set(80, 80, 80);
      const spacing = 225; // Spacing between replicated models
      const numReplications = 22; // Number of replications

      for (let i = 0; i < numReplications; i++) {
        const replicatedModel = root.clone(); // Clone the model

        // Set the position of the replicated model
        replicatedModel.position.z = (i + 1) * +spacing;

        scene.add(replicatedModel); // Add the replicated model to the scene
      }
    });

    loader.load("stylized_pillar.glb", (gltf) => {
      const root = gltf.scene;
      root.position.y = -4;
      root.position.x = -58;
      // root.position.z = 4500;
      root.rotation.y = Math.PI / 6;
      root.scale.set(80, 80, 80);
      const spacing = 225; // Spacing between replicated models
      const numReplications = 22; // Number of replications

      for (let i = 0; i < numReplications; i++) {
        const replicatedModel = root.clone(); // Clone the model

        // Set the position of the replicated model
        replicatedModel.position.z = (i + 1) * +spacing;

        scene.add(replicatedModel); // Add the replicated model to the scene
      }
    });

    loader.load("stone_array.glb", (gltf) => {
      const root = gltf.scene;
      root.position.y = 14;
      root.position.z = 10;

      root.rotation.y = Math.PI / 4;
      root.scale.set(30, 30, 30);
      scene.add(gltf.scene);
    });
    loader.load("Soldier.glb", (gltf) => {
      robot = gltf.scene;
      robot.position.y = 14;
      // robot.position.z = 25;

      const animations = gltf.animations;

      if (animations && animations.length) {
        mixer = new THREE.AnimationMixer(robot);
        clipAction = mixer.clipAction(animations[0]);
        clipAction.setLoop(THREE.LoopRepeat);
        clipAction.play();
        mixer.timeScale = 0.9;
        clips = {
          idle: mixer.clipAction(gltf.animations[0]),
          running: mixer.clipAction(gltf.animations[1]),
          walking: mixer.clipAction(gltf.animations[3]),
        };
      }
      robot.rotation.y = 0.3;
      robot.position.z = 4500;
      // robot.position.x = -30;
      robot.scale.set(15, 15, 15);
      scene.add(gltf.scene);
    });

    function updateCameraPosition() {
      if (robot && !gameover) {
        console.log("sevrsv");
        camera.position.copy(robot.position);
        camera.position.y += 50;
        camera.position.z += 150;
        camera.lookAt(robot.position);
      }

      if(gameover && textMesh){
        camera.position.copy(textMesh.position);
        camera.position.y += 10;
        camera.position.z += 450;
        camera.lookAt(textMesh.position);
      }
    }

    const keys = {
      a: {
        pressed: false,
      },
      al: {
        pressed: false,
      },
      d: {
        pressed: false,
      },
      dr: {
        pressed: false,
      },
      s: {
        pressed: false,
      },
      w: {
        pressed: false,
      },
      enter: {
        pressed: false,
      },
    };

    window.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "KeyA":
          keys.a.pressed = true;
          break;
        case "ArrowLeft":
          keys.al.pressed = true;
          break;
        case "KeyD":
          keys.d.pressed = true;
          break;
        case "ArrowRight":
          keys.dr.pressed = true;
          break;
        case "KeyS":
          keys.s.pressed = true;
          break;
        case "KeyW":
          keys.w.pressed = true;
          break;
        case "Enter":
          keys.enter.pressed = true;
          break;
        case "Space":
          // updateRobotMesh();
          setTimeout(() => {
            // robotBody.position.y = 0;
          }, 1000);
          break;
      }
    });

    window.addEventListener("keyup", (event) => {
      if (event.code === "Enter") {
        // Clear the movement timeout when Enter key is released
        clearTimeout(movementTimeout);
      }

      switch (event.code) {
        case "KeyA":
          keys.a.pressed = false;
          // clips.idle.play();
          // clips.walking.stop();
          // clips.running.stop();

          break;
        case "ArrowLeft":
          keys.al.pressed = false;
          // clips.idle.play();
          // clips.walking.stop();
          // clips.running.stop();

          break;
        case "KeyD":
          keys.d.pressed = false;
          // clips.idle.play();
          // clips.walking.stop();

          // clips.running.stop();

          break;
        case "ArrowRight":
          keys.dr.pressed = false;
          // clips.idle.play();
          // clips.walking.stop();

          // clips.running.stop();

          break;
        case "KeyS":
          keys.s.pressed = false;
          // clips.idle.play();
          // clips.walking.stop();

          // clips.running.stop();

          break;
        case "KeyW":
          keys.w.pressed = false;
          // clips.idle.play();
          // clips.walking.stop();

          // clips.running.stop();

          break;

        case "Space":
          //   robotBody.position.y = 0;
          break;
      }
    });

    let previousTime = 0;

    const animate = (currentTime) => {
      requestAnimationFrame(animate);
      water.material.uniforms["time"].value += 10.0 / 60.0;
      const deltaTime = (currentTime - previousTime) / 1000;
      if (robot) {
        handleCollision();
      }

      skullPositions.forEach((skullPosition) => {
        const skullObject = scene.getObjectByName(
          `skull_${skullPosition.i}_${skullPosition.j}`
        );
        if (skullObject) {
          skullObject.rotation.y += 1 * deltaTime; // Adjust the rotation speed as needed
        }
      });

      // Rotate coin objects
      coinPositions.forEach((coinPosition) => {
        const coinObject = scene.getObjectByName(
          `coin_${coinPosition.i}_${coinPosition.j}`
        );
        if (coinObject) {
          coinObject.rotation.y += 1 * deltaTime; // Adjust the rotation speed as needed
        }
      });

      updateCameraPosition();
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }

      if (mixerflame) {
        mixerflame.update(delta);
      }
      // console.log("came");
      if (keys.a.pressed) {
        if (robot.position.x >= -23) {
          robot.position.x -= 50 * deltaTime ;
        }
        // clips.walking.play();
      } else if (keys.d.pressed) {
        if (robot.position.x <= 23) {
          robot.position.x += 50 * deltaTime;
        }
      }

      if (keys.al.pressed) {
        if (robot.position.x >= -23) {
          robot.position.x -= 50* deltaTime;
        }
        // clips.walking.play();
      } else if (keys.dr.pressed) {
        if (robot.position.x <= 23) {
          robot.position.x += 50 * deltaTime;
        }
      }

      if (keys.enter.pressed && !isRobotMoving) {
        // isRobotMoving = true; // Set the flag to indicate the robot is in motion
        if (robot.position.z <= 25) {
          robot.rotation.y = 3.14;
          isRobotMoving = true;
          clips.running.stop();

          return;
        }
        robot.position.z -= 100 * deltaTime;

        clips.running.play();
      }

      renderer.render(scene, camera);
      previousTime = currentTime;
    };
    requestAnimationFrame((currentTime) => {
      previousTime = currentTime; // Initialize the previous timestamp
      animate(currentTime);
    });
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        id="scoreboard-container"
        style={{
          position: "absolute",
          fontSize: "30px",
          top: "30px",
          left: "90vw",
        }}
      >
        Score : {points} <br />
        Lifes : {lifes}
      </div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default FollowGame;
