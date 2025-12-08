/**
 * Dino Doom: Santa's Last Stand
 * Game Constants and Configuration
 *
 * This file contains all magic numbers, configuration objects,
 * and static data used throughout the game.
 */

// ==================== GAME BALANCE CONSTANTS ====================
export const GAME_CONFIG = {
    // Player defaults
    PLAYER_MOVE_SPEED: 5,
    PLAYER_BASE_DAMAGE: 0,
    PLAYER_BASE_FIRE_RATE: 10,
    PLAYER_BASE_CRIT_CHANCE: 0.05,
    PLAYER_CRIT_MULTIPLIER: 2,
    PLAYER_BASE_HEALTH: 100,

    // Wave system
    WAVE_BETWEEN_HEAL_AMOUNT: 20,
    BOSS_WAVE_INTERVAL: 5,
    ENEMIES_BASE_COUNT: 3,
    ENEMIES_PER_WAVE: 2,
    ENEMY_SPAWN_DELAY_MS: 500,

    // Healing power
    HEAL_KILLS_REQUIRED: 10,
    HEAL_AMOUNT: 50,

    // Combat
    ENEMY_ATTACK_RANGE: 120,
    ENEMY_MIN_Z: -80,
    ENEMY_MAX_X: 500,
    PROJECTILE_HIT_RADIUS_BASE: 60,
    PROJECTILE_GRAVITY: 0.05,

    // Boss
    BOSS_BASE_HEALTH: 500,
    BOSS_HEALTH_PER_WAVE: 50,
    BOSS_SHOOT_COOLDOWN: 90,
    BOSS_FIREBALL_DAMAGE: 5,
    BOSS_MINIGAME_THRESHOLD: 0.50,

    // Minigame
    MINIGAME_DURATION_SEC: 10,
    MINIGAME_TARGET_SPAWN_INTERVAL: 400,
    MINIGAME_TARGET_LIFETIME: 1500,
    MINIGAME_DAMAGE_PER_HIT: 50,

    // Boss Phases (TASK-020)
    BOSS_PHASE_2_THRESHOLD: 0.50,  // Phase 2 at 50% HP
    BOSS_PHASE_3_THRESHOLD: 0.25,  // Phase 3 at 25% HP
    BOSS_PHASE_2_DAMAGE_MULT: 1.5, // +50% damage in phase 2
    BOSS_PHASE_3_DAMAGE_MULT: 2.0, // +100% damage in phase 3
    BOSS_PHASE_2_COOLDOWN_MULT: 0.75, // 25% faster attacks in phase 2
    BOSS_PHASE_3_COOLDOWN_MULT: 0.5,  // 50% faster attacks in phase 3
    BOSS_METEOR_DAMAGE: 20,        // Damage per meteor
    BOSS_METEOR_COOLDOWN: 60,      // Frames between meteor spawns
    BOSS_ASCEND_HEIGHT: -60,       // Y offset when ascended
    BOSS_PHASE_TRANSITION_DURATION: 2000, // ms for phase transition cutscene

    // Gamer Dino
    GAMER_RANGED_COOLDOWN: 300,
    GAMER_PROJECTILE_DAMAGE: 15,
    GAMER_PROJECTILE_SPEED: 8,

    // Sigma Dino
    SIGMA_DIALOGUE_COOLDOWN_MIN: 240,
    SIGMA_DIALOGUE_COOLDOWN_RANGE: 120,
    SIGMA_ESCAPE_X: 600,
    // UX-010: Sigma spawn consistency
    SIGMA_MAX_PER_WAVE: 2,
    SIGMA_BASE_SPAWN_CHANCE: 0.04,
    SIGMA_SPAWN_CHANCE_PER_WAVE: 0.01,
    SIGMA_MAX_SPAWN_CHANCE: 0.12,

    // Enemy scaling
    ENEMY_HEALTH_PER_WAVE: 10,

    // Kill streak timeout
    KILL_STREAK_TIMEOUT_MS: 3000,

    // Perspective and rendering
    PERSPECTIVE_SCALE: 400,
    PERSPECTIVE_MIN_Z: 100,

    // Spawn positions
    SIGMA_SPAWN_X: 500,
    SIGMA_SPAWN_Z_BASE: -400,
    SIGMA_SPAWN_Z_RANGE: 200,
    ENEMY_SPAWN_X_RANGE: 800,
    ENEMY_SPAWN_Z_BASE: -800,
    ENEMY_SPAWN_Z_RANGE: 500,

    // UI
    DIALOGUE_BUBBLE_MAX: 2,
    DIALOGUE_BUBBLE_DURATION: 2000,
    KILL_FEED_MAX_ENTRIES: 5,
    KILL_FEED_DURATION_MS: 3000,
    ACHIEVEMENT_TOAST_DURATION_MS: 3000,

    // Combo system
    COMBO_MULTIPLIER_PERCENT: 10,
    WOMBO_COMBO_THRESHOLD: 10,

    // Combo decay system (UX-002)
    COMBO_DECAY_BASE_PERCENT: 50,       // Base: lose 50% of combo on hit
    COMBO_DECAY_HIGH_PERCENT: 40,       // At 10+ combo: lose only 40%
    COMBO_DECAY_VERY_HIGH_PERCENT: 30,  // At 20+ combo: lose only 30%
    COMBO_HIGH_THRESHOLD: 10,           // Threshold for reduced decay
    COMBO_VERY_HIGH_THRESHOLD: 20,      // Threshold for even more reduced decay
    COMBO_DAMAGE_COOLDOWN_MS: 1000      // Brief invulnerability (1s) to prevent multi-hit combo breaks
};

// ==================== WEAPONS ====================
export const WEAPONS = {
    present: {
        name: 'Present Launcher',
        emoji: '🎁',
        damage: 35,
        fireRate: 10,
        speed: 20,
        color: '#ff0000',
        price: 0,
        description: 'Classic gift-giving weapon'
    },
    snowball: {
        name: 'Snowball Blaster',
        emoji: '❄️',
        damage: 20,
        fireRate: 5,
        speed: 25,
        color: '#aaddff',
        price: 500,
        description: 'Rapid-fire frozen fury'
    },
    candy_cane: {
        name: 'Candy Cane Rifle',
        emoji: '🍬',
        damage: 50,
        fireRate: 20,
        speed: 30,
        color: '#ff6699',
        price: 1000,
        description: 'Sweet and powerful'
    },
    ornament: {
        name: 'Ornament Grenade',
        emoji: '🔮',
        damage: 80,
        fireRate: 40,
        speed: 15,
        color: '#9900ff',
        price: 2000,
        description: 'Explosive decorations'
    },
    star: {
        name: 'North Star Beam',
        emoji: '⭐',
        damage: 100,
        fireRate: 30,
        speed: 40,
        color: '#ffff00',
        price: 5000,
        description: 'Ultimate guiding light'
    },
    moai: {
        name: 'Moai Cannon',
        emoji: '🗿',
        damage: 70,
        fireRate: 25,
        speed: 18,
        color: '#8b7355',
        price: 1500,
        description: 'Yo, Angelo',
        special: 'moai'
    },
    doot: {
        name: 'Doot Cannon',
        emoji: '🎺',
        damage: 45,
        fireRate: 15,
        speed: 22,
        color: '#daa520',
        price: 800,
        description: 'Spooky scary skeletons',
        special: 'doot'
    }
};

// ==================== UPGRADES ====================
export const UPGRADES = {
    damage: {
        name: 'Damage+',
        icon: '💪',
        basePrice: 200,
        maxLevel: 10,
        perLevel: 10,
        description: '+10 damage per level'
    },
    fireRate: {
        name: 'Fire Rate+',
        icon: '⚡',
        basePrice: 300,
        maxLevel: 5,
        perLevel: 2,
        description: '-2 cooldown per level'
    },
    health: {
        name: 'Max Health+',
        icon: '❤️',
        basePrice: 250,
        maxLevel: 10,
        perLevel: 20,
        description: '+20 max HP per level'
    },
    critChance: {
        name: 'Crit Chance+',
        icon: '🎯',
        basePrice: 400,
        maxLevel: 5,
        perLevel: 0.05,
        description: '+5% crit per level'
    }
};

// ==================== PRESTIGE UPGRADES ====================
// Unlocked after maxing all basic upgrades - infinite scaling for late game
export const PRESTIGE_UPGRADES = {
    overkill: {
        name: 'Overkill',
        icon: '💪🔥',
        basePrice: 2000,
        priceIncrease: 500,
        perLevel: 0.05,  // +5% damage multiplier per level
        description: '+5% damage per level (stacks)'
    },
    bulletHell: {
        name: 'Bullet Hell',
        icon: '⚡🔥',
        basePrice: 2500,
        priceIncrease: 600,
        perLevel: 0.05,  // +5% fire rate per level
        description: '+5% fire rate per level'
    },
    titanHealth: {
        name: 'Titan Health',
        icon: '❤️🔥',
        basePrice: 2000,
        priceIncrease: 500,
        perLevel: 0.10,  // +10% max HP per level
        description: '+10% max HP per level'
    },
    criticalMass: {
        name: 'Critical Mass',
        icon: '🎯🔥',
        basePrice: 3000,
        priceIncrease: 700,
        perLevel: 0.02,  // +2% crit chance per level
        description: '+2% crit chance per level'
    },
    coinMagnet: {
        name: 'Coin Magnet',
        icon: '🪙✨',
        basePrice: 1500,
        priceIncrease: 400,
        perLevel: 0.10,  // +10% coin drops per level
        description: '+10% coins per level'
    }
};

// ==================== ENEMY TYPES ====================
export const ENEMY_TYPES = {
    GIGACHAD: {
        name: 'GIGACHAD DINO',
        emoji: '🦖',
        health: 150,
        damage: 25,
        speed: 1.5,
        size: 80,
        color: '#ff4444',
        points: 200,
        coins: 15,
        traits: ['💪', '😎', '🏋️']
    },
    BUFF_NERD: {
        name: 'BUFF NERD DINO',
        emoji: '🦕',
        health: 80,
        damage: 15,
        speed: 3,
        size: 60,
        color: '#44ff88',
        points: 100,
        coins: 10,
        traits: ['🤓', '📚', '🧠']
    },
    MINI_BOSS: {
        name: 'DINO OVERLORD',
        emoji: '👑',
        health: 500,
        damage: 10,
        speed: 1,
        size: 120,
        color: '#ffd700',
        points: 1000,
        coins: 200,
        traits: ['👑', '💀', '🔥'],
        isBoss: true
    },
    GAMER_DINO: {
        name: 'GAMER DINO',
        emoji: '🦕🎮',
        health: 100,
        damage: 20,
        speed: 2.5,
        size: 70,
        color: '#ff00ff',
        points: 150,
        coins: 12,
        traits: ['🎮', '⌨️', '🖱️'],
        isGamer: true,
        deathMessages: ['GG', 'EZ', 'GET GOOD', 'NO RE', 'GIT GUD', 'L + RATIO']
    },
    SIGMA_DINO: {
        name: 'SIGMA DINO',
        emoji: '🦖👔',
        health: 120,
        damage: 0,
        speed: 1,
        size: 75,
        color: '#1a1a2e',
        points: 300,
        coins: 36,
        traits: ['👔', '💼', '📈'],
        isSigma: true,
        deathMessages: ['GRINDSET INTERRUPTED', 'PASSIVE INCOME STOPPED', 'SIGMA RULE VIOLATED', 'BACK TO THE MATRIX']
    }
};

// ==================== SANTA SKINS ====================
export const SANTA_SKINS = {
    default: {
        name: 'Default Santa',
        emoji: '🎅',
        price: 0,
        color: '#ff0000',
        glowColor: '#ff4444',
        description: 'Classic Santa'
    },
    drip: {
        name: 'Drip Santa',
        emoji: '🎅💎',
        price: 500,
        color: '#00ffff',
        glowColor: '#00ffff',
        description: 'Iced out'
    },
    tactical: {
        name: 'Tactical Santa',
        emoji: '🎅🎯',
        price: 1000,
        color: '#556b2f',
        glowColor: '#6b8e23',
        description: 'Operator mode'
    },
    gigachad: {
        name: 'Gigachad Santa',
        emoji: '🎅💪',
        price: 2500,
        color: '#ffd700',
        glowColor: '#ffaa00',
        description: 'Built different'
    },
    sigma: {
        name: 'Sigma Santa',
        emoji: '🎅👔',
        price: 5000,
        color: '#1a1a2e',
        glowColor: '#4a4a6e',
        description: 'On the grind'
    }
};

// ==================== ACHIEVEMENTS ====================
export const ACHIEVEMENTS = {
    FIRST_BLOOD: {
        id: 'first_blood',
        name: 'FIRST BLOOD',
        description: 'First kill of the game',
        icon: '🩸'
    },
    WAVE_SURVIVOR: {
        id: 'wave_survivor',
        name: 'WAVE SURVIVOR',
        description: 'Complete a wave without damage',
        icon: '🛡️'
    },
    BUILT_DIFFERENT: {
        id: 'built_different',
        name: 'BUILT DIFFERENT',
        description: 'One-shot a Gigachad',
        icon: '💪'
    },
    SKILL_ISSUE: {
        id: 'skill_issue',
        name: 'SKILL ISSUE',
        description: 'Die on Wave 1',
        icon: '💀'
    },
    EASY_MODE: {
        id: 'easy_mode',
        name: 'IS THIS EASY MODE?',
        description: 'Reach Wave 10 without taking damage',
        icon: '😎'
    },
    BIG_SPENDER: {
        id: 'big_spender',
        name: 'BIG SPENDER',
        description: 'Spend 1000 coins in one shop visit',
        icon: '💰'
    },
    BOSS_SLAYER: {
        id: 'boss_slayer',
        name: 'BOSS SLAYER',
        description: 'Defeat your first boss',
        icon: '👑'
    },
    MEME_LORD: {
        id: 'meme_lord',
        name: 'MEME LORD',
        description: 'Use the Moai Cannon',
        icon: '🗿'
    }
};

// ==================== KILL STREAKS ====================
export const KILL_STREAK_TIERS = [
    { count: 2, name: 'DOUBLE KILL', color: '#ffff00' },
    { count: 3, name: 'TRIPLE KILL', color: '#ff8800' },
    { count: 4, name: 'OVERKILL', color: '#ff4400' },
    { count: 5, name: 'KILLTACULAR', color: '#ff00ff' },
    { count: 6, name: 'KILLIONAIRE', color: '#00ffff' },
    { count: 7, name: 'KILLPOCALYPSE', color: '#ff0000' },
    { count: 10, name: 'UNSTOPPABLE', color: '#ffd700' }
];

// ==================== DEATH SCREEN ====================
export const MEME_RATINGS = [
    { minScore: 0, rating: 'Actual NPC', color: '#888888' },
    { minScore: 1000, rating: 'Kinda Mid', color: '#888888' },
    { minScore: 5000, rating: 'Certified Decent', color: '#00ff00' },
    { minScore: 10000, rating: 'Built Different', color: '#00ffff' },
    { minScore: 25000, rating: 'Sigma Energy', color: '#ff00ff' },
    { minScore: 50000, rating: 'GIGACHAD', color: '#ffd700' }
];

export const LAST_WORDS = [
    '"skill issue"',
    '"I was lagging"',
    '"my mouse died"',
    '"not my fault"',
    '"rigged game"',
    '"built different (negatively)"',
    '"I let them win"',
    '"calculated L"',
    '"gg ez... wait"',
    '"I blame the dinosaurs"',
    '"Santa needed a break"',
    '"tactical defeat"',
    '"we go next"',
    '"ratio"',
    '"at least I tried"'
];

// ==================== BOSS NAMES ====================
export const BOSS_NAMES = {
    5: { name: 'CHADOSAURUS', title: 'Never Skips Leg Day', emoji: '🦖💪' },
    10: { name: 'PROFESSOR GAINS', title: 'PhD in Lifting', emoji: '🦖🎓' },
    15: { name: 'THE RATIO KING', title: 'Undefeated in Arguments', emoji: '🦖👑' },
    20: { name: 'ZYZZ-REX', title: 'Forever Mirin\'', emoji: '🦖✨' },
    25: { name: 'FINAL FORM CHAD', title: 'We\'re All Gonna Make It', emoji: '🦖🔥' }
};

// ==================== ENEMY DIALOGUE ====================
export const ENEMY_DIALOGUE = {
    GIGACHAD: {
        spawn: [
            'DO YOU EVEN LIFT, SANTA?',
            'THESE GAINS ARE ETERNAL',
            'MY PROTEIN SHAKE BRINGS ALL THE BOYS',
            'CREATINE-POWERED DESTRUCTION',
            'I\'M BUILT DIFFERENT',
            'WITNESS PEAK PERFORMANCE'
        ],
        attack: [
            'FEEL MY POWER!',
            'GAINS INCOMING!',
            'GET SWOLE\'D!',
            'NO PAIN NO GAIN!'
        ]
    },
    BUFF_NERD: {
        spawn: [
            'ACTUALLY...',
            'SKILL ISSUE DETECTED',
            'RATIO + L + NO REINDEER',
            'MY IQ IS OVER 9000',
            'STATISTICALLY, YOU LOSE',
            'I STUDIED THE BLADE'
        ],
        attack: [
            'CALCULATED!',
            'ACCORDING TO MY DATA...',
            'NERD RAGE!',
            'BRAIN DAMAGE!'
        ]
    },
    MINI_BOSS: {
        spawn: [
            'YOU DARE CHALLENGE ME?!',
            'I\'VE BEEN LIFTING SINCE THE JURASSIC',
            'WITNESS TRUE POWER!',
            'YOUR PRESENTS ARE WEAK!',
            'PREPARE TO BE RATIO\'D!'
        ],
        attack: [
            'FEEL MY WRATH!',
            'PATHETIC!',
            'IS THAT ALL?!',
            'BOW BEFORE ME!'
        ]
    },
    GAMER_DINO: {
        spawn: [
            'GAMING TIME! 🎮',
            'PRESS F TO PAY RESPECTS',
            'I HAVE RGB EVERYTHING',
            'MY SETUP COST MORE THAN YOUR SLEIGH',
            'TWITCH DROPS INCOMING',
            'SPONSORED BY G-FUEL'
        ],
        attack: [
            '360 NO SCOPE!',
            'GET REKT NOOB!',
            'HEADSHOT!',
            'SKILL DIFF!'
        ]
    },
    SIGMA_DINO: {
        spawn: [
            'No time for distractions 👔',
            'I walk my own path',
            'SIGMA RULE #1: Stay on the grind',
            'High value target passing through',
            'The grindset continues...',
            'No one can stop me'
        ],
        attack: [
            'I don\'t fight, I profit',
            'Violence is for betas'
        ]
    }
};

// ==================== SIGMA QUOTES ====================
export const SIGMA_QUOTES = [
    'On my grind...',
    'Sigma Rule #1: Never chase',
    'Sigma Rule #47: Walk away',
    'Passive income only',
    'I AM the high value target',
    'Built for the grind',
    'Money moves only',
    'No time for fights',
    'Self-improvement arc',
    'I go where I want'
];

// ==================== SHOPKEEPER DIALOGUE ====================
export const SHOPKEEPER_DIALOGUE = {
    rich: [
        'Ah, a person of wealth and taste! 💰',
        'Your grindset is immaculate, my friend.',
        'Now THIS is passive income energy!',
        'I see the market has been good to you.',
        'A fellow high-value individual!'
    ],
    broke: [
        'Broke? Sounds like a skill issue...',
        'No cap, you need to grind harder.',
        'Have you tried having more money?',
        'The sigma grindset is NOT strong here.',
        'Maybe try dodging more? Just a thought.'
    ],
    normal: [
        'These prices are bussin\' fr fr',
        'Buy something or get out of my emporium',
        'No cap, these weapons slap',
        'Welcome to the grind, traveler',
        'Everything here is certified fire 🔥',
        'The moai approves of your presence 🗿',
        'I was once like you... before the gains'
    ],
    purchase: [
        'STONKS! 📈',
        'A wise investment!',
        'That one\'s fire, no cap',
        'Based purchase',
        'You understand the grind'
    ]
};

// ==================== SIGMA ESCAPE TAUNTS ====================
export const SIGMA_ESCAPE_TAUNTS = [
    'Sigma escaped! Skill issue...',
    'Sigma got away! Should\'ve grinded harder',
    'The Sigma walks free. L.',
    'Couldn\'t stop the grindset!'
];

// ==================== TWITCH CHAT SYSTEM ====================
export const TWITCH_CHAT_CONFIG = {
    MAX_MESSAGES: 8,
    MESSAGE_DURATION_MS: 5000,
    MESSAGE_FADE_DURATION_MS: 500
};

export const TWITCH_CHAT_USERNAMES = [
    'xX_DinoSlayer_Xx',
    'GigaChadFan69',
    'SantaSimp420',
    'BuffDinoHater',
    'MLG_Snowball',
    'CritsForDays',
    'PresentWarlord',
    'Poggers_Pete',
    'NoobDestroyer99',
    'EpicGamer2024',
    'StreamSniper42',
    'TwitchChatter',
    'DonationAndy',
    'SubGifter9000',
    'LurkKing',
    'ModAbuser',
    'BitsMillionaire',
    'EmoteSpammer',
    'KappaKid',
    'OMEGALUL_Larry',
    'Sadge_Sam',
    'copium_carl',
    'ratJAM_Randy',
    'PogChamp_Paul',
    'monkaS_Mike',
    'Weirdge_Will'
];

export const TWITCH_CHAT_MESSAGES = {
    kill: [
        'POG',
        'POGGIES',
        'NICE',
        'CLEAN',
        'EZ Clap',
        'GET REKT',
        'SHEEEESH',
        'W',
        'GG',
        'SKILL',
        'NO MISS',
        'DIFF',
        'too easy',
        'aimbot?',
        'hes gaming',
        'built different',
        'HES CRACKED'
    ],
    death: [
        'F',
        'RIP',
        'NOOO',
        'LMAO',
        'skill issue',
        'L + ratio',
        'KEKW',
        'unlucky',
        'sadge',
        'WASTED',
        'get good',
        'RIPBOZO',
        'pack watch',
        'should have dodged',
        'Sadge',
        'widepeepoSad'
    ],
    bossSpawn: [
        'monkaS',
        'HERE WE GO',
        'BOSS TIME',
        'monkaW',
        'oh no no no',
        'PauseChamp',
        'ITS HAPPENING',
        'BIGBOSS',
        'ABSOLUTE UNIT',
        'WE LIVE',
        'peepoRun',
        'PogU BOSS'
    ],
    waveComplete: [
        'GGEZ',
        'TOO EASY',
        'LETS GO',
        'PogChamp',
        'W wave',
        'FREE',
        'next',
        'EZ GAME',
        'CLEAN WAVE',
        'GGWP',
        'nice wave',
        'no sweat'
    ],
    bossKill: [
        'LETS GOOOO',
        'HE DID IT',
        'PogU',
        'BOSS DOWN',
        'VICTORY',
        'GIGACHAD',
        'WE WON',
        'ratJAM VICTORY',
        'ABSOLUTE GAMING',
        'WHAT A GAMER'
    ]
};

// ==================== EASTER EGGS ====================
export const EASTER_EGG_CONFIG = {
    // Konami code sequence: up, up, down, down, left, right, left, right, b, a
    KONAMI_CODE: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'],
    // Special wave numbers
    NICE_WAVE: 69,
    DANK_WAVE: 420,
    // Hat clicks required for drip mode
    HAT_CLICKS_REQUIRED: 10,
    // Effect duration (in waves)
    SHRINK_SCALE: 0.5,  // Enemies shrink to 50% size
    // MORBIN code
    MORBIN_CODE: 'MORBIN'
};

export const EASTER_EGGS = {
    KONAMI: {
        id: 'konami',
        name: 'KONAMI SUPREMACY',
        description: 'Enter the Konami code',
        effect: 'All enemies shrink for one wave!',
        icon: '⬆️⬆️⬇️⬇️'
    },
    DRIP_MODE: {
        id: 'drip_mode',
        name: 'DRIP CHECK',
        description: 'Click Santa\'s hat 10 times',
        effect: 'Unlock secret DRIP MODE skin!',
        icon: '💎'
    },
    NICE: {
        id: 'nice',
        name: 'Nice.',
        description: 'Reach wave 69',
        effect: 'Nice.',
        icon: '😏'
    },
    DANK: {
        id: 'dank',
        name: 'DANK',
        description: 'Reach wave 420',
        effect: 'Dank screen flash!',
        icon: '🌿'
    },
    MORBIN: {
        id: 'morbin',
        name: 'IT\'S MORBIN\' TIME',
        description: 'Type MORBIN during gameplay',
        effect: 'All enemies become bats for one wave!',
        icon: '🦇'
    }
};

// Secret achievements for easter eggs
export const SECRET_ACHIEVEMENTS = {
    KONAMI_MASTER: {
        id: 'konami_master',
        name: 'KONAMI MASTER',
        description: 'Discovered the Konami code',
        icon: '🎮'
    },
    DRIP_LORD: {
        id: 'drip_lord',
        name: 'DRIP LORD',
        description: 'Unlocked DRIP MODE',
        icon: '💎'
    },
    NICE_GUY: {
        id: 'nice_guy',
        name: 'Nice.',
        description: 'Reached wave 69',
        icon: '😏'
    },
    DANK_MASTER: {
        id: 'dank_master',
        name: 'DANK MASTER',
        description: 'Reached wave 420 (legend)',
        icon: '🌿'
    },
    MORBIN_TIME: {
        id: 'morbin_time',
        name: 'IT\'S MORBIN\' TIME',
        description: 'Activated bat mode',
        icon: '🦇'
    }
};

// ==================== BACKGROUND MEME ELEMENTS (TASK-019) ====================
export const MEME_BACKGROUND_CONFIG = {
    // Doge on the moon (static, top-right corner)
    DOGE_MOON: {
        emoji: '🐕',
        x: 0.85,  // Percentage of canvas width
        y: 0.12,  // Percentage of canvas height
        size: 50,
        parallaxFactor: 0.1  // Subtle movement with mouse
    },
    // Floating elements configuration
    FLOATING_ELEMENTS: [
        { emoji: '🕶️', name: 'MLG Glasses', spawnChance: 0.002, speed: 0.5, size: 40 },
        { emoji: '🔺', name: 'Doritos', spawnChance: 0.002, speed: 0.3, size: 35 },
        { emoji: '🥤', name: 'Mountain Dew', spawnChance: 0.002, speed: 0.25, size: 38 },
        { emoji: '✈️', name: 'Airplane', spawnChance: 0.001, speed: 0.8, size: 45 }
    ],
    // Airplane banner messages
    AIRPLANE_BANNERS: [
        'SUBSCRIBE!',
        'GIT GUD',
        'NO CAP',
        'BUSSIN',
        'SIGMA MODE',
        'BASED',
        'POG',
        'W RIZZ'
    ],
    // Max floating elements on screen
    MAX_FLOATING_ELEMENTS: 8,
    // Parallax intensity for mouse movement
    PARALLAX_INTENSITY: 15
};

// ==================== DEATH TIPS (UX-008) ====================
export const DEATH_TIPS = {
    // Tips based on enemy type that killed the player
    byKiller: {
        'GIGACHAD DINO': [
            'Gigachads are slow but hit HARD. Keep your distance!',
            'Try kiting Gigachads - shoot while backing away.',
            'Upgrade damage to take down Gigachads faster.'
        ],
        'BUFF NERD DINO': [
            'Buff Nerds are fast! Prioritize them before they close in.',
            'Fire rate upgrades help against speedy Buff Nerds.',
            'Buff Nerds have low HP - focus fire to drop them quick.'
        ],
        'DINO OVERLORD': [
            'Boss fights require patience. Save your heal for phase 2!',
            'At 50% HP, the boss becomes vulnerable to the minigame.',
            'Keep moving during boss fights - their attacks are telegraphed.'
        ],
        'GAMER DINO': [
            'Gamer Dinos shoot back! Take them out first.',
            'Strafe side to side to dodge Gamer Dino projectiles.',
            'Gamer attacks hurt your combo - prioritize them!'
        ],
        'SIGMA DINO': [
            'Sigma Dinos don\'t attack - they drop bonus coins when killed!',
            'You can safely ignore Sigmas, but the coins are worth it.'
        ],
        'Boss Fireball': [
            'Watch for the boss fireball wind-up animation.',
            'Boss fireballs do splash damage - keep moving!',
            'Stay mobile during boss fights to avoid ranged attacks.'
        ],
        '360 NO SCOPE': [
            'Gamer Dinos do \"360 no scopes\" - prioritize killing them!',
            'The best defense against Gamer projectiles is offense.',
            'Fire rate helps you eliminate Gamers before they can shoot.'
        ]
    },
    // Tips based on damage taken from specific enemy types (most damage)
    byMostDamage: {
        'GIGACHAD DINO': [
            'You took the most damage from Gigachads - try keeping distance!',
            'Gigachads wrecked you. Consider upgrading max health.'
        ],
        'BUFF NERD DINO': [
            'Buff Nerds swarmed you! Fire rate upgrades help clear them fast.',
            'Those speedy nerds got you. Try the Candy Cane for faster shots.'
        ],
        'GAMER DINO': [
            'Gamer Dinos dealt tons of damage - prioritize shooting them first!',
            'You got out-gamed. Kill Gamers before they can attack.'
        ],
        'DINO OVERLORD': [
            'Boss damage adds up. Make sure to use your heal (E) wisely!',
            'Practice the vulnerable phase minigame - it\'s key to boss fights.'
        ]
    },
    // Tips based on wave number
    byWave: {
        early: [  // Waves 1-3
            'Early waves are for learning - focus on aim practice!',
            'Don\'t forget to open the shop between waves! [R]',
            'Save coins for key upgrades like damage and fire rate.'
        ],
        mid: [  // Waves 4-7
            'Mid-game is about efficiency - keep your combo going!',
            'Healing power (E) is crucial - get those 10 kills!',
            'Consider buying a new weapon from the shop.'
        ],
        late: [  // Waves 8+
            'Late-game is brutal - every upgrade counts!',
            'Prestige upgrades unlock after maxing basic stats.',
            'Keep your combo alive for huge score multipliers!'
        ],
        boss: [  // Boss waves (5, 10, 15...)
            'Boss waves are tough! Make sure you\'re upgraded first.',
            'The minigame at 50% HP is crucial - practice clicking fast!',
            'Boss fights reward patience - don\'t panic shoot.'
        ]
    },
    // Generic tips (used as fallback)
    generic: [
        'Keep moving! Standing still makes you an easy target.',
        'Open the shop between waves with [R] to spend coins.',
        'Build up your combo for score multipliers!',
        'Healing power (E) fully restores HP - save it for emergencies.',
        'Critical hits deal 2x damage - upgrade crit chance for big numbers!',
        'Different weapons have different fire rates and damage.',
        'Watch the heal bar - it charges with every kill!',
        'Bosses appear every 5 waves - prepare accordingly!'
    ]
};
