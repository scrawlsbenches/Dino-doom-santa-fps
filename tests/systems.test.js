/**
 * Tests for game systems
 * Audio, Effects, Achievements, Kill Streaks, Death, Shop, Skins, Boss, Minigame, Dialogue
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { readFile } from './test-helpers.js';

// ==================== SYSTEM TESTS ====================
describe('Audio System', () => {
    test('Audio system file exists and has correct structure', () => {
        const audioContent = readFile('js/systems/audio.js');

        assert.ok(audioContent.includes('export function initAudio'), 'Should export initAudio');
        assert.ok(audioContent.includes('export function playSound'), 'Should export playSound');
        assert.ok(audioContent.includes('AudioContext'), 'Should use Web Audio API');
    });

    test('Audio system handles multiple sound types', () => {
        const audioContent = readFile('js/systems/audio.js');

        const soundTypes = ['shoot', 'hit', 'kill', 'damage', 'boss', 'achievement'];
        soundTypes.forEach(type => {
            assert.ok(audioContent.includes(`'${type}'`) || audioContent.includes(`"${type}"`),
                `Should handle ${type} sound`);
        });
    });
});

describe('Effects System', () => {
    test('Effects system file exists and has correct structure', () => {
        const effectsContent = readFile('js/systems/effects.js');

        assert.ok(effectsContent.includes('export function showDamageOverlay'), 'Should export showDamageOverlay');
        assert.ok(effectsContent.includes('export function showHitMarker'), 'Should export showHitMarker');
        assert.ok(effectsContent.includes('shake') || effectsContent.includes('Shake'), 'Should have screen shake');
    });
});

describe('Achievement System', () => {
    test('Achievement system file exists and has correct structure', () => {
        const achievementContent = readFile('js/systems/achievements.js');

        assert.ok(achievementContent.includes('export function unlockAchievement'), 'Should export unlockAchievement');
        assert.ok(achievementContent.includes('export function checkKillAchievements'), 'Should export checkKillAchievements');
        assert.ok(achievementContent.includes('unlockedAchievements'), 'Should track unlocked achievements');
    });

    test('Achievement system checks for specific achievements', () => {
        const achievementContent = readFile('js/systems/achievements.js');

        assert.ok(achievementContent.includes('FIRST_BLOOD'), 'Should check FIRST_BLOOD');
        assert.ok(achievementContent.includes('BOSS_SLAYER'), 'Should check BOSS_SLAYER');
        assert.ok(achievementContent.includes('SKILL_ISSUE'), 'Should check SKILL_ISSUE');
    });
});

describe('Kill Streak System', () => {
    test('Kill streak system file exists and has correct structure', () => {
        const killstreakContent = readFile('js/systems/killstreak.js');

        assert.ok(killstreakContent.includes('export function recordKill'), 'Should export recordKill');
        assert.ok(killstreakContent.includes('export function showKillStreakAnnouncement'), 'Should export showKillStreakAnnouncement');
        assert.ok(killstreakContent.includes('KILL_STREAK_TIERS'), 'Should use KILL_STREAK_TIERS');
    });
});

describe('Death System', () => {
    test('Death system file exists and has correct structure', () => {
        const deathContent = readFile('js/systems/death.js');

        assert.ok(deathContent.includes('export function getMemeRating'), 'Should export getMemeRating');
        assert.ok(deathContent.includes('export function formatTime'), 'Should export formatTime');
        assert.ok(deathContent.includes('export function updateDeathScreen'), 'Should export updateDeathScreen');
        assert.ok(deathContent.includes('export function copyDeathReceipt'), 'Should export copyDeathReceipt');
    });

    test('Death system uses MEME_RATINGS correctly', () => {
        const deathContent = readFile('js/systems/death.js');

        assert.ok(deathContent.includes('MEME_RATINGS'), 'Should use MEME_RATINGS');
        assert.ok(deathContent.includes('LAST_WORDS'), 'Should use LAST_WORDS');
    });
});

describe('Shop System', () => {
    test('Shop system file exists and has correct structure', () => {
        const shopContent = readFile('js/systems/shop.js');

        assert.ok(shopContent.includes('export function openShop'), 'Should export openShop');
        assert.ok(shopContent.includes('WEAPONS'), 'Should use WEAPONS');
        assert.ok(shopContent.includes('UPGRADES'), 'Should use UPGRADES');
    });
});

describe('Skins System', () => {
    test('Skins system file exists and has correct structure', () => {
        const skinsContent = readFile('js/systems/skins.js');

        assert.ok(skinsContent.includes('export function initSkinSystem'), 'Should export initSkinSystem');
        assert.ok(skinsContent.includes('SANTA_SKINS'), 'Should use SANTA_SKINS');
        assert.ok(skinsContent.includes('skinState'), 'Should use skinState');
    });
});

describe('Boss System', () => {
    test('Boss system file exists and has correct structure', () => {
        const bossContent = readFile('js/systems/boss.js');

        assert.ok(bossContent.includes('export function getBossInfo'), 'Should export getBossInfo');
        assert.ok(bossContent.includes('export function playBossIntro'), 'Should export playBossIntro');
        assert.ok(bossContent.includes('export function spawnBoss'), 'Should export spawnBoss');
        assert.ok(bossContent.includes('BOSS_NAMES'), 'Should use BOSS_NAMES');
    });
});

describe('Minigame System', () => {
    test('Minigame system file exists and has correct structure', () => {
        const minigameContent = readFile('js/systems/minigame.js');

        assert.ok(minigameContent.includes('export function startMinigame'), 'Should export startMinigame');
        assert.ok(minigameContent.includes('export function endMinigame'), 'Should export endMinigame');
        assert.ok(minigameContent.includes('minigameState'), 'Should use minigameState');
    });
});

describe('Dialogue System', () => {
    test('Dialogue system file exists and has correct structure', () => {
        const dialogueContent = readFile('js/systems/dialogue.js');

        assert.ok(dialogueContent.includes('ENEMY_DIALOGUE'), 'Should use ENEMY_DIALOGUE');
    });
});

describe('Chat System', () => {
    test('Chat system file exists and has correct structure', () => {
        const chatContent = readFile('js/systems/chat.js');

        assert.ok(chatContent.includes('export function addChatMessage'), 'Should export addChatMessage');
        assert.ok(chatContent.includes('export function triggerChatEvent'), 'Should export triggerChatEvent');
        assert.ok(chatContent.includes('export function onChatKill'), 'Should export onChatKill');
        assert.ok(chatContent.includes('export function onChatDeath'), 'Should export onChatDeath');
        assert.ok(chatContent.includes('export function onChatBossSpawn'), 'Should export onChatBossSpawn');
        assert.ok(chatContent.includes('export function onChatWaveComplete'), 'Should export onChatWaveComplete');
        assert.ok(chatContent.includes('export function onChatBossKill'), 'Should export onChatBossKill');
        assert.ok(chatContent.includes('export function clearChat'), 'Should export clearChat');
        assert.ok(chatContent.includes('export function initChatSystem'), 'Should export initChatSystem');
    });

    test('Chat system uses Twitch chat constants', () => {
        const chatContent = readFile('js/systems/chat.js');

        assert.ok(chatContent.includes('TWITCH_CHAT_CONFIG'), 'Should use TWITCH_CHAT_CONFIG');
        assert.ok(chatContent.includes('TWITCH_CHAT_USERNAMES'), 'Should use TWITCH_CHAT_USERNAMES');
        assert.ok(chatContent.includes('TWITCH_CHAT_MESSAGES'), 'Should use TWITCH_CHAT_MESSAGES');
    });

    test('Chat system handles all event types', () => {
        const chatContent = readFile('js/systems/chat.js');

        // Check that all event types are handled
        assert.ok(chatContent.includes("'kill'") || chatContent.includes('"kill"'), 'Should handle kill events');
        assert.ok(chatContent.includes("'death'") || chatContent.includes('"death"'), 'Should handle death events');
        assert.ok(chatContent.includes("'bossSpawn'") || chatContent.includes('"bossSpawn"'), 'Should handle boss spawn events');
        assert.ok(chatContent.includes("'waveComplete'") || chatContent.includes('"waveComplete"'), 'Should handle wave complete events');
        assert.ok(chatContent.includes("'bossKill'") || chatContent.includes('"bossKill"'), 'Should handle boss kill events');
    });

    test('Chat system has enable/disable functionality', () => {
        const chatContent = readFile('js/systems/chat.js');

        assert.ok(chatContent.includes('export function setChatEnabled'), 'Should export setChatEnabled');
        assert.ok(chatContent.includes('export function isChatEnabled'), 'Should export isChatEnabled');
        assert.ok(chatContent.includes('chatState.enabled'), 'Should track enabled state');
    });
});
