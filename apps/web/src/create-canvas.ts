export const createCanvas = () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;

  canvas.width = Math.round(window.innerWidth);
  canvas.height = Math.round(window.innerHeight);

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  context.translate(canvas.width / 2, canvas.height / 2);
  // Flip the y-axis
  context.scale(1, -1);

  return canvas;
};
