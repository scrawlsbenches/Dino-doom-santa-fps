/**
 * Dino Doom: Santa's Last Stand
 * Gamer Projectile Class
 *
 * Slow-moving RGB projectile from Gamer Dino's "360 NO SCOPE" attack.
 */

export class GamerProjectile {
    /**
     * Creates a new gamer projectile
     * @param {number} x - Starting X position
     * @param {number} y - Starting Y position
     * @param {number} z - Starting Z position
     * @param {number} damage - Damage amount
     */
    constructor(x, y, z, damage) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.vx = (Math.random() - 0.5) * 2; // Slight spread
        this.vy = 0;
        this.vz = 8; // Slower than boss fireball
        this.damage = damage;
        this.life = 180; // Longer life for slow projectile
        this.emoji = '🎯';
        this.color = '#ff00ff';
        this.spin = 0;
        this.attackerName = '360 NO SCOPE';
    }

    /**
     * Updates projectile position and appearance
     */
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        this.spin += 0.15; // Spinning effect
        this.life--;

        // RGB color cycling
        const r = Math.sin(this.spin) * 127 + 128;
        const g = Math.sin(this.spin + 2.094) * 127 + 128;
        const b = Math.sin(this.spin + 4.189) * 127 + 128;
        this.color = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
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

        const screenX = canvas.width / 2 + this.x * (400 / Math.max(100, -this.z));
        const screenY = canvas.height / 2 + (this.y + 100) * (400 / Math.max(100, -this.z));
        const scale = 400 / Math.max(100, -this.z);

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(this.spin);
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 30;
        ctx.font = `${40 * scale}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, 0, 0);
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
