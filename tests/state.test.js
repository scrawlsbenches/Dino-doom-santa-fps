/**
 * Tests for state management
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { readFile } from './test-helpers.js';

// ==================== STATE MANAGEMENT TESTS ====================
describe('State Management', () => {
    test('State module file exists and has correct structure', () => {
        const stateContent = readFile('js/state.js');

        // Check for key exports (const used for object references that aren't reassigned)
        assert.ok(stateContent.includes('export const gameState'), 'Should export gameState');
        assert.ok(stateContent.includes('export const player'), 'Should export player');
        assert.ok(stateContent.includes('export const inventory'), 'Should export inventory');
        assert.ok(stateContent.includes('export function resetGameState'), 'Should export resetGameState');
        assert.ok(stateContent.includes('export function resetPlayerState'), 'Should export resetPlayerState');
    });

    test('State has all required game state properties', () => {
        const stateContent = readFile('js/state.js');

        const requiredProps = ['running', 'paused', 'score', 'coins', 'kills', 'wave', 'health'];
        requiredProps.forEach(prop => {
            assert.ok(stateContent.includes(prop), `gameState should have ${prop} property`);
        });
    });

    test('State has all required player properties', () => {
        const stateContent = readFile('js/state.js');

        const requiredProps = ['x', 'y', 'angle', 'moveSpeed', 'damage', 'fireRate', 'critChance'];
        requiredProps.forEach(prop => {
            assert.ok(stateContent.includes(prop), `player should have ${prop} property`);
        });
    });

    test('State has entity arrays', () => {
        const stateContent = readFile('js/state.js');

        const arrays = ['enemies', 'projectiles', 'enemyProjectiles', 'particles', 'floatingTexts'];
        arrays.forEach(arr => {
            assert.ok(stateContent.includes(`export const ${arr} = []`), `Should export ${arr} array`);
        });
    });

    test('Reset functions clear appropriate state', () => {
        const stateContent = readFile('js/state.js');

        // resetGameState should reset score, coins, kills, wave
        assert.ok(stateContent.includes('gameState.score = 0'), 'resetGameState should reset score');
        assert.ok(stateContent.includes('gameState.coins = 0'), 'resetGameState should reset coins');
        assert.ok(stateContent.includes('gameState.wave = 1'), 'resetGameState should reset wave');
    });
});
