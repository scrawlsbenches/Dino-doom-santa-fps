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
});
