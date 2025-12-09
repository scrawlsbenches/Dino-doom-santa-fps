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

// ==================== BACKGROUND MEMES STATE TESTS (TASK-019) ====================
describe('Background Memes State (TASK-019)', () => {
    test('backgroundMemesState is exported', () => {
        const stateContent = readFile('js/state.js');
        assert.ok(
            stateContent.includes('export const backgroundMemesState'),
            'Should export backgroundMemesState'
        );
    });

    test('backgroundMemesState has required properties', () => {
        const stateContent = readFile('js/state.js');
        assert.ok(
            stateContent.includes('enabled:'),
            'backgroundMemesState should have enabled property'
        );
        assert.ok(
            stateContent.includes('floatingElements:'),
            'backgroundMemesState should have floatingElements property'
        );
    });

    test('Background memes functions are exported', () => {
        const stateContent = readFile('js/state.js');

        const requiredFunctions = [
            'loadBackgroundMemesState',
            'saveBackgroundMemesState',
            'toggleBackgroundMemes',
            'clearFloatingMemes',
            'isBackgroundMemesEnabled'
        ];

        requiredFunctions.forEach(fn => {
            assert.ok(
                stateContent.includes(`export function ${fn}`),
                `Should export ${fn} function`
            );
        });
    });

    test('toggleBackgroundMemes saves state', () => {
        const stateContent = readFile('js/state.js');
        assert.ok(
            stateContent.includes('saveBackgroundMemesState()'),
            'toggleBackgroundMemes should call saveBackgroundMemesState'
        );
    });

    test('clearFloatingMemes resets array', () => {
        const stateContent = readFile('js/state.js');
        assert.ok(
            stateContent.includes('backgroundMemesState.floatingElements.length = 0'),
            'clearFloatingMemes should clear the floatingElements array'
        );
    });

    test('localStorage is used for persistence', () => {
        const stateContent = readFile('js/state.js');
        assert.ok(
            stateContent.includes('backgroundMemesEnabled'),
            'Should use backgroundMemesEnabled as localStorage key'
        );
    });
});

// ==================== TOUCH/MOBILE STATE TESTS ====================
describe('Touch/Mobile State', () => {
    test('touchState is exported', () => {
        const stateContent = readFile('js/state.js');
        assert.ok(
            stateContent.includes('export const touchState'),
            'Should export touchState'
        );
    });

    test('touchState has required properties', () => {
        const stateContent = readFile('js/state.js');

        const requiredProps = ['isTouchDevice', 'isAiming', 'lastTouchX', 'lastTouchY'];
        requiredProps.forEach(prop => {
            assert.ok(
                stateContent.includes(prop),
                `touchState should have ${prop} property`
            );
        });
    });

    test('Touch device detection function is exported', () => {
        const stateContent = readFile('js/state.js');
        assert.ok(
            stateContent.includes('export function detectTouchDevice'),
            'Should export detectTouchDevice function'
        );
    });

    test('isTouchDevice function is exported', () => {
        const stateContent = readFile('js/state.js');
        assert.ok(
            stateContent.includes('export function isTouchDevice'),
            'Should export isTouchDevice function'
        );
    });

    test('detectTouchDevice checks for touch support', () => {
        const stateContent = readFile('js/state.js');

        // Should check for various touch detection methods
        assert.ok(
            stateContent.includes('ontouchstart'),
            'Should check for ontouchstart'
        );
        assert.ok(
            stateContent.includes('maxTouchPoints'),
            'Should check for maxTouchPoints'
        );
        assert.ok(
            stateContent.includes('pointer: coarse'),
            'Should check for coarse pointer media query'
        );
    });

    test('isTouchDevice returns touchState value', () => {
        const stateContent = readFile('js/state.js');
        assert.ok(
            stateContent.includes('return touchState.isTouchDevice'),
            'isTouchDevice should return touchState.isTouchDevice'
        );
    });
});
