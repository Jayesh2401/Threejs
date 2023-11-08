import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Layers = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animation for the second section
    // gsap.to(".second-section", {
    //   scrollTrigger: {
    //     trigger: ".second-section",
    //     start: "top top",
    //     end: "bottom top",
    //     scrub: 1,
    //     pin: true,
    //   },
    // });

    // // Animation for the third section
    // gsap.to(".third-section", {
    //   scrollTrigger: {
    //     trigger: ".third-section",
    //     start: "top top",
    //     end: "bottom top",
    //     scrub: 1,
    //     pin: true,
    //   },
    // });
  }, []);

  return (
    // <div className="stacked-container">
    //   <section className="first-section">
    //     <h2>Section 1</h2>
    //   </section>
    //   <section className="second-section">
    //     <h2>Section 2</h2>
    //   </section>
    //   <section className="third-section">
    //     <h2>Section 3</h2>
    //   </section>
    // </div>
    <div id="wrapper">
      <div id="a" class="panels">
        FIXED PANEL
      </div>
      <div id="b" class="panels">
        Scrolling-Panel 1
      </div>
      <div id="c" class="panels">
        Scrolling-Panel 2
      </div>
      <div id="d" class="panels">
        Scrolling-Panel 3
      </div>
    </div>
  );
};

export default Layers;
