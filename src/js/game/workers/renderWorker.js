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
    globals.initLoop = true;
    // init the canvases
    const cacheCanvas = params.cacheCanvas;
    const cacheCtx = cacheCanvas.getContext("2d");
    const canvas = params.canvas;
    const ctx = canvas.getContext("2d");

    const initialCameraX = (globals.world.wx - canvas.width) / 2;
    const initialCameraY = (globals.world.wy - canvas.height) / 2;
    // Set the initial camera position
    let cameraX = initialCameraX;
    let cameraY = initialCameraY;

    ctx.fillStyle = tileWorldBg;
    renderLoop.update = (time, updateParams) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
    
      ctx.translate(-cameraX, -cameraY);
      ctx.fillRect(0, 0, globals.world.wx, globals.world.wy);
      ctx.restore();
    };
    renderLoop.init();
  }
};
