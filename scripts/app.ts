const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
  state.lastPoint = { x: event.clientX, y: event.clientY };
  drawArc(state.lastPoint);
});

canvas.addEventListener("mousemove", (event: MouseEvent) => {
  if (!state.drawing) return;

  const newPoint: Point = { x: event.clientX, y: event.clientY };
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
