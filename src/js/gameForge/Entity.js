export default class {
  constructor({ id = null } = {}) {
    this.id = crypto.randomUUID();
    this.components = new Map();
  }
  addComponent(component) {
    this.components.set(component.name, component);
  }
  removeComponent(component) {
    this.components.delete(component.name);
  }
}
