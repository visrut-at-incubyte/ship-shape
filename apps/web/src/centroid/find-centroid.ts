import { Point } from "~/point";

export const findCentroid = (points: Point[]) => {
  const x = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const y = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  return { x, y };
};
