/**
 * Automated tests for Dino Doom Santa FPS
 * Uses Node.js built-in test runner (node:test)
 * Run with: npm test
 *
 * This file imports all test modules for comprehensive coverage.
 * Tests are organized into separate files by category:
 * - constants.test.js: Game configuration, weapons, upgrades, enemies, skins, achievements, dialogue
 * - state.test.js: State management
 * - classes.test.js: Entity classes (Enemy, Projectile, Particle, etc.)
 * - systems.test.js: Game systems (audio, effects, achievements, shop, etc.)
 * - modules.test.js: Main modules (UI, Game, Main entry point)
 * - structure.test.js: Project structure, HTML, CSS
 * - integration.test.js: Module integration, game balance, data consistency
 * - regressions.test.js: Bug fix regressions and refactor tests
 * - features.test.js: Feature implementations (MLG Sound Pack, Combo Counter, Deep Fried Mode)
 */

// Import all test modules - they will register their tests automatically
import './constants.test.js';
import './state.test.js';
import './classes.test.js';
import './systems.test.js';
import './modules.test.js';
import './structure.test.js';
import './integration.test.js';
import './regressions.test.js';
import './features.test.js';

console.log('All tests completed!');
