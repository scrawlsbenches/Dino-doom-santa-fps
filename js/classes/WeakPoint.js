/**
 * Dino Doom: Santa's Last Stand
 * WeakPoint Class
 *
 * Shootable weak points that spawn during boss vulnerability phase.
 * Replaces the click-based minigame with FPS-consistent mechanics.
 */

import { GAME_CONFIG } from '../constants.js';
import { minigameState, floatingTexts, particles, getParticle } from '../state.js';

const { PERSPECTIVE_SCALE, PERSPECTIVE_MIN_Z } = GAME_CONFIG;

export class WeakPoint {
    /**
     * Creates a new weak point target
     * @param {number} x - Starting X position
     * @param {number} y - Starting Y position
     * @param {number} z - Starting Z position
     * @param {Object} callbacks - Callback functions for game events
     */
    constructor(x, y, z, callbacks = {}) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.callbacks = callbacks;

        this.size = 50;
        this.health = 1; // One-shot
        this.hitFlash = 0;
        this.markedForRemoval = false;
        this.wobble = Math.random() * Math.PI * 2;
        this.pulsePhase = Math.random() * Math.PI * 2;

        // Float animation
        this.floatPhase = Math.random() * Math.PI * 2;
        this.baseY = y;

        // Lifetime
        this.lifetime = GAME_CONFIG.MINIGAME_TARGET_LIFETIME;
        this.spawnTime = Date.now();
    }

    /**
     * Updates weak point state each frame
     */
    update() {
        // Float animation
        this.floatPhase += 0.1;
        this.y = this.baseY + Math.sin(this.floatPhase) * 15;

        // Wobble
        this.wobble += 0.05;
        this.pulsePhase += 0.15;

        // Check lifetime
        const elapsed = Date.now() - this.spawnTime;
        if (elapsed > this.lifetime) {
            this.markedForRemoval = true;
        }

        this.hitFlash = Math.max(0, this.hitFlash - 0.1);
    }

    /**
     * Takes damage from a hit
     * @param {number} _amount - Damage amount (unused, always one-shot)
     * @returns {boolean} Always true (always dies)
     */
    takeDamage(_amount) {
        this.hitFlash = 1;

        // Increment minigame hits
        minigameState.hits++;

        // Play hit sound
        if (this.callbacks.playSound) {
            this.callbacks.playSound('minigame_hit');
        }

        // Show hit marker
        if (this.callbacks.showHitMarker) {
            this.callbacks.showHitMarker(true); // Always "crit" style for emphasis
        }

        // Spawn particles
        for (let i = 0; i < 8; i++) {
            particles.push(getParticle(this.x, this.y, this.z, '#ff3333'));
        }

        // Floating text
        floatingTexts.push({
            text: `WEAK POINT! +${GAME_CONFIG.MINIGAME_DAMAGE_PER_HIT}`,
            x: this.x + (Math.random() - 0.5) * 30,
            y: this.y - 30,
            z: this.z,
            life: 50,
            color: '#ff3333'
        });

        // Update HUD
        this.updateMinigameHUD();

        this.health = 0;
        return true;
    }

    /**
     * Updates the minigame HUD display
     */
    updateMinigameHUD() {
        const hitsEl = document.getElementById('minigame-hits');
        if (hitsEl) {
            hitsEl.textContent = `HITS: ${minigameState.hits} | DAMAGE: ${minigameState.hits * GAME_CONFIG.MINIGAME_DAMAGE_PER_HIT}`;
        }
    }

    /**
     * Draws the weak point
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {Object} player - Player object for perspective
     */
    draw(ctx, canvas, player) {
        const screenX = canvas.width / 2 + (this.x - player.x) * (PERSPECTIVE_SCALE / Math.max(PERSPECTIVE_MIN_Z, -this.z));
        const screenY = canvas.height / 2 + this.y * (PERSPECTIVE_SCALE / Math.max(PERSPECTIVE_MIN_Z, -this.z));
        const scale = PERSPECTIVE_SCALE / Math.max(PERSPECTIVE_MIN_Z, -this.z);
        const size = this.size * scale;

        if (-this.z < 50 || -this.z > 2000) return;

        // Pulse effect
        const pulse = Math.sin(this.pulsePhase) * 0.2 + 1;
        const drawSize = size * pulse;

        // Lifetime indicator (fade when close to expiring)
        const elapsed = Date.now() - this.spawnTime;
        const remaining = this.lifetime - elapsed;
        const alpha = remaining < 500 ? remaining / 500 : 1;

        // Outer glow
        ctx.save();
        ctx.globalAlpha = alpha * 0.5;
        ctx.shadowColor = '#ff3333';
        ctx.shadowBlur = 30;

        // Main circle
        ctx.beginPath();
        ctx.arc(screenX, screenY, drawSize * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : `rgba(255, 50, 50, ${alpha})`;
        ctx.fill();

        // Inner circle
        ctx.beginPath();
        ctx.arc(screenX, screenY, drawSize * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 50, ${alpha})`;
        ctx.fill();

        // Center dot
        ctx.beginPath();
        ctx.arc(screenX, screenY, drawSize * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        ctx.shadowBlur = 0;

        // Target emoji
        ctx.globalAlpha = alpha;
        ctx.font = `${drawSize * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🎯', screenX, screenY);

        // "SHOOT ME!" text above
        ctx.font = `bold ${Math.max(10, drawSize * 0.25)}px Orbitron`;
        ctx.fillStyle = '#ffcc00';
        ctx.fillText('WEAK POINT', screenX, screenY - drawSize * 0.5 - 10);

        ctx.restore();
    }

    /**
     * Checks if weak point has expired
     * @returns {boolean} True if should be removed
     */
    isExpired() {
        return this.health <= 0 || this.markedForRemoval;
    }
}
