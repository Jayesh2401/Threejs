import React, { useEffect, useRef } from "react";
import Lenis from '@studio-freight/lenis'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function Demo() {
  const divsRef = useRef([]);

  useEffect(() => {
    const randomStrings = [
      "Lorem ipsum dolor sit amet",
      "consectetur adipiscing elit",
      "sed do eiusmod tempor",
      "incididunt ut labore et dolore magna aliqua",
    ];

    divsRef.current.forEach((div, index) => {
      const randomIndex = Math.floor(Math.random() * randomStrings.length);
      div.innerText = randomStrings[randomIndex];
    });
  }, []);

  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    duration: 2.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  })

  function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
  }

  requestAnimationFrame(raf)

  const handleScroll = (target) => {
    // scrollTo(target, 800); // Adjust the duration (in milliseconds) as needed
  };

  return (
    <div className="asscroll-container">
      {/* Placeholder divs */}
      <div
        className="demo-content"
        ref={(el) => (divsRef.current[0] = el)}
      ></div>
      <div
        className="demo-content"
        ref={(el) => (divsRef.current[1] = el)}
      ></div>
      <div
        className="demo-content"
        ref={(el) => (divsRef.current[2] = el)}
      ></div>
      <div
        className="demo-content"
        ref={(el) => (divsRef.current[3] = el)}
      ></div>
    </div>
  );
}

export default Demo;
