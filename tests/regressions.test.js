/**
 * Tests for bug fix regressions and refactors
 * Ensures previously fixed bugs don't reappear
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

// ==================== BUG FIX REGRESSION TESTS ====================
describe('Bug Fix Regressions', () => {
    // BUG-007: Shop guard condition must use || to prevent shop opening after game over
    test('BUG-007: Shop guard uses OR condition to prevent post-game-over access', () => {
        const shopContent = readFile('js/systems/shop.js');

        // The guard must use || (OR) not && (AND) to correctly prevent shop access
        // Correct: if (!gameState.betweenWaves || !gameState.running) return;
        // Wrong: if (!gameState.betweenWaves && gameState.running) return;
        assert.ok(
            shopContent.includes('!gameState.betweenWaves || !gameState.running'),
            'Shop guard should use OR (||) condition: if (!gameState.betweenWaves || !gameState.running) return'
        );
        assert.ok(
            !shopContent.includes('!gameState.betweenWaves && gameState.running'),
            'Shop guard should NOT use AND (&&) with mixed negation which allows shop access when game is not running'
        );
    });

    // BUG-008: Enemy cleanup must use simple reverse-order loop, not confusing double-filter ternary
    test('BUG-008: Enemy cleanup uses reverse-order loop pattern', () => {
        const gameContent = readFile('js/game.js');

        // Should use simple reverse loop with markedForRemoval
        assert.ok(
            gameContent.includes('for (let i = enemies.length - 1; i >= 0; i--)'),
            'Enemy cleanup should use reverse-order for loop'
        );
        assert.ok(
            gameContent.includes('enemies[i].markedForRemoval'),
            'Enemy cleanup should check markedForRemoval flag'
        );
        // Should NOT use the confusing double-filter ternary pattern
        assert.ok(
            !gameContent.includes('enemies.filter(e => !e.markedForRemoval).length === enemies.length'),
            'Enemy cleanup should NOT use confusing double-filter ternary pattern'
        );
    });

    // BUG-009: Minigame boss removal must use markedForRemoval flag, not direct splice
    test('BUG-009: Minigame boss removal uses markedForRemoval flag', () => {
        const minigameContent = readFile('js/systems/minigame.js');

        // Should use markedForRemoval flag for consistency
        assert.ok(
            minigameContent.includes('gameState.currentBoss.markedForRemoval = true'),
            'Minigame should set markedForRemoval flag on boss death'
        );
        // Should NOT directly splice from enemies array
        assert.ok(
            !minigameContent.includes('enemies.splice(idx, 1)'),
            'Minigame should NOT directly splice boss from enemies array'
        );
        assert.ok(
            !minigameContent.includes('enemies.indexOf(gameState.currentBoss)'),
            'Minigame should NOT search for boss index to splice'
        );
    });

    // BUG-010: applyUpgrades must set damageBonus and fireRateBonus consistently
    test('BUG-010: applyUpgrades sets damageBonus and fireRateBonus', () => {
        const shopContent = readFile('js/systems/shop.js');

        // Should apply all upgrades consistently in applyUpgrades()
        assert.ok(
            shopContent.includes('player.damageBonus = inventory.upgrades.damage * UPGRADES.damage.perLevel'),
            'applyUpgrades should set player.damageBonus'
        );
        assert.ok(
            shopContent.includes('player.fireRateBonus = inventory.upgrades.fireRate * UPGRADES.fireRate.perLevel'),
            'applyUpgrades should set player.fireRateBonus'
        );
    });

    // BUG-010: Player state must include damageBonus and fireRateBonus properties
    test('BUG-010: Player state includes damageBonus and fireRateBonus', () => {
        const stateContent = readFile('js/state.js');

        // Player object should have these properties initialized
        assert.ok(
            stateContent.includes('damageBonus: 0'),
            'Player state should initialize damageBonus to 0'
        );
        assert.ok(
            stateContent.includes('fireRateBonus: 0'),
            'Player state should initialize fireRateBonus to 0'
        );
    });

    // BUG-010: resetPlayerState must reset damageBonus and fireRateBonus
    test('BUG-010: resetPlayerState resets damageBonus and fireRateBonus', () => {
        const stateContent = readFile('js/state.js');

        // Extract resetPlayerState function and check it resets these values
        assert.ok(
            stateContent.includes('player.damageBonus = 0'),
            'resetPlayerState should reset damageBonus to 0'
        );
        assert.ok(
            stateContent.includes('player.fireRateBonus = 0'),
            'resetPlayerState should reset fireRateBonus to 0'
        );
    });

    // BUG-009: Minigame should not import enemies array (no longer needed)
    test('BUG-009: Minigame does not import unused enemies array', () => {
        const minigameContent = readFile('js/systems/minigame.js');

        // Should NOT import enemies since we use markedForRemoval flag now
        const importLine = minigameContent.match(/import\s*{[^}]*}\s*from\s*['"]\.\.\/state\.js['"]/);
        if (importLine) {
            assert.ok(
                !importLine[0].includes('enemies'),
                'Minigame should not import enemies array (uses markedForRemoval flag instead)'
            );
        }
    });
});

// ==================== REFACTOR-001: PERSPECTIVE AND SPAWN CONSTANTS TESTS ====================
describe('REFACTOR-001: Perspective and Spawn Constants', () => {
    test('GAME_CONFIG has perspective constants', () => {
        assert.ok(
            gameData.GAME_CONFIG.hasOwnProperty('PERSPECTIVE_SCALE'),
            'GAME_CONFIG should have PERSPECTIVE_SCALE'
        );
        assert.ok(
            gameData.GAME_CONFIG.hasOwnProperty('PERSPECTIVE_MIN_Z'),
            'GAME_CONFIG should have PERSPECTIVE_MIN_Z'
        );
        assert.strictEqual(gameData.GAME_CONFIG.PERSPECTIVE_SCALE, 400, 'PERSPECTIVE_SCALE should be 400');
        assert.strictEqual(gameData.GAME_CONFIG.PERSPECTIVE_MIN_Z, 100, 'PERSPECTIVE_MIN_Z should be 100');
    });

    test('GAME_CONFIG has spawn position constants', () => {
        const spawnProps = [
            'SIGMA_SPAWN_X',
            'SIGMA_SPAWN_Z_BASE',
            'SIGMA_SPAWN_Z_RANGE',
            'ENEMY_SPAWN_X_RANGE',
            'ENEMY_SPAWN_Z_BASE',
            'ENEMY_SPAWN_Z_RANGE'
        ];

        spawnProps.forEach(prop => {
            assert.ok(
                gameData.GAME_CONFIG.hasOwnProperty(prop),
                `GAME_CONFIG should have ${prop}`
            );
        });
    });

    test('Spawn constants have correct values', () => {
        const config = gameData.GAME_CONFIG;
        assert.strictEqual(config.SIGMA_SPAWN_X, 500, 'SIGMA_SPAWN_X should be 500');
        assert.strictEqual(config.SIGMA_SPAWN_Z_BASE, -400, 'SIGMA_SPAWN_Z_BASE should be -400');
        assert.strictEqual(config.SIGMA_SPAWN_Z_RANGE, 200, 'SIGMA_SPAWN_Z_RANGE should be 200');
        assert.strictEqual(config.ENEMY_SPAWN_X_RANGE, 800, 'ENEMY_SPAWN_X_RANGE should be 800');
        assert.strictEqual(config.ENEMY_SPAWN_Z_BASE, -800, 'ENEMY_SPAWN_Z_BASE should be -800');
        assert.strictEqual(config.ENEMY_SPAWN_Z_RANGE, 500, 'ENEMY_SPAWN_Z_RANGE should be 500');
    });

    test('Files use PERSPECTIVE_SCALE constant instead of magic number', () => {
        const filesToCheck = [
            { path: 'js/ui.js', name: 'ui.js' },
            { path: 'js/classes/Particle.js', name: 'Particle.js' },
            { path: 'js/classes/Projectile.js', name: 'Projectile.js' },
            { path: 'js/classes/Enemy.js', name: 'Enemy.js' },
            { path: 'js/classes/EnemyProjectile.js', name: 'EnemyProjectile.js' },
            { path: 'js/classes/GamerProjectile.js', name: 'GamerProjectile.js' },
            { path: 'js/systems/dialogue.js', name: 'dialogue.js' }
        ];

        filesToCheck.forEach(file => {
            const content = readFile(file.path);
            // Check for PERSPECTIVE_SCALE usage (should use the constant)
            assert.ok(
                content.includes('PERSPECTIVE_SCALE'),
                `${file.name} should use PERSPECTIVE_SCALE constant`
            );
        });
    });

    test('Game.js uses spawn position constants', () => {
        const gameContent = readFile('js/game.js');

        assert.ok(
            gameContent.includes('GAME_CONFIG.SIGMA_SPAWN_X'),
            'game.js should use SIGMA_SPAWN_X constant'
        );
        assert.ok(
            gameContent.includes('GAME_CONFIG.ENEMY_SPAWN_X_RANGE'),
            'game.js should use ENEMY_SPAWN_X_RANGE constant'
        );
    });
});

// ==================== REFACTOR-003: PARTICLE POOLING TESTS ====================
describe('REFACTOR-003: Particle Pooling', () => {
    test('State.js exports particle pool and functions', () => {
        const stateContent = readFile('js/state.js');

        assert.ok(
            stateContent.includes('export const particlePool = []'),
            'state.js should export particlePool array'
        );
        assert.ok(
            stateContent.includes('export function getParticle'),
            'state.js should export getParticle function'
        );
        assert.ok(
            stateContent.includes('export function returnParticle'),
            'state.js should export returnParticle function'
        );
    });

    test('getParticle function creates or reuses particles', () => {
        const stateContent = readFile('js/state.js');

        // Check getParticle uses pool.pop() and new Particle
        assert.ok(
            stateContent.includes('particlePool.pop()'),
            'getParticle should pop from pool'
        );
        assert.ok(
            stateContent.includes('new Particle'),
            'getParticle should create new Particle if pool empty'
        );
        assert.ok(
            stateContent.includes('p.reset('),
            'getParticle should reset pooled particles'
        );
    });

    test('returnParticle function returns particles to pool', () => {
        const stateContent = readFile('js/state.js');

        assert.ok(
            stateContent.includes('particlePool.push(p)'),
            'returnParticle should push to pool'
        );
        assert.ok(
            stateContent.includes('MAX_POOL_SIZE'),
            'returnParticle should check MAX_POOL_SIZE'
        );
    });

    test('Particle class has reset method', () => {
        const particleContent = readFile('js/classes/Particle.js');

        assert.ok(
            particleContent.includes('reset(x, y, z, color)'),
            'Particle should have reset method'
        );
        assert.ok(
            particleContent.includes('this.life = 30'),
            'Particle reset should set life to 30'
        );
    });

    test('Enemy.js uses getParticle instead of new Particle', () => {
        const enemyContent = readFile('js/classes/Enemy.js');

        assert.ok(
            enemyContent.includes('getParticle('),
            'Enemy.js should use getParticle function'
        );
        assert.ok(
            !enemyContent.includes('new Particle('),
            'Enemy.js should NOT use new Particle directly'
        );
    });

    test('Game.js uses returnParticle when particles expire', () => {
        const gameContent = readFile('js/game.js');

        assert.ok(
            gameContent.includes('returnParticle(p)'),
            'game.js should return particles to pool when expired'
        );
    });
});

// ==================== REFACTOR-004: REMOVED UNUSED KEYS CODE TESTS ====================
describe('REFACTOR-004: Removed Unused Keys Code', () => {
    test('State.js does not export keys object', () => {
        const stateContent = readFile('js/state.js');

        assert.ok(
            !stateContent.includes('export const keys = {}'),
            'state.js should NOT export keys object'
        );
    });

    test('State.js does not have setKeyState function', () => {
        const stateContent = readFile('js/state.js');

        assert.ok(
            !stateContent.includes('export function setKeyState'),
            'state.js should NOT export setKeyState function'
        );
    });

    test('Main.js does not import setKeyState', () => {
        const mainContent = readFile('js/main.js');

        assert.ok(
            !mainContent.includes('setKeyState'),
            'main.js should NOT import or use setKeyState'
        );
    });

    test('Main.js still has working keyboard events', () => {
        const mainContent = readFile('js/main.js');

        assert.ok(
            mainContent.includes("addEventListener('keydown'"),
            'main.js should have keydown listener'
        );
        assert.ok(
            mainContent.includes('shoot()'),
            'main.js should call shoot on space'
        );
        assert.ok(
            mainContent.includes('useHealingPower()'),
            'main.js should call useHealingPower on E key'
        );
    });
});

// ==================== REFACTOR-005: AUDIO ERROR HANDLING TESTS ====================
describe('REFACTOR-005: Audio Error Handling', () => {
    test('playSound has try-catch error handling', () => {
        const audioContent = readFile('js/systems/audio.js');

        // Find playSound function and check for try-catch
        const playSoundMatch = audioContent.match(/export function playSound\(type\)[\s\S]*?^}/m);
        if (playSoundMatch) {
            assert.ok(
                playSoundMatch[0].includes('try {'),
                'playSound should have try block'
            );
            assert.ok(
                playSoundMatch[0].includes('catch {'),
                'playSound should have catch block'
            );
        }
    });

    test('playHitMarkerSound has try-catch error handling', () => {
        const audioContent = readFile('js/systems/audio.js');

        // Check for try-catch in playHitMarkerSound
        const hitMarkerMatch = audioContent.match(/export function playHitMarkerSound[\s\S]*?^}/m);
        if (hitMarkerMatch) {
            assert.ok(
                hitMarkerMatch[0].includes('try {'),
                'playHitMarkerSound should have try block'
            );
            assert.ok(
                hitMarkerMatch[0].includes('catch {'),
                'playHitMarkerSound should have catch block'
            );
        }
    });

    test('playKillStreakSound has try-catch error handling', () => {
        const audioContent = readFile('js/systems/audio.js');

        // Check for try-catch in playKillStreakSound
        const killStreakMatch = audioContent.match(/export function playKillStreakSound[\s\S]*?^}/m);
        if (killStreakMatch) {
            assert.ok(
                killStreakMatch[0].includes('try {'),
                'playKillStreakSound should have try block'
            );
            assert.ok(
                killStreakMatch[0].includes('catch {'),
                'playKillStreakSound should have catch block'
            );
        }
    });

    test('Audio functions still return early if no audioCtx', () => {
        const audioContent = readFile('js/systems/audio.js');

        // Count occurrences of 'if (!audioCtx) return;'
        const earlyReturns = (audioContent.match(/if \(!audioCtx\) return;/g) || []).length;
        assert.ok(
            earlyReturns >= 3,
            'Audio functions should have early return if no audioCtx'
        );
    });
});
