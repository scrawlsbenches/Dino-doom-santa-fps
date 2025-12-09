/**
 * Tests for main game modules
 * UI, Game, Main entry point
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { readFile } from './test-helpers.js';

// ==================== UI MODULE TESTS ====================
describe('UI Module', () => {
    test('UI module file exists and has correct structure', () => {
        const uiContent = readFile('js/ui.js');

        assert.ok(uiContent.includes('export function updateHUD'), 'Should export updateHUD');
        assert.ok(uiContent.includes('export function addKillFeed'), 'Should export addKillFeed');
    });
});

// ==================== GAME MODULE TESTS ====================
describe('Game Module', () => {
    test('Game module file exists and has correct structure', () => {
        const gameContent = readFile('js/game.js');

        assert.ok(gameContent.includes('export function initGame'), 'Should export initGame');
        assert.ok(gameContent.includes('export function startGame'), 'Should export startGame');
        assert.ok(gameContent.includes('export function shoot'), 'Should export shoot');
        assert.ok(gameContent.includes('gameLoop') || gameContent.includes('requestAnimationFrame'), 'Should have game loop');
    });

    test('Game module handles wave spawning', () => {
        const gameContent = readFile('js/game.js');

        assert.ok(gameContent.includes('spawnWave') || gameContent.includes('spawn'), 'Should handle wave spawning');
        assert.ok(gameContent.includes('Enemy'), 'Should create enemies');
    });
});

// ==================== MAIN ENTRY POINT TESTS ====================
describe('Main Entry Point', () => {
    test('Main module file exists and has correct structure', () => {
        const mainContent = readFile('js/main.js');

        assert.ok(mainContent.includes('import'), 'Should have imports');
        assert.ok(mainContent.includes('addEventListener'), 'Should set up event listeners');
        assert.ok(mainContent.includes('DOMContentLoaded') || mainContent.includes('readyState'), 'Should wait for DOM');
    });

    test('Main module imports key functions', () => {
        const mainContent = readFile('js/main.js');

        assert.ok(mainContent.includes('initGame'), 'Should import initGame');
        assert.ok(mainContent.includes('startGame'), 'Should import startGame');
        assert.ok(mainContent.includes('shoot'), 'Should import shoot');
    });

    test('Main module imports touch-related functions', () => {
        const mainContent = readFile('js/main.js');

        assert.ok(mainContent.includes('touchState'), 'Should import touchState');
        assert.ok(mainContent.includes('detectTouchDevice'), 'Should import detectTouchDevice');
        assert.ok(mainContent.includes('isTouchDevice'), 'Should import isTouchDevice');
    });

    test('Main module sets up device controls', () => {
        const mainContent = readFile('js/main.js');

        assert.ok(mainContent.includes('setupDeviceControls'), 'Should have setupDeviceControls function');
        assert.ok(mainContent.includes('detectTouchDevice()'), 'Should call detectTouchDevice');
    });

    test('Main module handles touch events', () => {
        const mainContent = readFile('js/main.js');

        assert.ok(mainContent.includes('touchstart'), 'Should listen for touchstart events');
        assert.ok(mainContent.includes('touchmove'), 'Should listen for touchmove events');
        assert.ok(mainContent.includes('touchend'), 'Should listen for touchend events');
    });

    test('Main module sets up mobile control buttons', () => {
        const mainContent = readFile('js/main.js');

        assert.ok(mainContent.includes('mobile-fire-btn'), 'Should reference mobile fire button');
        assert.ok(mainContent.includes('mobile-heal-btn'), 'Should reference mobile heal button');
        assert.ok(mainContent.includes('mobile-shop-btn'), 'Should reference mobile shop button');
    });

    test('Main module prevents double-tap zoom', () => {
        const mainContent = readFile('js/main.js');

        // Should prevent zooming on double-tap
        assert.ok(
            mainContent.includes('lastTouchEnd') || mainContent.includes('300'),
            'Should handle double-tap prevention'
        );
    });
});
