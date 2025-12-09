# 🦖 DINO DOOM: Task Breakdown 🦖

Tasks broken down into 2-4 hour chunks. Each task is self-contained and testable.

---

## 🟠 CODE QUALITY TASKS (December 2024 Code Review)

### REFACTOR-006: Refactor audio.js Switch Statement to Data-Driven
**Estimate**: 2-3 hours
**Priority**: Low
**File**: `js/systems/audio.js:46-248`

The `playSound()` function has 18 case statements. Refactor to a sound definition map:
```javascript
const SOUND_DEFS = {
  shoot: { type: 'sine', startFreq: 200, endFreq: 50, duration: 0.1, ... },
  // ...
};
```

**Acceptance Criteria**:
- [ ] Create `SOUND_DEFS` constant with all sound definitions
- [ ] Refactor `playSound()` to use the definition map
- [ ] All existing sounds work identically
- [ ] Easier to add new sounds

---

### REFACTOR-007: Cache DOM References at Initialization
**Estimate**: 1-2 hours
**Priority**: Medium
**Files**: `js/game.js`, `js/classes/Enemy.js`, `js/systems/boss.js`

Repeated `document.getElementById()` calls in the game loop and on every hit. Cache these references at initialization for better performance.

**Locations**:
- `js/classes/Enemy.js:364` - `boss-health-bar` queried on every hit
- `js/game.js` - Various HUD elements
- `js/systems/boss.js` - Phase indicator elements

**Acceptance Criteria**:
- [ ] Create cached DOM reference object during initialization
- [ ] Replace repeated `getElementById()` calls with cached references
- [ ] No performance regression in gameplay

---

### REFACTOR-008: Extract Draw Method Magic Numbers
**Estimate**: 1-2 hours
**Priority**: Low
**File**: `js/classes/Enemy.js:524-606`

Drawing ratios like `size * 0.5`, `size * 0.2`, `size * 0.4`, etc. are magic numbers. Extract to named constants for readability.

**Example**:
```javascript
const ENEMY_DRAW = {
  SHADOW_WIDTH_RATIO: 0.5,
  SHADOW_HEIGHT_RATIO: 0.2,
  BODY_WIDTH_RATIO: 0.4,
  // ...
};
```

**Acceptance Criteria**:
- [ ] Create `ENEMY_DRAW` constants
- [ ] Update Enemy.draw() to use constants
- [ ] Visual output identical to before

---

### REFACTOR-009: Standardize Cooldown Naming Convention
**Estimate**: 30 minutes
**Priority**: Low
**Files**: `js/classes/Enemy.js`, `js/state.js`

Inconsistent naming:
- `fireCooldown` (player)
- `shootCooldown` (boss)
- `rangedCooldown` (gamer dino)

Pick one convention (`attackCooldown` recommended) and standardize.

**Acceptance Criteria**:
- [ ] Rename all cooldown variables to consistent naming
- [ ] Update all references
- [ ] All tests pass

---

### REFACTOR-010: Add Floating Texts Array Bounds
**Estimate**: 1 hour
**Priority**: Low
**File**: `js/state.js`, `js/game.js`

The `floatingTexts` array could grow unbounded during intense gameplay. Add maximum limit similar to particle pool.

**Acceptance Criteria**:
- [ ] Add `MAX_FLOATING_TEXTS` constant (e.g., 50)
- [ ] Prevent array from exceeding limit
- [ ] Old texts removed when limit reached (FIFO)

---

### Previously Completed Code Quality Tasks
All previous code quality tasks completed! See archived section below.

---

## 🟡 REMAINING FEATURE TASKS

All P2 feature tasks completed! Continuing with stretch goals.

---

## 🔴 UX/ENJOYMENT ISSUES (Enjoyment Assessment Findings)

These issues were identified during a comprehensive UX enjoyment assessment and impact player satisfaction and engagement.

### UX-001: Late-Game Progression Cliff ✅ COMPLETE
See archived section for implementation details.

---

### UX-002: Combo System Fragility ✅ COMPLETE
See archived section for implementation details.

---

### UX-003: Shop Visibility/Discovery Problem ✅ COMPLETE
See archived section for implementation details.

---

### UX-004: Boss Minigame Flow Disruption ✅ COMPLETE
See archived section for implementation details.

---

### UX-005: Missing Audio Volume Control ✅ COMPLETE
**Completed**: Implemented as part of TASK-015 (MLG Sound Pack)
See archived section for implementation details.

---

### UX-006: Healing Power Progress Unclear ✅ COMPLETE
See archived section for implementation details.

---

### UX-007: Boss Health Bar Missing Phase Indicators ✅ COMPLETE
See archived section for implementation details.

---

### UX-008: Death Screen Lacks Actionable Feedback ✅ COMPLETE
See archived section for implementation details.

---

### UX-009: Weapon Switching Lacks Feedback ✅ COMPLETE
See archived section for implementation details.

---

### UX-010: Sigma Dino RNG Creates Inconsistent Difficulty ✅ COMPLETE
See archived section for implementation details.

---

## 🟢 STRETCH GOAL TASKS

---

### TASK-017: Fake Twitch Chat ✅ COMPLETE
**Estimate**: 3-4 hours
**Priority**: P3
**Dependencies**: None

**Completed**: See archived section for implementation details.

---

### TASK-018: Easter Eggs Collection ✅ COMPLETE
**Estimate**: 3-4 hours
**Priority**: P3
**Dependencies**: None

**Completed**: See archived section for implementation details.

---

### TASK-019: Background Meme Elements ✅ COMPLETE
**Completed**: See archived section for implementation details.

---

### TASK-020: Advanced Boss Phases ✅ COMPLETE
**Completed**: See archived section for implementation details.

---

## 📊 TASK SUMMARY

| Priority | Count | Total Estimate |
|----------|-------|----------------|
| P0 (Critical Bugs) | 0 | ✅ Complete |
| P1 (UX/Enjoyment - High) | 0 | ✅ Complete |
| P2 (UX/Enjoyment - Medium) | 0 | ✅ Complete |
| P3 (UX/Enjoyment - Low) | 0 | ✅ Complete |
| P3 (Stretch Features) | 3 (3 done) | ✅ Complete |
| **TOTAL** | **0** | **✅ All Done!** |

**Note**: All code quality refactoring tasks, TASK-014, TASK-015, TASK-016, TASK-017, TASK-018, TASK-019, TASK-020, UX-001, UX-002, UX-003, UX-004, UX-005, UX-006, UX-007, UX-008, UX-009, and UX-010 completed and archived. UX issues identified via enjoyment assessment.

---

## 🏃 SUGGESTED ORDER

**Phase 1: Code Quality** ✅ COMPLETE
All refactoring tasks completed!

**Phase 2: Core Features** ✅ COMPLETE
- TASK-014 (Combo Counter) ✅ - Core gameplay enhancement done!
- TASK-016 (Deep Fried Mode) ✅ - Meme visual effects done!

**Phase 3: High-Impact UX Fixes** ✅ COMPLETE
- UX-001 (Late-Game Progression) ✅ - Prestige upgrades system added!
- UX-002 (Combo System Fragility) ✅ - Combo decay system added!

**Phase 4: Medium-Impact UX Fixes** ✅ COMPLETE
- UX-003 (Shop Visibility) ✅ - New player experience
- UX-004 (Boss Minigame Flow) ✅ - FPS-consistent weak points!
- UX-005 (Volume Control) ✅ - Implemented in TASK-015
- UX-010 (Sigma RNG) ✅ - Difficulty consistency

**Phase 5: Low-Impact Polish & Stretch Goals** ✅ COMPLETE
- UX-006 (Healing Progress) ✅ - Clearer heal status
- UX-007 (Boss Phase Indicators) ✅ - Phase threshold visibility
- UX-008 (Death Screen Tips) ✅ - Context-aware death tips
- UX-009 (Weapon Feedback) ✅ - Equip sound and toast
- TASK-017 (Fake Twitch Chat) ✅ - Chat overlay reacts to gameplay!
- TASK-018 (Easter Eggs) ✅ - Konami code, MORBIN mode, wave 69/420!
- TASK-019 (Background Memes) ✅ - Floating meme elements in background!
- TASK-020 (Boss Phase Transitions) ✅ - Epic phase cutscenes!

---

## ✅ ARCHIVED (Completed Tasks)

<details>
<summary>Click to expand completed tasks</summary>

### BUG-001: Fix Race Condition in Boss Intro Cutscene ✅
**Completed**: Commit `1549434`
- Added gameState.running check before unpausing after cutscene
- Player dying during boss intro no longer breaks game state
- Boss intro correctly canceled if game ends

### BUG-002: Add localStorage Error Handling ✅
**Completed**: Commit `1549434`
- Wrapped loadSkinState and saveSkinState in try-catch
- Game works in private browsing mode
- No uncaught exceptions from localStorage

### BUG-003: Add Null Checks for DOM Elements ✅
**Completed**: Commit `1549434`
- Added null checks in playBossIntro, spawnBoss
- Added null check for boss health bar updates
- Game handles missing DOM elements gracefully

### BUG-004: Fix Array Modification During Iteration ✅
**Completed**: Commit `1549434`
- Changed from immediate splice to markedForRemoval flag
- Enemies filtered out in game loop after all updates
- No array index errors during gameplay

### BUG-005: Clear Timeouts on Game Restart ✅
**Completed**: Commit `1549434`
- Added activeTimeouts tracking array
- All setTimeout calls now tracked
- Timeouts cleared in startGame() for clean restart

### BUG-006: Add Audio Context Resume Logic ✅
**Completed**: Commit `1549434`
- Added audioCtx.resume() call in initAudio
- Audio works on first user interaction
- No silent gameplay due to suspended context

### TASK-001: Hit Markers System ✅
**Completed**: Commit `6528448`
- White X appears on regular hits
- Gold X appears on critical hits
- Sound plays on each hit
- Markers fade smoothly

### TASK-002: Kill Streak Announcements ✅
**Completed**: Commit `9e7dbe4`
- Kill streak tracked correctly with 3s window
- Each tier has unique text and sound
- Animation is smooth and readable
- Streak resets after 3s of no kills

### TASK-003: Enemy Dialogue Bubbles ✅
**Completed**: Commit `191c49c`
- Bubbles render above enemies correctly
- Different dialogue per enemy type
- Bubbles don't spam (max 2 visible)
- Smooth fade in/out animation

### TASK-004: Screen Shake System ✅
**Completed**: Commit `32d431a`
- Shake function works with different intensities
- Shakes feel impactful but not nauseating
- Multiple shakes can queue/overlap smoothly
- No visual artifacts after shake ends

### TASK-005: Meme Death Screen ✅
**Completed**: Commit `e270396`
- Death screen shows all stats
- Rating calculated correctly
- Copy button works (clipboard API)
- Looks like a meme receipt

### TASK-006: New Weapon - Moai Cannon ✅
**Completed**: Commit `9b67e90`
- Weapon appears in shop
- Can purchase and equip
- Projectile renders as spinning moai
- "Yo, Angelo" appears on hit

### TASK-007: New Weapon - Doot Cannon ✅
**Completed**: Commit `5342d4c`
- Weapon purchasable in shop
- Doot sound plays on fire
- Skull trail effect works
- Skeleton flash on kill

### TASK-008: Achievement Toast System ✅
**Completed**: Commit `4a70dcd`
- Toast appears on achievement unlock
- Each achievement only triggers once per game
- Animation is smooth
- Sound plays on unlock

### TASK-009: New Enemy - Gamer Dino ✅
**Completed**: Commit `7d39d87`
- Enemy spawns in waves (wave 3+)
- RGB glow effect visible
- Ranged attack works
- Unique death messages

### TASK-010: New Enemy - Sigma Dino ✅
**Completed**: Commit `2326219`
- Sigma spawns rarely
- Walks across screen without attacking
- Drops bonus coins
- Has unique dialogue

### TASK-011: Boss Intro Cutscenes ✅
**Completed**: Commit `21b04c3`
- Intro plays before boss fight starts
- Unique name/title per boss wave
- Animation is dramatic and fun
- Gameplay pauses during intro

### TASK-012: Shop Keeper NPC ✅
**Completed**: Commit `116e383`
- Shopkeeper visible in shop
- Dialogue changes based on coins
- Reacts to purchases
- Shop renamed to "THE GRINDSET EMPORIUM"

### TASK-013: Santa Skins System ✅
**Completed**: Commit `34b219d`
- Skin selector on start screen
- Can purchase skins with coins
- Selected skin affects weapon visuals
- Persists between sessions

### BUG-007: Fix Overly Permissive Shop Guard Condition ✅
**Completed**: Commit `dcf80cd`
- Changed `&&` to `||` in openShop() guard clause
- Shop cannot be opened after game over
- Shop can only be opened between waves when game is running

### BUG-008: Simplify Confusing Enemy Cleanup Logic ✅
**Completed**: Commit `dcf80cd`
- Replaced confusing double-filter ternary with reverse-order for-loop
- Code is now readable and maintainable
- Uses markedForRemoval flag consistently

### BUG-009: Fix Inconsistent Enemy Removal in Minigame ✅
**Completed**: Commit `dcf80cd`
- Boss now uses markedForRemoval flag like regular enemies
- Removed direct splice from enemies array
- Consistent removal pattern across codebase

### BUG-010: Standardize Upgrade Application in applyUpgrades() ✅
**Completed**: Commit `dcf80cd`
- Added player.damageBonus and player.fireRateBonus
- All upgrades now applied consistently in applyUpgrades()
- Player state properly initialized and reset

### REFACTOR-002: Consolidate Duplicate Achievement Check ✅
**Completed**: Modular codebase refactor
- Created `checkShopAchievements()` in `js/systems/achievements.js:108-113`
- Both weapon and upgrade purchases call centralized function
- Single source of truth for BIG_SPENDER achievement logic
- Shop spending tracked via `achievementTracking.shopSpending`

### REFACTOR-001: Extract Magic Numbers to Constants ✅
**Completed**: Code quality refactor
- Added `PERSPECTIVE_SCALE` and `PERSPECTIVE_MIN_Z` to GAME_CONFIG
- Added spawn position constants: `SIGMA_SPAWN_X`, `SIGMA_SPAWN_Z_BASE`, `SIGMA_SPAWN_Z_RANGE`, `ENEMY_SPAWN_X_RANGE`, `ENEMY_SPAWN_Z_BASE`, `ENEMY_SPAWN_Z_RANGE`
- Updated all classes to use constants: `js/ui.js`, `js/classes/Particle.js`, `js/classes/Projectile.js`, `js/classes/Enemy.js`, `js/classes/EnemyProjectile.js`, `js/classes/GamerProjectile.js`, `js/systems/dialogue.js`
- Updated `js/game.js` to use spawn position constants

### REFACTOR-003: Add Object Pooling for Particles ✅
**Completed**: Performance optimization
- Added `particlePool` array and `MAX_POOL_SIZE` constant to `js/state.js`
- Added `getParticle()` function to get particles from pool or create new
- Added `returnParticle()` function to return expired particles to pool
- Added `reset()` method to `Particle` class
- Updated `js/classes/Enemy.js` to use `getParticle()` instead of `new Particle()`
- Updated `js/game.js` to call `returnParticle()` when particles expire

### REFACTOR-004: Remove Unused Code ✅
**Completed**: Code cleanup
- Removed unused `keys` object from `js/state.js`
- Removed unused `setKeyState()` function from `js/state.js`
- Removed `setKeyState` import and usage from `js/main.js`
- Keyboard events still work for spacebar shooting, E healing, R shop

### REFACTOR-005: Add Error Handling to playSound ✅
**Completed**: Error handling
- Added try-catch blocks to `playSound()` function
- Added try-catch blocks to `playHitMarkerSound()` function
- Added try-catch blocks to `playKillStreakSound()` function
- Game gracefully degrades if audio fails (continues without sound)

### TASK-014: Combo Counter System ✅
**Completed**: Core gameplay feature
- Added `comboState` to `js/state.js` for tracking consecutive kills
- Created new `js/systems/combo.js` with combo logic:
  - `incrementCombo()` - increments on enemy kill
  - `breakCombo()` - resets when player takes damage
  - `getComboMultiplier()` - returns score bonus multiplier
  - `getComboBonus()` - calculates bonus points
  - `showWomboComboAnnouncement()` - displays "WOMBO COMBO!" at 10+ kills
- Added combo counter element to `index.html`
- Added CSS animations for combo display and WOMBO COMBO effect
- Integrated combo system into Enemy class (die/attack methods)
- Combo resets on both melee attacks and enemy projectile damage
- Score floating text shows combo bonus when active

### TASK-015: MLG Sound Pack ✅
**Completed**: Feature implementation
- Added 5 MLG sound functions to `js/systems/audio.js`:
  - `playTripleKillSound()` - "OH BABY A TRIPLE" voice-like tones
  - `playAirhorn()` - MLG airhorn chord (A major)
  - `playMomGetTheCamera()` - excited voice effect for 5+ streaks
  - `playSadViolin()` - mournful melody with vibrato on death
  - `playWowSound()` - "WOW" formant sweep on boss defeat
- Added volume control system:
  - `masterVolume` variable for global volume
  - `getVolume()` and `setVolume()` functions
  - All sound functions respect master volume
- Added volume slider UI:
  - Volume control in start screen (`index.html`)
  - Styled slider in `css/styles.css`
  - Event listener in `js/main.js`
- Hooked sounds to game events:
  - `js/systems/killstreak.js` - triple kill and 5+ streak sounds
  - `js/systems/achievements.js` - airhorn on wave complete, WOW on boss defeat
  - `js/game.js` - sad violin on death

### TASK-016: Deep Fried Mode ✅
**Completed**: Meme visual effects
- Added `deepFriedState` to `js/state.js` for tracking mode enabled state
- Created new `js/systems/deepfried.js` with deep fried mode logic:
  - `initDeepFriedSystem()` - initializes toggle button and loads saved state
  - `toggleDeepFriedMode()` - toggles mode and saves to localStorage
  - `applyDeepFriedEffect()` - adds/removes CSS class on game container
  - `spawnLensFlare()` - spawns emoji lens flares at screen position
  - `createLensFlareSpawner()` - creates canvas-bound spawner for world coordinates
- Added toggle button to start screen in `index.html`
- Added chromatic aberration and lens flare container elements
- Added CSS animations: deepFriedPulse, chromaticAberration, chromaticShift, textDistort, lensFlareAnim
- CSS filters: saturate(3), contrast(1.5), brightness(1.2) when enabled
- Lens flare emojis spawn on enemy kills
- State persists in localStorage
- Can be disabled for performance

### TASK-017: Fake Twitch Chat ✅
**Completed**: Fake Twitch chat overlay feature
- Added `TWITCH_CHAT_CONFIG`, `TWITCH_CHAT_USERNAMES`, `TWITCH_CHAT_MESSAGES` to `js/constants.js`
  - Config for max messages (8), duration (5s), fade duration (0.5s)
  - 26 unique Twitch-style usernames
  - Event messages for: kill, death, bossSpawn, waveComplete, bossKill
- Created new `js/systems/chat.js` with chat system logic:
  - `addChatMessage()` - adds message to chat overlay
  - `triggerChatEvent()` - triggers random messages for event type
  - `onChatKill()` - 30% chance to trigger kill messages
  - `onChatDeath()` - multiple death reaction messages
  - `onChatBossSpawn()` - boss spawn excitement messages
  - `onChatWaveComplete()` - wave clear celebration messages
  - `onChatBossKill()` - big celebration for boss kills
  - `clearChat()` / `initChatSystem()` - chat reset on game start
  - `setChatEnabled()` / `isChatEnabled()` - toggle functionality
- Added chat container to `index.html`:
  - Purple-themed header with "LIVE CHAT" title
  - Fake viewer count display
  - Messages container with scrolling support
- Added CSS styling in `css/styles.css`:
  - Twitch-purple theme (#9147ff)
  - Slide-in animation for new messages
  - Fade-out animation for old messages
  - Semi-transparent background for visibility
- Integrated chat with game events:
  - `js/game.js` - imports chat functions, clears on start, triggers on death
  - `js/classes/Enemy.js` - triggers kill/boss kill chat on enemy death
  - `js/systems/achievements.js` - triggers wave complete chat
  - `js/systems/boss.js` - triggers boss spawn chat
- Added unit tests in `tests/systems.test.js` and `tests/constants.test.js`

### UX-001: Late-Game Progression Cliff ✅
**Completed**: Prestige upgrades system for late-game progression
- Added `PRESTIGE_UPGRADES` constant in `js/constants.js` with 5 prestige upgrades:
  - Overkill (+5% damage multiplier per level)
  - Bullet Hell (+5% fire rate per level)
  - Titan Health (+10% max HP per level)
  - Critical Mass (+2% crit chance per level)
  - Coin Magnet (+10% coin drops per level)
- Updated `js/state.js`:
  - Added `prestigeUpgrades` tracking in inventory
  - Added player multiplier properties (damageMultiplier, fireRateMultiplier, healthMultiplier, coinMultiplier)
  - Updated `resetInventory()` and `resetPlayerState()` to reset prestige state
- Updated `js/systems/shop.js`:
  - Added `areAllBasicUpgradesMaxed()` function
  - Added `getPrestigeUpgradePrice()` for scaling prices
  - Added `getCoinMultiplier()` function
  - Added `renderPrestigeUpgrades()` function
  - Updated `applyUpgrades()` to apply prestige multipliers
- Updated game mechanics:
  - `js/classes/Projectile.js` - Damage multiplier applied
  - `js/game.js` - Fire rate multiplier applied
  - `js/classes/Enemy.js` - Coin multiplier applied to rewards
  - `js/ui.js` - Display shows damage with multiplier
- Added prestige section to `index.html` shop screen
- Added CSS styling for prestige upgrades in `css/styles.css`
  - Glowing orange theme
  - Pulsing animations for section and info text

### UX-002: Combo System Fragility ✅
**Completed**: Combo decay system for more forgiving combo gameplay
- Added combo decay constants in `js/constants.js`:
  - `COMBO_DECAY_BASE_PERCENT: 50` - Base: lose 50% of combo on hit
  - `COMBO_DECAY_HIGH_PERCENT: 40` - At 10+ combo: lose only 40%
  - `COMBO_DECAY_VERY_HIGH_PERCENT: 30` - At 20+ combo: lose only 30%
  - `COMBO_HIGH_THRESHOLD: 10` - Threshold for reduced decay
  - `COMBO_VERY_HIGH_THRESHOLD: 20` - Threshold for even more reduced decay
  - `COMBO_DAMAGE_COOLDOWN_MS: 1000` - Brief invulnerability (1s) to prevent multi-hit combo breaks
- Updated `js/state.js`:
  - Added `lastDamageTime: 0` to `comboState` for tracking cooldown
  - Updated `resetComboState()` to reset `lastDamageTime`
- Updated `js/systems/combo.js`:
  - Added `getComboDecayPercent()` - Returns decay percentage based on combo level
  - Added `isComboProtected()` - Checks if combo is protected by damage cooldown
  - Refactored `breakCombo()` to decay combo instead of full reset:
    - Checks damage cooldown to prevent rapid multi-hit combo breaks
    - Calculates decay based on current combo level (higher combos = more forgiving)
    - Uses `Math.ceil()` to ensure at least 1 combo is lost
    - Only resets `showWomboCombo` if below threshold
- Benefits:
  - Single hit doesn't completely destroy large combos
  - Players can maintain combos through reasonable gameplay
  - Higher combos are more forgiving (reward for building up combo)
  - Brief invulnerability prevents frustrating multi-hit combo breaks

### UX-003: Shop Visibility/Discovery Problem ✅
**Completed**: Shop available indicator with sound feedback
- Added shop indicator element to `index.html`:
  - Pulsing "SHOP AVAILABLE!" indicator with cart emoji
  - "[R]" key hint for new players
  - Shows after wave completion (non-boss waves)
- Added `shop_available` sound effect in `js/systems/audio.js`:
  - Cha-ching style triangle wave sound
  - Plays when indicator appears
- Added CSS styling in `css/styles.css`:
  - Gold/amber gradient background
  - `shopIndicatorPulse` animation for attention
  - `shopIconBounce` animation for cart icon
  - Positioned at bottom center, non-obstructive
- Added shop indicator functions in `js/systems/shop.js`:
  - `showShopIndicator()` - Shows indicator and plays sound
  - `hideShopIndicator()` - Hides indicator
- Integrated with game flow in `js/game.js`:
  - Shows indicator on wave completion (non-boss)
  - Hides before shop opens

### UX-005: Missing Audio Volume Control ✅
**Completed**: Implemented as part of TASK-015 (MLG Sound Pack)
- Added volume control system in `js/systems/audio.js`:
  - `masterVolume` variable for global volume control
  - `getVolume()` and `setVolume()` functions
  - All sound functions respect master volume setting
- Added volume slider UI in `index.html`:
  - Volume control on start screen
  - Range slider (0-100%)
- Added CSS styling in `css/styles.css`:
  - Styled slider matching game theme
- Added event listener in `js/main.js`:
  - Slider updates volume in real-time
- All synthesized sounds (shoot, hit, kill, etc.) respect volume setting

### UX-006: Healing Power Progress Unclear ✅
**Completed**: Clearer healing status with audio feedback
- Updated `js/ui.js` heal bar display:
  - Changed from "X / 10 kills" to "X more kills needed"
  - Added `heal-ready` class when heal is available
  - Changed bar color from green to gold when ready
- Added `heal_ready` sound in `js/systems/audio.js`:
  - Musical ascending tone (C5-E5-G5 arpeggio)
  - Plays when heal becomes available
- Updated `js/classes/Enemy.js`:
  - Plays `heal_ready` sound when healReady becomes true
- Added CSS animations in `css/styles.css`:
  - `healReadyPulse` - Pulsing glow effect on container
  - `healTextGlow` - Text shadow animation
  - Gold color scheme when ready

### UX-007: Boss Health Bar Missing Phase Indicators ✅
**Completed**: Phase threshold marker on boss health bar
- Added phase indicator elements to `index.html`:
  - `#boss-phase-marker` - Vertical line at 50% position
  - `#boss-phase-label` - "⚠️ PHASE 2" label above marker
- Updated `css/styles.css`:
  - `#boss-health-bar-bg` now has `position: relative` and `overflow: visible`
  - `#boss-phase-marker` - Gold 3px line with glow effect at 50%
  - `#boss-phase-label` - Pulsing label positioned above marker
  - `@keyframes phaseIndicatorPulse` - Subtle opacity animation
- Players can now anticipate boss minigame phase transition

### UX-008: Death Screen Lacks Actionable Feedback ✅
**Completed**: Context-aware death tips help players learn
- Added `damageHistory` to `js/state.js`:
  - Tracks damage taken by enemy type
  - Tracks hit count by enemy type
  - `recordDamage()` function to log damage
  - `resetDamageHistory()` for game restart
- Added `DEATH_TIPS` constant in `js/constants.js`:
  - Tips by killer type (Gigachad, Buff Nerd, Gamer, Boss, etc.)
  - Tips by most damaging enemy
  - Tips by wave category (early, mid, late, boss)
  - Generic fallback tips
- Updated `js/systems/death.js`:
  - `getMostDamagingEnemy()` - Analyzes damage history
  - `getWaveCategory()` - Categorizes wave for tip selection
  - `generateDeathTip()` - Context-aware tip generation
  - `getDamageSummary()` - Damage breakdown display
- Updated `index.html`:
  - Added `#stat-tip` element in death receipt
  - "PRO TIP:" section with green styling
- Updated `css/styles.css`:
  - `.receipt-tip` - Green gradient background with border
  - `.tip-label` - Glowing green label
  - `.tip-text` - Readable tip text styling
- Death receipt clipboard copy now includes the tip
- Players get actionable advice based on how they died

### UX-009: Weapon Switching Lacks Feedback ✅
**Completed**: Equip sound and visual toast notification
- Added `equip` sound in `js/systems/audio.js`:
  - Satisfying click/swoosh rising tone
  - Uses sine wave with frequency ramp
- Updated `js/systems/shop.js`:
  - Changed weapon equip to use `playSound('equip')` instead of `playSound('buy')`
  - Added `showEquipToast()` function - displays "EQUIPPED!" toast with weapon emoji
  - Toast auto-dismisses after 1.5s with fade animation
- Added CSS styling in `css/styles.css`:
  - `.equip-toast` - Green gradient, centered, bold styling
  - `@keyframes equipToastIn` - Scale-up entrance animation
  - `@keyframes equipToastOut` - Scale-up exit animation
  - `@keyframes equipEmojiPulse` - Emoji bounce effect

### UX-004: Boss Minigame Flow Disruption ✅
**Completed**: Replaced click-based minigame with FPS-consistent 3D weak points
- Created new `js/classes/WeakPoint.js`:
  - Shootable 3D targets that spawn around the boss during vulnerability phase
  - Floating animation, pulsing effect, lifetime expiration
  - One-shot destruction with particles and floating damage text
  - Visual "🎯 WEAK POINT" labels above targets
- Updated `js/systems/minigame.js`:
  - Removed game pause during vulnerability phase
  - Boss becomes "stunned" instead of invulnerable (can still be shot)
  - Spawns 3D weak points around the boss
  - HUD overlay shows timer and hits (not full-screen takeover)
  - Damage bonus applied based on weak points hit
- Updated `js/state.js`:
  - Added `weakPoints` array for 3D weak point entities
  - Added to `clearEntities()` function
- Updated `js/classes/Enemy.js`:
  - Added `stunned` property for boss vulnerability phase
  - Stunned enemies only wobble, don't move or attack
  - "STUNNED - SHOOT WEAK POINTS!" indicator during vulnerability
- Updated `js/game.js`:
  - Import and handle weak points array
  - Collision detection for projectiles hitting weak points
  - Update and draw weak points in game loop
  - Boss tutorial integration before wave 5
- Updated `js/systems/boss.js`:
  - Added `showBossTutorial()` function
  - Added `shouldShowBossTutorial()` check
  - Added `resetBossTutorial()` for game restart
- Added boss tutorial in `index.html`:
  - Informative popup before first boss (wave 5)
  - Explains 50% HP vulnerability and weak point shooting
  - "Keep shooting - the game won't pause!" reminder
- Updated CSS in `css/styles.css`:
  - `.hud-mode` class for minigame screen as HUD overlay
  - `@keyframes vulnerablePulse` for pulsing title
  - Boss tutorial styling with popup animation
- Benefits:
  - No jarring context switch during boss fights
  - Maintains FPS gameplay flow throughout
  - Players understand mechanic before first encounter
  - Skill transfers from main gameplay to boss vulnerability phase

### UX-010: Sigma Dino RNG Creates Inconsistent Difficulty ✅
**Completed**: Sigma spawn cap and wave-based spawn rate
- Added spawn cap constants in `js/constants.js`:
  - `SIGMA_MAX_PER_WAVE: 2` - Maximum sigmas per wave
  - `SIGMA_BASE_SPAWN_CHANCE: 0.04` - 4% base chance
  - `SIGMA_SPAWN_CHANCE_PER_WAVE: 0.01` - +1% per wave
  - `SIGMA_MAX_SPAWN_CHANCE: 0.12` - 12% maximum chance
- Added `sigmaSpawnedThisWave` tracker in `js/state.js`:
  - Tracks sigmas spawned in current wave
  - Reset in `resetGameState()`
- Updated `js/game.js`:
  - Added `getSigmaSpawnChance()` - Calculates wave-based spawn rate
  - Updated `spawnEnemy()` to check sigma cap before spawning
  - Increments counter when sigma spawns
  - Reset counter at start of each wave in `spawnWave()`
- Benefits:
  - No more waves with 4+ sigmas (capped at 2)
  - Spawn chance increases with wave difficulty
  - More consistent wave difficulty
  - Skilled play matters more than RNG

### TASK-018: Easter Eggs Collection ✅
**Completed**: Hidden easter eggs for the dedicated players
- Added `EASTER_EGG_CONFIG`, `EASTER_EGGS`, `SECRET_ACHIEVEMENTS` to `js/constants.js`:
  - Konami code sequence for shrink enemies effect
  - MORBIN code for bat mode
  - Wave 69/420 special wave effects
  - Hat clicks required (10) for DRIP MODE unlock
- Created new `js/systems/eastereggs.js`:
  - `initEasterEggSystem()` - Loads from localStorage, sets up hat click listener
  - `handleKonamiCode()` - Tracks Konami code input (↑↑↓↓←→←→BA)
  - `handleMorbinCode()` - Tracks MORBIN letter sequence
  - `checkWaveEasterEggs()` - Checks for wave 69 ("Nice.") and wave 420 ("Dank")
  - `applyEasterEggEffectsToEnemy()` - Applies shrink/bat effects to enemies
  - `showEasterEggNotification()` - Shows discovery toast with pink gradient
  - Visual announcements for each easter egg (MORBIN, Nice., Dank)
- Updated `js/state.js`:
  - Added `easterEggState` with `discoveredEggs`, `activeEffects`, code tracking
  - Added `loadEasterEggState()` / `saveEasterEggState()` for localStorage persistence
  - Added `discoverEasterEgg()` / `isEasterEggDiscovered()` functions
  - Added `resetEasterEggEffects()` / `resetEasterEggInput()` for game restart
- Updated `js/main.js`:
  - Import and initialize easter egg system
  - Added keydown listeners for Konami code and MORBIN detection
- Updated `js/game.js`:
  - Check wave easter eggs on wave start
  - Apply easter egg effects to spawned enemies
  - Reset effects on game restart
- Updated `js/systems/boss.js`:
  - Apply easter egg effects to bosses
- Added CSS animations in `css/styles.css`:
  - Easter egg toast styling (pink gradient, slide-in animation)
  - MORBIN announcement (dark red, pulsing)
  - Nice. announcement (pink, wiggle animation)
  - Dank announcement (green flash, spinning entry)
  - Santa hat hover/unlock effects
- Easter Eggs implemented:
  - **Konami Code** (↑↑↓↓←→←→BA): All enemies shrink for one wave
  - **DRIP MODE** (Click Santa hat 10x): Unlocks drip skin permanently
  - **Wave 69**: Displays "Nice." announcement
  - **Wave 420**: Green screen flash with "DANK" text
  - **MORBIN** (Type MORBIN): All enemies become 🦇 bats for one wave
- All eggs tracked in localStorage with secret achievements

### TASK-019: Background Meme Elements ✅
**Completed**: Floating background meme elements feature
- Added floating background meme elements:
  - **Doge on the moon**: Static element in top-right corner with subtle parallax
  - **MLG Glasses** (🕶️): Random floating elements
  - **Doritos** (🔺): Floating chip triangles
  - **Mountain Dew** (🥤): Floating soda cups
  - **Airplanes** (✈️): Flying across with meme banners ("SUBSCRIBE", "LIKE & SHARE", etc.)
- Mouse-based parallax effect for depth perception
- Toggle button on start screen to enable/disable
- State persists in localStorage
- Files modified:
  - `js/constants.js` - Added BACKGROUND_MEMES config (DOGE_MOON, FLOATING_MEMES, AIRPLANE_BANNERS, PARALLAX_INTENSITY)
  - `js/ui.js` - Added `updateMemeElements()` and `drawMemeElements()` functions
  - `js/state.js` - Added `backgroundMemesState`, load/save/toggle functions
  - `js/main.js` - Added `initBackgroundMemesSystem()` and toggle button listener
  - `index.html` - Added background memes toggle button

### TASK-020: Advanced Boss Phases ✅
**Completed**: Enhanced boss fights with multi-phase mechanics
- Enhanced boss fights with 3 phases:
  - **Phase 1 (100-50% HP)**: Normal attacks with base damage/cooldown
  - **Phase 2 (50-25% HP)**: Boss puts on sunglasses (😎 overlay), +50% damage, 25% faster attacks
  - **Phase 3 (25-0% HP)**: Boss ASCENDS with floating animation, +100% damage, 50% faster attacks, meteors rain down (☄️)
- Phase transition mini-cutscene overlay with dramatic visuals:
  - Phase 2: "SUNGLASSES MODE ACTIVATED" with warning sounds
  - Phase 3: "ASCENSION COMPLETE" with epic chord and fire effects
- Boss invulnerable during 2-second transitions
- Boss health bar shows phase markers at 50% and 25%
- Phase 3 adds screen shake and red vignette effect
- Phase-specific sounds: warning beeps for phase 2, D minor ascending chord for phase 3
- Files modified:
  - `js/constants.js` - Added 10 new boss phase constants
  - `js/classes/Enemy.js` - Added phase tracking, phase-based attack patterns, meteor rain, ascend animation, visual changes per phase
  - `js/classes/EnemyProjectile.js` - Added meteor support with different behavior
  - `js/systems/boss.js` - Added triggerPhaseTransition(), clearPhaseEffects(), phase overlay functions
  - `js/systems/audio.js` - Added boss_phase2, boss_phase3 sounds with warning/ascension effects
  - `js/game.js` - Added phase transition callback
  - `index.html` - Added boss phase overlay and phase 3 marker
  - `css/styles.css` - Added phase transition animations, screen effects

</details>

---

*All bugs squashed! Time to get this bread 🍞💪*
