/**
 * Dino Doom: Santa's Last Stand
 * Projectile Class
 *
 * Player-fired projectiles with collision detection.
 */

import { WEAPONS } from '../constants.js';
import { inventory, player, floatingTexts } from '../state.js';

export class Projectile {
    /**
     * Creates a new projectile
     * @param {number} x - Starting X position
     * @param {number} y - Starting Y position
     * @param {number} z - Starting Z position
     * @param {number} vx - X velocity
     * @param {number} vy - Y velocity
     * @param {number} vz - Z velocity
     */
    constructor(x, y, z, vx, vy, vz) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.vx = vx;
        this.vy = vy;
        this.vz = vz;
        this.life = 100;
        this.rotation = 0;

        const weapon = WEAPONS[inventory.currentWeapon];
        this.emoji = weapon.emoji;
        this.damage = weapon.damage + player.damage + (inventory.upgrades.damage * 10);
        this.color = weapon.color;
        this.weaponType = inventory.currentWeapon;
        this.special = weapon.special || null;
    }

    /**
     * Updates projectile position
     */
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        this.vy += 0.05; // Reduced gravity
        this.life--;

        // Spinning for moai
        if (this.special === 'moai') {
            this.rotation += 0.15;
        }
    }

    /**
     * Spawns skull trail for doot cannon
     */
    spawnSkullTrail() {
        if (this.special === 'doot' && this.life % 5 === 0) {
            floatingTexts.push({
                text: '💀',
                x: this.x + (Math.random() - 0.5) * 20,
                y: this.y + (Math.random() - 0.5) * 20,
                z: this.z,
                life: 30,
                color: '#ffffff'
            });
        }
    }

    /**
     * Shows "Yo, Angelo" effect for moai hits
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     */
    static showYoAngelo(x, y, z) {
        floatingTexts.push({
            text: 'Yo, Angelo 🗿',
            x: x + (Math.random() - 0.5) * 30,
            y: y,
            z: z,
            life: 60,
            color: '#8b7355'
        });
    }

    /**
     * Shows skeleton effect for doot kills
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     */
    static showSkeletonEffect(x, y, z) {
        floatingTexts.push({
            text: '💀',
            x: x,
            y: y - 30,
            z: z,
            life: 60,
            color: '#ffffff'
        });
        floatingTexts.push({
            text: 'DOOT!',
            x: x,
            y: y - 60,
            z: z,
            life: 45,
            color: '#daa520'
        });
    }

    /**
     * Draws the projectile
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {HTMLCanvasElement} canvas - Canvas element
     */
    draw(ctx, canvas) {
        const screenX = canvas.width / 2 + this.x * (400 / Math.max(100, -this.z));
        const screenY = canvas.height / 2 + (this.y + 100) * (400 / Math.max(100, -this.z));
        const scale = 400 / Math.max(100, -this.z);

        if (-this.z < 10) return;

        ctx.save();
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.font = `${30 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (this.special === 'moai') {
            ctx.translate(screenX, screenY);
            ctx.rotate(this.rotation);
            ctx.fillText(this.emoji, 0, 0);
        } else {
            ctx.fillText(this.emoji, screenX, screenY);
        }

        ctx.shadowBlur = 0;
        ctx.restore();
    }

    /**
     * Checks if projectile is expired
     * @returns {boolean} True if should be removed
     */
    isExpired() {
        return this.life <= 0;
    }
}
