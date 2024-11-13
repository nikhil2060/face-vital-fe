import { TRIANGULATION } from "./triangulation";

export const drawMesh = (prediction, ctx) => {
  if (!prediction) return;
  const keyPoints = prediction.keypoints;
  if (!keyPoints) return;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw Triangles with white lines
  ctx.strokeStyle = "white";
  ctx.lineWidth = 0.5; // Thin lines for mesh
  for (let i = 0; i < TRIANGULATION.length / 3; i++) {
    const points = [
      TRIANGULATION[i * 3],
      TRIANGULATION[i * 3 + 1],
      TRIANGULATION[i * 3 + 2],
    ].map((index) => keyPoints[index]);
    drawPath(ctx, points, true);
  }

  // Draw Key Points in white
  ctx.fillStyle = "white";
  for (let keyPoint of keyPoints) {
    ctx.beginPath();
    ctx.arc(keyPoint.x, keyPoint.y, 1, 0, 2 * Math.PI);
    ctx.fill();
  }
};

const drawPath = (ctx, points, closePath) => {
  const region = new Path2D();
  region.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point.x, point.y);
  }
  if (closePath) region.closePath();
  ctx.stroke(region);
};
