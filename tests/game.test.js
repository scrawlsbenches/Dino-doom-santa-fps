/**
 * Automated tests for Dino Doom Santa FPS
 * Uses Node.js built-in test runner (node:test)
 * Run with: node --test tests/game.test.js
 */

const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Extract JavaScript from HTML file
function extractGameScript() {
    const htmlPath = path.join(__dirname, '..', 'SantaGigaChadDino.htm');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const match = html.match(/<script>([\s\S]*)<\/script>/);
    if (!match) throw new Error('Could not extract script from HTML');
    return match[1];
}

// Create mock browser environment
function createMockBrowserEnv() {
    const mockCtx = {
        fillRect: () => {},
        clearRect: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        stroke: () => {},
        fill: () => {},
        arc: () => {},
        ellipse: () => {},
        save: () => {},
        restore: () => {},
        translate: () => {},
        rotate: () => {},
        scale: () => {},
        fillText: () => {},
        measureText: () => ({ width: 100 }),
        setLineDash: () => {},
        createLinearGradient: () => ({ addColorStop: () => {} }),
        createRadialGradient: () => ({ addColorStop: () => {} }),
        drawImage: () => {},
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 1,
        font: '',
        textAlign: '',
        textBaseline: '',
        globalAlpha: 1,
        shadowColor: '',
        shadowBlur: 0,
    };

    const mockCanvas = {
        width: 1920,
        height: 1080,
        getContext: () => mockCtx,
        style: {},
        addEventListener: () => {},
    };

    const createMockElement = (tagName) => ({
        style: {},
        classList: {
            add: () => {},
            remove: () => {},
            contains: () => false,
        },
        appendChild: () => {},
        removeChild: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        textContent: '',
        innerHTML: '',
        remove: () => {},
        tagName: tagName || 'DIV',
        id: '',
        children: [],
        parentNode: null,
        getBoundingClientRect: () => ({ left: 0, top: 0, width: 1920, height: 1080 }),
    });

    const mockAudioContext = {
        createOscillator: () => ({
            connect: () => {},
            start: () => {},
            stop: () => {},
            frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
            type: 'sine',
        }),
        createGain: () => ({
            connect: () => {},
            gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
        }),
        destination: {},
        currentTime: 0,
    };

    return {
        document: {
            getElementById: (id) => {
                if (id === 'game-canvas') return mockCanvas;
                return createMockElement();
            },
            createElement: (tag) => {
                if (tag === 'canvas') return mockCanvas;
                return createMockElement(tag);
            },
            addEventListener: () => {},
            removeEventListener: () => {},
            body: {
                appendChild: () => {},
                style: {},
            },
            querySelectorAll: () => [],
            querySelector: () => createMockElement(),
        },
        window: {
            innerWidth: 1920,
            innerHeight: 1080,
            addEventListener: () => {},
            removeEventListener: () => {},
            requestAnimationFrame: (cb) => setTimeout(cb, 16),
            cancelAnimationFrame: () => {},
            AudioContext: function() { return mockAudioContext; },
            webkitAudioContext: function() { return mockAudioContext; },
        },
        localStorage: {
            _data: {},
            getItem: function(key) { return this._data[key] || null; },
            setItem: function(key, value) { this._data[key] = String(value); },
            removeItem: function(key) { delete this._data[key]; },
            clear: function() { this._data = {}; },
        },
        console: console,
        Math: Math,
        Date: Date,
        setTimeout: setTimeout,
        setInterval: setInterval,
        clearTimeout: clearTimeout,
        clearInterval: clearInterval,
        JSON: JSON,
        Array: Array,
        Object: Object,
        String: String,
        Number: Number,
        Boolean: Boolean,
        Error: Error,
        Image: function() { return { onload: null, onerror: null, src: '' }; },
    };
}

// Load game into sandbox and return game objects
function loadGame() {
    const env = createMockBrowserEnv();
    const script = extractGameScript();

    // Create a function that runs the script in our mock environment
    // Note: We don't pre-declare canvas/ctx because the game declares them itself
    const wrappedScript = `
        const document = this.document;
        const window = this.window;
        const localStorage = this.localStorage;
        const console = this.console;
        const setTimeout = this.setTimeout;
        const setInterval = this.setInterval;
        const clearTimeout = this.clearTimeout;
        const clearInterval = this.clearInterval;
        const AudioContext = this.window.AudioContext;
        const webkitAudioContext = this.window.webkitAudioContext;
        const Image = this.Image;
        const requestAnimationFrame = this.window.requestAnimationFrame;
        const cancelAnimationFrame = this.window.cancelAnimationFrame;
        const innerWidth = this.window.innerWidth;
        const innerHeight = this.window.innerHeight;

        ${script}

        // Return game objects for testing
        return {
            WEAPONS,
            ENEMY_TYPES,
            SANTA_SKINS,
            ACHIEVEMENTS,
            KILL_STREAK_TIERS,
            BOSS_NAMES,
            SHOPKEEPER_DIALOGUE,
            ENEMY_DIALOGUE,
            gameState,
            player,
            inventory,
            skinState,
            getBossInfo,
            getCurrentSkin,
        };
    `;

    const fn = new Function(wrappedScript);
    return fn.call(env);
}

// ==================== TESTS ====================

describe('Game Configuration', () => {
    let game;

    beforeEach(() => {
        game = loadGame();
    });

    test('WEAPONS should have all required weapons', () => {
        const requiredWeapons = ['present', 'snowball', 'candy_cane', 'ornament', 'star', 'moai', 'doot'];
        for (const weapon of requiredWeapons) {
            assert.ok(game.WEAPONS[weapon], `Missing weapon: ${weapon}`);
        }
    });

    test('All weapons should have required properties', () => {
        for (const [name, weapon] of Object.entries(game.WEAPONS)) {
            assert.ok(weapon.name, `${name} missing name`);
            assert.ok(weapon.emoji, `${name} missing emoji`);
            assert.ok(typeof weapon.damage === 'number', `${name} missing damage`);
            assert.ok(typeof weapon.fireRate === 'number', `${name} missing fireRate`);
            assert.ok(typeof weapon.speed === 'number', `${name} missing speed`);
            assert.ok(typeof weapon.price === 'number', `${name} missing price`);
        }
    });

    test('Moai Cannon should have special property', () => {
        assert.strictEqual(game.WEAPONS.moai.special, 'moai');
    });

    test('Doot Cannon should have special property', () => {
        assert.strictEqual(game.WEAPONS.doot.special, 'doot');
    });
});

describe('Enemy Types', () => {
    let game;

    beforeEach(() => {
        game = loadGame();
    });

    test('ENEMY_TYPES should have all enemy types', () => {
        const requiredTypes = ['GIGACHAD', 'BUFF_NERD', 'MINI_BOSS', 'GAMER_DINO', 'SIGMA_DINO'];
        for (const type of requiredTypes) {
            assert.ok(game.ENEMY_TYPES[type], `Missing enemy type: ${type}`);
        }
    });

    test('All enemies should have required properties', () => {
        for (const [name, enemy] of Object.entries(game.ENEMY_TYPES)) {
            assert.ok(enemy.name, `${name} missing name`);
            assert.ok(enemy.emoji, `${name} missing emoji`);
            assert.ok(typeof enemy.health === 'number', `${name} missing health`);
            assert.ok(typeof enemy.damage === 'number', `${name} missing damage`);
            assert.ok(typeof enemy.speed === 'number', `${name} missing speed`);
            assert.ok(typeof enemy.points === 'number', `${name} missing points`);
            assert.ok(typeof enemy.coins === 'number', `${name} missing coins`);
        }
    });

    test('GAMER_DINO should have isGamer flag', () => {
        assert.strictEqual(game.ENEMY_TYPES.GAMER_DINO.isGamer, true);
    });

    test('SIGMA_DINO should have isSigma flag', () => {
        assert.strictEqual(game.ENEMY_TYPES.SIGMA_DINO.isSigma, true);
    });

    test('SIGMA_DINO should have 0 damage (does not attack)', () => {
        assert.strictEqual(game.ENEMY_TYPES.SIGMA_DINO.damage, 0);
    });

    test('MINI_BOSS should have isBoss flag', () => {
        assert.strictEqual(game.ENEMY_TYPES.MINI_BOSS.isBoss, true);
    });
});

describe('Santa Skins System', () => {
    let game;

    beforeEach(() => {
        game = loadGame();
    });

    test('SANTA_SKINS should have all skins', () => {
        const requiredSkins = ['default', 'drip', 'tactical', 'gigachad', 'sigma'];
        for (const skin of requiredSkins) {
            assert.ok(game.SANTA_SKINS[skin], `Missing skin: ${skin}`);
        }
    });

    test('Default skin should be free', () => {
        assert.strictEqual(game.SANTA_SKINS.default.price, 0);
    });

    test('All skins should have required properties', () => {
        for (const [name, skin] of Object.entries(game.SANTA_SKINS)) {
            assert.ok(skin.name, `${name} missing name`);
            assert.ok(skin.emoji, `${name} missing emoji`);
            assert.ok(typeof skin.price === 'number', `${name} missing price`);
            assert.ok(skin.color, `${name} missing color`);
            assert.ok(skin.glowColor, `${name} missing glowColor`);
        }
    });

    test('Skin prices should increase progressively', () => {
        const prices = [
            game.SANTA_SKINS.default.price,
            game.SANTA_SKINS.drip.price,
            game.SANTA_SKINS.tactical.price,
            game.SANTA_SKINS.gigachad.price,
            game.SANTA_SKINS.sigma.price,
        ];
        for (let i = 1; i < prices.length; i++) {
            assert.ok(prices[i] > prices[i-1], `Skin prices should increase: ${prices[i-1]} -> ${prices[i]}`);
        }
    });

    test('getCurrentSkin should return default skin initially', () => {
        const skin = game.getCurrentSkin();
        assert.strictEqual(skin.name, 'Default Santa');
    });
});

describe('Achievements', () => {
    let game;

    beforeEach(() => {
        game = loadGame();
    });

    test('ACHIEVEMENTS should have all achievements', () => {
        const requiredAchievements = [
            'FIRST_BLOOD', 'WAVE_SURVIVOR', 'BUILT_DIFFERENT', 'SKILL_ISSUE',
            'EASY_MODE', 'BIG_SPENDER', 'BOSS_SLAYER', 'MEME_LORD'
        ];
        for (const achievement of requiredAchievements) {
            assert.ok(game.ACHIEVEMENTS[achievement], `Missing achievement: ${achievement}`);
        }
    });

    test('All achievements should have required properties', () => {
        for (const [name, achievement] of Object.entries(game.ACHIEVEMENTS)) {
            assert.ok(achievement.id, `${name} missing id`);
            assert.ok(achievement.name, `${name} missing name`);
            assert.ok(achievement.description, `${name} missing description`);
            assert.ok(achievement.icon, `${name} missing icon`);
        }
    });
});

describe('Kill Streak Tiers', () => {
    let game;

    beforeEach(() => {
        game = loadGame();
    });

    test('KILL_STREAK_TIERS should have multiple tiers', () => {
        assert.ok(game.KILL_STREAK_TIERS.length >= 5, 'Should have at least 5 kill streak tiers');
    });

    test('Kill streak tiers should have increasing counts', () => {
        for (let i = 1; i < game.KILL_STREAK_TIERS.length; i++) {
            assert.ok(
                game.KILL_STREAK_TIERS[i].count > game.KILL_STREAK_TIERS[i-1].count,
                'Kill streak counts should increase'
            );
        }
    });

    test('First tier should be DOUBLE KILL at 2 kills', () => {
        assert.strictEqual(game.KILL_STREAK_TIERS[0].count, 2);
        assert.strictEqual(game.KILL_STREAK_TIERS[0].name, 'DOUBLE KILL');
    });
});

describe('Boss System', () => {
    let game;

    beforeEach(() => {
        game = loadGame();
    });

    test('BOSS_NAMES should have bosses for waves 5, 10, 15, 20, 25', () => {
        const bossWaves = [5, 10, 15, 20, 25];
        for (const wave of bossWaves) {
            assert.ok(game.BOSS_NAMES[wave], `Missing boss for wave ${wave}`);
        }
    });

    test('All bosses should have name, title, and emoji', () => {
        for (const [wave, boss] of Object.entries(game.BOSS_NAMES)) {
            assert.ok(boss.name, `Wave ${wave} boss missing name`);
            assert.ok(boss.title, `Wave ${wave} boss missing title`);
            assert.ok(boss.emoji, `Wave ${wave} boss missing emoji`);
        }
    });

    test('getBossInfo should return correct boss for wave 5', () => {
        // Temporarily set wave to 5
        game.gameState.wave = 5;
        const bossInfo = game.getBossInfo(5);
        assert.strictEqual(bossInfo.name, 'CHADOSAURUS');
    });

    test('getBossInfo should handle waves beyond 25', () => {
        const bossInfo = game.getBossInfo(30);
        assert.ok(bossInfo.name, 'Should return a boss name for wave 30');
        assert.ok(bossInfo.name.includes('MK'), 'High wave bosses should have MK suffix');
    });
});

describe('Shopkeeper Dialogue', () => {
    let game;

    beforeEach(() => {
        game = loadGame();
    });

    test('SHOPKEEPER_DIALOGUE should have all categories', () => {
        const categories = ['rich', 'broke', 'normal', 'purchase'];
        for (const category of categories) {
            assert.ok(game.SHOPKEEPER_DIALOGUE[category], `Missing category: ${category}`);
            assert.ok(Array.isArray(game.SHOPKEEPER_DIALOGUE[category]), `${category} should be an array`);
            assert.ok(game.SHOPKEEPER_DIALOGUE[category].length > 0, `${category} should have dialogue lines`);
        }
    });
});

describe('Enemy Dialogue', () => {
    let game;

    beforeEach(() => {
        game = loadGame();
    });

    test('ENEMY_DIALOGUE should have dialogue for all enemy types', () => {
        const enemyTypes = ['GIGACHAD', 'BUFF_NERD', 'MINI_BOSS', 'GAMER_DINO', 'SIGMA_DINO'];
        for (const type of enemyTypes) {
            assert.ok(game.ENEMY_DIALOGUE[type], `Missing dialogue for: ${type}`);
        }
    });

    test('All enemy dialogue should have spawn and attack lines', () => {
        for (const [type, dialogue] of Object.entries(game.ENEMY_DIALOGUE)) {
            assert.ok(Array.isArray(dialogue.spawn), `${type} missing spawn dialogue`);
            assert.ok(Array.isArray(dialogue.attack), `${type} missing attack dialogue`);
            assert.ok(dialogue.spawn.length > 0, `${type} spawn dialogue empty`);
            assert.ok(dialogue.attack.length > 0, `${type} attack dialogue empty`);
        }
    });
});

describe('Game State', () => {
    let game;

    beforeEach(() => {
        game = loadGame();
    });

    test('Initial game state should have correct defaults', () => {
        assert.strictEqual(game.gameState.running, false);
        assert.strictEqual(game.gameState.paused, false);
        assert.strictEqual(game.gameState.score, 0);
        assert.strictEqual(game.gameState.coins, 0);
        assert.strictEqual(game.gameState.kills, 0);
        assert.strictEqual(game.gameState.wave, 1);
        assert.strictEqual(game.gameState.health, 100);
    });

    test('Player should have correct initial stats', () => {
        assert.strictEqual(game.player.x, 0);
        assert.strictEqual(game.player.y, 0);
        assert.ok(game.player.damage > 0, 'Player should have damage');
        assert.ok(game.player.critChance > 0, 'Player should have crit chance');
    });

    test('Inventory should start with present weapon', () => {
        assert.strictEqual(game.inventory.currentWeapon, 'present');
        assert.strictEqual(game.inventory.weapons.present, true);
    });
});

// Run summary
console.log('\n🎮 Dino Doom Santa FPS - Automated Tests\n');
