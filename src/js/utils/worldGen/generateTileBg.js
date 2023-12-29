export function genTileWorld(
  ctx,
  canvas,
  world = { wx: 5000, wy: 5000, gridSize: 50 },
  grid,
  spriteDefs = {},
  scale = 1
) {
  console.log("generating tile world");
  ctx.scale(scale, scale);
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length ; col++) {
      const cell = grid[row][col];
      const tileType = cell.tileType.index;
      const tile = spriteDefs[tileType];
      // console.log(tileType, tile);
      ctx.drawImage(tile, cell.x, cell.y, cell.w, cell.h);
    }
  }
  return ctx.createPattern(canvas,'repeat');
}
