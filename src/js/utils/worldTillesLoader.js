// only use in the main thread
import { SpriteLoader } from "/src/js/gameForge/main";
export default async function () {
  let grassTile = await SpriteLoader(
    new URL("/src/assets/sprites/tiles/grass-tile.png", import.meta.url).href
  );
  grassTile = await createImageBitmap(grassTile);
  let grassTileV1 = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/grass-tile-variation-1.png",
      import.meta.url
    ).href
  );
  grassTileV1 = await createImageBitmap(grassTileV1);
  let grassTileV2 = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/grass-tile-variation-2.png",
      import.meta.url
    ).href
  );
  grassTileV2 = await createImageBitmap(grassTileV2);

  let grassTileV3 = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/grass-tile-variation-props-2.png",
      import.meta.url
    ).href
  );
  grassTileV3 = await createImageBitmap(grassTileV3);

  let grassTileV4 = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/grass-tile-variation-props-3.png",
      import.meta.url
    ).href
  );
  grassTileV4 = await createImageBitmap(grassTileV4);

  let grassTileV5 = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/grass-tile-variation-props-4.png",
      import.meta.url
    ).href
  );
  grassTileV5 = await createImageBitmap(grassTileV5);

  let grassTileShoreBottom = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/grass-tile-shore-bottom.png",
      import.meta.url
    ).href
  );
  grassTileShoreBottom = await createImageBitmap(grassTileShoreBottom);

  let grassTileShoreBottomRight = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/grass-tile-shore-bottom-corner-right.png",
      import.meta.url
    ).href
  );
  grassTileShoreBottomRight = await createImageBitmap(
    grassTileShoreBottomRight
  );

  let grassTileShoreBottomLeft = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/grass-tile-shore-bottom-corner-left.png",
      import.meta.url
    ).href
  );
  grassTileShoreBottomLeft = await createImageBitmap(grassTileShoreBottomLeft);

  let grassTileShoreTopRight = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/grass-tile-shore-top-corner-right.png",
      import.meta.url
    ).href
  );
  grassTileShoreTopRight = await createImageBitmap(grassTileShoreTopRight);

  let grassTileShoreTopLeft = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/grass-tile-shore-top-corner-left.png",
      import.meta.url
    ).href
  );
  grassTileShoreTopLeft = await createImageBitmap(grassTileShoreTopLeft);

  let grassTileShoreBothCornerLeft = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/grass-tile-shore-both-corner-left.png",
      import.meta.url
    ).href
  );
  grassTileShoreBothCornerLeft = await createImageBitmap(
    grassTileShoreBothCornerLeft
  );
  let grassTileShoreBothCornerRight = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/grass-tile-shore-both-corner-right.png",
      import.meta.url
    ).href
  );
  grassTileShoreBothCornerRight = await createImageBitmap(
    grassTileShoreBothCornerRight
  );

  // water
  let water = await SpriteLoader(
    new URL("/src/assets/sprites/tiles/water-tile.png", import.meta.url).href
  );
  water = await createImageBitmap(water);

  let waterV1 = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/water-tile-variation-1.png",
      import.meta.url
    ).href
  );
  waterV1 = await createImageBitmap(waterV1);
  let waterV2 = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/water-tile-variation-2.png",
      import.meta.url
    ).href
  );
  waterV2 = await createImageBitmap(waterV2);
  let waterV3 = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/water-tile-variation-3.png",
      import.meta.url
    ).href
  );
  waterV3 = await createImageBitmap(waterV3);
  
  // resources
  let tree = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/grass-tile-tree.png",
      import.meta.url
    ).href
  );
  tree = await createImageBitmap(tree);
  let tree2 = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/grass-tile-tree-1.png",
      import.meta.url
    ).href
  );
  tree2 = await createImageBitmap(tree2);
  let tree3 = await SpriteLoader(
    new URL(
      "/src/assets/sprites/tiles/grass-tile-tree-2.png",
      import.meta.url
    ).href
  );
  tree3 = await createImageBitmap(tree3);
  return [
    grassTile,
    grassTileV1,
    grassTileV2,
    grassTileV3,
    grassTileV4,
    grassTileV5,
    grassTileShoreBottom,
    grassTileShoreBottomRight,
    grassTileShoreBottomLeft,
    grassTileShoreTopLeft,
    grassTileShoreTopRight,
    grassTileShoreBothCornerLeft,
    grassTileShoreBothCornerRight,
    // water v1 13 ...17
    water,
    waterV1,
    waterV2,
    waterV3,
    // resources
    tree,
    tree2,
    tree3,
  ];
}
