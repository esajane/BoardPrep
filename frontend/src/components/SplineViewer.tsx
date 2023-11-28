import React, { useEffect, useRef } from "react";
import { Application } from "@splinetool/runtime";

const SplineComponent = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const app = new Application(canvasRef.current);
      app.load("https://prod.spline.design/g0ALCANDSZCW5LT8/scene.splinecode");
    }
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
      ></canvas>
    </div>
  );
};

export default SplineComponent;
