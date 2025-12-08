/**
 * Dino Doom: Santa's Last Stand
 * Skin System
 *
 * Santa skin customization and persistence.
 */

import { SANTA_SKINS } from '../constants.js';
import { skinState, loadSkinState, saveSkinState } from '../state.js';
import { playSound } from './audio.js';

/**
 * Gets current skin configuration
 * @returns {Object} Current skin object
 */
export function getCurrentSkin() {
    return SANTA_SKINS[skinState.selected] || SANTA_SKINS.default;
}

/**
 * Purchases a skin
 * @param {string} skinId - Skin identifier
 * @returns {boolean} True if purchase successful
 */
export function purchaseSkin(skinId) {
    const skin = SANTA_SKINS[skinId];
    if (!skin) return false;
    if (skinState.owned.includes(skinId)) return false;
    if (skinState.totalCoins < skin.price) return false;

    skinState.totalCoins -= skin.price;
    skinState.owned.push(skinId);
    skinState.selected = skinId;
    saveSkinState();
    playSound('buy');
    return true;
}

/**
 * Selects an owned skin
 * @param {string} skinId - Skin identifier
 * @returns {boolean} True if selection successful
 */
export function selectSkin(skinId) {
    if (!skinState.owned.includes(skinId)) return false;
    skinState.selected = skinId;
    saveSkinState();
    return true;
}

/**
 * Renders skin selector on start screen
 */
export function renderSkinSelector() {
    const container = document.getElementById('skin-options');
    container.innerHTML = '';

    for (const [id, skin] of Object.entries(SANTA_SKINS)) {
        const owned = skinState.owned.includes(id);
        const selected = skinState.selected === id;
        const canAfford = skinState.totalCoins >= skin.price;

        const option = document.createElement('div');
        option.className = `skin-option ${selected ? 'selected' : ''} ${!owned ? 'locked' : ''}`;
        option.innerHTML = `
            <div class="skin-emoji">${skin.emoji}</div>
            <div class="skin-name">${skin.name}</div>
            <div class="skin-price ${owned ? 'owned' : ''}">${owned ? '✓ OWNED' : `🪙 ${skin.price}`}</div>
        `;

        option.onclick = () => {
            if (owned) {
                selectSkin(id);
                renderSkinSelector();
            } else if (canAfford) {
                purchaseSkin(id);
                renderSkinSelector();
            }
        };

        container.appendChild(option);
    }

    document.getElementById('skin-coins').textContent = skinState.totalCoins;
}

/**
 * Initializes skin system
 */
export function initSkinSystem() {
    loadSkinState();
    renderSkinSelector();
}
