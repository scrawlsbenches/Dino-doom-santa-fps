/**
 * Dino Doom: Santa's Last Stand
 * Particle Class
 *
 * Visual effect particles for explosions, hits, etc.
 */

import { GAME_CONFIG } from '../constants.js';

const { PERSPECTIVE_SCALE, PERSPECTIVE_MIN_Z } = GAME_CONFIG;

export class Particle {
    /**
     * Creates a new particle
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position (depth)
     * @param {string} color - Particle color
     */
    constructor(x, y, z, color) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10 - 5;
        this.vz = (Math.random() - 0.5) * 10;
        this.color = color;
        this.life = 30;
        this.maxLife = 30;
    }

    /**
     * Updates particle position and velocity
     */
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        this.vy += 0.3; // Gravity
        this.life--;
    }

    /**
     * Draws the particle on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {HTMLCanvasElement} canvas - Canvas element
     * @param {Object} _player - Player object for relative positioning (unused)
     */
    draw(ctx, canvas, _player) {
        const screenX = canvas.width / 2 + this.x * (PERSPECTIVE_SCALE / Math.max(PERSPECTIVE_MIN_Z, -this.z));
        const screenY = canvas.height / 2 + (this.y + 100) * (PERSPECTIVE_SCALE / Math.max(PERSPECTIVE_MIN_Z, -this.z));
        const scale = PERSPECTIVE_SCALE / Math.max(PERSPECTIVE_MIN_Z, -this.z);
        const alpha = this.life / this.maxLife;

        if (-this.z < 10) return;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(screenX, screenY, 5 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    /**
     * Checks if particle is expired
     * @returns {boolean} True if particle should be removed
     */
    isExpired() {
        return this.life <= 0;
    }

    /**
     * Resets particle for reuse from pool
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position (depth)
     * @param {string} color - Particle color
     */
    reset(x, y, z, color) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10 - 5;
        this.vz = (Math.random() - 0.5) * 10;
        this.color = color;
        this.life = 30;
        this.maxLife = 30;
    }
}
