/**
 * Dino Doom: Santa's Last Stand
 * Visual Effects System
 *
 * Screen shake, damage overlays, hit markers, etc.
 */

import { shakeState, mousePos } from '../state.js';
import { playHitMarkerSound } from './audio.js';

// ==================== SCREEN SHAKE ====================

/**
 * Triggers screen shake effect
 * @param {number} intensity - Pixels of max displacement
 * @param {number} duration - Duration in ms
 */
export function screenShake(intensity = 10, duration = 200) {
    if (intensity >= shakeState.intensity || !shakeState.active) {
        shakeState.intensity = intensity;
        shakeState.duration = duration;
        shakeState.startTime = Date.now();
        shakeState.active = true;
    }
}

/**
 * Updates and applies screen shake each frame
 */
export function updateScreenShake() {
    const container = document.getElementById('game-container');

    if (!shakeState.active) {
        container.style.transform = 'translate(0, 0)';
        return;
    }

    const elapsed = Date.now() - shakeState.startTime;
    const progress = elapsed / shakeState.duration;

    if (progress >= 1) {
        shakeState.active = false;
        shakeState.intensity = 0;
        container.style.transform = 'translate(0, 0)';
        return;
    }

    const currentIntensity = shakeState.intensity * (1 - progress);
    const offsetX = (Math.random() - 0.5) * 2 * currentIntensity;
    const offsetY = (Math.random() - 0.5) * 2 * currentIntensity;

    container.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}

// Preset shake functions
export function shakeOnDamage() { screenShake(15, 300); }
export function shakeOnKill() { screenShake(5, 150); }
export function shakeOnCrit() { screenShake(8, 200); }
export function shakeOnBossSlam() { screenShake(25, 400); }
export function shakeOnBossDeath() { screenShake(30, 500); }

// ==================== HIT MARKERS ====================

/**
 * Creates a hit marker at the crosshair position
 * @param {boolean} isCrit - Whether this was a critical hit
 */
export function showHitMarker(isCrit = false) {
    const marker = document.createElement('div');
    marker.className = 'hit-marker' + (isCrit ? ' crit' : '');
    marker.style.left = mousePos.x + 'px';
    marker.style.top = mousePos.y + 'px';

    document.getElementById('game-container').appendChild(marker);
    playHitMarkerSound(isCrit);

    setTimeout(() => marker.remove(), 200);
}

// ==================== DAMAGE OVERLAY ====================

/**
 * Shows the damage overlay flash effect
 */
export function showDamageOverlay() {
    const overlay = document.getElementById('damage-overlay');
    overlay.style.opacity = '0.7';
    setTimeout(() => overlay.style.opacity = '0', 200);
}

/**
 * Shows healing overlay effect
 */
export function showHealOverlay() {
    const overlay = document.getElementById('damage-overlay');
    overlay.style.background = 'radial-gradient(ellipse at center, rgba(0,255,0,0.4) 0%, transparent 70%)';
    overlay.style.opacity = '1';
    setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.background = 'radial-gradient(ellipse at center, transparent 50%, rgba(255,0,0,0.5) 100%)';
    }, 300);
}

// ==================== MUZZLE FLASH ====================

/**
 * Shows muzzle flash effect
 */
export function showMuzzleFlash() {
    const flash = document.getElementById('muzzle-flash');
    flash.style.opacity = '1';
    setTimeout(() => flash.style.opacity = '0', 50);
}

// ==================== WAVE ANNOUNCEMENT ====================

/**
 * Shows wave announcement on screen
 * @param {number} wave - Wave number
 * @param {boolean} isBoss - Whether this is a boss wave
 */
export function showWaveAnnouncement(wave, isBoss = false) {
    const announcement = document.getElementById('wave-announcement');
    announcement.innerHTML = isBoss
        ? `⚠️ BOSS WAVE ${wave} ⚠️<br><span style="font-size: 36px;">PREPARE FOR BATTLE!</span>`
        : `WAVE ${wave}`;
    announcement.style.color = isBoss ? '#ff0000' : '#ffcc00';
    announcement.style.opacity = '1';
    announcement.style.transform = 'translate(-50%, -50%) scale(1.5)';

    setTimeout(() => {
        announcement.style.opacity = '0';
        announcement.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 2000);
}
