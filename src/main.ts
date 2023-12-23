import { DrawingCanvas } from "./drawing/DrawingCanvas";
import { createCanvas } from "./create-canvas";

const main = () => {
  const canvas = createCanvas();
  const drawingCanvas = new DrawingCanvas(canvas);

  const button = document.getElementById("play-button") as HTMLButtonElement;
  button.addEventListener("click", () => {
    drawingCanvas.redrawRecordedPointsAtCenter();
  });
};

main();
