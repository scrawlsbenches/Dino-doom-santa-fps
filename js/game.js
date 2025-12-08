/**
 * Dino Doom: Santa's Last Stand
 * Game Logic
 *
 * Core game loop, spawning, and game flow.
 */

import { WEAPONS, UPGRADES, GAME_CONFIG } from './constants.js';
import {
    gameState, player, inventory, enemies, projectiles, enemyProjectiles, particles,
    floatingTexts, mousePos,
    resetGameState, resetPlayerState, resetInventory, clearEntities, clearTimeouts,
    resetKillStreak, resetComboState, clearDialogueBubbles, resetAchievementTracking, resetMinigameState,
    achievementTracking, returnParticle
} from './state.js';
import { Enemy } from './classes/Enemy.js';
import { Projectile } from './classes/Projectile.js';
import {
    playSound, initAudio, playSadViolin,
    updateScreenShake, showMuzzleFlash, showDamageOverlay, showHealOverlay,
    showWaveAnnouncement, shakeOnDamage, shakeOnKill, shakeOnCrit, shakeOnBossDeath,
    showHitMarker,
    onWaveStart, onWaveComplete, checkKillAchievements, checkDeathAchievements, checkWeaponAchievements,
    recordKill,
    incrementCombo, breakCombo, getComboBonus, updateComboDisplay,
    showEnemyDialogue, showSigmaDialogue, showSigmaEscapeText, showGamerAttackText, drawDialogueBubbles,
    updateDeathScreen,
    openShop, closeShop,
    spawnBoss,
    startMinigame
} from './systems/index.js';
import {
    updateHUD, updateCrosshair, addKillFeed,
    resizeCanvas, drawBackground, drawWeapon, drawFloatingTexts
} from './ui.js';

// Canvas reference
let canvas;
let ctx;

/**
 * Creates callback object for enemy events
 */
function getEnemyCallbacks() {
    return {
        playSound,
        showDamageOverlay,
        shakeOnDamage,
        shakeOnKill,
        shakeOnCrit,
        shakeOnBossDeath,
        showHitMarker,
        showEnemyDialogue,
        showSigmaDialogue,
        showSigmaEscapeText,
        showGamerAttackText,
        updateHUD,
        addKillFeed,
        recordKill,
        incrementCombo,
        breakCombo,
        getComboBonus,
        startMinigame,
        gameOver,
        checkAchievements: checkKillAchievements
    };
}

/**
 * Spawns a regular enemy
 */
export function spawnEnemy() {
    let type;
    const roll = Math.random();

    if (roll < 0.08) {
        type = 'SIGMA_DINO';
        const startSide = Math.random() > 0.5 ? 1 : -1;
        const x = startSide * GAME_CONFIG.SIGMA_SPAWN_X;
        const z = GAME_CONFIG.SIGMA_SPAWN_Z_BASE - Math.random() * GAME_CONFIG.SIGMA_SPAWN_Z_RANGE;
        enemies.push(new Enemy(type, x, z, getEnemyCallbacks()));
        return;
    } else if (gameState.wave >= 3 && roll < 0.30) {
        type = 'GAMER_DINO';
    } else if (roll < 0.55) {
        type = 'BUFF_NERD';
    } else {
        type = 'GIGACHAD';
    }

    const x = (Math.random() - 0.5) * GAME_CONFIG.ENEMY_SPAWN_X_RANGE;
    const z = GAME_CONFIG.ENEMY_SPAWN_Z_BASE - Math.random() * GAME_CONFIG.ENEMY_SPAWN_Z_RANGE;
    enemies.push(new Enemy(type, x, z, getEnemyCallbacks()));
}

/**
 * Spawns a wave of enemies or boss
 */
export function spawnWave() {
    gameState.waveInProgress = true;
    onWaveStart();

    const isBossWave = gameState.wave % GAME_CONFIG.BOSS_WAVE_INTERVAL === 0;

    showWaveAnnouncement(gameState.wave, isBossWave);

    if (isBossWave) {
        setTimeout(() => spawnBoss(getEnemyCallbacks()), 1000);
    } else {
        const enemyCount = GAME_CONFIG.ENEMIES_BASE_COUNT + gameState.wave * GAME_CONFIG.ENEMIES_PER_WAVE;
        for (let i = 0; i < enemyCount; i++) {
            setTimeout(() => spawnEnemy(), i * GAME_CONFIG.ENEMY_SPAWN_DELAY_MS);
        }
    }
}

/**
 * Fires a projectile
 */
export function shoot() {
    if (!gameState.running || gameState.paused) return;
    if (player.fireCooldown > 0) return;

    const weapon = WEAPONS[inventory.currentWeapon];

    checkWeaponAchievements(weapon.special);

    if (weapon.special === 'doot') {
        playSound('doot');
    } else {
        playSound('shoot');
    }

    player.fireCooldown = weapon.fireRate - (inventory.upgrades.fireRate * UPGRADES.fireRate.perLevel);
    player.fireCooldown = Math.max(3, player.fireCooldown);

    const screenCenterX = canvas.width / 2;
    const screenCenterY = canvas.height / 2;

    const aimOffsetX = (mousePos.x - screenCenterX) / screenCenterX;
    const aimOffsetY = (mousePos.y - screenCenterY) / screenCenterY;

    const vz = -weapon.speed;
    const vx = aimOffsetX * weapon.speed * 0.8;
    const vy = aimOffsetY * weapon.speed * 0.5 - 1;

    projectiles.push(new Projectile(player.x, 0, 0, vx, vy, vz));

    showMuzzleFlash();
}

/**
 * Uses the healing power ability
 */
export function useHealingPower() {
    if (!gameState.running || gameState.paused) return;
    if (!gameState.healReady) return;

    gameState.healReady = false;
    gameState.healKills = 0;

    gameState.health = Math.min(gameState.maxHealth, gameState.health + GAME_CONFIG.HEAL_AMOUNT);

    playSound('heal');
    showHealOverlay();

    floatingTexts.push({
        text: `+${GAME_CONFIG.HEAL_AMOUNT} HP`,
        x: 0,
        y: -50,
        z: -200,
        life: 60,
        color: '#00ff00'
    });

    updateHUD();
}

/**
 * Handles game over
 */
export function gameOver() {
    gameState.running = false;

    // MLG Sound Pack - Sad violin on death
    playSadViolin();

    checkDeathAchievements();
    updateDeathScreen();
    document.getElementById('game-over').style.display = 'flex';
}

/**
 * Starts a new game
 */
export function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('shop-screen').style.display = 'none';
    document.getElementById('boss-health-container').style.display = 'none';

    clearTimeouts();
    resetGameState();
    resetPlayerState();
    resetInventory();
    clearEntities();
    resetKillStreak();
    resetComboState();
    clearDialogueBubbles();
    resetAchievementTracking();
    resetMinigameState();
    updateComboDisplay();

    updateHUD();
    spawnWave();
    initAudio();
}

/**
 * Main game loop
 */
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx, canvas);

    updateCrosshair();
    updateScreenShake();

    if (gameState.running && !gameState.paused) {
        if (player.fireCooldown > 0) player.fireCooldown--;

        // Update projectiles
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const proj = projectiles[i];
            proj.update();
            proj.spawnSkullTrail();

            // Check collisions
            for (let j = enemies.length - 1; j >= 0; j--) {
                const e = enemies[j];
                const dx = proj.x - e.x;
                const dy = proj.y - e.y;
                const dz = proj.z - e.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                const hitRadius = GAME_CONFIG.PROJECTILE_HIT_RADIUS_BASE + (e.size / 3);
                if (dist < hitRadius) {
                    if (proj.special === 'moai') {
                        Projectile.showYoAngelo(e.x, e.y - 50, e.z);
                        playSound('moai');
                    }

                    if (e.takeDamage(proj.damage)) {
                        if (proj.special === 'doot') {
                            Projectile.showSkeletonEffect(e.x, e.y, e.z);
                            playSound('doot_kill');
                        }
                        e.markedForRemoval = true;
                    }
                    proj.life = 0;
                    break;
                }
            }

            proj.draw(ctx, canvas);
            if (proj.isExpired()) {
                projectiles.splice(i, 1);
            }
        }

        // Update enemy projectiles
        for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
            const proj = enemyProjectiles[i];
            proj.update();

            if (proj.checkPlayerCollision(player)) {
                gameState.health -= proj.damage;
                gameState.lastAttacker = proj.attackerName;
                achievementTracking.totalDamageTaken += proj.damage;
                playSound('damage');
                showDamageOverlay();
                shakeOnDamage();
                breakCombo();

                if (gameState.health <= 0) {
                    gameOver();
                }
                updateHUD();
            }

            proj.draw(ctx, canvas);
            if (proj.isExpired()) {
                enemyProjectiles.splice(i, 1);
            }
        }

        // Update enemies
        enemies.sort((a, b) => a.z - b.z);
        enemies.forEach(e => {
            e.update();
            e.draw(ctx, canvas);
        });

        // Clean up dead enemies (reverse-order removal to avoid index shifting)
        for (let i = enemies.length - 1; i >= 0; i--) {
            if (enemies[i].markedForRemoval) {
                enemies.splice(i, 1);
            }
        }

        // Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw(ctx, canvas, player);
            if (p.isExpired()) {
                returnParticle(p);
                particles.splice(i, 1);
            }
        }

        drawFloatingTexts(ctx, canvas);
        drawDialogueBubbles(ctx, canvas, player);

        // Wave completion
        if (enemies.length === 0 && gameState.waveInProgress) {
            onWaveComplete();
            gameState.waveInProgress = false;
            gameState.wave++;
            gameState.betweenWaves = true;

            enemyProjectiles.length = 0;

            gameState.health = Math.min(gameState.maxHealth, gameState.health + GAME_CONFIG.WAVE_BETWEEN_HEAL_AMOUNT);
            updateHUD();

            const nextWaveIsBoss = gameState.wave % GAME_CONFIG.BOSS_WAVE_INTERVAL === 0;

            setTimeout(() => {
                if (gameState.betweenWaves) {
                    if (nextWaveIsBoss) {
                        gameState.betweenWaves = false;
                        spawnWave();
                    } else {
                        openShop(updateHUD);
                    }
                }
            }, 1500);
        }
    }

    drawWeapon(ctx, canvas);

    requestAnimationFrame(gameLoop);
}

/**
 * Initializes the game
 * @param {HTMLCanvasElement} canvasElement - The canvas element
 */
export function initGame(canvasElement) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');

    resizeCanvas(canvas);
    window.addEventListener('resize', () => resizeCanvas(canvas));

    gameLoop();
}

/**
 * Opens shop with proper callbacks
 */
export function openShopWithCallbacks() {
    openShop(updateHUD);
}

/**
 * Closes shop with proper callbacks
 */
export function closeShopWithCallbacks() {
    closeShop(spawnWave);
}
