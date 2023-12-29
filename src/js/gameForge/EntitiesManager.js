export default class EntityManager {
  constructor() {
    this.entities = [];
    this.entityMap = new Map(); // For quicker entity lookup
  }
  firstUpdate() {
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].firstUpdate();
    }
  }

  addEntity(entity) {
    if (!this.entityMap.has(entity.id)) {
      this.entities.push(entity);
      this.entityMap.set(entity.id, this.entities.length - 1);
    }
  }
  getEntityById(id) {
    if (this.entityMap.has(id)) {
      return this.entities[this.entityMap.get(id)];
    }
  }
  removeEntity(entity) {
    if (this.entityMap.has(entity.id)) {
      const indexToRemove = this.entityMap.get(entity.id);
      const lastIndex = this.entities.length - 1;

      // Swap with last element to avoid array shifting
      this.entities[indexToRemove] = this.entities[lastIndex];
      this.entities.pop(); // Remove last element (now a duplicate)

      // Update the index of the swapped entity in the map
      this.entityMap.set(this.entities[indexToRemove].id, indexToRemove);

      this.entityMap.delete(entity.id); // Remove entity from the map
    }
  }
  update({ delta, timeScale, now, layer } = {}) {
    for (let i = 0; i < this.entities.length; i++) {

      this.entities[i].update({ delta, timeScale, now });
    }
  }
}
