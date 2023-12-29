export default class Layer {
  constructor({
    width = 512,
    height = 512,
    zIndex = 0,
  } = {}) {
    this.canvas = document.createElement("canvas");
    this.offscreenCanvas = null
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = null;
    this.canvas.style.zIndex = zIndex;  
  }
  
  init(context = '2d') {
    this.ctx = this.canvas.getContext(context);
    return this;
  }
}
