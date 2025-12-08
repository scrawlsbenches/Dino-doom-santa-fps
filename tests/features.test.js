/**
 * Tests for feature implementations
 * MLG Sound Pack, Combo Counter System, Deep Fried Mode
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { loadConstants, readFile, fileExists } from './test-helpers.js';

let gameData;
try {
    gameData = loadConstants();
} catch (e) {
    console.error('Failed to load constants:', e.message);
    process.exit(1);
}

// ==================== TASK-015: MLG SOUND PACK TESTS ====================
describe('MLG Sound Pack', () => {
    test('Audio system exports MLG sound functions', () => {
        const audioContent = readFile('js/systems/audio.js');

        assert.ok(audioContent.includes('export function playTripleKillSound'), 'Should export playTripleKillSound');
        assert.ok(audioContent.includes('export function playAirhorn'), 'Should export playAirhorn');
        assert.ok(audioContent.includes('export function playMomGetTheCamera'), 'Should export playMomGetTheCamera');
        assert.ok(audioContent.includes('export function playSadViolin'), 'Should export playSadViolin');
        assert.ok(audioContent.includes('export function playWowSound'), 'Should export playWowSound');
    });

    test('Audio system exports volume control functions', () => {
        const audioContent = readFile('js/systems/audio.js');

        assert.ok(audioContent.includes('export function getVolume'), 'Should export getVolume');
        assert.ok(audioContent.includes('export function setVolume'), 'Should export setVolume');
        assert.ok(audioContent.includes('let masterVolume'), 'Should have masterVolume variable');
    });

    test('playTripleKillSound creates voice-like tones', () => {
        const audioContent = readFile('js/systems/audio.js');

        const funcMatch = audioContent.match(/export function playTripleKillSound[\s\S]*?^}/m);
        if (funcMatch) {
            assert.ok(funcMatch[0].includes('sawtooth'), 'playTripleKillSound should use sawtooth wave');
            assert.ok(funcMatch[0].includes('masterVolume'), 'playTripleKillSound should use masterVolume');
            assert.ok(funcMatch[0].includes('notes'), 'playTripleKillSound should use notes array');
        }
    });

    test('playAirhorn creates airhorn chord', () => {
        const audioContent = readFile('js/systems/audio.js');

        const funcMatch = audioContent.match(/export function playAirhorn[\s\S]*?^}/m);
        if (funcMatch) {
            // Airhorn uses A major chord: A4 (440), C#5 (554), E5 (659)
            assert.ok(funcMatch[0].includes('440'), 'playAirhorn should use A4 frequency (440Hz)');
            assert.ok(funcMatch[0].includes('554'), 'playAirhorn should use C#5 frequency (554Hz)');
            assert.ok(funcMatch[0].includes('659'), 'playAirhorn should use E5 frequency (659Hz)');
            assert.ok(funcMatch[0].includes('masterVolume'), 'playAirhorn should use masterVolume');
        }
    });

    test('playMomGetTheCamera creates excited voice effect', () => {
        const audioContent = readFile('js/systems/audio.js');

        const funcMatch = audioContent.match(/export function playMomGetTheCamera[\s\S]*?^}/m);
        if (funcMatch) {
            assert.ok(funcMatch[0].includes('square'), 'playMomGetTheCamera should use square wave');
            assert.ok(funcMatch[0].includes('masterVolume'), 'playMomGetTheCamera should use masterVolume');
            assert.ok(funcMatch[0].includes('Rising pitch'), 'playMomGetTheCamera should have rising pitch effect');
        }
    });

    test('playSadViolin creates mournful melody with vibrato', () => {
        const audioContent = readFile('js/systems/audio.js');

        const funcMatch = audioContent.match(/export function playSadViolin[\s\S]*?^}/m);
        if (funcMatch) {
            assert.ok(funcMatch[0].includes('vibrato'), 'playSadViolin should use vibrato');
            assert.ok(funcMatch[0].includes('sine'), 'playSadViolin should use sine wave');
            assert.ok(funcMatch[0].includes('masterVolume'), 'playSadViolin should use masterVolume');
            // Check for descending melody (E5, D5, C5, B4, A4)
            assert.ok(funcMatch[0].includes('659'), 'playSadViolin should have E5 (659Hz)');
            assert.ok(funcMatch[0].includes('440'), 'playSadViolin should have A4 (440Hz)');
        }
    });

    test('playWowSound creates formant sweep', () => {
        const audioContent = readFile('js/systems/audio.js');

        const funcMatch = audioContent.match(/export function playWowSound[\s\S]*?^}/m);
        if (funcMatch) {
            assert.ok(funcMatch[0].includes('sawtooth'), 'playWowSound should use sawtooth wave');
            assert.ok(funcMatch[0].includes('masterVolume'), 'playWowSound should use masterVolume');
            assert.ok(funcMatch[0].includes('linearRampToValueAtTime'), 'playWowSound should use frequency sweeps');
        }
    });

    test('setVolume clamps value between 0 and 1', () => {
        const audioContent = readFile('js/systems/audio.js');

        const funcMatch = audioContent.match(/export function setVolume[\s\S]*?^}/m);
        if (funcMatch) {
            assert.ok(funcMatch[0].includes('Math.max'), 'setVolume should clamp minimum');
            assert.ok(funcMatch[0].includes('Math.min'), 'setVolume should clamp maximum');
        }
    });

    test('All playSound cases use masterVolume', () => {
        const audioContent = readFile('js/systems/audio.js');

        // Count masterVolume usages in playSound
        const playSoundMatch = audioContent.match(/export function playSound\(type\)[\s\S]*?^}/m);
        if (playSoundMatch) {
            const masterVolumeCount = (playSoundMatch[0].match(/masterVolume/g) || []).length;
            // Should have at least one masterVolume per sound type (13+ cases)
            assert.ok(masterVolumeCount >= 13, `playSound should use masterVolume in all cases (found ${masterVolumeCount})`);
        }
    });
});

describe('MLG Sound Hooks', () => {
    test('Kill streak system imports MLG sound functions', () => {
        const killstreakContent = readFile('js/systems/killstreak.js');

        assert.ok(killstreakContent.includes('playTripleKillSound'), 'Should import playTripleKillSound');
        assert.ok(killstreakContent.includes('playMomGetTheCamera'), 'Should import playMomGetTheCamera');
    });

    test('Kill streak plays triple kill sound at count 3', () => {
        const killstreakContent = readFile('js/systems/killstreak.js');

        assert.ok(killstreakContent.includes('tier.count === 3'), 'Should check for triple kill');
        assert.ok(killstreakContent.includes('playTripleKillSound()'), 'Should call playTripleKillSound for triple kills');
    });

    test('Kill streak plays MOM GET THE CAMERA at count 5+', () => {
        const killstreakContent = readFile('js/systems/killstreak.js');

        assert.ok(killstreakContent.includes('tier.count >= 5'), 'Should check for 5+ kill streaks');
        assert.ok(killstreakContent.includes('playMomGetTheCamera()'), 'Should call playMomGetTheCamera for 5+ streaks');
    });

    test('Achievements system imports MLG sound functions', () => {
        const achievementsContent = readFile('js/systems/achievements.js');

        assert.ok(achievementsContent.includes('playAirhorn'), 'Should import playAirhorn');
        assert.ok(achievementsContent.includes('playWowSound'), 'Should import playWowSound');
    });

    test('Wave complete plays airhorn', () => {
        const achievementsContent = readFile('js/systems/achievements.js');

        const onWaveCompleteMatch = achievementsContent.match(/export function onWaveComplete[\s\S]*?^}/m);
        if (onWaveCompleteMatch) {
            assert.ok(onWaveCompleteMatch[0].includes('playAirhorn()'), 'onWaveComplete should call playAirhorn');
        }
    });

    test('Boss defeat plays WOW sound', () => {
        const achievementsContent = readFile('js/systems/achievements.js');

        const checkKillMatch = achievementsContent.match(/export function checkKillAchievements[\s\S]*?^}/m);
        if (checkKillMatch) {
            assert.ok(checkKillMatch[0].includes('enemy.isBoss'), 'Should check for boss');
            assert.ok(checkKillMatch[0].includes('playWowSound()'), 'Should call playWowSound for boss defeat');
        }
    });

    test('Game over plays sad violin', () => {
        const gameContent = readFile('js/game.js');

        assert.ok(gameContent.includes('playSadViolin'), 'Should import playSadViolin');

        const gameOverMatch = gameContent.match(/export function gameOver[\s\S]*?^}/m);
        if (gameOverMatch) {
            assert.ok(gameOverMatch[0].includes('playSadViolin()'), 'gameOver should call playSadViolin');
        }
    });
});

describe('Volume Control UI', () => {
    test('HTML has volume control elements', () => {
        const htmlContent = readFile('index.html');

        assert.ok(htmlContent.includes('id="volume-control"'), 'HTML should have volume-control container');
        assert.ok(htmlContent.includes('id="volume-slider"'), 'HTML should have volume-slider input');
        assert.ok(htmlContent.includes('id="volume-value"'), 'HTML should have volume-value display');
    });

    test('CSS has volume control styles', () => {
        const cssContent = readFile('css/styles.css');

        assert.ok(cssContent.includes('#volume-control'), 'CSS should style volume-control');
        assert.ok(cssContent.includes('#volume-slider'), 'CSS should style volume-slider');
        assert.ok(cssContent.includes('#volume-value'), 'CSS should style volume-value');
    });

    test('Main.js imports setVolume and sets up volume slider', () => {
        const mainContent = readFile('js/main.js');

        assert.ok(mainContent.includes('setVolume'), 'main.js should import setVolume');
        assert.ok(mainContent.includes('volume-slider'), 'main.js should reference volume-slider element');
        assert.ok(mainContent.includes('volume-value'), 'main.js should reference volume-value element');
    });
});

describe('MLG Sound Functions Have Error Handling', () => {
    test('All MLG sound functions have try-catch', () => {
        const audioContent = readFile('js/systems/audio.js');

        const mlgFunctions = [
            'playTripleKillSound',
            'playAirhorn',
            'playMomGetTheCamera',
            'playSadViolin',
            'playWowSound'
        ];

        mlgFunctions.forEach(funcName => {
            const funcRegex = new RegExp(`export function ${funcName}[\\s\\S]*?^}`, 'm');
            const funcMatch = audioContent.match(funcRegex);
            if (funcMatch) {
                assert.ok(
                    funcMatch[0].includes('try {'),
                    `${funcName} should have try block`
                );
                assert.ok(
                    funcMatch[0].includes('catch {'),
                    `${funcName} should have catch block`
                );
            }
        });
    });

    test('All MLG sound functions check for audioCtx', () => {
        const audioContent = readFile('js/systems/audio.js');

        const mlgFunctions = [
            'playTripleKillSound',
            'playAirhorn',
            'playMomGetTheCamera',
            'playSadViolin',
            'playWowSound'
        ];

        mlgFunctions.forEach(funcName => {
            const funcRegex = new RegExp(`export function ${funcName}[\\s\\S]*?^}`, 'm');
            const funcMatch = audioContent.match(funcRegex);
            if (funcMatch) {
                assert.ok(
                    funcMatch[0].includes('if (!audioCtx) return'),
                    `${funcName} should check for audioCtx before playing`
                );
            }
        });
    });
});

// ==================== TASK-014: COMBO COUNTER SYSTEM TESTS ====================
describe('TASK-014: Combo Counter System', () => {
    describe('Combo Constants', () => {
        test('GAME_CONFIG has combo system constants', () => {
            assert.ok(
                gameData.GAME_CONFIG.hasOwnProperty('COMBO_MULTIPLIER_PERCENT'),
                'GAME_CONFIG should have COMBO_MULTIPLIER_PERCENT'
            );
            assert.ok(
                gameData.GAME_CONFIG.hasOwnProperty('WOMBO_COMBO_THRESHOLD'),
                'GAME_CONFIG should have WOMBO_COMBO_THRESHOLD'
            );
        });

        test('Combo constants have correct values', () => {
            assert.strictEqual(
                gameData.GAME_CONFIG.COMBO_MULTIPLIER_PERCENT,
                10,
                'COMBO_MULTIPLIER_PERCENT should be 10'
            );
            assert.strictEqual(
                gameData.GAME_CONFIG.WOMBO_COMBO_THRESHOLD,
                10,
                'WOMBO_COMBO_THRESHOLD should be 10'
            );
        });

        test('GAME_CONFIG has combo decay constants (UX-002)', () => {
            assert.ok(
                gameData.GAME_CONFIG.hasOwnProperty('COMBO_DECAY_BASE_PERCENT'),
                'GAME_CONFIG should have COMBO_DECAY_BASE_PERCENT'
            );
            assert.ok(
                gameData.GAME_CONFIG.hasOwnProperty('COMBO_DECAY_HIGH_PERCENT'),
                'GAME_CONFIG should have COMBO_DECAY_HIGH_PERCENT'
            );
            assert.ok(
                gameData.GAME_CONFIG.hasOwnProperty('COMBO_DECAY_VERY_HIGH_PERCENT'),
                'GAME_CONFIG should have COMBO_DECAY_VERY_HIGH_PERCENT'
            );
            assert.ok(
                gameData.GAME_CONFIG.hasOwnProperty('COMBO_HIGH_THRESHOLD'),
                'GAME_CONFIG should have COMBO_HIGH_THRESHOLD'
            );
            assert.ok(
                gameData.GAME_CONFIG.hasOwnProperty('COMBO_VERY_HIGH_THRESHOLD'),
                'GAME_CONFIG should have COMBO_VERY_HIGH_THRESHOLD'
            );
            assert.ok(
                gameData.GAME_CONFIG.hasOwnProperty('COMBO_DAMAGE_COOLDOWN_MS'),
                'GAME_CONFIG should have COMBO_DAMAGE_COOLDOWN_MS'
            );
        });

        test('Combo decay constants have correct values (UX-002)', () => {
            assert.strictEqual(
                gameData.GAME_CONFIG.COMBO_DECAY_BASE_PERCENT,
                50,
                'COMBO_DECAY_BASE_PERCENT should be 50'
            );
            assert.strictEqual(
                gameData.GAME_CONFIG.COMBO_DECAY_HIGH_PERCENT,
                40,
                'COMBO_DECAY_HIGH_PERCENT should be 40'
            );
            assert.strictEqual(
                gameData.GAME_CONFIG.COMBO_DECAY_VERY_HIGH_PERCENT,
                30,
                'COMBO_DECAY_VERY_HIGH_PERCENT should be 30'
            );
            assert.strictEqual(
                gameData.GAME_CONFIG.COMBO_HIGH_THRESHOLD,
                10,
                'COMBO_HIGH_THRESHOLD should be 10'
            );
            assert.strictEqual(
                gameData.GAME_CONFIG.COMBO_VERY_HIGH_THRESHOLD,
                20,
                'COMBO_VERY_HIGH_THRESHOLD should be 20'
            );
            assert.strictEqual(
                gameData.GAME_CONFIG.COMBO_DAMAGE_COOLDOWN_MS,
                1000,
                'COMBO_DAMAGE_COOLDOWN_MS should be 1000'
            );
        });
    });

    describe('Combo State', () => {
        test('State.js exports comboState', () => {
            const stateContent = readFile('js/state.js');

            assert.ok(
                stateContent.includes('export const comboState = {'),
                'state.js should export comboState object'
            );
        });

        test('comboState has required properties', () => {
            const stateContent = readFile('js/state.js');

            assert.ok(
                stateContent.includes('count: 0'),
                'comboState should have count property initialized to 0'
            );
            assert.ok(
                stateContent.includes('showWomboCombo: false'),
                'comboState should have showWomboCombo property initialized to false'
            );
            assert.ok(
                stateContent.includes('lastDamageTime: 0'),
                'comboState should have lastDamageTime property initialized to 0 (UX-002)'
            );
        });

        test('State.js exports resetComboState function', () => {
            const stateContent = readFile('js/state.js');

            assert.ok(
                stateContent.includes('export function resetComboState()'),
                'state.js should export resetComboState function'
            );
        });

        test('resetComboState resets combo count and showWomboCombo', () => {
            const stateContent = readFile('js/state.js');

            assert.ok(
                stateContent.includes('comboState.count = 0'),
                'resetComboState should reset count to 0'
            );
            assert.ok(
                stateContent.includes('comboState.showWomboCombo = false'),
                'resetComboState should reset showWomboCombo to false'
            );
            assert.ok(
                stateContent.includes('comboState.lastDamageTime = 0'),
                'resetComboState should reset lastDamageTime to 0 (UX-002)'
            );
        });
    });

    describe('Combo System Module', () => {
        test('combo.js exists and has correct structure', () => {
            assert.ok(fileExists('js/systems/combo.js'), 'combo.js should exist');

            const comboContent = readFile('js/systems/combo.js');
            assert.ok(
                comboContent.includes('export function incrementCombo'),
                'combo.js should export incrementCombo'
            );
            assert.ok(
                comboContent.includes('export function breakCombo'),
                'combo.js should export breakCombo'
            );
            assert.ok(
                comboContent.includes('export function getComboMultiplier'),
                'combo.js should export getComboMultiplier'
            );
            assert.ok(
                comboContent.includes('export function getComboBonus'),
                'combo.js should export getComboBonus'
            );
            assert.ok(
                comboContent.includes('export function updateComboDisplay'),
                'combo.js should export updateComboDisplay'
            );
            assert.ok(
                comboContent.includes('export function getComboCount'),
                'combo.js should export getComboCount'
            );
        });

        test('incrementCombo increments combo count', () => {
            const comboContent = readFile('js/systems/combo.js');

            assert.ok(
                comboContent.includes('comboState.count++'),
                'incrementCombo should increment comboState.count'
            );
        });

        test('incrementCombo triggers WOMBO COMBO at threshold', () => {
            const comboContent = readFile('js/systems/combo.js');

            assert.ok(
                comboContent.includes('GAME_CONFIG.WOMBO_COMBO_THRESHOLD'),
                'incrementCombo should check WOMBO_COMBO_THRESHOLD'
            );
            assert.ok(
                comboContent.includes('showWomboComboAnnouncement'),
                'incrementCombo should call showWomboComboAnnouncement'
            );
        });

        test('breakCombo decays combo instead of full reset (UX-002)', () => {
            const comboContent = readFile('js/systems/combo.js');

            const breakComboMatch = comboContent.match(/export function breakCombo[\s\S]*?^}/m);
            if (breakComboMatch) {
                assert.ok(
                    breakComboMatch[0].includes('getComboDecayPercent'),
                    'breakCombo should call getComboDecayPercent to get decay amount'
                );
                assert.ok(
                    breakComboMatch[0].includes('comboState.count - comboLost'),
                    'breakCombo should subtract decay amount instead of full reset'
                );
                assert.ok(
                    breakComboMatch[0].includes('Math.max(0,'),
                    'breakCombo should not go below 0'
                );
                assert.ok(
                    breakComboMatch[0].includes('comboState.showWomboCombo = false'),
                    'breakCombo should reset showWomboCombo when below threshold'
                );
            }
        });

        test('getComboMultiplier returns correct multiplier', () => {
            const comboContent = readFile('js/systems/combo.js');

            assert.ok(
                comboContent.includes('COMBO_MULTIPLIER_PERCENT'),
                'getComboMultiplier should use COMBO_MULTIPLIER_PERCENT'
            );
            assert.ok(
                comboContent.includes('return 1 +'),
                'getComboMultiplier should return 1 + bonus'
            );
        });

        test('getComboBonus calculates bonus points', () => {
            const comboContent = readFile('js/systems/combo.js');

            assert.ok(
                comboContent.includes('getComboMultiplier()'),
                'getComboBonus should call getComboMultiplier'
            );
            assert.ok(
                comboContent.includes('Math.floor'),
                'getComboBonus should floor the result'
            );
        });

        test('showWomboComboAnnouncement creates announcement element', () => {
            const comboContent = readFile('js/systems/combo.js');

            assert.ok(
                comboContent.includes('WOMBO COMBO'),
                'showWomboComboAnnouncement should include WOMBO COMBO text'
            );
            assert.ok(
                comboContent.includes('wombo-combo-announcement'),
                'showWomboComboAnnouncement should create element with class'
            );
        });

        test('combo.js exports getComboDecayPercent (UX-002)', () => {
            const comboContent = readFile('js/systems/combo.js');

            assert.ok(
                comboContent.includes('export function getComboDecayPercent'),
                'combo.js should export getComboDecayPercent'
            );
        });

        test('combo.js exports isComboProtected (UX-002)', () => {
            const comboContent = readFile('js/systems/combo.js');

            assert.ok(
                comboContent.includes('export function isComboProtected'),
                'combo.js should export isComboProtected'
            );
        });

        test('getComboDecayPercent returns different values based on combo level (UX-002)', () => {
            const comboContent = readFile('js/systems/combo.js');

            const funcMatch = comboContent.match(/export function getComboDecayPercent[\s\S]*?^}/m);
            if (funcMatch) {
                assert.ok(
                    funcMatch[0].includes('COMBO_VERY_HIGH_THRESHOLD'),
                    'getComboDecayPercent should check very high threshold'
                );
                assert.ok(
                    funcMatch[0].includes('COMBO_HIGH_THRESHOLD'),
                    'getComboDecayPercent should check high threshold'
                );
                assert.ok(
                    funcMatch[0].includes('COMBO_DECAY_BASE_PERCENT'),
                    'getComboDecayPercent should return base decay percent'
                );
                assert.ok(
                    funcMatch[0].includes('COMBO_DECAY_HIGH_PERCENT'),
                    'getComboDecayPercent should return high decay percent'
                );
                assert.ok(
                    funcMatch[0].includes('COMBO_DECAY_VERY_HIGH_PERCENT'),
                    'getComboDecayPercent should return very high decay percent'
                );
            }
        });

        test('isComboProtected checks damage cooldown (UX-002)', () => {
            const comboContent = readFile('js/systems/combo.js');

            const funcMatch = comboContent.match(/export function isComboProtected[\s\S]*?^}/m);
            if (funcMatch) {
                assert.ok(
                    funcMatch[0].includes('Date.now()'),
                    'isComboProtected should use Date.now()'
                );
                assert.ok(
                    funcMatch[0].includes('comboState.lastDamageTime'),
                    'isComboProtected should check lastDamageTime'
                );
                assert.ok(
                    funcMatch[0].includes('COMBO_DAMAGE_COOLDOWN_MS'),
                    'isComboProtected should use COMBO_DAMAGE_COOLDOWN_MS constant'
                );
            }
        });

        test('breakCombo checks isComboProtected and updates lastDamageTime (UX-002)', () => {
            const comboContent = readFile('js/systems/combo.js');

            const funcMatch = comboContent.match(/export function breakCombo[\s\S]*?^}/m);
            if (funcMatch) {
                assert.ok(
                    funcMatch[0].includes('isComboProtected()'),
                    'breakCombo should check isComboProtected'
                );
                assert.ok(
                    funcMatch[0].includes('comboState.lastDamageTime = Date.now()'),
                    'breakCombo should update lastDamageTime'
                );
            }
        });
    });

    describe('Systems Index Export', () => {
        test('index.js exports combo module', () => {
            const indexContent = readFile('js/systems/index.js');

            assert.ok(
                indexContent.includes("export * from './combo.js'"),
                'systems/index.js should export combo module'
            );
        });
    });

    describe('Game Integration', () => {
        test('game.js imports combo functions', () => {
            const gameContent = readFile('js/game.js');

            assert.ok(
                gameContent.includes('incrementCombo'),
                'game.js should import incrementCombo'
            );
            assert.ok(
                gameContent.includes('breakCombo'),
                'game.js should import breakCombo'
            );
            assert.ok(
                gameContent.includes('getComboBonus'),
                'game.js should import getComboBonus'
            );
            assert.ok(
                gameContent.includes('updateComboDisplay'),
                'game.js should import updateComboDisplay'
            );
        });

        test('game.js imports resetComboState from state.js', () => {
            const gameContent = readFile('js/game.js');

            assert.ok(
                gameContent.includes('resetComboState'),
                'game.js should import resetComboState'
            );
        });

        test('Enemy callbacks include combo functions', () => {
            const gameContent = readFile('js/game.js');

            const callbacksMatch = gameContent.match(/function getEnemyCallbacks[\s\S]*?return {[\s\S]*?};/);
            if (callbacksMatch) {
                assert.ok(
                    callbacksMatch[0].includes('incrementCombo'),
                    'getEnemyCallbacks should include incrementCombo'
                );
                assert.ok(
                    callbacksMatch[0].includes('breakCombo'),
                    'getEnemyCallbacks should include breakCombo'
                );
                assert.ok(
                    callbacksMatch[0].includes('getComboBonus'),
                    'getEnemyCallbacks should include getComboBonus'
                );
            }
        });

        test('startGame resets combo state', () => {
            const gameContent = readFile('js/game.js');

            const startGameMatch = gameContent.match(/export function startGame[\s\S]*?^}/m);
            if (startGameMatch) {
                assert.ok(
                    startGameMatch[0].includes('resetComboState()'),
                    'startGame should call resetComboState()'
                );
                assert.ok(
                    startGameMatch[0].includes('updateComboDisplay()'),
                    'startGame should call updateComboDisplay()'
                );
            }
        });

        test('Player projectile damage calls breakCombo', () => {
            const gameContent = readFile('js/game.js');

            // Find enemy projectile collision section
            assert.ok(
                gameContent.includes('checkPlayerCollision(player)'),
                'game.js should check player collision'
            );
            assert.ok(
                gameContent.includes('breakCombo()'),
                'game.js should call breakCombo when player takes damage'
            );
        });
    });

    describe('Enemy Integration', () => {
        test('Enemy attack method calls breakCombo', () => {
            const enemyContent = readFile('js/classes/Enemy.js');

            // Check that attack method exists and calls breakCombo
            assert.ok(
                enemyContent.includes('attack()'),
                'Enemy should have attack method'
            );
            assert.ok(
                enemyContent.includes('this.callbacks.breakCombo'),
                'Enemy.attack() should call breakCombo callback'
            );
        });

        test('Enemy die method calls incrementCombo', () => {
            const enemyContent = readFile('js/classes/Enemy.js');

            // Check that die method exists and calls incrementCombo
            assert.ok(
                enemyContent.includes('die()'),
                'Enemy should have die method'
            );
            assert.ok(
                enemyContent.includes('this.callbacks.incrementCombo'),
                'Enemy.die() should call incrementCombo callback'
            );
        });

        test('Enemy die method applies combo bonus to score', () => {
            const enemyContent = readFile('js/classes/Enemy.js');

            assert.ok(
                enemyContent.includes('this.callbacks.getComboBonus'),
                'Enemy.die() should call getComboBonus callback'
            );
            assert.ok(
                enemyContent.includes('this.points + comboBonus'),
                'Enemy.die() should add combo bonus to score'
            );
        });

        test('Enemy die method shows combo bonus in floating text', () => {
            const enemyContent = readFile('js/classes/Enemy.js');

            assert.ok(
                enemyContent.includes('comboBonus > 0'),
                'Enemy.die() should check if comboBonus exists'
            );
            assert.ok(
                enemyContent.includes('comboText'),
                'Enemy.die() should use comboText for floating text'
            );
        });
    });

    describe('HTML and CSS', () => {
        test('index.html has combo counter element', () => {
            const htmlContent = readFile('index.html');

            assert.ok(
                htmlContent.includes('id="combo-counter"'),
                'index.html should have combo-counter element'
            );
        });

        test('CSS has combo counter styles', () => {
            const cssContent = readFile('css/styles.css');

            assert.ok(
                cssContent.includes('#combo-counter'),
                'CSS should have #combo-counter styles'
            );
        });

        test('CSS has wombo-combo class styles', () => {
            const cssContent = readFile('css/styles.css');

            assert.ok(
                cssContent.includes('.wombo-combo') || cssContent.includes('#combo-counter.wombo-combo'),
                'CSS should have wombo-combo class styles'
            );
        });

        test('CSS has combo animations', () => {
            const cssContent = readFile('css/styles.css');

            assert.ok(
                cssContent.includes('@keyframes comboPulse'),
                'CSS should have comboPulse animation'
            );
            assert.ok(
                cssContent.includes('@keyframes womboComboShake'),
                'CSS should have womboComboShake animation'
            );
            assert.ok(
                cssContent.includes('@keyframes womboComboAnim'),
                'CSS should have womboComboAnim animation'
            );
        });
    });
});

// ==================== DEEP FRIED MODE TESTS ====================
describe('Deep Fried Mode System', () => {
    describe('State', () => {
        test('State.js exports deepFriedState', () => {
            const stateContent = readFile('js/state.js');

            assert.ok(
                stateContent.includes('export const deepFriedState = {'),
                'state.js should export deepFriedState object'
            );
        });

        test('deepFriedState has required properties', () => {
            const stateContent = readFile('js/state.js');

            assert.ok(
                stateContent.includes('enabled:'),
                'deepFriedState should have enabled property'
            );
            assert.ok(
                stateContent.includes('lensFlares:'),
                'deepFriedState should have lensFlares array'
            );
        });

        test('State.js exports deep fried functions', () => {
            const stateContent = readFile('js/state.js');

            assert.ok(
                stateContent.includes('export function loadDeepFriedState()'),
                'state.js should export loadDeepFriedState function'
            );
            assert.ok(
                stateContent.includes('export function saveDeepFriedState()'),
                'state.js should export saveDeepFriedState function'
            );
            assert.ok(
                stateContent.includes('export function toggleDeepFriedMode()'),
                'state.js should export toggleDeepFriedMode function'
            );
            assert.ok(
                stateContent.includes('export function clearLensFlares()'),
                'state.js should export clearLensFlares function'
            );
            assert.ok(
                stateContent.includes('export function addLensFlare('),
                'state.js should export addLensFlare function'
            );
        });

        test('loadDeepFriedState handles localStorage errors gracefully', () => {
            const stateContent = readFile('js/state.js');

            // Find loadDeepFriedState function
            const funcMatch = stateContent.match(/export function loadDeepFriedState\(\)[\s\S]*?^}/m);
            if (funcMatch) {
                assert.ok(
                    funcMatch[0].includes('try'),
                    'loadDeepFriedState should use try-catch'
                );
                assert.ok(
                    funcMatch[0].includes('catch'),
                    'loadDeepFriedState should handle errors'
                );
            }
        });

        test('saveDeepFriedState handles localStorage errors gracefully', () => {
            const stateContent = readFile('js/state.js');

            // Find saveDeepFriedState function
            const funcMatch = stateContent.match(/export function saveDeepFriedState\(\)[\s\S]*?^}/m);
            if (funcMatch) {
                assert.ok(
                    funcMatch[0].includes('try'),
                    'saveDeepFriedState should use try-catch'
                );
                assert.ok(
                    funcMatch[0].includes('catch'),
                    'saveDeepFriedState should handle errors'
                );
            }
        });

        test('toggleDeepFriedMode toggles and saves state', () => {
            const stateContent = readFile('js/state.js');

            // Find toggleDeepFriedMode function
            const funcMatch = stateContent.match(/export function toggleDeepFriedMode\(\)[\s\S]*?^}/m);
            if (funcMatch) {
                assert.ok(
                    funcMatch[0].includes('deepFriedState.enabled'),
                    'toggleDeepFriedMode should modify enabled state'
                );
                assert.ok(
                    funcMatch[0].includes('saveDeepFriedState()'),
                    'toggleDeepFriedMode should call saveDeepFriedState'
                );
                assert.ok(
                    funcMatch[0].includes('return'),
                    'toggleDeepFriedMode should return the new state'
                );
            }
        });

        test('addLensFlare adds flare to array with correct properties', () => {
            const stateContent = readFile('js/state.js');

            // Find addLensFlare function
            const funcMatch = stateContent.match(/export function addLensFlare\([\s\S]*?^}/m);
            if (funcMatch) {
                assert.ok(
                    funcMatch[0].includes('deepFriedState.lensFlares.push'),
                    'addLensFlare should push to lensFlares array'
                );
                assert.ok(
                    funcMatch[0].includes('emoji:'),
                    'addLensFlare should set emoji property'
                );
                assert.ok(
                    funcMatch[0].includes('life:'),
                    'addLensFlare should set life property'
                );
                assert.ok(
                    funcMatch[0].includes('scale:'),
                    'addLensFlare should set scale property'
                );
                assert.ok(
                    funcMatch[0].includes('rotation:'),
                    'addLensFlare should set rotation property'
                );
            }
        });
    });

    describe('Deep Fried System Module', () => {
        test('deepfried.js exists', () => {
            assert.ok(fileExists('js/systems/deepfried.js'), 'deepfried.js should exist');
        });

        test('deepfried.js exports required functions', () => {
            const dfContent = readFile('js/systems/deepfried.js');

            assert.ok(
                dfContent.includes('export function initDeepFriedSystem()'),
                'deepfried.js should export initDeepFriedSystem'
            );
            assert.ok(
                dfContent.includes('export function applyDeepFriedEffect()'),
                'deepfried.js should export applyDeepFriedEffect'
            );
            assert.ok(
                dfContent.includes('export function spawnLensFlare('),
                'deepfried.js should export spawnLensFlare'
            );
            assert.ok(
                dfContent.includes('export function isDeepFriedEnabled()'),
                'deepfried.js should export isDeepFriedEnabled'
            );
            assert.ok(
                dfContent.includes('export function createLensFlareSpawner('),
                'deepfried.js should export createLensFlareSpawner'
            );
        });

        test('initDeepFriedSystem loads state and sets up button', () => {
            const dfContent = readFile('js/systems/deepfried.js');

            const funcMatch = dfContent.match(/export function initDeepFriedSystem\(\)[\s\S]*?^}/m);
            if (funcMatch) {
                assert.ok(
                    funcMatch[0].includes('loadDeepFriedState()'),
                    'initDeepFriedSystem should call loadDeepFriedState'
                );
                assert.ok(
                    funcMatch[0].includes('deep-fried-btn'),
                    'initDeepFriedSystem should reference toggle button'
                );
                assert.ok(
                    funcMatch[0].includes('addEventListener'),
                    'initDeepFriedSystem should add click listener'
                );
            }
        });

        test('applyDeepFriedEffect adds/removes CSS class', () => {
            const dfContent = readFile('js/systems/deepfried.js');

            const funcMatch = dfContent.match(/export function applyDeepFriedEffect\(\)[\s\S]*?^}/m);
            if (funcMatch) {
                assert.ok(
                    funcMatch[0].includes('classList.add'),
                    'applyDeepFriedEffect should add class when enabled'
                );
                assert.ok(
                    funcMatch[0].includes('classList.remove'),
                    'applyDeepFriedEffect should remove class when disabled'
                );
                assert.ok(
                    funcMatch[0].includes('deep-fried'),
                    'applyDeepFriedEffect should use deep-fried class'
                );
            }
        });

        test('spawnLensFlare checks if mode is enabled', () => {
            const dfContent = readFile('js/systems/deepfried.js');

            const funcMatch = dfContent.match(/export function spawnLensFlare\([\s\S]*?^}/m);
            if (funcMatch) {
                assert.ok(
                    funcMatch[0].includes('deepFriedState.enabled'),
                    'spawnLensFlare should check if mode is enabled'
                );
                assert.ok(
                    funcMatch[0].includes('return'),
                    'spawnLensFlare should early return if disabled'
                );
            }
        });

        test('createLensFlareSpawner converts world to screen coordinates', () => {
            const dfContent = readFile('js/systems/deepfried.js');

            const funcMatch = dfContent.match(/export function createLensFlareSpawner\([\s\S]*?^}/m);
            if (funcMatch) {
                assert.ok(
                    funcMatch[0].includes('PERSPECTIVE_SCALE'),
                    'createLensFlareSpawner should use perspective scale'
                );
                assert.ok(
                    funcMatch[0].includes('canvas.width'),
                    'createLensFlareSpawner should use canvas width'
                );
                assert.ok(
                    funcMatch[0].includes('canvas.height'),
                    'createLensFlareSpawner should use canvas height'
                );
            }
        });
    });

    describe('Game Integration', () => {
        test('main.js imports and initializes deep fried system', () => {
            const mainContent = readFile('js/main.js');

            assert.ok(
                mainContent.includes('initDeepFriedSystem'),
                'main.js should import initDeepFriedSystem'
            );
            assert.ok(
                mainContent.includes('initDeepFriedSystem()'),
                'main.js should call initDeepFriedSystem()'
            );
        });

        test('systems/index.js exports deepfried module', () => {
            const indexContent = readFile('js/systems/index.js');

            assert.ok(
                indexContent.includes("'./deepfried.js'"),
                'systems/index.js should export deepfried.js'
            );
        });

        test('game.js imports createLensFlareSpawner', () => {
            const gameContent = readFile('js/game.js');

            assert.ok(
                gameContent.includes('createLensFlareSpawner'),
                'game.js should import createLensFlareSpawner'
            );
        });

        test('game.js initializes lens flare spawner in initGame', () => {
            const gameContent = readFile('js/game.js');

            const funcMatch = gameContent.match(/export function initGame\([\s\S]*?^}/m);
            if (funcMatch) {
                assert.ok(
                    funcMatch[0].includes('lensFlareSpawner'),
                    'initGame should initialize lensFlareSpawner'
                );
                assert.ok(
                    funcMatch[0].includes('createLensFlareSpawner'),
                    'initGame should call createLensFlareSpawner'
                );
            }
        });

        test('Enemy callbacks include spawnLensFlare', () => {
            const gameContent = readFile('js/game.js');

            const callbacksMatch = gameContent.match(/function getEnemyCallbacks[\s\S]*?return {[\s\S]*?};/);
            if (callbacksMatch) {
                assert.ok(
                    callbacksMatch[0].includes('spawnLensFlare'),
                    'getEnemyCallbacks should include spawnLensFlare'
                );
            }
        });

        test('Enemy.js calls spawnLensFlare callback on die', () => {
            const enemyContent = readFile('js/classes/Enemy.js');

            // Check that die method exists and calls spawnLensFlare callback
            assert.ok(
                enemyContent.includes('die()'),
                'Enemy should have die method'
            );
            assert.ok(
                enemyContent.includes('this.callbacks.spawnLensFlare'),
                'Enemy.die() should call spawnLensFlare callback'
            );
        });
    });

    describe('HTML and CSS', () => {
        test('index.html has deep fried toggle button', () => {
            const htmlContent = readFile('index.html');

            assert.ok(
                htmlContent.includes('id="deep-fried-toggle"'),
                'index.html should have deep-fried-toggle container'
            );
            assert.ok(
                htmlContent.includes('id="deep-fried-btn"'),
                'index.html should have deep-fried-btn button'
            );
        });

        test('index.html has deep fried visual overlays', () => {
            const htmlContent = readFile('index.html');

            assert.ok(
                htmlContent.includes('id="chromatic-overlay"'),
                'index.html should have chromatic-overlay element'
            );
            assert.ok(
                htmlContent.includes('id="lens-flare-container"'),
                'index.html should have lens-flare-container element'
            );
        });

        test('CSS has deep fried mode styles', () => {
            const cssContent = readFile('css/styles.css');

            assert.ok(
                cssContent.includes('#deep-fried-toggle'),
                'CSS should have #deep-fried-toggle styles'
            );
            assert.ok(
                cssContent.includes('.toggle-btn'),
                'CSS should have .toggle-btn styles'
            );
            assert.ok(
                cssContent.includes('.toggle-btn.active'),
                'CSS should have active toggle button styles'
            );
        });

        test('CSS has deep fried filter class', () => {
            const cssContent = readFile('css/styles.css');

            assert.ok(
                cssContent.includes('#game-container.deep-fried'),
                'CSS should have #game-container.deep-fried styles'
            );
            assert.ok(
                cssContent.includes('saturate'),
                'CSS should apply saturate filter'
            );
            assert.ok(
                cssContent.includes('contrast'),
                'CSS should apply contrast filter'
            );
            assert.ok(
                cssContent.includes('brightness'),
                'CSS should apply brightness filter'
            );
        });

        test('CSS has chromatic aberration overlay styles', () => {
            const cssContent = readFile('css/styles.css');

            assert.ok(
                cssContent.includes('#chromatic-overlay'),
                'CSS should have #chromatic-overlay styles'
            );
        });

        test('CSS has lens flare styles', () => {
            const cssContent = readFile('css/styles.css');

            assert.ok(
                cssContent.includes('#lens-flare-container'),
                'CSS should have #lens-flare-container styles'
            );
            assert.ok(
                cssContent.includes('.lens-flare'),
                'CSS should have .lens-flare styles'
            );
        });

        test('CSS has deep fried text distortion styles', () => {
            const cssContent = readFile('css/styles.css');

            assert.ok(
                cssContent.includes('#game-container.deep-fried .stat-value') ||
                cssContent.includes('#game-container.deep-fried .stat-label'),
                'CSS should have deep fried text distortion styles'
            );
        });

        test('CSS has deep fried animations', () => {
            const cssContent = readFile('css/styles.css');

            assert.ok(
                cssContent.includes('@keyframes deepFriedPulse'),
                'CSS should have deepFriedPulse animation'
            );
            assert.ok(
                cssContent.includes('@keyframes chromaticAberration'),
                'CSS should have chromaticAberration animation'
            );
            assert.ok(
                cssContent.includes('@keyframes chromaticShift'),
                'CSS should have chromaticShift animation'
            );
            assert.ok(
                cssContent.includes('@keyframes textDistort'),
                'CSS should have textDistort animation'
            );
            assert.ok(
                cssContent.includes('@keyframes lensFlareAnim'),
                'CSS should have lensFlareAnim animation'
            );
        });
    });
});

// ==================== UX-007: BOSS HEALTH BAR PHASE INDICATORS TESTS ====================
describe('UX-007: Boss Health Bar Phase Indicators', () => {
    test('HTML has boss phase marker element', () => {
        const htmlContent = readFile('index.html');

        assert.ok(
            htmlContent.includes('id="boss-phase-marker"'),
            'index.html should have boss-phase-marker element'
        );
        assert.ok(
            htmlContent.includes('id="boss-phase-label"'),
            'index.html should have boss-phase-label element'
        );
    });

    test('CSS has boss phase marker styles', () => {
        const cssContent = readFile('css/styles.css');

        assert.ok(
            cssContent.includes('#boss-phase-marker'),
            'CSS should have #boss-phase-marker styles'
        );
        assert.ok(
            cssContent.includes('left: 50%'),
            'Boss phase marker should be positioned at 50%'
        );
    });

    test('CSS has boss phase label styles', () => {
        const cssContent = readFile('css/styles.css');

        assert.ok(
            cssContent.includes('#boss-phase-label'),
            'CSS should have #boss-phase-label styles'
        );
    });

    test('CSS has phase indicator animation', () => {
        const cssContent = readFile('css/styles.css');

        assert.ok(
            cssContent.includes('@keyframes phaseIndicatorPulse'),
            'CSS should have phaseIndicatorPulse animation'
        );
    });

    test('Boss health bar background has relative positioning', () => {
        const cssContent = readFile('css/styles.css');

        // Find the boss-health-bar-bg style block
        assert.ok(
            cssContent.includes('#boss-health-bar-bg') &&
            cssContent.includes('position: relative'),
            'Boss health bar bg should have position: relative'
        );
    });
});

// ==================== UX-009: WEAPON SWITCHING FEEDBACK TESTS ====================
describe('UX-009: Weapon Switching Feedback', () => {
    test('Audio system has equip sound', () => {
        const audioContent = readFile('js/systems/audio.js');

        assert.ok(
            audioContent.includes("case 'equip':"),
            'Audio system should handle equip sound type'
        );
    });

    test('Equip sound uses masterVolume', () => {
        const audioContent = readFile('js/systems/audio.js');

        const equipMatch = audioContent.match(/case 'equip':[\s\S]*?break;/);
        if (equipMatch) {
            assert.ok(
                equipMatch[0].includes('masterVolume'),
                'Equip sound should use masterVolume'
            );
        }
    });

    test('Shop system exports showEquipToast', () => {
        const shopContent = readFile('js/systems/shop.js');

        assert.ok(
            shopContent.includes('export function showEquipToast'),
            'Shop system should export showEquipToast function'
        );
    });

    test('Shop calls playSound equip when equipping weapon', () => {
        const shopContent = readFile('js/systems/shop.js');

        assert.ok(
            shopContent.includes("playSound('equip')"),
            'Shop should call playSound equip when equipping'
        );
    });

    test('Shop calls showEquipToast when equipping weapon', () => {
        const shopContent = readFile('js/systems/shop.js');

        assert.ok(
            shopContent.includes('showEquipToast('),
            'Shop should call showEquipToast when equipping'
        );
    });

    test('CSS has equip toast styles', () => {
        const cssContent = readFile('css/styles.css');

        assert.ok(
            cssContent.includes('.equip-toast'),
            'CSS should have .equip-toast styles'
        );
    });

    test('CSS has equip toast animations', () => {
        const cssContent = readFile('css/styles.css');

        assert.ok(
            cssContent.includes('@keyframes equipToastIn'),
            'CSS should have equipToastIn animation'
        );
        assert.ok(
            cssContent.includes('@keyframes equipToastOut'),
            'CSS should have equipToastOut animation'
        );
        assert.ok(
            cssContent.includes('@keyframes equipEmojiPulse'),
            'CSS should have equipEmojiPulse animation'
        );
    });
});

// ==================== UX-006: HEALING POWER PROGRESS CLARITY TESTS ====================
describe('UX-006: Healing Power Progress Clarity', () => {
    test('Audio system has heal_ready sound', () => {
        const audioContent = readFile('js/systems/audio.js');

        assert.ok(
            audioContent.includes("case 'heal_ready':"),
            'Audio system should handle heal_ready sound type'
        );
    });

    test('heal_ready sound uses masterVolume', () => {
        const audioContent = readFile('js/systems/audio.js');

        const healReadyMatch = audioContent.match(/case 'heal_ready':[\s\S]*?break;/);
        if (healReadyMatch) {
            assert.ok(
                healReadyMatch[0].includes('masterVolume'),
                'heal_ready sound should use masterVolume'
            );
        }
    });

    test('Enemy.js plays heal_ready sound when heal becomes available', () => {
        const enemyContent = readFile('js/classes/Enemy.js');

        assert.ok(
            enemyContent.includes("playSound('heal_ready')"),
            'Enemy should play heal_ready sound when heal becomes available'
        );
    });

    test('UI displays kills needed instead of fraction', () => {
        const uiContent = readFile('js/ui.js');

        assert.ok(
            uiContent.includes('more kill'),
            'UI should display kills needed text'
        );
    });

    test('UI adds heal-ready class to container', () => {
        const uiContent = readFile('js/ui.js');

        assert.ok(
            uiContent.includes("classList.add('heal-ready')"),
            'UI should add heal-ready class when ready'
        );
        assert.ok(
            uiContent.includes("classList.remove('heal-ready')"),
            'UI should remove heal-ready class when not ready'
        );
    });

    test('CSS has heal-ready animation styles', () => {
        const cssContent = readFile('css/styles.css');

        assert.ok(
            cssContent.includes('#heal-power-container.heal-ready'),
            'CSS should have heal-ready container styles'
        );
        assert.ok(
            cssContent.includes('@keyframes healReadyPulse'),
            'CSS should have healReadyPulse animation'
        );
    });
});

// ==================== UX-003: SHOP VISIBILITY TESTS ====================
describe('UX-003: Shop Visibility/Discovery', () => {
    test('HTML has shop indicator element', () => {
        const htmlContent = readFile('index.html');

        assert.ok(
            htmlContent.includes('id="shop-indicator"'),
            'index.html should have shop-indicator element'
        );
    });

    test('Shop indicator has correct structure', () => {
        const htmlContent = readFile('index.html');

        assert.ok(
            htmlContent.includes('shop-indicator-icon'),
            'Shop indicator should have icon element'
        );
        assert.ok(
            htmlContent.includes('shop-indicator-text'),
            'Shop indicator should have text element'
        );
        assert.ok(
            htmlContent.includes('shop-indicator-key'),
            'Shop indicator should have key hint element'
        );
    });

    test('Audio system has shop_available sound', () => {
        const audioContent = readFile('js/systems/audio.js');

        assert.ok(
            audioContent.includes("case 'shop_available':"),
            'Audio system should handle shop_available sound type'
        );
    });

    test('Shop system exports showShopIndicator and hideShopIndicator', () => {
        const shopContent = readFile('js/systems/shop.js');

        assert.ok(
            shopContent.includes('export function showShopIndicator'),
            'Shop system should export showShopIndicator'
        );
        assert.ok(
            shopContent.includes('export function hideShopIndicator'),
            'Shop system should export hideShopIndicator'
        );
    });

    test('showShopIndicator plays shop_available sound', () => {
        const shopContent = readFile('js/systems/shop.js');

        const funcMatch = shopContent.match(/export function showShopIndicator[\s\S]*?^}/m);
        if (funcMatch) {
            assert.ok(
                funcMatch[0].includes("playSound('shop_available')"),
                'showShopIndicator should play shop_available sound'
            );
        }
    });

    test('Game.js imports showShopIndicator and hideShopIndicator', () => {
        const gameContent = readFile('js/game.js');

        assert.ok(
            gameContent.includes('showShopIndicator'),
            'game.js should import showShopIndicator'
        );
        assert.ok(
            gameContent.includes('hideShopIndicator'),
            'game.js should import hideShopIndicator'
        );
    });

    test('Game.js shows shop indicator on wave completion (non-boss)', () => {
        const gameContent = readFile('js/game.js');

        assert.ok(
            gameContent.includes('showShopIndicator()'),
            'game.js should call showShopIndicator on wave completion'
        );
    });

    test('CSS has shop indicator styles', () => {
        const cssContent = readFile('css/styles.css');

        assert.ok(
            cssContent.includes('#shop-indicator'),
            'CSS should have #shop-indicator styles'
        );
        assert.ok(
            cssContent.includes('.shop-indicator-icon'),
            'CSS should have .shop-indicator-icon styles'
        );
        assert.ok(
            cssContent.includes('.shop-indicator-text'),
            'CSS should have .shop-indicator-text styles'
        );
        assert.ok(
            cssContent.includes('.shop-indicator-key'),
            'CSS should have .shop-indicator-key styles'
        );
    });

    test('CSS has shop indicator animations', () => {
        const cssContent = readFile('css/styles.css');

        assert.ok(
            cssContent.includes('@keyframes shopIndicatorPulse'),
            'CSS should have shopIndicatorPulse animation'
        );
        assert.ok(
            cssContent.includes('@keyframes shopIconBounce'),
            'CSS should have shopIconBounce animation'
        );
    });
});

// ==================== UX-010: SIGMA DINO RNG CONSISTENCY TESTS ====================
describe('UX-010: Sigma Dino RNG Consistency', () => {
    test('GAME_CONFIG has sigma spawn cap constants', () => {
        assert.ok(
            gameData.GAME_CONFIG.hasOwnProperty('SIGMA_MAX_PER_WAVE'),
            'GAME_CONFIG should have SIGMA_MAX_PER_WAVE'
        );
        assert.ok(
            gameData.GAME_CONFIG.hasOwnProperty('SIGMA_BASE_SPAWN_CHANCE'),
            'GAME_CONFIG should have SIGMA_BASE_SPAWN_CHANCE'
        );
        assert.ok(
            gameData.GAME_CONFIG.hasOwnProperty('SIGMA_SPAWN_CHANCE_PER_WAVE'),
            'GAME_CONFIG should have SIGMA_SPAWN_CHANCE_PER_WAVE'
        );
        assert.ok(
            gameData.GAME_CONFIG.hasOwnProperty('SIGMA_MAX_SPAWN_CHANCE'),
            'GAME_CONFIG should have SIGMA_MAX_SPAWN_CHANCE'
        );
    });

    test('Sigma spawn constants have correct values', () => {
        assert.strictEqual(
            gameData.GAME_CONFIG.SIGMA_MAX_PER_WAVE,
            2,
            'SIGMA_MAX_PER_WAVE should be 2'
        );
        assert.strictEqual(
            gameData.GAME_CONFIG.SIGMA_BASE_SPAWN_CHANCE,
            0.04,
            'SIGMA_BASE_SPAWN_CHANCE should be 0.04'
        );
        assert.strictEqual(
            gameData.GAME_CONFIG.SIGMA_SPAWN_CHANCE_PER_WAVE,
            0.01,
            'SIGMA_SPAWN_CHANCE_PER_WAVE should be 0.01'
        );
        assert.strictEqual(
            gameData.GAME_CONFIG.SIGMA_MAX_SPAWN_CHANCE,
            0.12,
            'SIGMA_MAX_SPAWN_CHANCE should be 0.12'
        );
    });

    test('State has sigmaSpawnedThisWave property', () => {
        const stateContent = readFile('js/state.js');

        assert.ok(
            stateContent.includes('sigmaSpawnedThisWave:'),
            'gameState should have sigmaSpawnedThisWave property'
        );
    });

    test('resetGameState resets sigmaSpawnedThisWave', () => {
        const stateContent = readFile('js/state.js');

        assert.ok(
            stateContent.includes('gameState.sigmaSpawnedThisWave = 0'),
            'resetGameState should reset sigmaSpawnedThisWave'
        );
    });

    test('Game.js has getSigmaSpawnChance function', () => {
        const gameContent = readFile('js/game.js');

        assert.ok(
            gameContent.includes('function getSigmaSpawnChance()'),
            'game.js should have getSigmaSpawnChance function'
        );
    });

    test('getSigmaSpawnChance uses wave-based calculation', () => {
        const gameContent = readFile('js/game.js');

        const funcMatch = gameContent.match(/function getSigmaSpawnChance[\s\S]*?^}/m);
        if (funcMatch) {
            assert.ok(
                funcMatch[0].includes('SIGMA_BASE_SPAWN_CHANCE'),
                'getSigmaSpawnChance should use base chance'
            );
            assert.ok(
                funcMatch[0].includes('SIGMA_SPAWN_CHANCE_PER_WAVE'),
                'getSigmaSpawnChance should use per-wave chance'
            );
            assert.ok(
                funcMatch[0].includes('SIGMA_MAX_SPAWN_CHANCE'),
                'getSigmaSpawnChance should cap at max chance'
            );
            assert.ok(
                funcMatch[0].includes('Math.min'),
                'getSigmaSpawnChance should use Math.min to cap'
            );
        }
    });

    test('spawnEnemy checks sigma cap', () => {
        const gameContent = readFile('js/game.js');

        assert.ok(
            gameContent.includes('SIGMA_MAX_PER_WAVE'),
            'spawnEnemy should check SIGMA_MAX_PER_WAVE'
        );
        assert.ok(
            gameContent.includes('sigmaSpawnedThisWave'),
            'spawnEnemy should use sigmaSpawnedThisWave'
        );
    });

    test('spawnEnemy increments sigma counter', () => {
        const gameContent = readFile('js/game.js');

        assert.ok(
            gameContent.includes('gameState.sigmaSpawnedThisWave++'),
            'spawnEnemy should increment sigmaSpawnedThisWave when spawning sigma'
        );
    });

    test('spawnWave resets sigma counter', () => {
        const gameContent = readFile('js/game.js');

        const funcMatch = gameContent.match(/export function spawnWave[\s\S]*?^}/m);
        if (funcMatch) {
            assert.ok(
                funcMatch[0].includes('sigmaSpawnedThisWave = 0'),
                'spawnWave should reset sigmaSpawnedThisWave'
            );
        }
    });
});
