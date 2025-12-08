/**
 * Dino Doom: Santa's Last Stand
 * Deep Fried Mode System
 *
 * Handles the meme-style visual effects for maximum gaming experience.
 */

import {
    deepFriedState,
    loadDeepFriedState,
    toggleDeepFriedMode,
    addLensFlare,
    clearLensFlares
} from '../state.js';

// ==================== INITIALIZATION ====================

/**
 * Initializes the deep fried mode system
 * Loads saved state and sets up the toggle button
 */
export function initDeepFriedSystem() {
    // Load saved state from localStorage
    loadDeepFriedState();

    // Set up the toggle button
    const toggleBtn = document.getElementById('deep-fried-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', handleToggleClick);
        // Update UI to match saved state
        updateToggleUI();
    }

    // Apply initial state
    applyDeepFriedEffect();
}

// ==================== TOGGLE HANDLING ====================

/**
 * Handles the toggle button click
 */
function handleToggleClick() {
    toggleDeepFriedMode();
    updateToggleUI();
    applyDeepFriedEffect();
}

/**
 * Updates the toggle button UI to reflect current state
 */
function updateToggleUI() {
    const toggleBtn = document.getElementById('deep-fried-btn');
    const toggleText = toggleBtn?.querySelector('.toggle-text');

    if (!toggleBtn || !toggleText) return;

    if (deepFriedState.enabled) {
        toggleBtn.classList.add('active');
        toggleText.textContent = 'DEEP FRIED MODE: ON';
    } else {
        toggleBtn.classList.remove('active');
        toggleText.textContent = 'DEEP FRIED MODE: OFF';
    }
}

/**
 * Applies or removes the deep fried CSS effect
 */
export function applyDeepFriedEffect() {
    const gameContainer = document.getElementById('game-container');
    if (!gameContainer) return;

    if (deepFriedState.enabled) {
        gameContainer.classList.add('deep-fried');
    } else {
        gameContainer.classList.remove('deep-fried');
        // Clear any active lens flares when disabled
        clearLensFlares();
        clearLensFlareElements();
    }
}

// ==================== LENS FLARE SYSTEM ====================

/**
 * Spawns a lens flare emoji at the specified screen position
 * Only spawns if deep fried mode is enabled
 * @param {number} x - Screen X position
 * @param {number} y - Screen Y position
 */
export function spawnLensFlare(x, y) {
    if (!deepFriedState.enabled) return;

    // Add to state for tracking
    addLensFlare(x, y);

    // Create DOM element
    const container = document.getElementById('lens-flare-container');
    if (!container) return;

    const emojis = ['💥', '✨', '🔥', '💯', '👌', '😂', '🅱️', '💀'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    const flare = document.createElement('div');
    flare.className = 'lens-flare';
    flare.textContent = emoji;
    flare.style.left = x + 'px';
    flare.style.top = y + 'px';

    container.appendChild(flare);

    // Remove after animation completes
    setTimeout(() => {
        flare.remove();
    }, 1000);
}

/**
 * Clears all lens flare DOM elements
 */
function clearLensFlareElements() {
    const container = document.getElementById('lens-flare-container');
    if (container) {
        container.innerHTML = '';
    }
}

/**
 * Returns whether deep fried mode is currently enabled
 * @returns {boolean} True if deep fried mode is enabled
 */
export function isDeepFriedEnabled() {
    return deepFriedState.enabled;
}

/**
 * Creates a lens flare spawner bound to a specific canvas
 * @param {HTMLCanvasElement} canvas - The game canvas
 * @returns {Function} A function that spawns lens flares at world coordinates
 */
export function createLensFlareSpawner(canvas) {
    const PERSPECTIVE_SCALE = 200;
    const PERSPECTIVE_MIN_Z = 100;

    return function spawnLensFlareAtWorldPos(worldX, worldZ) {
        if (!deepFriedState.enabled) return;

        // Convert world coordinates to screen coordinates
        const scale = PERSPECTIVE_SCALE / Math.max(PERSPECTIVE_MIN_Z, -worldZ);
        const screenX = canvas.width / 2 + worldX * scale;
        const screenY = canvas.height / 2 + 100 * scale;

        spawnLensFlare(screenX, screenY);
    };
}
