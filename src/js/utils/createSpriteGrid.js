export default function (
  canvas,
  ctx,
  gridSize = 25,
  sprites = [],
  wfcGrid = []
) {
  const indexTable = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
  };
  for (let row = 0; row < wfcGrid.length; row++) {
    for (let col = 0; col < wfcGrid[row].length; col++) {
      const spriteIndex = indexTable[wfcGrid[row][col]];
      const sprite = sprites[spriteIndex];
      console.log(spriteIndex);
      ctx.drawImage(sprite, col * gridSize, row * gridSize, gridSize, gridSize);
    }
  }
  return ctx.createPattern(canvas, "repeat");
}
