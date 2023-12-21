const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.translate(canvas.width / 2, canvas.height / 2);
// Flip the y-axis
ctx.scale(1, -1);

interface Point {
  x: number;
  y: number;
}

const state: {
  drawing: boolean;
  lastPoint: Point;
} = {
  drawing: false,
  lastPoint: { x: 0, y: 0 },
};

function drawLine(from: Point, to: Point) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 10;
  ctx.stroke();
}

function drawArc(point: Point) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, ctx.lineWidth / 2, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
}

canvas.addEventListener("mousedown", (event: MouseEvent) => {
  state.drawing = true;
  const { x, y } = convertToCartesianCoords(event, canvas);
  state.lastPoint = { x, y };
  drawArc(state.lastPoint);
});

canvas.addEventListener("mousemove", (event: MouseEvent) => {
  if (!state.drawing) return;

  const newPoint = convertToCartesianCoords(event, canvas);
  drawLine(state.lastPoint, newPoint);
  drawArc(newPoint);

  state.lastPoint = newPoint;
});

canvas.addEventListener("mouseup", () => {
  state.drawing = false;
});

canvas.addEventListener("mouseout", () => {
  state.drawing = false;
});

function convertToCartesianCoords(
  event: MouseEvent,
  canvas: HTMLCanvasElement
) {
  let rect = canvas.getBoundingClientRect();

  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  x -= canvas.width / 2;
  y -= canvas.height / 2;

  y = -y;

  return { x, y };
}
