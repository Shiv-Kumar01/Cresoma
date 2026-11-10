import React, { useEffect, useRef } from "react";
import useCanvasLogic from "./useCanvasLogic";

const CanvasArea = ({ boardId }) => {
  const canvasRef = useRef(null);
  const { initCanvas, attachUIHandlers, updateCanvasInfoRef } = useCanvasLogic(canvasRef, boardId);

  useEffect(() => {
    const cleanupCanvas = initCanvas();
    const cleanupHandlers = attachUIHandlers();
    const overlay = document.getElementById("loading-overlay");
    if (overlay) overlay.style.display = "none";
    const interval = setInterval(updateCanvasInfoRef, 300);
    return () => {
      cleanupCanvas?.();
      cleanupHandlers?.();
      clearInterval(interval);
    };
  }, [initCanvas, attachUIHandlers, updateCanvasInfoRef]);

  return <canvas id="main-canvas" ref={canvasRef} className="canvas-react" />;
};

export default CanvasArea;
