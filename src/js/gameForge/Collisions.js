export default class {
  constructor(x = 500, y = 500, gridSize = 100) {
    this.woldX = x;
    this.woldY = y;
    this.gridSize = gridSize;
    this.grid = this.createGrid();
  }
  clearGrid() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        this.grid[i][j] = [];
      }
    }
  }
  createGrid() {
    let grid = [];
    let rows = Math.ceil(this.woldX / this.gridSize);
    let cols = Math.ceil(this.woldY / this.gridSize);
    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < cols; j++) {
        grid[i][j] = [];
      }
    }
    return grid;
  }
  updateGrid(entities) {
    this.clearGrid();
    for (let i = 0; i < entities.length; i++) {
      // skip entities that don't have width or height
      if (!entities[i].width || !entities[i].height) {
        continue;
      }
      const col = Math.floor(entities[i].x / this.gridSize);
      const row = Math.floor(entities[i].y / this.gridSize);
      if (this.grid[col] && this.grid[col][row]) {
        this.grid[col][row].push(entities[i]);
      }
    }
  }
  checkCollision(entityA, entityB) {
    return (
      entityA.x < entityB.x + entityB.width &&
      entityA.x + entityA.width > entityB.x &&
      entityA.y < entityB.y + entityB.height &&
      entityA.y + entityA.height > entityB.y
    );
  }
  // Function to check collision for a given entity against entities in the same grid cell and neighboring cells
  checkCollisionForEntity(entity) {
    const col = Math.floor(entity.x / this.gridSize);
    const row = Math.floor(entity.y / this.gridSize);
    const neighbors = [];
    for (let i = col - 1; i <= col + 1; i++) {
      for (let j = row - 1; j <= row + 1; j++) {
        if (this.grid[i] && this.grid[i][j]) {
          neighbors.push(...this.grid[i][j]);
        }
      }
    }
    for (let i = 0; i < neighbors.length; i++) {
      if (
        entity.id !== neighbors[i].id &&
        this.checkCollision(entity, neighbors[i])
      ) {
        return neighbors[i];
      }
    }
    return false;
  }
  testCollisionsForAllEntities(entities) {
    this.updateGrid(entities);
    let collisions = [];
    for (let i = 0; i < entities.length; i++) {
      const collision = this.checkCollisionForEntity(entities[i]);
      if (collision) {
        collisions.push([entities[i], collision]);

        // If entities are colliding and the flag is not set, trigger onCollision method
        if (!entities[i].isColliding || !collision.isColliding) {
          entities[i].onCollision(collision);
          entities[i].isColliding = true;
        }
      } else {
        // Entities are not colliding anymore, trigger collisionEnd method
        if (entities[i].isColliding) {
          entities[i].onCollisionEnd();
          entities[i].isColliding = false;
        }
      }
    }
    return collisions;
  }
  // create a self contained method to check collisions inside a web worker and returns a collision array
  checkCollisionsWorker = (grid = [], gridSize = 25, entities = [], maxCollissions = 500)=> {
    if (!grid.length) {
      return [[], []];
    }
    if (!entities.length) {
      return [[], grid];
    }
    // clear grid
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        grid[i][j] = [];
      }
    }
    const checkCollision = (entityA, entityB) => {
      return (
        entityA?.x < entityB?.x + entityB?.width &&
        entityA?.x + entityA?.width > entityB?.x &&
        entityA?.y < entityB?.y + entityB?.height &&
        entityA?.y + entityA?.height > entityB?.y
      );
    };
    // create a new updated grid
    let newGrid = grid;
    for (let i = 0; i < entities.length; i++) {
      // skip entities that don't have width or height
      if (!entities[i].width || !entities[i].height) {
        continue;
      }
      const col = Math.floor(entities[i].x / gridSize);
      const row = Math.floor(entities[i].y / gridSize);
      if (newGrid[col] && newGrid[col][row]) {
        newGrid[col][row].push(entities[i]);
      }
    }
    let collisions = [];
    for (let i = 0; i < entities.length; i++) {
      const col = Math.floor(entities[i].x / gridSize);
      const row = Math.floor(entities[i].y / gridSize);
      const neighbors = [];
      for (let i = col - 1; i <= col + 1; i++) {
        for (let j = row - 1; j <= row + 1; j++) {
          if (newGrid[i] && newGrid[i][j]) {
            neighbors.push(...newGrid[i][j]);
          }
        }
      }
      for (let i = 0; i < neighbors.length; i++) {
      
        if (
          entities[i]?.id !== neighbors[i]?.id &&
          checkCollision(entities[i], neighbors[i])
        ) {
          collisions.push([entities[i], neighbors[i]]);
        }
      }
    }
    return [collisions, newGrid];

  }
}
