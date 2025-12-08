/**
 * Dino Doom: Santa's Last Stand
 * Enemy Dialogue System
 *
 * Speech bubbles and dialogue for enemies.
 */

import { ENEMY_DIALOGUE, SIGMA_QUOTES, SIGMA_ESCAPE_TAUNTS, GAME_CONFIG } from '../constants.js';
import { activeDialogueBubbles, floatingTexts, trackTimeout } from '../state.js';

/**
 * Shows a dialogue bubble above an enemy
 * @param {Object} enemy - The enemy object
 * @param {string} triggerType - 'spawn' or 'attack'
 */
export function showEnemyDialogue(enemy, triggerType) {
    if (activeDialogueBubbles.length >= GAME_CONFIG.DIALOGUE_BUBBLE_MAX) return;

    const dialogueSet = ENEMY_DIALOGUE[enemy.type];
    if (!dialogueSet || !dialogueSet[triggerType]) return;

    const lines = dialogueSet[triggerType];
    const text = lines[Math.floor(Math.random() * lines.length)];

    const bubble = {
        enemy: enemy,
        text: text,
        life: 120,
        maxLife: 120
    };

    activeDialogueBubbles.push(bubble);

    const timeoutId = setTimeout(() => {
        const idx = activeDialogueBubbles.indexOf(bubble);
        if (idx > -1) activeDialogueBubbles.splice(idx, 1);
    }, GAME_CONFIG.DIALOGUE_BUBBLE_DURATION);
    trackTimeout(timeoutId);
}

/**
 * Shows random sigma dialogue above enemy
 * @param {Object} enemy - The sigma enemy
 */
export function showSigmaDialogue(enemy) {
    const quote = SIGMA_QUOTES[Math.floor(Math.random() * SIGMA_QUOTES.length)];
    floatingTexts.push({
        text: quote,
        x: enemy.x,
        y: enemy.y - 80,
        z: enemy.z,
        life: 90,
        color: '#ffd700'
    });
}

/**
 * Shows taunt when Sigma escapes
 */
export function showSigmaEscapeText() {
    const taunt = SIGMA_ESCAPE_TAUNTS[Math.floor(Math.random() * SIGMA_ESCAPE_TAUNTS.length)];
    floatingTexts.push({
        text: taunt,
        x: 0,
        y: -100,
        z: -300,
        life: 120,
        color: '#ff4444'
    });
}

/**
 * Shows "360 NO SCOPE" attack text
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} z - Z position
 */
export function showGamerAttackText(x, y, z) {
    floatingTexts.push({
        text: '360 NO SCOPE!',
        x: x,
        y: y - 80,
        z: z,
        life: 60,
        color: '#ff00ff'
    });
}

/**
 * Draws all active dialogue bubbles
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Object} player - Player object
 */
export function drawDialogueBubbles(ctx, canvas, player) {
    for (let i = activeDialogueBubbles.length - 1; i >= 0; i--) {
        const bubble = activeDialogueBubbles[i];
        bubble.life--;

        const e = bubble.enemy;
        if (!e || e.health <= 0) {
            activeDialogueBubbles.splice(i, 1);
            continue;
        }

        const screenX = canvas.width / 2 + (e.x - player.x) * (400 / Math.max(100, -e.z));
        const screenY = canvas.height / 2 + 100 * (400 / Math.max(100, -e.z));
        const scale = 400 / Math.max(100, -e.z);

        if (-e.z < 50 || -e.z > 2000) continue;

        const alpha = Math.min(1, bubble.life / 30);
        ctx.globalAlpha = alpha;

        // Background
        ctx.font = `bold ${Math.max(10, 14 * scale)}px Orbitron, sans-serif`;
        const textWidth = ctx.measureText(bubble.text).width;
        const padding = 10 * scale;
        const bubbleWidth = Math.min(300, textWidth + padding * 2);
        const bubbleHeight = 30 * scale;
        const bubbleX = screenX - bubbleWidth / 2;
        const bubbleY = screenY - e.size * scale - bubbleHeight - 20 * scale;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.beginPath();
        ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 8 * scale);
        ctx.fill();

        ctx.strokeStyle = '#ffcc00';
        ctx.lineWidth = 2 * scale;
        ctx.stroke();

        // Tail
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.beginPath();
        ctx.moveTo(screenX - 8 * scale, bubbleY + bubbleHeight);
        ctx.lineTo(screenX, bubbleY + bubbleHeight + 10 * scale);
        ctx.lineTo(screenX + 8 * scale, bubbleY + bubbleHeight);
        ctx.closePath();
        ctx.fill();

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bubble.text, screenX, bubbleY + bubbleHeight / 2);

        ctx.globalAlpha = 1;
    }
}
