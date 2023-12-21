import { Point } from "./point";

class DrawingCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: {
    drawing: boolean;
    lastPoint: Point;
  };

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.initializeCanvas();
    this.addEventListeners();

    this.state = {
      drawing: false,
      lastPoint: { x: 0, y: 0 },
    };
  }

  private initializeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.scale(1, -1); // Flip the y-axis
  }

  private addEventListeners() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.handleMouseUpOrOut.bind(this));
    this.canvas.addEventListener(
      "mouseout",
      this.handleMouseUpOrOut.bind(this)
    );
  }

  private handleMouseDown(event: MouseEvent) {
    this.state.drawing = true;
    const point = this.convertToCartesianCoords(event);
    this.state.lastPoint = point;
    this.drawArc(point);
  }

  private handleMouseMove(event: MouseEvent) {
    if (!this.state.drawing) return;

    const newPoint = this.convertToCartesianCoords(event);
    this.drawLine(this.state.lastPoint, newPoint);
    this.drawArc(newPoint);

    this.state.lastPoint = newPoint;
  }

  private handleMouseUpOrOut() {
    this.state.drawing = false;
  }

  private drawLine(from: Point, to: Point) {
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 10;
    this.ctx.stroke();
  }

  private drawArc(point: Point) {
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, this.ctx.lineWidth / 2, 0, Math.PI * 2);
    this.ctx.fillStyle = "white";
    this.ctx.fill();
  }

  private convertToCartesianCoords(event: MouseEvent): Point {
    let rect = this.canvas.getBoundingClientRect();

    let x = event.clientX - rect.left - this.canvas.width / 2;
    let y = -(event.clientY - rect.top - this.canvas.height / 2);

    return { x, y };
  }
}

export const drawingCanvas = new DrawingCanvas("canvas");
