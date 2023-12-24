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
    this.resetCanvas();
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

    const { topLeft, bottomRight } = this.getBoundingBoxPoints();

    const width = Math.abs(topLeft.x - bottomRight.x);
    const height = Math.abs(topLeft.y - bottomRight.y);

    const scaleX = 400 / width;
    const scaleY = 400 / height;

    for (const point of this.recordedPoints) {
      point.x *= scaleX;
      point.y *= scaleY;
    }

    for (let i = 0; i < this.recordedPoints.length - 1; i++) {
      this.drawArc(this.recordedPoints[i]!);
      this.drawLine(this.recordedPoints[i]!, this.recordedPoints[i + 1]!);
    }
  }

  drawBoundingBox() {
    const { topLeft, topRight, bottomRight, bottomLeft } =
      this.getBoundingBoxPoints();

    this.drawLine(topLeft, topRight, { strokeStyle: "red", lineWidth: 1 });
    this.drawLine(topRight, bottomRight, { strokeStyle: "red", lineWidth: 1 });
    this.drawLine(bottomRight, bottomLeft, {
      strokeStyle: "red",
      lineWidth: 1,
    });
    this.drawLine(bottomLeft, topLeft, { strokeStyle: "red", lineWidth: 1 });
  }

  getShapePoints() {
    return this.recordedPoints;
  }

  private getBoundingBoxPoints() {
    const points = this.recordedPoints;
    const topLeft = {
      x: Math.min(...points.map((point) => point.x)),
      y: Math.max(...points.map((point) => point.y)),
    };

    const bottomRight = {
      x: Math.max(...points.map((point) => point.x)),
      y: Math.min(...points.map((point) => point.y)),
    };

    const topRight = {
      x: bottomRight.x,
      y: topLeft.y,
    };

    const bottomLeft = {
      x: topLeft.x,
      y: bottomRight.y,
    };

    return {
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
    };
  }

  private resetCanvas() {
    this.context.clearRect(
      -this.canvas.width / 2,
      -this.canvas.height / 2,
      this.canvas.width,
      this.canvas.height
    );

    this.drawAxis();
  }

  private drawAxis() {
    this.drawLine(
      { x: -window.innerWidth, y: 0 },
      { x: window.innerWidth, y: 0 },
      { strokeStyle: "blue", lineWidth: 1 }
    );

    this.drawLine(
      { x: 0, y: window.innerHeight },
      { x: 0, y: -window.innerHeight },
      { strokeStyle: "blue", lineWidth: 1 }
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
          this.recordedPoints[this.recordedPoints.length - 1]!,
          getMousePositionOnCanvas(this.canvas, event)
        );
        this.drawArc(getMousePositionOnCanvas(this.canvas, event));
        this.recordedPoints.push(getMousePositionOnCanvas(this.canvas, event));
      }
    });

    this.canvas.addEventListener("mouseup", (_) => {
      this.painting = false;
      this.redrawRecordedPointsAtCenter();
    });

    this.canvas.addEventListener("mouseout", (_) => {
      this.painting = false;
      this.redrawRecordedPointsAtCenter();
    });
  }
}
