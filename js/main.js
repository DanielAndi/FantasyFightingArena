import { Player } from './classes/Player.js';
import { Potion } from './classes/Potion.js';
import { Enemy } from './classes/Enemy.js';
import { Armor } from './classes/Armor.js';
import { Weapon } from './classes/Weapon.js';
import {
  updateInventory,
  updateBattleStats,
  updatePlayerStats,
} from './utils/domUtils.js';

const player = new Player("Hero");
const initialEnemyStats = {
  name: "Goblin",
  health: 60,
  armor: 2,
  damage: 5,
  speed: 0.8,
};
let enemy = new Enemy(
  initialEnemyStats.name,
  initialEnemyStats.health,
  initialEnemyStats.armor,
  initialEnemyStats.damage,
  initialEnemyStats.speed
);

let mainMenu;
let store;
let battle;
let inventory;
let playerStats;

const items = {
  Armor: [
    new Armor("Level 1 Armor", 20, 5, "armor-1"),
    new Armor("Level 2 Armor", 40, 10, "armor-2"),
    new Armor("Level 3 Armor", 60, 15, "armor-3"),
  ],
  Weapon: [
    new Weapon("Level 1 Weapon", 20, 5, "weapon-1"),
    new Weapon("Level 2 Weapon", 40, 10, "weapon-2"),
    new Weapon("Level 3 Weapon", 60, 15, "weapon-3"),
  ],
  Potion: [
    new Potion("Health Potion", 10, 20, "Health", "potion-health"),
    new Potion("Damage Potion", 10, 15, "Damage", "potion-damage"),
  ],
};

function showMainMenu(accessNumber) {
  switch (accessNumber) {
    case 0:
      displaySection("main-body", mainMenu);
      displaySection("stats1", playerStats);
      closeSection("inventory");
      break;
    case 1:
      displaySection("main-body", mainMenu);
      displaySection("stats1", playerStats);
      closeSection("battle");
      break;
    case 2:
      displaySection("main-body", mainMenu);
      displaySection("stats1", playerStats);
      closeSection("store");
      closeSection("inventory");
      break;
    case 3:
      document.getElementById("main-menu").classList.remove("hidden");
      displaySection("stats1", playerStats);
      document.getElementById("start").classList.add("hidden");
      storeDivs();
      break;
    default:
      console.error(`Invalid access number: ${accessNumber}`);
  }
  updatePlayerStats(player);
}

function showStore() {
  displaySection("main-body", store);
  document.getElementById("store").classList.remove("hidden");
  displaySection("main-body", inventory);
  if (!inventory.classList.contains("hidden")) {
    document.getElementById("inventory").classList.add("hidden");
  }
  if (!playerStats.classList.contains("hidden")) {
    document.getElementById("player-stats").classList.add("hidden");
  }
  closeSection("main-menu");
}

function showBattle() {
  displaySection("main-body", battle);
  displaySection("stats2", playerStats);
  document.getElementById("battle").classList.remove("hidden");
  displaySection("main-body", inventory);
  if (!inventory.classList.contains("hidden")) {
    document.getElementById("inventory").classList.add("hidden");
  }
  updateBattleStats(player, enemy);
  closeSection("main-menu");
}

function showInventory() {
  console.log("showInventory() called.");
  displaySection("main-body", inventory);
  displaySection("stats3", playerStats);
  document.getElementById("inventory").classList.remove("hidden");
  updateInventory(player);
  closeSection("main-menu");
  const element = document.getElementById("player-stats");
  if (element) {
    if (!element.classList.contains("hidden")) {
      element.classList.add("hidden");
    }
  }
}

function buyItem(type, identifier) {
  let item;

  // Find the item by its unique identifier
  if (type === "Potion") {
      item = items[type].find((p) => p.uniqueId === identifier);
  } else {
      item = items[type].find((i) => i.uniqueId === identifier);
  }

  // Check if the player has enough money to buy the item
  if (player.money >= item.cost) {
      // Proceed with the purchase
      player.buyItem(item);
      updateInventory(player);

      // Disable the button
      const button = document.getElementById(identifier);
      if (button) {
          button.disabled = true;
          button.style.backgroundColor = "#999"; // Change the button color to indicate it's disabled
          button.style.cursor = "not-allowed";
          button.innerText = "Already Bought";
      }
  } else {
      console.log("Not enough money to buy this item.");
  }
}


function equipItem(index) {
  const item = player.inventory[index];
  if (item) {
    player.equipItem(item);
    console.log(`Equipped ${item.name}`);
    updatePlayerStats(player);
    updateInventory(player);
  } else {
    console.log("No such item in inventory");
  }
}

function unequipItem(type) {
  if (type === "Armor" && player.armor) {
    player.armor = null;
    console.log("Unequipped armor");
  } else if (type === "Weapon" && player.weapon) {
    player.weapon = null;
    player.damage = player.baseDamage; // Reset damage to base damage
    console.log("Unequipped weapon");
  }
  updatePlayerStats(player);
  updateInventory(player);
}

function attack() {
  player.attack(enemy);
  updateBattleStats(player, enemy);

  if (enemy.health <= 0) {
    console.log("Enemy defeated!");
    resetEnemyStats();
    resetPlayerStats();
    addRewards();
    updateBattleStats(player, enemy); // Reflect reset stats

    showMainMenu(1);
  } else {
    enemy.attack(player);
    player.receiveDamage(enemy.damage);
    updatePlayerStats(player); // Only update player stats here

    if (player.health <= 0) {
      console.log("Player defeated!");
      resetEnemyStats();
      resetPlayerStats();
      updateBattleStats(player, enemy); // Reflect reset stats
      showMainMenu(1);
    } else {
      // Update battle stats to reflect the latest state after both attacks
      updateBattleStats(player, enemy);
    }
  }
}
function usePotion() {
  const potionDropdown = document.getElementById("potion-dropdown");
  const potionSelect = document.getElementById("potion-select");

  // Clear any previous options in the dropdown
  potionSelect.innerHTML =
    '<option value="" disabled selected>Select a Potion</option>';

  // Populate the dropdown with available potions from the player's inventory
  player.inventory.forEach((item, index) => {
    if (item instanceof Potion) {
      const option = document.createElement("option");
      option.value = index;
      option.text = `${item.name} - ${item.type}`;
      potionSelect.appendChild(option);
    }
  });

  // Show the dropdown menu
  potionDropdown.classList.remove("hidden");
}

function useSelectedPotion() {
  const potionSelect = document.getElementById("potion-select");
  const selectedIndex = potionSelect.value;

  if (selectedIndex !== "") {
    const selectedPotion = player.inventory[selectedIndex];
    if (selectedPotion) {
      player.usePotion(selectedPotion, enemy);
      console.log(`Used ${selectedPotion.name}`);
      // Hide the dropdown after using the potion
      document.getElementById("potion-dropdown").classList.add("hidden");
    }
  } else {
    console.log("No potion selected.");
  }
}

function defend() {
  player.defend();
}

function closeSection(sectionID) {
  console.log("Closing section: " + sectionID);
  const section = document.getElementById(sectionID);

  if (!section) {
    console.error(`Element with ID "${sectionID}" not found.`);
    return;
  }

  switch (sectionID) {
    case "main-menu":
      mainMenu = section;
      break;
    case "store":
      store = section;
      break;
    case "inventory":
      inventory = section;
      break;
    case "battle":
      battle = section;
      break;
    default:
      console.error(`Invalid section ID: ${sectionID}`);
      return;
  }

  section.parentNode.removeChild(section);
}

function displaySection(where, what) {
  if (typeof where !== "string") {
    console.error(
      'Parameter "where" must be a string representing the ID of the target element.'
    );
    return;
  }

  if (!(what instanceof Node)) {
    console.error('Parameter "what" must be a valid Node.');
    return;
  }

  const targetElement = document.getElementById(where);
  if (targetElement) {
    targetElement.appendChild(what);
  } else {
    console.error(`Element with ID "${where}" not found.`);
  }
  if (what.classList.contains("hidden")) {
    what.classList.remove("hidden");
  }
}

function storeDivs() {
  mainMenu = document.getElementById("main-menu");
  store = document.getElementById("store");
  battle = document.getElementById("battle");
  inventory = document.getElementById("inventory");
  playerStats = document.getElementById("player-stats");
  console.log("Divs stored:", { mainMenu, store, battle, inventory });
}

function resetEnemyStats() {
  const levelMultiplier = 1 + player.level * 0.25; // Enemy stats increase by 20% for each player level

  // Calculate the new enemy stats based on the player's level
  const upgradedHealth = Math.floor(initialEnemyStats.health * levelMultiplier);
  const upgradedArmor = Math.floor(initialEnemyStats.armor * levelMultiplier);
  const upgradedDamage = Math.floor(initialEnemyStats.damage * levelMultiplier);
  const upgradedSpeed = initialEnemyStats.speed * (1 + player.level * 0.05); // Speed increases by 5% per level

  // Create a new enemy with the upgraded stats
  enemy = new Enemy(
    initialEnemyStats.name,
    upgradedHealth,
    upgradedArmor,
    upgradedDamage,
    upgradedSpeed
  );

  console.log(
    "Enemy stats have been reset and upgraded based on player level."
  );
}

function resetPlayerStats() {
  const levelMultiplier = 1 + player.level * 0.2; // Player stats increase by 20% per level

  player.health = Math.floor(100 * levelMultiplier); // Initial base health scaled by level
  //player.armor = null; // Reset armor to none
  //player.weapon = null; // Reset weapon to none
  //player.baseDamage = Math.floor(10 * levelMultiplier); // Initial base damage scaled by level
  //player.damage = player.baseDamage; // Reset damage to base damage
  player.speed = 1.0; // Speed remains constant
  //player.money = Math.floor(100 * levelMultiplier); // Initial money scaled by level
  //player.experience = 0; // Reset experience, which might be needed for leveling up

  console.log(
    "Player stats have been reset and upgraded based on player level."
  );
  updatePlayerStats(player); // Update the UI to reflect the reset stats
}

function addRewards() {
  // Base experience and money gain
  const baseExperience = 100;
  const baseMoney = 50;

  // Scaling with enemy difficulty
  const experienceGain = Math.floor(
    (baseExperience * (enemy.health + enemy.damage)) / 100
  );
  const moneyGain = Math.floor(
    (baseMoney * (enemy.health + enemy.damage)) / 100
  );

  // Adding rewards to the player
  player.addExperience(experienceGain);
  player.money += moneyGain;

  console.log(
    `Player gained ${experienceGain} experience and ${moneyGain} money.`
  );
  updatePlayerStats(player);
}

document.addEventListener("DOMContentLoaded", () => {
  updateInventory(player);
});

window.showMainMenu = showMainMenu;
window.showStore = showStore;
window.showBattle = showBattle;
window.showInventory = showInventory;
window.buyItem = buyItem;
window.attack = attack;
window.usePotion = usePotion;
window.defend = defend;
window.storeDivs = storeDivs;
window.equipItem = equipItem;
window.unequipItem = unequipItem;
window.useSelectedPotion = useSelectedPotion;
