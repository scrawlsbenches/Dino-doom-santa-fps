/**
 * Dino Doom: Santa's Last Stand
 * Enemy Projectile Class
 *
 * Projectiles fired by bosses at the player.
 */

import { GAME_CONFIG } from '../constants.js';

const { PERSPECTIVE_SCALE, PERSPECTIVE_MIN_Z } = GAME_CONFIG;

export class EnemyProjectile {
    /**
     * Creates a new enemy projectile
     * @param {number} x - Starting X position
     * @param {number} y - Starting Y position
     * @param {number} z - Starting Z position
     * @param {number} damage - Damage amount
     * @param {boolean} isMeteor - TASK-020: Is this a meteor (falls from above)
     */
    constructor(x, y, z, damage, isMeteor = false) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.damage = damage;
        this.isMeteor = isMeteor;

        if (isMeteor) {
            // TASK-020: Meteor falls from above
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = 8; // Falls down
            this.vz = 8; // Also moves toward player
            this.life = 150;
            this.emoji = '☄️';
            this.color = '#ff6600';
            this.attackerName = 'Meteor';
        } else {
            this.vx = (Math.random() - 0.5) * 3; // Slight random spread
            this.vy = 0;
            this.vz = 15; // Moving toward player
            this.life = 120;
            this.emoji = '🔥';
            this.color = '#ff4400';
            this.attackerName = 'Boss Fireball';
        }
    }

    /**
     * Updates projectile position
     */
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        this.life--;
    }

    /**
     * Checks for collision with player
     * @param {Object} player - Player object
     * @returns {boolean} True if hit player
     */
    checkPlayerCollision(player) {
        if (this.z > -50) {
            const dx = Math.abs(this.x - player.x);
            if (dx < 80) {
                this.life = 0;
                return true;
            }
        }
        return false;
    }

    /**
     * Draws the projectile
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {HTMLCanvasElement} canvas - Canvas element
     */
    draw(ctx, canvas) {
        if (this.z > 0 || -this.z > 2000) return;

        const screenX = canvas.width / 2 + this.x * (PERSPECTIVE_SCALE / Math.max(PERSPECTIVE_MIN_Z, -this.z));
        const screenY = canvas.height / 2 + (this.y + 100) * (PERSPECTIVE_SCALE / Math.max(PERSPECTIVE_MIN_Z, -this.z));
        const scale = PERSPECTIVE_SCALE / Math.max(PERSPECTIVE_MIN_Z, -this.z);

        ctx.shadowColor = this.color;
        ctx.shadowBlur = 25;
        ctx.font = `${35 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, screenX, screenY);
        ctx.shadowBlur = 0;
    }

    /**
     * Checks if projectile is expired
     * @returns {boolean} True if should be removed
     */
    isExpired() {
        return this.life <= 0;
    }
}
