/**
 * Dino Doom: Santa's Last Stand
 * Minigame System
 *
 * Boss vulnerability minigame mechanics.
 */

import { GAME_CONFIG } from '../constants.js';
import { gameState, minigameState, floatingTexts } from '../state.js';
import { playSound } from './audio.js';

/**
 * Starts the boss minigame
 */
export function startMinigame() {
    if (minigameState.active) return;

    minigameState.active = true;
    minigameState.hits = 0;
    minigameState.timeLeft = GAME_CONFIG.MINIGAME_DURATION_SEC;
    gameState.paused = true;

    if (gameState.currentBoss) {
        gameState.currentBoss.invulnerable = true;
    }

    document.getElementById('minigame-screen').style.display = 'flex';
    document.getElementById('minigame-timer').textContent = minigameState.timeLeft;
    document.getElementById('minigame-hits').textContent = 'HITS: 0 | DAMAGE: 0';

    const area = document.getElementById('minigame-area');
    area.innerHTML = '';

    function spawnTarget() {
        if (!minigameState.active) return;

        const target = document.createElement('div');
        target.className = 'minigame-target';
        target.innerHTML = '🎯';
        target.style.left = Math.random() * (600 - 60) + 'px';
        target.style.top = Math.random() * (400 - 60) + 'px';

        target.onclick = (e) => {
            e.stopPropagation();
            minigameState.hits++;
            playSound('minigame_hit');
            target.remove();
            document.getElementById('minigame-hits').textContent =
                `HITS: ${minigameState.hits} | DAMAGE: ${minigameState.hits * GAME_CONFIG.MINIGAME_DAMAGE_PER_HIT}`;
        };

        area.appendChild(target);

        setTimeout(() => target.remove(), GAME_CONFIG.MINIGAME_TARGET_LIFETIME);
    }

    minigameState.targetInterval = setInterval(spawnTarget, GAME_CONFIG.MINIGAME_TARGET_SPAWN_INTERVAL);
    spawnTarget();

    minigameState.interval = setInterval(() => {
        minigameState.timeLeft--;
        document.getElementById('minigame-timer').textContent = minigameState.timeLeft;

        if (minigameState.timeLeft <= 0) {
            endMinigame();
        }
    }, 1000);
}

/**
 * Ends the minigame and applies damage to boss
 */
export function endMinigame() {
    clearInterval(minigameState.interval);
    clearInterval(minigameState.targetInterval);
    minigameState.active = false;

    document.getElementById('minigame-screen').style.display = 'none';
    document.getElementById('minigame-area').innerHTML = '';

    if (gameState.currentBoss) {
        const damage = minigameState.hits * GAME_CONFIG.MINIGAME_DAMAGE_PER_HIT;
        gameState.currentBoss.invulnerable = false;

        if (damage > 0) {
            gameState.currentBoss.health -= damage;
            document.getElementById('boss-health-bar').style.width =
                `${Math.max(0, (gameState.currentBoss.health / gameState.currentBoss.maxHealth) * 100)}%`;

            floatingTexts.push({
                text: `MINIGAME BONUS: -${damage}!`,
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
        }
    }

    gameState.paused = false;
}
