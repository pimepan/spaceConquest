export default function (
  canvas,
  ctx,
  gridSize = 25,
  world = { wx: 1000, wy: 1000 }
) {
  let grid = [];

    const rows = Math.ceil(world.wy / gridSize);
    const cols = Math.ceil(world.wx / gridSize);
  ctx.strokeStyle = "rgba(0,0,0,1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x < world.wx; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, world.wy);
  }
  for (let y = 0; y < world.wy; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(world.wx, y);
  }
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      grid[i][j] = {
        north: i > 0 ? { x: j, y: i - 1 } : null,
        south: i < rows - 1 ? { x: j, y: i + 1 } : null,
        west: j > 0 ? { x: j - 1, y: i } : null,
        east: j < cols - 1 ? { x: j + 1, y: i } : null,
      };
    }
  }

  ctx.stroke();
  return {
    grid,
    pattern: ctx.createPattern(canvas, "repeat"),
  }
}
