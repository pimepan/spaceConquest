<template>
  <div id="game" class="m-0 p-0">
    <div id="game-container" class="position-relative">
      <div class="position-fixed" style="z-index: 10"></div>
      <div id="game-canvas-container" ref="layers"></div>
    </div>
  </div>
</template>

<script>
import { render } from "vue";
import {
  ForgeRenderLoop,
  ForgeEntitiesManager,
  ForgeLayer,
  ForgeCollisions,
  TaskForge,
  SpriteLoader,
} from "/src/js/gameForge/main.js";
import worldTillesLoader from "@/js/utils/worldTillesLoader";
export default {
  data() {
    return {
      world: {
        wx: 4_000,
        wy: 4_000,
        gridSize: 25,
      },
    };
  },

  async mounted() {
    const wordlTiles = await worldTillesLoader();
    // get screen size
    const width = window.innerWidth;
    const height = window.innerHeight;
    // create the threads that will run the game
    const gridLayer = new ForgeLayer({
      width: width,
      height: height,
      zIndex: 1,
    });
    const gridLayerOffscreen = gridLayer.canvas.transferControlToOffscreen();

    const cacheLayer = new ForgeLayer({
      width: this.world.wx,
      height: this.world.wy,
      zIndex: 1,
    });
    const cacheLayerOffscreen = cacheLayer.canvas.transferControlToOffscreen();

    const NodesLayer = new ForgeLayer({
      width: width,
      height: height,
      zIndex: 2,
    });

    this.$refs.layers.appendChild(gridLayer.canvas);
    this.$refs.layers.appendChild(NodesLayer.canvas);

    // create the workers
    const renderWorker = new Worker(
      new URL("/src/js/game/workers/renderWorker.js", import.meta.url),
      {
        type: "module",
      }
    );
    TaskForge.postMessage(
      renderWorker,
      {
        mName: "init",
        cacheCanvas: cacheLayerOffscreen,
        canvas: gridLayerOffscreen,
        wordlTiles: wordlTiles,
        world: { ...this.world },
      },
      [cacheLayerOffscreen, gridLayerOffscreen, ...wordlTiles]
    );
    window.addEventListener("mousemove", (e) => {
      // TaskForge.postMessage(
      //   renderWorker,
      //   {
      //     mName:"io",
      //     mouse: {
      //       x: e.clientX,
      //       y: e.clientY,
      //     },
      //   },
      // );
    });

    // Set initial translate offsets
    let scale = 1.0;
    let translateX = 0;
    let translateY = 0;

    window.addEventListener("wheel", (e) => {
      const delta = e.deltaY > 0 ? -0.05 : 0.05; // Adjust the scale factor
      const oldScale = scale;
      scale = Math.max(1, Math.min(2, scale + delta));
      
      
      translateX -= e.clientX / oldScale - e.clientX / scale;
      translateY -= e.clientY / oldScale - e.clientY / scale;
      
      TaskForge.postMessage(renderWorker, {
        mName: "io",
        wheel: {
          x: e.clientX,
          y: e.clientY,
          translateX: translateX,
          translateY: translateY,
          delta: delta,
          scale: scale,
        },
      });
    });
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