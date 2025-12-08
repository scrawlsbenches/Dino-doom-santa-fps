/**
 * Dino Doom: Santa's Last Stand
 * Boss System
 *
 * Boss intro cutscenes and battle mechanics.
 * UX-004: Added boss tutorial before first boss encounter.
 */

import { BOSS_NAMES, GAME_CONFIG } from '../constants.js';
import { gameState, trackTimeout, enemies } from '../state.js';
import { Enemy } from '../classes/Enemy.js';
import { playSound } from './audio.js';
import { onChatBossSpawn } from './chat.js';

// UX-004: Track if tutorial has been shown this session
let bossTutorialShown = false;

/**
 * Gets boss info for current wave
 * @param {number} wave - Current wave number
 * @returns {Object} Boss name, title, and emoji
 */
export function getBossInfo(wave) {
    if (BOSS_NAMES[wave]) {
        return BOSS_NAMES[wave];
    }

    const baseWaves = [5, 10, 15, 20, 25];
    const cycleIndex = Math.floor((wave - 1) / 5) % baseWaves.length;
    const baseWave = baseWaves[cycleIndex];
    const base = BOSS_NAMES[baseWave];
    return {
        name: base.name + ' MK' + Math.floor(wave / 25 + 1),
        title: base.title + ' (Ascended)',
        emoji: base.emoji
    };
}

/**
 * Plays boss intro cutscene
 * @param {Function} callback - Called when cutscene ends
 * @param {Object} callbacks - Enemy callback functions
 */
export function playBossIntro(callback, callbacks) {
    const bossInfo = getBossInfo(gameState.wave);

    const overlay = document.getElementById('boss-intro-overlay');
    const emoji = document.getElementById('boss-intro-emoji');
    const name = document.getElementById('boss-intro-name');
    const title = document.getElementById('boss-intro-title');
    const flash = document.getElementById('boss-intro-flash');

    if (!overlay || !emoji || !name || !title) {
        if (callback) callback(bossInfo, callbacks);
        return;
    }

    gameState.paused = true;

    emoji.className = '';
    name.className = '';
    title.className = '';
    if (flash) flash.className = '';

    emoji.textContent = bossInfo.emoji;
    name.textContent = bossInfo.name;
    title.textContent = `"${bossInfo.title}"`;

    overlay.classList.add('active');

    trackTimeout(setTimeout(() => {
        emoji.classList.add('slide-in');
    }, 300));

    trackTimeout(setTimeout(() => {
        name.classList.add('show');
    }, 800));

    trackTimeout(setTimeout(() => {
        title.classList.add('show');
    }, 1200));

    trackTimeout(setTimeout(() => {
        if (flash) flash.classList.add('flash');
    }, 2500));

    trackTimeout(setTimeout(() => {
        overlay.classList.remove('active');
        if (gameState.running) {
            gameState.paused = false;
            if (callback) callback(bossInfo, callbacks);
        }
    }, 3000));
}

/**
 * Spawns a boss after intro cutscene
 * @param {Object} callbacks - Enemy callback functions
 */
export function spawnBoss(callbacks) {
    playBossIntro((bossInfo, cbs) => {
        const boss = new Enemy('MINI_BOSS', 0, -1000, cbs);
        boss.health = GAME_CONFIG.BOSS_BASE_HEALTH + (gameState.wave * GAME_CONFIG.BOSS_HEALTH_PER_WAVE);
        boss.maxHealth = boss.health;
        boss.shootCooldown = 0;
        boss.customName = bossInfo.name;
        enemies.push(boss);

        gameState.bossActive = true;
        gameState.currentBoss = boss;

        const bossContainer = document.getElementById('boss-health-container');
        const bossName = document.getElementById('boss-name');
        const bossHealthBar = document.getElementById('boss-health-bar');
        if (bossContainer) bossContainer.style.display = 'block';
        if (bossName) bossName.textContent = `👑 ${bossInfo.name} 👑`;
        if (bossHealthBar) bossHealthBar.style.width = '100%';

        playSound('boss');

        // Twitch chat reaction to boss spawn
        onChatBossSpawn();
    }, callbacks);
}

/**
 * UX-004: Shows boss tutorial before first boss encounter
 * @param {Function} callback - Called when tutorial is dismissed
 */
export function showBossTutorial(callback) {
    const tutorial = document.getElementById('boss-tutorial');
    const btn = document.getElementById('boss-tutorial-btn');

    if (!tutorial || !btn) {
        if (callback) callback();
        return;
    }

    gameState.paused = true;
    tutorial.classList.add('visible');

    const handleClick = () => {
        tutorial.classList.remove('visible');
        gameState.paused = false;
        bossTutorialShown = true;
        btn.removeEventListener('click', handleClick);
        if (callback) callback();
    };

    btn.addEventListener('click', handleClick);
}

/**
 * UX-004: Checks if boss tutorial should be shown
 * @returns {boolean} True if tutorial should be shown
 */
export function shouldShowBossTutorial() {
    return gameState.wave === 5 && !bossTutorialShown;
}

/**
 * UX-004: Resets tutorial state (call on game restart)
 */
export function resetBossTutorial() {
    bossTutorialShown = false;
}
