/**
 * Tests for module integration, game balance, and data consistency
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { loadConstants, readFile } from './test-helpers.js';

let gameData;
try {
    gameData = loadConstants();
} catch (e) {
    console.error('Failed to load constants:', e.message);
    process.exit(1);
}

// ==================== INTEGRATION TESTS ====================
describe('Module Integration', () => {
    test('Constants are imported by state module', () => {
        const stateContent = readFile('js/state.js');

        assert.ok(stateContent.includes("from './constants.js'"), 'State should import from constants');
        assert.ok(stateContent.includes('GAME_CONFIG'), 'State should use GAME_CONFIG');
    });

    test('Classes import from constants and state', () => {
        const enemyContent = readFile('js/classes/Enemy.js');

        assert.ok(enemyContent.includes("from '../constants.js'"), 'Enemy should import constants');
        assert.ok(enemyContent.includes("from '../state.js'"), 'Enemy should import state');
    });

    test('Systems import from constants and state', () => {
        const achievementContent = readFile('js/systems/achievements.js');

        assert.ok(achievementContent.includes("from '../constants.js'"), 'Achievements should import constants');
        assert.ok(achievementContent.includes("from '../state.js'"), 'Achievements should import state');
    });

    test('Game module imports all necessary components', () => {
        const gameContent = readFile('js/game.js');

        assert.ok(gameContent.includes("from './constants.js'"), 'Game should import constants');
        assert.ok(gameContent.includes("from './state.js'"), 'Game should import state');
        assert.ok(gameContent.includes("from './classes/"), 'Game should import classes');
    });
});

// ==================== UTILITY FUNCTION TESTS ====================
describe('Utility Functions', () => {
    test('formatTime function implementation', () => {
        const deathContent = readFile('js/systems/death.js');

        // Extract and test the formatTime function
        assert.ok(deathContent.includes('Math.floor(ms / 1000)'), 'formatTime should convert ms to seconds');
        assert.ok(deathContent.includes('padStart'), 'formatTime should pad seconds');
    });

    test('getMemeRating function uses all ratings', () => {
        const deathContent = readFile('js/systems/death.js');

        assert.ok(deathContent.includes('for'), 'getMemeRating should iterate through ratings');
        assert.ok(deathContent.includes('minScore'), 'getMemeRating should check minScore');
    });
});

// ==================== BALANCE TESTS ====================
describe('Game Balance', () => {
    test('Weapon damage scales appropriately with price', () => {
        const weapons = Object.entries(gameData.WEAPONS);
        const freeWeapon = weapons.find(([_, w]) => w.price === 0);
        const expensiveWeapons = weapons.filter(([_, w]) => w.price >= 2000);

        assert.ok(freeWeapon, 'Should have free starting weapon');
        expensiveWeapons.forEach(([key, weapon]) => {
            assert.ok(
                weapon.damage > freeWeapon[1].damage,
                `Expensive weapon ${key} should deal more damage than free weapon`
            );
        });
    });

    test('Enemy difficulty scales appropriately', () => {
        const gigachad = gameData.ENEMY_TYPES.GIGACHAD;
        const buffNerd = gameData.ENEMY_TYPES.BUFF_NERD;

        // Gigachad should be tankier but slower
        assert.ok(gigachad.health > buffNerd.health, 'Gigachad should have more health');
        assert.ok(gigachad.speed < buffNerd.speed, 'Gigachad should be slower');
    });

    test('Boss rewards are proportional to difficulty', () => {
        const boss = gameData.ENEMY_TYPES.MINI_BOSS;
        const regularEnemies = Object.values(gameData.ENEMY_TYPES).filter(e => !e.isBoss);

        const avgRegularPoints = regularEnemies.reduce((sum, e) => sum + e.points, 0) / regularEnemies.length;
        const avgRegularCoins = regularEnemies.reduce((sum, e) => sum + e.coins, 0) / regularEnemies.length;

        assert.ok(boss.points > avgRegularPoints * 3, 'Boss should give significantly more points');
        assert.ok(boss.coins > avgRegularCoins * 5, 'Boss should give significantly more coins');
    });

    test('Upgrade values are balanced', () => {
        // Damage upgrade should not exceed weapon damage too much
        const damageUpgrade = gameData.UPGRADES.damage;
        const maxDamageBonus = damageUpgrade.maxLevel * damageUpgrade.perLevel;
        const baseWeaponDamage = gameData.WEAPONS.present.damage;

        assert.ok(maxDamageBonus < baseWeaponDamage * 5, 'Max damage upgrade should not be excessive');
    });

    test('Crit chance upgrade is capped appropriately', () => {
        const critUpgrade = gameData.UPGRADES.critChance;
        const baseCrit = gameData.GAME_CONFIG.PLAYER_BASE_CRIT_CHANCE;
        const maxCrit = baseCrit + (critUpgrade.maxLevel * critUpgrade.perLevel);

        assert.ok(maxCrit <= 0.5, 'Max crit chance should not exceed 50%');
    });
});

// ==================== DATA CONSISTENCY TESTS ====================
describe('Data Consistency', () => {
    test('All enemy types referenced in dialogue exist', () => {
        const dialogueTypes = Object.keys(gameData.ENEMY_DIALOGUE);
        const enemyTypes = Object.keys(gameData.ENEMY_TYPES);

        dialogueTypes.forEach(type => {
            assert.ok(
                enemyTypes.includes(type),
                `Dialogue enemy type ${type} should exist in ENEMY_TYPES`
            );
        });
    });

    test('All weapons referenced in inventory exist', () => {
        const stateContent = readFile('js/state.js');

        const weaponKeys = Object.keys(gameData.WEAPONS);
        weaponKeys.forEach(weapon => {
            assert.ok(
                stateContent.includes(weapon),
                `Weapon ${weapon} should be in initial inventory`
            );
        });
    });

    test('Achievement keys match between constants', () => {
        Object.entries(gameData.ACHIEVEMENTS).forEach(([key, achievement]) => {
            assert.ok(
                achievement.id.includes(key.toLowerCase()) || key.includes(achievement.id.toUpperCase().replace(/_/g, '')),
                `Achievement key ${key} should match id pattern`
            );
        });
    });
});
