import {
  updateInventory,
  updateBattleStats,
  updatePlayerStats,
} from "../utils/domUtils.js";
import { Armor } from "./Armor.js";
import { Weapon } from "./Weapon.js";

export class Player {
  constructor(name) {
    this.name = name;
    this.health = 100;

    this.armor = null;
    this.weapon = null;

    this.speed = 1.0;
    this.money = 100;
    this.level = 1;
    this.experience = 0;
    this.inventory = [];
  }

  buyItem(item) {
    if (this.money >= item.cost) {
      this.inventory.push(item);
      this.money -= item.cost;
      console.log(`Bought ${item.name}`);
      updateInventory(this);
    } else {
      console.log("Not enough money");
    }
  }

  attack(enemy) {
    let damage = this.damage - enemy.armor;
    damage = damage > 0 ? damage : 1; // Ensure at least 1 damage
    enemy.health -= damage;
    console.log(`Attacked enemy for ${damage} damage`);
    updateBattleStats(this, enemy);
  }

  usePotion(potion, enemy) {
    if (this.inventory.includes(potion)) {
      if (potion.type === "Health") {
        this.health += potion.effect;
      } else if (potion.type === "Damage") {
        enemy.health -= potion.effect;
      }
      this.inventory.splice(this.inventory.indexOf(potion), 1);
      console.log(`Used ${potion.name}`);
      updateInventory(this);
      updateBattleStats(this, enemy);
    }
  }

  defend() {
    this.armor += 5;
    console.log("Defending, increased armor");
    updatePlayerStats(this);
  }

  addExperience(amount) {
    this.experience += amount;
    console.log(
      `Gained ${amount} experience. Total experience: ${this.experience}`
    );
    if (this.experience >= this.level * 100) {
      this.levelUp();
    }
    updatePlayerStats(this);
  }

  levelUp() {
    this.level += 1;
    this.experience = 0;
    this.health += 20;
    this.armor += 5;
    this.damage += 5;
    console.log(`Leveled up to level ${this.level}`);
    updatePlayerStats(this);
  }

  receiveDamage(damage) {
    if (this.armor) {
      damage = this.armor.receiveDamage(damage);
    }
    this.health -= damage;
    console.log(`Received ${damage} damage`);
    updatePlayerStats(this);
  }

  equipItem(item) {
    if (item instanceof Armor) {
      this.armor = item;
    } else if (item instanceof Weapon) {
      this.weapon = item;
      this.damage = this.baseDamage + item.damage;
    }
    updatePlayerStats(this);
  }
}
