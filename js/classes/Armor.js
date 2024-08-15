import { Item } from './Item.js';

export class Armor extends Item {
  constructor(name, cost, defense, uniqueId) {
    super(name, cost, uniqueId);
    this.defense = defense;
  }

  receiveDamage(damage) {
    const reducedDamage = damage - this.defense;
    return reducedDamage > 0 ? reducedDamage : 0;
  }
}
