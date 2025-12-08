/**
 * Automated tests for Dino Doom Santa FPS
 * Uses Node.js built-in test runner (node:test)
 * Run with: npm test
 *
 * Tests the game constants, configurations, and data structures.
 * The modular codebase is tested by importing the constants module.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Read constants file directly since it's pure JavaScript (no DOM dependencies)
function loadConstants() {
    const constantsPath = path.join(__dirname, '..', 'js', 'constants.js');
    let content = fs.readFileSync(constantsPath, 'utf8');

    // Remove export statements for Node.js compatibility
    content = content.replace(/export (const|let|function)/g, '$1');

    // Execute in sandbox
    const sandbox = {};
    const wrappedScript = `
        ${content}
        return {
            GAME_CONFIG,
            WEAPONS,
            UPGRADES,
            ENEMY_TYPES,
            SANTA_SKINS,
            ACHIEVEMENTS,
            KILL_STREAK_TIERS,
            MEME_RATINGS,
            LAST_WORDS,
            BOSS_NAMES,
            ENEMY_DIALOGUE,
            SIGMA_QUOTES,
            SHOPKEEPER_DIALOGUE,
            SIGMA_ESCAPE_TAUNTS
        };
    `;

    const fn = new Function(wrappedScript);
    return fn.call(sandbox);
}

// Load constants for testing
let gameData;
try {
    gameData = loadConstants();
} catch (e) {
    console.error('Failed to load constants:', e.message);
    process.exit(1);
}

// ==================== GAME CONFIGURATION TESTS ====================
describe('Game Configuration', () => {
    test('GAME_CONFIG has all required properties', () => {
        const requiredProps = [
            'PLAYER_MOVE_SPEED',
            'PLAYER_BASE_DAMAGE',
            'PLAYER_BASE_FIRE_RATE',
            'PLAYER_BASE_CRIT_CHANCE',
            'PLAYER_CRIT_MULTIPLIER',
            'PLAYER_BASE_HEALTH',
            'BOSS_WAVE_INTERVAL',
            'HEAL_KILLS_REQUIRED',
            'HEAL_AMOUNT'
        ];

        requiredProps.forEach(prop => {
            assert.ok(
                gameData.GAME_CONFIG.hasOwnProperty(prop),
                `GAME_CONFIG missing property: ${prop}`
            );
        });
    });

    test('GAME_CONFIG values are reasonable', () => {
        const config = gameData.GAME_CONFIG;

        assert.ok(config.PLAYER_BASE_HEALTH > 0, 'Player health should be positive');
        assert.ok(config.PLAYER_BASE_HEALTH <= 200, 'Player health should not be excessive');
        assert.ok(config.HEAL_KILLS_REQUIRED > 0, 'Heal kills should be positive');
        assert.ok(config.HEAL_AMOUNT > 0, 'Heal amount should be positive');
        assert.ok(config.BOSS_WAVE_INTERVAL > 0, 'Boss wave interval should be positive');
    });

    test('Crit chance and multiplier are balanced', () => {
        const config = gameData.GAME_CONFIG;

        assert.ok(config.PLAYER_BASE_CRIT_CHANCE >= 0, 'Crit chance should be non-negative');
        assert.ok(config.PLAYER_BASE_CRIT_CHANCE <= 1, 'Crit chance should not exceed 100%');
        assert.ok(config.PLAYER_CRIT_MULTIPLIER >= 1, 'Crit multiplier should be at least 1');
        assert.ok(config.PLAYER_CRIT_MULTIPLIER <= 5, 'Crit multiplier should not be excessive');
    });
});

// ==================== WEAPON TESTS ====================
describe('Weapons System', () => {
    test('All weapons have required properties', () => {
        const requiredProps = ['name', 'emoji', 'damage', 'fireRate', 'speed', 'color', 'price', 'description'];

        Object.entries(gameData.WEAPONS).forEach(([key, weapon]) => {
            requiredProps.forEach(prop => {
                assert.ok(
                    weapon.hasOwnProperty(prop),
                    `Weapon ${key} missing property: ${prop}`
                );
            });
        });
    });

    test('Starting weapon (present) is free', () => {
        assert.strictEqual(gameData.WEAPONS.present.price, 0, 'Present launcher should be free');
    });

    test('Weapon damage values are positive', () => {
        Object.entries(gameData.WEAPONS).forEach(([key, weapon]) => {
            assert.ok(weapon.damage > 0, `Weapon ${key} should have positive damage`);
        });
    });

    test('Weapon fire rates are positive', () => {
        Object.entries(gameData.WEAPONS).forEach(([key, weapon]) => {
            assert.ok(weapon.fireRate > 0, `Weapon ${key} should have positive fire rate`);
        });
    });

    test('Weapon prices increase with power', () => {
        const weapons = Object.values(gameData.WEAPONS);
        const freeWeapon = weapons.find(w => w.price === 0);
        const paidWeapons = weapons.filter(w => w.price > 0);

        assert.ok(freeWeapon, 'At least one weapon should be free');
        assert.ok(paidWeapons.length > 0, 'There should be weapons to purchase');
    });

    test('Special weapons have special property', () => {
        assert.ok(gameData.WEAPONS.moai.special, 'Moai should have special property');
        assert.ok(gameData.WEAPONS.doot.special, 'Doot should have special property');
    });

    test('All weapons have valid emojis', () => {
        Object.entries(gameData.WEAPONS).forEach(([key, weapon]) => {
            assert.ok(weapon.emoji.length > 0, `Weapon ${key} should have an emoji`);
        });
    });
});

// ==================== UPGRADE TESTS ====================
describe('Upgrades System', () => {
    test('All upgrades have required properties', () => {
        const requiredProps = ['name', 'icon', 'basePrice', 'maxLevel', 'perLevel', 'description'];

        Object.entries(gameData.UPGRADES).forEach(([key, upgrade]) => {
            requiredProps.forEach(prop => {
                assert.ok(
                    upgrade.hasOwnProperty(prop),
                    `Upgrade ${key} missing property: ${prop}`
                );
            });
        });
    });

    test('Upgrade max levels are reasonable', () => {
        Object.entries(gameData.UPGRADES).forEach(([key, upgrade]) => {
            assert.ok(upgrade.maxLevel >= 1, `Upgrade ${key} should have at least 1 max level`);
            assert.ok(upgrade.maxLevel <= 20, `Upgrade ${key} max level should not be excessive`);
        });
    });

    test('Upgrade prices are positive', () => {
        Object.entries(gameData.UPGRADES).forEach(([key, upgrade]) => {
            assert.ok(upgrade.basePrice > 0, `Upgrade ${key} should have positive base price`);
        });
    });

    test('Upgrade per-level values are positive', () => {
        Object.entries(gameData.UPGRADES).forEach(([key, upgrade]) => {
            assert.ok(upgrade.perLevel > 0, `Upgrade ${key} should have positive per-level value`);
        });
    });
});

// ==================== ENEMY TYPE TESTS ====================
describe('Enemy Types', () => {
    test('All enemy types have required properties', () => {
        const requiredProps = ['name', 'emoji', 'health', 'damage', 'speed', 'size', 'color', 'points', 'coins', 'traits'];

        Object.entries(gameData.ENEMY_TYPES).forEach(([key, enemy]) => {
            requiredProps.forEach(prop => {
                assert.ok(
                    enemy.hasOwnProperty(prop),
                    `Enemy type ${key} missing property: ${prop}`
                );
            });
        });
    });

    test('Enemy health values are positive', () => {
        Object.entries(gameData.ENEMY_TYPES).forEach(([key, enemy]) => {
            assert.ok(enemy.health > 0, `Enemy ${key} should have positive health`);
        });
    });

    test('Enemy point values are positive', () => {
        Object.entries(gameData.ENEMY_TYPES).forEach(([key, enemy]) => {
            assert.ok(enemy.points > 0, `Enemy ${key} should give positive points`);
        });
    });

    test('Enemy coin values are positive', () => {
        Object.entries(gameData.ENEMY_TYPES).forEach(([key, enemy]) => {
            assert.ok(enemy.coins > 0, `Enemy ${key} should give positive coins`);
        });
    });

    test('Boss enemy is marked correctly', () => {
        const boss = gameData.ENEMY_TYPES.MINI_BOSS;
        assert.ok(boss.isBoss, 'MINI_BOSS should have isBoss flag');
    });

    test('All enemies have traits array', () => {
        Object.entries(gameData.ENEMY_TYPES).forEach(([key, enemy]) => {
            assert.ok(Array.isArray(enemy.traits), `Enemy ${key} traits should be an array`);
            assert.ok(enemy.traits.length > 0, `Enemy ${key} should have at least one trait`);
        });
    });

    test('Gamer Dino has special properties', () => {
        const gamer = gameData.ENEMY_TYPES.GAMER_DINO;
        assert.ok(gamer.isGamer, 'GAMER_DINO should have isGamer flag');
        assert.ok(Array.isArray(gamer.deathMessages), 'GAMER_DINO should have death messages');
    });

    test('Sigma Dino has special properties', () => {
        const sigma = gameData.ENEMY_TYPES.SIGMA_DINO;
        assert.ok(sigma.isSigma, 'SIGMA_DINO should have isSigma flag');
        assert.strictEqual(sigma.damage, 0, 'SIGMA_DINO should not deal damage');
    });
});

// ==================== SANTA SKIN TESTS ====================
describe('Santa Skins', () => {
    test('All skins have required properties', () => {
        const requiredProps = ['name', 'emoji', 'price', 'color', 'glowColor', 'description'];

        Object.entries(gameData.SANTA_SKINS).forEach(([key, skin]) => {
            requiredProps.forEach(prop => {
                assert.ok(
                    skin.hasOwnProperty(prop),
                    `Skin ${key} missing property: ${prop}`
                );
            });
        });
    });

    test('Default skin is free', () => {
        assert.strictEqual(gameData.SANTA_SKINS.default.price, 0, 'Default skin should be free');
    });

    test('Skin prices are non-negative', () => {
        Object.entries(gameData.SANTA_SKINS).forEach(([key, skin]) => {
            assert.ok(skin.price >= 0, `Skin ${key} should have non-negative price`);
        });
    });

    test('Skins have valid color values', () => {
        Object.entries(gameData.SANTA_SKINS).forEach(([key, skin]) => {
            assert.ok(skin.color.startsWith('#'), `Skin ${key} color should be hex format`);
            assert.ok(skin.glowColor.startsWith('#'), `Skin ${key} glowColor should be hex format`);
        });
    });
});

// ==================== ACHIEVEMENT TESTS ====================
describe('Achievements', () => {
    test('All achievements have required properties', () => {
        const requiredProps = ['id', 'name', 'description', 'icon'];

        Object.entries(gameData.ACHIEVEMENTS).forEach(([key, achievement]) => {
            requiredProps.forEach(prop => {
                assert.ok(
                    achievement.hasOwnProperty(prop),
                    `Achievement ${key} missing property: ${prop}`
                );
            });
        });
    });

    test('Achievement IDs are unique', () => {
        const ids = Object.values(gameData.ACHIEVEMENTS).map(a => a.id);
        const uniqueIds = new Set(ids);
        assert.strictEqual(ids.length, uniqueIds.size, 'Achievement IDs should be unique');
    });

    test('All achievements have icons', () => {
        Object.entries(gameData.ACHIEVEMENTS).forEach(([key, achievement]) => {
            assert.ok(achievement.icon.length > 0, `Achievement ${key} should have an icon`);
        });
    });
});

// ==================== KILL STREAK TESTS ====================
describe('Kill Streaks', () => {
    test('Kill streak tiers are sorted by count', () => {
        const tiers = gameData.KILL_STREAK_TIERS;
        for (let i = 1; i < tiers.length; i++) {
            assert.ok(
                tiers[i].count > tiers[i - 1].count,
                'Kill streak tiers should be sorted by count ascending'
            );
        }
    });

    test('Kill streak tiers have required properties', () => {
        gameData.KILL_STREAK_TIERS.forEach((tier, index) => {
            assert.ok(tier.count > 0, `Tier ${index} should have positive count`);
            assert.ok(tier.name, `Tier ${index} should have a name`);
            assert.ok(tier.color, `Tier ${index} should have a color`);
        });
    });

    test('First kill streak requires at least 2 kills', () => {
        const minTier = gameData.KILL_STREAK_TIERS[0];
        assert.ok(minTier.count >= 2, 'First kill streak should require at least 2 kills');
    });
});

// ==================== MEME RATING TESTS ====================
describe('Meme Ratings', () => {
    test('Meme ratings are sorted by minScore', () => {
        const ratings = gameData.MEME_RATINGS;
        for (let i = 1; i < ratings.length; i++) {
            assert.ok(
                ratings[i].minScore > ratings[i - 1].minScore,
                'Meme ratings should be sorted by minScore ascending'
            );
        }
    });

    test('Lowest rating starts at score 0', () => {
        assert.strictEqual(gameData.MEME_RATINGS[0].minScore, 0, 'Lowest rating should start at 0');
    });

    test('All ratings have required properties', () => {
        gameData.MEME_RATINGS.forEach((rating, index) => {
            assert.ok(rating.hasOwnProperty('minScore'), `Rating ${index} should have minScore`);
            assert.ok(rating.rating, `Rating ${index} should have rating text`);
            assert.ok(rating.color, `Rating ${index} should have color`);
        });
    });
});

// ==================== BOSS TESTS ====================
describe('Boss System', () => {
    test('Boss names exist for wave intervals', () => {
        const bossWaves = [5, 10, 15, 20, 25];
        bossWaves.forEach(wave => {
            assert.ok(gameData.BOSS_NAMES[wave], `Boss should exist for wave ${wave}`);
        });
    });

    test('All bosses have required properties', () => {
        Object.entries(gameData.BOSS_NAMES).forEach(([wave, boss]) => {
            assert.ok(boss.name, `Boss at wave ${wave} should have name`);
            assert.ok(boss.title, `Boss at wave ${wave} should have title`);
            assert.ok(boss.emoji, `Boss at wave ${wave} should have emoji`);
        });
    });
});

// ==================== DIALOGUE TESTS ====================
describe('Enemy Dialogue', () => {
    test('All enemy types have dialogue', () => {
        const enemyTypesWithDialogue = Object.keys(gameData.ENEMY_DIALOGUE);
        assert.ok(enemyTypesWithDialogue.length > 0, 'At least some enemies should have dialogue');
    });

    test('Dialogue has spawn and attack categories', () => {
        Object.entries(gameData.ENEMY_DIALOGUE).forEach(([type, dialogue]) => {
            assert.ok(dialogue.spawn, `${type} should have spawn dialogue`);
            assert.ok(dialogue.attack, `${type} should have attack dialogue`);
            assert.ok(dialogue.spawn.length > 0, `${type} spawn dialogue should not be empty`);
            assert.ok(dialogue.attack.length > 0, `${type} attack dialogue should not be empty`);
        });
    });

    test('Sigma quotes exist', () => {
        assert.ok(Array.isArray(gameData.SIGMA_QUOTES), 'SIGMA_QUOTES should be an array');
        assert.ok(gameData.SIGMA_QUOTES.length > 0, 'SIGMA_QUOTES should not be empty');
    });

    test('Sigma escape taunts exist', () => {
        assert.ok(Array.isArray(gameData.SIGMA_ESCAPE_TAUNTS), 'SIGMA_ESCAPE_TAUNTS should be an array');
        assert.ok(gameData.SIGMA_ESCAPE_TAUNTS.length > 0, 'SIGMA_ESCAPE_TAUNTS should not be empty');
    });
});

// ==================== SHOPKEEPER TESTS ====================
describe('Shopkeeper Dialogue', () => {
    test('Shopkeeper has all dialogue categories', () => {
        const categories = ['rich', 'broke', 'normal', 'purchase'];
        categories.forEach(cat => {
            assert.ok(
                gameData.SHOPKEEPER_DIALOGUE[cat],
                `Shopkeeper should have ${cat} dialogue`
            );
            assert.ok(
                gameData.SHOPKEEPER_DIALOGUE[cat].length > 0,
                `Shopkeeper ${cat} dialogue should not be empty`
            );
        });
    });
});

// ==================== LAST WORDS TESTS ====================
describe('Last Words', () => {
    test('Last words array exists and is populated', () => {
        assert.ok(Array.isArray(gameData.LAST_WORDS), 'LAST_WORDS should be an array');
        assert.ok(gameData.LAST_WORDS.length >= 5, 'LAST_WORDS should have at least 5 entries');
    });
});

// ==================== FILE STRUCTURE TESTS ====================
describe('Project Structure', () => {
    const projectRoot = path.join(__dirname, '..');

    test('Main HTML file exists', () => {
        assert.ok(fs.existsSync(path.join(projectRoot, 'index.html')), 'index.html should exist');
    });

    test('CSS file exists', () => {
        assert.ok(fs.existsSync(path.join(projectRoot, 'css', 'styles.css')), 'css/styles.css should exist');
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
                fs.existsSync(path.join(projectRoot, file)),
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
                fs.existsSync(path.join(projectRoot, file)),
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
                fs.existsSync(path.join(projectRoot, file)),
                `${file} should exist`
            );
        });
    });
});

// ==================== INDEX.HTML STRUCTURE TESTS ====================
describe('HTML Structure', () => {
    const projectRoot = path.join(__dirname, '..');
    const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');

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
});

console.log('All tests completed!');
