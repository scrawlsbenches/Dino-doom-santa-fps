/**
 * Dino Doom: Santa's Last Stand
 * Minigame System
 *
 * Boss vulnerability phase with shootable 3D weak points.
 * UX-004: Replaced click-based minigame with FPS-consistent mechanics.
 */

import { GAME_CONFIG } from '../constants.js';
import { gameState, minigameState, floatingTexts, weakPoints } from '../state.js';
import { playSound } from './audio.js';
import { WeakPoint } from '../classes/WeakPoint.js';

/**
 * Gets weak point spawn callbacks
 * @param {Object} callbacks - Base callbacks object
 * @returns {Object} Callbacks for weak point creation
 */
function getWeakPointCallbacks(callbacks) {
    return {
        playSound: callbacks?.playSound || playSound,
        showHitMarker: callbacks?.showHitMarker
    };
}

/**
 * Spawns a weak point near the boss
 * @param {Object} callbacks - Game callbacks
 */
function spawnWeakPoint(callbacks) {
    if (!minigameState.active || !gameState.currentBoss) return;

    const boss = gameState.currentBoss;

    // Spawn weak points around the boss in 3D space
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 150;

    const x = boss.x + Math.cos(angle) * distance;
    const y = -30 - Math.random() * 80; // Above ground level
    const z = boss.z - 50 - Math.random() * 100; // In front of boss

    const weakPoint = new WeakPoint(x, y, z, getWeakPointCallbacks(callbacks));
    weakPoints.push(weakPoint);
}

/**
 * Starts the boss vulnerability phase (UX-004: No pause, shoot weak points)
 * @param {Object} callbacks - Game callbacks for weak points
 */
export function startMinigame(callbacks) {
    if (minigameState.active) return;

    minigameState.active = true;
    minigameState.hits = 0;
    minigameState.timeLeft = GAME_CONFIG.MINIGAME_DURATION_SEC;

    // UX-004: Don't pause the game - boss is stunned instead
    // gameState.paused = true; // REMOVED

    if (gameState.currentBoss) {
        // Boss is stunned (can't attack) but NOT invulnerable
        gameState.currentBoss.invulnerable = false;
        gameState.currentBoss.stunned = true;
    }

    // Show HUD overlay instead of full-screen takeover
    const minigameScreen = document.getElementById('minigame-screen');
    if (minigameScreen) {
        minigameScreen.style.display = 'flex';
        minigameScreen.classList.add('hud-mode');
    }

    const timerEl = document.getElementById('minigame-timer');
    if (timerEl) timerEl.textContent = minigameState.timeLeft;

    const hitsEl = document.getElementById('minigame-hits');
    if (hitsEl) hitsEl.textContent = 'HITS: 0 | DAMAGE: 0';

    const instructionsEl = document.getElementById('minigame-instructions');
    if (instructionsEl) {
        instructionsEl.textContent = 'SHOOT THE WEAK POINTS!';
    }

    // Hide the minigame-area (no longer used)
    const areaEl = document.getElementById('minigame-area');
    if (areaEl) areaEl.style.display = 'none';

    // Play vulnerability sound
    playSound('boss');

    // Floating text announcement
    floatingTexts.push({
        text: 'BOSS VULNERABLE!',
        x: 0,
        y: -150,
        z: -300,
        life: 90,
        color: '#ff3333'
    });

    // Spawn weak points periodically
    minigameState.targetInterval = setInterval(() => {
        spawnWeakPoint(callbacks);
    }, GAME_CONFIG.MINIGAME_TARGET_SPAWN_INTERVAL);

    // Spawn initial weak points
    for (let i = 0; i < 3; i++) {
        spawnWeakPoint(callbacks);
    }

    // Countdown timer
    minigameState.interval = setInterval(() => {
        minigameState.timeLeft--;
        const timerEl = document.getElementById('minigame-timer');
        if (timerEl) timerEl.textContent = minigameState.timeLeft;

        if (minigameState.timeLeft <= 0) {
            endMinigame();
        }
    }, 1000);
}

/**
 * Ends the vulnerability phase and applies damage to boss
 */
export function endMinigame() {
    clearInterval(minigameState.interval);
    clearInterval(minigameState.targetInterval);
    minigameState.active = false;

    // Hide HUD overlay
    const minigameScreen = document.getElementById('minigame-screen');
    if (minigameScreen) {
        minigameScreen.style.display = 'none';
        minigameScreen.classList.remove('hud-mode');
    }

    // Clear remaining weak points
    weakPoints.length = 0;

    if (gameState.currentBoss) {
        // Boss recovers from stun
        gameState.currentBoss.stunned = false;

        const damage = minigameState.hits * GAME_CONFIG.MINIGAME_DAMAGE_PER_HIT;

        if (damage > 0) {
            gameState.currentBoss.health -= damage;
            const bossHealthBar = document.getElementById('boss-health-bar');
            if (bossHealthBar) {
                bossHealthBar.style.width =
                    `${Math.max(0, (gameState.currentBoss.health / gameState.currentBoss.maxHealth) * 100)}%`;
            }

            floatingTexts.push({
                text: `WEAK POINT BONUS: -${damage}!`,
                x: gameState.currentBoss.x,
                y: -100,
                z: gameState.currentBoss.z,
                life: 90,
                color: '#ff00ff'
            });

            if (gameState.currentBoss.health <= 0) {
                gameState.currentBoss.die();
                gameState.currentBoss.markedForRemoval = true;
            }
        } else {
            // Player missed all weak points
            floatingTexts.push({
                text: 'BOSS RECOVERED!',
                x: gameState.currentBoss.x,
                y: -100,
                z: gameState.currentBoss.z,
                life: 90,
                color: '#ffcc00'
            });
        }
    }

    // UX-004: No need to unpause (game never paused)
    // gameState.paused = false; // REMOVED
}

/**
 * Updates minigame HUD display (called externally)
 */
export function updateMinigameHUD() {
    const hitsEl = document.getElementById('minigame-hits');
    if (hitsEl) {
        hitsEl.textContent = `HITS: ${minigameState.hits} | DAMAGE: ${minigameState.hits * GAME_CONFIG.MINIGAME_DAMAGE_PER_HIT}`;
    }
}
