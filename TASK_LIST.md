# 🦖 DINO DOOM: Task Breakdown 🦖

Tasks broken down into 2-4 hour chunks. Each task is self-contained and testable.

---

## 🟠 CODE QUALITY TASKS (Medium Priority from Code Review)

All code quality tasks completed! See archived section below.

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

### UX-004: Boss Minigame Flow Disruption
**Estimate**: 3-4 hours
**Priority**: P2 (Medium Impact)
**Dependencies**: None

**Problem**:
The clicking minigame at 50% boss HP completely breaks the FPS gameplay flow. Players go from "aim and shoot at moving target" to "click stationary spawning circles." This jarring transition interrupts combat momentum and feels like a different game.

**Symptoms**:
- Momentum loss during boss fights
- Players confused by sudden mechanic change
- Minigame skill doesn't transfer from main gameplay
- Boss fights feel inconsistent

**Suggested Solutions**:
- Replace minigame with "weak point" shooting (aim at glowing spots on boss)
- Make minigame optional with time-limited vulnerability window
- Keep minigame but make targets appear in 3D space (shoot them like enemies)
- Add minigame tutorial/warning before first boss

**Files to modify**:
- `js/systems/boss.js` - Minigame mechanics
- `js/ui.js` - Weak point rendering if applicable
- `index.html` - Minigame area modifications

**Acceptance Criteria**:
- [ ] Boss vulnerability phase uses FPS-consistent mechanics
- [ ] No jarring context switch during combat
- [ ] Players understand mechanic before first encounter

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

### UX-008: Death Screen Lacks Actionable Feedback
**Estimate**: 2 hours
**Priority**: P3 (Low Impact)
**Dependencies**: None

**Problem**:
Death screen shows stats but doesn't provide actionable information. "Cause of Death" shows enemy type but not useful context. No tips or suggestions for improvement. Players don't learn what to do differently.

**Symptoms**:
- Players repeat same mistakes
- No learning loop from deaths
- "Skill issue" meme is funny but unhelpful
- Missed coaching opportunity

**Suggested Solutions**:
- Add "Tip:" section with context-aware advice
- Show which enemy type dealt most damage that run
- Add "You died X times to [enemy]" tracking
- Include wave-specific tips (e.g., "Try upgrading fire rate for Gamer Dinos")

**Files to modify**:
- `js/systems/death.js` - Death analysis logic
- `js/state.js` - Track damage sources
- `index.html` - Tip display element

**Acceptance Criteria**:
- [ ] Death screen includes helpful tip
- [ ] Tips are contextual to how player died
- [ ] Players feel they learned something

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

### TASK-018: Easter Eggs Collection
**Estimate**: 3-4 hours
**Priority**: P3
**Dependencies**: None

**Scope**:
- Implement hidden easter eggs:
  - Konami code: All enemies shrink for one wave
  - Click Santa's hat 10x on start: Enable "DRIP MODE" skin
  - Wave 69: Display "Nice." achievement
  - Wave 420: Screen flashes green, "Dank" text
  - Type "MORBIN": All enemies become bats for one wave
- Track discovered eggs in localStorage
- Secret achievements for finding eggs

**Files to modify**:
- `js/systems/eastereggs.js` (new) - Easter egg detection & effects
- `js/state.js` - Track discovered eggs
- `js/constants.js` - Secret achievements
- `js/main.js` - Input detection for codes

**Acceptance Criteria**:
- [ ] All easter eggs functional
- [ ] Tracked in localStorage
- [ ] Hidden achievements unlock
- [ ] Don't break normal gameplay

---

### TASK-019: Background Meme Elements
**Estimate**: 2-3 hours
**Priority**: P3
**Dependencies**: None

**Scope**:
- Add floating background elements:
  - Doge on the moon (static, in corner)
  - Occasional flying MLG glasses
  - Doritos/Mountain Dew floating in space
  - Airplanes with meme banners
- Elements don't interfere with gameplay
- Subtle parallax effect when "moving"

**Files to modify**:
- `js/ui.js` - Render background elements (in `drawBackground()`)
- `js/constants.js` - Meme element configurations
- `js/state.js` - Toggle setting

**Acceptance Criteria**:
- [ ] Background elements visible
- [ ] Don't obstruct gameplay
- [ ] Parallax effect works
- [ ] Can be disabled in settings

---

### TASK-020: Advanced Boss Phases
**Estimate**: 4 hours (max 1 day)
**Priority**: P3
**Dependencies**: TASK-011 ✅ (completed)

**Scope**:
- Enhance boss fights with phases:
  - Phase 1 (100-50% HP): Normal attacks
  - Phase 2 (50-25% HP): Puts on sunglasses, +50% damage, new attack pattern
  - Phase 3 (25-0% HP): ASCENDS (floats), rains meteors, screen effects
- Each phase transition has mini-cutscene
- Boss health bar shows phase thresholds
- Different music intensity per phase

**Files to modify**:
- `js/systems/boss.js` - Phase logic and transitions
- `js/classes/Enemy.js` - Boss phase state tracking
- `js/ui.js` - Phase threshold markers on health bar
- `js/systems/audio.js` - Phase-specific music/sounds

**Acceptance Criteria**:
- [ ] Phases trigger at correct HP thresholds
- [ ] Visual changes per phase
- [ ] New attacks in later phases
- [ ] Phase transitions feel epic

---

## 📊 TASK SUMMARY

| Priority | Count | Total Estimate |
|----------|-------|----------------|
| P0 (Critical Bugs) | 0 | ✅ Complete |
| P1 (UX/Enjoyment - High) | 0 | ✅ Complete |
| P2 (UX/Enjoyment - Medium) | 1 | 3-4 hours |
| P3 (UX/Enjoyment - Low) | 1 | 2 hours |
| P3 (Stretch Features) | 3 (1 done) | 9-11 hours |
| **TOTAL** | **4** | **14-17 hours** |

**Note**: All code quality refactoring tasks, TASK-014, TASK-015, TASK-016, TASK-017, UX-001, UX-002, UX-003, UX-005, UX-006, UX-007, UX-009, and UX-010 completed and archived. UX issues identified via enjoyment assessment.

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

**Phase 4: Medium-Impact UX Fixes** (Mostly Complete)
- UX-003 (Shop Visibility) ✅ - New player experience
- UX-004 (Boss Minigame Flow) - Combat consistency
- UX-005 (Volume Control) ✅ - Implemented in TASK-015
- UX-010 (Sigma RNG) ✅ - Difficulty consistency

**Phase 5: Low-Impact Polish & Stretch Goals** (Mostly Complete)
- UX-006 (Healing Progress) ✅ - Clearer heal status
- UX-007 (Boss Phase Indicators) ✅ - Phase threshold visibility
- UX-008 (Death Screen Tips) - Pending
- UX-009 (Weapon Feedback) ✅ - Equip sound and toast
- TASK-017 (Fake Twitch Chat) ✅ - Chat overlay reacts to gameplay!
- TASK-018 through TASK-020 (Fun features)

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

</details>

---

*All bugs squashed! Time to get this bread 🍞💪*
