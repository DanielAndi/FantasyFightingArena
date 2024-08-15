import { Armor } from '../classes/Armor.js';
import { Weapon } from '../classes/Weapon.js';

export function updateInventory(player) {
  const inventoryList = document.getElementById('inventory-list');
  if (!inventoryList) {
    console.error('Element with ID "inventory-list" does not exist.');
    return;
  }

  inventoryList.innerHTML = '';

  player.inventory.forEach((item, index) => {
    const itemButton = document.createElement('button');
    itemButton.innerText = `${item.name} - ${item instanceof Armor ? 'Armor' : item instanceof Weapon ? 'Weapon' : 'Potion'}`;
    itemButton.onclick = () => {
      if (item instanceof Armor || item instanceof Weapon) {
        equipItem(index);
      }
    };
    inventoryList.appendChild(itemButton);
  });

  // Add unequip buttons if the player has equipped items
  if (player.armor) {
    const unequipArmorButton = document.createElement('button');
    unequipArmorButton.innerText = `Unequip ${player.armor.name}`;
    unequipArmorButton.onclick = () => unequipItem('Armor');
    inventoryList.appendChild(unequipArmorButton);
  }

  if (player.weapon) {
    const unequipWeaponButton = document.createElement('button');
    unequipWeaponButton.innerText = `Unequip ${player.weapon.name}`;
    unequipWeaponButton.onclick = () => unequipItem('Weapon');
    inventoryList.appendChild(unequipWeaponButton);
  }
}

export function updatePlayerStats(player) {
  const playerLevel = document.getElementById('player-level');
  const playerHealth = document.getElementById('player-health');
  const playerArmor = document.getElementById('player-armor');
  const playerDamage = document.getElementById('player-damage');
  const playerSpeed = document.getElementById('player-speed');
  const playerMoney = document.getElementById('player-money');

  if (playerLevel) playerLevel.innerText = `Level: ${player.level}`;
  if (playerHealth) playerHealth.innerText = `Health: ${player.health}`;
  if (playerArmor) playerArmor.innerText = `Armor: ${player.armor ? player.armor.defense : 0}`;
  if (playerDamage) playerDamage.innerText = `Damage: ${player.weapon ? player.weapon.damage : 0}`;
  if (playerSpeed) playerSpeed.innerText = `Speed: ${player.speed}`;
  if (playerMoney) playerMoney.innerText = `Money: ${player.money}`;
}

export function updateBattleStats(player, enemy) {
  updatePlayerStats(player);

  const enemyHealth = document.getElementById('enemy-health');
  const enemyArmor = document.getElementById('enemy-armor');
  const enemyDamage = document.getElementById('enemy-damage');
  const enemySpeed = document.getElementById('enemy-speed');

  if (enemyHealth) enemyHealth.innerText = `Health: ${enemy.health}`;
  if (enemyArmor) enemyArmor.innerText = `Armor: ${enemy.armor}`;
  if (enemyDamage) enemyDamage.innerText = `Damage: ${enemy.damage}`;
  if (enemySpeed) enemySpeed.innerText = `Speed: ${enemy.speed}`;
}
