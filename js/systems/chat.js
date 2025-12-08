/**
 * Dino Doom: Santa's Last Stand
 * Fake Twitch Chat System
 *
 * Adds a scrolling chat overlay that reacts to gameplay events.
 */

import {
    TWITCH_CHAT_CONFIG,
    TWITCH_CHAT_USERNAMES,
    TWITCH_CHAT_MESSAGES
} from '../constants.js';

// Chat state
const chatState = {
    messages: [],
    enabled: true
};

/**
 * Gets a random element from an array
 * @param {Array} arr - The array to pick from
 * @returns {*} A random element from the array
 */
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Gets a random username with optional color
 * @returns {Object} Username and color
 */
function getRandomUser() {
    const colors = [
        '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff',
        '#ff6bcb', '#c8a2c8', '#87ceeb', '#ff8c00',
        '#00ff7f', '#ff1493', '#00bfff', '#ffa500'
    ];
    return {
        name: getRandomElement(TWITCH_CHAT_USERNAMES),
        color: getRandomElement(colors)
    };
}

/**
 * Adds a message to the chat
 * @param {string} text - The message text
 * @param {string} [username] - Optional username (random if not provided)
 * @param {string} [color] - Optional username color
 */
export function addChatMessage(text, username, color) {
    if (!chatState.enabled) return;

    const chatContainer = document.getElementById('twitch-chat');
    if (!chatContainer) return;

    const user = username ? { name: username, color: color || '#fff' } : getRandomUser();

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = 'twitch-chat-message';

    const usernameEl = document.createElement('span');
    usernameEl.className = 'twitch-chat-username';
    usernameEl.textContent = user.name + ':';
    usernameEl.style.color = user.color;

    const textEl = document.createElement('span');
    textEl.className = 'twitch-chat-text';
    textEl.textContent = ' ' + text;

    messageEl.appendChild(usernameEl);
    messageEl.appendChild(textEl);

    // Add to container
    chatContainer.appendChild(messageEl);

    // Track message
    chatState.messages.push({
        element: messageEl,
        time: Date.now()
    });

    // Remove old messages if exceeding max
    while (chatState.messages.length > TWITCH_CHAT_CONFIG.MAX_MESSAGES) {
        const oldest = chatState.messages.shift();
        if (oldest.element && oldest.element.parentNode) {
            oldest.element.classList.add('fading');
            setTimeout(() => {
                if (oldest.element.parentNode) {
                    oldest.element.remove();
                }
            }, TWITCH_CHAT_CONFIG.MESSAGE_FADE_DURATION_MS);
        }
    }

    // Schedule message removal
    setTimeout(() => {
        const index = chatState.messages.findIndex(m => m.element === messageEl);
        if (index !== -1) {
            chatState.messages.splice(index, 1);
        }
        if (messageEl.parentNode) {
            messageEl.classList.add('fading');
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, TWITCH_CHAT_CONFIG.MESSAGE_FADE_DURATION_MS);
        }
    }, TWITCH_CHAT_CONFIG.MESSAGE_DURATION_MS);
}

/**
 * Adds multiple random chat messages for an event
 * @param {string} eventType - The event type (kill, death, bossSpawn, waveComplete, bossKill)
 * @param {number} [count=1] - Number of messages to add
 */
export function triggerChatEvent(eventType, count = 1) {
    const messages = TWITCH_CHAT_MESSAGES[eventType];
    if (!messages || messages.length === 0) return;

    // Add messages with slight delays for realism
    for (let i = 0; i < count; i++) {
        const delay = i * (100 + Math.random() * 200);
        setTimeout(() => {
            addChatMessage(getRandomElement(messages));
        }, delay);
    }
}

/**
 * Triggers chat reaction for a kill event
 */
export function onChatKill() {
    // Don't spam on every kill, ~30% chance
    if (Math.random() < 0.3) {
        triggerChatEvent('kill', 1 + Math.floor(Math.random() * 2));
    }
}

/**
 * Triggers chat reaction for player death
 */
export function onChatDeath() {
    // Always react to death with multiple messages
    triggerChatEvent('death', 3 + Math.floor(Math.random() * 3));
}

/**
 * Triggers chat reaction for boss spawn
 */
export function onChatBossSpawn() {
    // Always react to boss with multiple messages
    triggerChatEvent('bossSpawn', 3 + Math.floor(Math.random() * 2));
}

/**
 * Triggers chat reaction for wave completion
 */
export function onChatWaveComplete() {
    triggerChatEvent('waveComplete', 2 + Math.floor(Math.random() * 2));
}

/**
 * Triggers chat reaction for boss kill
 */
export function onChatBossKill() {
    // Big celebration for boss kills
    triggerChatEvent('bossKill', 4 + Math.floor(Math.random() * 3));
}

/**
 * Clears all chat messages
 */
export function clearChat() {
    const chatContainer = document.getElementById('twitch-chat');
    if (chatContainer) {
        chatContainer.innerHTML = '';
    }
    chatState.messages = [];
}

/**
 * Enables or disables the chat system
 * @param {boolean} enabled - Whether chat should be enabled
 */
export function setChatEnabled(enabled) {
    chatState.enabled = enabled;
    const chatContainer = document.getElementById('twitch-chat-container');
    if (chatContainer) {
        chatContainer.style.display = enabled ? 'flex' : 'none';
    }
}

/**
 * Gets whether chat is enabled
 * @returns {boolean} Whether chat is enabled
 */
export function isChatEnabled() {
    return chatState.enabled;
}

/**
 * Initializes the chat system
 */
export function initChatSystem() {
    chatState.messages = [];
    chatState.enabled = true;
}
