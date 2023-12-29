import { ForgeEntity } from "/src/js/gameForge/main";
export default class extends ForgeEntity {
  constructor({
    x = 0,
    y = 0,
    layer,
    controllabe = false,
    collisionsManager,
    image,
    world = {},
  } = {}) {
    super({ x, y });
    this.x = x;
    this.y = y;
    this.width = 25;
    this.height = 25;
    // negative and positive velocity between -0.1 and 0.1
    this.vx = Math.random() * 5 - 1.5;
    this.vy = Math.random() * 1.5 - 1.5;
    this.layer = layer;
    this.controllable = controllabe;
    this.collisionsManager = collisionsManager;
    this.color = "#000";
    this.image = image;
    this.world = world;
  }
  firstUpdate() {
    if (this.image) {
    }

    if (this.controllable) {
      // Add event listeners for player movement
      window.addEventListener("keydown", (ev) => {
        if (ev.key === "ArrowUp") {
          this.y -= 10;
        }
        if (ev.key === "ArrowDown") {
          this.y += 10;
        }
        if (ev.key === "ArrowLeft") {
          this.x -= 10;
        }
        if (ev.key === "ArrowRight") {
          this.x += 10;
        }
      });
    }
  }
  onCollision() {
    this.color = "#f00";
  }
  draw() {
    this.layer.ctx.drawImage(this.image, this.x, this.y);
  }
  update(time) {
    // this.draw()
    // update position
    // this.x += this.vx * time.delta;
    // this.y += this.vy * time.delta;
    // // bounce off screen
    // if (this.x < 0 || this.x > this.world.wx) {
    //   this.vx = -this.vx;
    // }
    // if (this.y < 0 || this.y > this.world.wy) {
    //   this.vy = -this.vy;
    // }
  }
}
