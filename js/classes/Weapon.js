import { Item } from './Item.js';

export class Weapon extends Item {
    constructor(name, cost, damage, uniqueId) {
        super(name, cost, uniqueId);
        this.damage = damage;
    }
}
