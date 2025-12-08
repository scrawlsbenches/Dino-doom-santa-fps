/**
 * Tests for project structure
 * File existence, HTML structure, CSS structure
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { fileExists, readFile } from './test-helpers.js';

// ==================== FILE STRUCTURE TESTS ====================
describe('Project Structure', () => {
    test('Main HTML file exists', () => {
        assert.ok(fileExists('index.html'), 'index.html should exist');
    });

    test('CSS file exists', () => {
        assert.ok(fileExists('css/styles.css'), 'css/styles.css should exist');
    });

    test('JavaScript module files exist', () => {
        const requiredFiles = [
            'js/constants.js',
            'js/state.js',
            'js/game.js',
            'js/ui.js',
            'js/main.js'
        ];

        requiredFiles.forEach(file => {
            assert.ok(
                fileExists(file),
                `${file} should exist`
            );
        });
    });

    test('Class files exist', () => {
        const classFiles = [
            'js/classes/Enemy.js',
            'js/classes/Projectile.js',
            'js/classes/EnemyProjectile.js',
            'js/classes/GamerProjectile.js',
            'js/classes/Particle.js',
            'js/classes/index.js'
        ];

        classFiles.forEach(file => {
            assert.ok(
                fileExists(file),
                `${file} should exist`
            );
        });
    });

    test('System files exist', () => {
        const systemFiles = [
            'js/systems/audio.js',
            'js/systems/effects.js',
            'js/systems/achievements.js',
            'js/systems/killstreak.js',
            'js/systems/dialogue.js',
            'js/systems/skins.js',
            'js/systems/shop.js',
            'js/systems/death.js',
            'js/systems/boss.js',
            'js/systems/minigame.js',
            'js/systems/index.js'
        ];

        systemFiles.forEach(file => {
            assert.ok(
                fileExists(file),
                `${file} should exist`
            );
        });
    });
});

// ==================== INDEX.HTML STRUCTURE TESTS ====================
describe('HTML Structure', () => {
    const html = readFile('index.html');

    test('HTML has required game elements', () => {
        const requiredIds = [
            'game-container',
            'game-canvas',
            'hud',
            'crosshair',
            'start-screen',
            'shop-screen',
            'game-over',
            'minigame-screen'
        ];

        requiredIds.forEach(id => {
            assert.ok(
                html.includes(`id="${id}"`),
                `HTML should contain element with id="${id}"`
            );
        });
    });

    test('HTML uses ES modules', () => {
        assert.ok(
            html.includes('type="module"'),
            'HTML should use ES module script'
        );
    });

    test('HTML links to CSS file', () => {
        assert.ok(
            html.includes('css/styles.css'),
            'HTML should link to CSS file'
        );
    });

    test('HTML has HUD elements', () => {
        const hudElements = ['score', 'wave-display', 'health-bar', 'ammo-display', 'weapon-name'];
        hudElements.forEach(id => {
            assert.ok(
                html.includes(`id="${id}"`) || html.includes(`id='${id}'`),
                `HTML should contain HUD element with id="${id}"`
            );
        });
    });

    test('HTML has boss UI elements', () => {
        assert.ok(html.includes('boss-health'), 'HTML should have boss health bar');
        assert.ok(html.includes('boss-intro'), 'HTML should have boss intro elements');
    });
});

// ==================== CSS STRUCTURE TESTS ====================
describe('CSS Structure', () => {
    const css = readFile('css/styles.css');

    test('CSS has essential game styles', () => {
        assert.ok(css.includes('#game-container'), 'CSS should style game-container');
        assert.ok(css.includes('#game-canvas'), 'CSS should style game-canvas');
        assert.ok(css.includes('#hud'), 'CSS should style HUD');
    });

    test('CSS has screen styles', () => {
        assert.ok(css.includes('#start-screen'), 'CSS should style start screen');
        assert.ok(css.includes('#shop-screen'), 'CSS should style shop screen');
        assert.ok(css.includes('#game-over'), 'CSS should style game over screen');
    });

    test('CSS has animation keyframes', () => {
        assert.ok(css.includes('@keyframes'), 'CSS should have animations');
    });

    test('CSS has responsive considerations', () => {
        // Check for viewport units or media queries
        assert.ok(
            css.includes('vh') || css.includes('vw') || css.includes('@media'),
            'CSS should have responsive styles'
        );
    });
});
