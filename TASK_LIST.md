# 🦖 DINO DOOM: Task Breakdown 🦖

Tasks broken down into 2-4 hour chunks. Each task is self-contained and testable.

---

## 🔴 MVP TASKS (Do First)

### TASK-001: Hit Markers System
**Estimate**: 2-3 hours
**Priority**: P0
**Dependencies**: None

**Scope**:
- Add visual hit marker (white X) that appears at crosshair on enemy hit
- Add hit marker sound effect (short "tick" sound)
- Different color for critical hits (yellow/gold X)
- Hit marker fades out over 200ms
- Add headshot detection zone for enemies (top 30% = headshot)

**Files to modify**: `SantaGigaChadDino.htm`

**Acceptance Criteria**:
- [ ] White X appears on regular hits
- [ ] Gold X appears on critical hits
- [ ] Sound plays on each hit
- [ ] Markers fade smoothly

---

### TASK-002: Kill Streak Announcements
**Estimate**: 2-3 hours
**Priority**: P0
**Dependencies**: None

**Scope**:
- Track consecutive kills within 3-second windows
- Display announcement text center-screen:
  - 2 kills: "DOUBLE KILL"
  - 3 kills: "TRIPLE KILL"
  - 4 kills: "OVERKILL"
  - 5 kills: "KILLTACULAR"
  - 6+ kills: "KILLIONAIRE"
- Add corresponding sound effects (escalating intensity)
- Announcement animates in (scale up) and fades out

**Files to modify**: `SantaGigaChadDino.htm`

**Acceptance Criteria**:
- [ ] Kill streak tracked correctly with 3s window
- [ ] Each tier has unique text and sound
- [ ] Animation is smooth and readable
- [ ] Streak resets after 3s of no kills

---

### TASK-003: Enemy Dialogue Bubbles
**Estimate**: 3-4 hours
**Priority**: P0
**Dependencies**: None

**Scope**:
- Create speech bubble component that appears above enemies
- Trigger dialogue on:
  - Enemy spawn (50% chance)
  - Enemy attack
  - Boss entrance (100%)
- Dialogue pool per enemy type:
  - Gigachad: gym/gains quotes
  - Buff Nerd: intellectual flex quotes
  - Boss: dramatic villain quotes
- Bubble appears for 2 seconds then fades
- Maximum 2 bubbles on screen at once

**Files to modify**: `SantaGigaChadDino.htm`

**Dialogue examples**:
```
Gigachad: "DO YOU EVEN LIFT?", "THESE GAINS ARE ETERNAL", "CREATINE-POWERED"
Buff Nerd: "ACTUALLY...", "SKILL ISSUE DETECTED", "RATIO + L"
Boss: "YOU DARE CHALLENGE ME?", "WITNESS TRUE POWER"
```

**Acceptance Criteria**:
- [ ] Bubbles render above enemies correctly
- [ ] Different dialogue per enemy type
- [ ] Bubbles don't spam (max 2 visible)
- [ ] Smooth fade in/out animation

---

### TASK-004: Screen Shake System
**Estimate**: 2 hours
**Priority**: P0
**Dependencies**: None

**Scope**:
- Create reusable screen shake function with parameters:
  - intensity (pixels of displacement)
  - duration (ms)
  - decay (how quickly it settles)
- Trigger shake on:
  - Player takes damage (medium shake)
  - Enemy dies (small shake)
  - Boss slam attacks (large shake)
  - Critical hits (small shake)
- Apply shake via CSS transform on game container

**Files to modify**: `SantaGigaChadDino.htm`

**Acceptance Criteria**:
- [ ] Shake function works with different intensities
- [ ] Shakes feel impactful but not nauseating
- [ ] Multiple shakes can queue/overlap smoothly
- [ ] No visual artifacts after shake ends

---

### TASK-005: Meme Death Screen
**Estimate**: 3-4 hours
**Priority**: P0
**Dependencies**: None

**Scope**:
- Redesign game over screen with "receipt" style layout
- Include stats:
  - Waves survived
  - Dinos eliminated
  - Total score
  - Coins earned
  - Cause of death (last enemy type that hit you)
  - Time survived
- Generate meme rating based on performance:
  - <1000: "Actual NPC"
  - 1000-5000: "Kinda Mid"
  - 5000-10000: "Certified Decent"
  - 10000-25000: "Built Moderately Different"
  - 25000+: "GIGACHAD"
- "COPY TO CLIPBOARD" button for sharing
- Random "last words" from a pool

**Files to modify**: `SantaGigaChadDino.htm`

**Acceptance Criteria**:
- [ ] Death screen shows all stats
- [ ] Rating calculated correctly
- [ ] Copy button works (clipboard API)
- [ ] Looks like a meme receipt

---

### TASK-006: New Weapon - Moai Cannon
**Estimate**: 2-3 hours
**Priority**: P1
**Dependencies**: None

**Scope**:
- Add new weapon to WEAPONS object:
  - emoji: 🗿
  - damage: 70
  - fireRate: 25
  - speed: 18
  - price: 1500
- Projectile is a spinning 🗿
- On hit, briefly show "Yo, Angelo" text
- Stone sound effect on fire

**Files to modify**: `SantaGigaChadDino.htm`

**Acceptance Criteria**:
- [ ] Weapon appears in shop
- [ ] Can purchase and equip
- [ ] Projectile renders as spinning moai
- [ ] "Yo, Angelo" appears on hit

---

### TASK-007: New Weapon - Doot Cannon
**Estimate**: 2-3 hours
**Priority**: P1
**Dependencies**: None

**Scope**:
- Add new weapon to WEAPONS object:
  - emoji: 🎺
  - damage: 45
  - fireRate: 15
  - speed: 22
  - price: 800
- Plays "doot" sound on fire (trumpet note)
- Projectile leaves trail of 💀 emojis
- Skeleton appears briefly on kill

**Files to modify**: `SantaGigaChadDino.htm`

**Acceptance Criteria**:
- [ ] Weapon purchasable in shop
- [ ] Doot sound plays on fire
- [ ] Skull trail effect works
- [ ] Skeleton flash on kill

---

### TASK-008: Achievement Toast System
**Estimate**: 3-4 hours
**Priority**: P1
**Dependencies**: TASK-002 (kill streaks)

**Scope**:
- Create toast notification component (top-right corner)
- Toast slides in from right, stays 3s, slides out
- Achievement types:
  - "FIRST BLOOD" - First kill of the game
  - "WAVE SURVIVOR" - Complete a wave without damage
  - "BUILT DIFFERENT" - One-shot a Gigachad
  - "SKILL ISSUE" - Die on Wave 1
  - "IS THIS EASY MODE?" - Reach Wave 10 without taking damage
  - "BIG SPENDER" - Spend 1000 coins in shop
- Track achievements in session (don't repeat)
- Play achievement sound

**Files to modify**: `SantaGigaChadDino.htm`

**Acceptance Criteria**:
- [ ] Toast appears on achievement unlock
- [ ] Each achievement only triggers once per game
- [ ] Animation is smooth
- [ ] Sound plays on unlock

---

## 🟡 NICE TO HAVE TASKS

### TASK-009: New Enemy - Gamer Dino
**Estimate**: 3-4 hours
**Priority**: P2
**Dependencies**: None

**Scope**:
- Add new enemy type GAMER_DINO:
  - emoji: 🦕🎮
  - health: 100
  - damage: 20
  - speed: 2.5
  - Has RGB color cycling glow effect
  - Special: Every 5 seconds, yells "360 NO SCOPE" and does a ranged attack
- Ranged attack is a slow-moving 🎯 projectile
- On death, drops gaming-related text ("GG", "EZ", "GET GOOD")

**Files to modify**: `SantaGigaChadDino.htm`

**Acceptance Criteria**:
- [ ] Enemy spawns in waves (wave 3+)
- [ ] RGB glow effect visible
- [ ] Ranged attack works
- [ ] Unique death messages

---

### TASK-010: New Enemy - Sigma Dino
**Estimate**: 2-3 hours
**Priority**: P2
**Dependencies**: None

**Scope**:
- Add new enemy type SIGMA_DINO:
  - emoji: 🦖👔
  - health: 120
  - damage: 0 (doesn't attack!)
  - speed: 1 (walks slowly across screen)
  - Drops 3x coins on death
- Behavior: Ignores player, walks from one side to another
- Says "On my grind" or "Sigma rule #X" occasionally
- If player doesn't kill before it leaves, taunts them

**Files to modify**: `SantaGigaChadDino.htm`

**Acceptance Criteria**:
- [ ] Sigma spawns rarely (10% chance per wave)
- [ ] Walks across screen without attacking
- [ ] Drops bonus coins
- [ ] Has unique dialogue

---

### TASK-011: Boss Intro Cutscenes
**Estimate**: 3-4 hours
**Priority**: P2
**Dependencies**: None

**Scope**:
- Create 3-second boss intro sequence:
  - Screen darkens
  - Boss slides in from top
  - Name + title appear with dramatic font
  - Boss does a pose (sprite animation or emoji swap)
  - Flash effect, then gameplay resumes
- Unique names per boss wave:
  - Wave 5: "CHADOSAURUS - Never Skips Leg Day"
  - Wave 10: "PROFESSOR GAINS - PhD in Lifting"
  - Wave 15: "THE RATIO KING - Undefeated in Arguments"
  - Wave 20: "ZYZZ-REX - Forever Mirin'"

**Files to modify**: `SantaGigaChadDino.htm`

**Acceptance Criteria**:
- [ ] Intro plays before boss fight starts
- [ ] Unique name/title per boss wave
- [ ] Animation is dramatic and fun
- [ ] Gameplay pauses during intro

---

### TASK-012: Shop Keeper NPC
**Estimate**: 2-3 hours
**Priority**: P2
**Dependencies**: None

**Scope**:
- Add shopkeeper to shop screen (Rare Pepe 🐸 or Moai 🗿)
- Displays random dialogue when shop opens
- Dialogue changes based on player's coins:
  - Rich (>2000): "Ah, a fellow person of wealth"
  - Broke (<100): "Broke? Sounds like a skill issue"
  - Normal: Random meme quote
- Rename shop to "THE GRINDSET EMPORIUM"
- Shopkeeper reacts to purchases

**Files to modify**: `SantaGigaChadDino.htm`

**Acceptance Criteria**:
- [ ] Shopkeeper visible in shop
- [ ] Dialogue changes based on coins
- [ ] Reacts to purchases
- [ ] Shop renamed

---

### TASK-013: Santa Skins System
**Estimate**: 4 hours
**Priority**: P2
**Dependencies**: None

**Scope**:
- Add skin selection to start screen
- Skins are cosmetic only (different colors/effects on weapon view)
- Available skins:
  - Default Santa (free)
  - Drip Santa - chains emoji overlay (500 coins)
  - Tactical Santa - camo colors (1000 coins)
  - Gigachad Santa - extra jawline (2500 coins)
- Skins persist in localStorage
- Selected skin shown in weapon render

**Files to modify**: `SantaGigaChadDino.htm`

**Acceptance Criteria**:
- [ ] Skin selector on start screen
- [ ] Can purchase skins with coins
- [ ] Selected skin affects weapon visuals
- [ ] Persists between sessions

---

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
  - Random lens flare emojis (😂🔥💯) appear on kills
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
  - Konami code (↑↑↓↓←→←→BA): All enemies shrink for one wave
  - Click Santa's hat 10x on start: Enable "DRIP MODE" skin
  - Wave 69: Display "Nice." achievement
  - Wave 420: Screen flashes green, "Dank" text
  - Type "MORBIN": All enemies become 🦇 for one wave
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
**Dependencies**: TASK-011

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
| P0 (MVP) | 5 | 12-16 hours |
| P1 (MVP) | 3 | 7-10 hours |
| P2 (Nice) | 6 | 16-21 hours |
| P3 (Stretch) | 6 | 18-23 hours |
| **TOTAL** | **20** | **53-70 hours** |

---

## 🏃 SUGGESTED ORDER

1. TASK-004 (Screen Shake) - Quick win, big impact
2. TASK-001 (Hit Markers) - Core feel improvement
3. TASK-003 (Enemy Dialogue) - Meme factor boost
4. TASK-002 (Kill Streaks) - Dopamine system
5. TASK-005 (Death Screen) - Shareability
6. TASK-008 (Achievements) - Engagement loop
7. TASK-006/007 (New Weapons) - Content variety
8. Continue with P2/P3 based on feedback

---

*Let's get this bread 🍞💪*
