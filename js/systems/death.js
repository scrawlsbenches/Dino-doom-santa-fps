/**
 * Dino Doom: Santa's Last Stand
 * Death Screen System
 *
 * Game over screen with stats and meme ratings.
 */

import { MEME_RATINGS, LAST_WORDS, DEATH_TIPS } from '../constants.js';
import { gameState, damageHistory } from '../state.js';

/**
 * Gets meme rating based on score
 * @param {number} score - Player's score
 * @returns {Object} Rating object with rating and color
 */
export function getMemeRating(score) {
    let rating = MEME_RATINGS[0];
    for (const r of MEME_RATINGS) {
        if (score >= r.minScore) rating = r;
    }
    return rating;
}

/**
 * Gets random last words
 * @returns {string} Random last words quote
 */
export function getRandomLastWords() {
    return LAST_WORDS[Math.floor(Math.random() * LAST_WORDS.length)];
}

/**
 * Formats time as M:SS
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted time string
 */
export function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Gets the enemy type that dealt the most damage this run
 * @returns {string|null} Enemy type name or null if no damage tracked
 */
export function getMostDamagingEnemy() {
    const damages = damageHistory.byEnemyType;
    let maxDamage = 0;
    let maxEnemy = null;

    for (const [enemy, damage] of Object.entries(damages)) {
        if (damage > maxDamage) {
            maxDamage = damage;
            maxEnemy = enemy;
        }
    }

    return maxEnemy;
}

/**
 * Gets the wave category for tip selection
 * @param {number} wave - Current wave number
 * @returns {string} Wave category: 'early', 'mid', 'late', or 'boss'
 */
export function getWaveCategory(wave) {
    // Boss waves are every 5 waves
    if (wave % 5 === 0 && wave > 0) {
        return 'boss';
    }
    if (wave <= 3) {
        return 'early';
    }
    if (wave <= 7) {
        return 'mid';
    }
    return 'late';
}

/**
 * Generates a context-aware death tip based on how the player died (UX-008)
 * @returns {string} A helpful tip for the player
 */
export function generateDeathTip() {
    const killer = gameState.lastAttacker;
    const wave = gameState.wave;
    const mostDamaging = getMostDamagingEnemy();
    const waveCategory = getWaveCategory(wave);

    // Priority 1: Specific tip based on what killed the player
    if (killer && DEATH_TIPS.byKiller[killer]) {
        const tips = DEATH_TIPS.byKiller[killer];
        return tips[Math.floor(Math.random() * tips.length)];
    }

    // Priority 2: Tip based on enemy that dealt the most damage
    if (mostDamaging && DEATH_TIPS.byMostDamage[mostDamaging]) {
        const tips = DEATH_TIPS.byMostDamage[mostDamaging];
        return tips[Math.floor(Math.random() * tips.length)];
    }

    // Priority 3: Tip based on wave category
    if (DEATH_TIPS.byWave[waveCategory]) {
        const tips = DEATH_TIPS.byWave[waveCategory];
        return tips[Math.floor(Math.random() * tips.length)];
    }

    // Fallback: Generic tip
    return DEATH_TIPS.generic[Math.floor(Math.random() * DEATH_TIPS.generic.length)];
}

/**
 * Generates a damage summary string showing hits by enemy type
 * @returns {string} Summary of damage taken
 */
export function getDamageSummary() {
    const hits = damageHistory.hitsByEnemyType;
    const entries = Object.entries(hits).sort((a, b) => b[1] - a[1]);

    if (entries.length === 0) {
        return '';
    }

    // Get top 2 enemy types that hit the player most
    const top = entries.slice(0, 2);
    return top.map(([enemy, count]) => `${enemy}: ${count}x`).join(', ');
}

/**
 * Updates the death screen with current stats
 */
export function updateDeathScreen() {
    const timeSurvived = Date.now() - gameState.startTime;
    const rating = getMemeRating(gameState.score);

    document.getElementById('stat-waves').textContent = gameState.wave;
    document.getElementById('stat-kills').textContent = gameState.kills;
    document.getElementById('stat-score').textContent = gameState.score.toLocaleString();
    document.getElementById('stat-coins').textContent = gameState.totalCoinsEarned;
    document.getElementById('stat-time').textContent = formatTime(timeSurvived);
    document.getElementById('stat-cause').textContent = gameState.lastAttacker;

    const ratingEl = document.getElementById('stat-rating');
    ratingEl.textContent = rating.rating;
    ratingEl.style.color = rating.color;
    ratingEl.style.textShadow = `0 0 15px ${rating.color}`;

    document.getElementById('stat-lastwords').textContent = getRandomLastWords();

    // UX-008: Add context-aware death tip
    const tipEl = document.getElementById('stat-tip');
    if (tipEl) {
        tipEl.textContent = generateDeathTip();
    }

    // UX-008: Add damage summary (optional display)
    const summaryEl = document.getElementById('stat-damage-summary');
    if (summaryEl) {
        const summary = getDamageSummary();
        if (summary) {
            summaryEl.textContent = summary;
            summaryEl.parentElement.style.display = 'block';
        } else {
            summaryEl.parentElement.style.display = 'none';
        }
    }
}

/**
 * Copies death receipt to clipboard for sharing
 */
export function copyDeathReceipt() {
    const timeSurvived = Date.now() - gameState.startTime;
    const rating = getMemeRating(gameState.score);
    const tip = generateDeathTip();

    const receipt = `
╔══════════════════════════════════╗
║   💀 SKILL ISSUE DETECTED 💀      ║
║      DINO DOOM - DEATH RECEIPT   ║
╠══════════════════════════════════╣
║ Waves Survived:    ${String(gameState.wave).padStart(14)} ║
║ Dinos Eliminated:  ${String(gameState.kills).padStart(14)} ║
║ Final Score:       ${String(gameState.score.toLocaleString()).padStart(14)} ║
║ Coins Earned:      ${String(gameState.totalCoinsEarned).padStart(14)} ║
║ Time Survived:     ${formatTime(timeSurvived).padStart(14)} ║
║ Cause of Death:    ${gameState.lastAttacker.padStart(14)} ║
╠══════════════════════════════════╣
║ Rating: ${rating.rating.padEnd(24)} ║
╠══════════════════════════════════╣
║ 💡 TIP: ${tip.substring(0, 24).padEnd(24)} ║
╚══════════════════════════════════╝
🦖 DINO DOOM: Santa's Last Stand 🎅
    `.trim();

    navigator.clipboard.writeText(receipt).then(() => {
        const btn = document.getElementById('copy-receipt-btn');
        btn.textContent = '✓ COPIED!';
        setTimeout(() => btn.textContent = '📋 SHARE YOUR L', 2000);
    });
}
