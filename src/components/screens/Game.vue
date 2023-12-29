<template>
  <div id="game" class="m-0 p-0">
    <div id="game-container" class="position-relative">
      <div class="position-fixed" style="z-index: 10">
        {{ metrics.fps }}
      </div>
      <div id="game-canvas-container" ref="layers"></div>
    </div>
  </div>
</template>

<script>
import {
  ForgeRenderLoop,
  ForgeEntitiesManager,
  ForgeLayer,
  ForgeCollisions,
  TaskForge,
  SpriteLoader,
} from "/src/js/gameForge/main.js";
import EMapPoint from "@/js/game/entities/EMapPoint";
export default {
  data() {
    return {
      renderLoop: null,
      entityManager: null,
      collisionsManager: null,
      layers: [],
      metrics: {
        fps: 0,
      },
      world: {
        gridSize: 100,
        wx: 1000,
        wy: 1000,
      },
    };
  },

  async mounted() {
    this.renderLoop = new ForgeRenderLoop({ maxFps: 60 });
    this.entityManager = new ForgeEntitiesManager();
    let tasksManager = new TaskForge();
    let cWorker = tasksManager.reserveWorker();
    let collisionsManager = new ForgeCollisions(
      this.world.wx,
      this.world.wy,
      125
    );

    let l1 = new ForgeLayer().init().responsive();
    let offscreenL2 = new ForgeLayer().responsive();
    let offscreenCanvas = offscreenL2.canvas.transferControlToOffscreen();

    let patternLayer = new ForgeLayer({ width: 100, height: 100 }).init();
    l1.canvas.style.zIndex = 1;
    this.$refs.layers.appendChild(l1.canvas);
    this.$refs.layers.appendChild(offscreenL2.canvas);

    // draw a grid the size of the world
    const createGrid = (layer, gridSize = 25) => {
      patternLayer.ctx.strokeStyle = "rgba(0,0,0,1)";
      patternLayer.ctx.lineWidth = 1;
      patternLayer.ctx.beginPath();
      for (let x = 0; x < this.world.wx; x += gridSize) {
        patternLayer.ctx.moveTo(x, 0);
        patternLayer.ctx.lineTo(x, this.world.wy);
      }
      for (let y = 0; y < this.world.wy; y += gridSize) {
        patternLayer.ctx.moveTo(0, y);
        patternLayer.ctx.lineTo(this.world.wx, y);
      }
      patternLayer.ctx.stroke();
      return layer.ctx.createPattern(layer.canvas, "repeat");
    };
    const gridPattern = createGrid(patternLayer, this.world.gridSize);
    // offscreen canvasLoop

    // Calculate the initial camera position to center it in the world
    const initialCameraX = (this.world.wx - l1.canvas.width) / 2;
    const initialCameraY = (this.world.wy - l1.canvas.height) / 2;

    // Set the initial camera position
    let cameraX = initialCameraX;
    let cameraY = initialCameraY;

    const image = await SpriteLoader("test.png");
    // convert image to imageBitmap
    let bm = await createImageBitmap(image);

    // fill entities

    for (let i = 0; i < 5500; i++) {
      let e = new EMapPoint({
        x: Math.random() * this.world.wx,
        y: Math.random() * this.world.wy,
        layer: l1,
        image: image,
        world: {
          wx: this.world.wx,
          wy: this.world.wy,
        },
      });
      this.entityManager.addEntity(e);
    }
    tasksManager.runTaskOnWorker(
      cWorker,
      (entities) => {
        if (!globals.offscreenCanvas) {
          console.log(transArgs);
          globals.offscreenCanvas = transArgs.offscreenCanvas;
          globals.offscreenContext = globals.offscreenCanvas.getContext("2d", {
            alpha: false,
          });
          globals.sprite = transArgs.bm;
        }

        // Your animation loop using requestAnimationFrame
        function animate() {
          // Perform your drawing operations here on the offscreen canvas
          // Example: Clear the canvas
          globals.offscreenContext.clearRect(
            0,
            0,
            globals.offscreenCanvas.width,
            globals.offscreenCanvas.height
          );
          globals.offscreenContext.fillStyle = "white";
          globals.offscreenContext.fillRect(
            0,
            0,
            globals.offscreenCanvas.width,
            globals.offscreenCanvas.height
          );

          // Example: Draw a rectangle

          // Request next animation frame
          if (globals.entities) {
            for(let i = 0; i < globals.entities.length; i++) {
              let e = globals.entities[i];
              globals.offscreenContext.drawImage(globals.sprite, e.x, e.y);
              e.x += e.vx ;
              e.y += e.vy;
            }
          }

          requestAnimationFrame(animate);
        }

        // Start the animation loop
        animate();
      },
      [],
      [offscreenCanvas, bm],
      { offscreenCanvas: offscreenCanvas, bm: bm }
    );
    l1.ctx.fillStyle = gridPattern;
    tasksManager.runTaskOnWorker(
      cWorker,
      (entities) => {
        globals.entities = entities;
      },
      [this.entityManager.entities]
    );
    let vx = 0;
    this.renderLoop.update = async (time) => {
      l1.clear(0, 0, l1.canvas.width, l1.canvas.height);
      // Translate the context horizontally by vx and draw the grid pattern
      l1.ctx.save();
      l1.panCamera(-cameraX, -cameraY);
      // this.entityManager.update({ ...time });

      l1.ctx.fillRect(0, 0, this.world.wx, this.world.wy);
      l1.ctx.restore();
      this.metrics.fps = time.currentFps;
    };

    this.entityManager.firstUpdate();
    this.renderLoop.init();
  },
};
</script>

<style>
canvas {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
</style>