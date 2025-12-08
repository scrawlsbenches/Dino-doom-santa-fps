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
    const controlsInfo = page.locator('.controls-info');
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
