/**
 * Dino Doom: Santa's Last Stand
 * Main Entry Point
 *
 * Initializes the game and sets up event listeners.
 */

import {
    updateMousePos, gameState,
    backgroundMemesState, loadBackgroundMemesState, toggleBackgroundMemes
} from './state.js';
import { initSkinSystem } from './systems/skins.js';
import { copyDeathReceipt } from './systems/death.js';
import { setVolume } from './systems/audio.js';
import { initDeepFriedSystem } from './systems/deepfried.js';
import { initEasterEggSystem, handleKonamiCode, handleMorbinCode } from './systems/eastereggs.js';
import {
    initGame, startGame, shoot, useHealingPower,
    openShopWithCallbacks, closeShopWithCallbacks
} from './game.js';

// ==================== INITIALIZATION ====================

/**
 * Initializes the background memes toggle system (TASK-019)
 * Loads saved state and sets up the toggle button
 */
function initBackgroundMemesSystem() {
    // Load saved state from localStorage
    loadBackgroundMemesState();

    // Set up the toggle button
    const toggleBtn = document.getElementById('background-memes-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            toggleBackgroundMemes();
            updateBackgroundMemesToggleUI();
        });
        // Update UI to match saved state
        updateBackgroundMemesToggleUI();
    }
}

/**
 * Updates the background memes toggle button UI
 */
function updateBackgroundMemesToggleUI() {
    const toggleBtn = document.getElementById('background-memes-btn');
    const toggleText = toggleBtn?.querySelector('.toggle-text');

    if (!toggleBtn || !toggleText) return;

    if (backgroundMemesState.enabled) {
        toggleBtn.classList.add('active');
        toggleText.textContent = 'BACKGROUND MEMES: ON';
    } else {
        toggleBtn.classList.remove('active');
        toggleText.textContent = 'BACKGROUND MEMES: OFF';
    }
}

/**
 * Initializes all game systems when DOM is ready
 */
function init() {
    const canvas = document.getElementById('game-canvas');

    // Initialize skin system (loads from localStorage)
    initSkinSystem();

    // Initialize deep fried mode system (loads from localStorage)
    initDeepFriedSystem();

    // Initialize easter egg system (loads from localStorage)
    initEasterEggSystem();

    // Initialize background memes system (TASK-019)
    initBackgroundMemesSystem();

    // Initialize game
    initGame(canvas);

    // Set up event listeners
    setupEventListeners();
}

/**
 * Sets up all event listeners
 */
function setupEventListeners() {
    // Keyboard events
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            shoot();
        }

        if (e.key === 'e' || e.key === 'E') {
            useHealingPower();
        }

        if ((e.key === 'r' || e.key === 'R') && gameState.betweenWaves) {
            openShopWithCallbacks();
        }

        // Easter egg: Konami code detection (arrow keys + B, A)
        handleKonamiCode(e);

        // Easter egg: MORBIN code detection (letter keys only)
        if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
            handleMorbinCode(e.key);
        }
    });

    // Mouse events
    document.addEventListener('mousemove', (e) => {
        updateMousePos(e.clientX, e.clientY);
    });

    document.addEventListener('click', (_e) => {
        if (gameState.running && !gameState.paused) {
            shoot();
        }
    });

    // Prevent context menu
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Button events
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', startGame);
    document.getElementById('copy-receipt-btn').addEventListener('click', copyDeathReceipt);
    document.getElementById('continue-btn').addEventListener('click', closeShopWithCallbacks);

    // Volume slider
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    if (volumeSlider && volumeValue) {
        volumeSlider.addEventListener('input', (e) => {
            const volume = parseInt(e.target.value, 10);
            setVolume(volume / 100);
            volumeValue.textContent = volume + '%';
        });
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
