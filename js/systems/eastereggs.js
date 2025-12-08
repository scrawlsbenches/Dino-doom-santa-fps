/**
 * Dino Doom: Santa's Last Stand
 * Easter Egg System
 *
 * Hidden secrets and effects for the dedicated players.
 */

import { EASTER_EGG_CONFIG, EASTER_EGGS, SECRET_ACHIEVEMENTS } from '../constants.js';
import {
    easterEggState, discoverEasterEgg, isEasterEggDiscovered,
    loadEasterEggState, skinState, saveSkinState
} from '../state.js';
import { playSound } from './audio.js';
import { showAchievementToast } from './achievements.js';

/**
 * Initializes the easter egg system
 */
export function initEasterEggSystem() {
    loadEasterEggState();
    setupHatClickListener();
}

/**
 * Sets up click listener for Santa's hat on start screen
 */
function setupHatClickListener() {
    // We'll add a clickable element for Santa's hat
    const startScreen = document.getElementById('start-screen');
    if (!startScreen) return;

    // Find or create the hat element
    let hatElement = document.getElementById('santa-hat-easter');
    if (!hatElement) {
        hatElement = document.createElement('div');
        hatElement.id = 'santa-hat-easter';
        hatElement.innerHTML = '🎅';
        hatElement.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 60px;
            cursor: pointer;
            user-select: none;
            transition: transform 0.1s;
            z-index: 100;
        `;
        startScreen.appendChild(hatElement);
    }

    hatElement.addEventListener('click', handleHatClick);
}

/**
 * Handles clicking on Santa's hat
 */
function handleHatClick() {
    if (easterEggState.dripModeUnlocked) return;

    easterEggState.hatClickCount++;

    const hatElement = document.getElementById('santa-hat-easter');
    if (hatElement) {
        hatElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            hatElement.style.transform = 'scale(1)';
        }, 100);
    }

    // Play a subtle click sound
    playSound('click');

    if (easterEggState.hatClickCount >= EASTER_EGG_CONFIG.HAT_CLICKS_REQUIRED) {
        activateDripMode();
    }
}

/**
 * Activates DRIP MODE easter egg
 */
function activateDripMode() {
    if (easterEggState.dripModeUnlocked) return;

    easterEggState.dripModeUnlocked = true;
    discoverEasterEgg('drip_mode');

    // Unlock the drip skin if not already owned
    if (!skinState.owned.includes('drip')) {
        skinState.owned.push('drip');
        saveSkinState();
    }

    // Show easter egg notification
    showEasterEggNotification(EASTER_EGGS.DRIP_MODE);
    showSecretAchievement(SECRET_ACHIEVEMENTS.DRIP_LORD);

    // Visual feedback
    const hatElement = document.getElementById('santa-hat-easter');
    if (hatElement) {
        hatElement.innerHTML = '💎🎅💎';
        hatElement.style.animation = 'dripUnlock 1s ease-in-out';
    }
}

/**
 * Handles keydown for Konami code detection
 * @param {KeyboardEvent} e - Keyboard event
 * @returns {boolean} True if code was completed
 */
export function handleKonamiCode(e) {
    const expectedKey = EASTER_EGG_CONFIG.KONAMI_CODE[easterEggState.konamiProgress];

    // Use code for arrow keys, key for letters
    const pressedKey = e.code || e.key;

    if (pressedKey === expectedKey) {
        easterEggState.konamiProgress++;

        if (easterEggState.konamiProgress === EASTER_EGG_CONFIG.KONAMI_CODE.length) {
            activateKonamiCode();
            easterEggState.konamiProgress = 0;
            return true;
        }
    } else {
        // Reset progress on wrong key
        easterEggState.konamiProgress = 0;
    }

    return false;
}

/**
 * Activates the Konami code easter egg
 */
function activateKonamiCode() {
    easterEggState.activeEffects.shrinkEnemies = true;
    discoverEasterEgg('konami');

    showEasterEggNotification(EASTER_EGGS.KONAMI);

    // Only show achievement first time
    if (!isEasterEggDiscovered('konami_achievement')) {
        discoverEasterEgg('konami_achievement');
        showSecretAchievement(SECRET_ACHIEVEMENTS.KONAMI_MASTER);
    }

    playSound('achievement');
}

/**
 * Handles character input for MORBIN code
 * @param {string} char - Character typed
 * @returns {boolean} True if code was completed
 */
export function handleMorbinCode(char) {
    const upperChar = char.toUpperCase();

    // Check if character matches next expected character
    const expectedIndex = easterEggState.morbinProgress.length;
    if (EASTER_EGG_CONFIG.MORBIN_CODE[expectedIndex] === upperChar) {
        easterEggState.morbinProgress += upperChar;

        if (easterEggState.morbinProgress === EASTER_EGG_CONFIG.MORBIN_CODE) {
            activateMorbinMode();
            easterEggState.morbinProgress = '';
            return true;
        }
    } else if (EASTER_EGG_CONFIG.MORBIN_CODE[0] === upperChar) {
        // Start over if first character matches
        easterEggState.morbinProgress = upperChar;
    } else {
        easterEggState.morbinProgress = '';
    }

    return false;
}

/**
 * Activates MORBIN mode (bat enemies)
 */
function activateMorbinMode() {
    easterEggState.activeEffects.batMode = true;
    discoverEasterEgg('morbin');

    showEasterEggNotification(EASTER_EGGS.MORBIN);

    // Only show achievement first time
    if (!isEasterEggDiscovered('morbin_achievement')) {
        discoverEasterEgg('morbin_achievement');
        showSecretAchievement(SECRET_ACHIEVEMENTS.MORBIN_TIME);
    }

    playSound('achievement');

    // Show special announcement
    showMorbinAnnouncement();
}

/**
 * Shows "IT'S MORBIN' TIME" announcement
 */
function showMorbinAnnouncement() {
    const announcement = document.createElement('div');
    announcement.className = 'morbin-announcement';
    announcement.innerHTML = `
        <div class="morbin-text">🦇 IT'S MORBIN' TIME 🦇</div>
    `;
    document.body.appendChild(announcement);

    setTimeout(() => {
        announcement.classList.add('fade-out');
        setTimeout(() => announcement.remove(), 500);
    }, 2000);
}

/**
 * Checks for wave-based easter eggs (wave 69, 420)
 * @param {number} wave - Current wave number
 */
export function checkWaveEasterEggs(wave) {
    if (wave === EASTER_EGG_CONFIG.NICE_WAVE) {
        activateNiceEasterEgg();
    } else if (wave === EASTER_EGG_CONFIG.DANK_WAVE) {
        activateDankEasterEgg();
    }
}

/**
 * Activates Wave 69 "Nice." easter egg
 */
function activateNiceEasterEgg() {
    discoverEasterEgg('nice');

    showEasterEggNotification(EASTER_EGGS.NICE);

    // Only show achievement first time
    if (!isEasterEggDiscovered('nice_achievement')) {
        discoverEasterEgg('nice_achievement');
        showSecretAchievement(SECRET_ACHIEVEMENTS.NICE_GUY);
    }

    // Show "Nice." text on screen
    showNiceAnnouncement();
}

/**
 * Shows "Nice." announcement for wave 69
 */
function showNiceAnnouncement() {
    const announcement = document.createElement('div');
    announcement.className = 'nice-announcement';
    announcement.innerHTML = '<div class="nice-text">Nice.</div>';
    document.body.appendChild(announcement);

    setTimeout(() => {
        announcement.classList.add('fade-out');
        setTimeout(() => announcement.remove(), 500);
    }, 2500);
}

/**
 * Activates Wave 420 "Dank" easter egg
 */
function activateDankEasterEgg() {
    discoverEasterEgg('dank');

    showEasterEggNotification(EASTER_EGGS.DANK);

    // Only show achievement first time
    if (!isEasterEggDiscovered('dank_achievement')) {
        discoverEasterEgg('dank_achievement');
        showSecretAchievement(SECRET_ACHIEVEMENTS.DANK_MASTER);
    }

    // Show dank effects
    showDankEffects();
}

/**
 * Shows green screen flash and "Dank" text for wave 420
 */
function showDankEffects() {
    // Green screen flash
    const flash = document.createElement('div');
    flash.className = 'dank-flash';
    document.body.appendChild(flash);

    // "Dank" text
    const announcement = document.createElement('div');
    announcement.className = 'dank-announcement';
    announcement.innerHTML = `
        <div class="dank-text">🌿 DANK 🌿</div>
        <div class="dank-subtext">Wave 420 - Legendary Status</div>
    `;
    document.body.appendChild(announcement);

    setTimeout(() => {
        flash.remove();
        announcement.classList.add('fade-out');
        setTimeout(() => announcement.remove(), 500);
    }, 3000);
}

/**
 * Shows easter egg notification toast
 * @param {Object} egg - Easter egg object
 */
function showEasterEggNotification(egg) {
    const container = document.getElementById('achievement-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'easter-egg-toast';
    toast.innerHTML = `
        <div class="easter-egg-icon">${egg.icon}</div>
        <div class="easter-egg-content">
            <div class="easter-egg-title">🥚 EASTER EGG FOUND!</div>
            <div class="easter-egg-name">${egg.name}</div>
            <div class="easter-egg-effect">${egg.effect}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

/**
 * Shows secret achievement unlock
 * @param {Object} achievement - Secret achievement object
 */
function showSecretAchievement(achievement) {
    showAchievementToast({
        ...achievement,
        name: `🔒 SECRET: ${achievement.name}`
    });
}

/**
 * Applies shrink effect to enemy if Konami code is active
 * @param {Object} enemy - Enemy object to potentially shrink
 */
export function applyEasterEggEffectsToEnemy(enemy) {
    if (easterEggState.activeEffects.shrinkEnemies) {
        enemy.size *= EASTER_EGG_CONFIG.SHRINK_SCALE;
        enemy.shrunk = true;
    }

    if (easterEggState.activeEffects.batMode) {
        enemy.batMode = true;
        enemy.originalEmoji = enemy.emoji;
        enemy.emoji = '🦇';
    }
}

/**
 * Gets the enemy display emoji (may be overridden by easter eggs)
 * @param {Object} enemy - Enemy object
 * @returns {string} Emoji to display
 */
export function getEnemyDisplayEmoji(enemy) {
    if (enemy.batMode) {
        return '🦇';
    }
    return enemy.emoji;
}

/**
 * Checks if shrink effect is active
 * @returns {boolean} True if enemies should be shrunk
 */
export function isShrinkEffectActive() {
    return easterEggState.activeEffects.shrinkEnemies;
}

/**
 * Checks if bat mode is active
 * @returns {boolean} True if enemies should be bats
 */
export function isBatModeActive() {
    return easterEggState.activeEffects.batMode;
}

/**
 * Checks if DRIP MODE is unlocked
 * @returns {boolean} True if drip mode is unlocked
 */
export function isDripModeUnlocked() {
    return easterEggState.dripModeUnlocked;
}
