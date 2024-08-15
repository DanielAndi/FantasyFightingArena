import { updateInventory, updateBattleStats } from '../utils/domUtils.js';

export class Enemy {
    constructor(name, health, armor, damage, speed) {
        this.name = name;
        this.health = health;
        this.armor = armor;
        this.damage = damage;
        this.speed = speed;
    }

    attack(enemy) {
        let damage = this.damage - enemy.armor;
        damage = damage > 0 ? damage : 1; // Ensure at least 1 damage
        enemy.health -= damage;
        console.log(`Attacked enemy for ${damage} damage`);
        updateBattleStats(this, enemy);
    }
}
