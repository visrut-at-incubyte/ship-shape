import { Point } from "~/point";

export type Shape =
  | "circle"
  | "triangle"
  | "rectangle"
  | "cloud"
  | "star"
  | "heart";

export const submitData = async (points: Point[], type: Shape) => {
  const response = await fetch("http://localhost:3000/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ points, type }),
  });
  return response.json();
};
