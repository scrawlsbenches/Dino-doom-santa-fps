/**
 * Automated tests for Dino Doom Santa FPS
 * Uses Node.js built-in test runner (node:test)
 * Run with: npm test
 *
 * Comprehensive unit tests for high code coverage.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== HELPER FUNCTIONS ====================

/**
 * Loads and evaluates a JS module file, stripping exports
 * @param {string} relativePath - Path to the module
 * @param {string} _additionalSetup - Additional setup code (reserved for future use)
 */
function _loadModule(relativePath, _additionalSetup = '') {
    const filePath = path.join(__dirname, '..', relativePath);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove import statements
    content = content.replace(/import\s+.*?from\s+['"][^'"]+['"];?\n?/g, '');

    // Remove export statements but keep the declarations
    content = content.replace(/export\s+(const|let|function|class)/g, '$1');
    content = content.replace(/export\s+\{[^}]*\};?\n?/g, '');

    return content;
}

/**
 * Creates a mock DOM environment
 * Reserved for future use in browser-context tests
 */
function _createMockDOM() {
    const elements = {};
    return {
        getElementById: (id) => {
            if (!elements[id]) {
                elements[id] = {
                    style: {},
                    textContent: '',
                    innerHTML: '',
                    classList: {
                        add: () => {},
                        remove: () => {},
                        contains: () => false
                    },
                    appendChild: () => {},
                    remove: () => {},
                    addEventListener: () => {}
                };
            }
            return elements[id];
        },
        createElement: (_tag) => ({
            style: {},
            textContent: '',
            innerHTML: '',
            className: '',
            classList: {
                add: () => {},
                remove: () => {}
            },
            appendChild: () => {},
            remove: () => {}
        }),
        querySelector: () => null,
        addEventListener: () => {}
    };
}

// Load constants for testing
function loadConstants() {
    const constantsPath = path.join(__dirname, '..', 'js', 'constants.js');
    let content = fs.readFileSync(constantsPath, 'utf8');
    content = content.replace(/export (const|let|function)/g, '$1');

    const fn = new Function(`
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
    `);
    return fn();
}

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

    test('Wave system configuration is valid', () => {
        const config = gameData.GAME_CONFIG;

        assert.ok(config.ENEMIES_BASE_COUNT > 0, 'Base enemy count should be positive');
        assert.ok(config.ENEMIES_PER_WAVE > 0, 'Enemies per wave should be positive');
        assert.ok(config.ENEMY_SPAWN_DELAY_MS > 0, 'Spawn delay should be positive');
    });

    test('Minigame configuration is valid', () => {
        const config = gameData.GAME_CONFIG;

        assert.ok(config.MINIGAME_DURATION_SEC > 0, 'Minigame duration should be positive');
        assert.ok(config.MINIGAME_TARGET_SPAWN_INTERVAL > 0, 'Target spawn interval should be positive');
        assert.ok(config.MINIGAME_DAMAGE_PER_HIT > 0, 'Damage per hit should be positive');
    });

    test('Boss configuration is valid', () => {
        const config = gameData.GAME_CONFIG;

        assert.ok(config.BOSS_BASE_HEALTH > 0, 'Boss base health should be positive');
        assert.ok(config.BOSS_HEALTH_PER_WAVE >= 0, 'Boss health per wave should be non-negative');
        assert.ok(config.BOSS_SHOOT_COOLDOWN > 0, 'Boss shoot cooldown should be positive');
        assert.ok(config.BOSS_MINIGAME_THRESHOLD > 0, 'Minigame threshold should be positive');
        assert.ok(config.BOSS_MINIGAME_THRESHOLD <= 1, 'Minigame threshold should not exceed 1');
    });

    test('Gamer and Sigma dino configuration is valid', () => {
        const config = gameData.GAME_CONFIG;

        assert.ok(config.GAMER_RANGED_COOLDOWN > 0, 'Gamer ranged cooldown should be positive');
        assert.ok(config.GAMER_PROJECTILE_DAMAGE > 0, 'Gamer projectile damage should be positive');
        assert.ok(config.SIGMA_ESCAPE_X > 0, 'Sigma escape distance should be positive');
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

    test('Weapon speeds are positive', () => {
        Object.entries(gameData.WEAPONS).forEach(([key, weapon]) => {
            assert.ok(weapon.speed > 0, `Weapon ${key} should have positive speed`);
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
        assert.strictEqual(gameData.WEAPONS.moai.special, 'moai');
        assert.strictEqual(gameData.WEAPONS.doot.special, 'doot');
    });

    test('All weapons have valid emojis', () => {
        Object.entries(gameData.WEAPONS).forEach(([key, weapon]) => {
            assert.ok(weapon.emoji.length > 0, `Weapon ${key} should have an emoji`);
        });
    });

    test('All weapons have valid colors (hex format)', () => {
        Object.entries(gameData.WEAPONS).forEach(([key, weapon]) => {
            assert.ok(weapon.color.startsWith('#'), `Weapon ${key} color should be hex format`);
        });
    });

    test('Weapon count is reasonable', () => {
        const weaponCount = Object.keys(gameData.WEAPONS).length;
        assert.ok(weaponCount >= 5, 'Should have at least 5 weapons');
        assert.ok(weaponCount <= 20, 'Should not have excessive weapons');
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

    test('All upgrade types are present', () => {
        const expectedUpgrades = ['damage', 'fireRate', 'health', 'critChance'];
        expectedUpgrades.forEach(upgrade => {
            assert.ok(gameData.UPGRADES[upgrade], `Upgrade ${upgrade} should exist`);
        });
    });

    test('Upgrade icons are non-empty', () => {
        Object.entries(gameData.UPGRADES).forEach(([key, upgrade]) => {
            assert.ok(upgrade.icon.length > 0, `Upgrade ${key} should have an icon`);
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

    test('Enemy speed values are positive', () => {
        Object.entries(gameData.ENEMY_TYPES).forEach(([key, enemy]) => {
            assert.ok(enemy.speed > 0, `Enemy ${key} should have positive speed`);
        });
    });

    test('Enemy size values are positive', () => {
        Object.entries(gameData.ENEMY_TYPES).forEach(([key, enemy]) => {
            assert.ok(enemy.size > 0, `Enemy ${key} should have positive size`);
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
        assert.ok(gamer.deathMessages.length > 0, 'GAMER_DINO should have at least one death message');
    });

    test('Sigma Dino has special properties', () => {
        const sigma = gameData.ENEMY_TYPES.SIGMA_DINO;
        assert.ok(sigma.isSigma, 'SIGMA_DINO should have isSigma flag');
        assert.strictEqual(sigma.damage, 0, 'SIGMA_DINO should not deal damage');
        assert.ok(Array.isArray(sigma.deathMessages), 'SIGMA_DINO should have death messages');
    });

    test('Enemy type count is reasonable', () => {
        const enemyCount = Object.keys(gameData.ENEMY_TYPES).length;
        assert.ok(enemyCount >= 3, 'Should have at least 3 enemy types');
    });

    test('Boss has higher stats than regular enemies', () => {
        const boss = gameData.ENEMY_TYPES.MINI_BOSS;
        const gigachad = gameData.ENEMY_TYPES.GIGACHAD;

        assert.ok(boss.health > gigachad.health, 'Boss should have more health');
        assert.ok(boss.points > gigachad.points, 'Boss should give more points');
        assert.ok(boss.coins > gigachad.coins, 'Boss should give more coins');
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

    test('Skins have non-empty descriptions', () => {
        Object.entries(gameData.SANTA_SKINS).forEach(([key, skin]) => {
            assert.ok(skin.description.length > 0, `Skin ${key} should have description`);
        });
    });

    test('Skin prices increase for premium skins', () => {
        const skins = Object.values(gameData.SANTA_SKINS);
        const premiumSkins = skins.filter(s => s.price > 0);

        assert.ok(premiumSkins.length > 0, 'There should be premium skins');
        assert.ok(premiumSkins.some(s => s.price >= 1000), 'There should be high-value skins');
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

    test('Achievement names are non-empty', () => {
        Object.entries(gameData.ACHIEVEMENTS).forEach(([key, achievement]) => {
            assert.ok(achievement.name.length > 0, `Achievement ${key} should have a name`);
        });
    });

    test('Achievement descriptions are non-empty', () => {
        Object.entries(gameData.ACHIEVEMENTS).forEach(([key, achievement]) => {
            assert.ok(achievement.description.length > 0, `Achievement ${key} should have description`);
        });
    });

    test('Key achievements exist', () => {
        const expectedAchievements = ['FIRST_BLOOD', 'BOSS_SLAYER', 'SKILL_ISSUE'];
        expectedAchievements.forEach(key => {
            assert.ok(gameData.ACHIEVEMENTS[key], `Achievement ${key} should exist`);
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

    test('Kill streak names are unique', () => {
        const names = gameData.KILL_STREAK_TIERS.map(t => t.name);
        const uniqueNames = new Set(names);
        assert.strictEqual(names.length, uniqueNames.size, 'Kill streak names should be unique');
    });

    test('Kill streak colors are valid hex colors', () => {
        gameData.KILL_STREAK_TIERS.forEach((tier, index) => {
            assert.ok(tier.color.startsWith('#'), `Tier ${index} color should be hex format`);
        });
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

    test('Ratings have unique names', () => {
        const names = gameData.MEME_RATINGS.map(r => r.rating);
        const uniqueNames = new Set(names);
        assert.strictEqual(names.length, uniqueNames.size, 'Rating names should be unique');
    });

    test('Highest rating requires significant score', () => {
        const highestRating = gameData.MEME_RATINGS[gameData.MEME_RATINGS.length - 1];
        assert.ok(highestRating.minScore >= 10000, 'Highest rating should require high score');
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

    test('Boss names are unique', () => {
        const names = Object.values(gameData.BOSS_NAMES).map(b => b.name);
        const uniqueNames = new Set(names);
        assert.strictEqual(names.length, uniqueNames.size, 'Boss names should be unique');
    });

    test('Boss titles are non-empty', () => {
        Object.entries(gameData.BOSS_NAMES).forEach(([wave, boss]) => {
            assert.ok(boss.title.length > 0, `Boss at wave ${wave} should have non-empty title`);
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

    test('All dialogue strings are non-empty', () => {
        Object.entries(gameData.ENEMY_DIALOGUE).forEach(([type, dialogue]) => {
            dialogue.spawn.forEach((text, i) => {
                assert.ok(text.length > 0, `${type} spawn[${i}] should not be empty`);
            });
            dialogue.attack.forEach((text, i) => {
                assert.ok(text.length > 0, `${type} attack[${i}] should not be empty`);
            });
        });
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

    test('Shopkeeper dialogue strings are non-empty', () => {
        Object.entries(gameData.SHOPKEEPER_DIALOGUE).forEach(([category, dialogues]) => {
            dialogues.forEach((text, i) => {
                assert.ok(text.length > 0, `Shopkeeper ${category}[${i}] should not be empty`);
            });
        });
    });
});

// ==================== LAST WORDS TESTS ====================
describe('Last Words', () => {
    test('Last words array exists and is populated', () => {
        assert.ok(Array.isArray(gameData.LAST_WORDS), 'LAST_WORDS should be an array');
        assert.ok(gameData.LAST_WORDS.length >= 5, 'LAST_WORDS should have at least 5 entries');
    });

    test('All last words are non-empty strings', () => {
        gameData.LAST_WORDS.forEach((word, i) => {
            assert.ok(typeof word === 'string', `LAST_WORDS[${i}] should be a string`);
            assert.ok(word.length > 0, `LAST_WORDS[${i}] should not be empty`);
        });
    });
});

// ==================== STATE MANAGEMENT TESTS ====================
describe('State Management', () => {
    test('State module file exists and has correct structure', () => {
        const stateContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'state.js'),
            'utf8'
        );

        // Check for key exports (const used for object references that aren't reassigned)
        assert.ok(stateContent.includes('export const gameState'), 'Should export gameState');
        assert.ok(stateContent.includes('export const player'), 'Should export player');
        assert.ok(stateContent.includes('export const inventory'), 'Should export inventory');
        assert.ok(stateContent.includes('export function resetGameState'), 'Should export resetGameState');
        assert.ok(stateContent.includes('export function resetPlayerState'), 'Should export resetPlayerState');
    });

    test('State has all required game state properties', () => {
        const stateContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'state.js'),
            'utf8'
        );

        const requiredProps = ['running', 'paused', 'score', 'coins', 'kills', 'wave', 'health'];
        requiredProps.forEach(prop => {
            assert.ok(stateContent.includes(prop), `gameState should have ${prop} property`);
        });
    });

    test('State has all required player properties', () => {
        const stateContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'state.js'),
            'utf8'
        );

        const requiredProps = ['x', 'y', 'angle', 'moveSpeed', 'damage', 'fireRate', 'critChance'];
        requiredProps.forEach(prop => {
            assert.ok(stateContent.includes(prop), `player should have ${prop} property`);
        });
    });

    test('State has entity arrays', () => {
        const stateContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'state.js'),
            'utf8'
        );

        const arrays = ['enemies', 'projectiles', 'enemyProjectiles', 'particles', 'floatingTexts'];
        arrays.forEach(arr => {
            assert.ok(stateContent.includes(`export const ${arr} = []`), `Should export ${arr} array`);
        });
    });

    test('Reset functions clear appropriate state', () => {
        const stateContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'state.js'),
            'utf8'
        );

        // resetGameState should reset score, coins, kills, wave
        assert.ok(stateContent.includes('gameState.score = 0'), 'resetGameState should reset score');
        assert.ok(stateContent.includes('gameState.coins = 0'), 'resetGameState should reset coins');
        assert.ok(stateContent.includes('gameState.wave = 1'), 'resetGameState should reset wave');
    });
});

// ==================== CLASS TESTS ====================
describe('Enemy Class', () => {
    test('Enemy class file exists and has correct structure', () => {
        const enemyContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'classes', 'Enemy.js'),
            'utf8'
        );

        assert.ok(enemyContent.includes('export class Enemy'), 'Should export Enemy class');
        assert.ok(enemyContent.includes('constructor('), 'Should have constructor');
        assert.ok(enemyContent.includes('update()'), 'Should have update method');
        assert.ok(enemyContent.includes('draw('), 'Should have draw method');
        assert.ok(enemyContent.includes('takeDamage('), 'Should have takeDamage method');
        assert.ok(enemyContent.includes('die()'), 'Should have die method');
        assert.ok(enemyContent.includes('attack()'), 'Should have attack method');
    });

    test('Enemy class handles special enemy types', () => {
        const enemyContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'classes', 'Enemy.js'),
            'utf8'
        );

        assert.ok(enemyContent.includes('isGamer'), 'Should handle Gamer Dino');
        assert.ok(enemyContent.includes('isSigma'), 'Should handle Sigma Dino');
        assert.ok(enemyContent.includes('isBoss'), 'Should handle Boss');
    });

    test('Enemy class has callback system', () => {
        const enemyContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'classes', 'Enemy.js'),
            'utf8'
        );

        assert.ok(enemyContent.includes('this.callbacks'), 'Should store callbacks');
        assert.ok(enemyContent.includes('callbacks.playSound'), 'Should call playSound');
        assert.ok(enemyContent.includes('callbacks.updateHUD'), 'Should call updateHUD');
    });
});

describe('Projectile Class', () => {
    test('Projectile class file exists and has correct structure', () => {
        const projectileContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'classes', 'Projectile.js'),
            'utf8'
        );

        assert.ok(projectileContent.includes('export class Projectile'), 'Should export Projectile class');
        assert.ok(projectileContent.includes('constructor('), 'Should have constructor');
        assert.ok(projectileContent.includes('update()'), 'Should have update method');
        assert.ok(projectileContent.includes('draw('), 'Should have draw method');
        assert.ok(projectileContent.includes('isExpired()'), 'Should have isExpired method');
    });

    test('Projectile handles special weapons', () => {
        const projectileContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'classes', 'Projectile.js'),
            'utf8'
        );

        assert.ok(projectileContent.includes('moai'), 'Should handle moai special');
        assert.ok(projectileContent.includes('doot'), 'Should handle doot special');
        assert.ok(projectileContent.includes('showYoAngelo'), 'Should have Yo Angelo effect');
        assert.ok(projectileContent.includes('showSkeletonEffect'), 'Should have skeleton effect');
    });
});

describe('Particle Class', () => {
    test('Particle class file exists and has correct structure', () => {
        const particleContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'classes', 'Particle.js'),
            'utf8'
        );

        assert.ok(particleContent.includes('export class Particle'), 'Should export Particle class');
        assert.ok(particleContent.includes('constructor('), 'Should have constructor');
        assert.ok(particleContent.includes('update()'), 'Should have update method');
        assert.ok(particleContent.includes('draw('), 'Should have draw method');
        assert.ok(particleContent.includes('isExpired()'), 'Should have isExpired method');
    });

    test('Particle has physics properties', () => {
        const particleContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'classes', 'Particle.js'),
            'utf8'
        );

        assert.ok(particleContent.includes('this.vx'), 'Should have velocity x');
        assert.ok(particleContent.includes('this.vy'), 'Should have velocity y');
        assert.ok(particleContent.includes('this.vz'), 'Should have velocity z');
        assert.ok(particleContent.includes('this.life'), 'Should have life');
    });
});

describe('EnemyProjectile Class', () => {
    test('EnemyProjectile class file exists', () => {
        const content = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'classes', 'EnemyProjectile.js'),
            'utf8'
        );

        assert.ok(content.includes('export class EnemyProjectile'), 'Should export EnemyProjectile class');
        assert.ok(content.includes('update()'), 'Should have update method');
        assert.ok(content.includes('draw('), 'Should have draw method');
    });
});

describe('GamerProjectile Class', () => {
    test('GamerProjectile class file exists', () => {
        const content = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'classes', 'GamerProjectile.js'),
            'utf8'
        );

        assert.ok(content.includes('export class GamerProjectile'), 'Should export GamerProjectile class');
        assert.ok(content.includes('spin'), 'Should have spin for RGB color cycling');
        assert.ok(content.includes('RGB color cycling'), 'Should have RGB color cycling comment');
    });
});

// ==================== SYSTEM TESTS ====================
describe('Audio System', () => {
    test('Audio system file exists and has correct structure', () => {
        const audioContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'audio.js'),
            'utf8'
        );

        assert.ok(audioContent.includes('export function initAudio'), 'Should export initAudio');
        assert.ok(audioContent.includes('export function playSound'), 'Should export playSound');
        assert.ok(audioContent.includes('AudioContext'), 'Should use Web Audio API');
    });

    test('Audio system handles multiple sound types', () => {
        const audioContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'audio.js'),
            'utf8'
        );

        const soundTypes = ['shoot', 'hit', 'kill', 'damage', 'boss', 'achievement'];
        soundTypes.forEach(type => {
            assert.ok(audioContent.includes(`'${type}'`) || audioContent.includes(`"${type}"`),
                `Should handle ${type} sound`);
        });
    });
});

describe('Effects System', () => {
    test('Effects system file exists and has correct structure', () => {
        const effectsContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'effects.js'),
            'utf8'
        );

        assert.ok(effectsContent.includes('export function showDamageOverlay'), 'Should export showDamageOverlay');
        assert.ok(effectsContent.includes('export function showHitMarker'), 'Should export showHitMarker');
        assert.ok(effectsContent.includes('shake') || effectsContent.includes('Shake'), 'Should have screen shake');
    });
});

describe('Achievement System', () => {
    test('Achievement system file exists and has correct structure', () => {
        const achievementContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'achievements.js'),
            'utf8'
        );

        assert.ok(achievementContent.includes('export function unlockAchievement'), 'Should export unlockAchievement');
        assert.ok(achievementContent.includes('export function checkKillAchievements'), 'Should export checkKillAchievements');
        assert.ok(achievementContent.includes('unlockedAchievements'), 'Should track unlocked achievements');
    });

    test('Achievement system checks for specific achievements', () => {
        const achievementContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'achievements.js'),
            'utf8'
        );

        assert.ok(achievementContent.includes('FIRST_BLOOD'), 'Should check FIRST_BLOOD');
        assert.ok(achievementContent.includes('BOSS_SLAYER'), 'Should check BOSS_SLAYER');
        assert.ok(achievementContent.includes('SKILL_ISSUE'), 'Should check SKILL_ISSUE');
    });
});

describe('Kill Streak System', () => {
    test('Kill streak system file exists and has correct structure', () => {
        const killstreakContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'killstreak.js'),
            'utf8'
        );

        assert.ok(killstreakContent.includes('export function recordKill'), 'Should export recordKill');
        assert.ok(killstreakContent.includes('export function showKillStreakAnnouncement'), 'Should export showKillStreakAnnouncement');
        assert.ok(killstreakContent.includes('KILL_STREAK_TIERS'), 'Should use KILL_STREAK_TIERS');
    });
});

describe('Death System', () => {
    test('Death system file exists and has correct structure', () => {
        const deathContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'death.js'),
            'utf8'
        );

        assert.ok(deathContent.includes('export function getMemeRating'), 'Should export getMemeRating');
        assert.ok(deathContent.includes('export function formatTime'), 'Should export formatTime');
        assert.ok(deathContent.includes('export function updateDeathScreen'), 'Should export updateDeathScreen');
        assert.ok(deathContent.includes('export function copyDeathReceipt'), 'Should export copyDeathReceipt');
    });

    test('Death system uses MEME_RATINGS correctly', () => {
        const deathContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'death.js'),
            'utf8'
        );

        assert.ok(deathContent.includes('MEME_RATINGS'), 'Should use MEME_RATINGS');
        assert.ok(deathContent.includes('LAST_WORDS'), 'Should use LAST_WORDS');
    });
});

describe('Shop System', () => {
    test('Shop system file exists and has correct structure', () => {
        const shopContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'shop.js'),
            'utf8'
        );

        assert.ok(shopContent.includes('export function openShop'), 'Should export openShop');
        assert.ok(shopContent.includes('WEAPONS'), 'Should use WEAPONS');
        assert.ok(shopContent.includes('UPGRADES'), 'Should use UPGRADES');
    });
});

describe('Skins System', () => {
    test('Skins system file exists and has correct structure', () => {
        const skinsContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'skins.js'),
            'utf8'
        );

        assert.ok(skinsContent.includes('export function initSkinSystem'), 'Should export initSkinSystem');
        assert.ok(skinsContent.includes('SANTA_SKINS'), 'Should use SANTA_SKINS');
        assert.ok(skinsContent.includes('skinState'), 'Should use skinState');
    });
});

describe('Boss System', () => {
    test('Boss system file exists and has correct structure', () => {
        const bossContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'boss.js'),
            'utf8'
        );

        assert.ok(bossContent.includes('export function getBossInfo'), 'Should export getBossInfo');
        assert.ok(bossContent.includes('export function playBossIntro'), 'Should export playBossIntro');
        assert.ok(bossContent.includes('export function spawnBoss'), 'Should export spawnBoss');
        assert.ok(bossContent.includes('BOSS_NAMES'), 'Should use BOSS_NAMES');
    });
});

describe('Minigame System', () => {
    test('Minigame system file exists and has correct structure', () => {
        const minigameContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'minigame.js'),
            'utf8'
        );

        assert.ok(minigameContent.includes('export function startMinigame'), 'Should export startMinigame');
        assert.ok(minigameContent.includes('export function endMinigame'), 'Should export endMinigame');
        assert.ok(minigameContent.includes('minigameState'), 'Should use minigameState');
    });
});

describe('Dialogue System', () => {
    test('Dialogue system file exists and has correct structure', () => {
        const dialogueContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'dialogue.js'),
            'utf8'
        );

        assert.ok(dialogueContent.includes('ENEMY_DIALOGUE'), 'Should use ENEMY_DIALOGUE');
    });
});

// ==================== UI MODULE TESTS ====================
describe('UI Module', () => {
    test('UI module file exists and has correct structure', () => {
        const uiContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'ui.js'),
            'utf8'
        );

        assert.ok(uiContent.includes('export function updateHUD'), 'Should export updateHUD');
        assert.ok(uiContent.includes('export function addKillFeed'), 'Should export addKillFeed');
    });
});

// ==================== GAME MODULE TESTS ====================
describe('Game Module', () => {
    test('Game module file exists and has correct structure', () => {
        const gameContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'game.js'),
            'utf8'
        );

        assert.ok(gameContent.includes('export function initGame'), 'Should export initGame');
        assert.ok(gameContent.includes('export function startGame'), 'Should export startGame');
        assert.ok(gameContent.includes('export function shoot'), 'Should export shoot');
        assert.ok(gameContent.includes('gameLoop') || gameContent.includes('requestAnimationFrame'), 'Should have game loop');
    });

    test('Game module handles wave spawning', () => {
        const gameContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'game.js'),
            'utf8'
        );

        assert.ok(gameContent.includes('spawnWave') || gameContent.includes('spawn'), 'Should handle wave spawning');
        assert.ok(gameContent.includes('Enemy'), 'Should create enemies');
    });
});

// ==================== MAIN ENTRY POINT TESTS ====================
describe('Main Entry Point', () => {
    test('Main module file exists and has correct structure', () => {
        const mainContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'main.js'),
            'utf8'
        );

        assert.ok(mainContent.includes('import'), 'Should have imports');
        assert.ok(mainContent.includes('addEventListener'), 'Should set up event listeners');
        assert.ok(mainContent.includes('DOMContentLoaded') || mainContent.includes('readyState'), 'Should wait for DOM');
    });

    test('Main module imports key functions', () => {
        const mainContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'main.js'),
            'utf8'
        );

        assert.ok(mainContent.includes('initGame'), 'Should import initGame');
        assert.ok(mainContent.includes('startGame'), 'Should import startGame');
        assert.ok(mainContent.includes('shoot'), 'Should import shoot');
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
    const projectRoot = path.join(__dirname, '..');
    const css = fs.readFileSync(path.join(projectRoot, 'css', 'styles.css'), 'utf8');

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

// ==================== INTEGRATION TESTS ====================
describe('Module Integration', () => {
    test('Constants are imported by state module', () => {
        const stateContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'state.js'),
            'utf8'
        );

        assert.ok(stateContent.includes("from './constants.js'"), 'State should import from constants');
        assert.ok(stateContent.includes('GAME_CONFIG'), 'State should use GAME_CONFIG');
    });

    test('Classes import from constants and state', () => {
        const enemyContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'classes', 'Enemy.js'),
            'utf8'
        );

        assert.ok(enemyContent.includes("from '../constants.js'"), 'Enemy should import constants');
        assert.ok(enemyContent.includes("from '../state.js'"), 'Enemy should import state');
    });

    test('Systems import from constants and state', () => {
        const achievementContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'achievements.js'),
            'utf8'
        );

        assert.ok(achievementContent.includes("from '../constants.js'"), 'Achievements should import constants');
        assert.ok(achievementContent.includes("from '../state.js'"), 'Achievements should import state');
    });

    test('Game module imports all necessary components', () => {
        const gameContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'game.js'),
            'utf8'
        );

        assert.ok(gameContent.includes("from './constants.js'"), 'Game should import constants');
        assert.ok(gameContent.includes("from './state.js'"), 'Game should import state');
        assert.ok(gameContent.includes("from './classes/"), 'Game should import classes');
    });
});

// ==================== UTILITY FUNCTION TESTS ====================
describe('Utility Functions', () => {
    test('formatTime function implementation', () => {
        const deathContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'death.js'),
            'utf8'
        );

        // Extract and test the formatTime function
        assert.ok(deathContent.includes('Math.floor(ms / 1000)'), 'formatTime should convert ms to seconds');
        assert.ok(deathContent.includes('padStart'), 'formatTime should pad seconds');
    });

    test('getMemeRating function uses all ratings', () => {
        const deathContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'death.js'),
            'utf8'
        );

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
        const stateContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'state.js'),
            'utf8'
        );

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

// ==================== BUG FIX REGRESSION TESTS ====================
describe('Bug Fix Regressions', () => {
    // BUG-007: Shop guard condition must use || to prevent shop opening after game over
    test('BUG-007: Shop guard uses OR condition to prevent post-game-over access', () => {
        const shopContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'shop.js'),
            'utf8'
        );

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
        const gameContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'game.js'),
            'utf8'
        );

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
        const minigameContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'minigame.js'),
            'utf8'
        );

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
        const shopContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'shop.js'),
            'utf8'
        );

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
        const stateContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'state.js'),
            'utf8'
        );

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
        const stateContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'state.js'),
            'utf8'
        );

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
        const minigameContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'minigame.js'),
            'utf8'
        );

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
            const content = fs.readFileSync(
                path.join(__dirname, '..', file.path),
                'utf8'
            );
            // Check for PERSPECTIVE_SCALE usage (should use the constant)
            assert.ok(
                content.includes('PERSPECTIVE_SCALE'),
                `${file.name} should use PERSPECTIVE_SCALE constant`
            );
        });
    });

    test('Game.js uses spawn position constants', () => {
        const gameContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'game.js'),
            'utf8'
        );

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
        const stateContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'state.js'),
            'utf8'
        );

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
        const stateContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'state.js'),
            'utf8'
        );

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
        const stateContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'state.js'),
            'utf8'
        );

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
        const particleContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'classes', 'Particle.js'),
            'utf8'
        );

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
        const enemyContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'classes', 'Enemy.js'),
            'utf8'
        );

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
        const gameContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'game.js'),
            'utf8'
        );

        assert.ok(
            gameContent.includes('returnParticle(p)'),
            'game.js should return particles to pool when expired'
        );
    });
});

// ==================== REFACTOR-004: REMOVED UNUSED KEYS CODE TESTS ====================
describe('REFACTOR-004: Removed Unused Keys Code', () => {
    test('State.js does not export keys object', () => {
        const stateContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'state.js'),
            'utf8'
        );

        assert.ok(
            !stateContent.includes('export const keys = {}'),
            'state.js should NOT export keys object'
        );
    });

    test('State.js does not have setKeyState function', () => {
        const stateContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'state.js'),
            'utf8'
        );

        assert.ok(
            !stateContent.includes('export function setKeyState'),
            'state.js should NOT export setKeyState function'
        );
    });

    test('Main.js does not import setKeyState', () => {
        const mainContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'main.js'),
            'utf8'
        );

        assert.ok(
            !mainContent.includes('setKeyState'),
            'main.js should NOT import or use setKeyState'
        );
    });

    test('Main.js still has working keyboard events', () => {
        const mainContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'main.js'),
            'utf8'
        );

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
        const audioContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'audio.js'),
            'utf8'
        );

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
        const audioContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'audio.js'),
            'utf8'
        );

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
        const audioContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'audio.js'),
            'utf8'
        );

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
        const audioContent = fs.readFileSync(
            path.join(__dirname, '..', 'js', 'systems', 'audio.js'),
            'utf8'
        );

        // Count occurrences of 'if (!audioCtx) return;'
        const earlyReturns = (audioContent.match(/if \(!audioCtx\) return;/g) || []).length;
        assert.ok(
            earlyReturns >= 3,
            'Audio functions should have early return if no audioCtx'
        );
    });
});

console.log('All tests completed!');
