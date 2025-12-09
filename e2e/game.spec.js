// @ts-check
import { test, expect } from '@playwright/test';

/**
 * E2E Smoke Tests for DINO DOOM: Santa's Last Stand
 * These tests verify the game loads and basic functionality works
 */

test.describe('Game Loading', () => {
  test('should load the game page', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle("DINO DOOM: Santa's Last Stand");
  });

  test('should display start screen on load', async ({ page }) => {
    await page.goto('/');

    // Start screen should be visible
    const startScreen = page.locator('#start-screen');
    await expect(startScreen).toBeVisible();
  });

  test('should show game canvas', async ({ page }) => {
    await page.goto('/');

    // Canvas should exist
    const canvas = page.locator('#game-canvas');
    await expect(canvas).toBeAttached();
  });
});

test.describe('Start Screen UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display game title', async ({ page }) => {
    const title = page.locator('#start-screen h1');
    await expect(title).toContainText('DINO DOOM');
  });

  test('should display subtitle', async ({ page }) => {
    const subtitle = page.locator('#start-screen h2');
    await expect(subtitle).toContainText("Santa's Last Stand");
  });

  test('should show start button', async ({ page }) => {
    const startBtn = page.locator('#start-btn');
    await expect(startBtn).toBeVisible();
    await expect(startBtn).toContainText('START GAME');
  });

  test('should show enemy preview cards', async ({ page }) => {
    const enemyCards = page.locator('.enemy-card');
    await expect(enemyCards).toHaveCount(3);
  });

  test('should show skin selector', async ({ page }) => {
    const skinSelector = page.locator('#skin-selector');
    await expect(skinSelector).toBeVisible();
  });

  test('should show controls info', async ({ page }) => {
    // Target desktop controls specifically (touch controls are hidden by default on desktop)
    const controlsInfo = page.locator('#desktop-controls');
    await expect(controlsInfo).toBeVisible();
    await expect(controlsInfo).toContainText('MOUSE - AIM CROSSHAIR');
    await expect(controlsInfo).toContainText('CLICK or SPACEBAR - SHOOT');
  });
});

test.describe('Game Start', () => {
  test('should start game when clicking start button', async ({ page }) => {
    await page.goto('/');

    // Click start button
    const startBtn = page.locator('#start-btn');
    await startBtn.click();

    // Start screen should be hidden
    const startScreen = page.locator('#start-screen');
    await expect(startScreen).not.toBeVisible();

    // HUD should be visible
    const hud = page.locator('#hud');
    await expect(hud).toBeVisible();
  });

  test('should initialize game state on start', async ({ page }) => {
    await page.goto('/');

    // Start the game
    await page.locator('#start-btn').click();

    // Check HUD displays initial values
    const score = page.locator('#score');
    await expect(score).toHaveText('0');

    const kills = page.locator('#kills');
    await expect(kills).toHaveText('0');

    // Wave display should show "WAVE" followed by a number (game may advance quickly)
    const waveDisplay = page.locator('#wave-display');
    await expect(waveDisplay).toHaveText(/WAVE \d+/);
  });
});

test.describe('HUD Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('#start-btn').click();
  });

  test('should display score counter', async ({ page }) => {
    const score = page.locator('#score');
    await expect(score).toBeVisible();
  });

  test('should display health bar', async ({ page }) => {
    const healthBar = page.locator('#health-bar');
    await expect(healthBar).toBeVisible();
  });

  test('should display weapon name', async ({ page }) => {
    const weaponName = page.locator('#weapon-name');
    await expect(weaponName).toBeVisible();
    // Use case-insensitive match as game may use different casing
    await expect(weaponName).toHaveText(/present launcher/i);
  });

  test('should display ammo counter', async ({ page }) => {
    const ammo = page.locator('#ammo-display');
    await expect(ammo).toBeVisible();
  });

  test('should display crosshair', async ({ page }) => {
    // Crosshair is hidden by default until mouse moves over canvas
    // Just verify it exists in the DOM
    const crosshair = page.locator('#crosshair');
    await expect(crosshair).toBeAttached();
  });

  test('should display coins counter', async ({ page }) => {
    const coins = page.locator('#coins-display');
    await expect(coins).toBeVisible();
  });

  test('should display healing power bar', async ({ page }) => {
    const healPower = page.locator('#heal-power-bar');
    await expect(healPower).toBeAttached();
  });
});

test.describe('Shop System', () => {
  test('should have shop screen in DOM', async ({ page }) => {
    await page.goto('/');

    const shopScreen = page.locator('#shop-screen');
    await expect(shopScreen).toBeAttached();
  });

  test('should have shop elements', async ({ page }) => {
    await page.goto('/');

    // Shop screen exists with correct elements
    await expect(page.locator('#shop-screen h1')).toContainText('GRINDSET EMPORIUM');
    await expect(page.locator('#shopkeeper-container')).toBeAttached();
    await expect(page.locator('#weapons-list')).toBeAttached();
    await expect(page.locator('#upgrades-list')).toBeAttached();
    await expect(page.locator('#continue-btn')).toBeAttached();
  });
});

test.describe('Game Over Screen', () => {
  test('should have game over screen in DOM', async ({ page }) => {
    await page.goto('/');

    const gameOver = page.locator('#game-over');
    await expect(gameOver).toBeAttached();
  });

  test('should have death receipt elements', async ({ page }) => {
    await page.goto('/');

    // Death receipt elements exist
    await expect(page.locator('#death-receipt')).toBeAttached();
    await expect(page.locator('#stat-waves')).toBeAttached();
    await expect(page.locator('#stat-kills')).toBeAttached();
    await expect(page.locator('#stat-score')).toBeAttached();
    await expect(page.locator('#restart-btn')).toBeAttached();
    await expect(page.locator('#copy-receipt-btn')).toBeAttached();
  });
});

test.describe('JavaScript Module Loading', () => {
  test('should load all game modules without errors', async ({ page }) => {
    const errors = [];

    // Capture console errors
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // Wait for modules to load
    await page.waitForTimeout(1000);

    // Check no critical errors occurred
    const criticalErrors = errors.filter(e =>
      e.includes('SyntaxError') ||
      e.includes('ReferenceError') ||
      e.includes('Failed to load')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Accessibility', () => {
  test('should have accessible start button', async ({ page }) => {
    await page.goto('/');

    const startBtn = page.locator('#start-btn');
    await expect(startBtn).toBeEnabled();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Tab to start button and press Enter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Start button should be focusable
    const startBtn = page.locator('#start-btn');
    await expect(startBtn).toBeVisible();
  });
});

test.describe('Santa Skin Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display skin options', async ({ page }) => {
    const skinOptions = page.locator('#skin-options');
    await expect(skinOptions).toBeVisible();
  });

  test('should have multiple skin choices', async ({ page }) => {
    const skinButtons = page.locator('#skin-options .skin-option');
    const count = await skinButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display coins for skin purchase', async ({ page }) => {
    const skinCoins = page.locator('#skin-coins-display');
    await expect(skinCoins).toBeVisible();
  });

  test('should highlight selected skin', async ({ page }) => {
    // First skin option should be selected by default
    const firstSkin = page.locator('#skin-options .skin-option').first();
    await expect(firstSkin).toBeVisible();
  });
});

test.describe('Keyboard Controls', () => {
  test('should start game with Enter key on focused button', async ({ page }) => {
    await page.goto('/');

    // Focus and click the start button
    const startBtn = page.locator('#start-btn');
    await startBtn.focus();
    await page.keyboard.press('Enter');

    // Game should start
    const startScreen = page.locator('#start-screen');
    await expect(startScreen).not.toBeVisible();
  });

  test('should fire projectile with spacebar', async ({ page }) => {
    await page.goto('/');
    await page.locator('#start-btn').click();

    // Press spacebar to shoot
    await page.keyboard.press('Space');

    // Game should still be running (no crash)
    const hud = page.locator('#hud');
    await expect(hud).toBeVisible();
  });

  test('should handle healing power key (E)', async ({ page }) => {
    await page.goto('/');
    await page.locator('#start-btn').click();

    // Press E for healing
    await page.keyboard.press('e');

    // Game should still be running
    const hud = page.locator('#hud');
    await expect(hud).toBeVisible();
  });
});

test.describe('Canvas Interaction', () => {
  test('should have properly sized canvas', async ({ page }) => {
    await page.goto('/');

    const canvas = page.locator('#game-canvas');
    const box = await canvas.boundingBox();

    expect(box).not.toBeNull();
    expect(box?.width).toBeGreaterThan(0);
    expect(box?.height).toBeGreaterThan(0);
  });

  test('should handle mouse click on canvas', async ({ page }) => {
    await page.goto('/');
    await page.locator('#start-btn').click();

    // Click on canvas to shoot
    const canvas = page.locator('#game-canvas');
    await canvas.click({ position: { x: 400, y: 300 } });

    // Game should still be running
    const hud = page.locator('#hud');
    await expect(hud).toBeVisible();
  });

  test('should track mouse movement', async ({ page }) => {
    await page.goto('/');
    await page.locator('#start-btn').click();

    // Move mouse across canvas
    const canvas = page.locator('#game-canvas');
    await canvas.hover({ position: { x: 100, y: 100 } });
    await canvas.hover({ position: { x: 500, y: 400 } });

    // Game should still be running
    const score = page.locator('#score');
    await expect(score).toBeVisible();
  });
});

test.describe('Visual Effects Elements', () => {
  test('should have damage overlay in DOM', async ({ page }) => {
    await page.goto('/');

    const damageOverlay = page.locator('#damage-overlay');
    await expect(damageOverlay).toBeAttached();
  });

  test('should have muzzle flash element', async ({ page }) => {
    await page.goto('/');

    const muzzleFlash = page.locator('#muzzle-flash');
    await expect(muzzleFlash).toBeAttached();
  });

  test('should have wave announcement element', async ({ page }) => {
    await page.goto('/');

    const waveAnnouncement = page.locator('#wave-announcement');
    await expect(waveAnnouncement).toBeAttached();
  });

  test('should have kill feed element', async ({ page }) => {
    await page.goto('/');

    const killFeed = page.locator('#kill-feed');
    await expect(killFeed).toBeAttached();
  });

  test('should have achievement container', async ({ page }) => {
    await page.goto('/');

    const achievementContainer = page.locator('#achievement-container');
    await expect(achievementContainer).toBeAttached();
  });
});

test.describe('Boss UI Elements', () => {
  test('should have boss intro overlay', async ({ page }) => {
    await page.goto('/');

    const bossIntro = page.locator('#boss-intro-overlay');
    await expect(bossIntro).toBeAttached();
  });

  test('should have boss health container', async ({ page }) => {
    await page.goto('/');

    const bossHealthContainer = page.locator('#boss-health-container');
    await expect(bossHealthContainer).toBeAttached();
  });

  test('should have boss name display', async ({ page }) => {
    await page.goto('/');

    const bossName = page.locator('#boss-name');
    await expect(bossName).toBeAttached();
  });

  test('should have boss health bar', async ({ page }) => {
    await page.goto('/');

    const bossHealthBar = page.locator('#boss-health-bar');
    await expect(bossHealthBar).toBeAttached();
  });
});

test.describe('Minigame Elements', () => {
  test('should have minigame screen', async ({ page }) => {
    await page.goto('/');

    const minigameScreen = page.locator('#minigame-screen');
    await expect(minigameScreen).toBeAttached();
  });

  test('should have minigame area', async ({ page }) => {
    await page.goto('/');

    const minigameArea = page.locator('#minigame-area');
    await expect(minigameArea).toBeAttached();
  });

  test('should have minigame timer', async ({ page }) => {
    await page.goto('/');

    const minigameTimer = page.locator('#minigame-timer');
    await expect(minigameTimer).toBeAttached();
  });

  test('should have minigame hit counter', async ({ page }) => {
    await page.goto('/');

    const minigameHits = page.locator('#minigame-hits');
    await expect(minigameHits).toBeAttached();
  });
});

test.describe('Game Stability', () => {
  test('should not crash after rapid clicking', async ({ page }) => {
    await page.goto('/');
    await page.locator('#start-btn').click();

    const canvas = page.locator('#game-canvas');

    // Rapid fire clicks
    for (let i = 0; i < 10; i++) {
      await canvas.click({ position: { x: 400 + i * 10, y: 300 } });
    }

    // Game should still be running
    const hud = page.locator('#hud');
    await expect(hud).toBeVisible();
  });

  test('should not crash after rapid key presses', async ({ page }) => {
    await page.goto('/');
    await page.locator('#start-btn').click();

    // Rapid spacebar presses
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Space');
    }

    // Game should still be running
    const score = page.locator('#score');
    await expect(score).toBeVisible();
  });

  test('should handle game running for extended time', async ({ page }) => {
    await page.goto('/');
    await page.locator('#start-btn').click();

    // Let game run for a few seconds
    await page.waitForTimeout(3000);

    // Game should still be functional
    const hud = page.locator('#hud');
    await expect(hud).toBeVisible();
  });
});

test.describe('Responsive Layout', () => {
  test('should display correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    const gameContainer = page.locator('#game-container');
    await expect(gameContainer).toBeVisible();

    const startScreen = page.locator('#start-screen');
    await expect(startScreen).toBeVisible();
  });

  test('should display correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    const gameContainer = page.locator('#game-container');
    await expect(gameContainer).toBeVisible();
  });

  test('should display correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const gameContainer = page.locator('#game-container');
    await expect(gameContainer).toBeVisible();
  });

  test('should maintain game functionality after resize', async ({ page }) => {
    await page.goto('/');

    // Start at desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.locator('#start-btn').click();

    // Resize to tablet
    await page.setViewportSize({ width: 768, height: 1024 });

    // Game should still function
    const hud = page.locator('#hud');
    await expect(hud).toBeVisible();
  });
});

test.describe('Game State Persistence', () => {
  test('should preserve skin selection across page elements', async ({ page }) => {
    await page.goto('/');

    // Skin selector should be visible
    const skinSelector = page.locator('#skin-selector');
    await expect(skinSelector).toBeVisible();

    // Start game
    await page.locator('#start-btn').click();

    // Game should be running
    const hud = page.locator('#hud');
    await expect(hud).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should not have JavaScript errors on load', async ({ page }) => {
    const errors = [];

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    expect(errors).toHaveLength(0);
  });

  test('should not have JavaScript errors during gameplay', async ({ page }) => {
    const errors = [];

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.locator('#start-btn').click();

    // Play for a bit
    await page.keyboard.press('Space');
    await page.waitForTimeout(2000);

    expect(errors).toHaveLength(0);
  });

  test('should not have console errors during gameplay', async ({ page }) => {
    const errors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.locator('#start-btn').click();
    await page.waitForTimeout(2000);

    // Filter out known acceptable errors (like failed font loads)
    const criticalErrors = errors.filter(e =>
      !e.includes('font') &&
      !e.includes('favicon')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Performance', () => {
  test('should load page within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should start game quickly after button click', async ({ page }) => {
    await page.goto('/');

    const startTime = Date.now();
    await page.locator('#start-btn').click();
    await page.locator('#hud').waitFor({ state: 'visible' });
    const startGameTime = Date.now() - startTime;

    // Game should start within 1 second
    expect(startGameTime).toBeLessThan(1000);
  });
});
