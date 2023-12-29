export default class {
  constructor({ maxFps = 60, updateParams = {} } = {}) {
    this.targetFps = maxFps;
    this.startTime = performance.now();
    this.lastUpdate = performance.now();
    this.currentFps = 0;
    this.now = 0;
    this.frameTime = 1000 / this.targetFps;
    this.delta = 0;
    this.timeScale = 1;
    this.paused = false;
    this.frameCount = 0;
    this.fpsTotal = 0;
    this.updateParams = updateParams;
  }
  start() {}
  update({ delta, timeScale, now } = {}) {}
  stopWatch() {}
  tick(timestamp) {
    if (this.paused) {
      return;
    }
    if (!timestamp) timestamp = performance.now();
    this.delta = timestamp - this.lastUpdate;
    this.now = timestamp;
    this.frameCount++;
    this.fpsTotal += this.delta;
    
    if (this.frameCount >= this.targetFps) {
      this.currentFps = Math.round(1000 / (this.fpsTotal / this.frameCount));

      this.frameCount = 0;
      this.fpsTotal = 0;
    }
    if (this.delta > this.frameTime) {
      this.update({
        delta: this.delta,
        timeScale: this.timeScale,
        now: this.now,
        /* The `currentFps` property is being passed as an argument to the `update` method. It
        represents the current frames per second (FPS) of the animation. */
        currentFps: this.currentFps,
      }, this.updateParams);

      this.lastUpdate = timestamp - (this.delta % this.frameTime);
    }

    // Call stopWatch every second
    if (this.now - this.startTime >= 1000) {
      this.stopWatch();
      this.startTime = this.now;
    }

    requestAnimationFrame(this.tick);
  }
  init() {
    this.start();
    this.tick = this.tick.bind(this); // Bind `tick` function here
    this.tick();
  }
}
