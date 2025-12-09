/**
 * Dino Doom: Santa's Last Stand
 * Main Entry Point
 *
 * Initializes the game and sets up event listeners.
 */

import {
    updateMousePos, gameState, touchState,
    backgroundMemesState, loadBackgroundMemesState, toggleBackgroundMemes,
    detectTouchDevice, isTouchDevice
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

    // Detect touch device and set up appropriate controls
    detectTouchDevice();
    setupDeviceControls();

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
 * Sets up device-specific controls (touch vs desktop)
 */
function setupDeviceControls() {
    const mobileControls = document.getElementById('mobile-controls');
    const desktopControlsInfo = document.getElementById('desktop-controls');
    const touchControlsInfo = document.getElementById('touch-controls');

    if (isTouchDevice()) {
        // Show mobile controls and touch instructions
        if (mobileControls) mobileControls.classList.add('visible');
        if (desktopControlsInfo) desktopControlsInfo.style.display = 'none';
        if (touchControlsInfo) touchControlsInfo.style.display = 'block';
        // Enable touch-friendly cursor on body
        document.body.classList.add('touch-device');
    } else {
        // Hide mobile controls, show desktop instructions
        if (mobileControls) mobileControls.classList.remove('visible');
        if (desktopControlsInfo) desktopControlsInfo.style.display = 'block';
        if (touchControlsInfo) touchControlsInfo.style.display = 'none';
    }
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

    // Touch events for aiming (drag anywhere to aim)
    document.addEventListener('touchstart', (e) => {
        // Don't interfere with button touches
        if (e.target.closest('.mobile-btn') || e.target.closest('.game-btn') ||
            e.target.closest('#shop-screen') || e.target.closest('#start-screen') ||
            e.target.closest('#game-over')) {
            return;
        }

        if (gameState.running && !gameState.paused) {
            touchState.isAiming = true;
            const touch = e.touches[0];
            updateMousePos(touch.clientX, touch.clientY);
            touchState.lastTouchX = touch.clientX;
            touchState.lastTouchY = touch.clientY;
        }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        // Don't interfere with button touches
        if (e.target.closest('.mobile-btn') || e.target.closest('.game-btn') ||
            e.target.closest('#shop-screen') || e.target.closest('#start-screen') ||
            e.target.closest('#game-over')) {
            return;
        }

        if (touchState.isAiming && gameState.running && !gameState.paused) {
            const touch = e.touches[0];
            updateMousePos(touch.clientX, touch.clientY);
            touchState.lastTouchX = touch.clientX;
            touchState.lastTouchY = touch.clientY;
        }
    }, { passive: true });

    document.addEventListener('touchend', () => {
        touchState.isAiming = false;
    }, { passive: true });

    // Mobile control button events
    const mobileFireBtn = document.getElementById('mobile-fire-btn');
    const mobileHealBtn = document.getElementById('mobile-heal-btn');
    const mobileShopBtn = document.getElementById('mobile-shop-btn');

    if (mobileFireBtn) {
        mobileFireBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (gameState.running && !gameState.paused) {
                shoot();
                mobileFireBtn.classList.add('active');
            }
        });
        mobileFireBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            mobileFireBtn.classList.remove('active');
        });
    }

    if (mobileHealBtn) {
        mobileHealBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (gameState.running && !gameState.paused) {
                useHealingPower();
                mobileHealBtn.classList.add('active');
            }
        });
        mobileHealBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            mobileHealBtn.classList.remove('active');
        });
    }

    if (mobileShopBtn) {
        mobileShopBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (gameState.betweenWaves) {
                openShopWithCallbacks();
                mobileShopBtn.classList.add('active');
            }
        });
        mobileShopBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            mobileShopBtn.classList.remove('active');
        });
    }

    // Prevent zooming on double-tap for touch devices
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });

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
