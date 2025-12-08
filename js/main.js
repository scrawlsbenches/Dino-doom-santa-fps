/**
 * Dino Doom: Santa's Last Stand
 * Main Entry Point
 *
 * Initializes the game and sets up event listeners.
 */

import { updateMousePos, setKeyState, gameState } from './state.js';
import { initSkinSystem } from './systems/skins.js';
import { copyDeathReceipt } from './systems/death.js';
import {
    initGame, startGame, shoot, useHealingPower,
    openShopWithCallbacks, closeShopWithCallbacks
} from './game.js';

// ==================== INITIALIZATION ====================

/**
 * Initializes all game systems when DOM is ready
 */
function init() {
    const canvas = document.getElementById('game-canvas');

    // Initialize skin system (loads from localStorage)
    initSkinSystem();

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
        setKeyState(e.key, true);

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
    });

    document.addEventListener('keyup', (e) => {
        setKeyState(e.key, false);
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
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
