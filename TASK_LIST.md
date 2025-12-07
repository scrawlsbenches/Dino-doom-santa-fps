# 🦖 DINO DOOM: Task Breakdown 🦖

Tasks broken down into 2-4 hour chunks. Each task is self-contained and testable.

---

## 🟠 CODE QUALITY TASKS (Medium Priority from Code Review)

### REFACTOR-001: Extract Magic Numbers to Constants
**Estimate**: 2 hours
**Priority**: P2 (Medium)
**Source**: Code Review

**Issue**: Many hardcoded values without explanation throughout the codebase.

**Examples**:
```javascript
const minZ = -80;  // What does this represent?
const hitRadius = 60 + (e.size / 3);  // Why this formula?
if (-e.z < 50 || -e.z > 2000) return;  // Render distance?
```

**Fix**: Create a CONSTANTS section:
```javascript
const GAME_CONSTANTS = {
    RENDER_MIN_DISTANCE: 50,
    RENDER_MAX_DISTANCE: 2000,
    ENEMY_MIN_Z_POSITION: -80,
    HIT_RADIUS_BASE: 60,
    HIT_RADIUS_SIZE_FACTOR: 3,
    PERSPECTIVE_SCALE: 400,
    KILL_STREAK_TIMEOUT_MS: 3000,
    // ... etc
};
```

**Acceptance Criteria**:
- [ ] All magic numbers extracted to constants
- [ ] Constants have descriptive names
- [ ] Code is more self-documenting

---

### REFACTOR-002: Consolidate Duplicate Achievement Check
**Estimate**: 30 minutes
**Priority**: P2 (Medium)
**Source**: Code Review

**Issue**: BIG_SPENDER achievement check is duplicated in weapons and upgrades purchase handlers.

**Locations**:
- `SantaGigaChadDino.htm:3412-3416`
- `SantaGigaChadDino.htm:3449-3453`

**Fix**: Extract to helper function:
```javascript
function trackShopSpending(amount) {
    achievementTracking.shopSpending += amount;
    if (achievementTracking.shopSpending >= 1000) {
        unlockAchievement('BIG_SPENDER');
    }
}
```

**Acceptance Criteria**:
- [ ] Single source of truth for spending logic
- [ ] Achievement still triggers correctly

---

### REFACTOR-003: Add Object Pooling for Particles
**Estimate**: 2 hours
**Priority**: P2 (Medium)
**Source**: Code Review

**Issue**: Each particle is created with `new`, causing GC pressure during intense gameplay.

**Location**: `SantaGigaChadDino.htm:3121-3157`

**Fix**:
```javascript
const particlePool = [];
const MAX_POOL_SIZE = 200;

function getParticle(x, y, z, color) {
    let p = particlePool.pop();
    if (!p) {
        p = new Particle(x, y, z, color);
    } else {
        p.reset(x, y, z, color);
    }
    return p;
}

function returnParticle(p) {
    if (particlePool.length < MAX_POOL_SIZE) {
        particlePool.push(p);
    }
}
```

**Acceptance Criteria**:
- [ ] Particles reused from pool
- [ ] No performance regression
- [ ] Reduced GC pauses during intense combat

---

### REFACTOR-004: Remove Unused Code
**Estimate**: 30 minutes
**Priority**: P3 (Low)
**Source**: Code Review

**Issue**: The `keys` object tracks keyboard state but is never used (WASD movement isn't implemented).

**Location**: `SantaGigaChadDino.htm:1333`

**Fix**: Either implement WASD movement or remove the tracking:
```javascript
// Remove these lines if not implementing movement:
let keys = {};
document.addEventListener('keydown', (e) => { keys[e.key] = true; ... });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });
```

**Acceptance Criteria**:
- [ ] No unused code remains
- [ ] OR WASD movement implemented

---

### REFACTOR-005: Add Error Handling to playSound
**Estimate**: 30 minutes
**Priority**: P3 (Low)
**Source**: Code Review

**Issue**: `playSound()` doesn't handle oscillator creation failures (can happen if audio context limit is reached).

**Location**: `SantaGigaChadDino.htm:1564-1688`

**Fix**:
```javascript
function playSound(type) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        // ... rest of sound code
    } catch (e) {
        console.warn('Failed to play sound:', e);
    }
}
```

**Acceptance Criteria**:
- [ ] No crashes from audio errors
- [ ] Graceful degradation if audio fails

---

## 🟡 REMAINING FEATURE TASKS

### TASK-014: Combo Counter System
**Estimate**: 2-3 hours
**Priority**: P2
**Dependencies**: None

**Scope**:
- Track consecutive kills without taking damage
- Display combo counter in corner: "COMBO x5"
- At 10+ combo, show "WOMBO COMBO" text effect
- Combo multiplier affects score: combo * 10% bonus
- Combo resets when player takes damage
- Visual/audio feedback when combo increases

**Files to modify**: `SantaGigaChadDino.htm`

**Acceptance Criteria**:
- [ ] Combo counter displays correctly
- [ ] Score multiplier works
- [ ] "WOMBO COMBO" triggers at 10
- [ ] Resets on damage

---

## 🟢 STRETCH GOAL TASKS

### TASK-015: MLG Sound Pack
**Estimate**: 4 hours (max 1 day)
**Priority**: P3
**Dependencies**: TASK-001, TASK-002

**Scope**:
- Create Web Audio API synthesized sounds for:
  - "OH BABY A TRIPLE" (for triple kills)
  - MLG airhorn (wave complete)
  - "MOM GET THE CAMERA" (for 5+ kill streaks)
  - Sad violin (player death)
  - "WOW" sound (boss defeat)
- Sounds should be procedurally generated, not audio files
- Add volume slider in settings

**Files to modify**: `SantaGigaChadDino.htm`

**Acceptance Criteria**:
- [ ] All sounds implemented via Web Audio
- [ ] Sounds trigger at correct moments
- [ ] Volume control works
- [ ] No audio clipping/distortion

---

### TASK-016: Deep Fried Mode
**Estimate**: 2-3 hours
**Priority**: P3
**Dependencies**: None

**Scope**:
- Add toggle in start screen for "DEEP FRIED MODE"
- When enabled:
  - Apply CSS filters: saturate(3) contrast(1.5) brightness(1.2)
  - Add chromatic aberration effect
  - Random lens flare emojis appear on kills
  - Text gets "deep fried" distortion
- Performance consideration: can be toggled off

**Files to modify**: `SantaGigaChadDino.htm`

**Acceptance Criteria**:
- [ ] Toggle on start screen
- [ ] Visual effects apply correctly
- [ ] Emojis appear on kills
- [ ] Can be disabled for performance

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

**Files to modify**: `SantaGigaChadDino.htm`

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

**Files to modify**: `SantaGigaChadDino.htm`

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

**Files to modify**: `SantaGigaChadDino.htm`

**Acceptance Criteria**:
- [ ] Background elements visible
- [ ] Don't obstruct gameplay
- [ ] Parallax effect works
- [ ] Can be disabled in settings

---

### TASK-020: Advanced Boss Phases
**Estimate**: 4 hours (max 1 day)
**Priority**: P3
**Dependencies**: TASK-011 (completed)

**Scope**:
- Enhance boss fights with phases:
  - Phase 1 (100-50% HP): Normal attacks
  - Phase 2 (50-25% HP): Puts on sunglasses, +50% damage, new attack pattern
  - Phase 3 (25-0% HP): ASCENDS (floats), rains meteors, screen effects
- Each phase transition has mini-cutscene
- Boss health bar shows phase thresholds
- Different music intensity per phase

**Files to modify**: `SantaGigaChadDino.htm`

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
| P2 (Medium/Refactor) | 4 | 5-7 hours |
| P3 (Low/Features) | 8 | 21-29 hours |
| **TOTAL** | **12** | **26-36 hours** |

---

## 🏃 SUGGESTED ORDER

**Phase 1: Code Quality**
1. REFACTOR-001 (Magic Numbers) - Maintainability
2. REFACTOR-002 (Duplicate Code) - DRY principle
3. REFACTOR-003 (Object Pooling) - Performance

**Phase 2: Features**
4. TASK-014 (Combo Counter) - Core gameplay
5. Continue with stretch goals based on interest

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

</details>

---

*All bugs squashed! Time to get this bread 🍞💪*
