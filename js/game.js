/**
 * Dino Doom: Santa's Last Stand
 * Game Logic
 *
 * Core game loop, spawning, and game flow.
 */

import { WEAPONS, GAME_CONFIG } from './constants.js';
import {
    gameState, player, inventory, enemies, projectiles, enemyProjectiles, particles,
    floatingTexts, mousePos, weakPoints,
    resetGameState, resetPlayerState, resetInventory, clearEntities, clearTimeouts,
    resetKillStreak, resetComboState, clearDialogueBubbles, resetAchievementTracking, resetMinigameState,
    achievementTracking, returnParticle, recordDamage, resetDamageHistory,
    resetEasterEggEffects, resetEasterEggInput, clearFloatingMemes,
    isTouchDevice
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
    openShop, closeShop, showShopIndicator, hideShopIndicator,
    spawnBoss, showBossTutorial, shouldShowBossTutorial, resetBossTutorial,
    startMinigame,
    createLensFlareSpawner,
    onChatKill, onChatDeath, onChatBossKill, clearChat, initChatSystem,
    checkWaveEasterEggs, applyEasterEggEffectsToEnemy,
    triggerPhaseTransition, clearPhaseEffects
} from './systems/index.js';
import {
    updateHUD, updateCrosshair, addKillFeed,
    resizeCanvas, drawBackground, drawWeapon, drawFloatingTexts,
    updateFloatingMemes, drawMemeBackground
} from './ui.js';

// Canvas reference
let canvas;
let ctx;
let lensFlareSpawner = null;

/**
 * Updates mobile control button states based on game state
 * Only runs on touch devices
 */
function updateMobileControlStates() {
    if (!isTouchDevice()) return;

    const healBtn = document.getElementById('mobile-heal-btn');
    const shopBtn = document.getElementById('mobile-shop-btn');

    if (healBtn) {
        if (gameState.healReady) {
            healBtn.classList.add('ready');
            healBtn.classList.remove('disabled');
        } else {
            healBtn.classList.remove('ready');
            healBtn.classList.add('disabled');
        }
    }

    if (shopBtn) {
        if (gameState.betweenWaves) {
            shopBtn.classList.add('ready');
            shopBtn.classList.remove('disabled');
        } else {
            shopBtn.classList.remove('ready');
            shopBtn.classList.add('disabled');
        }
    }
}

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
        checkAchievements: checkKillAchievements,
        spawnLensFlare: lensFlareSpawner,
        onChatKill,
        onChatBossKill,
        // TASK-020: Boss phase transition callback
        triggerPhaseTransition: (boss, newPhase) => triggerPhaseTransition(boss, newPhase, playSound),
        // TASK-020: Clear phase effects on boss death
        clearPhaseEffects
    };
}

/**
 * Calculates sigma spawn chance based on wave (UX-010)
 * @returns {number} Spawn chance between base and max
 */
function getSigmaSpawnChance() {
    const waveBonus = (gameState.wave - 1) * GAME_CONFIG.SIGMA_SPAWN_CHANCE_PER_WAVE;
    return Math.min(
        GAME_CONFIG.SIGMA_MAX_SPAWN_CHANCE,
        GAME_CONFIG.SIGMA_BASE_SPAWN_CHANCE + waveBonus
    );
}

/**
 * Spawns a regular enemy
 */
export function spawnEnemy() {
    let type;
    const roll = Math.random();

    // UX-010: Wave-based sigma spawn with cap
    const sigmaChance = getSigmaSpawnChance();
    const canSpawnSigma = gameState.sigmaSpawnedThisWave < GAME_CONFIG.SIGMA_MAX_PER_WAVE;

    if (canSpawnSigma && roll < sigmaChance) {
        type = 'SIGMA_DINO';
        gameState.sigmaSpawnedThisWave++;
        const startSide = Math.random() > 0.5 ? 1 : -1;
        const x = startSide * GAME_CONFIG.SIGMA_SPAWN_X;
        const z = GAME_CONFIG.SIGMA_SPAWN_Z_BASE - Math.random() * GAME_CONFIG.SIGMA_SPAWN_Z_RANGE;
        const sigmaEnemy = new Enemy(type, x, z, getEnemyCallbacks());

        // Apply easter egg effects to sigma
        applyEasterEggEffectsToEnemy(sigmaEnemy);

        enemies.push(sigmaEnemy);
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
    const enemy = new Enemy(type, x, z, getEnemyCallbacks());

    // Apply easter egg effects to the spawned enemy
    applyEasterEggEffectsToEnemy(enemy);

    enemies.push(enemy);
}

/**
 * Spawns a wave of enemies or boss
 */
export function spawnWave() {
    gameState.waveInProgress = true;
    gameState.sigmaSpawnedThisWave = 0; // UX-010: Reset sigma counter
    gameState.waveSpawningComplete = false;
    onWaveStart();

    // Easter eggs: Check for wave-based easter eggs (wave 69, 420)
    checkWaveEasterEggs(gameState.wave);

    // Easter eggs: Reset active effects at start of new wave
    resetEasterEggEffects();

    const isBossWave = gameState.wave % GAME_CONFIG.BOSS_WAVE_INTERVAL === 0;

    showWaveAnnouncement(gameState.wave, isBossWave);

    if (isBossWave) {
        setTimeout(() => {
            // UX-004: Show boss tutorial before first boss (wave 5)
            if (shouldShowBossTutorial()) {
                showBossTutorial(() => {
                    spawnBoss(getEnemyCallbacks());
                    gameState.waveSpawningComplete = true;
                });
            } else {
                spawnBoss(getEnemyCallbacks());
                gameState.waveSpawningComplete = true;
            }
        }, 1000);
    } else {
        const enemyCount = GAME_CONFIG.ENEMIES_BASE_COUNT + gameState.wave * GAME_CONFIG.ENEMIES_PER_WAVE;
        for (let i = 0; i < enemyCount; i++) {
            setTimeout(() => {
                spawnEnemy();
                // Mark spawning complete after last enemy spawns
                if (i === enemyCount - 1) {
                    gameState.waveSpawningComplete = true;
                }
            }, i * GAME_CONFIG.ENEMY_SPAWN_DELAY_MS);
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

    // Apply base fire rate - bonus, then divide by prestige fire rate multiplier
    const baseCooldown = weapon.fireRate - player.fireRateBonus;
    player.fireCooldown = Math.max(3, Math.floor(baseCooldown / player.fireRateMultiplier));

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

    // Trigger chat death reactions
    onChatDeath();

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
    clearFloatingMemes();  // TASK-019: Clear background meme elements
    resetKillStreak();
    resetComboState();
    clearDialogueBubbles();
    resetAchievementTracking();
    resetDamageHistory();  // UX-008: Reset damage tracking for death tips
    resetMinigameState();
    resetBossTutorial(); // UX-004: Reset tutorial state
    resetEasterEggInput(); // Reset easter egg input tracking
    resetEasterEggEffects(); // Reset active easter egg effects
    updateComboDisplay();

    // Initialize chat system
    initChatSystem();
    clearChat();

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

    // TASK-019: Update and draw meme background elements
    updateFloatingMemes(canvas);
    drawMemeBackground(ctx, canvas);

    updateCrosshair();
    updateScreenShake();
    updateMobileControlStates();

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

            // UX-004: Check collisions with weak points
            for (let k = weakPoints.length - 1; k >= 0; k--) {
                const wp = weakPoints[k];
                const dx = proj.x - wp.x;
                const dy = proj.y - wp.y;
                const dz = proj.z - wp.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < GAME_CONFIG.WEAK_POINT_HIT_RADIUS) {
                    wp.takeDamage(proj.damage);
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
                recordDamage(proj.attackerName, proj.damage);  // UX-008: Track damage for death tips
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

        // UX-004: Update and draw weak points
        for (let i = weakPoints.length - 1; i >= 0; i--) {
            const wp = weakPoints[i];
            wp.update();
            wp.draw(ctx, canvas, player);
            if (wp.isExpired()) {
                weakPoints.splice(i, 1);
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

        // Wave completion - only complete if all enemies spawned and killed
        if (enemies.length === 0 && gameState.waveInProgress && gameState.waveSpawningComplete) {
            onWaveComplete();
            gameState.waveInProgress = false;
            gameState.wave++;
            gameState.betweenWaves = true;

            enemyProjectiles.length = 0;

            gameState.health = Math.min(gameState.maxHealth, gameState.health + GAME_CONFIG.WAVE_BETWEEN_HEAL_AMOUNT);
            updateHUD();

            const nextWaveIsBoss = gameState.wave % GAME_CONFIG.BOSS_WAVE_INTERVAL === 0;

            // UX-003: Show shop indicator for non-boss waves
            if (!nextWaveIsBoss) {
                showShopIndicator();
            }

            setTimeout(() => {
                if (gameState.betweenWaves) {
                    hideShopIndicator();
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

    // Initialize lens flare spawner for deep fried mode
    lensFlareSpawner = createLensFlareSpawner(canvas);

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
