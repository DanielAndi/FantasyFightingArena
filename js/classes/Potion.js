import { Item } from './Item.js';

export class Potion extends Item {
    constructor(name, cost, effect, type, uniqueId) {
        super(name, cost, uniqueId);
        this.effect = effect;
        this.type = type;
    }
}
