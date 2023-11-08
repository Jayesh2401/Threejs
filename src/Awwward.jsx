import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DirectionalLightHelper } from "three";

function Awwward() {
  gsap.registerPlugin(ScrollTrigger);
  const timeline = gsap.timeline();
  const canvasRef = useRef(null);
  let clock = new THREE.Clock();
  let rock;
  const lenis = new Lenis({
    duration: 3.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  // window.scrollTo(0, 0);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#7580ab");

    const canvas = canvasRef.current;

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(10, 20, 120);
    camera.rotation.set(Math.PI / 4, 20, 0);
    scene.add(camera);

    const orthographicCamera = new THREE.OrthographicCamera(
      ((-window.innerWidth / window.innerHeight) * 5) / 2,
      ((window.innerWidth / window.innerHeight) * 5) / 2,
      5 / 2,
      -5 / 2,
      -50,
      50
    );

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.enableDamping = true;
    controls.enableZoom = false;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1.75;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const directionalLight = new THREE.DirectionalLight("#fff", 0.5);
    directionalLight.position.set(10, 10, 130);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight("#fff", 0.3);
    scene.add(ambientLight);

    const circleGeometry = new THREE.CircleGeometry(10, 64);
    const circleMaterial = new THREE.MeshStandardMaterial({ color: "#e5a1aa" });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.scale.set(0.6, 0.6, 0.6);
    circle.position.y = 4;
    circle.position.z = -40;
    circle.position.x = 10;
    circle.rotation.x = -Math.PI / 4;
    scene.add(circle);

    const loader = new GLTFLoader();
    loader.load("Stylized_Kitchen.glb", (gltf) => {
      rock = gltf.scene;
      rock.position.y = 5;
      rock.position.x = -72;
      rock.position.z = 40;
      rock.rotation.y = -2;
      rock.rotation.z = 0.03;
      rock.scale.set(0.6, 0.6, 0.6);

      rock.castShadow = true;
      rock.receiveShadow = true;

      rock.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(rock);
      ScrollTrigger.create({
        trigger: ".startCircle",
        start: "top top",
        // markers: true,
        invalidateOnRefresh: true,
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          gsap.to(rock.position, {
            y: gsap.utils.interpolate(5, 7, progress),
            x: gsap.utils.interpolate(-72, -15, progress),
            z: gsap.utils.interpolate(40, 20, progress),
            duration: 1,
            ease: "power2.out",
          });

          gsap.to(circle.scale, {
            y: gsap.utils.interpolate(0.6, 45, progress),
            x: gsap.utils.interpolate(0.6, 45, progress),
            z: gsap.utils.interpolate(0.6, 45, progress),
            duration: 1,
            ease: "power2.out",
          });

          gsap.to(rock.rotation, {
            y: gsap.utils.interpolate(-2, -2.5, progress),
            duration: 1,
            ease: "power2.out",
          });

          gsap.to(rock.scale, {
            x: gsap.utils.interpolate(0.6, 0.5, progress),
            y: gsap.utils.interpolate(0.6, 0.5, progress),
            z: gsap.utils.interpolate(0.6, 0.5, progress),
            duration: 1,
            ease: "power2.out",
          });
        },
      });
    });

    ScrollTrigger.create({
      trigger: ".leftSectionSecond",
      start: "top 100%",
      // markers: true,
      invalidateOnRefresh: true,
      ease: "none",
      end: "top 0%",
      scru: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const radius = gsap.utils.interpolate(700, 0, progress);
        gsap.set(".leftSectionSecond", { borderTopRightRadius: `${radius}px` });
      },
    });

    ScrollTrigger.create({
      trigger: ".leftSectionSecond",
      start: "top 100%",
      // markers: true,
      invalidateOnRefresh: true,
      ease: "none",
      end: "bottom 0%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const radius = gsap.utils.interpolate(-700, 700, progress);
        gsap.set(".leftSectionSecond", {
          borderBottomRightRadius: `${radius}px`,
        });
      },
    });

    ScrollTrigger.create({
      trigger: ".leftSectionSecond",
      start: "top top",
      // markers: true,
      ease: "none",
      invalidateOnRefresh: true,
      end: "bottom bottom",
      scrub: 1,
      // pin: document.querySelector(".progress-wrapper"),
      // pinSpacing: false,
      onUpdate: (self) => {
        const progress = self.progress;
        const sectionHeight = document.querySelector(".leftSectionSecond").clientHeight;

        const progressBarHeight = gsap.utils.interpolate(
          0,
          sectionHeight,
          progress
        );
        gsap.set(".progress-bar", { height: `${progressBarHeight}px` });
      },
    });

    ScrollTrigger.create({
      trigger: ".secondMove",
      start: "top top",
      // markers: true,
      ease: "power2.out",
      invalidateOnRefresh: true,
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        const progress = self.progress;

        gsap.to(rock.position, {
          y: gsap.utils.interpolate(7, 10, progress),
          x: gsap.utils.interpolate(-15, -60, progress),
          z: gsap.utils.interpolate(20, 20, progress),
          duration: 1,
          ease: "power2.out",
        });

        gsap.to(rock.scale, {
          y: gsap.utils.interpolate(0.5, 0.73, progress),
          x: gsap.utils.interpolate(0.5, 0.73, progress),
          z: gsap.utils.interpolate(0.5, 0.73, progress),
          duration: 1,
          ease: "power2.out",
        });
      },
    });
    ScrollTrigger.create({
      trigger: ".second-section",
      start: "top 100%",
      // markers: true,
      ease: "none",
      invalidateOnRefresh: true,
      end: "top 0%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const radius = gsap.utils.interpolate(700, 0, progress);
        gsap.set(".right", {
          borderTopLeftRadius: `${radius}px`,
        });
      },
    });
    ScrollTrigger.create({
      trigger: ".second-section",
      start: "bottom 99%",
      // markers: true,
      invalidateOnRefresh: true,
      end: "bottom 0%",
      scrub: 1,
      ease: "none",
      onUpdate: (self) => {
        const progress = self.progress;
        const radius = gsap.utils.interpolate(0, 700, progress);
        gsap.set(".right", {
          borderBottomLeftRadius: `${radius}px`,
        });
      },
    });

    ScrollTrigger.create({
      trigger: ".second-section",
      start: "top top",
      // markers: true,
      invalidateOnRefresh: true,
      end: "bottom bottom",
      ease: "none",
      scrub: 0.5,
      // ease: "power2.out",
      onUpdate: (self) => {
        const progress = self.progress;
        const sectionHeight = document.querySelector(".section").clientHeight;

        const progressBarHeight = gsap.utils.interpolate(
          0,
          sectionHeight,
          progress
        );
        gsap.set(".progress-barr", { height: `${progressBarHeight}px` });
      },
    });

    ScrollTrigger.create({
      trigger: ".thirdSection",
      start: "top top",
      // markers: true,
      invalidateOnRefresh: true,
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        const progress = self.progress;

        gsap.to(rock.position, {
          y: gsap.utils.interpolate(10, 5, progress),
          x: gsap.utils.interpolate(-60, -140, progress),
          z: gsap.utils.interpolate(20, 50, progress),
          duration: 1,
          ease: "power2.out",
        });

        gsap.to(rock.scale, {
          y: gsap.utils.interpolate(0.73, 1.1, progress),
          x: gsap.utils.interpolate(0.73, 1.1, progress),
          z: gsap.utils.interpolate(0.73, 1.1, progress),
          duration: 1,
          ease: "power2.out",
        });

        gsap.to(rock.rotation, {
          y: gsap.utils.interpolate(-2.5, -1.89, progress),
          duration: 1,
          ease: "power2.out",
        });
      },
    });

    ScrollTrigger.create({
      trigger: ".third-section",
      start: "top 100%",
      // markers: true,
      ease: "none",
      invalidateOnRefresh: true,
      end: "top 0%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const radius = gsap.utils.interpolate(700, 0, progress);
        gsap.set(".left", {
          borderTopRightRadius: `${radius}px`,
        });
      },
    });

    ScrollTrigger.create({
      trigger: ".third-section",
      start: "top 99%",
      // markers: true,
      invalidateOnRefresh: true,
      ease: "none",
      end: "top 0%",
      scrub: 1,
      // ease: "power2.out",
      onUpdate: (self) => {
        const progress = self.progress;
        const radius = gsap.utils.interpolate(0, 700, progress);
        gsap.set(".left", {
          borderBottomRightRadius: `${radius}px`,
        });
      },
    });

    ScrollTrigger.create({
      trigger: ".third-section",
      start: "top top",
      // markers: true,
      invalidateOnRefresh: true,
      end: "bottom bottom",
      ease: "none",
      scrub: 0.5,
      // ease: "power2.out",
      onUpdate: (self) => {
        const progress = self.progress;
        const sectionHeight = document.querySelector(".section").clientHeight;

        const progressBarHeight = gsap.utils.interpolate(
          0,
          sectionHeight,
          progress
        );
        gsap.set(".progress-barrr", { height: `${progressBarHeight}px` });
      },
    });

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

      orthographicCamera.left =
        ((-window.innerWidth / window.innerHeight) * 5) / 2;
      orthographicCamera.right =
        ((window.innerWidth / window.innerHeight) * 5) / 2;
      orthographicCamera.top = 5 / 2;
      orthographicCamera.bottom = -5 / 2;
      orthographicCamera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // useEffect(() => {
  //   requestAnimationFrame(raf);
  //   lenis.on("scroll", ScrollTrigger.update);
  //   gsap.ticker.add((time) => {
  //     lenis.raf(time * 1000);
  //   });
  // }, []);

  requestAnimationFrame(raf);

  return (
    <div>
      <div className="experince">
        <canvas ref={canvasRef} className="experience-canvas"></canvas>
      </div>
      <div className="page">
        <div className="awwardPages">
          <section className="firstPage">
            <div className="firstWrapper">
              <div className="leftSideText">
                <h1>300 Minds</h1>
                <p>Designers | 3D artist</p>
              </div>

              <div className="rightSideText">
                <p>Hope You gonna Enjoy</p>
                <p>start exploring</p>
              </div>
            </div>
          </section>
          <div className="EmptyGap startCircle"></div>
          <section>
            <div className="leftSectionSecond">
              <div className="progressBar-wrapper">
                <div className="progress-bar"></div>
              </div>

              <div className="section-intro-wrapper">
                <h1 className="section-title">
                  <span className="section-title-text">About Me</span>
                  <div className="section-title-decoration styleOne"></div>
                  <div className="section-title-decoration styleTwo"></div>
                  <div className="section-title-decoration styleThree"></div>
                </h1>
                <span className="section-number">01</span>
              </div>

              <div className="section-detail-wrapper">
                <h3 className="section-heading">Hello!</h3>
                <p className="section-text">
                  Hi there 👋! I'm a third-year digital media student from UK
                  currently studying in Germany. My dream is to work for Disney
                  or Pixar one day.
                </p>
                <p className="section-text">
                  {" "}
                  I love creating art and playing with my cats! I also like
                  drinking bubble tea and going for hikes! Totally hippie lol
                  ✌️. Welcome to my portfolio!
                </p>
                <h3 className="section-heading">Lorem Ipsum</h3>
                <p className="section-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
                  expedita qui quae officiis, magni velit iste repellat
                  consequuntur temporibus. Quasi atque officia iste beatae
                  rerum, harum itaque accusamus. At, natus?
                </p>{" "}
                <p className="section-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
                  expedita qui quae officiis, magni velit iste repellat
                  consequuntur temporibus. Quasi atque officia iste beatae
                  rerum, harum itaque accusamus. At, natus?
                </p>{" "}
              </div>
            </div>
          </section>
          <div style={{ height: "300vh" }} className="secondMove"></div>

          <section className="second-section section right">
            <div className="progress-wrapper progress-bar-wrapper-right">
              <div className="progress-barr blue-background"></div>
            </div>

            <div className="section-intro-wrapper blue-text blue-border">
              <h1 className="section-title blue-text blue-border">
                <span className="section-title-text blue-text">My Work</span>
                <div className="section-title-decoration styleOne blue-border"></div>
                <div className="section-title-decoration styleTwo blue-border"></div>
                <div className="section-title-decoration styleThree blue-background blue-border"></div>
              </h1>
              <span className="section-number blue-text">02</span>
            </div>

            <div className="section-detail-wrapper">
              <h3 className="section-heading">Candycane Village</h3>
              <p className="section-text">
                This project is in progress but it's about a super colorful
                village where the entire world including the people are candies.
                So far the story is that they are set out to explore their
                "space" only to realize it's a human that will try to destroy
                them.
              </p>
              <h3 className="section-heading">Rebecca's Reddish Radishes</h3>
              <p className="section-text">
                Oh what's that? Why, it's a red radish! Oop, another one! In
                this playful and comedy animation, Rebecca, a young farmer,
                decided to plant radishes for the first time, but there is a big
                twist!
              </p>
              <h3 className="section-heading">Flora</h3>
              <p className="section-text">
                A heartwarming story about a little orphan girl who tries to
                find her way back home.
              </p>
            </div>
          </section>
          <div style={{ height: "300vh" }} className="thirdSection"></div>

          <section className="third-section section left">
            <div className="progress-wrapper progress-bar-wrapper-left">
              <div className="progress-barrr green-background"></div>
            </div>

            <div className="section-intro-wrapper green-text green-border">
              <h1 className="section-title green-text green-border">
                <span className="section-title-text green-text">
                  Contact Me
                </span>
                <div className="section-title-decoration styleOne green-border"></div>
                <div className="section-title-decoration styleTwo green-border"></div>
                <div className="section-title-decoration styleThree green-background green-border"></div>
              </h1>
              <span className="section-number green-text">03</span>
            </div>

            <div className="section-detail-wrapper">
              <h3 className="section-heading">ArtStation</h3>
              <p className="section-text">
                I post all my work here. I don't want to link it yet because I
                want to sort it out a little bit!
              </p>
              <h3 className="section-heading">Instagram</h3>
              <p className="section-text">
                Check out my personal instagram for travel pics and food and
                stuff.
              </p>
              <h3 className="section-heading">LinkedIn</h3>
              <p className="section-text">Career updates and so much more!</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Awwward;
