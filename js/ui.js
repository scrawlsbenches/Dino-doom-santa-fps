/**
 * Dino Doom: Santa's Last Stand
 * UI System
 *
 * HUD updates, rendering, and UI interactions.
 */

import { WEAPONS, GAME_CONFIG, MEME_BACKGROUND_CONFIG } from './constants.js';
import {
    gameState, player, inventory, mousePos,
    floatingTexts, minigameState, backgroundMemesState,
    isBackgroundMemesEnabled, isTouchDevice
} from './state.js';
import { getCurrentSkin } from './systems/skins.js';

// Shorthand for perspective calculations
const { PERSPECTIVE_SCALE, PERSPECTIVE_MIN_Z } = GAME_CONFIG;

// ==================== HUD UPDATES ====================

/**
 * Updates all HUD elements
 */
export function updateHUD() {
    document.getElementById('score').textContent = gameState.score.toLocaleString();
    document.getElementById('coins-display').textContent = `🪙 ${gameState.coins}`;
    document.getElementById('kills').textContent = gameState.kills;
    document.getElementById('wave-display').textContent = `WAVE ${gameState.wave}`;
    document.getElementById('health-bar').style.width = `${Math.max(0, (gameState.health / gameState.maxHealth) * 100)}%`;

    const weapon = WEAPONS[inventory.currentWeapon];
    document.getElementById('weapon-name').textContent = weapon.name;
    // Calculate damage with base, bonus, and prestige multiplier
    const displayDamage = Math.floor((weapon.damage + player.damage + player.damageBonus) * player.damageMultiplier);
    document.getElementById('weapon-stats').textContent =
        `DMG: ${displayDamage} | CRIT: ${Math.floor(player.critChance * 100)}%`;

    // Healing power display (UX-006: Clearer progress indication)
    const healPercent = (gameState.healKills / gameState.healKillsRequired) * 100;
    const healBar = document.getElementById('heal-power-bar');
    const healText = document.getElementById('heal-power-text');
    const healContainer = document.getElementById('heal-power-container');

    healBar.style.width = `${Math.min(100, healPercent)}%`;

    if (gameState.healReady) {
        healText.textContent = '✨ READY! Press E ✨';
        healText.style.color = '#ffd700';
        healContainer.style.borderColor = '#ffd700';
        healContainer.style.boxShadow = '0 0 20px #ffd700';
        healBar.style.background = 'linear-gradient(90deg, #ffd700, #ffaa00)';
        healContainer.classList.add('heal-ready');
    } else {
        const killsNeeded = gameState.healKillsRequired - gameState.healKills;
        healText.textContent = `${killsNeeded} more kill${killsNeeded !== 1 ? 's' : ''} needed`;
        healText.style.color = '#888';
        healContainer.style.borderColor = '#444';
        healContainer.style.boxShadow = 'none';
        healBar.style.background = 'linear-gradient(90deg, #00ff00, #88ff88)';
        healContainer.classList.remove('heal-ready');
    }
}

/**
 * Updates crosshair position
 */
export function updateCrosshair() {
    const crosshair = document.getElementById('crosshair');
    const isTouch = isTouchDevice();

    if (minigameState.active) {
        crosshair.style.display = 'none';
        document.body.style.cursor = 'crosshair';
        return;
    } else {
        crosshair.style.display = 'block';
        // On touch devices, keep default cursor; on desktop, hide it
        document.body.style.cursor = isTouch ? 'default' : 'none';
    }

    crosshair.style.left = mousePos.x + 'px';
    crosshair.style.top = mousePos.y + 'px';
    // Touch devices get a slightly larger crosshair via CSS
    crosshair.style.transform = 'translate(-50%, -50%)';
}

/**
 * Adds an entry to the kill feed
 * @param {string} enemyName - Name of killed enemy
 */
export function addKillFeed(enemyName) {
    const feed = document.getElementById('kill-feed');
    const entry = document.createElement('div');
    entry.className = 'kill-entry';
    entry.innerHTML = `🎅 SANTA <span style="color:#ff6b6b">eliminated</span> ${enemyName}`;
    feed.insertBefore(entry, feed.firstChild);

    while (feed.children.length > GAME_CONFIG.KILL_FEED_MAX_ENTRIES) {
        feed.removeChild(feed.lastChild);
    }

    setTimeout(() => entry.remove(), GAME_CONFIG.KILL_FEED_DURATION_MS);
}

// ==================== CANVAS RENDERING ====================

/**
 * Resizes canvas to window size
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
export function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/**
 * Draws the background (sky, stars, moon, ground)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
export function drawBackground(ctx, canvas) {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a0a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 100; i++) {
        const x = (i * 137.5) % canvas.width;
        const y = (i * 73.3) % (canvas.height * 0.6);
        const size = (i % 3) + 1;
        const twinkle = Math.sin(Date.now() / 500 + i) * 0.5 + 0.5;
        ctx.globalAlpha = twinkle;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Moon
    ctx.fillStyle = '#ffffd0';
    ctx.shadowColor = '#ffffd0';
    ctx.shadowBlur = 50;
    ctx.beginPath();
    ctx.arc(canvas.width - 150, 150, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Ground
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, canvas.height * 0.65, canvas.width, canvas.height * 0.35);

    // Grid lines
    ctx.strokeStyle = '#333355';
    ctx.lineWidth = 1;
    for (let z = 100; z < 2000; z += 100) {
        const y = canvas.height * 0.65 + (PERSPECTIVE_SCALE / z) * 300;
        ctx.globalAlpha = 1 - z / 2000;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
}

/**
 * Draws the weapon/arms at bottom of screen
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
export function drawWeapon(ctx, canvas) {
    const bobOffset = Math.sin(Date.now() / 150) * 3;
    const weapon = WEAPONS[inventory.currentWeapon];
    const skin = getCurrentSkin();

    // Aim line
    ctx.strokeStyle = skin.glowColor + '50';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height - 100);
    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Arms
    ctx.fillStyle = skin.color;
    ctx.shadowColor = skin.glowColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2 - 100, canvas.height - 100 + bobOffset, 40, 50, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2 + 100, canvas.height - 100 + bobOffset, 40, 50, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Weapon body
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height - 80 + bobOffset);

    ctx.fillStyle = '#228b22';
    ctx.fillRect(-60, -40, 120, 80);

    ctx.fillStyle = weapon.color;
    ctx.fillRect(-10, -40, 20, 80);
    ctx.fillRect(-60, -10, 120, 20);

    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(weapon.emoji, 0, 0);

    ctx.fillStyle = '#1a5c1a';
    ctx.fillRect(50, -20, 40, 40);

    ctx.restore();
}

/**
 * Draws floating damage/score texts
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
export function drawFloatingTexts(ctx, canvas) {
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y -= 2;
        ft.life--;

        const screenX = canvas.width / 2 + ft.x * (PERSPECTIVE_SCALE / Math.max(PERSPECTIVE_MIN_Z, -ft.z));
        const screenY = canvas.height / 2 + ft.y * (PERSPECTIVE_SCALE / Math.max(PERSPECTIVE_MIN_Z, -ft.z));

        ctx.globalAlpha = ft.life / 60;
        ctx.font = 'bold 24px Bungee';
        ctx.fillStyle = ft.color;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, screenX, screenY);
        ctx.globalAlpha = 1;

        if (ft.life <= 0) {
            floatingTexts.splice(i, 1);
        }
    }
}

// ==================== MEME BACKGROUND ELEMENTS (TASK-019) ====================

/**
 * Updates floating meme elements (spawn new, move existing, remove expired)
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
export function updateFloatingMemes(canvas) {
    if (!isBackgroundMemesEnabled()) return;

    const elements = backgroundMemesState.floatingElements;
    const config = MEME_BACKGROUND_CONFIG;

    // Try to spawn new floating elements
    if (elements.length < config.MAX_FLOATING_ELEMENTS) {
        for (const elementConfig of config.FLOATING_ELEMENTS) {
            if (Math.random() < elementConfig.spawnChance) {
                const isAirplane = elementConfig.name === 'Airplane';
                elements.push({
                    emoji: elementConfig.emoji,
                    name: elementConfig.name,
                    x: -100,  // Start off-screen left
                    y: Math.random() * (canvas.height * 0.5),  // Top half of screen (sky)
                    speed: elementConfig.speed + Math.random() * 0.3,
                    size: elementConfig.size,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.02,
                    banner: isAirplane ? config.AIRPLANE_BANNERS[Math.floor(Math.random() * config.AIRPLANE_BANNERS.length)] : null,
                    parallaxFactor: 0.05 + Math.random() * 0.1  // Random depth
                });
                break;  // Only spawn one per frame
            }
        }
    }

    // Update existing elements
    for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        el.x += el.speed;
        el.rotation += el.rotationSpeed;

        // Remove if off-screen right
        if (el.x > canvas.width + 200) {
            elements.splice(i, 1);
        }
    }
}

/**
 * Draws meme background elements with parallax effect
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLCanvasElement} canvas - Canvas element
 */
export function drawMemeBackground(ctx, canvas) {
    if (!isBackgroundMemesEnabled()) return;

    const config = MEME_BACKGROUND_CONFIG;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate parallax offset based on mouse position
    const parallaxX = (mousePos.x - centerX) / centerX;
    const parallaxY = (mousePos.y - centerY) / centerY;

    // Draw Doge on the moon (static element with subtle parallax)
    const doge = config.DOGE_MOON;
    const dogeX = canvas.width * doge.x + parallaxX * config.PARALLAX_INTENSITY * doge.parallaxFactor;
    const dogeY = canvas.height * doge.y + parallaxY * config.PARALLAX_INTENSITY * doge.parallaxFactor;

    ctx.save();
    ctx.font = `${doge.size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.8;
    ctx.fillText(doge.emoji, dogeX, dogeY);

    // Draw "SUCH WOW" text near doge (very subtle)
    ctx.font = 'bold 12px Comic Sans MS, cursive';
    ctx.fillStyle = '#FFD700';
    ctx.globalAlpha = 0.5;
    ctx.fillText('much moon', dogeX + 40, dogeY - 20);
    ctx.fillText('very space', dogeX - 45, dogeY + 25);
    ctx.restore();

    // Draw floating meme elements
    const elements = backgroundMemesState.floatingElements;
    for (const el of elements) {
        // Apply parallax based on element's depth
        const elParallaxX = parallaxX * config.PARALLAX_INTENSITY * el.parallaxFactor;
        const elParallaxY = parallaxY * config.PARALLAX_INTENSITY * el.parallaxFactor;

        ctx.save();
        ctx.translate(el.x + elParallaxX, el.y + elParallaxY);
        ctx.rotate(el.rotation);
        ctx.globalAlpha = 0.7;
        ctx.font = `${el.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(el.emoji, 0, 0);

        // Draw banner for airplanes
        if (el.banner) {
            ctx.rotate(-el.rotation);  // Un-rotate for readable text
            ctx.font = 'bold 14px Bungee, Arial';
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.9;

            // Draw banner line
            ctx.beginPath();
            ctx.moveTo(el.size / 2, 0);
            ctx.lineTo(el.size / 2 + 80, 20);
            ctx.strokeStyle = '#888888';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw banner text with background
            const bannerX = el.size / 2 + 80;
            const bannerY = 20;
            ctx.fillStyle = '#FF6B6B';
            ctx.fillRect(bannerX - 5, bannerY - 12, ctx.measureText(el.banner).width + 10, 24);
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.strokeText(el.banner, bannerX, bannerY);
            ctx.fillText(el.banner, bannerX, bannerY);
        }

        ctx.restore();
    }
}
