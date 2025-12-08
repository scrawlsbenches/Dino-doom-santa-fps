/**
 * Dino Doom: Santa's Last Stand
 * Boss System
 *
 * Boss intro cutscenes and battle mechanics.
 * UX-004: Added boss tutorial before first boss encounter.
 */

import { BOSS_NAMES, GAME_CONFIG } from '../constants.js';
import { gameState, trackTimeout, enemies, floatingTexts } from '../state.js';
import { Enemy } from '../classes/Enemy.js';
import { playSound } from './audio.js';
import { onChatBossSpawn } from './chat.js';
import { applyEasterEggEffectsToEnemy } from './eastereggs.js';

// UX-004: Track if tutorial has been shown this session
let bossTutorialShown = false;

/**
 * Gets boss info for current wave
 * @param {number} wave - Current wave number
 * @returns {Object} Boss name, title, and emoji
 */
export function getBossInfo(wave) {
    if (BOSS_NAMES[wave]) {
        return BOSS_NAMES[wave];
    }

    const baseWaves = [5, 10, 15, 20, 25];
    const cycleIndex = Math.floor((wave - 1) / 5) % baseWaves.length;
    const baseWave = baseWaves[cycleIndex];
    const base = BOSS_NAMES[baseWave];
    return {
        name: base.name + ' MK' + Math.floor(wave / 25 + 1),
        title: base.title + ' (Ascended)',
        emoji: base.emoji
    };
}

/**
 * Plays boss intro cutscene
 * @param {Function} callback - Called when cutscene ends
 * @param {Object} callbacks - Enemy callback functions
 */
export function playBossIntro(callback, callbacks) {
    const bossInfo = getBossInfo(gameState.wave);

    const overlay = document.getElementById('boss-intro-overlay');
    const emoji = document.getElementById('boss-intro-emoji');
    const name = document.getElementById('boss-intro-name');
    const title = document.getElementById('boss-intro-title');
    const flash = document.getElementById('boss-intro-flash');

    if (!overlay || !emoji || !name || !title) {
        if (callback) callback(bossInfo, callbacks);
        return;
    }

    gameState.paused = true;

    emoji.className = '';
    name.className = '';
    title.className = '';
    if (flash) flash.className = '';

    emoji.textContent = bossInfo.emoji;
    name.textContent = bossInfo.name;
    title.textContent = `"${bossInfo.title}"`;

    overlay.classList.add('active');

    trackTimeout(setTimeout(() => {
        emoji.classList.add('slide-in');
    }, 300));

    trackTimeout(setTimeout(() => {
        name.classList.add('show');
    }, 800));

    trackTimeout(setTimeout(() => {
        title.classList.add('show');
    }, 1200));

    trackTimeout(setTimeout(() => {
        if (flash) flash.classList.add('flash');
    }, 2500));

    trackTimeout(setTimeout(() => {
        overlay.classList.remove('active');
        if (gameState.running) {
            gameState.paused = false;
            if (callback) callback(bossInfo, callbacks);
        }
    }, 3000));
}

/**
 * Spawns a boss after intro cutscene
 * @param {Object} callbacks - Enemy callback functions
 */
export function spawnBoss(callbacks) {
    playBossIntro((bossInfo, cbs) => {
        const boss = new Enemy('MINI_BOSS', 0, -1000, cbs);
        boss.health = GAME_CONFIG.BOSS_BASE_HEALTH + (gameState.wave * GAME_CONFIG.BOSS_HEALTH_PER_WAVE);
        boss.maxHealth = boss.health;
        boss.shootCooldown = 0;
        boss.customName = bossInfo.name;

        // Apply easter egg effects to boss (bat mode, etc.)
        applyEasterEggEffectsToEnemy(boss);

        enemies.push(boss);

        gameState.bossActive = true;
        gameState.currentBoss = boss;

        const bossContainer = document.getElementById('boss-health-container');
        const bossName = document.getElementById('boss-name');
        const bossHealthBar = document.getElementById('boss-health-bar');
        if (bossContainer) bossContainer.style.display = 'block';
        if (bossName) bossName.textContent = `👑 ${bossInfo.name} 👑`;
        if (bossHealthBar) bossHealthBar.style.width = '100%';

        playSound('boss');

        // Twitch chat reaction to boss spawn
        onChatBossSpawn();
    }, callbacks);
}

/**
 * UX-004: Shows boss tutorial before first boss encounter
 * @param {Function} callback - Called when tutorial is dismissed
 */
export function showBossTutorial(callback) {
    const tutorial = document.getElementById('boss-tutorial');
    const btn = document.getElementById('boss-tutorial-btn');

    if (!tutorial || !btn) {
        if (callback) callback();
        return;
    }

    gameState.paused = true;
    tutorial.classList.add('visible');

    const handleClick = () => {
        tutorial.classList.remove('visible');
        gameState.paused = false;
        bossTutorialShown = true;
        btn.removeEventListener('click', handleClick);
        if (callback) callback();
    };

    btn.addEventListener('click', handleClick);
}

/**
 * UX-004: Checks if boss tutorial should be shown
 * @returns {boolean} True if tutorial should be shown
 */
export function shouldShowBossTutorial() {
    return gameState.wave === 5 && !bossTutorialShown;
}

/**
 * UX-004: Resets tutorial state (call on game restart)
 */
export function resetBossTutorial() {
    bossTutorialShown = false;
}

/**
 * TASK-020: Triggers boss phase transition with mini-cutscene
 * @param {Object} boss - The boss enemy object
 * @param {number} newPhase - The new phase (2 or 3)
 * @param {Function} playPhaseSound - Function to play phase transition sound
 */
export function triggerPhaseTransition(boss, newPhase, playPhaseSound) {
    if (!boss || boss.phaseTransitioning) return;

    boss.phaseTransitioning = true;
    boss.invulnerable = true; // Brief invulnerability during transition

    // Play phase transition sound
    if (playPhaseSound) {
        playPhaseSound(newPhase === 3 ? 'boss_phase3' : 'boss_phase2');
    }

    // Show phase transition overlay
    showPhaseTransitionOverlay(boss, newPhase);

    // After transition cutscene, apply phase effects
    trackTimeout(setTimeout(() => {
        boss.transitionToPhase(newPhase);
        boss.phaseTransitioning = false;
        boss.invulnerable = false;
        hidePhaseTransitionOverlay();

        // Update boss health bar phase indicator
        updateBossPhaseIndicator(newPhase);
    }, GAME_CONFIG.BOSS_PHASE_TRANSITION_DURATION));
}

/**
 * TASK-020: Shows the phase transition overlay
 * @param {Object} boss - The boss enemy object
 * @param {number} newPhase - The new phase
 */
function showPhaseTransitionOverlay(boss, newPhase) {
    const overlay = document.getElementById('boss-phase-overlay');
    const phaseNumber = document.getElementById('boss-phase-number');
    const phaseTitle = document.getElementById('boss-phase-title');
    const phaseEmoji = document.getElementById('boss-phase-emoji');

    if (!overlay) return;

    // Set content based on phase
    if (newPhase === 2) {
        if (phaseNumber) phaseNumber.textContent = 'PHASE 2';
        if (phaseTitle) phaseTitle.textContent = 'SUNGLASSES MODE ACTIVATED';
        if (phaseEmoji) phaseEmoji.textContent = '😎';
    } else if (newPhase === 3) {
        if (phaseNumber) phaseNumber.textContent = 'FINAL PHASE';
        if (phaseTitle) phaseTitle.textContent = 'ASCENSION COMPLETE';
        if (phaseEmoji) phaseEmoji.textContent = '🔥👑🔥';
    }

    overlay.classList.add('active');
    overlay.classList.add(`phase-${newPhase}`);
}

/**
 * TASK-020: Hides the phase transition overlay
 */
function hidePhaseTransitionOverlay() {
    const overlay = document.getElementById('boss-phase-overlay');
    if (overlay) {
        overlay.classList.remove('active', 'phase-2', 'phase-3');
    }
}

/**
 * TASK-020: Updates the boss health bar phase indicator
 * @param {number} phase - Current phase
 */
function updateBossPhaseIndicator(phase) {
    const phaseLabel = document.getElementById('boss-phase-label');
    const phase3Marker = document.getElementById('boss-phase-3-marker');
    const phase3Label = document.getElementById('boss-phase-3-label');
    const gameContainer = document.getElementById('game-container');

    if (phaseLabel) {
        if (phase === 2) {
            phaseLabel.textContent = '⚠️ PHASE 2 ACTIVE';
            phaseLabel.style.color = '#ff8800';
        } else if (phase === 3) {
            phaseLabel.textContent = '🔥 FINAL PHASE 🔥';
            phaseLabel.style.color = '#ff3333';
        }
    }

    // Show phase 3 marker when entering phase 2
    if (phase3Marker && phase === 2) {
        phase3Marker.style.display = 'block';
    }
    if (phase3Label && phase === 2) {
        phase3Label.style.display = 'block';
    }

    // Phase 3 screen effects
    if (phase === 3) {
        const phase2Marker = document.getElementById('boss-phase-marker');
        if (phase2Marker) phase2Marker.style.opacity = '0.3';
        if (phase3Marker) phase3Marker.style.opacity = '0.3';

        // Add screen shake and vignette effect for phase 3
        if (gameContainer) {
            gameContainer.classList.add('phase-3-active');
        }

        // Add floating text announcement
        floatingTexts.push({
            text: '🔥 BOSS ENRAGED! 🔥',
            x: 0,
            y: -200,
            z: -300,
            life: 120,
            color: '#ff3333'
        });
    }
}

/**
 * TASK-020: Clears phase 3 screen effects (call on boss death)
 */
export function clearPhaseEffects() {
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.classList.remove('phase-3-active');
    }

    // Reset phase indicators
    const phase2Marker = document.getElementById('boss-phase-marker');
    const phase3Marker = document.getElementById('boss-phase-3-marker');
    const phase3Label = document.getElementById('boss-phase-3-label');
    const phaseLabel = document.getElementById('boss-phase-label');

    if (phase2Marker) phase2Marker.style.opacity = '1';
    if (phase3Marker) {
        phase3Marker.style.display = 'none';
        phase3Marker.style.opacity = '1';
    }
    if (phase3Label) phase3Label.style.display = 'none';
    if (phaseLabel) {
        phaseLabel.textContent = '⚠️ PHASE 2';
        phaseLabel.style.color = '#ffd700';
    }
}
