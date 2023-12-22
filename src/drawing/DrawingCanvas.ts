import { findCentroid } from "../centroid/find-centroid";
import { getMousePositionOnCanvas } from "../mouse-poistion";
import { Point } from "../point";

type StyleOptions = {
  lineWidth: number;
  strokeStyle: string;
  fillStyle: string;
};

export class DrawingCanvas {
  private painting = false;
  private recordedPoints: Point[] = [];
  private readonly styleOptions: StyleOptions = {
    lineWidth: 10,
    strokeStyle: "white",
    fillStyle: "white",
  };

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.registerDrawingEvents();
  }

  drawArc(point: Point, styleOptions?: Partial<StyleOptions>) {
    const { lineWidth, strokeStyle, fillStyle } = {
      ...this.styleOptions,
      ...styleOptions,
    };
    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    context.beginPath();
    context.arc(point.x, point.y, lineWidth, 0, 2 * Math.PI);
    context.fillStyle = fillStyle;
    context.fill();
    context.strokeStyle = strokeStyle;
    context.stroke();
  }

  redrawRecordedPointsAtCenter() {
    this.resetCanvas();
    const centroid = findCentroid(this.recordedPoints);
    for (const points of this.recordedPoints) {
      points.x -= centroid.x;
      points.y -= centroid.y;
    }

    for (const points of this.recordedPoints) {
      this.drawArc(points);
    }
  }

  private resetCanvas() {
    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    context.clearRect(
      -this.canvas.width / 2,
      -this.canvas.height / 2,
      this.canvas.width,
      this.canvas.height
    );
  }

  private registerDrawingEvents() {
    this.canvas.addEventListener("mousedown", (event) => {
      this.painting = true;
      this.resetCanvas();
      this.recordedPoints = [];
      this.drawArc(getMousePositionOnCanvas(this.canvas, event));
      this.recordedPoints.push(getMousePositionOnCanvas(this.canvas, event));
    });

    this.canvas.addEventListener("mousemove", (event) => {
      if (this.painting) {
        this.drawArc(getMousePositionOnCanvas(this.canvas, event));
        this.recordedPoints.push(getMousePositionOnCanvas(this.canvas, event));
      }
    });

    this.canvas.addEventListener("mouseup", (_) => {
      this.painting = false;
      this.drawArc(findCentroid(this.recordedPoints), {
        fillStyle: "red",
        strokeStyle: "red",
      });
    });

    this.canvas.addEventListener("mouseout", (_) => {
      this.painting = false;
    });
  }
}
