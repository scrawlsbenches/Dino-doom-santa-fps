/**
 * Dino Doom: Santa's Last Stand
 * Achievement System
 *
 * Tracks and displays achievement unlocks.
 */

import { ACHIEVEMENTS, GAME_CONFIG } from '../constants.js';
import { unlockedAchievements, achievementTracking, gameState } from '../state.js';
import { playSound, playAirhorn, playWowSound } from './audio.js';

/**
 * Unlocks an achievement and shows toast
 * @param {string} achievementKey - Key from ACHIEVEMENTS object
 */
export function unlockAchievement(achievementKey) {
    const achievement = ACHIEVEMENTS[achievementKey];
    if (!achievement) return;

    if (unlockedAchievements.has(achievement.id)) return;

    unlockedAchievements.add(achievement.id);
    showAchievementToast(achievement);
    playSound('achievement');
}

/**
 * Shows achievement toast notification
 * @param {Object} achievement - Achievement object
 */
export function showAchievementToast(achievement) {
    const container = document.getElementById('achievement-container');

    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-content">
            <div class="achievement-title">🏆 ACHIEVEMENT UNLOCKED</div>
            <div class="achievement-name">${achievement.name}</div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 500);
    }, GAME_CONFIG.ACHIEVEMENT_TOAST_DURATION_MS);
}

/**
 * Called at start of each wave
 */
export function onWaveStart() {
    achievementTracking.waveStartHealth = gameState.health;
}

/**
 * Called when wave is completed
 */
export function onWaveComplete() {
    // MLG Sound Pack - Airhorn on wave complete
    playAirhorn();

    // WAVE SURVIVOR - no damage taken this wave
    if (gameState.health === achievementTracking.waveStartHealth) {
        unlockAchievement('WAVE_SURVIVOR');
    }

    // IS THIS EASY MODE? - Reach wave 10 without ever taking damage
    if (gameState.wave >= 10 && achievementTracking.totalDamageTaken === 0) {
        unlockAchievement('EASY_MODE');
    }
}

/**
 * Checks death-related achievements on enemy kill
 * @param {Object} enemy - The enemy that was killed
 */
export function checkKillAchievements(enemy) {
    // FIRST_BLOOD - First kill
    if (gameState.kills === 1) {
        unlockAchievement('FIRST_BLOOD');
    }

    // BOSS_SLAYER - Defeat first boss
    if (enemy.isBoss) {
        unlockAchievement('BOSS_SLAYER');
        // MLG Sound Pack - "WOW" sound for boss defeat
        playWowSound();
    }

    // BUILT_DIFFERENT - One-shot a Gigachad
    if (enemy.type === 'GIGACHAD' && enemy.wasOneShot) {
        unlockAchievement('BUILT_DIFFERENT');
    }
}

/**
 * Checks for SKILL_ISSUE achievement (die on wave 1)
 */
export function checkDeathAchievements() {
    if (gameState.wave === 1) {
        unlockAchievement('SKILL_ISSUE');
    }
}

/**
 * Checks for BIG_SPENDER achievement
 * @param {number} spent - Amount spent this shop visit
 */
export function checkShopAchievements(spent) {
    achievementTracking.shopSpending += spent;
    if (achievementTracking.shopSpending >= 1000) {
        unlockAchievement('BIG_SPENDER');
    }
}

/**
 * Checks for MEME_LORD achievement (use Moai Cannon)
 * @param {string} weaponSpecial - Special property of weapon
 */
export function checkWeaponAchievements(weaponSpecial) {
    if (weaponSpecial === 'moai') {
        unlockAchievement('MEME_LORD');
    }
}
