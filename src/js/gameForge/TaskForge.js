export default class {
  constructor() {
    this.taskQueue = [];
    this.availableThreads = window.navigator.hardwareConcurrency || 2;
    this.workerPool = this.createWorkerPool();
  }

  createWorkerPool() {
    const workerPool = [];
    for (let i = 0; i < this.availableThreads; i++) {
      workerPool.push({
        busy: false,
        reserved: false,
        worker: this.createInlineWebWorker(),
        index: i,
      });
    }
    return workerPool;
  }

  createInlineWebWorker() {
    const blob = new Blob([
      `
      let globals = {};
      self.addEventListener('message', function(e) {
        const task = e.data;
        const transArgs = task.trasnferArgs
        const { func, params } = task;
        // Deserialize the function and parameters
        const deserializedParams = JSON.parse(params);
        const deserializedFunc = eval('(' + func + ')');
        const result = deserializedFunc(...deserializedParams);
        self.postMessage(result);
      });
    `,
    ]);
    const url = window.URL.createObjectURL(blob);
    const worker = new Worker(url);

    return worker;
  }
  // custom stringify function to handle circular references
  stringify(obj, indent = 2) {
    const cache = new Set();
    return JSON.stringify(
      obj,
      (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (cache.has(value)) {
            return;
          }
          cache.add(value);
        }
        return value;
      },
      indent
    );
  }

  async runTask(func, params = [], priority = 0) {
    // Serialize function and parameters
    const serializedFunc = func.toString();
    const serializedParams = this.stringify(params);
    // sort the task queue by priority
    this.taskQueue.sort((a, b) => b.priority - a.priority);

    // check if there is a free worker
    const availableWorker = this.workerPool.find((w) => !w.busy && !w.reserved);
    // if there is, run the task
    if (availableWorker) {
      availableWorker.busy = true;
      const worker = availableWorker.worker;
      // Create a new Promise and resolve it when the worker sends a message
      return new Promise((resolve, reject) => {
        worker.onmessage = (e) => {
          availableWorker.busy = false;
          resolve(e.data); // Resolve the Promise with the result
          if (this.taskQueue.length > 0) {
            // get the next task
            const nextTask = this.taskQueue.shift();
            // run the task
            this.runTask(nextTask.func, nextTask.params, nextTask.priority);
          }
        };
        // Send the serialized task to the worker
        worker.postMessage({ func: serializedFunc, params: serializedParams });
      });
    }
    // if not, push to queue
    this.taskQueue.push({
      func: serializedFunc,
      params: serializedParams,
      priority,
    });
  }

  reserveWorker() {
    const availableWorker = this.workerPool.find((w) => !w.busy && !w.reserved);
    if (availableWorker) {
      availableWorker.reserved = true;
      return availableWorker.worker;
    }
    return null; // No available workers or all workers are reserved/busy
  }
  runTaskOnWorker(worker, func, params = [], transfer = [], transferArgs = {}) {
    // Serialize function and parameters
    const serializedFunc = func.toString();
    const serializedParams = this.stringify(params);
    // Create a new Promise and resolve it when the worker sends a message
    return new Promise((resolve, reject) => {
      worker.onmessage = (e) => {
        resolve(e.data); // Resolve the Promise with the result
      };
      // Send the serialized task to the worker
      worker.postMessage(
        {
          trasnferArgs: transferArgs,
          func: serializedFunc,
          params: serializedParams,
        },
        transfer
      );
    });
  }

  static async postMessage(worker, params =[], transfer=[], transferArgs = {}){
    return new Promise((resolve, reject) => {
      worker.onmessage = (e) => {
        resolve(e.data); // Resolve the Promise with the result
      };
      // Send the serialized task to the worker
      worker.postMessage(
        {
          trasnferArgs: transferArgs,
          params: params,
        },
        transfer
      );
    });
  }

  releaseWorker(worker) {
    const targetWorker = this.workerPool.find(
      (w) => w.worker === worker && w.reserved
    );
    if (targetWorker) {
      targetWorker.reserved = false;
    }
  }
}
