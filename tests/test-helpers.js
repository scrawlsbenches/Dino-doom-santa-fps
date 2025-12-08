/**
 * Shared test utilities for Dino Doom Santa FPS tests
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Loads and evaluates a JS module file, stripping exports
 * @param {string} relativePath - Path to the module
 * @param {string} _additionalSetup - Additional setup code (reserved for future use)
 */
export function loadModule(relativePath, _additionalSetup = '') {
    const filePath = path.join(__dirname, '..', relativePath);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove import statements
    content = content.replace(/import\s+.*?from\s+['"][^'"]+['"];?\n?/g, '');

    // Remove export statements but keep the declarations
    content = content.replace(/export\s+(const|let|function|class)/g, '$1');
    content = content.replace(/export\s+\{[^}]*\};?\n?/g, '');

    return content;
}

/**
 * Creates a mock DOM environment
 * Reserved for future use in browser-context tests
 */
export function createMockDOM() {
    const elements = {};
    return {
        getElementById: (id) => {
            if (!elements[id]) {
                elements[id] = {
                    style: {},
                    textContent: '',
                    innerHTML: '',
                    classList: {
                        add: () => {},
                        remove: () => {},
                        contains: () => false
                    },
                    appendChild: () => {},
                    remove: () => {},
                    addEventListener: () => {}
                };
            }
            return elements[id];
        },
        createElement: (_tag) => ({
            style: {},
            textContent: '',
            innerHTML: '',
            className: '',
            classList: {
                add: () => {},
                remove: () => {}
            },
            appendChild: () => {},
            remove: () => {}
        }),
        querySelector: () => null,
        addEventListener: () => {}
    };
}

/**
 * Loads game constants for testing
 * @returns {Object} Object containing all game constants
 */
export function loadConstants() {
    const constantsPath = path.join(__dirname, '..', 'js', 'constants.js');
    let content = fs.readFileSync(constantsPath, 'utf8');
    content = content.replace(/export (const|let|function)/g, '$1');

    const fn = new Function(`
        ${content}
        return {
            GAME_CONFIG,
            WEAPONS,
            UPGRADES,
            ENEMY_TYPES,
            SANTA_SKINS,
            ACHIEVEMENTS,
            KILL_STREAK_TIERS,
            MEME_RATINGS,
            LAST_WORDS,
            BOSS_NAMES,
            ENEMY_DIALOGUE,
            SIGMA_QUOTES,
            SHOPKEEPER_DIALOGUE,
            SIGMA_ESCAPE_TAUNTS,
            TWITCH_CHAT_CONFIG,
            TWITCH_CHAT_USERNAMES,
            TWITCH_CHAT_MESSAGES
        };
    `);
    return fn();
}

/**
 * Reads a file from the project
 * @param {string} relativePath - Path relative to project root
 * @returns {string} File content
 */
export function readFile(relativePath) {
    return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

/**
 * Checks if a file exists in the project
 * @param {string} relativePath - Path relative to project root
 * @returns {boolean} Whether the file exists
 */
export function fileExists(relativePath) {
    return fs.existsSync(path.join(__dirname, '..', relativePath));
}

/**
 * Gets the project root path
 * @returns {string} Project root path
 */
export function getProjectRoot() {
    return path.join(__dirname, '..');
}

export { __dirname, __filename };
