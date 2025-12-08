/**
 * Dino Doom: Santa's Last Stand
 * Game State Management
 *
 * Central state store for all game data.
 * Provides clean state initialization and reset functions.
 */

import { GAME_CONFIG } from './constants.js';
import { Particle } from './classes/Particle.js';

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
    waveSpawningComplete: false,
    betweenWaves: false,
    bossActive: false,
    currentBoss: null,
    healKills: 0,
    healReady: false,
    healKillsRequired: GAME_CONFIG.HEAL_KILLS_REQUIRED,
    // UX-010: Sigma spawn tracking
    sigmaSpawnedThisWave: 0,
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
    critMultiplier: GAME_CONFIG.PLAYER_CRIT_MULTIPLIER,
    damageBonus: 0,
    fireRateBonus: 0,
    // Prestige bonuses (multipliers)
    damageMultiplier: 1,
    fireRateMultiplier: 1,
    healthMultiplier: 1,
    coinMultiplier: 1
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
    },
    prestigeUpgrades: {
        overkill: 0,
        bulletHell: 0,
        titanHealth: 0,
        criticalMass: 0,
        coinMagnet: 0
    }
};

// ==================== ENTITY ARRAYS ====================
export const enemies = [];
export const projectiles = [];
export const enemyProjectiles = [];
export const particles = [];
export const floatingTexts = [];

// ==================== PARTICLE POOL ====================
export const particlePool = [];
const MAX_POOL_SIZE = 200;

// ==================== INPUT STATE ====================
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

// ==================== COMBO STATE ====================
export const comboState = {
    count: 0,
    showWomboCombo: false,
    lastDamageTime: 0  // Tracks last time combo took damage for cooldown
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

// ==================== DEEP FRIED MODE STATE ====================
export const deepFriedState = {
    enabled: false,
    lensFlares: []  // Active lens flare emojis on screen
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
    gameState.waveSpawningComplete = false;
    gameState.betweenWaves = false;
    gameState.bossActive = false;
    gameState.currentBoss = null;
    gameState.healKills = 0;
    gameState.healReady = false;
    gameState.healKillsRequired = GAME_CONFIG.HEAL_KILLS_REQUIRED;
    gameState.sigmaSpawnedThisWave = 0;
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
    player.damageBonus = 0;
    player.fireRateBonus = 0;
    // Reset prestige multipliers
    player.damageMultiplier = 1;
    player.fireRateMultiplier = 1;
    player.healthMultiplier = 1;
    player.coinMultiplier = 1;
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
    inventory.prestigeUpgrades = {
        overkill: 0,
        bulletHell: 0,
        titanHealth: 0,
        criticalMass: 0,
        coinMagnet: 0
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
 * Resets combo state
 */
export function resetComboState() {
    comboState.count = 0;
    comboState.showWomboCombo = false;
    comboState.lastDamageTime = 0;
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

// ==================== DEEP FRIED MODE FUNCTIONS ====================

/**
 * Loads deep fried mode state from localStorage
 */
export function loadDeepFriedState() {
    try {
        const saved = localStorage.getItem('deepFriedMode');
        if (saved !== null) {
            deepFriedState.enabled = JSON.parse(saved);
        }
    } catch {
        // Gracefully handle localStorage errors (e.g., private browsing)
    }
}

/**
 * Saves deep fried mode state to localStorage
 */
export function saveDeepFriedState() {
    try {
        localStorage.setItem('deepFriedMode', JSON.stringify(deepFriedState.enabled));
    } catch {
        // Gracefully handle localStorage errors
    }
}

/**
 * Toggles deep fried mode on/off
 * @returns {boolean} The new state of deep fried mode
 */
export function toggleDeepFriedMode() {
    deepFriedState.enabled = !deepFriedState.enabled;
    saveDeepFriedState();
    return deepFriedState.enabled;
}

/**
 * Clears all lens flare emojis
 */
export function clearLensFlares() {
    deepFriedState.lensFlares.length = 0;
}

/**
 * Adds a lens flare emoji at the specified position
 * @param {number} x - X position
 * @param {number} y - Y position
 */
export function addLensFlare(x, y) {
    const emojis = ['💥', '✨', '🔥', '💯', '👌', '😂', '🅱️', '💀'];
    deepFriedState.lensFlares.push({
        x,
        y,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        life: 60,  // 60 frames (~1 second)
        scale: 1 + Math.random() * 0.5,
        rotation: Math.random() * Math.PI * 2
    });
}

// ==================== PARTICLE POOL FUNCTIONS ====================

/**
 * Gets a particle from the pool or creates a new one
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} z - Z position (depth)
 * @param {string} color - Particle color
 * @returns {Particle} A particle instance
 */
export function getParticle(x, y, z, color) {
    let p = particlePool.pop();
    if (!p) {
        p = new Particle(x, y, z, color);
    } else {
        p.reset(x, y, z, color);
    }
    return p;
}

/**
 * Returns a particle to the pool for reuse
 * @param {Particle} p - The particle to return
 */
export function returnParticle(p) {
    if (particlePool.length < MAX_POOL_SIZE) {
        particlePool.push(p);
    }
}
