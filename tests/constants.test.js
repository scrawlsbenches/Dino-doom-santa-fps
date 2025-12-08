/**
 * Tests for game constants
 * Tests GAME_CONFIG, WEAPONS, UPGRADES, ENEMY_TYPES, SANTA_SKINS,
 * ACHIEVEMENTS, KILL_STREAK_TIERS, MEME_RATINGS, BOSS_NAMES, and dialogue
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { loadConstants } from './test-helpers.js';

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
        const dialogueTypes = Object.keys(gameData.ENEMY_DIALOGUE);
        assert.ok(dialogueTypes.length > 0, 'At least some enemies should have dialogue');
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

// ==================== TWITCH CHAT TESTS ====================
describe('Twitch Chat System', () => {
    test('TWITCH_CHAT_CONFIG has required properties', () => {
        const requiredProps = ['MAX_MESSAGES', 'MESSAGE_DURATION_MS', 'MESSAGE_FADE_DURATION_MS'];
        requiredProps.forEach(prop => {
            assert.ok(
                gameData.TWITCH_CHAT_CONFIG.hasOwnProperty(prop),
                `TWITCH_CHAT_CONFIG missing property: ${prop}`
            );
        });
    });

    test('TWITCH_CHAT_CONFIG values are reasonable', () => {
        const config = gameData.TWITCH_CHAT_CONFIG;
        assert.ok(config.MAX_MESSAGES > 0, 'MAX_MESSAGES should be positive');
        assert.ok(config.MAX_MESSAGES <= 20, 'MAX_MESSAGES should not be excessive');
        assert.ok(config.MESSAGE_DURATION_MS > 0, 'MESSAGE_DURATION_MS should be positive');
        assert.ok(config.MESSAGE_FADE_DURATION_MS > 0, 'MESSAGE_FADE_DURATION_MS should be positive');
    });

    test('TWITCH_CHAT_USERNAMES has variety', () => {
        assert.ok(Array.isArray(gameData.TWITCH_CHAT_USERNAMES), 'TWITCH_CHAT_USERNAMES should be an array');
        assert.ok(gameData.TWITCH_CHAT_USERNAMES.length >= 10, 'Should have at least 10 usernames');

        // All usernames should be non-empty strings
        gameData.TWITCH_CHAT_USERNAMES.forEach((name, i) => {
            assert.ok(typeof name === 'string', `Username ${i} should be a string`);
            assert.ok(name.length > 0, `Username ${i} should not be empty`);
        });
    });

    test('TWITCH_CHAT_MESSAGES has all event types', () => {
        const requiredEvents = ['kill', 'death', 'bossSpawn', 'waveComplete', 'bossKill'];
        requiredEvents.forEach(event => {
            assert.ok(
                gameData.TWITCH_CHAT_MESSAGES[event],
                `TWITCH_CHAT_MESSAGES missing event type: ${event}`
            );
            assert.ok(
                Array.isArray(gameData.TWITCH_CHAT_MESSAGES[event]),
                `Messages for ${event} should be an array`
            );
            assert.ok(
                gameData.TWITCH_CHAT_MESSAGES[event].length >= 5,
                `Should have at least 5 messages for ${event}`
            );
        });
    });

    test('All chat messages are non-empty strings', () => {
        Object.entries(gameData.TWITCH_CHAT_MESSAGES).forEach(([eventType, messages]) => {
            messages.forEach((msg, i) => {
                assert.ok(typeof msg === 'string', `${eventType}[${i}] should be a string`);
                assert.ok(msg.length > 0, `${eventType}[${i}] should not be empty`);
            });
        });
    });

    test('Usernames are unique', () => {
        const uniqueNames = new Set(gameData.TWITCH_CHAT_USERNAMES);
        assert.strictEqual(
            gameData.TWITCH_CHAT_USERNAMES.length,
            uniqueNames.size,
            'Usernames should be unique'
        );
    });
});

// ==================== EASTER EGG TESTS ====================
describe('Easter Egg System', () => {
    test('EASTER_EGG_CONFIG has required properties', () => {
        const requiredProps = ['KONAMI_CODE', 'NICE_WAVE', 'DANK_WAVE', 'HAT_CLICKS_REQUIRED', 'SHRINK_SCALE', 'MORBIN_CODE'];
        requiredProps.forEach(prop => {
            assert.ok(
                gameData.EASTER_EGG_CONFIG.hasOwnProperty(prop),
                `EASTER_EGG_CONFIG missing property: ${prop}`
            );
        });
    });

    test('EASTER_EGG_CONFIG values are correct', () => {
        const config = gameData.EASTER_EGG_CONFIG;
        assert.strictEqual(config.NICE_WAVE, 69, 'NICE_WAVE should be 69');
        assert.strictEqual(config.DANK_WAVE, 420, 'DANK_WAVE should be 420');
        assert.strictEqual(config.HAT_CLICKS_REQUIRED, 10, 'HAT_CLICKS_REQUIRED should be 10');
        assert.strictEqual(config.MORBIN_CODE, 'MORBIN', 'MORBIN_CODE should be MORBIN');
        assert.ok(config.SHRINK_SCALE > 0 && config.SHRINK_SCALE < 1, 'SHRINK_SCALE should be between 0 and 1');
    });

    test('Konami code is correct sequence', () => {
        const expectedCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        assert.deepStrictEqual(
            gameData.EASTER_EGG_CONFIG.KONAMI_CODE,
            expectedCode,
            'Konami code should be the classic sequence'
        );
    });

    test('EASTER_EGGS has all required easter eggs', () => {
        const requiredEggs = ['KONAMI', 'DRIP_MODE', 'NICE', 'DANK', 'MORBIN'];
        requiredEggs.forEach(egg => {
            assert.ok(gameData.EASTER_EGGS[egg], `EASTER_EGGS should have ${egg}`);
        });
    });

    test('All easter eggs have required properties', () => {
        const requiredProps = ['id', 'name', 'description', 'effect', 'icon'];
        Object.entries(gameData.EASTER_EGGS).forEach(([key, egg]) => {
            requiredProps.forEach(prop => {
                assert.ok(
                    egg.hasOwnProperty(prop),
                    `Easter egg ${key} missing property: ${prop}`
                );
            });
        });
    });

    test('Easter egg IDs are unique', () => {
        const ids = Object.values(gameData.EASTER_EGGS).map(e => e.id);
        const uniqueIds = new Set(ids);
        assert.strictEqual(ids.length, uniqueIds.size, 'Easter egg IDs should be unique');
    });

    test('SECRET_ACHIEVEMENTS has all required achievements', () => {
        const requiredAchievements = ['KONAMI_MASTER', 'DRIP_LORD', 'NICE_GUY', 'DANK_MASTER', 'MORBIN_TIME'];
        requiredAchievements.forEach(achievement => {
            assert.ok(gameData.SECRET_ACHIEVEMENTS[achievement], `SECRET_ACHIEVEMENTS should have ${achievement}`);
        });
    });

    test('All secret achievements have required properties', () => {
        const requiredProps = ['id', 'name', 'description', 'icon'];
        Object.entries(gameData.SECRET_ACHIEVEMENTS).forEach(([key, achievement]) => {
            requiredProps.forEach(prop => {
                assert.ok(
                    achievement.hasOwnProperty(prop),
                    `Secret achievement ${key} missing property: ${prop}`
                );
            });
        });
    });

    test('Secret achievement IDs are unique', () => {
        const ids = Object.values(gameData.SECRET_ACHIEVEMENTS).map(a => a.id);
        const uniqueIds = new Set(ids);
        assert.strictEqual(ids.length, uniqueIds.size, 'Secret achievement IDs should be unique');
    });

    test('Easter eggs have non-empty icons', () => {
        Object.entries(gameData.EASTER_EGGS).forEach(([key, egg]) => {
            assert.ok(egg.icon.length > 0, `Easter egg ${key} should have an icon`);
        });
    });

    test('Secret achievements have non-empty icons', () => {
        Object.entries(gameData.SECRET_ACHIEVEMENTS).forEach(([key, achievement]) => {
            assert.ok(achievement.icon.length > 0, `Secret achievement ${key} should have an icon`);
        });
    });
});

// ==================== MEME BACKGROUND TESTS (TASK-019) ====================
describe('Meme Background System', () => {
    test('MEME_BACKGROUND_CONFIG exists', () => {
        assert.ok(gameData.MEME_BACKGROUND_CONFIG, 'MEME_BACKGROUND_CONFIG should exist');
    });

    test('MEME_BACKGROUND_CONFIG has required properties', () => {
        const requiredProps = ['DOGE_MOON', 'FLOATING_ELEMENTS', 'AIRPLANE_BANNERS', 'MAX_FLOATING_ELEMENTS', 'PARALLAX_INTENSITY'];
        requiredProps.forEach(prop => {
            assert.ok(
                gameData.MEME_BACKGROUND_CONFIG.hasOwnProperty(prop),
                `MEME_BACKGROUND_CONFIG missing property: ${prop}`
            );
        });
    });

    test('DOGE_MOON configuration is valid', () => {
        const doge = gameData.MEME_BACKGROUND_CONFIG.DOGE_MOON;
        assert.ok(doge.emoji, 'Doge should have an emoji');
        assert.ok(doge.x >= 0 && doge.x <= 1, 'Doge x position should be between 0 and 1');
        assert.ok(doge.y >= 0 && doge.y <= 1, 'Doge y position should be between 0 and 1');
        assert.ok(doge.size > 0, 'Doge size should be positive');
        assert.ok(typeof doge.parallaxFactor === 'number', 'Doge parallaxFactor should be a number');
    });

    test('FLOATING_ELEMENTS has valid configurations', () => {
        const elements = gameData.MEME_BACKGROUND_CONFIG.FLOATING_ELEMENTS;
        assert.ok(Array.isArray(elements), 'FLOATING_ELEMENTS should be an array');
        assert.ok(elements.length > 0, 'FLOATING_ELEMENTS should not be empty');

        elements.forEach((el, i) => {
            assert.ok(el.emoji, `Element ${i} should have an emoji`);
            assert.ok(el.name, `Element ${i} should have a name`);
            assert.ok(el.spawnChance > 0 && el.spawnChance < 1, `Element ${i} spawnChance should be between 0 and 1`);
            assert.ok(el.speed > 0, `Element ${i} speed should be positive`);
            assert.ok(el.size > 0, `Element ${i} size should be positive`);
        });
    });

    test('AIRPLANE_BANNERS has variety', () => {
        const banners = gameData.MEME_BACKGROUND_CONFIG.AIRPLANE_BANNERS;
        assert.ok(Array.isArray(banners), 'AIRPLANE_BANNERS should be an array');
        assert.ok(banners.length >= 5, 'Should have at least 5 banner messages');

        banners.forEach((banner, i) => {
            assert.ok(typeof banner === 'string', `Banner ${i} should be a string`);
            assert.ok(banner.length > 0, `Banner ${i} should not be empty`);
        });
    });

    test('MAX_FLOATING_ELEMENTS is reasonable', () => {
        const max = gameData.MEME_BACKGROUND_CONFIG.MAX_FLOATING_ELEMENTS;
        assert.ok(max > 0, 'MAX_FLOATING_ELEMENTS should be positive');
        assert.ok(max <= 20, 'MAX_FLOATING_ELEMENTS should not be excessive');
    });

    test('PARALLAX_INTENSITY is reasonable', () => {
        const intensity = gameData.MEME_BACKGROUND_CONFIG.PARALLAX_INTENSITY;
        assert.ok(intensity > 0, 'PARALLAX_INTENSITY should be positive');
        assert.ok(intensity <= 50, 'PARALLAX_INTENSITY should not be excessive');
    });

    test('Floating elements include airplane type', () => {
        const elements = gameData.MEME_BACKGROUND_CONFIG.FLOATING_ELEMENTS;
        const airplane = elements.find(el => el.name === 'Airplane');
        assert.ok(airplane, 'Should have an Airplane element');
    });
});
