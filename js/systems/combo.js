/**
 * Dino Doom: Santa's Last Stand
 * Combo Counter System
 *
 * Tracks consecutive kills without taking damage.
 * Provides score multiplier and visual feedback.
 */

import { GAME_CONFIG } from '../constants.js';
import { comboState, trackTimeout } from '../state.js';
import { playSound } from './audio.js';

/**
 * Increments the combo counter when an enemy is killed
 * @returns {number} The current combo count
 */
export function incrementCombo() {
    comboState.count++;

    // Check for WOMBO COMBO threshold
    if (comboState.count >= GAME_CONFIG.WOMBO_COMBO_THRESHOLD && !comboState.showWomboCombo) {
        comboState.showWomboCombo = true;
        showWomboComboAnnouncement();
        playSound('achievement');
    } else if (comboState.count > 1) {
        // Play combo increase sound for combos 2+
        playSound('hit');
    }

    updateComboDisplay();
    return comboState.count;
}

/**
 * Gets the decay percentage based on current combo level
 * Higher combos are more forgiving
 * @returns {number} Decay percentage (0-100)
 */
export function getComboDecayPercent() {
    if (comboState.count >= GAME_CONFIG.COMBO_VERY_HIGH_THRESHOLD) {
        return GAME_CONFIG.COMBO_DECAY_VERY_HIGH_PERCENT;
    } else if (comboState.count >= GAME_CONFIG.COMBO_HIGH_THRESHOLD) {
        return GAME_CONFIG.COMBO_DECAY_HIGH_PERCENT;
    }
    return GAME_CONFIG.COMBO_DECAY_BASE_PERCENT;
}

/**
 * Checks if combo is protected by damage cooldown
 * Prevents rapid multi-hit combo breaks
 * @returns {boolean} True if combo is protected
 */
export function isComboProtected() {
    const now = Date.now();
    return (now - comboState.lastDamageTime) < GAME_CONFIG.COMBO_DAMAGE_COOLDOWN_MS;
}

/**
 * Applies decay to combo when player takes damage
 * Instead of full reset, reduces combo by a percentage
 * Higher combos decay more slowly
 */
export function breakCombo() {
    if (comboState.count <= 0) return;

    // Check damage cooldown - if recently hit, ignore this damage for combo
    if (isComboProtected()) {
        return;
    }

    // Update last damage time for cooldown
    comboState.lastDamageTime = Date.now();

    // Calculate decay based on current combo level
    const decayPercent = getComboDecayPercent();
    const comboLost = Math.ceil(comboState.count * decayPercent / 100);
    comboState.count = Math.max(0, comboState.count - comboLost);

    // Reset WOMBO COMBO flag if below threshold
    if (comboState.count < GAME_CONFIG.WOMBO_COMBO_THRESHOLD) {
        comboState.showWomboCombo = false;
    }

    updateComboDisplay();
}

/**
 * Calculates the score bonus multiplier based on current combo
 * @returns {number} Multiplier (1.0 = no bonus, 1.1 = 10% bonus, etc.)
 */
export function getComboMultiplier() {
    if (comboState.count <= 0) return 1;
    return 1 + (comboState.count * GAME_CONFIG.COMBO_MULTIPLIER_PERCENT / 100);
}

/**
 * Calculates bonus points from combo for a given base score
 * @param {number} basePoints - The base score before combo bonus
 * @returns {number} The bonus points from combo
 */
export function getComboBonus(basePoints) {
    const multiplier = getComboMultiplier();
    return Math.floor(basePoints * (multiplier - 1));
}

/**
 * Updates the combo counter display in the UI
 */
export function updateComboDisplay() {
    const comboContainer = document.getElementById('combo-counter');
    if (!comboContainer) return;

    if (comboState.count >= 2) {
        comboContainer.style.display = 'block';
        comboContainer.textContent = `COMBO x${comboState.count}`;

        // Add special styling for high combos
        if (comboState.count >= GAME_CONFIG.WOMBO_COMBO_THRESHOLD) {
            comboContainer.style.color = '#ff00ff';
            comboContainer.style.textShadow = '0 0 20px #ff00ff, 0 0 40px #ff00ff';
            comboContainer.classList.add('wombo-combo');
        } else if (comboState.count >= 5) {
            comboContainer.style.color = '#ffff00';
            comboContainer.style.textShadow = '0 0 15px #ffff00';
            comboContainer.classList.remove('wombo-combo');
        } else {
            comboContainer.style.color = '#00ff00';
            comboContainer.style.textShadow = '0 0 10px #00ff00';
            comboContainer.classList.remove('wombo-combo');
        }
    } else {
        comboContainer.style.display = 'none';
        comboContainer.classList.remove('wombo-combo');
    }
}

/**
 * Shows the WOMBO COMBO announcement
 */
export function showWomboComboAnnouncement() {
    // Remove any existing announcement
    const existing = document.querySelector('.wombo-combo-announcement');
    if (existing) existing.remove();

    const announcement = document.createElement('div');
    announcement.className = 'wombo-combo-announcement';
    announcement.innerHTML = '🔥 WOMBO COMBO! 🔥';
    announcement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        font-family: 'Bungee', cursive;
        font-size: 72px;
        color: #ff00ff;
        text-shadow: 0 0 30px #ff00ff, 0 0 60px #ff00ff, 0 0 90px #ff00ff;
        z-index: 1000;
        pointer-events: none;
        animation: womboComboAnim 1.5s ease-out forwards;
    `;

    const container = document.getElementById('game-container');
    if (container) {
        container.appendChild(announcement);
        const timeoutId = setTimeout(() => announcement.remove(), 1500);
        trackTimeout(timeoutId);
    }
}

/**
 * Gets the current combo count
 * @returns {number} Current combo count
 */
export function getComboCount() {
    return comboState.count;
}
