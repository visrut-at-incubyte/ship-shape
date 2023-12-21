import { Point } from "./point";

class DrawingCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: {
    drawing: boolean;
    lastPoint: Point;
    points: Point[];
  };

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.initializeCanvas();
    this.addEventListeners();

    this.state = {
      drawing: false,
      lastPoint: { x: 0, y: 0 },
      points: [],
    };
  }

  private initializeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.scale(1, -1); // Flip the y-axis

    this.drawAxis();
  }

  private drawAxis() {
    this.ctx.beginPath();
    this.ctx.moveTo(0, window.innerHeight / 2);
    this.ctx.lineTo(0, -window.innerHeight / 2);
    this.ctx.moveTo(-window.innerWidth / 2, 0);
    this.ctx.lineTo(window.innerWidth / 2, 0);
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  private resetCanvas() {
    this.ctx.clearRect(
      -this.canvas.width / 2,
      -this.canvas.height / 2,
      this.canvas.width,
      this.canvas.height
    );
    this.drawAxis();
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
    this.drawArc(newPoint);

    this.state.lastPoint = newPoint;
  }

  private handleMouseUpOrOut() {
    this.state.drawing = false;
  }

  private drawArc(point: Point) {
    this.ctx.beginPath();
    this.ctx.lineWidth = 10;
    this.ctx.arc(point.x, point.y, this.ctx.lineWidth / 2, 0, Math.PI * 2);
    this.state.points.push(point);
    this.ctx.fillStyle = "white";
    this.ctx.fill();
  }

  private convertToCartesianCoords(event: MouseEvent): Point {
    let rect = this.canvas.getBoundingClientRect();

    let x = event.clientX - rect.left - this.canvas.width / 2;
    let y = -(event.clientY - rect.top - this.canvas.height / 2);

    return { x, y };
  }

  public play() {
    const points = this.state.points.filter(
      (point) => !isNaN(point.x) && !isNaN(point.y)
    );

    const centroid = this.getCentroid(points);
    this.drawArc(centroid);

    for (const point of points) {
      point.x -= centroid.x;
      point.y -= centroid.y;
    }

    for (const point of points) {
      this.drawArc(point);
    }
  }

  private getCentroid(points: Point[]): Point {
    const x = points.reduce((sum, point) => sum + point.x, 0) / points.length;
    const y = points.reduce((sum, point) => sum + point.y, 0) / points.length;
    return { x, y };
  }
}

export const drawingCanvas = new DrawingCanvas("canvas");
const playButton = document.getElementById("play-button") as HTMLButtonElement;
playButton.addEventListener("click", () => {
  drawingCanvas.play();
});
