/**
 * Dino Doom: Santa's Last Stand
 * Shop System
 *
 * Weapon and upgrade purchasing.
 */

import { WEAPONS, UPGRADES, PRESTIGE_UPGRADES, SHOPKEEPER_DIALOGUE, GAME_CONFIG } from '../constants.js';
import { gameState, inventory, player, achievementTracking } from '../state.js';
import { playSound } from './audio.js';
import { checkShopAchievements } from './achievements.js';

/**
 * Checks if all basic upgrades are maxed out
 * @returns {boolean} True if all basic upgrades are at max level
 */
export function areAllBasicUpgradesMaxed() {
    return Object.entries(UPGRADES).every(
        ([key, upgrade]) => inventory.upgrades[key] >= upgrade.maxLevel
    );
}

/**
 * Gets the price for a prestige upgrade at a specific level
 * @param {string} upgradeKey - The prestige upgrade key
 * @param {number} currentLevel - Current level of the upgrade
 * @returns {number} Price for the next level
 */
export function getPrestigeUpgradePrice(upgradeKey, currentLevel) {
    const upgrade = PRESTIGE_UPGRADES[upgradeKey];
    return upgrade.basePrice + (currentLevel * upgrade.priceIncrease);
}

/**
 * Gets the current coin multiplier from prestige upgrades
 * @returns {number} Coin multiplier (1.0 = no bonus)
 */
export function getCoinMultiplier() {
    return player.coinMultiplier;
}

/**
 * Gets shopkeeper dialogue based on player's coins
 * @returns {string} Dialogue line
 */
export function getShopkeeperDialogue() {
    let category;
    if (gameState.coins >= 2000) {
        category = 'rich';
    } else if (gameState.coins < 100) {
        category = 'broke';
    } else {
        category = 'normal';
    }
    const lines = SHOPKEEPER_DIALOGUE[category];
    return lines[Math.floor(Math.random() * lines.length)];
}

/**
 * Updates shopkeeper dialogue display
 * @param {string|null} type - 'purchase' for purchase reaction, null for normal
 */
export function updateShopkeeperDialogue(type = null) {
    const dialogue = type === 'purchase'
        ? SHOPKEEPER_DIALOGUE.purchase[Math.floor(Math.random() * SHOPKEEPER_DIALOGUE.purchase.length)]
        : getShopkeeperDialogue();
    document.getElementById('shopkeeper-dialogue').textContent = dialogue;
}

/**
 * Opens the shop screen
 * @param {Function} updateHUD - HUD update callback
 */
export function openShop(updateHUD) {
    if (!gameState.betweenWaves || !gameState.running) return;

    achievementTracking.shopSpending = 0;

    gameState.paused = true;
    document.getElementById('shop-screen').style.display = 'flex';
    document.getElementById('shop-coins').textContent = `🪙 ${gameState.coins}`;

    updateShopkeeperDialogue();
    renderShop(updateHUD);
}

/**
 * Closes the shop screen
 * @param {Function} spawnWave - Wave spawn callback
 */
export function closeShop(spawnWave) {
    gameState.paused = false;
    document.getElementById('shop-screen').style.display = 'none';

    if (gameState.betweenWaves) {
        gameState.betweenWaves = false;
        spawnWave();
    }
}

/**
 * Renders shop items
 * @param {Function} updateHUD - HUD update callback
 */
export function renderShop(updateHUD) {
    const weaponsList = document.getElementById('weapons-list');
    const upgradesList = document.getElementById('upgrades-list');

    weaponsList.innerHTML = '';
    upgradesList.innerHTML = '';

    // Weapons
    for (const [key, weapon] of Object.entries(WEAPONS)) {
        const owned = inventory.weapons[key];
        const equipped = inventory.currentWeapon === key;

        const item = document.createElement('div');
        item.className = `shop-item ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}`;
        item.innerHTML = `
            <div class="shop-item-icon">${weapon.emoji}</div>
            <div class="shop-item-name">${weapon.name}</div>
            <div class="shop-item-desc">${weapon.description}</div>
            <div class="shop-item-desc">DMG: ${weapon.damage} | RATE: ${weapon.fireRate}</div>
            <div class="shop-item-price">${owned ? (equipped ? '✓ EQUIPPED' : 'CLICK TO EQUIP') : `🪙 ${weapon.price}`}</div>
        `;

        item.onclick = () => {
            if (owned) {
                inventory.currentWeapon = key;
                playSound('buy');
                updateHUD();
                renderShop(updateHUD);
            } else if (gameState.coins >= weapon.price) {
                gameState.coins -= weapon.price;
                checkShopAchievements(weapon.price);
                inventory.weapons[key] = true;
                inventory.currentWeapon = key;
                playSound('buy');
                updateShopkeeperDialogue('purchase');
                document.getElementById('shop-coins').textContent = `🪙 ${gameState.coins}`;
                updateHUD();
                renderShop(updateHUD);
            }
        };

        weaponsList.appendChild(item);
    }

    // Upgrades
    for (const [key, upgrade] of Object.entries(UPGRADES)) {
        const level = inventory.upgrades[key];
        const maxed = level >= upgrade.maxLevel;
        const price = upgrade.basePrice + (level * 100);

        const item = document.createElement('div');
        item.className = `shop-item ${maxed ? 'maxed' : ''}`;
        item.innerHTML = `
            <div class="shop-item-icon">${upgrade.icon}</div>
            <div class="shop-item-name">${upgrade.name}</div>
            <div class="shop-item-desc">${upgrade.description}</div>
            <div class="shop-item-level">Level ${level} / ${upgrade.maxLevel}</div>
            <div class="shop-item-price">${maxed ? 'MAXED' : `🪙 ${price}`}</div>
        `;

        item.onclick = () => {
            if (!maxed && gameState.coins >= price) {
                gameState.coins -= price;
                checkShopAchievements(price);
                inventory.upgrades[key]++;
                playSound('buy');
                updateShopkeeperDialogue('purchase');
                applyUpgrades();
                document.getElementById('shop-coins').textContent = `🪙 ${gameState.coins}`;
                updateHUD();
                renderShop(updateHUD);
            }
        };

        upgradesList.appendChild(item);
    }

    // Prestige Upgrades (only show when all basic upgrades are maxed)
    renderPrestigeUpgrades(updateHUD);
}

/**
 * Renders prestige upgrades section
 * @param {Function} updateHUD - HUD update callback
 */
export function renderPrestigeUpgrades(updateHUD) {
    const prestigeContainer = document.getElementById('prestige-upgrades');
    if (!prestigeContainer) return;

    const prestigeUnlocked = areAllBasicUpgradesMaxed();

    if (!prestigeUnlocked) {
        prestigeContainer.style.display = 'none';
        return;
    }

    prestigeContainer.style.display = 'block';
    const prestigeList = document.getElementById('prestige-list');
    if (!prestigeList) return;

    prestigeList.innerHTML = '';

    for (const [key, upgrade] of Object.entries(PRESTIGE_UPGRADES)) {
        const level = inventory.prestigeUpgrades[key];
        const price = getPrestigeUpgradePrice(key, level);

        const item = document.createElement('div');
        item.className = 'shop-item prestige-item';
        item.innerHTML = `
            <div class="shop-item-icon">${upgrade.icon}</div>
            <div class="shop-item-name">${upgrade.name}</div>
            <div class="shop-item-desc">${upgrade.description}</div>
            <div class="shop-item-level">Level ${level}</div>
            <div class="shop-item-price">🪙 ${price}</div>
        `;

        item.onclick = () => {
            if (gameState.coins >= price) {
                gameState.coins -= price;
                checkShopAchievements(price);
                inventory.prestigeUpgrades[key]++;
                playSound('buy');
                updateShopkeeperDialogue('purchase');
                applyUpgrades();
                document.getElementById('shop-coins').textContent = `🪙 ${gameState.coins}`;
                updateHUD();
                renderShop(updateHUD);
            }
        };

        prestigeList.appendChild(item);
    }
}

/**
 * Applies purchased upgrades to player stats
 */
export function applyUpgrades() {
    // Apply basic upgrades
    const baseHealth = GAME_CONFIG.PLAYER_BASE_HEALTH + (inventory.upgrades.health * UPGRADES.health.perLevel);
    player.damageBonus = inventory.upgrades.damage * UPGRADES.damage.perLevel;
    player.fireRateBonus = inventory.upgrades.fireRate * UPGRADES.fireRate.perLevel;
    const baseCritChance = GAME_CONFIG.PLAYER_BASE_CRIT_CHANCE + (inventory.upgrades.critChance * UPGRADES.critChance.perLevel);

    // Apply prestige upgrades (multipliers)
    player.damageMultiplier = 1 + (inventory.prestigeUpgrades.overkill * PRESTIGE_UPGRADES.overkill.perLevel);
    player.fireRateMultiplier = 1 + (inventory.prestigeUpgrades.bulletHell * PRESTIGE_UPGRADES.bulletHell.perLevel);
    player.healthMultiplier = 1 + (inventory.prestigeUpgrades.titanHealth * PRESTIGE_UPGRADES.titanHealth.perLevel);
    player.coinMultiplier = 1 + (inventory.prestigeUpgrades.coinMagnet * PRESTIGE_UPGRADES.coinMagnet.perLevel);

    // Calculate final values with prestige multipliers
    gameState.maxHealth = Math.floor(baseHealth * player.healthMultiplier);
    player.critChance = baseCritChance + (inventory.prestigeUpgrades.criticalMass * PRESTIGE_UPGRADES.criticalMass.perLevel);
}
