import RenderLoop from "../../gameForge/RenderLoop";
import { gridGen } from "../../utils/worldGen/worldGen";
import { genTileWorld } from "../../utils/worldGen/generateTileBg";

let globals = {};
const renderLoop = new RenderLoop({ maxFps: 60 });

self.onmessage = function (e) {
  const params = e.data.params;
  // console.log("render worker params", params);
  if (Object.keys(globals).length === 0) {
    globals = {
      ...params,
      mouse: {
        x: 0,
        y: 0,
      },

      initLoop: false,
    };
  }
  renderLoop.updateParams = params;
  if (globals.initLoop === false) {
    let perfWorldGenStart = performance.now();
    const grid = gridGen(params);
    let perfWorldGenEnd = performance.now();
    console.log("world gen took", perfWorldGenEnd - perfWorldGenStart);
    globals.initLoop = true;
    const cacheCanvas = params.cacheCanvas;
    const cacheCtx = cacheCanvas.getContext("2d");
    const canvas = params.canvas;
    const ctx = canvas.getContext("2d");

    const initialCameraX = (globals.world.wx - canvas.width) / 2;
    const initialCameraY = (globals.world.wy - canvas.height) / 2;
    console.log(initialCameraX, initialCameraY);
    // Set the initial camera position
    let cameraX = initialCameraX;
    let cameraY = initialCameraY;
    let vx = 0;

    let perfWorldCacheDrawStart = performance.now();
    let tileWorldBg = genTileWorld(
      cacheCtx,
      cacheCanvas,
      globals.world,
      grid,
      params.wordlTiles
    );

    let perfWorldCacheDrawEnd = performance.now();
    console.log(
      "world cache draw took",
      perfWorldCacheDrawEnd - perfWorldCacheDrawStart
    );
    ctx.fillStyle = tileWorldBg;
    renderLoop.update = (time, updateParams) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      if ((updateParams.mName = "io")) {
        if (updateParams?.wheel) {
          console.log(updateParams?.wheel.scale);
          ctx.scale(
            updateParams?.wheel.scale,
            updateParams?.wheel.scale
          );
          ctx.translate(
            updateParams?.wheel?.translateX,
            updateParams?.wheel?.translateY
          );
          // let scaledTiledWorld = genTileWorld(
          //   cacheCtx,
          //   cacheCanvas,
          //   globals.world,
          //   grid,
          //   globals.wordlTiles,
          //   updateParams?.wheel?.scale
          // );
          // ctx.fillStyle = scaledTiledWorld;
        }
      }
      ctx.translate(-cameraX, -cameraY);
      ctx.fillRect(0, 0, globals.world.wx, globals.world.wy);
      ctx.restore();
    };
    renderLoop.init();
  }
};
