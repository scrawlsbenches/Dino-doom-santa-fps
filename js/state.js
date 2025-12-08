/**
 * Dino Doom: Santa's Last Stand
 * Game State Management
 *
 * Central state store for all game data.
 * Provides clean state initialization and reset functions.
 */

import { GAME_CONFIG } from './constants.js';

// ==================== GAME STATE ====================
export const gameState = {
    running: false,
    paused: false,
    score: 0,
    coins: 0,
    kills: 0,
    wave: 1,
    health: GAME_CONFIG.PLAYER_BASE_HEALTH,
    maxHealth: GAME_CONFIG.PLAYER_BASE_HEALTH,
    waveInProgress: false,
    betweenWaves: false,
    bossActive: false,
    currentBoss: null,
    healKills: 0,
    healReady: false,
    healKillsRequired: GAME_CONFIG.HEAL_KILLS_REQUIRED,
    // Death screen tracking
    startTime: 0,
    lastAttacker: 'Unknown',
    totalCoinsEarned: 0
};

// ==================== PLAYER STATE ====================
export const player = {
    x: 0,
    y: 0,
    angle: 0,
    moveSpeed: GAME_CONFIG.PLAYER_MOVE_SPEED,
    damage: GAME_CONFIG.PLAYER_BASE_DAMAGE,
    fireRate: GAME_CONFIG.PLAYER_BASE_FIRE_RATE,
    fireCooldown: 0,
    critChance: GAME_CONFIG.PLAYER_BASE_CRIT_CHANCE,
    critMultiplier: GAME_CONFIG.PLAYER_CRIT_MULTIPLIER
};

// ==================== INVENTORY ====================
export const inventory = {
    currentWeapon: 'present',
    weapons: {
        present: true,
        snowball: false,
        candy_cane: false,
        ornament: false,
        star: false,
        moai: false,
        doot: false
    },
    upgrades: {
        damage: 0,
        fireRate: 0,
        health: 0,
        critChance: 0
    }
};

// ==================== ENTITY ARRAYS ====================
export const enemies = [];
export const projectiles = [];
export const enemyProjectiles = [];
export const particles = [];
export const floatingTexts = [];

// ==================== INPUT STATE ====================
export const keys = {};
export const mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

// ==================== TIMEOUT TRACKING ====================
// Track active timeouts for cleanup on game restart
export const activeTimeouts = [];

// ==================== KILL STREAK STATE ====================
export const killStreakState = {
    count: 0,
    lastKillTime: 0,
    streakTimeout: GAME_CONFIG.KILL_STREAK_TIMEOUT_MS
};

// ==================== DIALOGUE BUBBLES ====================
export const activeDialogueBubbles = [];

// ==================== ACHIEVEMENT TRACKING ====================
export const unlockedAchievements = new Set();
export const achievementTracking = {
    waveStartHealth: GAME_CONFIG.PLAYER_BASE_HEALTH,
    totalDamageTaken: 0,
    shopSpending: 0
};

// ==================== MINIGAME STATE ====================
export const minigameState = {
    active: false,
    hits: 0,
    timeLeft: GAME_CONFIG.MINIGAME_DURATION_SEC,
    interval: null,
    targetInterval: null
};

// ==================== SKIN STATE ====================
export const skinState = {
    selected: 'default',
    owned: ['default'],
    totalCoins: 0
};

// ==================== SCREEN SHAKE STATE ====================
export const shakeState = {
    intensity: 0,
    duration: 0,
    startTime: 0,
    active: false
};

// ==================== STATE RESET FUNCTIONS ====================

/**
 * Resets the main game state for a new game
 */
export function resetGameState() {
    gameState.running = true;
    gameState.paused = false;
    gameState.score = 0;
    gameState.coins = 0;
    gameState.kills = 0;
    gameState.wave = 1;
    gameState.health = GAME_CONFIG.PLAYER_BASE_HEALTH;
    gameState.maxHealth = GAME_CONFIG.PLAYER_BASE_HEALTH;
    gameState.waveInProgress = false;
    gameState.betweenWaves = false;
    gameState.bossActive = false;
    gameState.currentBoss = null;
    gameState.healKills = 0;
    gameState.healReady = false;
    gameState.healKillsRequired = GAME_CONFIG.HEAL_KILLS_REQUIRED;
    gameState.startTime = Date.now();
    gameState.lastAttacker = 'Unknown';
    gameState.totalCoinsEarned = 0;
}

/**
 * Resets player state for a new game
 */
export function resetPlayerState() {
    player.x = 0;
    player.y = 0;
    player.angle = 0;
    player.moveSpeed = GAME_CONFIG.PLAYER_MOVE_SPEED;
    player.damage = GAME_CONFIG.PLAYER_BASE_DAMAGE;
    player.fireRate = GAME_CONFIG.PLAYER_BASE_FIRE_RATE;
    player.fireCooldown = 0;
    player.critChance = GAME_CONFIG.PLAYER_BASE_CRIT_CHANCE;
    player.critMultiplier = GAME_CONFIG.PLAYER_CRIT_MULTIPLIER;
}

/**
 * Resets inventory for a new game
 */
export function resetInventory() {
    inventory.currentWeapon = 'present';
    inventory.weapons = {
        present: true,
        snowball: false,
        candy_cane: false,
        ornament: false,
        star: false,
        moai: false,
        doot: false
    };
    inventory.upgrades = {
        damage: 0,
        fireRate: 0,
        health: 0,
        critChance: 0
    };
}

/**
 * Clears all entity arrays
 */
export function clearEntities() {
    enemies.length = 0;
    projectiles.length = 0;
    enemyProjectiles.length = 0;
    particles.length = 0;
    floatingTexts.length = 0;
}

/**
 * Clears all tracked timeouts
 */
export function clearTimeouts() {
    activeTimeouts.forEach(clearTimeout);
    activeTimeouts.length = 0;
}

/**
 * Resets kill streak state
 */
export function resetKillStreak() {
    killStreakState.count = 0;
    killStreakState.lastKillTime = 0;
}

/**
 * Clears dialogue bubbles
 */
export function clearDialogueBubbles() {
    activeDialogueBubbles.length = 0;
}

/**
 * Resets achievement tracking for a new game
 */
export function resetAchievementTracking() {
    unlockedAchievements.clear();
    achievementTracking.waveStartHealth = GAME_CONFIG.PLAYER_BASE_HEALTH;
    achievementTracking.totalDamageTaken = 0;
    achievementTracking.shopSpending = 0;
}

/**
 * Resets minigame state
 */
export function resetMinigameState() {
    if (minigameState.interval) clearInterval(minigameState.interval);
    if (minigameState.targetInterval) clearInterval(minigameState.targetInterval);
    minigameState.active = false;
    minigameState.hits = 0;
    minigameState.timeLeft = GAME_CONFIG.MINIGAME_DURATION_SEC;
    minigameState.interval = null;
    minigameState.targetInterval = null;
}

/**
 * Updates mouse position
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
export function updateMousePos(x, y) {
    mousePos.x = x;
    mousePos.y = y;
}

/**
 * Sets a key state
 * @param {string} key - The key
 * @param {boolean} pressed - Whether pressed
 */
export function setKeyState(key, pressed) {
    keys[key] = pressed;
}

/**
 * Adds a timeout to the tracking array
 * @param {number} timeoutId - The timeout ID
 */
export function trackTimeout(timeoutId) {
    activeTimeouts.push(timeoutId);
}

/**
 * Loads skin state from localStorage
 */
export function loadSkinState() {
    try {
        const saved = localStorage.getItem('santaSkinState');
        if (saved) {
            const parsed = JSON.parse(saved);
            skinState.selected = parsed.selected || 'default';
            skinState.owned = parsed.owned || ['default'];
            skinState.totalCoins = parsed.totalCoins || 0;
        }
    } catch (e) {
        console.error('Failed to access localStorage:', e);
    }
}

/**
 * Saves skin state to localStorage
 */
export function saveSkinState() {
    try {
        localStorage.setItem('santaSkinState', JSON.stringify(skinState));
    } catch (e) {
        console.error('Failed to save skin state:', e);
    }
}
