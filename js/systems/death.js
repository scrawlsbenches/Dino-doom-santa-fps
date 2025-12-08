/**
 * Dino Doom: Santa's Last Stand
 * Death Screen System
 *
 * Game over screen with stats and meme ratings.
 */

import { MEME_RATINGS, LAST_WORDS } from '../constants.js';
import { gameState } from '../state.js';

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
}

/**
 * Copies death receipt to clipboard for sharing
 */
export function copyDeathReceipt() {
    const timeSurvived = Date.now() - gameState.startTime;
    const rating = getMemeRating(gameState.score);

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
╚══════════════════════════════════╝
🦖 DINO DOOM: Santa's Last Stand 🎅
    `.trim();

    navigator.clipboard.writeText(receipt).then(() => {
        const btn = document.getElementById('copy-receipt-btn');
        btn.textContent = '✓ COPIED!';
        setTimeout(() => btn.textContent = '📋 SHARE YOUR L', 2000);
    });
}
