/**
 * Dino Doom: Santa's Last Stand
 * Kill Streak System
 *
 * Tracks multi-kills and shows announcements.
 */

import { KILL_STREAK_TIERS, GAME_CONFIG } from '../constants.js';
import { killStreakState } from '../state.js';
import { playKillStreakSound } from './audio.js';

/**
 * Records a kill and checks for kill streaks
 */
export function recordKill() {
    const now = Date.now();

    if (now - killStreakState.lastKillTime > killStreakState.streakTimeout) {
        killStreakState.count = 0;
    }

    killStreakState.count++;
    killStreakState.lastKillTime = now;

    const tier = KILL_STREAK_TIERS.slice().reverse().find(t => killStreakState.count >= t.count);
    if (tier && killStreakState.count === tier.count) {
        showKillStreakAnnouncement(tier);
        playKillStreakSound(tier.count);
    }
}

/**
 * Shows kill streak announcement on screen
 * @param {Object} tier - The streak tier object
 */
export function showKillStreakAnnouncement(tier) {
    const existing = document.querySelector('.kill-streak-announcement');
    if (existing) existing.remove();

    const announcement = document.createElement('div');
    announcement.className = 'kill-streak-announcement';
    announcement.textContent = tier.name;
    announcement.style.color = tier.color;
    announcement.style.textShadow = `0 0 20px ${tier.color}, 0 0 40px ${tier.color}`;

    document.getElementById('game-container').appendChild(announcement);

    setTimeout(() => announcement.remove(), 1500);
}
