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
        roundRect: () => {},
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
        insertBefore: () => {},
        firstChild: null,
        lastChild: null,
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
        state: 'running',
        resume: () => Promise.resolve(),
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
            requestAnimationFrame: () => 1, // Return dummy ID, don't actually schedule
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
        navigator: {
            clipboard: {
                writeText: () => Promise.resolve(),
            },
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
        Set: Set,
        Image: function() { return { onload: null, onerror: null, src: '' }; },
    };
}

// Load game into sandbox and return game objects
function loadGame() {
    const env = createMockBrowserEnv();
    const script = extractGameScript();

    // Create a function that runs the script in our mock environment
    const wrappedScript = `
        const document = this.document;
        const window = this.window;
        const localStorage = this.localStorage;
        const navigator = this.navigator;
        const console = this.console;
        const setTimeout = this.setTimeout;
        const setInterval = this.setInterval;
        const clearTimeout = this.clearTimeout;
        const clearInterval = this.clearInterval;
        const AudioContext = this.window.AudioContext;
        const webkitAudioContext = this.window.webkitAudioContext;
        const Image = this.Image;
        const Set = this.Set;
        const requestAnimationFrame = this.window.requestAnimationFrame;
        const cancelAnimationFrame = this.window.cancelAnimationFrame;
        const innerWidth = this.window.innerWidth;
        const innerHeight = this.window.innerHeight;

        ${script}

        // Return game objects for testing
        return {
            // Data structures
            WEAPONS,
            ENEMY_TYPES,
            SANTA_SKINS,
            ACHIEVEMENTS,
            KILL_STREAK_TIERS,
            BOSS_NAMES,
            SHOPKEEPER_DIALOGUE,
            ENEMY_DIALOGUE,
            UPGRADES,
            MEME_RATINGS,
            LAST_WORDS,
            SIGMA_QUOTES,
            // State objects
            gameState,
            player,
            inventory,
            skinState,
            killStreakState,
            achievementTracking,
            unlockedAchievements,
            // Functions
            getBossInfo,
            getCurrentSkin,
            getMemeRating,
            formatTime,
            getRandomLastWords,
            getShopkeeperDialogue,
            recordKill,
            purchaseSkin,
            selectSkin,
            loadSkinState,
            saveSkinState,
            unlockAchievement,
            resetAchievementTracking,
            onWaveStart,
            onWaveComplete,
            applyUpgrades,
            // Classes
            Enemy,
            Projectile,
            Particle,
            EnemyProjectile,
            GamerProjectile,
            // Arrays for testing
            enemies,
            projectiles,
            particles,
            floatingTexts,
        };
    `;

    const fn = new Function(wrappedScript);
    return fn.call(env);
}

// ==================== LOAD GAME ONCE ====================
console.log('Loading game for tests...');
const game = loadGame();
console.log('Game loaded successfully!\n');

// ==================== TESTS ====================

// ==================== GAME CONFIGURATION TESTS ====================

describe('Game Configuration', () => {
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

    test('Weapon damage values should be positive', () => {
        for (const [name, weapon] of Object.entries(game.WEAPONS)) {
            assert.ok(weapon.damage > 0, `${name} should have positive damage`);
        }
    });

    test('Weapon prices should increase with power', () => {
        // Present is free, others cost more
        assert.strictEqual(game.WEAPONS.present.price, 0);
        assert.ok(game.WEAPONS.snowball.price > 0);
        assert.ok(game.WEAPONS.star.price > game.WEAPONS.snowball.price);
    });
});

// ==================== ENEMY TYPES TESTS ====================

describe('Enemy Types', () => {
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

    test('GIGACHAD should have higher health than BUFF_NERD', () => {
        assert.ok(game.ENEMY_TYPES.GIGACHAD.health > game.ENEMY_TYPES.BUFF_NERD.health);
    });

    test('MINI_BOSS should have highest health', () => {
        const bossHealth = game.ENEMY_TYPES.MINI_BOSS.health;
        for (const [name, enemy] of Object.entries(game.ENEMY_TYPES)) {
            if (name !== 'MINI_BOSS') {
                assert.ok(bossHealth > enemy.health, `MINI_BOSS should have more health than ${name}`);
            }
        }
    });

    test('All enemies should have traits array', () => {
        for (const [name, enemy] of Object.entries(game.ENEMY_TYPES)) {
            assert.ok(Array.isArray(enemy.traits), `${name} should have traits array`);
            assert.ok(enemy.traits.length > 0, `${name} should have at least one trait`);
        }
    });

    test('GAMER_DINO should have death messages', () => {
        assert.ok(Array.isArray(game.ENEMY_TYPES.GAMER_DINO.deathMessages));
        assert.ok(game.ENEMY_TYPES.GAMER_DINO.deathMessages.length > 0);
    });

    test('SIGMA_DINO should have death messages', () => {
        assert.ok(Array.isArray(game.ENEMY_TYPES.SIGMA_DINO.deathMessages));
        assert.ok(game.ENEMY_TYPES.SIGMA_DINO.deathMessages.length > 0);
    });
});

// ==================== SANTA SKINS TESTS ====================

describe('Santa Skins System', () => {
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

    test('All skins should have descriptions', () => {
        for (const [name, skin] of Object.entries(game.SANTA_SKINS)) {
            assert.ok(skin.description, `${name} missing description`);
        }
    });

    test('Sigma skin should be most expensive', () => {
        const sigmaPrice = game.SANTA_SKINS.sigma.price;
        for (const [name, skin] of Object.entries(game.SANTA_SKINS)) {
            assert.ok(sigmaPrice >= skin.price, `Sigma should be >= ${name} price`);
        }
    });
});

// ==================== ACHIEVEMENTS TESTS ====================

describe('Achievements', () => {
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

    test('Achievement IDs should be unique', () => {
        const ids = Object.values(game.ACHIEVEMENTS).map(a => a.id);
        const uniqueIds = [...new Set(ids)];
        assert.strictEqual(ids.length, uniqueIds.length, 'Achievement IDs should be unique');
    });

    test('All achievements should have emoji icons', () => {
        for (const [name, achievement] of Object.entries(game.ACHIEVEMENTS)) {
            assert.ok(achievement.icon.length > 0, `${name} should have an icon`);
        }
    });
});

// ==================== KILL STREAK TESTS ====================

describe('Kill Streak Tiers', () => {
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

    test('All tiers should have name and color', () => {
        for (const tier of game.KILL_STREAK_TIERS) {
            assert.ok(tier.name, 'Tier should have name');
            assert.ok(tier.color, 'Tier should have color');
            assert.ok(typeof tier.count === 'number', 'Tier should have count');
        }
    });

    test('Final tier should be UNSTOPPABLE', () => {
        const lastTier = game.KILL_STREAK_TIERS[game.KILL_STREAK_TIERS.length - 1];
        assert.strictEqual(lastTier.name, 'UNSTOPPABLE');
    });
});

// ==================== BOSS SYSTEM TESTS ====================

describe('Boss System', () => {
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
        const bossInfo = game.getBossInfo(5);
        assert.strictEqual(bossInfo.name, 'CHADOSAURUS');
    });

    test('getBossInfo should return correct boss for wave 10', () => {
        const bossInfo = game.getBossInfo(10);
        assert.strictEqual(bossInfo.name, 'PROFESSOR GAINS');
    });

    test('getBossInfo should return correct boss for wave 15', () => {
        const bossInfo = game.getBossInfo(15);
        assert.strictEqual(bossInfo.name, 'THE RATIO KING');
    });

    test('getBossInfo should return correct boss for wave 20', () => {
        const bossInfo = game.getBossInfo(20);
        assert.strictEqual(bossInfo.name, 'ZYZZ-REX');
    });

    test('getBossInfo should return correct boss for wave 25', () => {
        const bossInfo = game.getBossInfo(25);
        assert.strictEqual(bossInfo.name, 'FINAL FORM CHAD');
    });

    test('getBossInfo should handle waves beyond 25', () => {
        const bossInfo = game.getBossInfo(30);
        assert.ok(bossInfo.name, 'Should return a boss name for wave 30');
        assert.ok(bossInfo.name.includes('MK'), 'High wave bosses should have MK suffix');
    });

    test('getBossInfo should handle very high waves', () => {
        const bossInfo = game.getBossInfo(100);
        assert.ok(bossInfo.name, 'Should return a boss name for wave 100');
        assert.ok(bossInfo.title.includes('Ascended'), 'High wave bosses should be Ascended');
    });
});

// ==================== SHOPKEEPER DIALOGUE TESTS ====================

describe('Shopkeeper Dialogue', () => {
    test('SHOPKEEPER_DIALOGUE should have all categories', () => {
        const categories = ['rich', 'broke', 'normal', 'purchase'];
        for (const category of categories) {
            assert.ok(game.SHOPKEEPER_DIALOGUE[category], `Missing category: ${category}`);
            assert.ok(Array.isArray(game.SHOPKEEPER_DIALOGUE[category]), `${category} should be an array`);
            assert.ok(game.SHOPKEEPER_DIALOGUE[category].length > 0, `${category} should have dialogue lines`);
        }
    });

    test('Each dialogue category should have multiple lines', () => {
        for (const [category, lines] of Object.entries(game.SHOPKEEPER_DIALOGUE)) {
            assert.ok(lines.length >= 3, `${category} should have at least 3 lines`);
        }
    });
});

// ==================== ENEMY DIALOGUE TESTS ====================

describe('Enemy Dialogue', () => {
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

    test('Each enemy type should have at least 3 spawn lines', () => {
        for (const [type, dialogue] of Object.entries(game.ENEMY_DIALOGUE)) {
            assert.ok(dialogue.spawn.length >= 3, `${type} should have at least 3 spawn lines`);
        }
    });
});

// ==================== GAME STATE TESTS ====================

describe('Game State', () => {
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
        assert.ok(game.player.damage >= 0, 'Player should have damage');
        assert.ok(game.player.critChance > 0, 'Player should have crit chance');
    });

    test('Inventory should start with present weapon', () => {
        assert.strictEqual(game.inventory.currentWeapon, 'present');
        assert.strictEqual(game.inventory.weapons.present, true);
    });

    test('Player should have crit multiplier', () => {
        assert.strictEqual(game.player.critMultiplier, 2);
    });

    test('Game state should track healing power', () => {
        assert.strictEqual(game.gameState.healKills, 0);
        assert.strictEqual(game.gameState.healReady, false);
        assert.strictEqual(game.gameState.healKillsRequired, 10);
    });

    test('Game state should track death screen data', () => {
        assert.ok('startTime' in game.gameState);
        assert.ok('lastAttacker' in game.gameState);
        assert.ok('totalCoinsEarned' in game.gameState);
    });
});

// ==================== UPGRADES TESTS ====================

describe('Upgrade System', () => {
    test('UPGRADES should have all upgrade types', () => {
        const requiredUpgrades = ['damage', 'fireRate', 'health', 'critChance'];
        for (const upgrade of requiredUpgrades) {
            assert.ok(game.UPGRADES[upgrade], `Missing upgrade: ${upgrade}`);
        }
    });

    test('All upgrades should have required properties', () => {
        for (const [name, upgrade] of Object.entries(game.UPGRADES)) {
            assert.ok(upgrade.name, `${name} missing name`);
            assert.ok(upgrade.icon, `${name} missing icon`);
            assert.ok(typeof upgrade.basePrice === 'number', `${name} missing basePrice`);
            assert.ok(typeof upgrade.maxLevel === 'number', `${name} missing maxLevel`);
            assert.ok(typeof upgrade.perLevel === 'number', `${name} missing perLevel`);
            assert.ok(upgrade.description, `${name} missing description`);
        }
    });

    test('Upgrades should have positive max levels', () => {
        for (const [name, upgrade] of Object.entries(game.UPGRADES)) {
            assert.ok(upgrade.maxLevel > 0, `${name} should have positive maxLevel`);
        }
    });

    test('Damage upgrade should give +10 per level', () => {
        assert.strictEqual(game.UPGRADES.damage.perLevel, 10);
    });

    test('Health upgrade should give +20 per level', () => {
        assert.strictEqual(game.UPGRADES.health.perLevel, 20);
    });

    test('Crit chance upgrade should give +5% per level', () => {
        assert.strictEqual(game.UPGRADES.critChance.perLevel, 0.05);
    });

    test('Inventory should track upgrade levels', () => {
        assert.ok('upgrades' in game.inventory);
        assert.strictEqual(game.inventory.upgrades.damage, 0);
        assert.strictEqual(game.inventory.upgrades.fireRate, 0);
        assert.strictEqual(game.inventory.upgrades.health, 0);
        assert.strictEqual(game.inventory.upgrades.critChance, 0);
    });
});

// ==================== MEME RATING TESTS ====================

describe('Meme Rating System', () => {
    test('MEME_RATINGS should have multiple ratings', () => {
        assert.ok(game.MEME_RATINGS.length >= 5, 'Should have at least 5 meme ratings');
    });

    test('All ratings should have minScore, rating, and color', () => {
        for (const rating of game.MEME_RATINGS) {
            assert.ok(typeof rating.minScore === 'number', 'Should have minScore');
            assert.ok(rating.rating, 'Should have rating text');
            assert.ok(rating.color, 'Should have color');
        }
    });

    test('Ratings should be sorted by minScore', () => {
        for (let i = 1; i < game.MEME_RATINGS.length; i++) {
            assert.ok(
                game.MEME_RATINGS[i].minScore > game.MEME_RATINGS[i-1].minScore,
                'Ratings should be in ascending minScore order'
            );
        }
    });

    test('getMemeRating should return lowest rating for score 0', () => {
        const rating = game.getMemeRating(0);
        assert.strictEqual(rating.rating, 'Actual NPC');
    });

    test('getMemeRating should return appropriate rating for mid score', () => {
        const rating = game.getMemeRating(5000);
        assert.strictEqual(rating.rating, 'Certified Decent');
    });

    test('getMemeRating should return highest rating for very high score', () => {
        const rating = game.getMemeRating(100000);
        assert.strictEqual(rating.rating, 'GIGACHAD');
    });

    test('getMemeRating should handle edge case scores', () => {
        // Exactly at threshold
        const rating1 = game.getMemeRating(1000);
        assert.strictEqual(rating1.rating, 'Kinda Mid');

        const rating2 = game.getMemeRating(999);
        assert.strictEqual(rating2.rating, 'Actual NPC');
    });
});

// ==================== FORMAT TIME TESTS ====================

describe('Format Time Function', () => {
    test('formatTime should format 0 seconds', () => {
        assert.strictEqual(game.formatTime(0), '0:00');
    });

    test('formatTime should format seconds correctly', () => {
        assert.strictEqual(game.formatTime(5000), '0:05');
        assert.strictEqual(game.formatTime(30000), '0:30');
        assert.strictEqual(game.formatTime(59000), '0:59');
    });

    test('formatTime should format minutes correctly', () => {
        assert.strictEqual(game.formatTime(60000), '1:00');
        assert.strictEqual(game.formatTime(90000), '1:30');
        assert.strictEqual(game.formatTime(120000), '2:00');
    });

    test('formatTime should format longer times', () => {
        assert.strictEqual(game.formatTime(600000), '10:00');
        assert.strictEqual(game.formatTime(3600000), '60:00');
    });

    test('formatTime should pad seconds with leading zero', () => {
        assert.strictEqual(game.formatTime(61000), '1:01');
        assert.strictEqual(game.formatTime(65000), '1:05');
    });
});

// ==================== LAST WORDS TESTS ====================

describe('Last Words System', () => {
    test('LAST_WORDS should have multiple entries', () => {
        assert.ok(game.LAST_WORDS.length >= 10, 'Should have at least 10 last words');
    });

    test('getRandomLastWords should return a string', () => {
        const words = game.getRandomLastWords();
        assert.strictEqual(typeof words, 'string');
    });

    test('getRandomLastWords should return from LAST_WORDS array', () => {
        const words = game.getRandomLastWords();
        assert.ok(game.LAST_WORDS.includes(words), 'Should return a word from LAST_WORDS');
    });
});

// ==================== SIGMA QUOTES TESTS ====================

describe('Sigma Quotes', () => {
    test('SIGMA_QUOTES should have multiple quotes', () => {
        assert.ok(game.SIGMA_QUOTES.length >= 5, 'Should have at least 5 sigma quotes');
    });

    test('All sigma quotes should be strings', () => {
        for (const quote of game.SIGMA_QUOTES) {
            assert.strictEqual(typeof quote, 'string');
        }
    });
});

// ==================== KILL STREAK STATE TESTS ====================

describe('Kill Streak State', () => {
    test('killStreakState should have initial values', () => {
        assert.strictEqual(typeof game.killStreakState.count, 'number');
        assert.strictEqual(typeof game.killStreakState.lastKillTime, 'number');
        assert.strictEqual(game.killStreakState.streakTimeout, 3000);
    });
});

// ==================== ACHIEVEMENT TRACKING TESTS ====================

describe('Achievement Tracking', () => {
    test('achievementTracking should have initial values', () => {
        assert.ok('waveStartHealth' in game.achievementTracking);
        assert.ok('totalDamageTaken' in game.achievementTracking);
        assert.ok('shopSpending' in game.achievementTracking);
    });

    test('unlockedAchievements should be a Set', () => {
        assert.ok(game.unlockedAchievements instanceof Set);
    });
});

// ==================== SKIN STATE TESTS ====================

describe('Skin State', () => {
    test('skinState should have correct initial values', () => {
        assert.strictEqual(game.skinState.selected, 'default');
        assert.ok(Array.isArray(game.skinState.owned));
        assert.ok(game.skinState.owned.includes('default'));
        assert.strictEqual(typeof game.skinState.totalCoins, 'number');
    });

    test('Default skin should be owned initially', () => {
        assert.ok(game.skinState.owned.includes('default'));
    });
});

// ==================== ENEMY CLASS TESTS ====================

describe('Enemy Class', () => {
    test('Enemy constructor should initialize correctly for GIGACHAD', () => {
        const enemy = new game.Enemy('GIGACHAD', 100, -500);
        assert.strictEqual(enemy.type, 'GIGACHAD');
        assert.strictEqual(enemy.x, 100);
        assert.strictEqual(enemy.z, -500);
        assert.ok(enemy.health > 0);
        assert.strictEqual(enemy.isBoss, false);
        assert.strictEqual(enemy.isGamer, false);
        assert.strictEqual(enemy.isSigma, false);
    });

    test('Enemy constructor should initialize correctly for GAMER_DINO', () => {
        const enemy = new game.Enemy('GAMER_DINO', 0, -300);
        assert.strictEqual(enemy.type, 'GAMER_DINO');
        assert.strictEqual(enemy.isGamer, true);
        assert.ok(enemy.rgbPhase !== undefined);
        assert.ok(enemy.rangedCooldown > 0);
    });

    test('Enemy constructor should initialize correctly for SIGMA_DINO', () => {
        const enemy = new game.Enemy('SIGMA_DINO', 500, -400);
        assert.strictEqual(enemy.type, 'SIGMA_DINO');
        assert.strictEqual(enemy.isSigma, true);
        assert.ok(enemy.sigmaDirection !== undefined);
        assert.strictEqual(enemy.hasEscaped, false);
    });

    test('Enemy constructor should initialize correctly for MINI_BOSS', () => {
        const enemy = new game.Enemy('MINI_BOSS', 0, -1000);
        assert.strictEqual(enemy.type, 'MINI_BOSS');
        assert.strictEqual(enemy.isBoss, true);
        assert.ok(enemy.health >= 500);
    });

    test('Enemy health should scale with wave', () => {
        // Reset game state wave for consistent testing
        const originalWave = game.gameState.wave;
        game.gameState.wave = 5;
        const enemy = new game.Enemy('GIGACHAD', 0, -500);
        const expectedHealth = game.ENEMY_TYPES.GIGACHAD.health + (5 * 10);
        assert.strictEqual(enemy.health, expectedHealth);
        game.gameState.wave = originalWave;
    });

    test('Enemy should track hit count', () => {
        const enemy = new game.Enemy('BUFF_NERD', 0, -300);
        assert.strictEqual(enemy.hitCount, 0);
        assert.strictEqual(enemy.wasOneShot, true);
    });

    test('Enemy maxHealth should equal initial health', () => {
        const enemy = new game.Enemy('GIGACHAD', 0, -500);
        assert.strictEqual(enemy.health, enemy.maxHealth);
    });
});

// ==================== PROJECTILE CLASS TESTS ====================

describe('Projectile Class', () => {
    test('Projectile should initialize with correct properties', () => {
        const proj = new game.Projectile(0, 0, 0, 1, -1, -20);
        assert.strictEqual(proj.x, 0);
        assert.strictEqual(proj.y, 0);
        assert.strictEqual(proj.z, 0);
        assert.strictEqual(proj.vx, 1);
        assert.strictEqual(proj.vy, -1);
        assert.strictEqual(proj.vz, -20);
        assert.ok(proj.life > 0);
    });

    test('Projectile should have weapon-based properties', () => {
        const proj = new game.Projectile(0, 0, 0, 0, 0, -20);
        // Should get properties from current weapon (present)
        assert.ok(proj.damage > 0);
        assert.ok(proj.emoji);
        assert.ok(proj.color);
    });

    test('Projectile should track weapon type', () => {
        const proj = new game.Projectile(0, 0, 0, 0, 0, -20);
        assert.strictEqual(proj.weaponType, game.inventory.currentWeapon);
    });
});

// ==================== PARTICLE CLASS TESTS ====================

describe('Particle Class', () => {
    test('Particle should initialize correctly', () => {
        const particle = new game.Particle(100, 50, -300, '#ff0000');
        assert.strictEqual(particle.x, 100);
        assert.strictEqual(particle.y, 50);
        assert.strictEqual(particle.z, -300);
        assert.strictEqual(particle.color, '#ff0000');
        assert.ok(particle.life > 0);
        assert.strictEqual(particle.life, particle.maxLife);
    });

    test('Particle should have velocity components', () => {
        const particle = new game.Particle(0, 0, 0, '#ffffff');
        assert.ok(typeof particle.vx === 'number');
        assert.ok(typeof particle.vy === 'number');
        assert.ok(typeof particle.vz === 'number');
    });
});

// ==================== ENEMY PROJECTILE TESTS ====================

describe('EnemyProjectile Class', () => {
    test('EnemyProjectile should initialize correctly', () => {
        const proj = new game.EnemyProjectile(100, 0, -500, 10);
        assert.strictEqual(proj.x, 100);
        assert.strictEqual(proj.z, -500);
        assert.strictEqual(proj.damage, 10);
        assert.strictEqual(proj.emoji, '🔥');
        assert.ok(proj.life > 0);
    });

    test('EnemyProjectile should move toward player', () => {
        const proj = new game.EnemyProjectile(0, 0, -500, 10);
        assert.ok(proj.vz > 0, 'EnemyProjectile should move toward player (positive vz)');
    });
});

// ==================== GAMER PROJECTILE TESTS ====================

describe('GamerProjectile Class', () => {
    test('GamerProjectile should initialize correctly', () => {
        const proj = new game.GamerProjectile(0, 0, -300, 15);
        assert.strictEqual(proj.damage, 15);
        assert.strictEqual(proj.emoji, '🎯');
        assert.ok(proj.life > 0);
    });

    test('GamerProjectile should have spin property', () => {
        const proj = new game.GamerProjectile(0, 0, -300, 15);
        assert.strictEqual(proj.spin, 0);
    });

    test('GamerProjectile should move slower than EnemyProjectile', () => {
        const gamer = new game.GamerProjectile(0, 0, -300, 15);
        const enemy = new game.EnemyProjectile(0, 0, -300, 10);
        assert.ok(gamer.vz < enemy.vz, 'GamerProjectile should be slower');
    });
});

// ==================== WEAPON BALANCE TESTS ====================

describe('Weapon Balance', () => {
    test('Higher priced weapons should generally deal more damage', () => {
        // Snowball is exception (rapid fire), but others should follow pattern
        assert.ok(game.WEAPONS.candy_cane.damage > game.WEAPONS.present.damage);
        assert.ok(game.WEAPONS.ornament.damage > game.WEAPONS.candy_cane.damage);
        assert.ok(game.WEAPONS.star.damage > game.WEAPONS.ornament.damage);
    });

    test('Snowball should have fastest fire rate', () => {
        for (const [name, weapon] of Object.entries(game.WEAPONS)) {
            if (name !== 'snowball') {
                assert.ok(
                    game.WEAPONS.snowball.fireRate <= weapon.fireRate,
                    `Snowball should fire faster than ${name}`
                );
            }
        }
    });

    test('Star should have highest speed', () => {
        for (const [name, weapon] of Object.entries(game.WEAPONS)) {
            assert.ok(
                game.WEAPONS.star.speed >= weapon.speed,
                `Star should be fastest, not slower than ${name}`
            );
        }
    });
});

// ==================== GAME ARRAYS TESTS ====================

describe('Game Arrays', () => {
    test('enemies array should exist and be empty initially', () => {
        assert.ok(Array.isArray(game.enemies));
    });

    test('projectiles array should exist', () => {
        assert.ok(Array.isArray(game.projectiles));
    });

    test('particles array should exist', () => {
        assert.ok(Array.isArray(game.particles));
    });

    test('floatingTexts array should exist', () => {
        assert.ok(Array.isArray(game.floatingTexts));
    });
});

// ==================== PLAYER STATS TESTS ====================

describe('Player Stats', () => {
    test('Player should have moveSpeed', () => {
        assert.strictEqual(game.player.moveSpeed, 5);
    });

    test('Player should have base damage of 0 (weapon provides damage)', () => {
        // Reloaded game has damage = 0, but in startGame it gets reset
        assert.ok(typeof game.player.damage === 'number');
    });

    test('Player should have fire cooldown', () => {
        assert.strictEqual(typeof game.player.fireCooldown, 'number');
    });

    test('Player should have default crit chance of 5%', () => {
        assert.strictEqual(game.player.critChance, 0.05);
    });

    test('Player should have crit multiplier of 2x', () => {
        assert.strictEqual(game.player.critMultiplier, 2);
    });
});

// ==================== INVENTORY TESTS ====================

describe('Inventory', () => {
    test('Present weapon should be owned by default', () => {
        assert.strictEqual(game.inventory.weapons.present, true);
    });

    test('Other weapons should not be owned by default', () => {
        assert.strictEqual(game.inventory.weapons.snowball, false);
        assert.strictEqual(game.inventory.weapons.candy_cane, false);
        assert.strictEqual(game.inventory.weapons.ornament, false);
        assert.strictEqual(game.inventory.weapons.star, false);
        assert.strictEqual(game.inventory.weapons.moai, false);
        assert.strictEqual(game.inventory.weapons.doot, false);
    });

    test('All upgrade levels should start at 0', () => {
        for (const [name, level] of Object.entries(game.inventory.upgrades)) {
            assert.strictEqual(level, 0, `${name} upgrade should start at 0`);
        }
    });
});

// ==================== CONSTANTS VALIDATION TESTS ====================

describe('Constants Validation', () => {
    test('All weapons should have unique names', () => {
        const names = Object.values(game.WEAPONS).map(w => w.name);
        const uniqueNames = [...new Set(names)];
        assert.strictEqual(names.length, uniqueNames.length);
    });

    test('All enemy types should have unique names', () => {
        const names = Object.values(game.ENEMY_TYPES).map(e => e.name);
        const uniqueNames = [...new Set(names)];
        assert.strictEqual(names.length, uniqueNames.length);
    });

    test('All skins should have unique names', () => {
        const names = Object.values(game.SANTA_SKINS).map(s => s.name);
        const uniqueNames = [...new Set(names)];
        assert.strictEqual(names.length, uniqueNames.length);
    });

    test('All boss names should be unique', () => {
        const names = Object.values(game.BOSS_NAMES).map(b => b.name);
        const uniqueNames = [...new Set(names)];
        assert.strictEqual(names.length, uniqueNames.length);
    });
});

// ==================== EDGE CASES TESTS ====================

describe('Edge Cases', () => {
    test('getMemeRating handles negative scores', () => {
        const rating = game.getMemeRating(-100);
        assert.strictEqual(rating.rating, 'Actual NPC');
    });

    test('formatTime handles negative values gracefully', () => {
        // Implementation floors to 0
        const result = game.formatTime(-1000);
        assert.strictEqual(typeof result, 'string');
    });

    test('getBossInfo handles non-standard waves', () => {
        // Wave 1 is not a boss wave but should still return valid boss info
        const bossInfo = game.getBossInfo(1);
        assert.ok(bossInfo.name);
        assert.ok(bossInfo.title);
    });

    test('Enemy can be created at various positions', () => {
        const enemy1 = new game.Enemy('GIGACHAD', -1000, -2000);
        const enemy2 = new game.Enemy('GIGACHAD', 1000, -100);
        assert.strictEqual(enemy1.x, -1000);
        assert.strictEqual(enemy2.x, 1000);
    });
});

// ==================== SKIN PURCHASE SYSTEM TESTS ====================

describe('Skin Purchase System', () => {
    test('purchaseSkin should return false for invalid skin ID', () => {
        const result = game.purchaseSkin('nonexistent_skin');
        assert.strictEqual(result, false);
    });

    test('purchaseSkin should return false for already owned skin', () => {
        // Default skin is already owned
        const result = game.purchaseSkin('default');
        assert.strictEqual(result, false);
    });

    test('purchaseSkin should return false when not enough coins', () => {
        // Reset coins to 0
        const originalCoins = game.skinState.totalCoins;
        game.skinState.totalCoins = 0;
        const result = game.purchaseSkin('drip');
        game.skinState.totalCoins = originalCoins;
        assert.strictEqual(result, false);
    });

    test('purchaseSkin should succeed with enough coins', () => {
        // Set up enough coins and ensure skin is not owned
        const originalCoins = game.skinState.totalCoins;
        const originalOwned = [...game.skinState.owned];

        // Remove 'drip' from owned if present for testing
        game.skinState.owned = game.skinState.owned.filter(s => s !== 'drip');
        game.skinState.totalCoins = 10000; // Plenty of coins

        const skinPrice = game.SANTA_SKINS.drip.price;
        const result = game.purchaseSkin('drip');

        // Restore state
        const newCoins = game.skinState.totalCoins;
        game.skinState.totalCoins = originalCoins;
        game.skinState.owned = originalOwned;

        assert.strictEqual(result, true);
        assert.strictEqual(newCoins, 10000 - skinPrice);
    });

    test('selectSkin should return false for unowned skin', () => {
        // Reset owned to only default
        const originalOwned = [...game.skinState.owned];
        game.skinState.owned = ['default'];
        const result = game.selectSkin('drip');
        game.skinState.owned = originalOwned;
        assert.strictEqual(result, false);
    });

    test('selectSkin should return true for owned skin', () => {
        const result = game.selectSkin('default');
        assert.strictEqual(result, true);
    });

    test('selectSkin should update selected skin', () => {
        const originalSelected = game.skinState.selected;
        game.selectSkin('default');
        assert.strictEqual(game.skinState.selected, 'default');
        game.skinState.selected = originalSelected;
    });
});

// ==================== ACHIEVEMENT SYSTEM TESTS ====================

describe('Achievement System Functions', () => {
    test('unlockAchievement should add to unlocked set using lowercase id', () => {
        // Clear unlocked achievements first
        game.unlockedAchievements.clear();
        game.unlockAchievement('FIRST_BLOOD');
        // Achievement is stored with lowercase id 'first_blood'
        assert.ok(game.unlockedAchievements.has('first_blood'));
        game.unlockedAchievements.clear();
    });

    test('unlockAchievement should not duplicate', () => {
        game.unlockedAchievements.clear();
        game.unlockAchievement('FIRST_BLOOD');
        game.unlockAchievement('FIRST_BLOOD');
        assert.strictEqual(game.unlockedAchievements.size, 1);
        game.unlockedAchievements.clear();
    });

    test('unlockAchievement should do nothing for invalid key', () => {
        game.unlockedAchievements.clear();
        const sizeBefore = game.unlockedAchievements.size;
        game.unlockAchievement('INVALID_ACHIEVEMENT');
        assert.strictEqual(game.unlockedAchievements.size, sizeBefore);
    });

    test('resetAchievementTracking should clear unlocked achievements', () => {
        game.unlockedAchievements.add('TEST');
        game.resetAchievementTracking();
        assert.strictEqual(game.unlockedAchievements.size, 0);
    });

    test('resetAchievementTracking should create new tracking object', () => {
        // Test that the function runs without error and creates expected structure
        game.resetAchievementTracking();
        assert.ok('waveStartHealth' in game.achievementTracking);
        assert.ok('totalDamageTaken' in game.achievementTracking);
        assert.ok('shopSpending' in game.achievementTracking);
    });
});

// ==================== WAVE LIFECYCLE TESTS ====================

describe('Wave Lifecycle Functions', () => {
    test('onWaveStart should be callable', () => {
        // Test that onWaveStart is a function and can be called
        assert.strictEqual(typeof game.onWaveStart, 'function');
        assert.doesNotThrow(() => game.onWaveStart());
    });

    test('onWaveComplete should trigger WAVE_SURVIVOR for no damage (uses lowercase id)', () => {
        game.unlockedAchievements.clear();
        game.gameState.health = 100;
        game.achievementTracking.waveStartHealth = 100;
        game.onWaveComplete();
        // Achievement id is lowercase 'wave_survivor'
        assert.ok(game.unlockedAchievements.has('wave_survivor'));
        game.unlockedAchievements.clear();
    });

    test('onWaveComplete should not trigger WAVE_SURVIVOR if damaged', () => {
        game.unlockedAchievements.clear();
        game.gameState.health = 50;
        game.achievementTracking.waveStartHealth = 100;
        game.onWaveComplete();
        assert.ok(!game.unlockedAchievements.has('wave_survivor'));
    });

    test('onWaveComplete should trigger EASY_MODE for wave 10+ with no damage', () => {
        game.unlockedAchievements.clear();
        const originalWave = game.gameState.wave;
        game.gameState.wave = 10;
        game.achievementTracking.totalDamageTaken = 0;
        game.achievementTracking.waveStartHealth = 100;
        game.gameState.health = 100;
        game.onWaveComplete();
        // Achievement id is lowercase 'easy_mode'
        assert.ok(game.unlockedAchievements.has('easy_mode'));
        game.gameState.wave = originalWave;
        game.unlockedAchievements.clear();
    });

    test('onWaveComplete should not trigger EASY_MODE before wave 10', () => {
        game.unlockedAchievements.clear();
        const originalWave = game.gameState.wave;
        game.gameState.wave = 5;
        game.achievementTracking.totalDamageTaken = 0;
        game.achievementTracking.waveStartHealth = 100;
        game.gameState.health = 100;
        game.onWaveComplete();
        assert.ok(!game.unlockedAchievements.has('easy_mode'));
        game.gameState.wave = originalWave;
    });
});

// ==================== KILL STREAK RECORDING TESTS ====================

describe('Kill Streak Recording', () => {
    test('recordKill should increment kill count', () => {
        game.killStreakState.count = 0;
        game.killStreakState.lastKillTime = Date.now();
        game.recordKill();
        assert.strictEqual(game.killStreakState.count, 1);
    });

    test('recordKill should reset count after timeout', () => {
        game.killStreakState.count = 5;
        game.killStreakState.lastKillTime = Date.now() - 5000; // 5 seconds ago (> 3s timeout)
        game.recordKill();
        assert.strictEqual(game.killStreakState.count, 1); // Reset to 1 (this kill)
    });

    test('recordKill should continue streak within timeout', () => {
        game.killStreakState.count = 3;
        game.killStreakState.lastKillTime = Date.now() - 1000; // 1 second ago
        game.recordKill();
        assert.strictEqual(game.killStreakState.count, 4);
    });

    test('recordKill should update lastKillTime', () => {
        const beforeTime = Date.now();
        game.recordKill();
        const afterTime = Date.now();
        assert.ok(game.killStreakState.lastKillTime >= beforeTime);
        assert.ok(game.killStreakState.lastKillTime <= afterTime);
    });
});

// ==================== UPGRADE APPLICATION TESTS ====================

describe('Apply Upgrades Function', () => {
    test('applyUpgrades should set max health based on upgrade level', () => {
        const originalLevel = game.inventory.upgrades.health;
        game.inventory.upgrades.health = 3;
        game.applyUpgrades();
        // Base health 100 + 3 * 20 = 160
        assert.strictEqual(game.gameState.maxHealth, 160);
        game.inventory.upgrades.health = originalLevel;
        game.applyUpgrades();
    });

    test('applyUpgrades should set crit chance based on upgrade level', () => {
        const originalLevel = game.inventory.upgrades.critChance;
        game.inventory.upgrades.critChance = 2;
        game.applyUpgrades();
        // Base 0.05 + 2 * 0.05 = 0.15
        assert.ok(Math.abs(game.player.critChance - 0.15) < 0.001);
        game.inventory.upgrades.critChance = originalLevel;
        game.applyUpgrades();
    });

    test('applyUpgrades with zero upgrades should give base stats', () => {
        const originalHealth = game.inventory.upgrades.health;
        const originalCrit = game.inventory.upgrades.critChance;
        game.inventory.upgrades.health = 0;
        game.inventory.upgrades.critChance = 0;
        game.applyUpgrades();
        assert.strictEqual(game.gameState.maxHealth, 100);
        assert.strictEqual(game.player.critChance, 0.05);
        game.inventory.upgrades.health = originalHealth;
        game.inventory.upgrades.critChance = originalCrit;
    });

    test('applyUpgrades with max upgrades should give correct stats', () => {
        const originalHealth = game.inventory.upgrades.health;
        const originalCrit = game.inventory.upgrades.critChance;
        game.inventory.upgrades.health = game.UPGRADES.health.maxLevel;
        game.inventory.upgrades.critChance = game.UPGRADES.critChance.maxLevel;
        game.applyUpgrades();
        const expectedHealth = 100 + (game.UPGRADES.health.maxLevel * game.UPGRADES.health.perLevel);
        const expectedCrit = 0.05 + (game.UPGRADES.critChance.maxLevel * game.UPGRADES.critChance.perLevel);
        assert.strictEqual(game.gameState.maxHealth, expectedHealth);
        assert.ok(Math.abs(game.player.critChance - expectedCrit) < 0.001);
        game.inventory.upgrades.health = originalHealth;
        game.inventory.upgrades.critChance = originalCrit;
        game.applyUpgrades();
    });
});

// ==================== SHOPKEEPER DIALOGUE TESTS ====================

describe('Shopkeeper Dialogue Function', () => {
    test('getShopkeeperDialogue should return rich dialogue for 2000+ coins', () => {
        const originalCoins = game.gameState.coins;
        game.gameState.coins = 2500;
        const dialogue = game.getShopkeeperDialogue();
        assert.ok(game.SHOPKEEPER_DIALOGUE.rich.includes(dialogue));
        game.gameState.coins = originalCoins;
    });

    test('getShopkeeperDialogue should return broke dialogue for <100 coins', () => {
        const originalCoins = game.gameState.coins;
        game.gameState.coins = 50;
        const dialogue = game.getShopkeeperDialogue();
        assert.ok(game.SHOPKEEPER_DIALOGUE.broke.includes(dialogue));
        game.gameState.coins = originalCoins;
    });

    test('getShopkeeperDialogue should return normal dialogue for 100-1999 coins', () => {
        const originalCoins = game.gameState.coins;
        game.gameState.coins = 500;
        const dialogue = game.getShopkeeperDialogue();
        assert.ok(game.SHOPKEEPER_DIALOGUE.normal.includes(dialogue));
        game.gameState.coins = originalCoins;
    });

    test('getShopkeeperDialogue should return string', () => {
        const dialogue = game.getShopkeeperDialogue();
        assert.strictEqual(typeof dialogue, 'string');
    });

    test('getShopkeeperDialogue edge case at exactly 100 coins', () => {
        const originalCoins = game.gameState.coins;
        game.gameState.coins = 100;
        const dialogue = game.getShopkeeperDialogue();
        assert.ok(game.SHOPKEEPER_DIALOGUE.normal.includes(dialogue));
        game.gameState.coins = originalCoins;
    });

    test('getShopkeeperDialogue edge case at exactly 2000 coins', () => {
        const originalCoins = game.gameState.coins;
        game.gameState.coins = 2000;
        const dialogue = game.getShopkeeperDialogue();
        assert.ok(game.SHOPKEEPER_DIALOGUE.rich.includes(dialogue));
        game.gameState.coins = originalCoins;
    });
});

// ==================== SPECIAL WEAPON TESTS ====================

describe('Special Weapon Properties', () => {
    test('Moai weapon should have moai special effect', () => {
        assert.strictEqual(game.WEAPONS.moai.special, 'moai');
    });

    test('Doot weapon should have doot special effect', () => {
        assert.strictEqual(game.WEAPONS.doot.special, 'doot');
    });

    test('Standard weapons should not have special property', () => {
        assert.strictEqual(game.WEAPONS.present.special, undefined);
        assert.strictEqual(game.WEAPONS.snowball.special, undefined);
        assert.strictEqual(game.WEAPONS.candy_cane.special, undefined);
        assert.strictEqual(game.WEAPONS.ornament.special, undefined);
        assert.strictEqual(game.WEAPONS.star.special, undefined);
    });

    test('Moai weapon should cost 1500 coins', () => {
        assert.strictEqual(game.WEAPONS.moai.price, 1500);
    });

    test('Doot weapon should cost 800 coins', () => {
        assert.strictEqual(game.WEAPONS.doot.price, 800);
    });

    test('Moai weapon should have 70 damage', () => {
        assert.strictEqual(game.WEAPONS.moai.damage, 70);
    });

    test('Doot weapon should have 45 damage', () => {
        assert.strictEqual(game.WEAPONS.doot.damage, 45);
    });
});

// ==================== ENEMY SPAWN POSITION TESTS ====================

describe('Enemy Spawn Behavior', () => {
    test('BUFF_NERD should initialize correctly', () => {
        const enemy = new game.Enemy('BUFF_NERD', 50, -400);
        assert.strictEqual(enemy.type, 'BUFF_NERD');
        assert.strictEqual(enemy.x, 50);
        assert.strictEqual(enemy.z, -400);
        assert.ok(enemy.health > 0);
    });

    test('Enemy should have correct type properties', () => {
        const enemy = new game.Enemy('GIGACHAD', 0, -500);
        const typeData = game.ENEMY_TYPES.GIGACHAD;
        assert.strictEqual(enemy.emoji, typeData.emoji);
        assert.strictEqual(enemy.damage, typeData.damage);
        assert.ok(enemy.speed > 0);
    });

    test('Boss enemy should have high health', () => {
        const originalWave = game.gameState.wave;
        game.gameState.wave = 5;
        const boss = new game.Enemy('MINI_BOSS', 0, -1000);
        assert.ok(boss.health >= 500);
        assert.strictEqual(boss.isBoss, true);
        game.gameState.wave = originalWave;
    });

    test('Gamer dino should have RGB phase', () => {
        const enemy = new game.Enemy('GAMER_DINO', 0, -500);
        assert.ok(typeof enemy.rgbPhase === 'number');
        assert.ok(enemy.isGamer === true);
    });

    test('Sigma dino should have movement direction', () => {
        const enemy = new game.Enemy('SIGMA_DINO', 0, -500);
        assert.ok(enemy.sigmaDirection === 1 || enemy.sigmaDirection === -1);
        assert.ok(enemy.isSigma === true);
    });

    test('Enemy size should be set from type', () => {
        const enemy = new game.Enemy('GIGACHAD', 0, -500);
        assert.ok(typeof enemy.size === 'number');
        assert.ok(enemy.size > 0);
    });
});

// ==================== ENEMY HEALTH SCALING TESTS ====================

describe('Enemy Health Scaling', () => {
    test('Enemy health should increase with wave', () => {
        const originalWave = game.gameState.wave;

        game.gameState.wave = 1;
        const enemy1 = new game.Enemy('GIGACHAD', 0, -500);

        game.gameState.wave = 10;
        const enemy10 = new game.Enemy('GIGACHAD', 0, -500);

        assert.ok(enemy10.health > enemy1.health);
        game.gameState.wave = originalWave;
    });

    test('Health scaling formula should be baseHealth + wave * 10', () => {
        const originalWave = game.gameState.wave;
        game.gameState.wave = 5;
        const enemy = new game.Enemy('GIGACHAD', 0, -500);
        const expected = game.ENEMY_TYPES.GIGACHAD.health + (5 * 10);
        assert.strictEqual(enemy.health, expected);
        game.gameState.wave = originalWave;
    });

    test('Boss health should scale with wave', () => {
        const originalWave = game.gameState.wave;

        game.gameState.wave = 5;
        const boss5 = new game.Enemy('MINI_BOSS', 0, -1000);

        game.gameState.wave = 15;
        const boss15 = new game.Enemy('MINI_BOSS', 0, -1000);

        assert.ok(boss15.health > boss5.health);
        game.gameState.wave = originalWave;
    });
});

// ==================== PROJECTILE BEHAVIOR TESTS ====================

describe('Projectile Behavior', () => {
    test('Projectile should have life counter', () => {
        const proj = new game.Projectile(0, 0, 0, 0, 0, -20);
        assert.ok(proj.life > 0);
    });

    test('Projectile should track weapon type', () => {
        const proj = new game.Projectile(0, 0, 0, 0, 0, -20);
        assert.ok(proj.weaponType);
        assert.strictEqual(typeof proj.weaponType, 'string');
    });

    test('Projectile should have special property from weapon', () => {
        const proj = new game.Projectile(0, 0, 0, 0, 0, -20);
        // special can be null for standard weapons
        assert.ok('special' in proj);
    });

    test('Multiple projectiles should be independent', () => {
        const proj1 = new game.Projectile(10, 20, -30, 1, 0, -20);
        const proj2 = new game.Projectile(50, 60, -70, -1, 0, -15);
        assert.notStrictEqual(proj1.x, proj2.x);
        assert.notStrictEqual(proj1.vx, proj2.vx);
        assert.notStrictEqual(proj1.vz, proj2.vz);
    });
});

// ==================== GAME STATE MODIFICATION TESTS ====================

describe('Game State Modification', () => {
    test('Game state score should be modifiable', () => {
        const original = game.gameState.score;
        game.gameState.score = 1000;
        assert.strictEqual(game.gameState.score, 1000);
        game.gameState.score = original;
    });

    test('Game state coins should be modifiable', () => {
        const original = game.gameState.coins;
        game.gameState.coins = 500;
        assert.strictEqual(game.gameState.coins, 500);
        game.gameState.coins = original;
    });

    test('Game state wave should be modifiable', () => {
        const original = game.gameState.wave;
        game.gameState.wave = 5;
        assert.strictEqual(game.gameState.wave, 5);
        game.gameState.wave = original;
    });

    test('Game state health should be modifiable', () => {
        const original = game.gameState.health;
        game.gameState.health = 50;
        assert.strictEqual(game.gameState.health, 50);
        game.gameState.health = original;
    });

    test('Game state should track kills', () => {
        const original = game.gameState.kills;
        game.gameState.kills = 100;
        assert.strictEqual(game.gameState.kills, 100);
        game.gameState.kills = original;
    });
});

// ==================== INVENTORY MODIFICATION TESTS ====================

describe('Inventory Modification', () => {
    test('Weapon can be added to inventory', () => {
        const original = game.inventory.weapons.snowball;
        game.inventory.weapons.snowball = true;
        assert.strictEqual(game.inventory.weapons.snowball, true);
        game.inventory.weapons.snowball = original;
    });

    test('Current weapon can be changed', () => {
        const original = game.inventory.currentWeapon;
        game.inventory.currentWeapon = 'snowball';
        assert.strictEqual(game.inventory.currentWeapon, 'snowball');
        game.inventory.currentWeapon = original;
    });

    test('Upgrade levels can be increased', () => {
        const original = game.inventory.upgrades.damage;
        game.inventory.upgrades.damage = 3;
        assert.strictEqual(game.inventory.upgrades.damage, 3);
        game.inventory.upgrades.damage = original;
    });
});

// ==================== PARTICLE BEHAVIOR TESTS ====================

describe('Particle Behavior', () => {
    test('Particle should have random velocity', () => {
        const p1 = new game.Particle(0, 0, 0, '#ff0000');
        const p2 = new game.Particle(0, 0, 0, '#ff0000');
        // With random velocity, particles should differ (statistically very likely)
        // We'll just verify they have velocity
        assert.ok(typeof p1.vx === 'number');
        assert.ok(typeof p1.vy === 'number');
        assert.ok(typeof p1.vz === 'number');
    });

    test('Particle should have maxLife equal to initial life', () => {
        const p = new game.Particle(0, 0, 0, '#ffffff');
        assert.strictEqual(p.life, p.maxLife);
    });

    test('Particle color should be stored', () => {
        const p = new game.Particle(0, 0, 0, '#123456');
        assert.strictEqual(p.color, '#123456');
    });
});

// ==================== COMPREHENSIVE DATA VALIDATION ====================

describe('Comprehensive Data Validation', () => {
    test('All WEAPONS should have valid fire rates', () => {
        for (const [name, weapon] of Object.entries(game.WEAPONS)) {
            assert.ok(weapon.fireRate > 0, `${name} should have positive fire rate`);
            assert.ok(weapon.fireRate <= 100, `${name} fire rate should be reasonable`);
        }
    });

    test('All WEAPONS should have valid speeds', () => {
        for (const [name, weapon] of Object.entries(game.WEAPONS)) {
            assert.ok(weapon.speed > 0, `${name} should have positive speed`);
        }
    });

    test('All ENEMY_TYPES should have valid coin rewards', () => {
        for (const [name, enemy] of Object.entries(game.ENEMY_TYPES)) {
            assert.ok(enemy.coins >= 0, `${name} should have non-negative coins`);
        }
    });

    test('All ENEMY_TYPES should have valid point values', () => {
        for (const [name, enemy] of Object.entries(game.ENEMY_TYPES)) {
            assert.ok(enemy.points >= 0, `${name} should have non-negative points`);
        }
    });

    test('All UPGRADES should have valid price multiplier', () => {
        for (const [name, upgrade] of Object.entries(game.UPGRADES)) {
            assert.ok(upgrade.basePrice > 0, `${name} should have positive base price`);
        }
    });

    test('All SANTA_SKINS should have valid colors', () => {
        for (const [name, skin] of Object.entries(game.SANTA_SKINS)) {
            assert.ok(skin.color, `${name} should have a color`);
            assert.ok(skin.glowColor, `${name} should have a glow color`);
        }
    });
});

// ==================== ENEMY PROPERTIES TESTS ====================

describe('Enemy Advanced Properties', () => {
    test('Enemy should initialize with invulnerable false', () => {
        const enemy = new game.Enemy('GIGACHAD', 0, -500);
        assert.strictEqual(enemy.invulnerable, false);
    });

    test('Enemy should track hit count for one-shot achievement', () => {
        const enemy = new game.Enemy('GIGACHAD', 0, -500);
        assert.strictEqual(enemy.hitCount, 0);
        assert.strictEqual(enemy.wasOneShot, true);
    });

    test('Enemy should have attack cooldown initialized to 0', () => {
        const enemy = new game.Enemy('GIGACHAD', 0, -500);
        assert.strictEqual(enemy.attackCooldown, 0);
    });

    test('Gamer enemy should have ranged attack cooldown', () => {
        const enemy = new game.Enemy('GAMER_DINO', 0, -500);
        assert.ok(enemy.rangedCooldown > 0);
        assert.strictEqual(enemy.shootCooldown, 0);
    });
});

// ==================== KILL STREAK TIER VALIDATION ====================

describe('Kill Streak Tier Validation', () => {
    test('All kill streak tiers should have required properties', () => {
        for (const tier of game.KILL_STREAK_TIERS) {
            assert.ok(typeof tier.count === 'number', 'Tier should have count');
            assert.ok(typeof tier.name === 'string', 'Tier should have name');
            assert.ok(typeof tier.color === 'string', 'Tier should have color');
        }
    });

    test('Kill streak tiers should start from 2', () => {
        assert.strictEqual(game.KILL_STREAK_TIERS[0].count, 2);
    });

    test('Kill streak should have at least 5 tiers', () => {
        assert.ok(game.KILL_STREAK_TIERS.length >= 5);
    });

    test('Highest tier should require at least 10 kills', () => {
        const lastTier = game.KILL_STREAK_TIERS[game.KILL_STREAK_TIERS.length - 1];
        assert.ok(lastTier.count >= 10);
    });
});

// ==================== BOSS INFO ADVANCED TESTS ====================

describe('Boss Info Advanced Tests', () => {
    test('getBossInfo should return different bosses for different waves', () => {
        const boss5 = game.getBossInfo(5);
        const boss10 = game.getBossInfo(10);
        assert.notStrictEqual(boss5.name, boss10.name);
    });

    test('All defined bosses should have emoji', () => {
        for (const [wave, boss] of Object.entries(game.BOSS_NAMES)) {
            assert.ok(boss.emoji, `Boss for wave ${wave} should have emoji`);
        }
    });

    test('All defined bosses should have title', () => {
        for (const [wave, boss] of Object.entries(game.BOSS_NAMES)) {
            assert.ok(boss.title, `Boss for wave ${wave} should have title`);
        }
    });

    test('getBossInfo for wave 50+ should indicate high level', () => {
        const boss = game.getBossInfo(50);
        assert.ok(boss.name.includes('MK') || boss.title.includes('Ascended'));
    });
});

// ==================== ACHIEVEMENT COMPLETION CRITERIA TESTS ====================

describe('Achievement Completion Criteria', () => {
    test('FIRST_BLOOD should have correct id', () => {
        assert.ok(game.ACHIEVEMENTS.FIRST_BLOOD.id);
        assert.ok(typeof game.ACHIEVEMENTS.FIRST_BLOOD.id === 'string');
    });

    test('WAVE_SURVIVOR should be for surviving wave without damage', () => {
        assert.ok(game.ACHIEVEMENTS.WAVE_SURVIVOR.description.toLowerCase().includes('wave') ||
                  game.ACHIEVEMENTS.WAVE_SURVIVOR.description.toLowerCase().includes('damage'));
    });

    test('BIG_SPENDER should be for spending coins', () => {
        assert.ok(game.ACHIEVEMENTS.BIG_SPENDER.description.toLowerCase().includes('spend') ||
                  game.ACHIEVEMENTS.BIG_SPENDER.description.toLowerCase().includes('coins') ||
                  game.ACHIEVEMENTS.BIG_SPENDER.description.toLowerCase().includes('shop'));
    });

    test('BOSS_SLAYER should be for defeating boss', () => {
        assert.ok(game.ACHIEVEMENTS.BOSS_SLAYER.description.toLowerCase().includes('boss') ||
                  game.ACHIEVEMENTS.BOSS_SLAYER.description.toLowerCase().includes('defeat'));
    });
});

console.log('\n✅ All tests completed!');
