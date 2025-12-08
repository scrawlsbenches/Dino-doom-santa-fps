/**
 * Dino Doom: Santa's Last Stand
 * Enemy Class
 *
 * Base enemy class for all enemy types including bosses.
 */

import { ENEMY_TYPES, GAME_CONFIG } from '../constants.js';
import {
    gameState, player, particles, floatingTexts, enemyProjectiles,
    achievementTracking, skinState, saveSkinState, getParticle, recordDamage
} from '../state.js';

const { PERSPECTIVE_SCALE, PERSPECTIVE_MIN_Z } = GAME_CONFIG;
import { EnemyProjectile } from './EnemyProjectile.js';
import { GamerProjectile } from './GamerProjectile.js';

export class Enemy {
    /**
     * Creates a new enemy
     * @param {string} type - Enemy type key from ENEMY_TYPES
     * @param {number} x - Starting X position
     * @param {number} z - Starting Z position
     * @param {Object} callbacks - Callback functions for game events
     */
    constructor(type, x, z, callbacks = {}) {
        const template = ENEMY_TYPES[type];
        this.type = type;
        this.name = template.name;
        this.emoji = template.emoji;
        this.health = template.health + (gameState.wave * GAME_CONFIG.ENEMY_HEALTH_PER_WAVE);
        this.maxHealth = this.health;
        this.damage = template.damage;
        this.speed = template.speed;
        this.size = template.size;
        this.color = template.color;
        this.points = template.points;
        this.coins = template.coins;
        this.traits = template.traits;
        this.isBoss = template.isBoss || false;

        this.x = x;
        this.y = 0;
        this.z = z;

        this.wobble = 0;
        this.attackCooldown = 0;
        this.hitFlash = 0;
        this.invulnerable = false;
        this.hitCount = 0;
        this.wasOneShot = true;
        this.markedForRemoval = false;

        // Callbacks for game events
        this.callbacks = callbacks;

        // Gamer Dino specific
        this.isGamer = template.isGamer || false;
        this.deathMessages = template.deathMessages || null;
        if (this.isGamer) {
            this.rgbPhase = Math.random() * Math.PI * 2;
            this.rangedCooldown = GAME_CONFIG.GAMER_RANGED_COOLDOWN;
            this.shootCooldown = 0;
        }

        // Sigma Dino specific
        this.isSigma = template.isSigma || false;
        if (this.isSigma) {
            this.sigmaDirection = x > 0 ? -1 : 1;
            this.sigmaPhase = 0;
            this.sigmaDialogueCooldown = 180;
            this.hasEscaped = false;
        }

        // Boss specific
        if (this.isBoss) {
            this.shootCooldown = 0;
        }
    }

    /**
     * Updates enemy state each frame
     */
    update() {
        if (this.invulnerable) return;

        // Sigma special movement
        if (this.isSigma) {
            this.updateSigma();
            return;
        }

        // Normal enemy movement
        const dx = player.x - this.x;
        const dz = -this.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > 50) {
            this.x += (dx / dist) * this.speed;
            this.z += (dz / dist) * this.speed;
        }

        // Keep in bounds
        if (this.z > GAME_CONFIG.ENEMY_MIN_Z) {
            this.z = GAME_CONFIG.ENEMY_MIN_Z;
        }
        this.x = Math.max(-GAME_CONFIG.ENEMY_MAX_X, Math.min(GAME_CONFIG.ENEMY_MAX_X, this.x));

        // Boss shooting
        if (this.isBoss && !this.invulnerable) {
            this.updateBossShooting();
        }

        // Gamer Dino updates
        if (this.isGamer) {
            this.updateGamer();
        }

        // Melee attack check
        const attackDist = Math.sqrt(dx * dx + (this.z * this.z));
        if (attackDist < GAME_CONFIG.ENEMY_ATTACK_RANGE && this.z < -50 && this.attackCooldown <= 0) {
            this.attack();
            this.attackCooldown = 60;
        }

        this.wobble += 0.1;
        this.attackCooldown--;
        this.hitFlash = Math.max(0, this.hitFlash - 0.1);
    }

    /**
     * Updates Sigma Dino specific behavior
     */
    updateSigma() {
        this.x += this.sigmaDirection * this.speed;

        if (this.z < -200) {
            this.z += 0.5;
        }

        this.sigmaPhase += 0.05;
        const glow = Math.sin(this.sigmaPhase) * 30 + 100;
        this.color = `rgb(${glow + 50}, ${glow + 30}, ${Math.floor(glow * 0.3)})`;

        this.sigmaDialogueCooldown--;
        if (this.sigmaDialogueCooldown <= 0 && this.callbacks.showSigmaDialogue) {
            this.callbacks.showSigmaDialogue(this);
            this.sigmaDialogueCooldown = GAME_CONFIG.SIGMA_DIALOGUE_COOLDOWN_MIN +
                Math.random() * GAME_CONFIG.SIGMA_DIALOGUE_COOLDOWN_RANGE;
        }

        if (Math.abs(this.x) > GAME_CONFIG.SIGMA_ESCAPE_X && !this.hasEscaped) {
            this.hasEscaped = true;
            if (this.callbacks.showSigmaEscapeText) {
                this.callbacks.showSigmaEscapeText();
            }
            this.health = 0;
            return;
        }

        this.wobble += 0.05;
        this.hitFlash = Math.max(0, this.hitFlash - 0.1);
    }

    /**
     * Updates boss shooting behavior
     */
    updateBossShooting() {
        if (!this.shootCooldown) this.shootCooldown = 0;
        this.shootCooldown--;

        if (this.shootCooldown <= 0) {
            enemyProjectiles.push(new EnemyProjectile(
                this.x, this.y, this.z,
                GAME_CONFIG.BOSS_FIREBALL_DAMAGE
            ));
            this.shootCooldown = GAME_CONFIG.BOSS_SHOOT_COOLDOWN;
        }
    }

    /**
     * Updates Gamer Dino specific behavior
     */
    updateGamer() {
        this.rgbPhase += 0.1;
        const r = Math.sin(this.rgbPhase) * 127 + 128;
        const g = Math.sin(this.rgbPhase + 2.094) * 127 + 128;
        const b = Math.sin(this.rgbPhase + 4.189) * 127 + 128;
        this.color = `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;

        this.rangedCooldown--;
        if (this.rangedCooldown <= 0) {
            if (this.callbacks.showGamerAttackText) {
                this.callbacks.showGamerAttackText(this.x, this.y, this.z);
            }
            if (this.callbacks.playSound) {
                this.callbacks.playSound('gamer_attack');
            }
            enemyProjectiles.push(new GamerProjectile(
                this.x, this.y, this.z,
                GAME_CONFIG.GAMER_PROJECTILE_DAMAGE
            ));
            this.rangedCooldown = GAME_CONFIG.GAMER_RANGED_COOLDOWN;
        }
    }

    /**
     * Performs melee attack on player
     */
    attack() {
        gameState.health -= this.damage;
        gameState.lastAttacker = this.name;
        achievementTracking.totalDamageTaken += this.damage;
        recordDamage(this.name, this.damage);  // UX-008: Track damage for death tips

        if (this.callbacks.playSound) this.callbacks.playSound('damage');
        if (this.callbacks.showDamageOverlay) this.callbacks.showDamageOverlay();
        if (this.callbacks.shakeOnDamage) this.callbacks.shakeOnDamage();
        if (this.callbacks.showEnemyDialogue) this.callbacks.showEnemyDialogue(this, 'attack');
        if (this.callbacks.breakCombo) this.callbacks.breakCombo();

        if (gameState.health <= 0 && this.callbacks.gameOver) {
            this.callbacks.gameOver();
        }

        if (this.callbacks.updateHUD) this.callbacks.updateHUD();
    }

    /**
     * Takes damage from a hit
     * @param {number} amount - Base damage amount
     * @returns {boolean} True if enemy died
     */
    takeDamage(amount) {
        if (this.invulnerable) return false;

        this.hitCount++;
        if (this.hitCount > 1) {
            this.wasOneShot = false;
        }

        // Crit check
        let finalDamage = amount;
        const isCrit = Math.random() < player.critChance;
        if (isCrit) {
            finalDamage *= player.critMultiplier;
            if (this.callbacks.shakeOnCrit) this.callbacks.shakeOnCrit();
        }

        this.health -= finalDamage;
        this.hitFlash = 1;

        if (this.callbacks.playSound) this.callbacks.playSound('hit');
        if (this.callbacks.showHitMarker) this.callbacks.showHitMarker(isCrit);

        // Spawn particles
        for (let i = 0; i < 5; i++) {
            particles.push(getParticle(this.x, this.y, this.z, this.color));
        }

        // Floating damage text
        floatingTexts.push({
            text: isCrit ? `CRIT ${Math.floor(finalDamage)}!` : `-${Math.floor(finalDamage)}`,
            x: this.x + (Math.random() - 0.5) * 30,
            y: this.y - 30,
            z: this.z,
            life: 40,
            color: isCrit ? '#ff00ff' : '#ffffff'
        });

        // Boss health bar update
        if (this.isBoss) {
            const bossHealthBar = document.getElementById('boss-health-bar');
            if (bossHealthBar) {
                bossHealthBar.style.width = `${Math.max(0, (this.health / this.maxHealth) * 100)}%`;
            }

            // Minigame trigger
            const healthPercent = this.health / this.maxHealth;
            if (healthPercent <= GAME_CONFIG.BOSS_MINIGAME_THRESHOLD &&
                healthPercent > GAME_CONFIG.BOSS_MINIGAME_THRESHOLD - 0.03) {
                if (this.callbacks.startMinigame) {
                    this.callbacks.startMinigame();
                }
            }
        }

        if (this.health <= 0) {
            this.die();
            return true;
        }
        return false;
    }

    /**
     * Called when enemy dies
     */
    die() {
        // Escaped Sigma doesn't give rewards
        if (this.isSigma && this.hasEscaped) {
            return;
        }

        // Increment combo and calculate bonus
        if (this.callbacks.incrementCombo) this.callbacks.incrementCombo();
        const comboBonus = this.callbacks.getComboBonus ? this.callbacks.getComboBonus(this.points) : 0;

        // Apply coin multiplier from prestige upgrades
        const earnedCoins = Math.floor(this.coins * player.coinMultiplier);

        gameState.score += this.points + comboBonus;
        gameState.coins += earnedCoins;
        gameState.totalCoinsEarned += earnedCoins;
        skinState.totalCoins += earnedCoins;
        saveSkinState();
        gameState.kills++;

        if (this.callbacks.recordKill) this.callbacks.recordKill();

        // Achievement triggers
        if (this.callbacks.checkAchievements) {
            this.callbacks.checkAchievements(this);
        }

        // Healing power tracking (UX-006: Play sound when ready)
        if (!gameState.healReady) {
            gameState.healKills++;
            if (gameState.healKills >= gameState.healKillsRequired) {
                gameState.healReady = true;
                // Play heal ready sound (UX-006)
                if (this.callbacks.playSound) this.callbacks.playSound('heal_ready');
            }
        }

        if (this.callbacks.playSound) this.callbacks.playSound('kill');

        // Screen shake
        if (this.isBoss && this.callbacks.shakeOnBossDeath) {
            this.callbacks.shakeOnBossDeath();
        } else if (this.callbacks.shakeOnKill) {
            this.callbacks.shakeOnKill();
        }

        // Death particles
        for (let i = 0; i < 20; i++) {
            particles.push(getParticle(this.x, this.y, this.z, this.color));
        }

        // Score floating text (with combo bonus)
        const comboText = comboBonus > 0 ? `+${this.points + comboBonus} (🔥+${comboBonus})` : `+${this.points}`;
        floatingTexts.push({
            text: comboText,
            x: this.x,
            y: this.y - 50,
            z: this.z,
            life: 60,
            color: comboBonus > 0 ? '#ff00ff' : '#ffcc00'
        });

        // Coin floating text
        floatingTexts.push({
            text: `🪙+${this.coins}`,
            x: this.x + 30,
            y: this.y - 70,
            z: this.z,
            life: 60,
            color: '#ffd700'
        });

        // Custom death messages
        if (this.deathMessages && this.deathMessages.length > 0) {
            const deathMsg = this.deathMessages[Math.floor(Math.random() * this.deathMessages.length)];
            floatingTexts.push({
                text: deathMsg,
                x: this.x,
                y: this.y - 100,
                z: this.z,
                life: 90,
                color: '#00ff00'
            });
        }

        // Boss death cleanup
        if (this.isBoss) {
            const bossContainer = document.getElementById('boss-health-container');
            if (bossContainer) bossContainer.style.display = 'none';
            gameState.bossActive = false;
            gameState.currentBoss = null;
        }

        if (this.callbacks.addKillFeed) this.callbacks.addKillFeed(this.name);
        if (this.callbacks.updateHUD) this.callbacks.updateHUD();

        // Deep fried mode lens flare on kill
        if (this.callbacks.spawnLensFlare) {
            this.callbacks.spawnLensFlare(this.x, this.z);
        }

        // Twitch chat reactions
        if (this.isBoss && this.callbacks.onChatBossKill) {
            this.callbacks.onChatBossKill();
        } else if (this.callbacks.onChatKill) {
            this.callbacks.onChatKill();
        }
    }

    /**
     * Draws the enemy
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {HTMLCanvasElement} canvas - Canvas element
     */
    draw(ctx, canvas) {
        const screenX = canvas.width / 2 + (this.x - player.x) * (PERSPECTIVE_SCALE / Math.max(PERSPECTIVE_MIN_Z, -this.z));
        const screenY = canvas.height / 2 + 100 * (PERSPECTIVE_SCALE / Math.max(PERSPECTIVE_MIN_Z, -this.z));
        const scale = PERSPECTIVE_SCALE / Math.max(PERSPECTIVE_MIN_Z, -this.z);
        const size = this.size * scale;

        if (-this.z < 50 || -this.z > 2000) return;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(screenX, screenY + size * 0.4, size * 0.5, size * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();

        const wobbleOffset = Math.sin(this.wobble) * 5;

        // Body glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.hitFlash > 0 ? 30 : 15;

        // Body
        ctx.fillStyle = this.hitFlash > 0 ? '#ffffff' : this.color;
        ctx.beginPath();
        ctx.ellipse(screenX, screenY - size * 0.3 + wobbleOffset, size * 0.4, size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Emoji
        ctx.font = `${size * 0.8}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (this.isBoss) {
            ctx.fillText(this.traits[0], screenX, screenY - size * 0.5 + wobbleOffset);
            ctx.fillText('🦖', screenX, screenY - size * 0.1 + wobbleOffset);
        } else {
            ctx.fillText(this.emoji, screenX, screenY - size * 0.3 + wobbleOffset);
        }

        // Rotating trait
        const traitIndex = Math.floor(Date.now() / 500) % this.traits.length;
        ctx.font = `${size * 0.3}px Arial`;
        ctx.fillText(this.traits[traitIndex], screenX + size * 0.4, screenY - size * 0.6);

        // Health bar (non-boss)
        if (!this.isBoss) {
            const barWidth = size * 0.8;
            const barHeight = 8;
            const healthPercent = this.health / this.maxHealth;

            ctx.fillStyle = '#333';
            ctx.fillRect(screenX - barWidth / 2, screenY - size - 20, barWidth, barHeight);

            ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
            ctx.fillRect(screenX - barWidth / 2, screenY - size - 20, barWidth * healthPercent, barHeight);
        }

        // Name
        ctx.font = 'bold 12px Orbitron';
        ctx.fillStyle = this.isBoss ? '#ffd700' : '#fff';
        ctx.fillText(this.name, screenX, screenY - size - 35);

        // Invulnerable indicator
        if (this.invulnerable) {
            ctx.font = 'bold 16px Orbitron';
            ctx.fillStyle = '#ff0000';
            ctx.fillText('INVULNERABLE', screenX, screenY - size - 55);
        }
    }
}
