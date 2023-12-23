import { findCentroid } from "~/centroid/find-centroid";
import { getMousePositionOnCanvas } from "~/mouse-poistion";
import { Point } from "~/point";

type StyleOptions = {
  lineWidth: number;
  strokeStyle: string;
  fillStyle: string;
};

export class DrawingCanvas {
  private painting = false;
  private recordedPoints: Point[] = [];
  private readonly context: CanvasRenderingContext2D;
  private readonly styleOptions: StyleOptions = {
    lineWidth: 10,
    strokeStyle: "white",
    fillStyle: "white",
  };

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.registerDrawingEvents();
  }

  drawArc(point: Point, styleOptions?: Partial<StyleOptions>) {
    const { lineWidth, fillStyle } = {
      ...this.styleOptions,
      ...styleOptions,
    };
    this.context.beginPath();
    this.context.arc(point.x, point.y, lineWidth / 2, 0, 2 * Math.PI);
    this.context.fillStyle = fillStyle;
    this.context.fill();
  }

  drawLine(from: Point, to: Point, styleOptions?: Partial<StyleOptions>) {
    const { lineWidth, strokeStyle } = {
      ...this.styleOptions,
      ...styleOptions,
    };
    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.lineWidth = lineWidth;
    this.context.strokeStyle = strokeStyle;
    this.context.stroke();
  }

  redrawRecordedPointsAtCenter() {
    this.resetCanvas();
    const centroid = findCentroid(this.recordedPoints);
    for (const point of this.recordedPoints) {
      point.x -= centroid.x;
      point.y -= centroid.y;
    }

    for (let i = 0; i < this.recordedPoints.length - 1; i++) {
      this.drawArc(this.recordedPoints[i]);
      this.drawLine(this.recordedPoints[i], this.recordedPoints[i + 1]);
    }
  }

  drawBoundingBox() {
    const points = this.recordedPoints;
    const topLeftCornerBoundryPoint = {
      x: Math.min(...points.map((point) => point.x)),
      y: Math.max(...points.map((point) => point.y)),
    };

    const bottomRightCornerBoundryPoint = {
      x: Math.max(...points.map((point) => point.x)),
      y: Math.min(...points.map((point) => point.y)),
    };

    const topRightCornerBoundryPoint = {
      x: bottomRightCornerBoundryPoint.x,
      y: topLeftCornerBoundryPoint.y,
    };

    const bottomLeftCornerBoundryPoint = {
      x: topLeftCornerBoundryPoint.x,
      y: bottomRightCornerBoundryPoint.y,
    };

    this.drawLine(topLeftCornerBoundryPoint, topRightCornerBoundryPoint, {
      strokeStyle: "red",
      lineWidth: 1,
    });

    this.drawLine(topRightCornerBoundryPoint, bottomRightCornerBoundryPoint, {
      strokeStyle: "red",
      lineWidth: 1,
    });

    this.drawLine(bottomRightCornerBoundryPoint, bottomLeftCornerBoundryPoint, {
      strokeStyle: "red",
      lineWidth: 1,
    });

    this.drawLine(bottomLeftCornerBoundryPoint, topLeftCornerBoundryPoint, {
      strokeStyle: "red",
      lineWidth: 1,
    });
  }

  private resetCanvas() {
    this.context.clearRect(
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
        this.drawLine(
          this.recordedPoints[this.recordedPoints.length - 1],
          getMousePositionOnCanvas(this.canvas, event)
        );
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
