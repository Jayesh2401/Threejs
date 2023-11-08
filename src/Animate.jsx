import React, { useEffect } from "react";
import { gsap } from "gsap";

function Animate() {
  useEffect(() => {
    gsap.registerEffect({
      name: "explode",
      effect: (targets, config) => {
        return gsap.to(targets, { duration: config.duration, opacity: 1 });
      },
      defaults: { duration: 5 },
      extendTimeline: true,
    });

    // now we can use it like this:
    gsap.effects.explode(".boxx", {
      // direction: "up",
      // duration: 3
    });

    gsap.from(".dd", {
      opacity: 0,
      y: 100,
      duration: 1,
    });
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div className="boxx"></div>
      <div className="dd green"></div>
      <div className="dd orange"></div>
      <div className="dd grey"></div>
    </div>
  );
}

export default Animate;
