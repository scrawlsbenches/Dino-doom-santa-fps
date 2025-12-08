# 🦖 DINO DOOM: Task Breakdown 🦖

Tasks broken down into 2-4 hour chunks. Each task is self-contained and testable.

---

## 🟠 CODE QUALITY TASKS (Medium Priority from Code Review)

All code quality tasks completed! See archived section below.

---

## 🟡 REMAINING FEATURE TASKS

All P2 feature tasks completed! Continuing with stretch goals.

---

## 🟢 STRETCH GOAL TASKS

### TASK-015: MLG Sound Pack
**Estimate**: 4 hours (max 1 day)
**Priority**: P3
**Dependencies**: TASK-001 ✅, TASK-002 ✅ (both complete)

**Scope**:
- Create Web Audio API synthesized sounds for:
  - "OH BABY A TRIPLE" (for triple kills)
  - MLG airhorn (wave complete)
  - "MOM GET THE CAMERA" (for 5+ kill streaks)
  - Sad violin (player death)
  - "WOW" sound (boss defeat)
- Sounds should be procedurally generated, not audio files
- Add volume slider in settings

**Files to modify**:
- `js/systems/audio.js` - New sound functions
- `js/systems/killstreak.js` - Hook MLG sounds to streaks
- `js/systems/death.js` - Sad violin on death
- `index.html` / `css/styles.css` - Volume slider UI

**Acceptance Criteria**:
- [ ] All sounds implemented via Web Audio
- [ ] Sounds trigger at correct moments
- [ ] Volume control works
- [ ] No audio clipping/distortion

---

### TASK-017: Fake Twitch Chat
**Estimate**: 3-4 hours
**Priority**: P3
**Dependencies**: None

**Scope**:
- Add scrolling chat overlay in corner
- Fake "viewers" react to gameplay:
  - Kill: "POG", "NICE", "CLEAN"
  - Death: "F", "RIP", "NOOO"
  - Boss spawn: "monkaS", "HERE WE GO", "BOSS TIME"
  - Wave clear: "GGEZ", "TOO EASY", "LETS GO"
- Random usernames: "xX_DinoSlayer_Xx", "GigaChadFan69", etc.
- Messages scroll up and fade

**Files to modify**:
- `js/constants.js` - Chat messages and usernames
- `js/systems/chat.js` (new) - Chat system logic
- `js/ui.js` - Render chat overlay
- `css/styles.css` - Chat styling
- `index.html` - Chat container element

**Acceptance Criteria**:
- [ ] Chat visible during gameplay
- [ ] Messages react to events
- [ ] Variety of usernames and messages
- [ ] Smooth scrolling animation

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
| P1 (High Bugs) | 0 | ✅ Complete |
| P2 (Medium/Refactor) | 0 | ✅ Complete |
| P3 (Low/Features) | 5 | 16-22 hours |
| **TOTAL** | **5** | **16-22 hours** |

**Note**: All code quality refactoring tasks, TASK-014, and TASK-016 completed and archived.

---

## 🏃 SUGGESTED ORDER

**Phase 1: Code Quality** ✅ COMPLETE
All refactoring tasks completed!

**Phase 2: Core Features** ✅ COMPLETE
- TASK-014 (Combo Counter) ✅ - Core gameplay enhancement done!

**Phase 3: Stretch Goals**
- TASK-016 (Deep Fried Mode) ✅ - Meme visual effects done!
Continue with remaining stretch goals based on interest (TASK-015, TASK-017 through TASK-020).

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

</details>

---

*All bugs squashed! Time to get this bread 🍞💪*
