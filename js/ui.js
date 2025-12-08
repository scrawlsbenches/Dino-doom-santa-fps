/**
 * Dino Doom: Santa's Last Stand
 * UI System
 *
 * HUD updates, rendering, and UI interactions.
 */

import { WEAPONS, GAME_CONFIG } from './constants.js';
import {
    gameState, player, inventory, mousePos,
    floatingTexts, minigameState
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
    document.getElementById('weapon-stats').textContent =
        `DMG: ${weapon.damage + player.damage + (inventory.upgrades.damage * 10)} | CRIT: ${Math.floor(player.critChance * 100)}%`;

    // Healing power display
    const healPercent = (gameState.healKills / gameState.healKillsRequired) * 100;
    document.getElementById('heal-power-bar').style.width = `${Math.min(100, healPercent)}%`;

    if (gameState.healReady) {
        document.getElementById('heal-power-text').textContent = '✨ READY! Press E ✨';
        document.getElementById('heal-power-text').style.color = '#00ff00';
        document.getElementById('heal-power-container').style.borderColor = '#00ff00';
        document.getElementById('heal-power-container').style.boxShadow = '0 0 15px #00ff00';
    } else {
        document.getElementById('heal-power-text').textContent = `${gameState.healKills} / ${gameState.healKillsRequired} kills`;
        document.getElementById('heal-power-text').style.color = '#888';
        document.getElementById('heal-power-container').style.borderColor = '#444';
        document.getElementById('heal-power-container').style.boxShadow = 'none';
    }
}

/**
 * Updates crosshair position
 */
export function updateCrosshair() {
    const crosshair = document.getElementById('crosshair');

    if (minigameState.active) {
        crosshair.style.display = 'none';
        document.body.style.cursor = 'crosshair';
        return;
    } else {
        crosshair.style.display = 'block';
        document.body.style.cursor = 'none';
    }

    crosshair.style.left = mousePos.x + 'px';
    crosshair.style.top = mousePos.y + 'px';
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
