# Claude Code Instructions

This file provides context and guidelines for Claude Code when working with this repository.

## Project Overview

**DINO DOOM: Santa's Last Stand** is a browser-based FPS game built with vanilla JavaScript and ES6 modules. Santa defends against muscular dinosaurs using Christmas-themed weapons.

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6 modules), HTML5 Canvas, CSS3
- **Testing**: Node.js built-in test runner, Playwright for E2E
- **Linting**: ESLint 9.x with flat config
- **Coverage**: c8
- **CI/CD**: GitHub Actions
- **Pre-commit**: Husky

## Project Structure

```
├── js/
│   ├── main.js           # Entry point, event listeners
│   ├── game.js           # Core game loop
│   ├── state.js          # Centralized state management
│   ├── ui.js             # HUD and rendering
│   ├── constants.js      # Game config, weapons, enemies
│   ├── classes/          # Entity classes (Enemy, Projectile, Particle)
│   └── systems/          # Game systems (audio, shop, achievements, etc.)
├── tests/
│   └── game.test.js      # Unit tests (130+ tests)
├── e2e/
│   └── game.spec.js      # E2E tests (65+ tests)
├── css/
│   └── styles.css        # Game styling
└── index.html            # Main HTML file
```

## Important Commands

```bash
# Development
npm test              # Run unit tests
npm run test:coverage # Run tests with coverage
npm run test:e2e      # Run Playwright E2E tests
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix lint issues
npm run lint:strict   # Lint with zero warnings (used in CI)

# Full CI check locally
npm run ci            # lint:strict + test:coverage + test:e2e

# Build
npm run build         # Bundle into single portable HTML file (dist/dino-doom.html)
```

## Code Standards

### Linting
- **Zero warnings policy**: All lint warnings are treated as errors in CI
- Run `npm run lint:fix` to auto-fix issues
- Unused variables must be prefixed with `_` (e.g., `_unusedParam`)

### Testing
- Unit tests use Node.js built-in test runner (`node:test`)
- E2E tests use Playwright with Chromium
- All tests must pass before commits (enforced by husky pre-commit hook)

### Commits
- Pre-commit hook runs: `npm run lint:strict && npm run test`
- E2E tests only run on CI, not locally
- Use `--no-verify` sparingly to bypass hooks

## CI Pipeline

All checks must pass:
1. **ESLint** - Zero warnings allowed
2. **Unit Tests** - With coverage reporting
3. **E2E Tests** - Playwright smoke tests
4. **Syntax Validation** - All JS files checked

## Key Files to Know

| File | Purpose |
|------|---------|
| `js/constants.js` | All game balance, weapons, enemies, upgrades |
| `js/state.js` | Game state, player state, entity arrays |
| `js/game.js` | Main game loop, collision detection, spawning |
| `eslint.config.js` | ESLint flat config |
| `playwright.config.js` | E2E test configuration |

## Common Tasks

### Adding a New Weapon
1. Add to `WEAPONS` object in `js/constants.js`
2. Include: name, emoji, damage, fireRate, speed, price, color
3. Add unit tests in `tests/game.test.js`

### Adding a New Enemy Type
1. Add to `ENEMY_TYPES` in `js/constants.js`
2. Include: name, emoji, health, speed, damage, points, coins, size, traits
3. Add dialogue in `ENEMY_DIALOGUE`
4. Add unit tests

### Adding E2E Tests
1. Add tests to `e2e/game.spec.js`
2. Use `page.locator()` for element selection
3. Prefer `toBeAttached()` for hidden elements, `toBeVisible()` for visible ones

## Don't Do

- Don't use `require()` - project uses ES modules
- Don't add `console.log` statements (will fail lint)
- Don't commit with lint warnings
- Don't modify game balance without updating related tests
