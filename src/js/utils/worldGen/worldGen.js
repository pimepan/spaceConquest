import { ValueNoise } from "value-noise-js";
import weightedRandom from "../../utils/weightedRandom";
import { createNoise2D } from "simplex-noise";
import { createNoise3D } from "simplex-noise";
import alea from "alea";

class GridCell {
  constructor({
    x,
    y,
    w,
    h,
    tileType = { type: null, index: 0 },
    neightboors = {
      north: null,
      south: null,
      west: null,
      east: null,
    },
    noiseVal = null,
  } = {}) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.tileType = tileType;
    this.neightboors = neightboors;
    this.noiseVal = noiseVal;
  }
}
const tileDefs = {
  0: "grassTile",
  1: "waterTile",
  2: "treeTile",
  3: "treeTile",
  4: "ironTile",
};

// Calculate neighbors for a specific cell
function calculateNeighbors(grid, row, col) {
  const numRows = grid.length;
  const numCols = grid[0].length;

  const neightbors = {
    north: null,
    south: null,
    west: null,
    east: null,
  };

  if (row > 0) {
    neightbors.west = grid[row - 1][col];
  }

  if (row < numRows - 1) {
    neightbors.east = grid[row + 1][col];
  }

  if (col > 0) {
    neightbors.north = grid[row][col - 1];
  }

  if (col < numCols - 1) {
    neightbors.south = grid[row][col + 1];
  }

  return neightbors;
}
const tileRanges = (val, x, y) => {
  const seed = alea("seed");
  const noise = new createNoise2D(seed);

  // grass range
  let tileVal = null;
  if (val >= 0.23 && val <= 1) {
    // console.log(val);
    const grassVariation = weightedRandom(
      0,
      5,
      {
        0: 0.5,
      },
      noise,
      [x, y]
    );
    // mantain the result between 0 and 5
    // console.log(grassVariation);
    tileVal = {
      type: 'grassTile',
      index: grassVariation,
    };
  } else {
    const waterVariation = weightedRandom(
      13,
      16,
      {
        13: 0.7,
      },
      noise,
      [x, y]
    );
    tileVal = {
      type: 'waterTile',
      index: waterVariation,
    };
  }
  return tileVal;
};
const tileCleaner = (grid) => {
  return grid.map((row) => {
    return (
      row
        .map((col) => {
          let neightboors = col.neightboors;
          if (
            !neightboors.north ||
            !neightboors.south ||
            !neightboors.west ||
            !neightboors.east
          ) {
            col.tileType = { type: "grassTile", index: 0 };
          }
          return col;
        })
        // remove horizontal water strips
        .map((col) => {
          let neightboors = col.neightboors;
          if (
            col.tileType.type === "waterTile" &&
            neightboors.north.tileType.type === "grassTile" &&
            neightboors.south.tileType.type === "grassTile"
          ) {
            col.tileType = { type: "grassTile", index: 0 };
          }
          return col;
        })
        // remove vertical water strips
        .map((col) => {
          let neightboors = col.neightboors;
          if (
            col.tileType.type === "waterTile" &&
            neightboors.west.tileType.type === "grassTile" &&
            neightboors.east.tileType.type === "grassTile"
          ) {
            col.tileType = { type: "grassTile", index: 0 };
          }
          return col;
        })
        // remove single water tiles
        .map((col) => {
          let neightboors = col.neightboors;
          if (
            col.tileType.type === "waterTile" &&
            neightboors.north?.tileType?.type === "grassTile" &&
            neightboors.south?.tileType?.type === "grassTile"
          ) {
            col.tileType = { type: "grassTile", index: 0 };
          }
          return col;
        })
        // remove single grass columns
        .map((col) => {
          let neightboors = col.neightboors;
          if (
            col.tileType.type === "grassTile" &&
            neightboors.west?.tileType?.type === "waterTile" &&
            neightboors.east?.tileType?.type === "waterTile"
          ) {
            col.tileType = { type: "waterTile", index: 13 };
          }
          return col;
        })
        .map((col) => {
          let neightboors = col.neightboors;
          if (
            col.tileType.type === "grassTile" &&
            neightboors.north?.tileType?.type === "waterTile" &&
            neightboors.south?.tileType?.type === "waterTile"
          ) {
            col.tileType = { type: "waterTile", index: 13 };
          }
          return col;
        })
    );
  });
};
const tileTransformer = (grid) => {
  return grid.map((row) => {
    // shorelines
    return row
      .map((col) => {
        const neightboors = col.neightboors;
        if (
          col.tileType.type === "grassTile" &&
          neightboors.south?.tileType?.type === "waterTile"
        ) {
          col.tileType = { type: "shoreLineTile", index: 6 };
        }
        return col;
      })
      .map((col) => {
        const neightboors = col.neightboors;
        if (
          col.tileType.type === "grassTile" &&
          neightboors.south?.tileType?.type === "waterTile" &&
          neightboors.east?.tileType?.type === "waterTile"
        ) {
          col.tileType = { type: "shoreLineTile", index: 7 };
        }
        return col;
      })
      .map((col) => {
        const neightboors = col.neightboors;
        if (
          col.tileType.type === "grassTile" &&
          neightboors.south?.tileType?.type === "waterTile" &&
          neightboors.west?.tileType?.type === "waterTile"
        ) {
          col.tileType = { type: "shoreLineTile", index: 8 };
        }
        return col;
      })
      .map((col) => {
        const neightboors = col.neightboors;
        if (
          col.tileType.type === "grassTile" &&
          neightboors.north?.tileType?.type === "waterTile" &&
          neightboors.west?.tileType?.type === "waterTile"
        ) {
          col.tileType = { type: "shoreLineTile", index: 9 };
        }
        return col;
      })
      .map((col) => {
        const neightboors = col.neightboors;
        if (
          col.tileType.type === "grassTile" &&
          neightboors.north?.tileType?.type === "waterTile" &&
          neightboors.east?.tileType?.type === "waterTile"
        ) {
          col.tileType = { type: "shoreLineTile", index: 10 };
        }
        return col;
      })
      .map((col) => {
        const neightboors = col.neightboors;
        if (
          col.tileType.type === "grassTile" &&
          neightboors.north?.tileType?.type === "waterTile" &&
          neightboors.west?.tileType?.type === "waterTile" &&
          neightboors.south?.tileType?.type === "waterTile" &&
          neightboors.east?.tileType?.type === "grassTile"
        ) {
          col.tileType = { type: "shoreLineTile", index: 11 };
        }
        return col;
      })
      .map((col) => {
        const neightboors = col.neightboors;
        if (
          col.tileType.type === "grassTile" &&
          neightboors.north?.tileType?.type === "waterTile" &&
          neightboors.east?.tileType?.type === "waterTile" &&
          neightboors.south?.tileType?.type === "waterTile" &&
          neightboors.west?.tileType?.type === "grassTile"
        ) {
          col.tileType = { type: "shoreLineTile", index: 12 };
        }
        return col;
      });
  });
};

const resourcePlacementtransformer = (grid) => {
  const seed = alea("seed");
  const noise = new createNoise2D(seed);

  return grid.map((row, i) => {
    return row.map((col, j) => {
      const neightboors = col.neightboors;
      if (col.tileType.type === "grassTile") {
        const treeVariation = weightedRandom(
          17,
          19,
          {
            0: .2,
          },
          noise,
          [i, j]
        );
        const noiseVal = Math.abs(noise(col.x * 5, col.y));
        if (noiseVal > 0.4 && noiseVal < 0.43) {
          col.tileType = { type: "treeTile", index: treeVariation };
        }
      }
      return col;
    });
  });
};

// tileTypes: grass, water, trees, iron
export function gridGen({
  world = { wx: 1000, wy: 1000, gridSize: 100 },
} = {}) {
  let grid = [];
  const seed = alea("sharkweek");
  const seed2 = alea("karol");
  const seed3 = alea("marly");
  const noise = new createNoise2D(seed);
  const noise2 = new createNoise2D(seed2);
  const noise3 = new createNoise2D(seed3);
  const gridSize = world.gridSize;
  for (let i = 0; i < world.wx / gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < world.wy / gridSize; j++) {
      const x = i * gridSize;
      const y = j * gridSize;
      // Evaluate at x, y, and z
      let noiseVal = Math.abs(noise(x, y));
      let noiseVal2 = Math.abs(noise2(x, y));
      let noiseVal3 = Math.abs(noise3(x, y));

      // blend the noise
      noiseVal = (noiseVal + noiseVal2 + noiseVal3) / 3;

      // console.log(noiseVal);
      const cell = new GridCell({
        x,
        y,
        w: gridSize,
        h: gridSize,
        tileType: tileRanges(noiseVal, x, y),
        noiseVal: noiseVal,
      });
      grid[i][j] = cell;
    }
  }
  // calculate neighbors
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      let cell = grid[row][col];
      cell.neightboors = calculateNeighbors(grid, row, col);
    }
  }
  // tile cleaner
  grid = tileCleaner(grid);
  grid = tileTransformer(grid);
  grid = resourcePlacementtransformer(grid);

  return grid;
}
