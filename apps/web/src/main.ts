import { DrawingCanvas } from "./drawing/DrawingCanvas";
import { createCanvas } from "./create-canvas";
import { Shape, submitData } from "./client/submit-data";

const main = () => {
  const canvas = createCanvas();
  const drawingCanvas = new DrawingCanvas(canvas);

  const shapeSubmitButtons = document.querySelectorAll(
    "#shape-submit-buttons button"
  );

  for (const button of shapeSubmitButtons) {
    button.addEventListener("click", async () => {
      const shape = button.classList.item(0) as Shape;
      const points = drawingCanvas.getShapePoints();
      await submitData(points, shape);
    });
  }
};

main();
