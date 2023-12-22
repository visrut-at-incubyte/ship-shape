export const getMousePositionOnCanvas = (
  canvas: HTMLCanvasElement,
  event: MouseEvent
) => {
  const x = event.clientX - canvas.width / 2;
  const y = -(event.clientY - canvas.height / 2);
  return { x, y };
};
